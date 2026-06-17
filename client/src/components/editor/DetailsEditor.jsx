import { Plus, Trash2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { Button } from "../ui/Button.jsx";
import { Field, inputClass } from "../ui/Field.jsx";
import { SectionCard } from "../ui/SectionCard.jsx";
import { RichTextEditor } from "./RichTextEditor.jsx";

export const DetailsEditor = ({
  title,
  description,
  fields,
  locked = false,
  showClientInformation,
  onShowClientInformationChange,
  addAction,
  updateAction,
  deleteAction,
  sectionTitleColor,
  sectionTitleSize,
  onSectionTitleColorChange,
  onSectionTitleSizeChange,
  dividerColor,
  onDividerColorChange,
  sectionLabel,
  onSectionLabelChange
}) => {
  const dispatch = useDispatch();

  return (
    <SectionCard title={title} description={description} locked={locked}>
      {onShowClientInformationChange ? (
        <label className="flex items-center gap-2 rounded-md border border-slate-100 bg-slate-50 p-3 text-sm font-semibold text-slate-700">
          <input
            type="checkbox"
            checked={showClientInformation}
            onChange={(event) => onShowClientInformationChange(event.target.checked)}
            className="h-4 w-4 accent-navy-700"
          />
          Show Client Information
        </label>
      ) : null}
      {onSectionLabelChange ? (
        <Field label="Section Title">
          <input
            className={inputClass}
            value={sectionLabel ?? ""}
            placeholder="e.g. From, Company, Sender..."
            onChange={(e) => onSectionLabelChange(e.target.value)}
          />
        </Field>
      ) : null}

      {onSectionTitleColorChange ? (
        <div className="grid gap-3 rounded-md border border-slate-100 bg-slate-50 p-3">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">FROM / CLIENT Title Style</p>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Title Color">
              <input
                type="color"
                className="h-10 w-full rounded-md border border-slate-200 bg-white p-1"
                value={sectionTitleColor ?? "#0f172a"}
                onChange={(e) => onSectionTitleColorChange(e.target.value)}
              />
            </Field>
            <Field label="Title Size">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-lg font-bold hover:bg-slate-50"
                  onClick={() => onSectionTitleSizeChange(Math.max(8, (sectionTitleSize ?? 11) - 1))}
                >
                  −
                </button>
                <span className="flex h-10 w-12 items-center justify-center rounded-md border border-slate-200 bg-white text-sm font-semibold">
                  {sectionTitleSize ?? 11}
                </span>
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-lg font-bold hover:bg-slate-50"
                  onClick={() => onSectionTitleSizeChange(Math.min(20, (sectionTitleSize ?? 11) + 1))}
                >
                  +
                </button>
              </div>
            </Field>
          </div>
          {onDividerColorChange ? (
            <Field label="Divider Line Color">
              <input
                type="color"
                className="h-10 w-full rounded-md border border-slate-200 bg-white p-1"
                value={dividerColor ?? "#0b2343"}
                onChange={(e) => onDividerColorChange(e.target.value)}
              />
            </Field>
          ) : null}
        </div>
      ) : null}

      <div className="grid gap-3">
        {fields.map((field) => (
          <div key={field.id} className="grid grid-cols-1 gap-2 rounded-md border border-slate-100 bg-slate-50 p-3 sm:grid-cols-[0.9fr_1.4fr_auto]">
            <Field label="Label">
              <input
                className={inputClass}
                value={field.label}
                onChange={(event) => dispatch(updateAction({ id: field.id, key: "label", value: event.target.value }))}
              />
            </Field>
            <Field as="div" label="Value">
              <RichTextEditor
                value={field.value}
                minHeight="min-h-10"
                placeholder="Field value"
                onChange={(value) => dispatch(updateAction({ id: field.id, key: "value", value }))}
              />
            </Field>
            <div className="flex items-end">
              <Button
                type="button"
                variant="danger"
                size="icon"
                title="Delete field"
                aria-label="Delete field"
                onClick={() => dispatch(deleteAction(field.id))}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Button type="button" variant="secondary" onClick={() => dispatch(addAction())}>
        <Plus className="h-4 w-4" />
        Add field
      </Button>
    </SectionCard>
  );
};