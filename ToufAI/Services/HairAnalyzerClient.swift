swift
//
//  HairAnalyzerClient.swift
//  ToufAI
//
//  Created by Your Name on Date.
//

import UIKit

class HairAnalyzerClient {

    // TODO: Replace with your actual Cloud Run API base URL
    private let apiBaseURL = "https://your-cloud-run-url.a.run.app"
    private let analyzeHairEndpoint = "/analyze_hair"

    enum HairAnalysisError: Error {
        case invalidURL
        case requestFailed(Error)
        case invalidResponse
        case decodingError(Error)
    }

    struct HairAnalysisResult: Decodable {
        let Bald: Float
        let Receding_Hairline: Float
        let Gray_Hair: Float
    }

    func uploadImageForHairAnalysis(_ image: UIImage, completion: @escaping (Result<HairAnalysisResult, HairAnalysisError>) -> Void) {

        guard let url = URL(string: apiBaseURL)?.appendingPathComponent(analyzeHairEndpoint) else {
            completion(.failure(.invalidURL))
            return
        }

        var request = URLRequest(url: url)
        request.httpMethod = "POST"

        let boundary = UUID().uuidString
        request.setValue("multipart/form-data; boundary=\(boundary)", forHTTPHeaderField: "Content-Type")

        let httpBody = NSMutableData()

        // Add image data
        if let imageData = image.jpegData(compressionQuality: 0.8) {
            httpBody.append("--\(boundary)\r\n".data(using: .utf8)!)
            httpBody.append("Content-Disposition: form-data; name=\"image\"; filename=\"photo.jpg\"\r\n".data(using: .utf8)!)
            httpBody.append("Content-Type: image/jpeg\r\n\r\n".data(using: .utf8)!)
            httpBody.append(imageData)
            httpBody.append("\r\n".data(using: .utf8)!)
        } else {
            // Handle image conversion error if needed
            completion(.failure(.invalidResponse)) // Or a more specific error
            return
        }

        httpBody.append("--\(boundary)--\r\n".data(using: .utf8)!)

        request.httpBody = httpBody as Data

        let task = URLSession.shared.dataTask(with: request) { data, response, error in
            if let error = error {
                completion(.failure(.requestFailed(error)))
                return
            }

            guard let httpResponse = response as? HTTPURLResponse, (200...299).contains(httpResponse.statusCode) else {
                completion(.failure(.invalidResponse))
                return
            }

            guard let data = data else {
                completion(.failure(.invalidResponse))
                return
            }

            do {
                let decoder = JSONDecoder()
                let result = try decoder.decode(HairAnalysisResult.self, from: data)
                completion(.success(result))
            } catch {
                completion(.failure(.decodingError(error)))
            }
        }

        task.resume()
    }
}