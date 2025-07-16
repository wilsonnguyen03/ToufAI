```yaml
---
language: en
license: mit
library_name: pytorch
tags:
- face-recognition
- self-supervised-learning
- contrastive-learning
datasets:
- YFCC-CelebA
- CelebA
---
```
# VCL: Variational Contrastive Learning for Face Understanding

VCL is a robust self-supervised learning method designed specifically for face understanding tasks, combining variational contrastive learning with beta-divergence to effectively handle noisy and unlabeled datasets[1].

## Model Details

### Model Description

**Developed by:** Mehmet Can Yavuz and Berrin Yanikoglu
**Model type:** Self-Supervised Variational Contrastive Learning with Applications to Face Understanding
**Language(s):** Python
**License:** MIT
**Model:** ResNet10t

## Uses

### Direct Use

The model is designed for:
- Face attribute recognition
- Face verification tasks
- Multi-label classification problems
- Learning from noisy and unlabeled datasets

## Model Architecture

The architecture consists of three main components:
- Feature extraction backbone (ResNet10t or VGG11bn)
- Gaussian sampling head for distribution learning
- Contrastive learning framework with augmentations

## Training Details

### Training Data

The model was pretrained on the YFCC-CelebA dataset and you can fine-tune on CelebA dataset.

### Training Procedure 

#### Training Hyperparameters

**Training regime:**
- Optimizer: AdamW
- Learning rate: 1e-3
- Weight decay: 0.01
- Batch size: 128
- Temperature: 0.07
- Beta: 0.005

## Evaluation

### Results

Performance on CelebA test set with different pretraining approaches:

| Setting | ResNet10t (1%) | VGG11bn (1%) | ResNet10t (10%) | VGG11bn (10%) |
|---------|----------------|---------------|-----------------|---------------|
| VCL | 0.5836 | 0.5719 | 0.6848 | 0.6796 |
| VCL (beta) | 0.5998 | 0.5958 | 0.7098 | 0.6998 |

## How to Get Started with the Model

```python
# Installation
git clone https://github.com/convergingmachine/VCL
cd VCL
pip install -r requirements.txt

# Training
python train_beta.py


## Citation

```bibtex
@INPROCEEDINGS{10582001,
  author={Yavuz, Mehmet Can and Yanikoglu, Berrin},
  booktitle={2024 IEEE 18th International Conference on Automatic Face and Gesture Recognition (FG)}, 
  title={Self-Supervised Variational Contrastive Learning with Applications to Face Understanding}, 
  year={2024},
  pages={1-9},
  doi={10.1109/FG59268.2024.10582001}}
```

## Model Card Contact

For questions about this model, please open an issue in the GitHub repository.