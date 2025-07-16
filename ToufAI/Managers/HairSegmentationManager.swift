swift
import UIKit
import TensorFlowLiteSwift

class HairSegmentationManager {

    private var interpreter: Interpreter?

    init?() {
        // Attempt to load the model
        guard let modelPath = Bundle.main.path(forResource: "selfie_segmentation", ofType: "tflite") else {
            print("Failed to find the model file selfi_segmentation.tflite")
            return nil
        }
        do {
            interpreter = try Interpreter(modelPath: modelPath)
            // Allocate tensors for the model
            try interpreter?.allocateTensors()
        } catch let error {
            print("Failed to load or allocate model: \(error.localizedDescription)")
            return nil
        }
    }

    /// Runs hair segmentation on a camera frame image.
    /// - Parameter image: The input UIImage from the camera frame.
    /// - Returns: A binary mask UIImage where white pixels represent hair and black pixels represent non-hair, or nil if segmentation fails.
    func segmentHair(image: UIImage) -> UIImage? {
        guard let interpreter = interpreter else {
            print("Interpreter not initialized.")
            return nil
        }

        // Prepare the input image
        guard let pixelBuffer = image.toCVPixelBuffer() else {
            print("Failed to convert UIImage to CVPixelBuffer.")
            return nil
        }

        // You might need to resize the pixel buffer to match the model's input size
        // and potentially normalize the pixel values.
        // Example (assuming model expects 256x256 input, adjust as needed):
        let modelInputWidth = 256
        let modelInputHeight = 256
        guard let resizedPixelBuffer = pixelBuffer.resized(to: CGSize(width: modelInputWidth, height: modelInputHeight)) else {
            print("Failed to resize pixel buffer.")
            return nil
        }

        // Convert the pixel buffer to a Data object that TensorFlow Lite can use
        guard var inputData = resizedPixelBuffer.toData() else {
            print("Failed to convert pixel buffer to Data.")
            return nil
        }

        // Assuming the model expects float input. Adjust if needed.
        // Convert pixel data to float32
        let count = inputData.count / MemoryLayout<UInt8>.stride
        inputData.withUnsafeMutableBytes { (pointer: UnsafeMutableRawBufferPointer) in
            let bytes = pointer.bindMemory(to: UInt8.self)
            let floatBytes = UnsafeMutableBufferPointer<Float32>(start: pointer.bindMemory(to: Float32.self).baseAddress, count: count)
            for i in 0..<count {
                floatBytes[i] = Float32(bytes[i]) / 255.0 // Example normalization
            }
        }


        // Copy the input data to the interpreter's input tensor
        do {
            try interpreter.copy(inputData, toInputTensorAt: 0)
        } catch let error {
            print("Failed to copy input data: \(error.localizedDescription)")
            return nil
        }

        // Run inference
        do {
            try interpreter.invoke()
        } catch let error {
            print("Failed to invoke interpreter: \(error.localizedDescription)")
            return nil
        }

        // Get the output tensor
        do {
            let outputTensor = try interpreter.output(at: 0)
            // The output tensor should contain the segmentation mask probabilities.
            // The shape of the output tensor will depend on the model.
            // For selfie_segmentation, it often has a shape like [1, height, width, 1]
            // or [1, height, width, 2] (for background and foreground).

            // Example: Assuming output shape is [1, height, width, 1] with values representing foreground probability
            let outputSize = outputTensor.shape.dimensions
            guard outputSize.count == 4, outputSize[0] == 1 else {
                print("Unexpected output tensor shape: \(outputSize)")
                return nil
            }

            let maskHeight = outputSize[1]
            let maskWidth = outputSize[2]
            let maskChannelCount = outputSize[3] // Should be 1 for binary mask

            guard maskChannelCount == 1 else {
                 print("Unexpected number of output channels: \(maskChannelCount)")
                 return nil
            }

            // Get the output data
            let outputData = outputTensor.data

            // Process the output data to create a binary mask
            // Assuming output values are probabilities (0.0 to 1.0)
            let threshold: Float32 = 0.5 // Adjust threshold as needed
            var binaryMaskPixelData = [UInt8](repeating: 0, count: maskWidth * maskHeight * 4) // RGBA

            outputData.withUnsafeBytes { (pointer: UnsafeRawBufferPointer) in
                let probabilities = pointer.bindMemory(to: Float32.self)
                for i in 0..<maskWidth * maskHeight {
                    let probability = probabilities[i]
                    let pixelValue: UInt8 = (probability > threshold) ? 255 : 0 // White for hair, black otherwise

                    // Set RGBA values (assuming a grayscale output mask that we convert to RGBA)
                    binaryMaskPixelData[i * 4] = pixelValue     // Red
                    binaryMaskPixelData[i * 4 + 1] = pixelValue // Green
                    binaryMaskPixelData[i * 4 + 2] = pixelValue // Blue
                    binaryMaskPixelData[i * 4 + 3] = 255        // Alpha (fully opaque)
                }
            }

            // Create a UIImage from the binary mask pixel data
            let bytesPerRow = maskWidth * 4
            guard let cfData = CFDataCreate(nil, binaryMaskPixelData, binaryMaskPixelData.count),
                  let provider = CGDataProvider(data: cfData),
                  let cgImage = CGImage(
                    width: maskWidth,
                    height: maskHeight,
                    bitsPerComponent: 8,
                    bitsPerPixel: 32,
                    bytesPerRow: bytesPerRow,
                    space: CGColorSpaceCreateDeviceRGB(),
                    bitmapInfo: CGBitmapInfo(rawValue: CGImageAlphaInfo.premultipliedLast.rawValue),
                    provider: provider,
                    decode: nil,
                    shouldInterpolate: false,
                    intent: .defaultIntent)
            else {
                print("Failed to create CGImage from mask data.")
                return nil
            }

            return UIImage(cgImage: cgImage)

        } catch let error {
            print("Failed to get output tensor: \(error.localizedDescription)")
            return nil
        }
    }
}

// MARK: - Helper extensions for UIImage and CVPixelBuffer

extension UIImage {
    /// Converts a UIImage to a CVPixelBuffer.
    func toCVPixelBuffer() -> CVPixelBuffer? {
        let attributes = [
            kCVPixelBufferCGImageCompatibilityKey: kCFBooleanTrue,
            kCVPixelBufferCGBitmapContextCompatibilityKey: kCFBooleanTrue
        ] as CFDictionary

        var pixelBuffer: CVPixelBuffer?
        let status = CVPixelBufferCreate(
            kCFAllocatorDefault,
            Int(size.width),
            Int(size.height),
            kCVPixelFormatType_32ARGB, // Or kCVPixelFormatType_32BGRA depending on your needs
            attributes,
            &pixelBuffer
        )

        guard status == kCVReturnSuccess, let buffer = pixelBuffer else {
            return nil
        }

        CVPixelBufferLockBaseAddress(buffer, CVPixelBufferLockFlags(rawValue: 0))
        let pixelData = CVPixelBufferGetBaseAddress(buffer)

        let rgbColorSpace = CGColorSpaceCreateDeviceRGB()
        guard let context = CGContext(
            data: pixelData,
            width: Int(size.width),
            height: Int(size.height),
            bitsPerComponent: 8,
            bytesPerRow: CVPixelBufferGetBytesPerRow(buffer),
            space: rgbColorSpace,
            bitmapInfo: CGImageAlphaInfo.noneSkipFirst.rawValue // Or other suitable info
        ) else {
            return nil
        }

        context.translateBy(x: 0, y: size.height)
        context.scaleBy(x: 1.0, y: -1.0)

        UIGraphicsPushContext(context)
        draw(in: CGRect(x: 0, y: 0, width: size.width, height: size.height))
        UIGraphicsPopContext()

        CVPixelBufferUnlockBaseAddress(buffer, CVPixelBufferLockFlags(rawValue: 0))

        return buffer
    }
}

extension CVPixelBuffer {
    /// Resizes a CVPixelBuffer to a new size.
    func resized(to size: CGSize) -> CVPixelBuffer? {
        let width = Int(size.width)
        let height = Int(size.height)
        let pixelFormat = CVPixelBufferGetPixelFormatType(self)
        let baseAddress = CVPixelBufferGetBaseAddress(self)
        let bytesPerRow = CVPixelBufferGetBytesPerRow(self)

        let sourceBuffer = vImage_Buffer(data: baseAddress, height: vImagePixelCount(CVPixelBufferGetHeight(self)), width: vImagePixelCount(CVPixelBufferGetWidth(self)), rowBytes: bytesPerRow)

        var outputBuffer: CVPixelBuffer?
        let status = CVPixelBufferCreate(kCFAllocatorDefault, width, height, pixelFormat, nil, &outputBuffer)
        guard status == kCVReturnSuccess, let resizedBuffer = outputBuffer else {
            return nil
        }

        CVPixelBufferLockBaseAddress(resizedBuffer, CVPixelBufferLockFlags(rawValue: 0))
        let resizedBaseAddress = CVPixelBufferGetBaseAddress(resizedBuffer)
        let resizedBytesPerRow = CVPixelBufferGetBytesPerRow(resizedBuffer)
        var destinationBuffer = vImage_Buffer(data: resizedBaseAddress, height: vImagePixelCount(height), width: vImagePixelCount(width), rowBytes: resizedBytesPerRow)

        let error = vImageScale_ARGB8888(&sourceBuffer, &destinationBuffer, nil, vImage_Flags(0)) // Adjust function based on pixel format
        if error != kvImageNoError {
            CVPixelBufferUnlockBaseAddress(resizedBuffer, CVPixelBufferLockFlags(rawValue: 0))
            print("vImageScale_ARGB8888 failed with error \(error)")
            return nil
        }

        CVPixelBufferUnlockBaseAddress(resizedBuffer, CVPixelBufferLockFlags(rawValue: 0))

        return resizedBuffer
    }

    /// Converts a CVPixelBuffer to a Data object.
    func toData() -> Data? {
        CVPixelBufferLockBaseAddress(self, .readOnly)
        defer { CVPixelBufferUnlockBaseAddress(self, .readOnly) }

        guard let baseAddress = CVPixelBufferGetBaseAddress(self) else {
            return nil
        }

        let width = CVPixelBufferGetWidth(self)
        let height = CVPixelBufferGetHeight(self)
        let bytesPerRow = CVPixelBufferGetBytesPerRow(self)
        let totalBytes = bytesPerRow * height

        return Data(bytes: baseAddress, count: totalBytes)
    }
}

import Accelerate // Required for vImage functions