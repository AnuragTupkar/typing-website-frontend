import { jsPDF } from "jspdf";

export const generateAdmissionPDF = (data) => {
    const doc = new jsPDF();
    const pw = doc.internal.pageSize.getWidth(); // 210

    // ── Tick helper ──
    const tick = (x, y) => {
        doc.setDrawColor(0);
        doc.setLineWidth(0.6);
        doc.line(x + 0.5, y + 1.5, x + 1.5, y + 3);
        doc.line(x + 1.5, y + 3, x + 3.5, y);
    };

    // ══════════════════════════════════════════════════════════
    //  RED HEADER  (0 → 40)
    // ══════════════════════════════════════════════════════════
    doc.setFillColor(200, 30, 30);
    doc.rect(0, 0, pw, 40, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.text("Gov. Recognised", 15, 9);
    doc.text("Since 1969", pw - 15, 9, { align: "right" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("PRATIBHA COMPUTER TYPING INSTITUTE", pw / 2, 19, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text("Plot No. 18, Gut No. 90/2, Sangram Nagar, Satara Parisar, Chhatrapati Sambhajinagar.", pw / 2, 27, { align: "center" });
    doc.text("Mob. No. 8087702238, 7796202696, 9527611022", pw / 2, 33, { align: "center" });

    // ── "ADMISSION FORM" pill ──
    doc.setFillColor(23, 66, 118);
    doc.roundedRect(pw / 2 - 28, 43, 56, 7, 2, 2, "F");
    doc.setTextColor(255, 210, 0);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("\u2022 ADMISSION FORM \u2022", pw / 2, 48, { align: "center" });

    // ── G.R. No. box ──
    doc.setFillColor(200, 30, 30);
    doc.rect(168, 43, 32, 6, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text("G.R. No.", 184, 47.5, { align: "center" });
    doc.setDrawColor(180);
    doc.rect(168, 49, 32, 8);
    doc.setTextColor(0);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(String(data.grNo ?? ""), 184, 55, { align: "center" });

    // ══════════════════════════════════════════════════════════
    //  FORM BODY
    // ══════════════════════════════════════════════════════════
    const lx = 72;          // label right-align anchor
    const vx = 76;          // value left edge
    const lineEnd = 195;    // full-width underline right edge
    const shortEnd = 148;   // short underline (next to photo box)
    let y = 63;

    const label = (txt, py) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(0);
        doc.text(txt, lx, py, { align: "right" });
    };
    const val = (txt, py) => {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(0);
        if (txt) doc.text(String(txt).toUpperCase(), vx, py);
    };
    const uline = (py, end) => {
        doc.setDrawColor(170);
        doc.setLineWidth(0.3);
        doc.line(vx - 1, py + 2, end ?? lineEnd, py + 2);
    };

    const field = (lbl, v, py, short) => {
        label(lbl, py);
        val(v, py);
        uline(py, short ? shortEnd : lineEnd);
    };

    // Institute info
    label("INSTITUTE CODE :", y);
    val("510180264219", y);
    y += 6;
    label("INSTITUTE ID :", y);
    val("51018", y);
    y += 10;

    // Personal details
    field("SURNAME :", data.surname, y); y += 10;
    field("FIRST NAME :", data.firstName, y); y += 10;
    field("FATHER'S /HUSBAND'S NAME :", data.fatherName, y); y += 10;
    field("MOTHER NAME :", data.motherName, y); y += 10;

    // Mobile (two numbers on same line)
    label("MOBILE NO. :", y);
    val(data.mobile, y);
    if (data.parentMobile) {
        doc.text(String(data.parentMobile), vx + 48, y);
    }
    uline(y);
    y += 10;

    // Email
    field("EMAIL ID :", data.email, y);
    y += 10;

    // Address (2 lines)
    label("PARMENENT ADDRESS :", y);
    const addr = doc.splitTextToSize((data.address || "").toUpperCase(), 115);
    val(addr[0] || "", y);
    uline(y);
    y += 8;


    // Academic
    field("SCHOOL /COLLEGE NAME :", data.schoolName, y); y += 10;
    field("EDUCATION QUALIFICATION :", data.qualification, y); y += 10;

    // ── PHOTO BOX (right side, spanning next 4 fields) ──
    const photoX = 155;
    const photoY = y - 2;
    doc.setDrawColor(0);
    doc.setLineWidth(0.4);
    doc.rect(photoX, photoY, 35, 48);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text("PHOTO", photoX + 17.5, photoY + 20, { align: "center" });

    // Fields alongside Photo (short underlines ending before photo box)
    field("ADHAR CARD NO. :", data.adharNo, y, true); y += 10;
    field("DATE OF BIRTH :", data.dob ? new Date(data.dob).toLocaleDateString("en-IN") : "", y, true); y += 10;
    field("DATE OF ADMISSION :", data.admissionDate ? new Date(data.admissionDate).toLocaleDateString("en-IN") : "", y, true); y += 10;
    field("BATCH TIME :", Array.isArray(data.batchTime) ? data.batchTime.join(", ") : (data.batchTime || ""), y, true); y += 10;

    // Handicapped
    label("HANDICAPPED :", y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(0);
    doc.text("YES", vx, y);
    doc.rect(vx + 10, y - 3, 4, 4);
    if (data.handicapped) tick(vx + 10, y - 3);
    doc.text("NO", vx + 22, y);
    doc.rect(vx + 28, y - 3, 4, 4);
    if (!data.handicapped) tick(vx + 28, y - 3);
    y += 10;

    // ══════════════════════════════════════════════════════════
    //  COURSES  (2 rows × 3 cols)  — kept LEFT of sign box
    // ══════════════════════════════════════════════════════════
    const courses = [
        { id: "english_30", label: "ENGLISH 30 WPM" },
        { id: "hindi_40", label: "HINDI 40 WPM" },
        { id: "marathi_30", label: "MARATHI 30 WPM" },
        { id: "english_40", label: "ENGLISH 40 WPM" },
        { id: "hindi_30", label: "HINDI 30 WPM" },
        { id: "marathi_40", label: "MARATHI 40 WPM" },
    ];

    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0);

    // 3 columns × 44mm each fits in 132mm (18+132=150), safely left of sign box
    const cw = 44;
    const courseStartY = y;
    courses.forEach((c, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const cx = 18 + col * cw;
        const cy = y + row * 8;
        doc.text(c.label, cx, cy);
        doc.rect(cx + 36, cy - 3, 4, 4);
        if (data.selectedCourses?.includes(c.id)) tick(cx + 36, cy - 3);
    });
    y += 16;

    // Special Skills
    doc.text("English 50 WPM", 18, y);
    doc.rect(53, y - 3, 4, 4);
    if (data.selectedCourses?.includes("english_50")) tick(53, y - 3);

    // ── SIGN BOX (right side, beside courses) ──
    const signX = 150;
    const signY = courseStartY - 2;
    doc.setDrawColor(0);
    doc.setLineWidth(0.4);
    doc.rect(signX, signY, 45, 16);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text("SIGN", signX + 22.5, signY + 20, { align: "center" });

    y += 8;

    // Documents
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0);
    doc.text("DOCUMENTS : ADHAR CARD", 18, y);
    doc.rect(72, y - 3, 4, 4);
    if (data.submittedDocuments?.includes("adhar_card")) tick(72, y - 3);
    doc.text("T.C./L.C.", 82, y);
    doc.rect(98, y - 3, 4, 4);
    if (data.submittedDocuments?.includes("tc_lc")) tick(98, y - 3);

    // ══════════════════════════════════════════════════════════
    //  FOOTER – divider & Terms  (tight after documents)
    // ══════════════════════════════════════════════════════════
    y += 10;  // small gap after documents

    doc.setDrawColor(180);
    doc.setLineWidth(0.5);
    doc.line(10, y, pw - 10, y);

    // T&C pill
    doc.setFillColor(23, 66, 118);
    doc.roundedRect(pw / 2 - 28, y - 1, 56, 7, 2, 2, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("TERMS & CONDITIONS", pw / 2, y + 4, { align: "center" });

    doc.setTextColor(0);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    const fullWidth = pw - 30; // 15mm margin each side = 180mm usable
    const terms = [
        "1. Fee will not refunded or not transable or no subject changes in the event of a CORONA or other NATURAL DISASTER.",
        "2. Fees must be paid from the 1st to the 10th of every month. Payment after the 10th 10% late fee will be charged.",
        "3. If you practice for more than 6 months you will be required to pay on EXTRA month's Practice fee as per Government Decision GR Dt. 27/04/2023 the Gov. of Maharashtra, fee is levied as per Code No. 20230427155713421. And 800/- rs per hour will be charged for a month.",
        "4. Failure to attend computer typing course practice with PRIOR PERMISSION will result Batch Change or Cancelation of admission.",
        "5. 80% attendence is required for examination otherwise form will be cancelled.",
        "6. It is my responsibility to practice regularly. There is No GURANTEE of Passing, will follow the rules made by the institute from time to time. I and my parents AGREE to all these terms and conditions. All this information is signed"
    ];
    let ty = y + 12;
    terms.forEach(t => {
        const wrapped = doc.splitTextToSize(t, fullWidth);
        doc.text(wrapped, 15, ty);
        ty += wrapped.length * 4.5;
    });

    doc.setFont("helvetica", "bold");
    doc.text("All this information is signed", 15, ty + 3);

    doc.save(`${data.firstName || "Student"}_Admission.pdf`);
};
