# backend/hair_attributes.py
import torch
from transformers import ResNetForImageClassification
from PIL import Image
import io

class HairAttributeDetector:
    def __init__(self):
        # Load the pretrained ResNet10 model
        self.model = ResNetForImageClassification.from_pretrained("convergedmachine/vcl-face-understanding")
        self.model.eval()  # Set model to evaluation mode

        # Define the class labels based on the model's output
        # You might need to verify the exact order and names from the model's documentation
        self.class_labels = [
            "Bald",
            "Receding_Hairline",
            "Gray_Hair"
            # Add other potential labels from the model if needed, but focus on these for now
        ]

    def analyze_image(self, image_bytes: bytes):
        """
        Analyzes an image for hair attributes.

        Args:
            image_bytes: The image data as bytes.

        Returns:
            A dictionary with attribute names and their probabilities.
        """
        try:
            # Open the image from bytes
            image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

            # Preprocess the image (resize, normalize, etc.) if required by the model
            # The ResNet model from transformers typically handles some preprocessing internally,
            # but you might need to add specific transformations depending on the model's training.
            # For simplicity, we'll rely on the model's default preprocessing for now.
            # A more robust implementation would include explicit transformations.

            # Assuming the model expects a tensor input
            from torchvision import transforms
            preprocess = transforms.Compose([
                transforms.Resize(256),
                transforms.CenterCrop(224),
                transforms.ToTensor(),
                transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
            ])
            input_tensor = preprocess(image)
            input_batch = input_tensor.unsqueeze(0) # Create a mini-batch as expected by the model

            # Move the input batch to the appropriate device (CPU or GPU)
            device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
            input_batch = input_batch.to(device)
            self.model.to(device)

            # Run inference
            with torch.no_grad():
                outputs = self.model(input_batch)
                probabilities = torch.nn.functional.softmax(outputs.logits, dim=1)[0]

            # Map probabilities to class labels
            results = {}
            for i, label in enumerate(self.class_labels):
                 if i < len(probabilities): # Ensure index is within bounds
                     results[label] = probabilities[i].item()


            return results

        except Exception as e:
            print(f"Error during image analysis: {e}")
            return {"error": str(e)}

if __name__ == '__main__':
    # Example usage (for testing)
    # You would replace this with actual image loading logic
    try:
        # Create a dummy image
        dummy_image = Image.new('RGB', (60, 30), color = 'red')
        byte_arr = io.BytesIO()
        dummy_image.save(byte_arr, format='PNG')
        dummy_image_bytes = byte_arr.getvalue()

        detector = HairAttributeDetector()
        analysis_results = detector.analyze_image(dummy_image_bytes)
        print("Analysis Results:", analysis_results)

    except ImportError as e:
        print(f"Missing required library: {e}. Please install them using pip install -r requirements.txt")
    except Exception as e:
        print(f"An error occurred during example usage: {e}")
