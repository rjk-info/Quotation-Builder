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
  deleteAction
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
