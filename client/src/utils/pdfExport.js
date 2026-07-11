import html2pdf from "html2pdf.js";

export const downloadQuotationPdf = async ({
  elementId = "quotation-preview",
  fileName
}) => {
  const element = document.getElementById(elementId);

  if (!element) {
    throw new Error("Quotation preview was not found.");
  }

  if (document.fonts?.ready) {
    await document.fonts.ready;
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
        mode: ["css"],
        avoid: ".quotation-page"
      }
    })
    .from(element);

  await worker.save();
};