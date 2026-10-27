"""
=============================================================
  LungXAI — Image Preprocessing (preprocessing.py)
=============================================================

  Preprocessing must be IDENTICAL to training.
  Default: InceptionV3 standard (resize 299x299, ImageNet normalization).
"""

import io
import numpy as np
import torch
from PIL import Image
from torchvision import transforms

from config import IMAGE_SIZE, NORMALIZATION_MEAN, NORMALIZATION_STD


def get_transform() -> transforms.Compose:
    """
    Return the inference transform pipeline.
    Must match training preprocessing exactly.
    """
    return transforms.Compose([
        transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
        transforms.ToTensor(),
        transforms.Normalize(
            mean=NORMALIZATION_MEAN,
            std=NORMALIZATION_STD,
        ),
    ])


def load_image_from_bytes(file_bytes: bytes) -> Image.Image:
    """
    Load an image from raw bytes and convert to RGB.
    Raises ValueError for corrupt or unsupported images.
    """
    try:
        image = Image.open(io.BytesIO(file_bytes)).convert("RGB")
        return image
    except Exception as e:
        raise ValueError(f"Cannot read image: {e}")


def preprocess_image(image: Image.Image) -> torch.Tensor:
    """
    Apply the transform pipeline and add a batch dimension.

    Args:
        image: PIL Image in RGB mode

    Returns:
        Tensor of shape [1, 3, IMAGE_SIZE, IMAGE_SIZE]
    """
    transform = get_transform()
    tensor = transform(image)          # [3, H, W]
    tensor = tensor.unsqueeze(0)       # [1, 3, H, W]
    return tensor


def image_to_numpy(image: Image.Image, target_size: tuple[int, int] | None = None) -> np.ndarray:
    """
    Convert PIL Image to uint8 numpy array, optionally resizing.
    Returns an array of shape [H, W, 3].
    """
    if target_size:
        image = image.resize(target_size, Image.LANCZOS)
    return np.array(image, dtype=np.uint8)
