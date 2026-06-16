import { ImagePlus, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentQuotation, updateLogo } from "../../store/quotationSlice.js";
import { readFileAsDataUrl } from "../../utils/files.js";
import { Button } from "../ui/Button.jsx";
import { Field } from "../ui/Field.jsx";
import { SectionCard } from "../ui/SectionCard.jsx";

export const LogoSectionEditor = () => {
  const dispatch = useDispatch();
  const logo = useSelector(selectCurrentQuotation).logo;

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const src = await readFileAsDataUrl(file);
    dispatch(updateLogo({ src }));
  };

  return (
    <SectionCard title="Logo Section" description="Upload, remove, and resize the company logo." locked>
      <div className="flex flex-wrap items-center gap-3 rounded-md bg-slate-50 p-3">
        <div className="relative flex h-16 min-w-32 items-center justify-center rounded-md border border-slate-200 bg-white px-3">
          {logo.src ? (
            <>
              <button
                type="button"
                className="absolute right-2 top-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-slate-600 shadow ring-1 ring-slate-200 transition hover:bg-red-50 hover:text-red-700 dark:bg-slate-900/90 dark:text-slate-100 dark:ring-slate-700"
                title="Remove logo"
                aria-label="Remove logo"
                onClick={() => dispatch(updateLogo({ src: "" }))}
              >
                <X className="h-3.5 w-3.5" />
              </button>
              <img src={logo.src} alt="Company logo" className="max-h-12 object-contain" />
            </>
          ) : (
            "No logo"
          )}
        </div>
        <Button as="label" variant="secondary" className="relative cursor-pointer">
          <ImagePlus className="h-4 w-4" />
          Upload logo
          <input type="file" accept="image/*" className="sr-only" onChange={handleFile} />
        </Button>
      </div>

      <Field label="Logo width">
        <input
          type="range"
          min="80"
          max="320"
          value={logo.width}
          onChange={(event) => dispatch(updateLogo({ width: Number(event.target.value) }))}
          className="accent-navy-700"
        />
      </Field>
    </SectionCard>
  );
};
