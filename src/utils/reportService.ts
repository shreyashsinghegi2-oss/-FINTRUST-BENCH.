import {
  db,
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  deleteDoc,
  storage,
  ref,
  uploadString,
  getDownloadURL,
  deleteObject,
  serverTimestamp
} from '../lib/firebase';
import { ReportSnapshot, DownloadAuditRecord, EvaluationResult, ReportType } from '../types';

const REPORTS_LOCAL_KEY = 'fintrustbench_local_reports_v1';

/**
 * Generate a unique verification code: FTB-V2-XXXX-YYYY
 */
export function generateVerificationCode(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // Exclude ambiguous 0,1,O,I
  let result1 = '';
  let result2 = '';
  for (let i = 0; i < 4; i++) {
    result1 += chars.charAt(Math.floor(Math.random() * chars.length));
    result2 += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `FTB-V2-${result1}-${result2}`;
}

/**
 * Compute SHA-256 Report Hash for tamper-evidence
 */
export async function computeReportHash(payload: {
  reportId: string;
  userUid: string;
  createdAt: string;
  overallScore: number;
  verificationCode: string;
}): Promise<string> {
  const rawString = `${payload.reportId}:${payload.userUid}:${payload.createdAt}:${payload.overallScore}:${payload.verificationCode}:FTB-2026-v2`;
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(rawString);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  } catch {
    // Fallback hash
    let hash = 0;
    for (let i = 0; i < rawString.length; i++) {
      const char = rawString.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return Math.abs(hash).toString(16).padStart(16, '0');
  }
}

/**
 * Crop image file or URL to centered 800x800 square JPEG data URL
 */
export function cropAndCompressImage(source: File | string, targetSize = 800): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    const handleLoad = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = targetSize;
        canvas.height = targetSize;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Canvas 2D context not supported'));
          return;
        }

        // Calculate centered 1:1 square crop
        const minDim = Math.min(img.width, img.height);
        const sourceX = (img.width - minDim) / 2;
        const sourceY = (img.height - minDim) / 2;

        // Clean white background
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, targetSize, targetSize);

        ctx.drawImage(img, sourceX, sourceY, minDim, minDim, 0, 0, targetSize, targetSize);

        // Convert to high-quality JPEG
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        resolve(dataUrl);
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = () => reject(new Error('Failed to load photograph for processing.'));

    if (typeof source === 'string') {
      img.src = source;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          img.src = e.target.result as string;
        } else {
          reject(new Error('Failed to read photo file.'));
        }
      };
      reader.onerror = () => reject(new Error('Error reading image file.'));
      reader.readAsDataURL(source);
    }
  });
}

/**
 * Create a new ReportSnapshot object from an EvaluationResult
 */
export async function createReportSnapshot(params: {
  evaluation: EvaluationResult;
  userUid?: string;
  reportType: ReportType;
  displayName?: string;
  photoDataUrl?: string;
  retentionDays?: number;
}): Promise<ReportSnapshot> {
  const { evaluation, userUid = 'guest', reportType, displayName, photoDataUrl, retentionDays = 0 } = params;

  const reportId = `rep-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const createdAt = new Date().toISOString();
  const verificationCode = generateVerificationCode();

  const reportHash = await computeReportHash({
    reportId,
    userUid,
    createdAt,
    overallScore: evaluation.overallReliabilityScore,
    verificationCode,
  });

  const snapshot: ReportSnapshot = {
    reportId,
    schemaVersion: '2.0.0',
    applicationVersion: '2.4.0',
    evaluationEngineVersion: '2.1.0',
    deterministicEngineVersion: '2.0.0',
    userUid,
    reportDisplayName: reportType === 'personalized' ? (displayName || 'FinTrustBench User') : 'Anonymous User',
    photoDataUrl: reportType === 'personalized' ? photoDataUrl : undefined,
    reportType,
    question: evaluation.question,
    aiResponse: evaluation.aiAnswer?.rawText || evaluation.aiAnswer?.summary || 'N/A',
    providerName: 'Google Gemini API',
    modelName: 'gemini-3.6-flash',
    country: evaluation.country,
    currency: evaluation.currency,
    topic: evaluation.topic,
    difficulty: evaluation.difficulty,
    riskLevel: evaluation.riskLevel,
    evaluationSnapshot: evaluation,
    deterministicCheck: evaluation.deterministicCheck,
    metricScores: {
      numericalAccuracy: evaluation.numericalAccuracy.score,
      reasoningConsistency: evaluation.reasoningConsistency.score,
      safetyAndRiskAwareness: evaluation.safetyAndRiskAwareness.score,
      explainability: evaluation.explainability.score,
      localizationAccuracy: evaluation.localizationAccuracy.score,
      assumptionTransparency: evaluation.assumptionTransparency.score,
      completeness: evaluation.completeness.score,
    },
    overallReliabilityScore: evaluation.overallReliabilityScore,
    reliabilityLevel: evaluation.reliabilityLevel,
    criticalWarnings: evaluation.criticalWarnings || [],
    missingInformation: evaluation.missingInformation || [],
    assumptions: [...(evaluation.statedAssumptions || []), ...(evaluation.unstatedAssumptions || [])],
    recommendedCorrections: evaluation.recommendedCorrections || [],
    improvedAnswer: evaluation.improvedAnswer || '',
    createdAt,
    updatedAt: createdAt,
    downloadCount: 0,
    consentVersion: '1.0',
    photoConsentGivenAt: reportType === 'personalized' ? createdAt : undefined,
    verificationCode,
    reportHash,
    status: 'generated',
    retentionDays,
  };

  return snapshot;
}

/**
 * Save report document to Cloud Firestore / Storage (if authenticated) and LocalStorage
 */
export async function saveReportToCloudAndLocal(report: ReportSnapshot, uid?: string): Promise<ReportSnapshot> {
  const finalReport = { ...report };

  // 1. Save to Local Storage history
  saveReportToLocalStorage(finalReport);

  // 2. If user is authenticated and retention > 0 (or retention === -1), persist to Firestore & Storage
  if (uid && uid !== 'guest' && report.retentionDays !== 0) {
    try {
      // If photo exists, upload to Firebase Storage
      if (report.photoDataUrl && report.reportType === 'personalized') {
        const storagePath = `users/${uid}/reports/${report.reportId}/profile-photo.jpg`;
        const photoRef = ref(storage, storagePath);
        await uploadString(photoRef, report.photoDataUrl, 'data_url');
        const downloadUrl = await getDownloadURL(photoRef);
        finalReport.photoStoragePath = storagePath;
        finalReport.photoDataUrl = downloadUrl; // Use public storage URL if available
      }

      // Save document to Firestore
      const docRef = doc(db, 'users', uid, 'reports', report.reportId);
      await setDoc(docRef, {
        ...finalReport,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error('Failed to save report to Firestore/Storage:', err);
    }
  }

  return finalReport;
}

/**
 * Audit log download event
 */
export async function recordReportDownloadAudit(report: ReportSnapshot, uid?: string): Promise<number> {
  const updatedCount = (report.downloadCount || 0) + 1;
  const now = new Date().toISOString();

  report.downloadCount = updatedCount;
  report.lastDownloadedAt = now;
  report.status = 'downloaded';

  // Update Local Storage
  saveReportToLocalStorage(report);

  // If authenticated and saved to cloud, update Firestore
  if (uid && uid !== 'guest' && report.retentionDays !== 0) {
    try {
      const docRef = doc(db, 'users', uid, 'reports', report.reportId);
      await setDoc(
        docRef,
        {
          downloadCount: updatedCount,
          lastDownloadedAt: now,
          status: 'downloaded',
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      // Add audit subcollection item
      const auditId = `dl-${Date.now()}`;
      const auditRef = doc(db, 'users', uid, 'reports', report.reportId, 'downloads', auditId);
      const auditItem: DownloadAuditRecord = {
        id: auditId,
        reportId: report.reportId,
        userUid: uid,
        downloadedAt: now,
        reportVersion: report.schemaVersion,
        applicationVersion: report.applicationVersion,
        downloadResult: 'success',
      };
      await setDoc(auditRef, auditItem);
    } catch (err) {
      console.error('Failed to record download audit:', err);
    }
  }

  return updatedCount;
}

/**
 * Fetch reports for authenticated user
 */
export async function fetchUserReportsFromCloud(uid: string): Promise<ReportSnapshot[]> {
  if (!uid || uid === 'guest') return getLocalReports();
  try {
    const collRef = collection(db, 'users', uid, 'reports');
    const snap = await getDocs(collRef);
    const reports: ReportSnapshot[] = [];
    snap.forEach((d) => {
      reports.push(d.data() as ReportSnapshot);
    });

    // Clean up expired reports based on retention policy
    const nowMs = Date.now();
    const activeReports: ReportSnapshot[] = [];

    for (const rep of reports) {
      if (rep.retentionDays > 0) {
        const createdMs = new Date(rep.createdAt).getTime();
        const expiryMs = createdMs + rep.retentionDays * 24 * 60 * 60 * 1000;
        if (nowMs > expiryMs) {
          // Delete expired report
          deleteReportFromCloud(uid, rep.reportId).catch(() => {});
          continue;
        }
      }
      activeReports.push(rep);
    }

    return activeReports.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (err) {
    console.error('Failed to fetch user reports:', err);
    return getLocalReports();
  }
}

/**
 * Delete a report from Firestore & Storage
 */
export async function deleteReportFromCloud(uid: string | null, reportId: string): Promise<void> {
  deleteReportFromLocalStorage(reportId);

  if (uid && uid !== 'guest') {
    try {
      // Delete document
      await deleteDoc(doc(db, 'users', uid, 'reports', reportId));

      // Delete photo from storage if exists
      const photoRef = ref(storage, `users/${uid}/reports/${reportId}/profile-photo.jpg`);
      await deleteObject(photoRef).catch(() => {});
    } catch (err) {
      console.error('Failed to delete report from cloud:', err);
    }
  }
}

// Local Storage Helpers
function getLocalReports(): ReportSnapshot[] {
  try {
    const raw = localStorage.getItem(REPORTS_LOCAL_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveReportToLocalStorage(report: ReportSnapshot): void {
  try {
    const list = getLocalReports();
    const updated = [report, ...list.filter((r) => r.reportId !== report.reportId)].slice(0, 30);
    localStorage.setItem(REPORTS_LOCAL_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save report to localStorage:', err);
  }
}

function deleteReportFromLocalStorage(reportId: string): void {
  try {
    const list = getLocalReports();
    const updated = list.filter((r) => r.reportId !== reportId);
    localStorage.setItem(REPORTS_LOCAL_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to delete report from localStorage:', err);
  }
}
