/**
 * kho-kho Pipeline API Service (Validation Optional Mode)
 *
 * Changes:
 * - Removed mandatory validation dependency
 * - skipValidation = true by default across pipeline
 * - Review + Submit both support skipValidation
 */

import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';

/** Base URL */
export const API_BASE =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:8000/api/'
    : 'http://127.0.0.1:8000/api/';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UploadResponse {
  requestId: string;
  status: 'PROCESSING' | 'EXTRACTED' | 'FAILED';
  processingTimeMs?: number;
}

export interface ReviewResponse {
  requestId: string;
  status: 'PROCESSING' | 'EXTRACTED' | 'REVIEWED' | 'COMPLETED' | 'FAILED';
  extractedData: Record<string, any>;
  confidenceScore: number;

  /** ⚠️ Still returned, but no longer blocking */
  missingFields: string[];

  finalData?: Record<string, any>;
  currentData?: Record<string, any>;
  rawOcrData?: Record<string, any>;
  sourceImageUrl?: string;
}

export interface ReviewUpdatePayload {
  reviewerId?: string;
  updatedData: Record<string, any>;
  comments?: string;
}

export interface SubmitResponse {
  requestId: string;
  status: string;
  finalPayload: Record<string, any>;
  message: string;
  matchId?: string | number;
  sourceImageUrl?: string;
}

// ─── Step 1: Upload image ─────────────────────────────────────────────────────

export async function uploadImage(
  imageUri: string,
  metadata?: { userId?: string; documentType?: string }
): Promise<UploadResponse> {

  if (Platform.OS === 'web') {
    const formData = new FormData();

    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();

      const filename = imageUri.split('/').pop()?.split('?')[0] ?? 'upload.jpg';
      formData.append('image', blob, filename);

      if (metadata?.userId) formData.append('userId', metadata.userId);
      if (metadata?.documentType) formData.append('documentType', metadata.documentType);

      const res = await fetch(`${API_BASE}upload/`, {
        method: 'POST',
        body: formData
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? `Upload failed: ${res.status}`);
      return json as UploadResponse;

    } catch (err: any) {
      throw new Error(`Web upload failed: ${err.message}`);
    }
  }

  // Mobile (Base64)
  let base64: string;
  try {
    base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: 'base64' as any,
    });

    if (!base64) throw new Error("Empty file");

  } catch (err: any) {
    throw new Error(`File read failed: ${err.message}`);
  }

  return uploadImageBase64(base64, metadata);
}

// ─── Base64 Upload ────────────────────────────────────────────────────────────

export async function uploadImageBase64(
  base64: string,
  metadata?: { userId?: string; documentType?: string }
): Promise<UploadResponse> {

  const res = await fetch(`${API_BASE}upload/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },

    body: JSON.stringify({
      image_base64: base64,
      userId: metadata?.userId,
      documentType: metadata?.documentType,
    }),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? `Upload failed: ${res.status}`);

  return json as UploadResponse;
}

// ─── Step 3: Fetch extracted data ─────────────────────────────────────────────

export async function getReview(requestId: string): Promise<ReviewResponse> {
  const res = await fetch(`${API_BASE}review/${requestId}/`);
  const json = await res.json();

  if (!res.ok) throw new Error(json.error ?? `Review fetch failed: ${res.status}`);

  return json as ReviewResponse;
}

// ─── Poll OCR ────────────────────────────────────────────────────────────────

export async function pollUntilExtracted(
  requestId: string,
  intervalMs = 1500,
  timeoutMs = 30000
): Promise<ReviewResponse> {

  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    const data = await getReview(requestId);

    if (data.status !== 'PROCESSING') return data;

    await new Promise(r => setTimeout(r, intervalMs));
  }

  throw new Error('OCR timeout (30s)');
}

// ─── Step 4: Submit Review (NO mandatory validation) ──────────────────────────

export async function submitReview(
  requestId: string,
  payload: ReviewUpdatePayload,
  options?: { skipValidation?: boolean }
): Promise<{ status: string; changedFields: Record<string, any> }> {

  const res = await fetch(`${API_BASE}review/${requestId}/update/`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },

    body: JSON.stringify({
      ...payload,

      /** ✅ default TRUE */
      skipValidation: options?.skipValidation ?? true,
    }),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? `Review update failed`);

  return json;
}

// ─── Step 5: Final Submit (NO mandatory validation) ───────────────────────────

export async function confirmSubmit(
  requestId: string,
  reviewerId?: string,
  finalPayload?: Record<string, any>,
  options?: { skipValidation?: boolean }
): Promise<SubmitResponse> {

  const res = await fetch(`${API_BASE}submit/${requestId}/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },

    body: JSON.stringify({
      reviewerId: reviewerId ?? 'app-user',
      finalPayload,

      /** ✅ default TRUE */
      skipValidation: options?.skipValidation ?? true,
    }),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? `Submission failed`);

  return json as SubmitResponse;
}

// ─── Audit Log ───────────────────────────────────────────────────────────────

export async function getAuditLog(requestId: string) {
  const res = await fetch(`${API_BASE}audit/${requestId}/`);
  const json = await res.json();

  if (!res.ok) throw new Error(json.error ?? 'Audit fetch failed');

  return json.auditLogs as Array<{
    id: string;
    user_id: string;
    action_type: string;
    previous_value: Record<string, any>;
    new_value: Record<string, any>;
    created_at: string;
  }>;
}