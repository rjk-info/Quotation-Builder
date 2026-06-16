import { GripVertical, Plus, Trash2 } from "lucide-react";
import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { useDispatch, useSelector } from "react-redux";
import {
  addPricingColumn,
  addPricingRow,
  deletePricingColumn,
  deletePricingRow,
  reorderPricingColumns,
  reorderPricingRows,
  selectCurrentQuotation,
  updatePricingCell,
  updatePricingColumn
} from "../../store/quotationSlice.js";
import { money } from "../../utils/calculations.js";
import { Button } from "../ui/Button.jsx";
import { inputClass } from "../ui/Field.jsx";
import { SectionCard } from "../ui/SectionCard.jsx";
import { RichTextEditor } from "./RichTextEditor.jsx";

const DraggableHeader = ({ column, index }) => {
  const dispatch = useDispatch();
  const ref = useRef(null);

  const [, drop] = useDrop({
    accept: "PRICING_COLUMN",
    hover(item) {
      if (item.index === index) return;
      dispatch(reorderPricingColumns({ from: item.index, to: index }));
      item.index = index;
    }
  });

  const [{ isDragging }, drag] = useDrag({
    type: "PRICING_COLUMN",
    item: { index },
    collect: (monitor) => ({ isDragging: monitor.isDragging() })
  });

  drag(drop(ref));

  return (
    <th ref={ref} className={`min-w-40 border-b border-slate-200 bg-slate-50 p-2 text-left ${isDragging ? "opacity-40" : ""}`}>
      <div className="flex items-center gap-2">
        <GripVertical className="h-4 w-4 shrink-0 text-slate-400" />
        <input
          className="w-full rounded border border-transparent bg-transparent px-2 py-1 text-xs font-bold uppercase tracking-wide text-slate-600 outline-none focus:border-navy-200 focus:bg-white"
          value={column.label}
          onChange={(event) => dispatch(updatePricingColumn({ id: column.id, key: "label", value: event.target.value }))}
        />
        {column.type !== "total" ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            title="Delete column"
            aria-label="Delete column"
            onClick={() => dispatch(deletePricingColumn(column.id))}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        ) : null}
      </div>
    </th>
  );
};

const DraggableRow = ({ row, index, columns }) => {
  const dispatch = useDispatch();
  const ref = useRef(null);

  const [, drop] = useDrop({
    accept: "PRICING_ROW",
    hover(item) {
      if (item.index === index) return;
      dispatch(reorderPricingRows({ from: item.index, to: index }));
      item.index = index;
    }
  });

  const [{ isDragging }, drag] = useDrag({
    type: "PRICING_ROW",
    item: { index },
    collect: (monitor) => ({ isDragging: monitor.isDragging() })
  });

  drag(drop(ref));

  return (
    <tr ref={ref} className={isDragging ? "opacity-40" : ""}>
      <td className="sticky left-0 z-10 border-b border-slate-100 bg-white p-2">
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-slate-400" />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            title="Delete row"
            aria-label="Delete row"
            onClick={() => dispatch(deletePricingRow(row.id))}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </td>
      {columns.map((column) => (
        <td key={column.id} className="border-b border-slate-100 p-2 align-top">
          {column.type === "total" ? (
            <div className="rounded-md bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">
              {money(row.cells[column.id])}
            </div>
          ) : (
            column.type === "text" ? (
              <RichTextEditor
                value={row.cells[column.id] ?? ""}
                minHeight="min-h-10"
                placeholder="Cell content"
                onChange={(value) => dispatch(updatePricingCell({ rowId: row.id, columnId: column.id, value }))}
              />
            ) : (
              <input
                className={inputClass}
                type="number"
                value={row.cells[column.id] ?? ""}
                onChange={(event) =>
                  dispatch(updatePricingCell({ rowId: row.id, columnId: column.id, value: event.target.value }))
                }
              />
            )
          )}
        </td>
      ))}
    </tr>
  );
};

export const PricingTableEditor = () => {
  const dispatch = useDispatch();
  const quotation = useSelector(selectCurrentQuotation);
  const { pricing } = quotation;

  return (
    <SectionCard title="Dynamic Pricing Table" description="Edit spreadsheet-style rows and columns with automatic totals. Drag handles reorder rows and columns.">
      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="min-w-full border-collapse bg-white">
          <thead>
            <tr>
              <th className="sticky left-0 z-20 w-24 border-b border-slate-200 bg-slate-50 p-2 text-left text-xs font-bold uppercase text-slate-500">
                Row
              </th>
              {pricing.columns.map((column, index) => (
                <DraggableHeader key={column.id} column={column} index={index} />
              ))}
            </tr>
          </thead>
          <tbody>
            {pricing.rows.map((row, index) => (
              <DraggableRow key={row.id} row={row} index={index} columns={pricing.columns} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="secondary" onClick={() => dispatch(addPricingRow())}>
          <Plus className="h-4 w-4" />
          Add row
        </Button>
        <Button type="button" variant="secondary" onClick={() => dispatch(addPricingColumn())}>
          <Plus className="h-4 w-4" />
          Add column
        </Button>
      </div>
    </SectionCard>
  );
};
