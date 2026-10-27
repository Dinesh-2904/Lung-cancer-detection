"""
=============================================================
  LungXAI — FastAPI Backend (main.py)
=============================================================

  Start the server:
      uvicorn main:app --reload --port 8000

  API Endpoints:
      POST /predict   — Upload CT scan, get prediction + Grad-CAM
      GET  /health    — Health check
      GET  /classes   — List class names
=============================================================
"""

import logging
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# ------------------------------------------------------------------
# Optional PyTorch import — backend can still start without it
# and return a clear 503 rather than crashing with ImportError
# ------------------------------------------------------------------
try:
    import torch
    import torch.nn as nn
    _TORCH_AVAILABLE = True
except ImportError:
    _TORCH_AVAILABLE = False

from config import (
    ALLOWED_EXTENSIONS,
    ALLOWED_MIME_TYPES,
    CLASS_NAMES,
    MAX_UPLOAD_SIZE_MB,
    MODEL_PATH,
)

# ------------------------------------------------------------------
# Logging
# ------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s — %(message)s",
)
logger = logging.getLogger("LungXAI")

# ------------------------------------------------------------------
# Global model state (loaded once at startup)
# ------------------------------------------------------------------
_model = None
_device = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load the model at startup; cleanup on shutdown."""
    global _model, _device

    if not _TORCH_AVAILABLE:
        logger.error(
            "PyTorch is not installed. Run: pip install torch torchvision\n"
            "Backend running WITHOUT a model — /predict will return 503."
        )
        yield
        return

    logger.info("Loading InceptionV3 model…")
    try:
        from model import load_model
        _model, _device = load_model(MODEL_PATH)
        logger.info(f"Model ready on device: {_device}")
    except FileNotFoundError as e:
        logger.error(str(e))
        logger.warning(
            "Backend running WITHOUT a loaded model. "
            "Place your .pth file at the configured MODEL_PATH and restart."
        )
    except Exception as e:
        logger.error(f"Model loading failed: {e}", exc_info=True)

    yield
    logger.info("Shutting down LungXAI backend.")


# ------------------------------------------------------------------
# FastAPI app
# ------------------------------------------------------------------
app = FastAPI(
    title="LungXAI — Lung Cancer Detection API",
    description=(
        "REST API for CT scan classification using InceptionV3 "
        "with Grad-CAM explainability."
    ),
    version="1.0.0",
    lifespan=lifespan,
)

# Allow requests from the React frontend (dev + prod)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ------------------------------------------------------------------
# Utility helpers
# ------------------------------------------------------------------

def validate_upload(file: UploadFile, raw_bytes: bytes) -> None:
    """Validate extension, MIME type, and file size."""
    filename = file.filename or ""
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type '.{ext}'. Please upload a JPG, JPEG, or PNG image.",
        )

    content_type = (file.content_type or "").split(";")[0].strip().lower()
    if content_type and content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=415,
            detail=f"Unsupported media type '{content_type}'. Upload a JPEG or PNG image.",
        )

    max_bytes = MAX_UPLOAD_SIZE_MB * 1024 * 1024
    if len(raw_bytes) > max_bytes:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Maximum allowed size is {MAX_UPLOAD_SIZE_MB} MB.",
        )


# ------------------------------------------------------------------
# Routes
# ------------------------------------------------------------------

@app.get("/health", tags=["Utility"])
async def health():
    """Health check — reports model load status and PyTorch availability."""
    return {
        "status": "ok",
        "torch_available": _TORCH_AVAILABLE,
        "model_loaded": _model is not None,
        "device": str(_device) if _device else "N/A",
        "classes": CLASS_NAMES,
    }


@app.get("/classes", tags=["Utility"])
async def get_classes():
    """Return the list of classification class names."""
    return {"classes": CLASS_NAMES}


@app.post("/predict", tags=["Inference"])
async def predict(file: UploadFile = File(...)):
    """
    Classify a lung CT scan image and return Grad-CAM explanation.

    - **file**: CT scan image (JPG/JPEG/PNG)

    Returns:
    - `predicted_class`: top predicted cancer class
    - `confidence`: probability of predicted class (0–1)
    - `probabilities`: all 4 class probabilities
    - `original_image`: base64-encoded PNG of the original CT scan
    - `gradcam_heatmap`: base64-encoded Grad-CAM heatmap (jet colormap)
    - `gradcam_overlay`: base64-encoded Grad-CAM overlay on original image
    """
    if not _TORCH_AVAILABLE:
        raise HTTPException(
            status_code=503,
            detail=(
                "PyTorch is not installed on the server. "
                "Run: pip install torch torchvision"
            ),
        )

    if _model is None:
        raise HTTPException(
            status_code=503,
            detail=(
                "Model is currently unavailable. "
                "Place your .pth file at backend/models/inceptionv3_lung_cancer.pth "
                "and restart the server."
            ),
        )

    raw_bytes = await file.read()

    if not raw_bytes:
        raise HTTPException(status_code=400, detail="No file selected or empty file received.")

    validate_upload(file, raw_bytes)

    try:
        from inference import run_inference
        result = run_inference(
            file_bytes=raw_bytes,
            model=_model,
            device=_device,
        )
        logger.info(
            f"Inference complete — class: {result['predicted_class']}, "
            f"confidence: {result['confidence']:.4f}"
        )
        return JSONResponse(content=result)

    except ValueError as e:
        raise HTTPException(
            status_code=422,
            detail=f"Unable to process this image. Please upload a valid CT scan. ({e})",
        )
    except RuntimeError as e:
        logger.error(f"Inference error: {e}")
        raise HTTPException(
            status_code=500,
            detail="An error occurred during model inference. Please try again.",
        )
    except Exception as e:
        logger.exception(f"Unexpected error: {e}")
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred. Please try again later.",
        )
