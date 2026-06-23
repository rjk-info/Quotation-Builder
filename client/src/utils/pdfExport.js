import html2pdf from "html2pdf.js";

export const downloadQuotationPdf = async ({
  elementId = "quotation-preview",
  fileName,
  watermark = null
}) => {
  const element = document.getElementById(elementId);

  if (!element) {
    throw new Error("Quotation preview was not found.");
  }

  if (document.fonts?.ready) {
    await document.fonts.ready;
  }

  // Watermark canvas pehle bana lo — har page ke liye reuse hoga
  let watermarkDataUrl = null;
  let wmWidth = 0;
  let wmHeight = 0;

  if (watermark?.enabled) {
    if (watermark.type === "image" && watermark.image) {
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 1200;
      const ctx = canvas.getContext("2d");
      const img = new Image();

      await new Promise((resolve) => {
        img.onload = resolve;
        img.src = watermark.image;
      });

      ctx.save();
      ctx.globalAlpha = 0.12;
      // ctx.globalAlpha = 1;
      ctx.translate(600, 600);
      ctx.rotate(((watermark.rotation ?? -45) * Math.PI) / 180);
      ctx.drawImage(img, -350, -350, 700, 700);
      ctx.restore();

      watermarkDataUrl = canvas.toDataURL("image/png");
      // A4 page: 210mm wide, center pe ~130mm wide watermark
      wmWidth = 140;
      wmHeight = 140;

    } else if (watermark.type === "text" && watermark.text) {
      const canvas = document.createElement("canvas");
      canvas.width = 2000;
      canvas.height = 800;
      const ctx = canvas.getContext("2d");

      ctx.save();
      ctx.globalAlpha = 0.15;
      ctx.translate(1000, 400);
      ctx.rotate(((watermark.rotation ?? -45) * Math.PI) / 180);
      ctx.font = "bold 200px Arial";
      ctx.fillStyle = "#64748b";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(watermark.text.toUpperCase(), 0, 0);
      ctx.restore();

      watermarkDataUrl = canvas.toDataURL("image/png");
      // A4: 210mm wide. Text watermark thoda wider chahiye
      wmWidth = 150;
      wmHeight = 150;
    }
  }

  const worker = html2pdf()
    .set({
      margin: [0, 0, 0, 0],
      filename: fileName,
      image: {
        type: "jpeg",
        quality: 0.98
      },
      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        scrollX: 0,
        scrollY: 0
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait"
      },
      pagebreak: {
        mode: ["avoid-all", "css", "legacy"]
      }
    })
    .from(element);

  const pdf = await worker.toPdf().get("pdf");

  if (watermarkDataUrl) {
    const totalPages = pdf.internal.getNumberOfPages();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const centerX = pageWidth / 2;
    const centerY = pageHeight / 2;

    for (let page = 1; page <= totalPages; page++) {
      pdf.setPage(page);
      pdf.addImage(
        watermarkDataUrl,
        "PNG",
        centerX - wmWidth / 2,
        centerY - wmHeight / 2,
        wmWidth,
        wmHeight,
        undefined,
        "FAST"
      );
    }
  }

  pdf.save(fileName);
};