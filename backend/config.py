"""
=============================================================
  LungXAI — Configuration
=============================================================

  Edit this file to match your training configuration EXACTLY.
  All values here must be identical to what was used during training.

=============================================================
"""

# ----------------------------------------------------------
# 1. MODEL FILE PATH
#    Place your trained .pth file at: backend/models/inceptionv3_lung_cancer.pth
#    or change MODEL_PATH to point to its actual location.
# ----------------------------------------------------------
MODEL_PATH = "models/InceptionV3_best.pth"

# ----------------------------------------------------------
# 2. CLASSIFICATION CLASSES
#    Must match the order used during training (0, 1, 2, 3).
# ----------------------------------------------------------
CLASS_NAMES = [
    "Adenocarcinoma",
    "Large Cell Carcinoma",
    "Squamous Cell Carcinoma",
    "Normal",
]

NUM_CLASSES = len(CLASS_NAMES)

# ----------------------------------------------------------
# 3. IMAGE PREPROCESSING
#    Must be IDENTICAL to training-time preprocessing.
#    InceptionV3 standard: resize to 299x299, ImageNet normalization.
# ----------------------------------------------------------
IMAGE_SIZE = 299  # InceptionV3 default input size

# ImageNet normalization (standard for transfer learning)
NORMALIZATION_MEAN = [0.485, 0.456, 0.406]
NORMALIZATION_STD  = [0.229, 0.224, 0.225]

# ----------------------------------------------------------
# 4. UPLOAD LIMITS
# ----------------------------------------------------------
MAX_UPLOAD_SIZE_MB = 20               # Maximum image size in MB
ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png"}
ALLOWED_MIME_TYPES = {"image/jpeg", "image/png", "image/jpg"}

# ----------------------------------------------------------
# 5. DEVICE
#    "cuda" if GPU available, else "cpu" (auto-detected in model.py)
# ----------------------------------------------------------
DEVICE = "auto"   # "auto" | "cuda" | "cpu"

# ----------------------------------------------------------
# 6. GRAD-CAM TARGET LAYER
#    For InceptionV3, the last convolutional block before global avg pool.
#    Typical target: model.Mixed_7c
#    Change this ONLY if your model architecture is different.
# ----------------------------------------------------------
GRADCAM_TARGET_LAYER = "Mixed_7c"
