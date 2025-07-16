swift
//
//  ImageSegmentationModule.swift
//  ToufAI
//
//  Created by Your Name on Date.
//

import Foundation
import React // Make sure you have React Native bridging set up
import UIKit

@objc(ImageSegmentationModule)
class ImageSegmentationModule: NSObject, RCTBridgeModule {

    static func moduleName() -> String! {
        return "ImageSegmentationModule"
    }

    static func requiresMainQueueSetup() -> Bool {
        return true // Or false, depending on whether this module needs to be initialized on the main thread
    }

    @objc
    func testSegmentationWithSampleImage(_ imageName: String) {
        print("Attempting to segment sample image: \(imageName)")

        guard let sampleImage = UIImage(named: "SampleImages/\(imageName)") else {
            print("Error: Failed to load sample image: \(imageName)")
            return
        }

        // Access the HairSegmentationManager. This assumes it's initialized
        // and accessible, perhaps through the AppDelegate or a shared instance.
        // You might need to adjust this access method based on your app's architecture.
        guard let appDelegate = UIApplication.shared.delegate as? AppDelegate,
              let hairSegmentationManager = appDelegate.hairSegmentationManager else {
            print("Error: HairSegmentationManager is not initialized or accessible.")
            return
        }

        DispatchQueue.global(qos: .userInitiated).async {
            if let hairMask = hairSegmentationManager.segmentHair(image: sampleImage) {
                print("Hair segmentation successful for \(imageName). Mask image created.")
                // TODO: Handle the hairMask UIImage.
                // For example, you could pass its data or a reference back to JavaScript,
                // or update a native view directly if you have one managed by this module.
                // If updating UI, ensure you dispatch back to the main queue:
                // DispatchQueue.main.async {
                //     // Update UI elements here
                // }
            } else {
                print("Error: Hair segmentation failed for \(imageName).")
            }
        }
    }

    // To export the method to JavaScript
    @objc
    func constantsToExport() -> [AnyHashable : Any]! {
        return [:] // Export any constants if needed
    }
}

// Required for React Native to recognize this module
// Place this macro outside the class definition
RCT_EXPORT_MODULE()

// To export the method(s)
// RCT_EXPORT_METHOD must be placed after the RCT_EXPORT_MODULE() macro
extension ImageSegmentationModule {
    @objc
    func testSegmentationWithSampleImage(_ imageName: String,
                                          resolver resolve: @escaping RCTPromiseResolveBlock,
                                          rejecter reject: @escaping RCTPromiseRejectBlock) {
        print("Attempting to segment sample image with Promise: \(imageName)")

        guard let sampleImage = UIImage(named: "SampleImages/\(imageName)") else {
            let error = NSError(domain: "ImageSegmentationModule", code: 404, userInfo: [NSLocalizedDescriptionKey: "Failed to load sample image: \(imageName)"])
            print("Error: Failed to load sample image: \(imageName)")
            reject("IMAGE_NOT_FOUND", "Failed to load sample image.", error)
            return
        }

        guard let appDelegate = UIApplication.shared.delegate as? AppDelegate,
              let hairSegmentationManager = appDelegate.hairSegmentationManager else {
            let error = NSError(domain: "ImageSegmentationModule", code: 500, userInfo: [NSLocalizedDescriptionKey: "HairSegmentationManager is not initialized or accessible."])
            print("Error: HairSegmentationManager is not initialized or accessible.")
            reject("MANAGER_NOT_READY", "HairSegmentationManager not ready.", error)
            return
        }

        DispatchQueue.global(qos: .userInitiated).async {
            if let hairMask = hairSegmentationManager.segmentHair(image: sampleImage) {
                 // Convert the UIImage mask to a format that can be passed back to JavaScript.
                 // This often involves converting to a base64 string or saving to a temporary file
                 // and passing the file path.
                 // Example: Converting to base64 (can be memory intensive for large images)
                if let imageData = hairMask.pngData() { // Use pngData() for masks with transparency
                    let base64String = imageData.base64EncodedString()
                    print("Hair segmentation successful for \(imageName). Mask image created.")
                    resolve(["maskImageBase64": base64String]) // Resolve the Promise with the base64 string
                } else {
                     let error = NSError(domain: "ImageSegmentationModule", code: 500, userInfo: [NSLocalizedDescriptionKey: "Failed to convert mask image to data."])
                     print("Error: Failed to convert mask image to data.")
                     reject("IMAGE_CONVERSION_FAILED", "Failed to convert mask image.", error)
                }

            } else {
                let error = NSError(domain: "ImageSegmentationModule", code: 500, userInfo: [NSLocalizedDescriptionKey: "Hair segmentation failed."])
                 print("Error: Hair segmentation failed for \(imageName).")
                reject("SEGMENTATION_FAILED", "Hair segmentation failed.", error)
            }
        }
    }
}
