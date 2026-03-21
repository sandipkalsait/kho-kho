/**
 * kho-kho Pipeline API Service
 * 
 * Bridges the React Native app to the 5-step Django OCR pipeline:
 *  - POST /api/upload/              → uploadImage()
 *  - GET  /api/review/:id/          → getReview()
 *  - PUT  /api/review/:id/update/   → submitReview()
 *  - POST /api/submit/:id/          → confirmSubmit()
 *  - GET  /api/audit/:id/           → getAuditLog()
 */

import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';

/** Base URL: 10.0.2.2 for Android emulator, 127.0.0.1 for iOS/web */
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
  missingFields: string[];
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
}

// ─── Step 1: Upload image ─────────────────────────────────────────────────────

/**
 * Primary upload function.
 * Reads the local file:// URI as base64 via expo-file-system (works on
 * iOS + Android with Expo's fetch polyfill) and sends it as a JSON body.
 * Falls back to multipart FormData on web.
 */
export async function uploadImage(
  imageUri: string,
  metadata?: { userId?: string; documentType?: string }
): Promise<UploadResponse> {
  // Web: use multipart FormData (fetch can read blob/file URLs on web)
  if (Platform.OS === 'web') {
    console.log(`[Web] Uploading ${imageUri}...`);
    const formData = new FormData();
    
    try {
      // On web, we must convert the URI/Blob URL to an actual Blob before appending
      const response = await fetch(imageUri);
      const blob = await response.blob();
      
      const filename = imageUri.split('/').pop()?.split('?')[0] ?? 'upload.jpg';
      formData.append('image', blob, filename);
      
      if (metadata?.userId)       formData.append('userId', metadata.userId);
      if (metadata?.documentType) formData.append('documentType', metadata.documentType);
      
      const res = await fetch(`${API_BASE}upload/`, { method: 'POST', body: formData });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? `Upload failed: ${res.status}`);
      return json as UploadResponse;
    } catch (err: any) {
      console.error("[Web] Upload Error:", err);
      throw new Error(`Web upload failed: ${err.message}`);
    }
  }

  // iOS / Android: read the local file as base64 first, then POST as JSON.
  // This is necessary because expo/fetch (the Expo fetch polyfill) cannot
  // read a file:// URI embedded in a FormData object.
  let base64: string;
  try {
    console.log(`[Base64] Reading ${imageUri}...`);
    base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: 'base64' as any,
    });
    console.log(`[Base64] Read successful. Length: ${base64.length}`);
    if (!base64) throw new Error("File read returned empty string.");
  } catch (err: any) {
    throw new Error(`Could not read image file: ${err.message}`);
  }

  return uploadImageBase64(base64, metadata);
}

/** Upload using a base64 string (primary path for iOS/Android). */
export async function uploadImageBase64(
  base64: string,
  metadata?: { userId?: string; documentType?: string }
): Promise<UploadResponse> {
  const url = `${API_BASE}upload/`;
  console.log(`[API] POST to ${url}`);
  
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      image_base64: base64,
      userId: metadata?.userId,
      documentType: metadata?.documentType,
    }),
  });

  const json = await res.json();
  if (!res.ok) {
    console.error(`[API] Upload failed (${res.status}):`, json);
    throw new Error(json.error ?? `Upload failed: ${res.status}`);
  }
  return json as UploadResponse;
}

// ─── Step 3: Fetch extracted data ─────────────────────────────────────────────

export async function getReview(requestId: string): Promise<ReviewResponse> {
  const res = await fetch(`${API_BASE}review/${requestId}/`);
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? `Review fetch failed: ${res.status}`);
  return json as ReviewResponse;
}

/** Poll until status reaches EXTRACTED / FAILED (max 30 s) */
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
  throw new Error('OCR processing timed out after 30 s.');
}

// ─── Step 4: Submit human review edits ────────────────────────────────────────

export async function submitReview(
  requestId: string,
  payload: ReviewUpdatePayload
): Promise<{ status: string; changedFields: Record<string, any> }> {
  const res = await fetch(`${API_BASE}review/${requestId}/update/`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? `Review update failed: ${res.status}`);
  return json;
}

// ─── Step 5: Final confirmation ───────────────────────────────────────────────

export async function confirmSubmit(
  requestId: string,
  reviewerId?: string
): Promise<SubmitResponse> {
  const res = await fetch(`${API_BASE}submit/${requestId}/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reviewerId: reviewerId ?? 'app-user' }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? `Submission failed (${res.status})`);
  return json as SubmitResponse;
}

// ─── Audit log ────────────────────────────────────────────────────────────────

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
