import { useDispatch, useSelector } from "react-redux";
import { selectCurrentQuotation, updateHeading } from "../../store/quotationSlice.js";
import { Field } from "../ui/Field.jsx";
import { SectionCard } from "../ui/SectionCard.jsx";
import { RichTextEditor } from "./RichTextEditor.jsx";

export const HeadingSectionEditor = () => {
  const dispatch = useDispatch();
  const heading = useSelector(selectCurrentQuotation).heading;

  return (
    <SectionCard title="Heading Section" description="Edit the quotation title and subtitle." locked>
      <Field as="div" label="Main heading">
        <RichTextEditor
          value={heading.text}
          minHeight="min-h-12"
          className="text-center text-2xl font-black uppercase leading-tight text-navy-900"
          placeholder="Quotation heading"
          onChange={(value) => dispatch(updateHeading({ text: value }))}
        />
      </Field>

      <Field as="div" label="Sub heading">
        <RichTextEditor
          value={heading.subText}
          minHeight="min-h-11"
          className="text-center font-semibold text-slate-600"
          placeholder="Project or quotation subtitle"
          onChange={(value) => dispatch(updateHeading({ subText: value }))}
        />
      </Field>
    </SectionCard>
  );
};
