import { Download, Eye, FilePlus2, Rocket } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GlobalRichToolbar } from "./components/editor/GlobalRichToolbar.jsx";
import { EditorPanel } from "./components/editor/EditorPanel.jsx";
import { TemplateSelector } from "./components/editor/TemplateSelector.jsx";
import { PreviewModal } from "./components/preview/PreviewModal.jsx";
import { QuotationPreview } from "./components/preview/QuotationPreview.jsx";
import { Button } from "./components/ui/Button.jsx";
import { createNewQuotation, selectCurrentQuotation, setPreviewOpen } from "./store/quotationSlice.js";
import { downloadQuotationPdf } from "./utils/pdfExport.js";
import { GlobalFontSelector } from "./components/editor/GlobalFontSelector.jsx";

const App = () => {
  const dispatch = useDispatch();
  const quotation = useSelector(selectCurrentQuotation);
  const [status, setStatus] = useState("");

  const handlePdf = async () => {
    setStatus("Preparing PDF...");
    try {
      await downloadQuotationPdf({
        elementId: "quotation-preview-export",
        fileName: `${quotation.quotationNumber}-${quotation.templateType}.pdf`,
        watermark: quotation.watermark
      });
      setStatus("PDF exported.");
    } catch (error) {
      setStatus(error.message);
    }
  };

  return (
    <>
      <div className="app-shell min-h-screen bg-slate-100">
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="px-4 py-3">
            <div className="mx-auto flex max-w-[1800px] flex-wrap items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-navy-900 text-white">
                  <Rocket className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h1 className="truncate text-lg font-black text-slate-950">Quotation Builder</h1>
                  <p className="truncate text-xs font-medium text-slate-500">
                    {quotation.quotationNumber} · {quotation.templateType}
                  </p>
                </div>
              </div>

              <div className="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-2">
                <TemplateSelector />
                <GlobalFontSelector />
                <Button type="button" variant="secondary" onClick={() => dispatch(createNewQuotation())}>
                  <FilePlus2 className="h-4 w-4" />
                  New
                </Button>
                <Button type="button" variant="secondary" onClick={() => dispatch(setPreviewOpen(true))}>
                  <Eye className="h-4 w-4" />
                  Preview
                </Button>
                <Button type="button" onClick={handlePdf}>
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
              </div>
            </div>
            {status ? (
              <div className="mx-auto mt-2 max-w-[1800px] text-xs font-semibold text-navy-700">{status}</div>
            ) : null}
          </div>
          <GlobalRichToolbar />
        </header>

        <main className="mx-auto grid max-w-[1800px] grid-cols-1 gap-5 p-4 xl:grid-cols-[minmax(420px,580px)_1fr]">
          <section className="min-w-0">
            <EditorPanel />
          </section>
          <section className="preview-scrollbar hidden h-[calc(100vh-88px)] overflow-auto rounded-lg bg-slate-200/70 p-5 xl:block">
            <div className="mx-auto w-fit">
              <QuotationPreview id="quotation-preview-live" />
            </div>
          </section>
          <section className="xl:hidden">
            <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
              Use Preview for the printable quotation view on smaller screens.
            </div>
          </section>
        </main>

        <div className="pointer-events-none fixed left-0 top-0 -z-10 translate-x-[-120%]">
          <QuotationPreview id="quotation-preview-export" />
        </div>
      </div>
      <PreviewModal />
    </>
  );
};

export default App;