"""
=============================================================
  LungXAI — Grad-CAM Implementation (gradcam.py)
=============================================================

  Real Grad-CAM computed from the actual model's gradients
  and feature-map activations. No fake heatmaps.
"""

import cv2
import numpy as np
import torch
import torch.nn as nn
from PIL import Image

from config import GRADCAM_TARGET_LAYER, IMAGE_SIZE


class GradCAM:
    """
    Gradient-weighted Class Activation Mapping (Grad-CAM).

    Reference: Selvaraju et al., "Grad-CAM: Visual Explanations from Deep Networks
    via Gradient-based Localization", ICCV 2017.
    """

    def __init__(self, model: nn.Module, target_layer_name: str = GRADCAM_TARGET_LAYER):
        self.model = model
        self.target_layer_name = target_layer_name

        self._gradients: torch.Tensor | None = None
        self._activations: torch.Tensor | None = None
        self._hooks: list = []

        self._register_hooks()

    # ------------------------------------------------------------------
    # Hook registration
    # ------------------------------------------------------------------

    def _get_target_layer(self) -> nn.Module:
        """Resolve the target layer by name (supports nested attributes)."""
        layer = self.model
        for part in self.target_layer_name.split("."):
            if not hasattr(layer, part):
                raise AttributeError(
                    f"Model has no attribute '{part}' in path '{self.target_layer_name}'. "
                    f"Check GRADCAM_TARGET_LAYER in config.py."
                )
            layer = getattr(layer, part)
        return layer

    def _register_hooks(self) -> None:
        target_layer = self._get_target_layer()

        def forward_hook(module, input, output):
            # For InceptionV3 Mixed_7c, output is a Tensor [B, C, H, W]
            self._activations = output.detach()

        def backward_hook(module, grad_input, grad_output):
            self._gradients = grad_output[0].detach()

        self._hooks.append(target_layer.register_forward_hook(forward_hook))
        self._hooks.append(target_layer.register_full_backward_hook(backward_hook))

    def remove_hooks(self) -> None:
        for h in self._hooks:
            h.remove()
        self._hooks.clear()

    # ------------------------------------------------------------------
    # Core Grad-CAM computation
    # ------------------------------------------------------------------

    def generate(
        self,
        input_tensor: torch.Tensor,   # [1, 3, H, W]
        target_class: int | None = None,
        device: torch.device = torch.device("cpu"),
    ) -> np.ndarray:
        """
        Compute the Grad-CAM heatmap.

        Args:
            input_tensor: preprocessed image tensor [1, 3, H, W]
            target_class: class index to explain (None → argmax)
            device: inference device

        Returns:
            cam: numpy array [H, W] with values in [0, 1]
        """
        input_tensor = input_tensor.to(device).requires_grad_(True)

        # Forward pass
        self.model.eval()
        output = self.model(input_tensor)

        # InceptionV3 returns (logits, aux_logits) during training;
        # in eval mode it returns just logits.
        if isinstance(output, tuple):
            output = output[0]

        if target_class is None:
            target_class = output.argmax(dim=1).item()

        # Zero all existing gradients
        self.model.zero_grad()

        # Backward pass for the target class
        one_hot = torch.zeros_like(output)
        one_hot[0, target_class] = 1.0
        output.backward(gradient=one_hot, retain_graph=False)

        # Pool gradients over spatial dimensions → shape [C]
        gradients = self._gradients      # [1, C, H', W']
        activations = self._activations  # [1, C, H', W']

        if gradients is None or activations is None:
            raise RuntimeError(
                "Grad-CAM hooks did not capture gradients/activations. "
                "Ensure GRADCAM_TARGET_LAYER is correct."
            )

        weights = gradients.mean(dim=(2, 3), keepdim=True)  # [1, C, 1, 1]
        cam = (weights * activations).sum(dim=1).squeeze(0)  # [H', W']

        # ReLU — keep only positive contributions
        cam = torch.relu(cam).cpu().numpy()

        # Normalize to [0, 1]
        cam_min, cam_max = cam.min(), cam.max()
        if cam_max - cam_min > 1e-8:
            cam = (cam - cam_min) / (cam_max - cam_min)
        else:
            cam = np.zeros_like(cam)

        return cam  # [H', W'] in [0, 1]


# ------------------------------------------------------------------
# Heatmap overlay utilities
# ------------------------------------------------------------------

def cam_to_heatmap(cam: np.ndarray, size: tuple[int, int]) -> np.ndarray:
    """
    Convert a Grad-CAM array to a color heatmap (BGR → RGB).

    Args:
        cam:  [H', W'] float array in [0, 1]
        size: (width, height) of the output image

    Returns:
        heatmap: [H, W, 3] uint8 RGB image
    """
    cam_uint8 = (cam * 255).astype(np.uint8)
    cam_resized = cv2.resize(cam_uint8, size, interpolation=cv2.INTER_LINEAR)
    heatmap_bgr = cv2.applyColorMap(cam_resized, cv2.COLORMAP_JET)
    heatmap_rgb = cv2.cvtColor(heatmap_bgr, cv2.COLOR_BGR2RGB)
    return heatmap_rgb


def overlay_heatmap(
    original_rgb: np.ndarray,
    heatmap_rgb: np.ndarray,
    alpha: float = 0.45,
) -> np.ndarray:
    """
    Blend the Grad-CAM heatmap over the original image.

    Args:
        original_rgb: [H, W, 3] uint8 RGB
        heatmap_rgb:  [H, W, 3] uint8 RGB Grad-CAM heatmap
        alpha:        heatmap opacity (0 = invisible, 1 = fully opaque)

    Returns:
        overlay: [H, W, 3] uint8 blended image
    """
    original_f = original_rgb.astype(np.float32)
    heatmap_f  = heatmap_rgb.astype(np.float32)
    blended = (1 - alpha) * original_f + alpha * heatmap_f
    return np.clip(blended, 0, 255).astype(np.uint8)


def generate_gradcam_images(
    model: nn.Module,
    input_tensor: torch.Tensor,
    original_image: Image.Image,
    target_class: int,
    device: torch.device,
) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    """
    Full Grad-CAM pipeline: returns original, heatmap, and overlay as numpy RGB arrays.

    Returns:
        original_np:  [H, W, 3] uint8 — original image as numpy
        heatmap_np:   [H, W, 3] uint8 — Grad-CAM heatmap (jet colormap)
        overlay_np:   [H, W, 3] uint8 — heatmap overlaid on original
    """
    orig_w, orig_h = original_image.size

    # Compute Grad-CAM
    gradcam = GradCAM(model, target_layer_name=GRADCAM_TARGET_LAYER)
    try:
        cam = gradcam.generate(input_tensor, target_class=target_class, device=device)
    finally:
        gradcam.remove_hooks()

    original_np = np.array(original_image.convert("RGB"), dtype=np.uint8)
    heatmap_np  = cam_to_heatmap(cam, size=(orig_w, orig_h))
    overlay_np  = overlay_heatmap(original_np, heatmap_np, alpha=0.45)

    return original_np, heatmap_np, overlay_np
