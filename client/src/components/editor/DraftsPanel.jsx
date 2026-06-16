import { Copy, FileUp, Save, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteDraft,
  duplicateDraft,
  loadDraft,
  saveDraft,
  selectQuotationState,
  updateDraft
} from "../../store/quotationSlice.js";
import { money } from "../../utils/calculations.js";
import { Button } from "../ui/Button.jsx";

export const DraftsPanel = () => {
  const dispatch = useDispatch();
  const { drafts, activeDraftId } = useSelector(selectQuotationState);

  return (
    <aside className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Drafts</h2>
          <p className="text-xs text-slate-500">Saved locally and ready for API sync.</p>
        </div>
        <div className="flex gap-2">
          <Button type="button" size="sm" variant="secondary" onClick={() => dispatch(saveDraft())}>
            <Save className="h-4 w-4" />
            Save
          </Button>
          <Button type="button" size="sm" variant="secondary" disabled={!activeDraftId} onClick={() => dispatch(updateDraft())}>
            <FileUp className="h-4 w-4" />
            Update
          </Button>
        </div>
      </div>

      <div className="grid max-h-72 gap-2 overflow-y-auto pr-1">
        {drafts.length === 0 ? (
          <div className="rounded-md bg-slate-50 p-3 text-sm text-slate-500">No drafts saved yet.</div>
        ) : (
          drafts.map((draft) => (
            <div
              key={draft.id}
              className={`rounded-md border p-3 ${activeDraftId === draft.id ? "border-navy-500 bg-navy-50" : "border-slate-200 bg-slate-50"}`}
            >
              <button
                type="button"
                className="block w-full text-left"
                onClick={() => dispatch(loadDraft(draft.id))}
              >
                <span className="block text-sm font-semibold text-slate-800">{draft.draftName}</span>
                <span className="mt-1 block text-xs text-slate-500">
                  {draft.quotationNumber} · {money(draft.grandTotal)}
                </span>
              </button>
              <div className="mt-2 flex gap-1">
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  title="Duplicate draft"
                  aria-label="Duplicate draft"
                  onClick={() => dispatch(duplicateDraft(draft.id))}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="danger"
                  title="Delete draft"
                  aria-label="Delete draft"
                  onClick={() => dispatch(deleteDraft(draft.id))}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
};

