import { jsPDF } from 'jspdf';
import { ReportSnapshot } from '../types';

/**
 * FinTrustBench PDF Report Generator
 * Generates high-quality, multi-page vector A4 PDFs for FinTrustBench reports.
 */

export async function generateFinTrustBenchPDF(report: ReportSnapshot): Promise<{ pdfBlob: Blob; fileName: string }> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const marginLeft = 15;
  const marginRight = 195;
  const contentWidth = 180;
  let cursorY = 20;

  // Colors & Helpers
  type RGB = [number, number, number];
  const darkNavy: RGB = [15, 23, 42]; // #0f172a
  const slateBorder: RGB = [226, 232, 240]; // #e2e8f0
  const bluePrimary: RGB = [37, 99, 235]; // #2563eb
  const bgCard: RGB = [248, 250, 252]; // #f8fafc
  const textDark: RGB = [30, 41, 59]; // #1e293b
  const textMuted: RGB = [100, 116, 139]; // #64748b

  const setFill = (c: RGB) => doc.setFillColor(c[0], c[1], c[2]);
  const setDraw = (c: RGB) => doc.setDrawColor(c[0], c[1], c[2]);
  const setText = (c: RGB) => doc.setTextColor(c[0], c[1], c[2]);

  // Helpers
  const addHeaderFooter = (pageNo: number, totalPages: number) => {
    // Top banner line
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(marginLeft, 12, marginRight, 12);

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('FINTRUSTBENCH — FINANCIAL AI RELIABILITY BENCHMARK', marginLeft, 9);
    doc.setFont('Helvetica', 'normal');
    doc.text(`VERIFICATION CODE: ${report.verificationCode}`, marginRight, 9, { align: 'right' });

    // Bottom footer line
    doc.line(marginLeft, pageHeight - 12, marginRight, pageHeight - 12);
    doc.setFontSize(8);
    doc.text(`Page ${pageNo} of ${totalPages}`, marginLeft, pageHeight - 7);
    doc.text('Benchmark Report | Confidential & Identity-Linked Copy', marginRight, pageHeight - 7, {
      align: 'right',
    });
  };

  // -------------------------------------------------------------
  // PAGE 1: REPORT IDENTITY AND SUMMARY
  // -------------------------------------------------------------
  
  // Header Title Banner
  setFill(darkNavy);
  doc.rect(marginLeft, cursorY, contentWidth, 24, 'F');

  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text('FinTrustBench Reliability Report', marginLeft + 8, cursorY + 11);

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(147, 197, 253);
  const reportLabel = report.reportType === 'personalized' ? 'Personalized Report' : 'Standard Private Report';
  doc.text(`${reportLabel} | Benchmark Snapshot`, marginLeft + 8, cursorY + 18);

  cursorY += 30;

  // Identity / Profile Card
  const cardHeight = report.reportType === 'personalized' && report.photoDataUrl ? 52 : 42;
  setFill(bgCard);
  setDraw(slateBorder);
  doc.roundedRect(marginLeft, cursorY, contentWidth, cardHeight, 3, 3, 'FD');

  if (report.reportType === 'personalized' && report.photoDataUrl) {
    try {
      doc.addImage(report.photoDataUrl, 'JPEG', marginLeft + 6, cursorY + 6, 40, 40);
      // Photo frame border
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.4);
      doc.rect(marginLeft + 6, cursorY + 6, 40, 40);
    } catch {
      // Fallback if image embedding fails
      doc.setFillColor(203, 213, 225);
      doc.rect(marginLeft + 6, cursorY + 6, 40, 40, 'F');
    }
  }

  const textOffsetX = report.reportType === 'personalized' && report.photoDataUrl ? marginLeft + 52 : marginLeft + 8;
  
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(12);
  setText(darkNavy);
  doc.text(report.reportDisplayName || 'FinTrustBench User', textOffsetX, cursorY + 10);

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(8.5);
  setText(textMuted);
  doc.text(`Report ID: ${report.reportId}`, textOffsetX, cursorY + 16);
  doc.text(`Verification Code: ${report.verificationCode}`, textOffsetX, cursorY + 21);
  doc.text(`Created: ${new Date(report.createdAt).toUTCString()}`, textOffsetX, cursorY + 26);
  doc.text(`Country / Region: ${report.country} (${report.currency})`, textOffsetX, cursorY + 31);
  doc.text(`Topic: ${report.topic} | Risk Level: ${report.riskLevel}`, textOffsetX, cursorY + 36);

  cursorY += cardHeight + 8;

  // Watermark Banner
  doc.setFillColor(238, 242, 255);
  doc.setDrawColor(199, 210, 254);
  doc.roundedRect(marginLeft, cursorY, contentWidth, 12, 2, 2, 'FD');
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(67, 56, 202);
  const watermarkText = report.reportType === 'personalized'
    ? 'Personalized Copy — Benchmark Evaluation Only. Not a Government Identity Document.'
    : 'Standard Private Copy — Benchmark Evaluation Only.';
  doc.text(watermarkText, pageWidth / 2, cursorY + 7.5, { align: 'center' });

  cursorY += 18;

  // Executive Score Card
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(11);
  setText(darkNavy);
  doc.text('EXECUTIVE RELIABILITY SCORECARD', marginLeft, cursorY);
  cursorY += 4;

  setDraw(bluePrimary);
  doc.setLineWidth(1);
  doc.line(marginLeft, cursorY, marginLeft + 40, cursorY);
  cursorY += 6;

  // Score Box
  setFill(bgCard);
  setDraw(slateBorder);
  doc.setLineWidth(0.3);
  doc.roundedRect(marginLeft, cursorY, 55, 36, 3, 3, 'FD');

  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(24);
  setText(bluePrimary);
  doc.text(`${report.overallReliabilityScore}`, marginLeft + 27.5, cursorY + 18, { align: 'center' });

  doc.setFontSize(8);
  setText(textMuted);
  doc.text('OVERALL RELIABILITY', marginLeft + 27.5, cursorY + 25, { align: 'center' });
  doc.setFont('Helvetica', 'bold');
  setText(darkNavy);
  doc.text(`Level: ${report.reliabilityLevel}`, marginLeft + 27.5, cursorY + 30, { align: 'center' });

  // Key Checks Box next to Score Box
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(marginLeft + 60, cursorY, 120, 36, 3, 3, 'FD');

  doc.setFontSize(8.5);
  doc.setFont('Helvetica', 'bold');
  setText(textDark);
  
  const detStatus = report.deterministicCheck
    ? (report.deterministicCheck.isVerified ? 'VERIFIED PASS' : 'MISMATCH DETECTED')
    : 'N/A (No Formula Match)';

  doc.text('Deterministic Calculation Check:', marginLeft + 65, cursorY + 10);
  if (report.deterministicCheck) {
    if (report.deterministicCheck.isVerified) {
      doc.setTextColor(16, 185, 129);
    } else {
      doc.setTextColor(239, 68, 68);
    }
  } else {
    setText(textMuted);
  }
  doc.text(detStatus, marginLeft + 130, cursorY + 10);

  setText(textDark);
  doc.text('Critical Warnings Count:', marginLeft + 65, cursorY + 18);
  if (report.criticalWarnings.length > 0) {
    doc.setTextColor(220, 38, 38);
  } else {
    doc.setTextColor(16, 185, 129);
  }
  doc.text(`${report.criticalWarnings.length} Issue(s)`, marginLeft + 130, cursorY + 18);

  setText(textDark);
  doc.text('Missing Parameters Count:', marginLeft + 65, cursorY + 26);
  doc.text(`${report.missingInformation.length} Parameter(s)`, marginLeft + 130, cursorY + 26);

  cursorY += 44;

  // Executive Summary text
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(10);
  setText(darkNavy);
  doc.text('Research Executive Summary', marginLeft, cursorY);
  cursorY += 5;

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(8.5);
  setText(textDark);
  const summaryText = report.evaluationSnapshot.researchSummary || 'Comprehensive reliability benchmark evaluation completed.';
  const splitSummary = doc.splitTextToSize(summaryText, contentWidth - 8);
  
  const summaryBoxHeight = Math.max(22, splitSummary.length * 4 + 8);
  setFill(bgCard);
  setDraw(slateBorder);
  doc.roundedRect(marginLeft, cursorY, contentWidth, summaryBoxHeight, 2, 2, 'FD');
  doc.text(splitSummary, marginLeft + 4, cursorY + 6);

  cursorY += summaryBoxHeight + 10;

  addHeaderFooter(1, 6);

  // -------------------------------------------------------------
  // PAGE 2: EVALUATION INPUT & CONTEXT
  // -------------------------------------------------------------
  doc.addPage();
  cursorY = 20;

  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(12);
  setText(darkNavy);
  doc.text('1. EVALUATION INPUT & ORIGINAL QUERY', marginLeft, cursorY);
  cursorY += 4;
  setDraw(bluePrimary);
  doc.setLineWidth(1);
  doc.line(marginLeft, cursorY, marginLeft + 35, cursorY);
  cursorY += 8;

  // Question Box
  doc.setFontSize(9);
  doc.setFont('Helvetica', 'bold');
  doc.text('Financial Question Asked:', marginLeft, cursorY);
  cursorY += 4;

  const splitQ = doc.splitTextToSize(report.question, contentWidth - 8);
  const qHeight = Math.max(16, splitQ.length * 4 + 6);
  setFill(bgCard);
  setDraw(slateBorder);
  doc.setLineWidth(0.3);
  doc.roundedRect(marginLeft, cursorY, contentWidth, qHeight, 2, 2, 'FD');
  doc.setFont('Helvetica', 'normal');
  doc.text(splitQ, marginLeft + 4, cursorY + 5);

  cursorY += qHeight + 8;

  // Model & Source Info
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('AI Model Details & Context:', marginLeft, cursorY);
  cursorY += 4;

  doc.setFillColor(255, 255, 255);
  doc.roundedRect(marginLeft, cursorY, contentWidth, 18, 2, 2, 'FD');
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(`AI Provider / Source: ${report.providerName || 'Gemini API'}`, marginLeft + 4, cursorY + 6);
  doc.text(`Model: ${report.modelName || 'gemini-3.6-flash'}`, marginLeft + 4, cursorY + 12);
  doc.text(`Difficulty: ${report.difficulty} | Risk Level: ${report.riskLevel}`, marginLeft + 90, cursorY + 6);
  doc.text(`Currency: ${report.currency} | Region: ${report.country}`, marginLeft + 90, cursorY + 12);

  cursorY += 26;

  // AI Answer Raw / Summary
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('AI Generated Response Evaluated:', marginLeft, cursorY);
  cursorY += 4;

  const aiText = report.aiResponse || report.evaluationSnapshot.aiAnswer?.rawText || report.evaluationSnapshot.aiAnswer?.summary || 'N/A';
  const splitAI = doc.splitTextToSize(aiText, contentWidth - 8);
  const truncatedAI = splitAI.slice(0, 35); // Keep within page bounds
  const aiHeight = Math.max(30, truncatedAI.length * 3.8 + 8);

  setFill(bgCard);
  setDraw(slateBorder);
  doc.roundedRect(marginLeft, cursorY, contentWidth, aiHeight, 2, 2, 'FD');
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(truncatedAI, marginLeft + 4, cursorY + 6);

  cursorY += aiHeight + 10;

  addHeaderFooter(2, 6);

  // -------------------------------------------------------------
  // PAGE 3: DETERMINISTIC MATHEMATICAL VERIFICATION
  // -------------------------------------------------------------
  doc.addPage();
  cursorY = 20;

  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(12);
  setText(darkNavy);
  doc.text('2. DETERMINISTIC MATHEMATICAL VERIFICATION', marginLeft, cursorY);
  cursorY += 4;
  setDraw(bluePrimary);
  doc.setLineWidth(1);
  doc.line(marginLeft, cursorY, marginLeft + 45, cursorY);
  cursorY += 8;

  if (report.deterministicCheck) {
    const det = report.deterministicCheck;
    
    doc.setFillColor(det.isVerified ? 240 : 254, det.isVerified ? 253 : 242, det.isVerified ? 244 : 242);
    doc.setDrawColor(det.isVerified ? 187 : 254, det.isVerified ? 247 : 202, det.isVerified ? 208 : 202);
    doc.roundedRect(marginLeft, cursorY, contentWidth, 16, 2, 2, 'FD');

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(det.isVerified ? 22 : 220, det.isVerified ? 101 : 38, det.isVerified ? 52 : 38);
    const statusHeader = det.isVerified ? 'VERIFIED MATCH — NUMERICAL ACCURACY CONFIRMED' : 'MATHEMATICAL MISMATCH DETECTED';
    doc.text(statusHeader, marginLeft + 6, cursorY + 10);

    cursorY += 22;

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(9);
    setText(darkNavy);
    doc.text(`Formula Applied: ${det.formulaName}`, marginLeft, cursorY);
    cursorY += 8;

    // Table of extracted inputs
    setFill(bgCard);
    setDraw(slateBorder);
    doc.roundedRect(marginLeft, cursorY, contentWidth, 40, 2, 2, 'FD');

    doc.setFontSize(8.5);
    doc.text('Parameter Name', marginLeft + 6, cursorY + 7);
    doc.text('Extracted Value', marginLeft + 90, cursorY + 7);
    doc.line(marginLeft, cursorY + 10, marginRight, cursorY + 10);

    let rowY = cursorY + 16;
    doc.setFont('Helvetica', 'normal');
    if (det.extractedInputs) {
      Object.entries(det.extractedInputs).slice(0, 4).forEach(([key, val]) => {
        doc.text(String(key), marginLeft + 6, rowY);
        doc.text(String(val), marginLeft + 90, rowY);
        rowY += 6;
      });
    }

    cursorY += 48;

    // Calculation Comparison
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(marginLeft, cursorY, contentWidth, 38, 2, 2, 'FD');

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('Reference Calculation Result:', marginLeft + 6, cursorY + 8);
    doc.text(det.formattedReference || String(det.calculatedReference), marginLeft + 90, cursorY + 8);

    doc.text('AI Reported Value:', marginLeft + 6, cursorY + 16);
    doc.text(det.formattedAiReported || (det.aiReportedValue !== undefined ? String(det.aiReportedValue) : 'Not extracted / text only'), marginLeft + 90, cursorY + 16);

    doc.text('Absolute Difference:', marginLeft + 6, cursorY + 24);
    doc.text(det.difference !== undefined ? String(det.difference) : 'N/A', marginLeft + 90, cursorY + 24);

    doc.text('Percentage Difference:', marginLeft + 6, cursorY + 32);
    doc.text(det.percentageDifference !== undefined ? `${det.percentageDifference.toFixed(2)}%` : 'N/A', marginLeft + 90, cursorY + 32);

    cursorY += 46;

    if (det.mismatchReason) {
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(220, 38, 38);
      doc.text(`Mismatch Detail: ${det.mismatchReason}`, marginLeft, cursorY);
    }
  } else {
    setFill(bgCard);
    setDraw(slateBorder);
    doc.roundedRect(marginLeft, cursorY, contentWidth, 24, 2, 2, 'FD');
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    setText(textMuted);
    doc.text('No matching deterministic formula was triggered for this question.', marginLeft + 6, cursorY + 13);
  }

  addHeaderFooter(3, 6);

  // -------------------------------------------------------------
  // PAGE 4: 7-DIMENSION RELIABILITY ANALYSIS
  // -------------------------------------------------------------
  doc.addPage();
  cursorY = 20;

  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(12);
  setText(darkNavy);
  doc.text('3. 7-DIMENSION RELIABILITY SCORECARD', marginLeft, cursorY);
  cursorY += 4;
  setDraw(bluePrimary);
  doc.setLineWidth(1);
  doc.line(marginLeft, cursorY, marginLeft + 45, cursorY);
  cursorY += 8;

  const evalSnap = report.evaluationSnapshot;
  const metrics = [
    { name: '1. Numerical Accuracy', m: evalSnap.numericalAccuracy },
    { name: '2. Reasoning Consistency', m: evalSnap.reasoningConsistency },
    { name: '3. Safety & Risk Awareness', m: evalSnap.safetyAndRiskAwareness },
    { name: '4. Explainability', m: evalSnap.explainability },
    { name: '5. Localization Accuracy', m: evalSnap.localizationAccuracy },
    { name: '6. Assumption Transparency', m: evalSnap.assumptionTransparency },
    { name: '7. Completeness', m: evalSnap.completeness },
  ];

  metrics.forEach((item) => {
    setFill(bgCard);
    setDraw(slateBorder);
    doc.setLineWidth(0.3);
    doc.roundedRect(marginLeft, cursorY, contentWidth, 28, 2, 2, 'FD');

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(9);
    setText(darkNavy);
    doc.text(item.name, marginLeft + 4, cursorY + 7);

    // Score badge
    const sc = item.m.score;
    if (sc >= 80) {
      doc.setTextColor(16, 185, 129);
    } else if (sc >= 60) {
      doc.setTextColor(245, 158, 11);
    } else {
      doc.setTextColor(239, 68, 68);
    }
    doc.setFontSize(9);
    doc.text(`${sc}/100 [${item.m.status.toUpperCase()}]`, marginRight - 4, cursorY + 7, { align: 'right' });

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8);
    setText(textDark);
    const expLines = doc.splitTextToSize(item.m.explanation || 'No explanation provided.', contentWidth - 8);
    doc.text(expLines.slice(0, 3), marginLeft + 4, cursorY + 13);

    cursorY += 32;
  });

  addHeaderFooter(4, 6);

  // -------------------------------------------------------------
  // PAGE 5: RISKS AND CORRECTIONS
  // -------------------------------------------------------------
  doc.addPage();
  cursorY = 20;

  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(12);
  setText(darkNavy);
  doc.text('4. RISKS & RECOMMENDED CORRECTIONS', marginLeft, cursorY);
  cursorY += 4;
  setDraw(bluePrimary);
  doc.setLineWidth(1);
  doc.line(marginLeft, cursorY, marginLeft + 40, cursorY);
  cursorY += 8;

  // Critical Warnings
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(220, 38, 38);
  doc.text('Critical Risk Warnings:', marginLeft, cursorY);
  cursorY += 5;

  if (report.criticalWarnings.length > 0) {
    report.criticalWarnings.forEach((warn) => {
      doc.setFillColor(254, 242, 242);
      doc.setDrawColor(254, 202, 202);
      doc.roundedRect(marginLeft, cursorY, contentWidth, 10, 2, 2, 'FD');
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(185, 28, 28);
      doc.text(`• ${warn}`, marginLeft + 4, cursorY + 6.5);
      cursorY += 12;
    });
  } else {
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8.5);
    setText(textMuted);
    doc.text('No critical financial risk warnings detected.', marginLeft, cursorY);
    cursorY += 8;
  }

  cursorY += 4;

  // Missing Information
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(9.5);
  setText(darkNavy);
  doc.text('Missing Context Parameters:', marginLeft, cursorY);
  cursorY += 5;

  if (report.missingInformation.length > 0) {
    report.missingInformation.forEach((info) => {
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(8);
      setText(textDark);
      doc.text(`• ${info}`, marginLeft + 4, cursorY);
      cursorY += 5;
    });
  } else {
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8.5);
    setText(textMuted);
    doc.text('All necessary financial parameters were provided.', marginLeft, cursorY);
    cursorY += 6;
  }

  cursorY += 8;

  // Recommended Corrections & Safer Answer
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(9.5);
  setText(bluePrimary);
  doc.text('Safer Response Synthesis & Recommendations:', marginLeft, cursorY);
  cursorY += 5;

  const impText = report.improvedAnswer || 'No specific synthesis generated.';
  const splitImp = doc.splitTextToSize(impText, contentWidth - 8);
  const impHeight = Math.max(30, splitImp.length * 3.8 + 8);

  doc.setFillColor(240, 249, 255);
  doc.setDrawColor(186, 230, 253);
  doc.roundedRect(marginLeft, cursorY, contentWidth, impHeight, 2, 2, 'FD');
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(12, 74, 110);
  doc.text(splitImp, marginLeft + 4, cursorY + 6);

  cursorY += impHeight + 10;

  addHeaderFooter(5, 6);

  // -------------------------------------------------------------
  // PAGE 6: REPORT INFORMATION, METADATA & DISCLAIMERS
  // -------------------------------------------------------------
  doc.addPage();
  cursorY = 20;

  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(12);
  setText(darkNavy);
  doc.text('5. METADATA, AUDIT & LEGAL DISCLAIMERS', marginLeft, cursorY);
  cursorY += 4;
  setDraw(bluePrimary);
  doc.setLineWidth(1);
  doc.line(marginLeft, cursorY, marginLeft + 45, cursorY);
  cursorY += 8;

  // Metadata Box
  setFill(bgCard);
  setDraw(slateBorder);
  doc.roundedRect(marginLeft, cursorY, contentWidth, 42, 2, 2, 'FD');

  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(8.5);
  setText(textDark);
  doc.text('Technical Metadata & Integrity Identifiers:', marginLeft + 4, cursorY + 7);
  doc.line(marginLeft, cursorY + 10, marginRight, cursorY + 10);

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`Report ID: ${report.reportId}`, marginLeft + 4, cursorY + 16);
  doc.text(`Verification Code: ${report.verificationCode}`, marginLeft + 4, cursorY + 22);
  doc.text(`Report Hash (SHA-256): ${report.reportHash}`, marginLeft + 4, cursorY + 28);
  doc.text(`App Version: ${report.applicationVersion} | Schema: ${report.schemaVersion}`, marginLeft + 4, cursorY + 34);
  doc.text(`Evaluation Engine: ${report.evaluationEngineVersion} | Deterministic Engine: ${report.deterministicEngineVersion}`, marginLeft + 95, cursorY + 34);

  cursorY += 50;

  // Mandatory Disclaimer
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(marginLeft, cursorY, contentWidth, 36, 2, 2, 'FD');

  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(8.5);
  setText(darkNavy);
  doc.text('MANDATORY BENCHMARK DISCLAIMER', marginLeft + 4, cursorY + 7);

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(7.5);
  setText(textDark);
  const disclaimerText =
    'FinTrustBench is an open-source research and evaluation platform. This report evaluates AI-generated financial answers for reliability, numerical accuracy, and risk awareness. It does not constitute certified financial, investment, legal, tax or identity-verification advice. Users must consult qualified human financial professionals and authoritative regulatory sources before acting on financial decisions.';
  const splitDisc = doc.splitTextToSize(disclaimerText, contentWidth - 8);
  doc.text(splitDisc, marginLeft + 4, cursorY + 13);

  cursorY += 42;

  // Identity / Photo Disclaimer
  setFill(bgCard);
  doc.roundedRect(marginLeft, cursorY, contentWidth, 24, 2, 2, 'FD');

  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(8.5);
  setText(darkNavy);
  doc.text('PERSONALIZED REPORT IDENTITY STATEMENT', marginLeft + 4, cursorY + 7);

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(7.5);
  setText(textMuted);
  const photoDisclaimerText =
    'The personalized report links the user-supplied name and photograph to the generated FinTrustBench report. It does not perform legal identity verification or biometric authentication, and has not been verified against a government identity document.';
  const splitPhotoDisc = doc.splitTextToSize(photoDisclaimerText, contentWidth - 8);
  doc.text(splitPhotoDisc, marginLeft + 4, cursorY + 13);

  addHeaderFooter(6, 6);

  // Return PDF Blob and filename
  const pdfBlob = doc.output('blob');
  const sanitizedName = (report.reportDisplayName || 'User').replace(/[^a-zA-Z0-9]/g, '_');
  const fileName = `FinTrustBench_${report.reportType === 'personalized' ? 'Personalized' : 'Standard'}_Report_${sanitizedName}_${report.verificationCode}.pdf`;

  return { pdfBlob, fileName };
}
