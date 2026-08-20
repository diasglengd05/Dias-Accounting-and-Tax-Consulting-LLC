import { jsPDF } from "jspdf";

export interface PlaybookRecipient {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  language?: "en" | "ar";
}

/**
 * Generates the official 2026 UAE Corporate Tax & VAT Compliance Playbook PDF
 */
export function generateCompliancePlaybookPdf(recipient: PlaybookRecipient): jsPDF {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;

  // Colors
  const navyColor: [number, number, number] = [10, 23, 54]; // #0a1736
  const goldColor: [number, number, number] = [197, 160, 89]; // #c5a059
  const darkSlate: [number, number, number] = [30, 41, 59]; // #1e293b
  const lightBg: [number, number, number] = [248, 250, 252]; // #f8fafc

  const addHeaderFooter = (pageNumber: number, totalPages: number) => {
    // Top border bar
    doc.setFillColor(...goldColor);
    doc.rect(0, 0, pageWidth, 4, "F");

    // Header text
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...navyColor);
    doc.text("DIAS ACCOUNTING & TAX CONSULTING", margin, 10);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(120, 120, 120);
    doc.text("2026 UAE Corporate Tax & VAT Compliance Playbook", pageWidth - margin, 10, { align: "right" });

    doc.setDrawColor(220, 225, 230);
    doc.setLineWidth(0.3);
    doc.line(margin, 12, pageWidth - margin, 12);

    // Footer
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);
    doc.setFontSize(7);
    doc.setTextColor(140, 140, 140);
    doc.text("Confidential Practitioner Resource | Dubai, United Arab Emirates", margin, pageHeight - 8);
    doc.text(`Page ${pageNumber} of ${totalPages}`, pageWidth - margin, pageHeight - 8, { align: "right" });
  };

  // ==========================================
  // PAGE 1: COVER PAGE
  // ==========================================
  doc.setFillColor(...navyColor);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // Gold accent band
  doc.setFillColor(...goldColor);
  doc.rect(0, 40, pageWidth, 4, "F");

  // Top Badge
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...goldColor);
  doc.text("OFFICIAL 2026 EXECUTIVE COMPLIANCE HANDBOOK", pageWidth / 2, 30, { align: "center" });

  // Main Title
  doc.setFontSize(26);
  doc.setTextColor(255, 255, 255);
  doc.text("UAE CORPORATE TAX & VAT", pageWidth / 2, 65, { align: "center" });
  doc.text("COMPLIANCE PLAYBOOK", pageWidth / 2, 77, { align: "center" });

  // Subtitle
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(210, 220, 240);
  doc.text("A Strategic Guide for Dubai Mainland & Free Zone Business Leaders", pageWidth / 2, 90, { align: "center" });
  doc.text("Covering Federal Decree-Law No. 47 & EmaraTax Statutory Mandates", pageWidth / 2, 97, { align: "center" });

  // Personalized Recipient Box
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(margin + 10, 120, contentWidth - 20, 50, 4, 4, "F");
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...navyColor);
  doc.text("SPECIALLY PREPARED FOR:", margin + 18, 132);

  doc.setFontSize(14);
  doc.setTextColor(...navyColor);
  doc.text(recipient.name || "Valued Executive", margin + 18, 142);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100, 110, 120);
  if (recipient.company && recipient.company !== "N/A") {
    doc.text(`Organization: ${recipient.company}`, margin + 18, 150);
  }
  doc.text(`Email: ${recipient.email}`, margin + 18, 158);
  doc.text(`Date of Issue: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`, margin + 18, 164);

  // Key Highlights Box
  doc.setFillColor(18, 35, 75);
  doc.roundedRect(margin + 10, 185, contentWidth - 20, 60, 4, 4, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...goldColor);
  doc.text("WHAT YOU WILL MASTER INSIDE THIS GUIDE:", margin + 18, 197);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(230, 235, 245);
  const bullets = [
    "• 2026 EmaraTax Statutory Timelines & July 31st Backlog Deadline",
    "• 0% Free Zone Qualifying Income (QFZP) 5-Pillar Test",
    "• Small Business Relief (SBR) AED 3,000,000 Revenue Threshold Rules",
    "• 10-Point VAT Input Tax Recovery & Tax Invoice Audit Checklist",
    "• Bank & Backlog Reconstruction for IFRS Financial Statements",
  ];
  let bulletY = 205;
  bullets.forEach((b) => {
    doc.text(b, margin + 18, bulletY);
    bulletY += 7;
  });

  // Footer on cover
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text("DIAS ACCOUNTING & TAX CONSULTING", pageWidth / 2, 268, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(180, 190, 205);
  doc.text("FTA Registered Consultants | Dubai, United Arab Emirates | +971 50 256 0990", pageWidth / 2, 274, { align: "center" });

  // ==========================================
  // PAGE 2: CORPORATE TAX & DEADLINES
  // ==========================================
  doc.addPage();
  addHeaderFooter(2, 4);

  let y = 22;

  // Section 1 Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...navyColor);
  doc.text("1. UAE Corporate Tax Framework & 2026 Statutory Deadlines", margin, y);
  y += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...darkSlate);
  const sec1Text = "Under Federal Decree-Law No. 47 of 2022 on the Taxation of Corporations and Businesses, a headline standard rate of 9% applies to Taxable Income exceeding AED 375,000. All taxable persons (Mainland and Free Zone) must register for Corporate Tax on EmaraTax and obtain a Tax Registration Number (TRN).";
  const splitSec1 = doc.splitTextToSize(sec1Text, contentWidth);
  doc.text(splitSec1, margin, y);
  y += splitSec1.length * 4.5 + 4;

  // Warning Callout Box: FY 2025 & 2026 Deadlines
  doc.setFillColor(254, 243, 199); // Amber 100
  doc.setDrawColor(245, 158, 11); // Amber 500
  doc.roundedRect(margin, y, contentWidth, 24, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(146, 64, 14);
  doc.text("CRITICAL DEADLINE ALERT FOR FY 2025 / 2026:", margin + 5, y + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(120, 53, 15);
  doc.text("• Late EmaraTax Registration Penalty: Immediate AED 10,000 fine per entity.", margin + 5, y + 12);
  doc.text("• Return Filing & Tax Payment: Must be submitted within 9 months following the close of your financial year.", margin + 5, y + 17);
  doc.text("• Special FY 2025 Clean-Up Window: Complete bookkeeping backlogs before July 31st to prevent non-compliance.", margin + 5, y + 21);
  y += 30;

  // Section 2: Free Zone QFZP
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...navyColor);
  doc.text("2. Free Zone 0% Qualifying Person (QFZP) Matrix", margin, y);
  y += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...darkSlate);
  const sec2Text = "Free Zone entities can benefit from a 0% Corporate Tax rate on 'Qualifying Income' pursuant to Cabinet Decision No. 55/2023 & Ministerial Decision No. 139/2023, provided they satisfy ALL five statutory conditions:";
  const splitSec2 = doc.splitTextToSize(sec2Text, contentWidth);
  doc.text(splitSec2, margin, y);
  y += splitSec2.length * 4.5 + 3;

  // 5 QFZP Pillars in Table format
  const qfzpPillars = [
    { num: "01", title: "Adequate Substance", desc: "Maintain sufficient core-income generating activities, adequate full-time staff, and operating expenditure within the UAE Free Zone." },
    { num: "02", title: "Qualifying Income Only", desc: "Derive income from transactions with other Free Zone persons or specific Qualifying Activities (manufacturing, logistics, treasury, aviation, reinsurance)." },
    { num: "03", title: "De Minimis Compliance", desc: "Non-qualifying revenue must not exceed 5% of total revenue OR AED 5,000,000 (whichever is lower)." },
    { num: "04", title: "Transfer Pricing (Arm's Length)", desc: "Maintain statutory Transfer Pricing Local/Master files and adhere to the Arm's Length Principle under Article 34." },
    { num: "05", title: "Audited Financial Statements", desc: "Mandatory requirement to prepare and retain audited financial statements audited by an accredited auditor." },
  ];

  qfzpPillars.forEach((item) => {
    doc.setFillColor(...lightBg);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, contentWidth, 12.5, 1.5, 1.5, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(...goldColor);
    doc.text(item.num, margin + 3, y + 8);

    doc.setTextColor(...navyColor);
    doc.text(item.title, margin + 12, y + 8);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(80, 90, 105);
    const descSplit = doc.splitTextToSize(item.desc, contentWidth - 55);
    doc.text(descSplit, margin + 50, y + 5);

    y += 14.5;
  });

  // ==========================================
  // PAGE 3: SMALL BUSINESS RELIEF & VAT
  // ==========================================
  doc.addPage();
  addHeaderFooter(3, 4);
  y = 22;

  // Section 3: Small Business Relief
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...navyColor);
  doc.text("3. Small Business Relief (SBR) - 0% Tax up to AED 3,000,000", margin, y);
  y += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...darkSlate);
  const sbrText = "Under Ministerial Decision No. 73/2023, resident taxable persons with gross revenues equal to or below AED 3,000,000 in the relevant and prior tax periods can elect for Small Business Relief. When elected, taxable income is treated as zero for Corporate Tax purposes.";
  const splitSbr = doc.splitTextToSize(sbrText, contentWidth);
  doc.text(splitSbr, margin, y);
  y += splitSbr.length * 4.5 + 4;

  // SBR Checklist
  doc.setFillColor(240, 253, 244); // Emerald 50
  doc.setDrawColor(34, 197, 94); // Emerald 500
  doc.roundedRect(margin, y, contentWidth, 26, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(22, 101, 52);
  doc.text("SBR ELIGIBILITY & PRACTITIONER RULES:", margin + 5, y + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(20, 83, 45);
  doc.text("✓ Revenue Cap: Gross revenue across all activities must not exceed AED 3M in any tax period ending on or before Dec 31, 2026.", margin + 5, y + 12);
  doc.text("✓ EmaraTax Filing Required: SBR is not an exemption from registration or filing. You MUST file a Simplified CT Return.", margin + 5, y + 17);
  doc.text("✓ Artificial Separation: Splitting a single business across multiple licenses to stay under AED 3M is strictly banned (General Anti-Abuse Rules).", margin + 5, y + 22);
  y += 32;

  // Section 4: 10-Point VAT Checklist
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...navyColor);
  doc.text("4. 10-Point UAE VAT Compliance & Input Tax Audit Checklist", margin, y);
  y += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...darkSlate);
  doc.text("Under Federal Decree-Law No. 8 of 2017 on VAT (as amended), every input tax recovery must satisfy strict FTA audit criteria:", margin, y);
  y += 5;

  const vatChecklist = [
    "1. Valid Tax Invoice: Supplier's full legal name, address, and 15-digit TRN clearly stated.",
    "2. Sequential Numbering: Unique invoice number and issue date present on every voucher.",
    "3. Unit Price & VAT Breakout: Net amount, 5% VAT rate, and gross total clearly displayed in AED.",
    "4. Business Purpose Verification: Expenses incurred exclusively for making taxable supplies.",
    "5. Blocked Input Tax Filter: Ensure personal entertainment and personal motor vehicle expenses are excluded.",
    "6. Reverse Charge Mechanism (RCM): Properly account for imported services on Box 3 & Box 10.",
    "7. Bad Debt Relief: Specific statutory rules apply before writing off unpaid output VAT.",
    "8. 5-Year Record Retention: All commercial books, ledgers, customs documents, and invoices retained for 5+ years.",
  ];

  vatChecklist.forEach((chk) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...darkSlate);
    doc.text(chk, margin + 4, y);
    y += 5.5;
  });

  // ==========================================
  // PAGE 4: BACKLOG BOOKKEEPING & ACTION PLAN
  // ==========================================
  doc.addPage();
  addHeaderFooter(4, 4);
  y = 22;

  // Section 5: Backlog Accounting
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...navyColor);
  doc.text("5. Backlog Bookkeeping & Financial Reconstruction Workflow", margin, y);
  y += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...darkSlate);
  const backlogText = "Unorganized bank statements, unrecorded cash expenses, and missing supplier bills represent the single largest trigger for FTA audit penalties. A structured backlog reconstruction ensures your books match your EmaraTax filings with 100% precision.";
  const splitBacklog = doc.splitTextToSize(backlogText, contentWidth);
  doc.text(splitBacklog, margin, y);
  y += splitBacklog.length * 4.5 + 4;

  // Steps Box
  const steps = [
    { step: "Phase 1: Ingestion & Bank Matching", desc: "Consolidate 12+ months of bank statements, payment gateway logs, POS records, and credit cards." },
    { step: "Phase 2: IFRS General Ledger Setup", desc: "Build a compliant Chart of Accounts, categorize operating expenses, depreciation, and payroll (WPS)." },
    { step: "Phase 3: Tax Adjustments & P&L", desc: "Calculate non-deductible items, entertainment caps, intercompany loans, and generate final Balance Sheet." },
  ];

  steps.forEach((st) => {
    doc.setFillColor(...lightBg);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, contentWidth, 14, 1.5, 1.5, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(...navyColor);
    doc.text(st.step, margin + 4, y + 5.5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(100, 110, 125);
    doc.text(st.desc, margin + 4, y + 10.5);

    y += 16;
  });

  y += 4;

  // Executive CTA Card
  doc.setFillColor(...navyColor);
  doc.roundedRect(margin, y, contentWidth, 75, 4, 4, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...goldColor);
  doc.text("NEED AN AUDIT-PROOF REVIEW FOR YOUR COMPANY?", pageWidth / 2, y + 12, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(230, 240, 255);
  const ctaDesc = "Dias Accounting and Tax Consulting offers a complimentary 15-minute Executive Tax Health Review. Our team of certified accountants and FTA tax experts will evaluate your Free Zone/Mainland structure, calculate your potential tax exposure, and audit your backlog status.";
  const splitCta = doc.splitTextToSize(ctaDesc, contentWidth - 16);
  doc.text(splitCta, margin + 8, y + 20);

  // Contact Info
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(margin + 8, y + 36, contentWidth - 16, 32, 2, 2, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...navyColor);
  doc.text("Direct Contact & Consultation Booking:", margin + 12, y + 43);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...darkSlate);
  doc.text("• Lead Consultant: Glen Dias, Founder & Managing Partner", margin + 12, y + 49);
  doc.text("• Phone / WhatsApp: +971 50 256 0990", margin + 12, y + 54);
  doc.text("• Email: diasglen.gd@gmail.com | contact@diasaccounting.ae", margin + 12, y + 59);
  doc.text("• Location: Dubai, United Arab Emirates | Website: https://diasaccounting.ae", margin + 12, y + 64);

  return doc;
}

/**
 * Generates and triggers automatic browser download of the playbook
 */
export function downloadCompliancePlaybook(recipient: PlaybookRecipient): boolean {
  try {
    const doc = generateCompliancePlaybookPdf(recipient);
    const sanitizedName = (recipient.name || "Executive").replace(/[^a-zA-Z0-9]/g, "_");
    const filename = `Dias_Accounting_2026_UAE_Tax_Compliance_Playbook_${sanitizedName}.pdf`;
    doc.save(filename);
    return true;
  } catch (err) {
    console.error("Failed to generate and download PDF:", err);
    return false;
  }
}
