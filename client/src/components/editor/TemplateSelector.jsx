import { FileText } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { templates } from "../../data/templates.js";
import { selectQuotationState, selectTemplate } from "../../store/quotationSlice.js";
import { inputClass } from "../ui/Field.jsx";

export const TemplateSelector = () => {
  const dispatch = useDispatch();
  const { selectedTemplateId } = useSelector(selectQuotationState);

  return (
    <label className="flex min-w-0 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2">
      <FileText className="h-4 w-4 shrink-0 text-navy-700" />
      <select
        value={selectedTemplateId}
        onChange={(event) => dispatch(selectTemplate(event.target.value))}
        className={`${inputClass} border-0 p-0 focus:ring-0`}
        aria-label="Select template"
      >
        {templates.map((template) => (
          <option key={template.id} value={template.id}>
            {template.templateType}
          </option>
        ))}
      </select>
    </label>
  );
};

