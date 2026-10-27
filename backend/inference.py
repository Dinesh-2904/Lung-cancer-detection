"""
=============================================================
  LungXAI — Inference Pipeline (inference.py)
=============================================================
"""

import base64
import io
import numpy as np
import torch
import torch.nn as nn
from PIL import Image

from config import CLASS_NAMES
from preprocessing import load_image_from_bytes, preprocess_image
from gradcam import generate_gradcam_images


def numpy_to_base64(img_np: np.ndarray) -> str:
    """Encode a numpy uint8 RGB image as a base64 PNG string."""
    pil_img = Image.fromarray(img_np, mode="RGB")
    buffer = io.BytesIO()
    pil_img.save(buffer, format="PNG")
    buffer.seek(0)
    return base64.b64encode(buffer.read()).decode("utf-8")


def run_inference(
    file_bytes: bytes,
    model: nn.Module,
    device: torch.device,
) -> dict:
    """
    Full inference pipeline:
      1. Load and validate the image
      2. Preprocess
      3. Forward pass through InceptionV3
      4. Softmax → class probabilities
      5. Grad-CAM for the predicted class
      6. Return structured result dict

    Args:
        file_bytes: raw uploaded image bytes
        model:      loaded InceptionV3 model in eval mode
        device:     inference device

    Returns:
        dict matching the /predict response schema
    """
    # ---- 1. Load image --------------------------------------------------
    original_image: Image.Image = load_image_from_bytes(file_bytes)

    # ---- 2. Preprocess --------------------------------------------------
    input_tensor = preprocess_image(original_image).to(device)

    # ---- 3. Forward pass ------------------------------------------------
    model.eval()
    with torch.enable_grad():   # Grad-CAM needs gradients
        output = model(input_tensor)

    # InceptionV3 in eval() mode returns plain tensor, not InceptionOutputs
    if isinstance(output, tuple):
        output = output[0]

    # ---- 4. Probabilities -----------------------------------------------
    probs = torch.softmax(output, dim=1).squeeze(0).tolist()  # list of 4 floats
    predicted_idx = int(np.argmax(probs))
    predicted_class = CLASS_NAMES[predicted_idx]
    confidence = float(probs[predicted_idx])

    probabilities = {
        CLASS_NAMES[i]: round(float(probs[i]), 4)
        for i in range(len(CLASS_NAMES))
    }

    # ---- 5. Grad-CAM ----------------------------------------------------
    original_np, heatmap_np, overlay_np = generate_gradcam_images(
        model=model,
        input_tensor=input_tensor,
        original_image=original_image,
        target_class=predicted_idx,
        device=device,
    )

    # ---- 6. Encode images to base64 -------------------------------------
    original_b64 = numpy_to_base64(original_np)
    heatmap_b64  = numpy_to_base64(heatmap_np)
    overlay_b64  = numpy_to_base64(overlay_np)

    return {
        "predicted_class": predicted_class,
        "confidence": round(confidence, 4),
        "probabilities": probabilities,
        "original_image": original_b64,
        "gradcam_heatmap": heatmap_b64,
        "gradcam_overlay": overlay_b64,
    }
