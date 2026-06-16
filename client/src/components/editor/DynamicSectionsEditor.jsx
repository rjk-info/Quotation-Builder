import { ArrowDown, ArrowUp, Copy, GripVertical, Plus, Trash2 } from "lucide-react";
import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { useDispatch, useSelector } from "react-redux";
import {
  addSection,
  deleteSection,
  duplicateSection,
  moveSection,
  reorderSections,
  selectCurrentQuotation,
  updateOverview,
  updateSection
} from "../../store/quotationSlice.js";
import { Button } from "../ui/Button.jsx";
import { Field } from "../ui/Field.jsx";
import { SectionCard } from "../ui/SectionCard.jsx";
import { RichTextEditor } from "./RichTextEditor.jsx";

const DynamicBlock = ({ section, index, isFirst, isLast }) => {
  const dispatch = useDispatch();
  const ref = useRef(null);
  const dragHandleRef = useRef(null);

  const [, drop] = useDrop({
    accept: "CONTENT_BLOCK",
    hover(item) {
      if (item.index === index) return;
      dispatch(reorderSections({ from: item.index, to: index }));
      item.index = index;
    }
  });

  const [{ isDragging }, drag] = useDrag({
    type: "CONTENT_BLOCK",
    item: { index },
    collect: (monitor) => ({ isDragging: monitor.isDragging() })
  });

  drop(ref);
  drag(dragHandleRef);

  return (
    <div ref={ref} className={`rounded-md border border-slate-200 bg-slate-50 p-3 ${isDragging ? "opacity-40" : ""}`}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
          <span
            ref={dragHandleRef}
            className="inline-flex h-7 w-7 cursor-grab items-center justify-center rounded text-slate-500 hover:bg-slate-100 active:cursor-grabbing"
            role="button"
            tabIndex={0}
            title="Drag section"
            aria-label={`Drag section ${index + 1}`}
          >
            <GripVertical className="h-4 w-4" />
          </span>
          Section {index + 1}
        </div>
        <div className="flex flex-wrap gap-1">
          <Button type="button" size="icon" variant="ghost" title="Move up" disabled={isFirst}
            onClick={() => dispatch(moveSection({ id: section.id, direction: "up" }))}>
            <ArrowUp className="h-4 w-4" />
          </Button>
          <Button type="button" size="icon" variant="ghost" title="Move down" disabled={isLast}
            onClick={() => dispatch(moveSection({ id: section.id, direction: "down" }))}>
            <ArrowDown className="h-4 w-4" />
          </Button>
          <Button type="button" size="icon" variant="ghost" title="Duplicate"
            onClick={() => dispatch(duplicateSection(section.id))}>
            <Copy className="h-4 w-4" />
          </Button>
          <Button type="button" size="icon" variant="danger" title="Delete"
            onClick={() => dispatch(deleteSection(section.id))}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-3">
        <Field as="div" label="Heading">
          <RichTextEditor
            value={section.heading}
            minHeight="min-h-11"
            className="font-bold uppercase text-navy-900"
            placeholder="Section heading"
            onChange={(value) => dispatch(updateSection({ id: section.id, key: "heading", value }))}
          />
        </Field>
        <Field as="div" label="Content">
          <RichTextEditor
            value={section.content}
            onChange={(value) => dispatch(updateSection({ id: section.id, key: "content", value }))}
          />
        </Field>
      </div>
    </div>
  );
};

export const DynamicSectionsEditor = () => {
  const dispatch = useDispatch();
  const quotation = useSelector(selectCurrentQuotation);

  return (
    <>
      <SectionCard title="Description Section" description="Rich-text quotation overview used near the top of the document.">
        <RichTextEditor value={quotation.overview} onChange={(value) => dispatch(updateOverview(value))} />
      </SectionCard>

      <SectionCard title="Dynamic Content Blocks" description="Create unlimited independent sections for scope, terms, timeline, deliverables, notes, and more.">
        <div className="grid gap-3">
          {quotation.sections.map((section, index) => (
            <DynamicBlock
              key={section.id}
              section={section}
              index={index}
              isFirst={index === 0}
              isLast={index === quotation.sections.length - 1}
            />
          ))}
        </div>
        <Button type="button" variant="secondary" onClick={() => dispatch(addSection())}>
          <Plus className="h-4 w-4" />
          Add section
        </Button>
      </SectionCard>
    </>
  );
};
