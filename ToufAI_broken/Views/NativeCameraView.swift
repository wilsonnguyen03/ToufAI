swift
//
//  NativeCameraView.swift
//  ToufAI
//
//  Created by Your Name on Date.
//

import UIKit
import AVFoundation

class NativeCameraView: UIView {

    private var captureSession: AVCaptureSession?
    private var photoOutput: AVCapturePhotoOutput?
    private var previewLayer: AVCaptureVideoPreviewLayer?

    // Reference to the event emitter to send results back to React Native
    @objc var eventEmitter: CameraViewManager?
    private var hairSegmentationManager: HairSegmentationManager?
    private var hairAnalyzerClient: HairAnalyzerClient?

    // Private property to hold the completion handler for photo capture
    private var photoCaptureCompletionHandler: ((UIImage?, Error?) -> Void)?

    override init(frame: CGRect) {
        super.init(frame: frame)
        setupCamera()
    }

    required init?(coder: NSCoder) {
        super.init(coder: coder)
        setupCamera()
    }

    private func setupCamera() {
        captureSession = AVCaptureSession()
        self.hairSegmentationManager = HairSegmentationManager() // Initialize the segmentation manager
        self.hairAnalyzerClient = HairAnalyzerClient() // Initialize the hair analyzer client
        guard let captureSession = captureSession else { return }

        // Configure input device (back camera)
        guard let videoDevice = AVCaptureDevice.default(.builtInWideAngleCamera, for: .video, position: .back) else {
            print("Failed to get video device.")
            return
        }

        guard let videoInput = try? AVCaptureDeviceInput(device: videoDevice) else {
            print("Failed to create video input.")
            return
        }

        if captureSession.canAddInput(videoInput) {
            captureSession.addInput(videoInput)
        } else {
            print("Could not add video input to the session.")
            return
        }

        // Configure photo output
        photoOutput = AVCapturePhotoOutput()
        guard let photoOutput = photoOutput else { return }

        if captureSession.canAddOutput(photoOutput) {
            captureSession.addOutput(photoOutput)
            // Configure photo settings if needed (e.g., flash modes)
            photoOutput.setPreparedPhotoSettingsArray([AVCapturePhotoSettings(format: [AVVideoCodecKey: AVVideoCodecType.jpeg])], completionHandler: nil)
        } else {
            print("Could not add photo output to the session.")
            return
        }

        // Configure preview layer
        previewLayer = AVCaptureVideoPreviewLayer(session: captureSession)
        guard let previewLayer = previewLayer else { return }

        previewLayer.videoGravity = .resizeAspectFill
        previewLayer.frame = bounds
        layer.addSublayer(previewLayer)

        // Start the session on a background queue
        DispatchQueue.global(qos: .userInitiated).async {
            captureSession.startRunning()
        }
    }

    override func layoutSubviews() {
        super.layoutSubviews()
        previewLayer?.frame = bounds
    }

    /// Method to capture a photo and provide it via a completion handler.
    func takePhoto(completion: @escaping (UIImage?, Error?) -> Void) {
        guard let photoOutput = photoOutput else {
            completion(nil, NSError(domain: "NativeCameraView", code: 1001, userInfo: [NSLocalizedDescriptionKey: "Photo output is not available."]))            return
        }
        
        let photoSettings = AVCapturePhotoSettings()        // Configure specific settings if needed (e.g., flashMode, isHighResolutionPhotoEnabled)
        
        // Capture photo asynchronously        photoOutput.capturePhoto(with: photoSettings, delegate: self)
        
        // Store the completion handler to be called in the delegate method        self.photoCaptureCompletionHandler = completion
    }
    
    // Stop the camera session when the view is removed
    deinit {
        captureSession?.stopRunning()
    }
}

// MARK: - Image Analysis and Quality Checks
extension NativeCameraView {

    /// Placeholder for image clarity check.
    private func isImageClear(_ image: UIImage) -> Bool {
        // TODO: Implement actual image clarity/sharpness detection.
        // This could involve analyzing pixel variance, edge detection, or using a dedicated library.
        print("Performing placeholder image clarity check.")
        return true // Assume clear for now
    }

    /// Placeholder for face detection.
    private func hasFace(_ image: UIImage) -> Bool {
        // TODO: Integrate ML Kit Face Detection or another face detection library.
        // Analyze the image to check for the presence of a face.
        print("Performing placeholder face detection.")
        return true // Assume face is present for now
    }

    /// Determines if the segmentation mask indicates significant hair presence.
    private func hasSignificantHair(_ maskImage: UIImage) -> Bool {
        // Analyze the mask image (UIImage) to count the number of white/hair pixels.
        // If the count exceeds a certain threshold, consider it significant hair.
        guard let pixelData = maskImage.cgImage?.dataProvider?.data else {
            print("Failed to get pixel data from mask image.")
            return false
        }
        let data: UnsafePointer<UInt8> = CFDataGetBytePtr(pixelData)
        let bytesPerRow = maskImage.cgImage!.bytesPerRow
        let height = maskImage.cgImage!.height
        let width = maskImage.cgImage!.width

        var hairPixelCount = 0
        let threshold: UInt8 = 100 // Consider pixels with value > threshold as hair

        // Assuming the mask is a grayscale image or has a single channel indicating hair
        // Adjust this loop based on the actual pixel format of your mask image
        for y in 0..<height {
            for x in 0..<width {
                let pixelIndex = (bytesPerRow * y) + x // Adjust for multi-channel images
                 // Check the value of the hair channel (assuming grayscale or first channel)
                if data[pixelIndex] > threshold {
                    hairPixelCount += 1
                }
            }
        }

        let totalPixels = width * height
        let hairPercentage = Double(hairPixelCount) / Double(totalPixels)
        let significantHairThreshold = 0.05 // Adjust threshold (e.g., 5% of pixels as hair)
        print("Hair pixel percentage: \(hairPercentage * 100)%")
        return hairPercentage > significantHairThreshold
    }
}

// MARK: - AVCapturePhotoCaptureDelegate
extension NativeCameraView: AVCapturePhotoCaptureDelegate {
    func photoOutput(_ output: AVCapturePhotoOutput, didFinishProcessingPhoto photo: AVCapturePhoto, error: Error?) {        
        if let error = error {
            print("Error capturing photo: \(error.localizedDescription)")
            photoCaptureCompletionHandler?(nil, error)
 self.eventEmitter?.sendEvent(withName: "onCameraResult", body: ["status": "error", "message": "Photo capture failed: \(error.localizedDescription)"])
            return
        }

        guard let imageData = photo.fileDataRepresentation(),
              let capturedImage = UIImage(data: imageData) else {            
            let error = NSError(domain: "NativeCameraView", code: 1002, userInfo: [NSLocalizedDescriptionKey: "Failed to get image data from photo."])
            print(error.localizedDescription)
            photoCaptureCompletionHandler?(nil, error)
 self.eventEmitter?.sendEvent(withName: "onCameraResult", body: ["status": "error", "message": "Failed to get image data from photo."])
            return        
        }

        // Perform image quality and content checks
        let isClear = isImageClear(capturedImage)
        let faceDetected = hasFace(capturedImage)

        // Perform hair segmentation
        guard let hairSegmentationManager = hairSegmentationManager else {
            print("HairSegmentationManager is not initialized.")
            let error = NSError(domain: "NativeCameraView", code: 1003, userInfo: [NSLocalizedDescriptionKey: "HairSegmentationManager is not initialized."])
 self.photoCaptureCompletionHandler?(nil, error)
 self.eventEmitter?.sendEvent(withName: "onCameraResult", body: ["status": "error", "message": "Segmentation manager not initialized."])
 self.photoCaptureCompletionHandler = nil
            return
        }

        guard let hairMask = hairSegmentationManager.segmentHair(image: capturedImage) else {
            print("Hair segmentation failed.")
            let error = NSError(domain: "NativeCameraView", code: 1004, userInfo: [NSLocalizedDescriptionKey: "Hair segmentation failed."])
            photoCaptureCompletionHandler?(nil, error)
 self.eventEmitter?.sendEvent(withName: "onCameraResult", body: ["status": "error", "message": "Hair segmentation failed."])
 self.photoCaptureCompletionHandler = nil
            return
        }

        let significantHairPresent = hasSignificantHair(hairMask)

        if isClear && faceDetected && significantHairPresent {
            print("Image is clear, has face, and significant hair. Proceeding with analysis.")

            // Call HairAnalyzerClient for attribute analysis
            guard let hairAnalyzerClient = self.hairAnalyzerClient else {
                print("HairAnalyzerClient is not initialized.")
                let error = NSError(domain: "NativeCameraView", code: 1006, userInfo: [NSLocalizedDescriptionKey: "HairAnalyzerClient is not initialized."])
 self.photoCaptureCompletionHandler?(nil, error)
 self.eventEmitter?.sendEvent(withName: "onCameraResult", body: ["status": "error", "message": "Analyzer client not initialized."])
 self.photoCaptureCompletionHandler = nil
                return
            }

            // Convert UIImage to Data for the HairAnalyzerClient
            guard let imageDataForAnalysis = capturedImage.jpegData(compressionQuality: 0.8) else {
                 let error = NSError(domain: "NativeCameraView", code: 1007, userInfo: [NSLocalizedDescriptionKey: "Failed to convert UIImage to Data for analysis."])
                self.photoCaptureCompletionHandler?(nil, error)
 self.eventEmitter?.sendEvent(withName: "onCameraResult", body: ["status": "error", "message": "Failed to prepare image for analysis."])
 self.photoCaptureCompletionHandler = nil
                return
            }

            // Call the analyze_image method on the HairAnalyzerClient
            hairAnalyzerClient.analyze_image(image_bytes: imageDataForAnalysis) { result in
                DispatchQueue.main.async { // Ensure UI updates or event emission happen on the main thread
                    switch result {
                    case .success(let analysisResult):
                        print("Hair analysis successful:", analysisResult)
                        // Convert segmentation mask to base64 or save to temporary file to pass to JS
                        let maskBase64 = hairMask.pngData()?.base64EncodedString() // Example: Base64 (can be large)

                        self.eventEmitter?.sendEvent(withName: "onCameraResult", body: [
                            "status": "success",
                            "message": "Photo analyzed successfully.",
                            "analysisResult": [
                                "Bald": analysisResult.Bald,
                                "Receding_Hairline": analysisResult.Receding_Hairline,
                                "Gray_Hair": analysisResult.Gray_Hair
                            ],
                            "segmentationMaskBase64": maskBase64 ?? "" // Include the mask data
                        ])
                        self.photoCaptureCompletionHandler?(capturedImage, nil) // Optionally return the original image

                    case .failure(let error):
                        print("Hair analysis failed: \(error)")
                        self.eventEmitter?.sendEvent(withName: "onCameraResult", body: ["status": "error", "message": "Hair analysis failed: \(error.localizedDescription)"])
                        self.photoCaptureCompletionHandler?(nil, error)
                    }
                     self.photoCaptureCompletionHandler = nil // Clear the handler after analysis completion
                }
            }

        } else {
            print("Photo rejected. Clear: \(isClear), Face: \(faceDetected), Hair: \(significantHairPresent)")
            let rejectionReason = "Photo rejected. \(isClear ? "" : "Image unclear. ")\(faceDetected ? "" : "No face detected. ")\(significantHairPresent ? "" : "No significant hair detected.")".trimmingCharacters(in: .whitespacesAndNewlines)
            let error = NSError(domain: "NativeCameraView", code: 1005, userInfo: [NSLocalizedDescriptionKey: rejectionReason])
            photoCaptureCompletionHandler?(nil, error)
 self.eventEmitter?.sendEvent(withName: "onCameraResult", body: ["status": "rejected", "message": rejectionReason])
 self.photoCaptureCompletionHandler = nil // Clear the handler
        }
    }
}