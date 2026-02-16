import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';

export const generateInquiryPDF = (inquiry) => {
    const doc = new jsPDF();

    // Header Layout
    // 1. Govt Details & Address
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(100);
    doc.text("Maharashtra Government Recognized | MSCE Pune", 105, 15, { align: "center" });
    doc.text("Institute Code: 51018", 105, 20, { align: "center" });

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(128);
    doc.text("Sangram Nagar, Satara Parisar, Chatrapati Sambhaji Nagar, MH 431001", 105, 25, { align: "center" });
    doc.text("Mobile: 8087702238, 7796202696", 105, 30, { align: "center" });

    // 2. Institute Name
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(33, 33, 33);
    doc.text("PRATIBHA TYPING INSTITUTE", 105, 42, { align: "center" });

    // 3. Since 1969
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    doc.text("Since 1969", 105, 48, { align: "center" });

    // Divider
    doc.setDrawColor(200);
    doc.setLineWidth(0.5);
    doc.line(20, 52, 190, 52);

    // Title & Date
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(33, 33, 33);
    doc.text("INQUIRY FORM", 20, 62);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    doc.text(`Date: ${new Date(inquiry.createdAt || Date.now()).toLocaleDateString()}`, 190, 62, { align: "right" });

    // Student Details Table
    autoTable(doc, {
        startY: 70,
        head: [['STUDENT DETAILS', '']],
        body: [
            ['Name', inquiry.name],
            ['WhatsApp Number', inquiry.whatsappNo],
            ['Purpose', (inquiry.purpose || '').toUpperCase()],
            ['Interested Course Type', (inquiry.type || '').charAt(0).toUpperCase() + (inquiry.type || '').slice(1)],
            ['Subjects', (inquiry.subjects || []).join(', ').replace(/_/g, ' ').toUpperCase()]
        ],
        theme: 'grid',
        headStyles: {
            fillColor: [245, 245, 245],
            textColor: [33, 33, 33],
            fontStyle: 'bold',
            lineColor: [200, 200, 200]
        },
        styles: {
            fontSize: 11,
            cellPadding: 5,
            textColor: [33, 33, 33],
            lineColor: [200, 200, 200]
        },
        columnStyles: {
            0: { cellWidth: 60, fontStyle: 'bold', fillColor: [252, 252, 252] }
        }
    });

    let finalY = doc.lastAutoTable.finalY + 15;

    // Fee Details Preparation
    const feeData = [];
    if (inquiry.type === 'practice') {
        feeData.push(['Daily Hours', `${inquiry.dailyHours || 0} Hours`]);
        feeData.push(['Monthly Fee', `Rs. ${(inquiry.monthlyFees || 0).toLocaleString()}/-`]);
        feeData.push(['Payment Terms', 'Monthly Advance']);
    } else if (inquiry.type === 'course') {
        const numSubjects = (inquiry.subjects || []).length;
        const totalFee = inquiry.totalFees || 0;

        feeData.push(['Selected Subjects', `${numSubjects} Subject(s)`]);
        feeData.push(['Total Course Fee', `Rs. ${totalFee.toLocaleString()}/-`]);

        // Installment sub-header row (merged cell simulation)
        feeData.push([{ content: 'INSTALLMENT PLAN', colSpan: 2, styles: { fillColor: [240, 240, 240], fontStyle: 'bold', halign: 'center' } }]);

        feeData.push(['1st Installment (Admission)', `Rs. ${(numSubjects * 2000).toLocaleString()}/-`]);
        feeData.push(['2nd Installment', `Rs. ${(numSubjects * 1500).toLocaleString()}/-`]);
        feeData.push(['3rd Installment', `Rs. ${(numSubjects * 1500).toLocaleString()}/-`]);
        feeData.push(['4th Installment', `Rs. ${(numSubjects * 1500).toLocaleString()}/-`]);
    }

    // Fee Structure Table
    autoTable(doc, {
        startY: finalY,
        head: [['FEE STRUCTURE', '']],
        body: feeData,
        theme: 'grid',
        headStyles: {
            fillColor: [245, 245, 245],
            textColor: [33, 33, 33],
            fontStyle: 'bold',
            lineColor: [200, 200, 200]
        },
        styles: {
            fontSize: 11,
            cellPadding: 5,
            textColor: [33, 33, 33],
            lineColor: [200, 200, 200]
        },
        columnStyles: {
            0: { cellWidth: 80, fontStyle: 'bold', fillColor: [252, 252, 252] }
        }
    });

    // Save string
    doc.save(`${(inquiry.name || 'Inquiry').replace(/\s+/g, '_')}_Form.pdf`);
};
