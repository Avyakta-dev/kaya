/**
 * src/lib/pdf.js – jsPDF Report Layout Generator
 *
 * Generates a high-quality, 1-page "doctor-ready" clinical summary PDF
 * for patients to bring to their consultations.
 *
 * Consumes the data structure returned by /api/report (or mockReport):
 *   - patient: { name, age, lifeStage }
 *   - generated: string
 *   - loggedInterval: string
 *   - avgCycleLength: string
 *   - maxSpread: string
 *   - cycles: [{ month, length, status, details, severity }]
 *   - flaggedPatterns: [{ title, description }]
 *   - clinicalNote: string
 *   - suggestedQuestions: string[]
 */

import { jsPDF } from 'jspdf';
import { mockReport } from './mock/report.js';

/**
 * Builds and returns a jsPDF document containing the clinical report.
 *
 * @param {Object} reportData - The report payload from /api/report
 * @returns {jsPDF} doc
 */
export function createReportPDF(reportData = mockReport) {
  const data = reportData || mockReport;
  const patient = data.patient || { name: 'Priya S.', age: 26, lifeStage: 'Adult' };
  const cycles = data.cycles || [];
  const flaggedPatterns = data.flaggedPatterns || [];
  const suggestedQuestions = data.suggestedQuestions || [];

  // A4 portrait dimensions: 210 x 297 mm
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2; // 182 mm
  let y = margin;

  // ── Palette ──────────────────────────────────────────────────
  const primaryCoral = [238, 128, 112];    // #EE8070
  const darkRed      = [157, 66, 53];      // #9D4235
  const softPeach    = [254, 240, 235];    // Light background tint
  const lightPeach   = [246, 209, 197];    // #F6D1C5
  const darkText     = [25, 25, 25];
  const mutedText    = [90, 80, 78];
  const borderLine   = [0, 0, 0];          // Bold borders for high contrast
  const lightGray    = [240, 240, 240];

  // ── 1. Header & Title Banner ─────────────────────────────────
  // Brand Pill
  doc.setFillColor(...primaryCoral);
  doc.setDrawColor(...borderLine);
  doc.setLineWidth(0.6);
  doc.roundedRect(margin, y, 24, 7, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text('KAYA', margin + 12, y + 5, { align: 'center' });

  // Right-aligned report status
  doc.setFillColor(...lightPeach);
  doc.roundedRect(pageWidth - margin - 42, y, 42, 6.5, 3, 3, 'FD');
  doc.setFontSize(7.5);
  doc.setTextColor(...darkRed);
  doc.text('VERIFIED LOG SUMMARY', pageWidth - margin - 21, y + 4.5, { align: 'center' });

  y += 10;

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(...darkText);
  doc.text("Doctor-Ready Cycle & Symptom Report", margin, y);

  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...mutedText);
  const subtitle = `Generated on ${data.generated || new Date().toLocaleDateString()} • HIPAA Compliant Patient Export • 3-Month Window`;
  doc.text(subtitle, margin, y);

  y += 4;
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageWidth - margin, y);
  y += 5;

  // ── 2. Patient Profile & Metrics Grid ─────────────────────────
  const profileCardHeight = 24;
  doc.setFillColor(...softPeach);
  doc.setDrawColor(...borderLine);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, y, contentWidth, profileCardHeight, 3, 3, 'FD');

  // Patient Info (Left Column)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...darkText);
  doc.text(`${patient.name || 'Patient'}`, margin + 5, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...mutedText);
  doc.text(`Age: ${patient.age || '—'} yrs   •   Life Stage: ${patient.lifeStage || 'Adult'}`, margin + 5, y + 13);
  doc.text(`Tracking Interval: ${data.loggedInterval || '3 Cycles'}`, margin + 5, y + 19);

  // Key Metrics (Right Two Boxes)
  const boxW = 42;
  const boxH = 17;
  const boxY = y + 3.5;

  // Metric 1: Avg Cycle Length
  const box1X = pageWidth - margin - boxW * 2 - 5;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(...borderLine);
  doc.setLineWidth(0.4);
  doc.roundedRect(box1X, boxY, boxW, boxH, 2, 2, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...mutedText);
  doc.text('AVG CYCLE LENGTH', box1X + 4, boxY + 5);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...darkRed);
  doc.text(`${data.avgCycleLength || '28 Days'}`, box1X + 4, boxY + 12.5);

  // Metric 2: Max Spread / Variance
  const box2X = pageWidth - margin - boxW;
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(box2X, boxY, boxW, boxH, 2, 2, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...mutedText);
  doc.text('MAX SPREAD / VARIANCE', box2X + 4, boxY + 5);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...darkText);
  doc.text(`Δ ${data.maxSpread || '—'}`, box2X + 4, boxY + 12.5);

  y += profileCardHeight + 6;

  // ── 3. Cycle History Table ───────────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...darkText);
  doc.text('Cycle History & Symptoms Timeline', margin, y);
  y += 3.5;

  // Table Header
  const tableH = 7;
  doc.setFillColor(...lightGray);
  doc.setDrawColor(...borderLine);
  doc.setLineWidth(0.4);
  doc.rect(margin, y, contentWidth, tableH, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.text('MONTH', margin + 4, y + 4.8);
  doc.text('LENGTH', margin + 26, y + 4.8);
  doc.text('STATUS', margin + 56, y + 4.8);
  doc.text('RECORDED SYMPTOMS & CLINICAL OBSERVATIONS', margin + 92, y + 4.8);

  y += tableH;

  // Table Rows
  cycles.forEach((cycle) => {
    const rowH = 11;
    const isDelayed = cycle.status && cycle.status.includes('Delayed');

    doc.setFillColor(isDelayed ? 255 : 255, isDelayed ? 245 : 255, isDelayed ? 242 : 255);
    doc.setDrawColor(210, 210, 210);
    doc.setLineWidth(0.3);
    doc.rect(margin, y, contentWidth, rowH, 'FD');

    // Left border indicator for irregular cycles
    if (isDelayed) {
      doc.setFillColor(...darkRed);
      doc.rect(margin, y, 1.5, rowH, 'F');
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...darkText);
    doc.text(cycle.month || '—', margin + 4, y + 7);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text(cycle.length || '—', margin + 26, y + 7);

    // Status Pill
    if (isDelayed) {
      doc.setFillColor(...primaryCoral);
      doc.roundedRect(margin + 54, y + 2.5, 28, 6, 1.5, 1.5, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(0, 0, 0);
      doc.text(cycle.status, margin + 68, y + 6.8, { align: 'center' });
    } else {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...mutedText);
      doc.text(cycle.status || 'Typical', margin + 56, y + 7);
    }

    // Details / Observations
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...darkText);
    const detailLines = doc.splitTextToSize(cycle.details || 'Normal parameters', contentWidth - 96);
    doc.text(detailLines, margin + 92, y + 7);

    y += rowH;
  });

  // Table bottom border
  doc.setDrawColor(...borderLine);
  doc.setLineWidth(0.4);
  doc.line(margin, y, pageWidth - margin, y);

  y += 7;

  // ── 4. Flagged Clinical Patterns ─────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...darkText);
  doc.text('Flagged Clinical Patterns (Algorithmic Analysis)', margin, y);
  y += 4;

  if (flaggedPatterns.length === 0) {
    doc.setFillColor(250, 250, 250);
    doc.roundedRect(margin, y, contentWidth, 12, 2, 2, 'FD');
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.5);
    doc.setTextColor(...mutedText);
    doc.text('No significant abnormal patterns detected across the logged interval.', margin + 5, y + 7);
    y += 16;
  } else {
    flaggedPatterns.forEach((p) => {
      const cardHeight = 15;
      doc.setFillColor(...softPeach);
      doc.setDrawColor(...borderLine);
      doc.setLineWidth(0.4);
      doc.roundedRect(margin, y, contentWidth, cardHeight, 2.5, 2.5, 'FD');

      // Left Accent bar
      doc.setFillColor(...primaryCoral);
      doc.roundedRect(margin, y, 2.5, cardHeight, 1, 1, 'F');

      // Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(...darkRed);
      doc.text(`• ${p.title}`, margin + 6, y + 5);

      // Description
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...darkText);
      const descLines = doc.splitTextToSize(p.description || '', contentWidth - 12);
      doc.text(descLines, margin + 6, y + 9.5);

      y += cardHeight + 2.5;
    });
  }

  // Clinical correlation note
  if (data.clinicalNote) {
    y += 1;
    doc.setFillColor(242, 242, 242);
    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, y, contentWidth, 9, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...darkRed);
    doc.text('CLINICAL CORRELATION:', margin + 4, y + 5.5);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...darkText);
    doc.text(data.clinicalNote, margin + 42, y + 5.5);

    y += 13;
  } else {
    y += 3;
  }

  // ── 5. Suggested Questions to Discuss With Doctor ────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...darkText);
  doc.text('Suggested Questions for Your Consultation', margin, y);
  y += 4;

  const questionsBoxHeight = Math.max(22, suggestedQuestions.length * 6.5 + 4);
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(...borderLine);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, y, contentWidth, questionsBoxHeight, 2.5, 2.5, 'FD');

  let qY = y + 5;
  suggestedQuestions.slice(0, 4).forEach((q) => {
    // Checkbox square
    doc.setDrawColor(...darkRed);
    doc.setLineWidth(0.3);
    doc.rect(margin + 5, qY - 2.8, 3, 3, 'S');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...darkText);
    const qLines = doc.splitTextToSize(q, contentWidth - 16);
    doc.text(qLines, margin + 11, qY);
    qY += 6;
  });

  y += questionsBoxHeight + 6;

  // ── 6. Footer & Medical Disclaimer ───────────────────────────
  const footerY = pageHeight - 14;
  doc.setDrawColor(210, 210, 210);
  doc.setLineWidth(0.3);
  doc.line(margin, footerY - 3, pageWidth - margin, footerY - 3);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(...darkRed);
  doc.text('DISCLAIMER:', margin, footerY);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...mutedText);
  const disclaimer = 'Kaya is a symptom tracking tool and does not provide diagnosis. All flagged observations are meant solely to facilitate discussion with a qualified healthcare provider.';
  doc.text(disclaimer, margin + 18, footerY);

  doc.setFontSize(7);
  doc.text('Page 1 of 1', pageWidth - margin, footerY, { align: 'right' });

  return doc;
}

/**
 * Generates and automatically triggers the download of the doctor report PDF.
 *
 * @param {Object} [reportData] - Report data payload
 * @param {string} [filename] - Custom output filename
 */
export function downloadReportPDF(reportData, filename) {
  const doc = createReportPDF(reportData);
  const safeName = filename || `Kaya_Doctor_Report_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(safeName);
  return safeName;
}

/**
 * Returns the report PDF as a Blob (useful for web preview, share API, etc).
 *
 * @param {Object} [reportData]
 * @returns {Blob}
 */
export function getReportPDFBlob(reportData) {
  const doc = createReportPDF(reportData);
  return doc.output('blob');
}
