import torch
from torchvision.models import resnet18  # Use your actual architecture

model = resnet18(num_classes=3)  # Adjust num_classes as needed
# model.load_state_dict(torch.load("your_ckpt_path"))  # Load your weights here
torch.save(model.state_dict(), r"E:\Project ToufAI\Models\vcl-face-understanding\pytorch_model.bin")
