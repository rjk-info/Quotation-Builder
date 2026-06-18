import { useDispatch, useSelector } from "react-redux";
import { selectCurrentQuotation, updateDisplaySettings } from "../../store/quotationSlice.js";
import { fontFamilyOptions } from "../../utils/typography.js";

export const GlobalFontSelector = () => {
  const dispatch = useDispatch();
  const quotation = useSelector(selectCurrentQuotation);
  const currentFont = quotation.display?.fontFamily ?? "Inter";

  return (
    <div className="flex items-center gap-2">
      <label className="text-xs font-semibold text-slate-500 whitespace-nowrap">
        Font Family
      </label>
      <select
        className="h-9 rounded-md border border-slate-200 bg-white px-2 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-navy-300"
        value={currentFont}
        onChange={(e) => dispatch(updateDisplaySettings({ fontFamily: e.target.value }))}
      >
        {fontFamilyOptions.map((font) => (
          <option key={font} value={font} style={{ fontFamily: font }}>
            {font}
          </option>
        ))}
      </select>
    </div>
  );
};