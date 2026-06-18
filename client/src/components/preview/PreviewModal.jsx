import { X } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectQuotationState, setPreviewOpen } from "../../store/quotationSlice.js";
import { Button } from "../ui/Button.jsx";
import { QuotationPreview } from "./QuotationPreview.jsx";

export const PreviewModal = () => {
  const dispatch = useDispatch();
  const { isPreviewOpen } = useSelector(selectQuotationState);

  useEffect(() => {
    if (!isPreviewOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") dispatch(setPreviewOpen(false));
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isPreviewOpen, dispatch]);

  if (!isPreviewOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 bg-slate-950 px-4 py-3 text-white shrink-0">
        <div>
          <h2 className="text-sm font-bold">Full Screen Preview</h2>
          <p className="text-xs text-slate-300">Printable quotation view without editor controls.</p>
        </div>
        <Button
          type="button"
          size="icon"
          variant="secondary"
          aria-label="Close preview"
          onClick={() => dispatch(setPreviewOpen(false))}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Scrollable area — click on dark sides to close */}
      <div
        className="preview-scrollbar flex-1 overflow-auto p-6"
        onClick={() => dispatch(setPreviewOpen(false))}
      >
        <div
          className="mx-auto w-fit"
          onClick={(e) => e.stopPropagation()}
        >
          <QuotationPreview id={null} />
        </div>
      </div>
    </div>
  );
};