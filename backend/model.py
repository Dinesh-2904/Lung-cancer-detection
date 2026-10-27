"""
=============================================================
  LungXAI — Model Loader (model.py)
=============================================================
"""

import os
import torch
import torch.nn as nn
from torchvision import models
from config import MODEL_PATH, NUM_CLASSES, DEVICE


def get_device() -> torch.device:
    """Return the appropriate compute device."""
    if DEVICE == "auto":
        return torch.device("cuda" if torch.cuda.is_available() else "cpu")
    return torch.device(DEVICE)


def build_inceptionv3(num_classes: int, state_dict_keys: list) -> nn.Module:
    """
    Build an InceptionV3 model whose head matches the saved checkpoint.

    Detects automatically whether:
      - aux_logits were included or excluded during training
      - fc layer is nn.Linear or nn.Sequential
    """
    # Detect whether AuxLogits were present when the model was trained
    has_aux = any(k.startswith("AuxLogits.") for k in state_dict_keys)
    model = models.inception_v3(weights=None, aux_logits=has_aux)

    # Determine the fc head format from the checkpoint keys
    fc_keys = [k for k in state_dict_keys if k.startswith("fc.")]
    has_sequential = any("." in k[3:] for k in fc_keys)   # e.g. 'fc.1.weight'

    if has_sequential:
        # Find the sub-index that holds 'weight' (the Linear layer)
        linear_idx = None
        for k in fc_keys:
            parts = k.split(".")
            if len(parts) == 3 and parts[2] == "weight":   # fc.N.weight
                linear_idx = int(parts[1])
                break

        # Build a Sequential that puts a Linear at that index
        # (common pattern: nn.Sequential(nn.Dropout(p), nn.Linear(2048, n_cls)))
        layers: list[nn.Module] = []
        for i in range(linear_idx + 1):
            if i == linear_idx:
                layers.append(nn.Linear(model.fc.in_features, num_classes))
            else:
                layers.append(nn.Dropout(p=0.5))
        model.fc = nn.Sequential(*layers)
    else:
        # Plain Linear head
        model.fc = nn.Linear(model.fc.in_features, num_classes)

    # Fix auxiliary classifier head (only if present in checkpoint)
    if has_aux and model.AuxLogits is not None:
        aux_in = model.AuxLogits.fc.in_features
        model.AuxLogits.fc = nn.Linear(aux_in, num_classes)

    return model


def load_model(model_path: str = MODEL_PATH) -> tuple[nn.Module, torch.device]:
    """
    Load the trained InceptionV3 model from a .pth file.

    Returns:
        model: loaded model in eval mode
        device: device used for inference

    Raises:
        FileNotFoundError: if the .pth file is not found
        RuntimeError: if the weights cannot be loaded
    """
    device = get_device()

    if not os.path.exists(model_path):
        raise FileNotFoundError(
            f"Model file not found at '{model_path}'. "
            f"Please place your trained InceptionV3 weights at: {model_path}"
        )

    try:
        checkpoint = torch.load(model_path, map_location=device, weights_only=False)

        # Support checkpoints saved as full dict or raw state_dict
        if isinstance(checkpoint, dict):
            if "model_state_dict" in checkpoint:
                state_dict = checkpoint["model_state_dict"]
            elif "state_dict" in checkpoint:
                state_dict = checkpoint["state_dict"]
            else:
                state_dict = checkpoint       # The dict IS the state_dict
        else:
            state_dict = checkpoint           # OrderedDict / raw state_dict

        # Strip 'module.' prefix (DataParallel)
        cleaned = {k.replace("module.", ""): v for k, v in state_dict.items()}

        # Build model whose head matches the checkpoint
        model = build_inceptionv3(
            num_classes=NUM_CLASSES,
            state_dict_keys=list(cleaned.keys()),
        )

        model.load_state_dict(cleaned, strict=True)

    except FileNotFoundError:
        raise
    except Exception as e:
        raise RuntimeError(f"Failed to load model weights: {e}")

    model.eval()
    model.to(device)

    print(f"[LungXAI] Model loaded OK from '{model_path}' on {device}")
    return model, device
