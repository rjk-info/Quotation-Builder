import { useDispatch, useSelector } from "react-redux";
import { selectCurrentQuotation, selectGrandTotal, updateQuotationMeta } from "../../store/quotationSlice.js";
import { money } from "../../utils/calculations.js";
import { defaultFontFamily, fontFamilyStack } from "../../utils/typography.js";

const RichHtml = ({ as: Component = "div", className = "", html = "" }) => (
  <Component
    className={`rich-content ${className}`}
    dangerouslySetInnerHTML={{ __html: html || "" }}
  />
);

const DetailsList = ({ title, fields, titleColor, titleSize }) => (
  <div>
    <h3
      className="mb-2 font-bold uppercase tracking-wide"
      style={{ fontSize: titleSize, color: titleColor }}
    >
      {title}
    </h3>
    <div className="grid gap-1 text-sm">
      {(fields || [])
        .filter((field) => field.label || field.value)
        .map((field) => (
          <div
            key={field.id}
            className="grid grid-cols-[140px_1fr] gap-2"
          >
            <span className="font-semibold text-slate-600">
              {field.label}
            </span>

            <RichHtml className="break-words text-slate-800" html={field.value} />
          </div>
        ))}
    </div>
  </div>
);

export const QuotationPreview = ({ id = "quotation-preview" }) => {
  const dispatch = useDispatch();
  const quotation = useSelector(selectCurrentQuotation);
  const grandTotal = useSelector(selectGrandTotal);
  const showClientInformation = quotation.display?.showClientInformation ?? true;
  const dividerColor = quotation.display?.dividerColor ?? "#0b2343";
  const sectionTitleColor = quotation.display?.sectionTitleColor ?? "#0f172a";
  const sectionTitleSize = quotation.display?.sectionTitleSize ?? 11;
  const tableHeaderBg = quotation.display?.tableHeaderBg ?? "#0b2343";
  const tableHeaderColor = quotation.display?.tableHeaderColor ?? "#ffffff";
  const companyTitle = quotation.companyTitle ?? "From";
  const clientTitle = quotation.clientTitle ?? "Client";
  const logoJustify = {
    left: "flex-start",
    center: "center",
    right: "flex-end"
  }[quotation.logo.align] || "flex-start";

  return (
    <article
      id={id || undefined}
      className="quotation-page relative bg-white"
      style={{
        fontFamily: fontFamilyStack(quotation.display?.fontFamily ?? defaultFontFamily)
      }}
    >
      {quotation.watermark.enabled ? (
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          {quotation.watermark.type === "image" &&
            quotation.watermark.image && (
              <img
                src={quotation.watermark.image}
                alt="Watermark"
                className="select-none"
                style={{
                  width: "85%",
                  maxWidth: "900px",
                  opacity: 0.15,
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%) rotate(-45deg)",
                  pointerEvents: "none",
                  userSelect: "none"
                }}
              />
            )}

          {quotation.watermark.type === "text" &&
            quotation.watermark.text && (
              <div
                className="select-none font-black uppercase tracking-widest"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: `translate(-50%, -50%) rotate(${quotation.watermark.rotation ?? -45}deg)`,
                  transformOrigin: "center center",
                  fontSize: "8rem",
                  fontWeight: 900,
                  color: "#64748b",
                  opacity: 0.10,
                  whiteSpace: "nowrap",
                  pointerEvents: "none",
                  userSelect: "none"
                }}
              >
                {quotation.watermark.text}
              </div>
            )}
        </div>
      ) : null}

      <div className="relative z-10 rounded-lg border-2 border-slate-500 p-6">
        <header className="pb-3" style={{ borderBottom: `4px solid ${dividerColor}` }}>
          <div className="mb-0 flex" style={{ justifyContent: logoJustify }}>
            {quotation.logo.src ? (
              <img
                src={quotation.logo.src}
                alt="Company logo"
                style={{ width: quotation.logo.width }}
                className="max-h-24 object-contain"
              />
            ) : null}
          </div>
          <div className="mt-2 text-center">
            <RichHtml
              className="text-3xl font-black uppercase leading-tight text-navy-900"
              html={quotation.heading.text}
            />
            <RichHtml
              className="mt-2 text-base font-semibold text-slate-500"
              html={quotation.heading.subText}
            />
          </div>
        </header>

        <section
          className={`mt-4 grid grid-cols-1 gap-6 border-b border-slate-200 pb-6 ${showClientInformation ? "md:grid-cols-[0.9fr_1.1fr]" : ""
            }`}
        >
          <DetailsList title={companyTitle} fields={quotation.companyDetails} titleColor={sectionTitleColor} titleSize={sectionTitleSize} />
          {showClientInformation ? (
            <DetailsList title={clientTitle} fields={quotation.clientDetails} titleColor={sectionTitleColor} titleSize={sectionTitleSize} />
          ) : null}
        </section>

        <section className="mt-2 flex flex-wrap items-center justify-between gap-3 rounded-md bg-slate-50 px-4 py-2">
          <div className="flex flex-col items-center">
            <span className="block text-xs font-bold uppercase tracking-wide text-slate-500">Quotation No.</span>
            <input
              className="font-bold text-navy-900 bg-transparent border-none outline-none text-center"
              value={quotation.quotationNumber ?? ""}
              onChange={(e) => dispatch(updateQuotationMeta({ quotationNumber: e.target.value }))}
            />
          </div>
          <div className="flex flex-col items-center">
            <span className="block text-xs font-bold uppercase tracking-wide text-slate-500">Issue Date</span>
            <input
              type="date"
              className="font-semibold text-slate-700 bg-transparent border-none outline-none cursor-pointer text-center"
              style={{ colorScheme: "light" }}
              value={quotation.issueDate ?? new Date().toISOString().split("T")[0]}
              onChange={(e) => dispatch(updateQuotationMeta({ issueDate: e.target.value }))}
            />
          </div>
        </section>

        <section className="mt-6 overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full border-collapse text-sm">
            <thead style={{ backgroundColor: tableHeaderBg, color: tableHeaderColor }}>
              <tr>
                {quotation.pricing.columns.map((column) => (
                  <th
                    key={column.id}
                    className={`px-3 py-3 text-xs font-bold uppercase tracking-wide ${column.label?.toLowerCase() === "description" ? "text-left" : "text-center"
                      }`}
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {quotation.pricing.rows.map((row) => (
                <tr key={row.id} className="border-b border-slate-100">
                  {quotation.pricing.columns.map((column) => (
                    <td
                      key={column.id}
                      className={`px-3 py-3 align-middle text-slate-700 ${column.label?.toLowerCase() === "description" ? "text-left" : "text-center"
                        }`}
                    >
                      {column.type === "currency" || column.type === "total" ? (
                        money(row.cells[column.id])
                      ) : column.type === "text" ? (
                        <RichHtml html={row.cells[column.id]} />
                      ) : (
                        row.cells[column.id]
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-50">
                <td
                  className="px-3 py-4 text-right font-bold text-slate-700"
                  colSpan={Math.max(1, quotation.pricing.columns.length - 1)}
                >
                  Grand Total
                </td>
                <td className="px-3 py-4 text-lg font-black text-navy-900">
                  {money(grandTotal)}
                </td>
              </tr>
            </tfoot>
          </table>
        </section>

        <RichHtml className="mt-6 text-sm leading-6" html={quotation.overview} />

        <div className="mt-6 grid gap-5">
          {quotation.sections.map((section) => (
            <section key={section.id} className="pdf-section">
              <RichHtml
                className="border-b border-slate-200 pb-2 font-extrabold uppercase tracking-wide text-navy-900"
                html={section.heading}
              />
              <RichHtml className="mt-3 text-sm leading-6" html={section.content} />
            </section>
          ))}
        </div>

        <footer className="relative z-10 mt-4 border-t border-slate-200 pt-3">
          <RichHtml className="text-xs leading-5 text-slate-500" html={quotation.footer.note} />

          {(quotation.footer.signatureEnabled ?? true) ? (
            <div className="mt-6 flex items-end justify-between gap-4">
              <div>
                {quotation.footer.signature ? (
                  <img src={quotation.footer.signature} alt="Signature" className="mb-2 h-16 object-contain" />
                ) : (
                  <div className="mb-2 h-16 w-44 border-b border-slate-300" />
                )}
                <RichHtml
                  className="text-xs font-semibold text-slate-700"
                  html={quotation.footer.signatureLabel}
                />
              </div>
              <div className="text-right text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Client-ready quotation
              </div>
            </div>
          ) : null}
        </footer>
      </div>
    </article>
  );
};
