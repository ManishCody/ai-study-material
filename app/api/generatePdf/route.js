import { NextResponse } from "next/server";
import QRCode from "qrcode";
import jsPDF from "jspdf";
import fs from "fs/promises";
import path from "path";

export async function GET(req) {
    const url = new URL(req.url);
    const paymentId = url.searchParams.get("paymentId");
    const amount = url.searchParams.get("amount");
    const email = url.searchParams.get("email");
    const contact = url.searchParams.get("contact");
    const method = url.searchParams.get("method") || "N/A";
    const status = url.searchParams.get("status") || "N/A";

    if (!paymentId || !amount || !email || !contact) {
        return NextResponse.json(
            { message: "Missing required parameters" },
            { status: 400 }
        );
    }

    try {
        const qrCode = await QRCode.toDataURL(paymentId);
        const pdf = new jsPDF("landscape", "mm", [210, 120]);
      
        // Outer Border
        pdf.setDrawColor(0, 0, 255);
        pdf.setLineWidth(1);
        pdf.rect(10, 10, 190, 100); // Moved inside 5mm padding
      
        // Light QR Code
        pdf.addImage(qrCode, "PNG", 95, 40, 50, 50);
        pdf.setFillColor(255, 255, 255, 0.3); // Light Transparency
      
        // Header
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(24);
        pdf.setTextColor("#003366");
        pdf.text("StudyBeam", 15, 25);
        pdf.setFontSize(14);
       
      
        // Right-Aligned Info
        const pageWidth = pdf.internal.pageSize.width;
        pdf.setFontSize(12);
        pdf.setTextColor("#555555"); // Light gray color
        pdf.text("Payment Receipt", pageWidth - 50, 25);
        pdf.text(`Receipt No: ${paymentId}`, pageWidth - 85, 32);
        pdf.text(`Date: 27/2/2025`, pageWidth - 50, 40);
      
        // Payment Info
        let y = 50;
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor("#333333");
        pdf.text("Received From:", 15, y);
        pdf.setFont("helvetica", "normal");
        pdf.text(email, 60, y);
      
        y += 10;
        pdf.setFont("helvetica", "bold");
        pdf.text("Contact No:", 15, y);
        pdf.setFont("helvetica", "normal");
        pdf.text(contact, 60, y);
      
        y += 10;
        pdf.setFont("helvetica", "bold");
        pdf.text("Payment Amount:", 15, y);
        pdf.setFont("helvetica", "normal");
        pdf.text(`₹${amount}`, 60, y);
      
        y += 10;
        pdf.setFont("helvetica", "bold");
        pdf.text("Payment Mode:", 15, y);
        pdf.setFont("helvetica", "normal");
        pdf.text(method, 60, y);
      
        y += 10;
        pdf.setFont("helvetica", "bold");
        pdf.text("Payment Status:", 15, y);
        pdf.setFont("helvetica", "normal");
        pdf.text(status, 60, y);
      
        try {
          const stampPath = path.join(process.cwd(), "public", "stamp-signature.png");
          const stamp = await fs.readFile(stampPath, "base64");
          pdf.addImage(`data:image/png;base64,${stamp}`, "PNG", 150, 85, 40, 40);
        } catch (error) {
          console.log("Stamp image not found:", error);
        }
      
        const pdfBuffer = pdf.output("blob");
      
        return new Response(pdfBuffer, {
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=StudyBeam_Payment_${paymentId}.pdf`,
          },
        });
      } catch (err) {
        console.log(err);
        return NextResponse.json(
          { message: "Failed to generate PDF" },
          { status: 500 }
        );
      }
      
}
