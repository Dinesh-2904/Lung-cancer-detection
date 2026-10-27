// API service for LungXAI backend

const API_BASE = '/api';

export interface PredictionResult {
  predicted_class: string;
  confidence: number;
  probabilities: Record<string, number>;
  original_image: string;
  gradcam_heatmap: string;
  gradcam_overlay: string;
}

export interface HealthStatus {
  status: string;
  model_loaded: boolean;
  device: string;
  classes: string[];
}

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public detail?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let detail = '';
    try {
      const body = await res.json();
      detail = body.detail || body.message || '';
    } catch {
      detail = await res.text().catch(() => '');
    }
    throw new ApiError(
      detail || `Request failed with status ${res.status}`,
      res.status,
      detail
    );
  }
  return res.json() as Promise<T>;
}

export async function predictCTScan(file: File): Promise<PredictionResult> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE}/predict`, {
    method: 'POST',
    body: formData,
  });

  return handleResponse<PredictionResult>(response);
}

export async function getHealth(): Promise<HealthStatus> {
  const response = await fetch(`${API_BASE}/health`);
  return handleResponse<HealthStatus>(response);
}
