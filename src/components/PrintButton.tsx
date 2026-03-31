"use client";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useState } from "react";

export default function PrintButton() {
  const [loadingPdf, setLoadingPdf] = useState(false);

  async function handlePdfDownload() {
    const target = document.getElementById("receipt-printable");
    if (!target) return;

    try {
      setLoadingPdf(true);
      const canvas = await html2canvas(target, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const image = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pageWidth = 210;
      const pageHeight = 297;
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const y = Math.max(0, (pageHeight - imgHeight) / 2);

      pdf.addImage(image, "PNG", 0, y, imgWidth, imgHeight);
      pdf.save("loan-receipt.pdf");
    } finally {
      setLoadingPdf(false);
    }
  }

  return (
    <div className="flex gap-3 print:hidden">
      <button
        type="button"
        onClick={() => window.print()}
        className="rounded-md bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-black"
      >
        Print
      </button>
      <button
        type="button"
        onClick={handlePdfDownload}
        disabled={loadingPdf}
        className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
      >
        {loadingPdf ? "Generating PDF..." : "Download PDF"}
      </button>
    </div>
  );
}
