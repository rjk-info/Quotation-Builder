import { ImagePlus, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentQuotation, updateFooter, updateWatermark } from "../../store/quotationSlice.js";
import { readFileAsDataUrl } from "../../utils/files.js";
import { Button } from "../ui/Button.jsx";
import { Field, inputClass } from "../ui/Field.jsx";
import { SectionCard } from "../ui/SectionCard.jsx";
import { RichTextEditor } from "./RichTextEditor.jsx";

export const FooterEditor = () => {
  const dispatch = useDispatch();
  const quotation = useSelector(selectCurrentQuotation);
  const { footer, watermark } = quotation;

  const handleSignature = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    dispatch(updateFooter({ signature: await readFileAsDataUrl(file) }));
  };

  return (
    <SectionCard title="Footer, Signature & Watermark" description="Control final note, signature image, and optional centered watermark.">
      <Field as="div" label="Footer note">
        <RichTextEditor
          value={footer.note}
          minHeight="min-h-24"
          placeholder="Footer note"
          onChange={(value) => dispatch(updateFooter({ note: value }))}
        />
      </Field>

      <div className="space-y-3 rounded-md border border-slate-100 bg-slate-50 p-3">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <input
            type="checkbox"
            checked={footer.signatureEnabled ?? true}
            onChange={(e) => dispatch(updateFooter({ signatureEnabled: e.target.checked }))}
            className="h-4 w-4 accent-navy-700"
          />
          Enable Signature
        </label>

        {(footer.signatureEnabled ?? true) ? (
          <>
            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <Field as="div" label="Signature label">
                <RichTextEditor
                  value={footer.signatureLabel}
                  minHeight="min-h-10"
                  placeholder="Signature label"
                  onChange={(value) => dispatch(updateFooter({ signatureLabel: value }))}
                />
              </Field>
              <div className="flex items-end">
                <Button as="label" variant="secondary" className="cursor-pointer">
                  <ImagePlus className="h-4 w-4" />
                  Upload signature
                  <input type="file" accept="image/*" className="sr-only" onChange={handleSignature} />
                </Button>
              </div>
            </div>

            {footer.signature ? (
              <div className="relative w-fit rounded-md border border-slate-200 bg-white p-3">
                <button
                  type="button"
                  className="absolute right-2 top-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-slate-600 shadow ring-1 ring-slate-200 transition hover:bg-red-50 hover:text-red-700"
                  title="Remove signature"
                  onClick={() => dispatch(updateFooter({ signature: "" }))}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
                <img src={footer.signature} alt="Signature" className="h-16 object-contain" />
              </div>
            ) : null}
          </>
        ) : null}
      </div>

      <div className="space-y-3 rounded-md border border-slate-100 bg-slate-50 p-3">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <input
            type="checkbox"
            checked={watermark.enabled}
            onChange={(event) => dispatch(updateWatermark({ enabled: event.target.checked }))}
            className="h-4 w-4 accent-navy-700"
          />
          Enable Watermark
        </label>

        <Field label="Watermark Type">
          <select
            className={inputClass}
            value={watermark.type || "text"}
            onChange={(event) => dispatch(updateWatermark({ type: event.target.value }))}
          >
            <option value="text">Text Watermark</option>
            <option value="image">Image Watermark</option>
          </select>
        </Field>

        {(watermark.type || "text") === "text" ? (
          <Field label="Watermark Text">
            <input
              className={inputClass}
              value={watermark.text || ""}
              onChange={(event) => dispatch(updateWatermark({ text: event.target.value }))}
              placeholder="Watermark text"
            />
          </Field>
        ) : (
          <div className="space-y-3">
            <Button as="label" variant="secondary" className="cursor-pointer">
              <ImagePlus className="h-4 w-4" />
              Upload Watermark Logo
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={async (event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  dispatch(updateWatermark({ image: await readFileAsDataUrl(file) }));
                }}
              />
            </Button>

            {watermark.image ? (
              <div className="relative w-fit rounded-md border border-slate-200 bg-white p-3">
                <button
                  type="button"
                  className="absolute right-2 top-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-slate-600 shadow"
                  onClick={() => dispatch(updateWatermark({ image: "" }))}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
                <img src={watermark.image} alt="Watermark" className="h-24 object-contain" />
              </div>
            ) : null}
          </div>
        )}
      </div>
    </SectionCard>
  );
};
