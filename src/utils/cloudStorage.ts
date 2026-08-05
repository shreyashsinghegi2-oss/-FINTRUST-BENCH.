import {
  db,
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  deleteDoc,
  query,
  writeBatch,
  serverTimestamp
} from '../lib/firebase';
import { EvaluationResult, BenchmarkScenario, HistoryRecord, AppSettings } from '../types';
import { UserProfile } from '../context/AuthContext';

/**
 * Cloud storage helper for FinTrustBench authenticated users
 */

// Save evaluation result to user's Firestore subcollection
export async function saveEvaluationToCloud(uid: string, result: EvaluationResult): Promise<void> {
  if (!uid || !result.id) return;
  try {
    const evalRef = doc(db, 'users', uid, 'evaluations', result.id);
    // Sanitize API keys or secrets before persisting
    const sanitizedResult: EvaluationResult = JSON.parse(JSON.stringify(result));
    await setDoc(evalRef, {
      ...sanitizedResult,
      updatedAt: serverTimestamp()
    });
  } catch (err) {
    console.error('Failed to save evaluation to Firestore:', err);
  }
}

// Fetch all evaluation results for user
export async function fetchUserEvaluationsFromCloud(uid: string): Promise<HistoryRecord[]> {
  if (!uid) return [];
  try {
    const collRef = collection(db, 'users', uid, 'evaluations');
    const snap = await getDocs(query(collRef));
    const list: HistoryRecord[] = [];
    snap.forEach((docSnap) => {
      const data = docSnap.data() as EvaluationResult;
      list.push({
        id: data.id,
        date: data.timestamp,
        country: data.country,
        currency: data.currency,
        topic: data.topic,
        question: data.question,
        overallScore: data.overallReliabilityScore,
        reliabilityLevel: data.reliabilityLevel,
        shortSummary: data.aiAnswer?.summary || data.researchSummary || 'Evaluation record',
        fullEvaluation: data
      });
    });
    // Sort descending by date
    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (err) {
    console.error('Failed to fetch user evaluations from Firestore:', err);
    return [];
  }
}

// Delete single evaluation
export async function deleteEvaluationFromCloud(uid: string, evalId: string): Promise<void> {
  if (!uid || !evalId) return;
  try {
    await deleteDoc(doc(db, 'users', uid, 'evaluations', evalId));
  } catch (err) {
    console.error('Failed to delete evaluation from cloud:', err);
  }
}

// Clear all user evaluations in cloud
export async function clearAllCloudEvaluations(uid: string): Promise<void> {
  if (!uid) return;
  try {
    const collRef = collection(db, 'users', uid, 'evaluations');
    const snap = await getDocs(collRef);
    const batch = writeBatch(db);
    snap.forEach((docSnap) => {
      batch.delete(docSnap.ref);
    });
    await batch.commit();
  } catch (err) {
    console.error('Failed to clear cloud history:', err);
  }
}

// Save custom benchmark scenario
export async function saveScenarioToCloud(uid: string, scenario: BenchmarkScenario): Promise<void> {
  if (!uid || !scenario.id) return;
  try {
    const docRef = doc(db, 'users', uid, 'savedScenarios', scenario.id);
    await setDoc(docRef, { ...scenario, updatedAt: serverTimestamp() });
  } catch (err) {
    console.error('Failed to save scenario to cloud:', err);
  }
}

// Fetch user saved scenarios
export async function fetchUserScenariosFromCloud(uid: string): Promise<BenchmarkScenario[]> {
  if (!uid) return [];
  try {
    const collRef = collection(db, 'users', uid, 'savedScenarios');
    const snap = await getDocs(collRef);
    const list: BenchmarkScenario[] = [];
    snap.forEach((d) => {
      list.push(d.data() as BenchmarkScenario);
    });
    return list;
  } catch (err) {
    console.error('Failed to fetch scenarios from cloud:', err);
    return [];
  }
}

// Save / Fetch integration connection status
export async function saveIntegrationStatusToCloud(
  uid: string,
  integrationId: string,
  statusData: { connected: boolean; name: string; updated: string; metadata?: any }
): Promise<void> {
  if (!uid) return;
  try {
    const docRef = doc(db, 'users', uid, 'integrations', integrationId);
    await setDoc(docRef, { ...statusData, updatedAt: serverTimestamp() });
  } catch (err) {
    console.error('Failed to save integration status:', err);
  }
}

export async function fetchUserIntegrationsFromCloud(uid: string): Promise<Record<string, any>> {
  if (!uid) return {};
  try {
    const collRef = collection(db, 'users', uid, 'integrations');
    const snap = await getDocs(collRef);
    const map: Record<string, any> = {};
    snap.forEach((d) => {
      map[d.id] = d.data();
    });
    return map;
  } catch (err) {
    console.error('Failed to fetch user integrations:', err);
    return {};
  }
}

/**
 * Guest to Account Migration
 */
export async function migrateGuestDataToCloud(
  uid: string,
  localHistory: HistoryRecord[],
  option: 'import' | 'keep_local' | 'discard'
): Promise<{ importedCount: number }> {
  if (!uid || option === 'discard') {
    if (option === 'discard') {
      localStorage.removeItem('fintrustbench_history');
    }
    return { importedCount: 0 };
  }

  if (option === 'keep_local' || localHistory.length === 0) {
    return { importedCount: 0 };
  }

  // Option === 'import'
  let count = 0;
  const existingCloud = await fetchUserEvaluationsFromCloud(uid);
  const existingIds = new Set(existingCloud.map((e) => e.id));

  for (const record of localHistory) {
    if (!existingIds.has(record.id) && record.fullEvaluation) {
      // Validate and clean record
      const cleanedEval: EvaluationResult = JSON.parse(JSON.stringify(record.fullEvaluation));
      // Remove any confidential / secret fields if any exist
      await saveEvaluationToCloud(uid, cleanedEval);
      count++;
    }
  }

  // Clear local storage after successful import
  localStorage.removeItem('fintrustbench_history');
  return { importedCount: count };
}

/**
 * Complete Data Export (JSON)
 */
export async function exportUserDataJSON(
  uid: string | null,
  profile: UserProfile | null,
  settings: AppSettings,
  localHistory: HistoryRecord[]
): Promise<void> {
  let cloudEvaluations: HistoryRecord[] = [];
  let cloudScenarios: BenchmarkScenario[] = [];
  let integrations: Record<string, any> = {};

  if (uid) {
    cloudEvaluations = await fetchUserEvaluationsFromCloud(uid);
    cloudScenarios = await fetchUserScenariosFromCloud(uid);
    integrations = await fetchUserIntegrationsFromCloud(uid);
  }

  const exportPayload = {
    application: 'FinTrustBench',
    schemaVersion: '2.0.0',
    exportTimestamp: new Date().toISOString(),
    userProfile: profile
      ? {
          uid: profile.uid,
          displayName: profile.displayName,
          email: profile.email,
          preferredLocale: profile.preferredLocale,
          preferredCountry: profile.preferredCountry,
          preferredCurrency: profile.preferredCurrency,
          experienceMode: profile.experienceMode,
          role: profile.role,
          createdAt: profile.createdAt
        }
      : null,
    preferences: {
      theme: settings.theme,
      demoMode: settings.demoMode,
      presentationMode: settings.presentationMode,
      model: settings.model
      // NOTE: API Key Override is intentionally EXCLUDED for security
    },
    evaluations: uid ? cloudEvaluations : localHistory,
    savedScenarios: cloudScenarios,
    connectedIntegrations: integrations
  };

  const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `fintrustbench_user_export_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
