# ToufAI Changelog

## Version 1.0.0

- **feat**: Initialized the React Native project with Expo.
- **feat**: Implemented a native iOS camera view using AVFoundation.
- **feat**: Integrated on-device hair segmentation using a TFLite model (`HairSegmentationManager`).
- **feat**: Integrated on-device face detection using Google's standalone ML Kit (`NativeCameraView`).
- **feat**: Added image quality checks to the camera capture flow to validate the presence of a face and hair before processing.
- **feat**: Created a React Native Native UI Component (`CameraViewManager`) to bridge the native Swift camera view into the JavaScript application.
- **feat**: Updated the main camera screen (`camera.js`) to use the native camera component and handle success/error events from the native side.
- **feat(config)**: Hardened the `tsconfig.json` and `package.json` files to ensure a stable and predictable build environment.
- **refactor**: Removed the initial backend and sample image testing modules to focus on the core on-device experience.
