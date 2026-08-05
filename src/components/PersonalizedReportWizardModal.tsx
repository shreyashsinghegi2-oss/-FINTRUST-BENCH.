import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Shield,
  User,
  Camera,
  Upload,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Download,
  Lock,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Eye,
  Check,
  Calendar,
  Clock,
  Sparkles,
  HelpCircle,
  FileCheck
} from 'lucide-react';
import { EvaluationResult, ReportSnapshot, ReportType } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  cropAndCompressImage,
  createReportSnapshot,
  saveReportToCloudAndLocal,
  recordReportDownloadAudit
} from '../utils/reportService';
import { generateFinTrustBenchPDF } from '../utils/pdfGenerator';

interface PersonalizedReportWizardModalProps {
  evaluation: EvaluationResult;
  isOpen: boolean;
  onClose: () => void;
  onOpenAuthModal?: () => void;
}

export const PersonalizedReportWizardModal: React.FC<PersonalizedReportWizardModalProps> = ({
  evaluation,
  isOpen,
  onClose,
  onOpenAuthModal,
}) => {
  const { user, profile } = useAuth();

  // Step state (1 to 12)
  const [step, setStep] = useState<number>(1);

  // Form selections
  const [reportType, setReportType] = useState<ReportType>('standard');
  const [displayName, setDisplayName] = useState<string>('');
  const [photoSourceMode, setPhotoSourceMode] = useState<'upload' | 'camera' | 'google'>('upload');
  const [rawPhoto, setRawPhoto] = useState<File | string | null>(null);
  const [processedPhotoUrl, setProcessedPhotoUrl] = useState<string | null>(null);
  const [isProcessingPhoto, setIsProcessingPhoto] = useState<boolean>(false);
  const [photoError, setPhotoError] = useState<string | null>(null);

  // Consent checkboxes
  const [consent1, setConsent1] = useState<boolean>(false);
  const [consent2, setConsent2] = useState<boolean>(false);
  const [consent3, setConsent3] = useState<boolean>(false);

  // Camera state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  // Generated Report state
  const [reportSnapshot, setReportSnapshot] = useState<ReportSnapshot | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  // Retention setting (0 = do not save after download, 30, 90, -1 = keep until deleted)
  const [retentionDays, setRetentionDays] = useState<number>(0);
  const [savedToAccount, setSavedToAccount] = useState<boolean>(false);

  // Initialize display name from profile if available
  useEffect(() => {
    if (profile?.displayName) {
      setDisplayName(profile.displayName);
    } else if (user?.displayName) {
      setDisplayName(user.displayName);
    }
  }, [profile, user]);

  // Clean up camera on unmount or step change
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  if (!isOpen) return null;

  const startCamera = async () => {
    setPhotoError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 800 }, height: { ideal: 800 } },
      });
      setCameraStream(stream);
      setIsCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      setPhotoError('Unable to access camera. Please check permissions or upload a photograph.');
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
  };

  const captureCameraSelfie = async () => {
    if (!videoRef.current) return;
    try {
      setIsProcessingPhoto(true);
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 800;
      canvas.height = videoRef.current.videoHeight || 800;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        const cropped = await cropAndCompressImage(dataUrl, 800);
        setProcessedPhotoUrl(cropped);
        stopCamera();
      }
    } catch (err: any) {
      setPhotoError('Failed to capture photograph. Please try again.');
    } finally {
      setIsProcessingPhoto(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhotoError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size max 5MB
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError('File size exceeds 5MB limit. Please select a smaller photo.');
      return;
    }

    // Check format
    const validFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validFormats.includes(file.type.toLowerCase())) {
      setPhotoError('Unsupported file format. Please upload a JPEG, PNG, or WebP image.');
      return;
    }

    try {
      setIsProcessingPhoto(true);
      setRawPhoto(file);
      const cropped = await cropAndCompressImage(file, 800);
      setProcessedPhotoUrl(cropped);
    } catch (err: any) {
      setPhotoError('Failed to process image. Please choose another photograph.');
    } finally {
      setIsProcessingPhoto(false);
    }
  };

  const handleGooglePhotoSelect = async () => {
    if (!user?.photoURL) {
      setPhotoError('No Google account profile photo found.');
      return;
    }
    try {
      setIsProcessingPhoto(true);
      const cropped = await cropAndCompressImage(user.photoURL, 800);
      setProcessedPhotoUrl(cropped);
    } catch {
      setPhotoError('Could not process Google profile picture.');
    } finally {
      setIsProcessingPhoto(false);
    }
  };

  // Generate Report Snapshot (Step 9 -> Step 10)
  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      const snapshot = await createReportSnapshot({
        evaluation,
        userUid: user?.uid || 'guest',
        reportType,
        displayName: displayName || profile?.displayName || 'FinTrustBench User',
        photoDataUrl: reportType === 'personalized' ? processedPhotoUrl || undefined : undefined,
        retentionDays,
      });

      // Save initial snapshot
      const finalSnap = await saveReportToCloudAndLocal(snapshot, user?.uid);
      setReportSnapshot(finalSnap);
      setStep(10); // Go to Preview Step
    } catch (err) {
      console.error('Error generating report snapshot:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Download PDF (Step 11)
  const handleDownloadPDF = async () => {
    if (!reportSnapshot) return;
    setIsDownloading(true);
    try {
      const { pdfBlob, fileName } = await generateFinTrustBenchPDF(reportSnapshot);

      // Create download trigger
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Record audit
      await recordReportDownloadAudit(reportSnapshot, user?.uid);
      setDownloadSuccess(true);
      setStep(12); // Go to Final Retention / Finish step
    } catch (err) {
      console.error('PDF download error:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  // Cloud Save confirmation
  const handleSaveRetention = async () => {
    if (!reportSnapshot || !user) return;
    try {
      const updated = { ...reportSnapshot, retentionDays };
      await saveReportToCloudAndLocal(updated, user.uid);
      setSavedToAccount(true);
    } catch (err) {
      console.error('Save retention failed:', err);
    }
  };

  const isConsentValid = consent1 && consent2 && consent3;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 text-white shadow-2xl relative my-8">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">FinTrustBench Report Wizard</h2>
              <p className="text-xs text-slate-400">Step {step} of 12 — Generate Professional Evaluation PDF</p>
            </div>
          </div>

          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Tracker Bar */}
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-6">
          <div
            className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full transition-all duration-300"
            style={{ width: `${(step / 12) * 100}%` }}
          />
        </div>

        {/* STEP 1: Account Status Check */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Account Identity Check</span>
                {user ? (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold flex items-center gap-1 border border-emerald-500/30">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Signed In</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold flex items-center gap-1 border border-amber-500/30">
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    <span>Guest Mode</span>
                  </span>
                )}
              </div>

              {user ? (
                <div className="text-sm space-y-1">
                  <p className="font-semibold text-white">{profile?.displayName || user.displayName || 'FinTrustBench Account'}</p>
                  <p className="text-xs text-slate-400">{user.email}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-slate-300 leading-relaxed">
                    You are currently using FinTrustBench in Guest Mode. Guest users can create standard private reports.
                    To include your photograph and name in a <span className="text-cyan-400 font-semibold">Personalized Report</span>, please sign in or create a free account.
                  </p>

                  <button
                    onClick={() => {
                      onClose();
                      if (onOpenAuthModal) onOpenAuthModal();
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center space-x-2 transition-colors shadow-lg shadow-blue-600/20"
                  >
                    <User className="w-4 h-4" />
                    <span>Sign In or Create Free Account</span>
                  </button>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setStep(2)}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center space-x-2 transition-colors"
              >
                <span>Continue to Report Type Selection</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Choose Report Type */}
        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-slate-200">Select Report Type:</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Option A: Standard Private Report */}
              <div
                onClick={() => setReportType('standard')}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                  reportType === 'standard'
                    ? 'bg-blue-950/40 border-blue-500 text-white ring-1 ring-blue-500'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-xl bg-slate-800 text-slate-300">
                    <Lock className="w-5 h-5 text-blue-400" />
                  </div>
                  {reportType === 'standard' && <CheckCircle2 className="w-5 h-5 text-blue-400" />}
                </div>
                <h4 className="font-bold text-sm text-white mb-1">Standard Private Report</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Available to guests and signed-in users. Contains complete 7-dimension financial evaluation and deterministic mathematical verification without photo or name.
                </p>
              </div>

              {/* Option B: Personalized Report */}
              <div
                onClick={() => {
                  if (!user) {
                    onClose();
                    if (onOpenAuthModal) onOpenAuthModal();
                  } else {
                    setReportType('personalized');
                  }
                }}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                  reportType === 'personalized'
                    ? 'bg-cyan-950/40 border-cyan-500 text-white ring-1 ring-cyan-500'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                } ${!user ? 'opacity-70' : ''}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-xl bg-cyan-900/40 text-cyan-300">
                    <User className="w-5 h-5 text-cyan-400" />
                  </div>
                  {reportType === 'personalized' && <CheckCircle2 className="w-5 h-5 text-cyan-400" />}
                </div>
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-bold text-sm text-white">Personalized Report</h4>
                  {!user && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-amber-300 font-semibold">
                      Sign in required
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Includes user-supplied name and photograph, verification code, and report hash. Displays explicit non-biometric educational disclaimer.
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                onClick={() => setStep(reportType === 'personalized' ? 3 : 8)}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center space-x-2"
              >
                <span>{reportType === 'personalized' ? 'Configure Identity' : 'Proceed to Evaluation'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Confirm Report Display Name */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-white mb-1">Confirm Report Display Name</h3>
              <p className="text-xs text-slate-400">
                This name will appear on the cover and footer of your Personalized FinTrustBench PDF report.
              </p>
            </div>

            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Report Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Dr. Jane Doe"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-500"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Editing this name updates the report presentation without changing your main sign-in email.
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                onClick={() => setStep(4)}
                disabled={!displayName.trim()}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold flex items-center space-x-2"
              >
                <span>Select Photograph</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Select / Capture Photo */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-white mb-1">Select or Capture Photograph</h3>
              <p className="text-xs text-slate-400">
                Choose how to provide your profile photograph (JPEG, PNG, or WebP, max 5MB).
              </p>
            </div>

            {/* Mode selection tabs */}
            <div className="flex gap-2 border-b border-slate-800 pb-3">
              <button
                onClick={() => {
                  stopCamera();
                  setPhotoSourceMode('upload');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 ${
                  photoSourceMode === 'upload' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload File</span>
              </button>

              <button
                onClick={() => {
                  setPhotoSourceMode('camera');
                  startCamera();
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 ${
                  photoSourceMode === 'camera' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Live Camera Selfie</span>
              </button>

              {user?.photoURL && (
                <button
                  onClick={() => {
                    stopCamera();
                    setPhotoSourceMode('google');
                    handleGooglePhotoSelect();
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 ${
                    photoSourceMode === 'google' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Use Account Photo</span>
                </button>
              )}
            </div>

            {photoError && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{photoError}</span>
              </div>
            )}

            {/* Upload mode UI */}
            {photoSourceMode === 'upload' && (
              <div className="border-2 border-dashed border-slate-700 hover:border-slate-500 rounded-2xl p-8 text-center bg-slate-950 transition-colors">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-200 mb-1">Click or drag photograph here</p>
                <p className="text-[11px] text-slate-500 mb-4">Supported formats: JPEG, PNG, WebP (Max 5MB)</p>
                <label className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer inline-block">
                  <span>Browse File</span>
                  <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
            )}

            {/* Camera mode UI */}
            {photoSourceMode === 'camera' && (
              <div className="space-y-4 text-center">
                <div className="relative w-64 h-64 mx-auto rounded-2xl overflow-hidden bg-slate-950 border border-slate-700 flex items-center justify-center">
                  {isCameraActive ? (
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  ) : (
                    <p className="text-xs text-slate-500">Camera inactive</p>
                  )}
                </div>

                <div className="flex justify-center gap-3">
                  <button
                    onClick={captureCameraSelfie}
                    disabled={!isCameraActive || isProcessingPhoto}
                    className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-bold flex items-center space-x-2"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Snap Photograph</span>
                  </button>
                </div>
              </div>
            )}

            {/* Step 5 Preview preview inline if photo processed */}
            {processedPhotoUrl && (
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center space-x-4">
                <img src={processedPhotoUrl} alt="Cropped preview" className="w-20 h-20 rounded-xl object-cover border border-slate-700" />
                <div className="space-y-1">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Photo processed & cropped (800×800)
                  </span>
                  <p className="text-[11px] text-slate-400">Ready to embed in personalized report.</p>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => {
                  stopCamera();
                  setStep(3);
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                onClick={() => {
                  stopCamera();
                  setStep(5);
                }}
                disabled={!processedPhotoUrl}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold flex items-center space-x-2"
              >
                <span>Review Photograph</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Review Photograph */}
        {step === 5 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-white mb-1">Review Photograph Crop</h3>
              <p className="text-xs text-slate-400">
                Confirm your photograph framing. The photo is automatically cropped to a centered 800x800 square.
              </p>
            </div>

            <div className="flex flex-col items-center justify-center p-6 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
              {processedPhotoUrl ? (
                <div className="relative group">
                  <img src={processedPhotoUrl} alt="Photograph Crop" className="w-48 h-48 rounded-2xl object-cover border-2 border-cyan-500 shadow-xl" />
                  <div className="absolute inset-0 bg-slate-950/40 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="text-[11px] font-bold text-white bg-slate-900/80 px-2.5 py-1 rounded-full border border-slate-700">
                      800 × 800 Crop
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500">No photo selected</p>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => setStep(4)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Replace / Retake</span>
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => setStep(4)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                onClick={() => setStep(6)}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center space-x-2"
              >
                <span>Read Privacy Notice</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 6 & 7: Privacy Notice & Consent Checkboxes */}
        {(step === 6 || step === 7) && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-white mb-1">Privacy Notice & Explicit Consent</h3>
              <p className="text-xs text-slate-400">
                Please review privacy terms and provide mandatory confirmations before generating your report.
              </p>
            </div>

            {/* Privacy Box */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2 leading-relaxed">
              <p className="font-bold text-cyan-400">FinTrustBench Identity Privacy Policy:</p>
              <p>
                Your photograph and display name are linked to this specific evaluation report to create a personalized, tamper-evident document.
                FinTrustBench does not perform facial recognition, liveness detection, or legal identity verification.
              </p>
            </div>

            {/* Step 7 Checkboxes */}
            <div className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consent1}
                  onChange={(e) => setConsent1(e.target.checked)}
                  className="mt-0.5 rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs text-slate-200">
                  I consent to using this photograph in my personalized FinTrustBench report.
                </span>
              </label>

              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consent2}
                  onChange={(e) => setConsent2(e.target.checked)}
                  className="mt-0.5 rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs text-slate-200">
                  I understand that the photograph does not constitute government identity verification.
                </span>
              </label>

              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consent3}
                  onChange={(e) => setConsent3(e.target.checked)}
                  className="mt-0.5 rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs text-slate-200">
                  I confirm that I have the right to use this photograph.
                </span>
              </label>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => setStep(5)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                onClick={() => setStep(8)}
                disabled={!isConsentValid}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold flex items-center space-x-2"
              >
                <span>Confirm & Review Question</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 8 & 9: Review Question & Freeze Evaluation Snapshot */}
        {(step === 8 || step === 9) && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-white mb-1">Review Evaluation Content</h3>
              <p className="text-xs text-slate-400">
                FinTrustBench will generate an immutable report snapshot of the current evaluation results.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
              <div>
                <span className="text-slate-400 font-semibold block mb-0.5">Financial Question:</span>
                <p className="text-white font-medium bg-slate-900 p-2.5 rounded-lg border border-slate-800">{evaluation.question}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-slate-300">
                <div>
                  <span className="text-slate-400 block">Overall Score:</span>
                  <span className="text-sm font-bold text-cyan-400">{evaluation.overallReliabilityScore}/100</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Reliability Level:</span>
                  <span className="text-sm font-bold text-white">{evaluation.reliabilityLevel}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => setStep(reportType === 'personalized' ? 7 : 2)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                onClick={handleGenerateReport}
                disabled={isGenerating}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold flex items-center space-x-2 shadow-lg shadow-cyan-500/20"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Generating Report Snapshot...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Immutable Report</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 10: Interactive Report Preview */}
        {step === 10 && reportSnapshot && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-white mb-1">Interactive Report Preview</h3>
              <p className="text-xs text-slate-400">
                Review your 6-page report before downloading the final PDF.
              </p>
            </div>

            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 max-h-96 overflow-y-auto">
              {/* Header Preview Card */}
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  {reportSnapshot.photoDataUrl && (
                    <img src={reportSnapshot.photoDataUrl} alt="User" className="w-14 h-14 rounded-xl object-cover border border-slate-700" />
                  )}
                  <div>
                    <h4 className="font-bold text-sm text-white">{reportSnapshot.reportDisplayName}</h4>
                    <p className="text-[11px] text-slate-400">Code: {reportSnapshot.verificationCode}</p>
                    <p className="text-[10px] text-cyan-400 font-mono mt-0.5">Hash: {reportSnapshot.reportHash.substring(0, 16)}...</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xl font-black text-blue-400">{reportSnapshot.overallReliabilityScore}/100</span>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">{reportSnapshot.reliabilityLevel}</p>
                </div>
              </div>

              {/* Watermark Banner */}
              <div className="p-2.5 rounded-lg bg-indigo-950/60 border border-indigo-800/60 text-center text-[11px] text-indigo-300 font-semibold">
                {reportSnapshot.reportType === 'personalized'
                  ? 'Personalized Copy — Educational Evaluation Only. Not a Government Identity Document.'
                  : 'Standard Private Copy — Educational Evaluation Only.'}
              </div>

              <div className="text-xs text-slate-300 space-y-2">
                <p><span className="font-bold text-slate-400">Question:</span> {reportSnapshot.question}</p>
                <p><span className="font-bold text-slate-400">Deterministic Check:</span> {reportSnapshot.deterministicCheck ? (reportSnapshot.deterministicCheck.isVerified ? 'VERIFIED PASS' : 'MISMATCH') : 'N/A'}</p>
                <p><span className="font-bold text-slate-400">Critical Warnings:</span> {reportSnapshot.criticalWarnings.length} issue(s)</p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => setStep(8)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold flex items-center space-x-2 shadow-lg shadow-emerald-600/20"
              >
                {isDownloading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Preparing PDF...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download PDF Report</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 11 & 12: Download Success & Cloud Retention Choice */}
        {(step === 11 || step === 12) && reportSnapshot && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 flex items-center space-x-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <h4 className="font-bold text-sm text-white">PDF Report Downloaded Successfully!</h4>
                <p className="text-xs text-emerald-200/80">
                  Verification Code: <span className="font-mono font-bold text-white">{reportSnapshot.verificationCode}</span>
                </p>
              </div>
            </div>

            {user ? (
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-300">
                  Select Report Retention Policy
                </h4>

                <div className="space-y-2">
                  <label className="flex items-center space-x-3 p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer hover:border-slate-700">
                    <input
                      type="radio"
                      name="retention"
                      checked={retentionDays === 0}
                      onChange={() => setRetentionDays(0)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <span className="text-xs font-bold text-white block">Do not save after download (Default)</span>
                      <span className="text-[11px] text-slate-400">Report is kept locally during your current browser session only.</span>
                    </div>
                  </label>

                  <label className="flex items-center space-x-3 p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer hover:border-slate-700">
                    <input
                      type="radio"
                      name="retention"
                      checked={retentionDays === 30}
                      onChange={() => setRetentionDays(30)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <span className="text-xs font-bold text-white block">Save in My Account for 30 days</span>
                      <span className="text-[11px] text-slate-400">Automatically purged from cloud storage after 30 days.</span>
                    </div>
                  </label>

                  <label className="flex items-center space-x-3 p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer hover:border-slate-700">
                    <input
                      type="radio"
                      name="retention"
                      checked={retentionDays === 90}
                      onChange={() => setRetentionDays(90)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <span className="text-xs font-bold text-white block">Save in My Account for 90 days</span>
                      <span className="text-[11px] text-slate-400">Automatically purged after 90 days.</span>
                    </div>
                  </label>

                  <label className="flex items-center space-x-3 p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer hover:border-slate-700">
                    <input
                      type="radio"
                      name="retention"
                      checked={retentionDays === -1}
                      onChange={() => setRetentionDays(-1)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <span className="text-xs font-bold text-white block">Save in My Account until I delete it</span>
                      <span className="text-[11px] text-slate-400">Kept securely in your Firestore/Storage account indefinitely.</span>
                    </div>
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={handleSaveRetention}
                    disabled={savedToAccount}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold flex items-center space-x-1"
                  >
                    {savedToAccount ? <Check className="w-3.5 h-3.5" /> : null}
                    <span>{savedToAccount ? 'Retention Preference Saved' : 'Save Preference'}</span>
                  </button>
                </div>
              </div>
            ) : null}

            <div className="flex justify-end pt-2">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
              >
                Done / Close Wizard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
