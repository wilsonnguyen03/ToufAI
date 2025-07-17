# backend/hair_attributes.py
import torch
from transformers import ResNetForImageClassification
from PIL import Image
import io

class HairAttributeDetector:
    def __init__(self):
        # Load the pretrained ResNet model for face understanding
        # This model is capable of detecting various facial attributes.
        self.model = ResNetForImageClassification.from_pretrained("convergedmachine/vcl-face-understanding")
        self.model.eval()  # Set the model to evaluation mode

        # The model's config defines the labels it was trained on.
        # We need to find the indices for the specific hair attributes we're interested in.
        self.labels = self.model.config.id2label
        self.hair_attribute_indices = {
            "Bald": -1,
            "Receding_Hairline": -1,
            "Gray_Hair": -1
        }

        # Find the correct index for each of our target attributes
        for i, label in self.labels.items():
            if label == "Bald":
                self.hair_attribute_indices["Bald"] = int(i)
            elif label == "Receding_Hairline":
                self.hair_attribute_indices["Receding_Hairline"] = int(i)
            elif label == "Gray_Hair":
                self.hair_attribute_indices["Gray_Hair"] = int(i)
        
        print("Hair attribute indices loaded:", self.hair_attribute_indices)


    def analyze_image(self, image_bytes: bytes):
        """
        Analyzes an image for specific hair attributes using the loaded model.
        """
        try:
            image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

            # Preprocess the image to match the model's expected input format
            from torchvision import transforms
            preprocess = transforms.Compose([
                transforms.Resize(256),
                transforms.CenterCrop(224),
                transforms.ToTensor(),
                transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
            ])
            
            input_tensor = preprocess(image)
            input_batch = input_tensor.unsqueeze(0) # Create a mini-batch

            # Move tensor to the appropriate device (CPU or GPU)
            device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
            input_batch = input_batch.to(device)
            self.model.to(device)

            # Run inference
            with torch.no_grad():
                outputs = self.model(input_batch)
                # Apply sigmoid to get independent probabilities for each attribute
                probabilities = torch.sigmoid(outputs.logits).squeeze()

            # Extract the probabilities for our specific hair attributes
            results = {}
            for attribute, index in self.hair_attribute_indices.items():
                if index != -1 and index < len(probabilities):
                    results[attribute] = probabilities[index].item()
                else:
                    results[attribute] = 0.0 # Default to 0 if attribute not found in model

            return results

        except Exception as e:
            print(f"Error during image analysis: {e}")
            return {"error": str(e)}

# Create a single instance of the detector to be shared across the app
# This prevents reloading the model on every request.
hair_detector = HairAttributeDetector()
