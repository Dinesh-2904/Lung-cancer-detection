# LungXAI — Lung Cancer Detection with Explainable AI

> **Academic Deep Learning Project**  
> AI-powered 4-class lung CT scan classification using InceptionV3 + Grad-CAM XAI

---

## ⚠️ Medical Disclaimer

This system is for **academic and educational purposes only**.  
It is **NOT** a substitute for professional medical diagnosis.  
Always consult a qualified physician for any medical decisions.

---

## Project Overview

LungXAI is a full-stack web application that:

1. Accepts a lung CT scan image upload
2. Runs inference through a trained **InceptionV3** model (PyTorch)
3. Produces a **4-class prediction** with confidence scores
4. Generates a **Grad-CAM heatmap** to explain which regions influenced the prediction
5. Displays everything in a clean, professional medical AI dashboard

### Classes

| Index | Class Name |
|-------|-----------|
| 0 | Adenocarcinoma |
| 1 | Large Cell Carcinoma |
| 2 | Squamous Cell Carcinoma |
| 3 | Normal |

---

## Project Structure

```
canser-detected/
├── backend/
│   ├── main.py             # FastAPI app + /predict endpoint
│   ├── model.py            # InceptionV3 model loader
│   ├── preprocessing.py    # Image preprocessing pipeline
│   ├── gradcam.py          # Real Grad-CAM implementation
│   ├── inference.py        # Full inference pipeline
│   ├── config.py           # ← All configurable settings HERE
│   ├── requirements.txt
│   └── models/
│       └── inceptionv3_lung_cancer.pth  ← Place your .pth file here
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── UploadPanel.tsx
│   │   │   ├── ResultPanel.tsx
│   │   │   └── ConfidenceBar.tsx
│   │   ├── pages/
│   │   │   ├── HomePage.tsx
│   │   │   ├── DetectionPage.tsx
│   │   │   ├── HowItWorksPage.tsx
│   │   │   ├── ModelPage.tsx
│   │   │   └── AboutPage.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
│
└── README.md
```

---

## Setup Instructions

### Step 1 — Place Your Trained Model

Copy your trained `.pth` file to:

```
backend/models/inceptionv3_lung_cancer.pth
```

> **The model file name and path are configured in `backend/config.py`.**  
> You can change `MODEL_PATH` if your file is named differently.

---

### Step 2 — Configure `backend/config.py`

Open `backend/config.py` and verify these match your training setup **exactly**:

```python
MODEL_PATH         = "models/inceptionv3_lung_cancer.pth"
CLASS_NAMES        = ["Adenocarcinoma", "Large Cell Carcinoma", "Squamous Cell Carcinoma", "Normal"]
IMAGE_SIZE         = 299          # InceptionV3 default
NORMALIZATION_MEAN = [0.485, 0.456, 0.406]   # ImageNet mean
NORMALIZATION_STD  = [0.229, 0.224, 0.225]   # ImageNet std
GRADCAM_TARGET_LAYER = "Mixed_7c"             # Last conv block
```

> ⚠️ If your training used different normalization values or image size, update them here.

---

### Step 3 — Start the Backend

```bash
cd backend

# Create a virtual environment (recommended)
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn main:app --reload --port 8000
```

The backend will be available at: `http://localhost:8000`  
API docs: `http://localhost:8000/docs`

---

### Step 4 — Start the Frontend

```bash
cd frontend

# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```

The frontend will be available at: `http://localhost:5173`

> The Vite dev server proxies `/api` → `http://localhost:8000`, so no CORS issues.

---

## API Reference

### `POST /predict`

Upload a CT scan image and receive a classification + Grad-CAM explanation.

**Request:** `multipart/form-data`  
**Field:** `file` — JPEG or PNG image

**Response:**
```json
{
  "predicted_class": "Adenocarcinoma",
  "confidence": 0.8241,
  "probabilities": {
    "Adenocarcinoma": 0.8241,
    "Large Cell Carcinoma": 0.0572,
    "Squamous Cell Carcinoma": 0.0811,
    "Normal": 0.0376
  },
  "original_image": "<base64-encoded PNG>",
  "gradcam_heatmap": "<base64-encoded PNG>",
  "gradcam_overlay": "<base64-encoded PNG>"
}
```

### `GET /health`

Check server and model status.

### `GET /classes`

Returns the list of class names.

---

## Model Architecture Notes

### If your checkpoint was saved differently

`model.py` supports multiple checkpoint formats:

```python
# Format 1: raw state_dict (most common)
torch.save(model.state_dict(), "model.pth")

# Format 2: full checkpoint dict
torch.save({"model_state_dict": model.state_dict(), "epoch": n}, "model.pth")

# Format 3: DataParallel (keys start with "module.")
# → automatically stripped
```

### If your final FC layer is different

Edit `build_inceptionv3()` in `model.py` to match your training head:

```python
# Example: if you used a Sequential head
model.fc = nn.Sequential(
    nn.Dropout(0.5),
    nn.Linear(2048, NUM_CLASSES)
)
```

### If your Grad-CAM target layer is different

Change `GRADCAM_TARGET_LAYER` in `config.py`:

```python
GRADCAM_TARGET_LAYER = "Mixed_7c"     # Default for InceptionV3
# GRADCAM_TARGET_LAYER = "Mixed_7b"  # Earlier layer
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `FileNotFoundError: Model file not found` | Place `.pth` at `backend/models/inceptionv3_lung_cancer.pth` |
| `RuntimeError: size mismatch` | Your FC layer in `model.py` doesn't match training. Edit `build_inceptionv3()`. |
| `503 Model is currently unavailable` | Backend started without the model file. Add the file and restart uvicorn. |
| Frontend shows "backend unavailable" | Make sure backend is running on port 8000 |
| Grad-CAM all zeros / blank | Check that `GRADCAM_TARGET_LAYER` exists in your model with `print(model)` |

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| ML Model | PyTorch + Torchvision InceptionV3 |
| XAI | Grad-CAM (gradient hooks on Mixed_7c) |
| Image Processing | OpenCV, Pillow |
| Backend API | FastAPI + Uvicorn |
| Frontend | React + TypeScript + Tailwind CSS |
| Build Tool | Vite |

---

*LungXAI — Academic Deep Learning Project*  
*AI-assisted analysis only. Not a substitute for professional medical diagnosis.*
