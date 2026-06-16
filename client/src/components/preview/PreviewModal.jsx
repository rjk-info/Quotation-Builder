import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { selectQuotationState, setPreviewOpen } from "../../store/quotationSlice.js";
import { Button } from "../ui/Button.jsx";
import { QuotationPreview } from "./QuotationPreview.jsx";

export const PreviewModal = () => {
  const dispatch = useDispatch();
  const { isPreviewOpen } = useSelector(selectQuotationState);

  if (!isPreviewOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80">
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-white/10 bg-slate-950 px-4 py-3 text-white">
          <div>
            <h2 className="text-sm font-bold">Full Screen Preview</h2>
            <p className="text-xs text-slate-300">Printable quotation view without editor controls.</p>
          </div>
          <Button type="button" size="icon" variant="secondary" aria-label="Close preview" onClick={() => dispatch(setPreviewOpen(false))}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="preview-scrollbar flex-1 overflow-auto p-6">
          <div className="mx-auto w-fit">
            <QuotationPreview id={null} />
          </div>
        </div>
      </div>
    </div>
  );
};

