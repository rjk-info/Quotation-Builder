import { useDispatch, useSelector } from "react-redux";
import { useState, useLayoutEffect, useRef } from "react";
import { selectCurrentQuotation, selectGrandTotal, updateQuotationMeta } from "../../store/quotationSlice.js";
import { money } from "../../utils/calculations.js";
import { defaultFontFamily, fontFamilyStack } from "../../utils/typography.js";

const RichHtml = ({ as: Component = "div", className = "", html = "" }) => (
  <Component
    className={`rich-content ${className}`}
    dangerouslySetInnerHTML={{ __html: html || "" }}
  />
);

const parseHtmlToChildren = (htmlString) => {
  if (!htmlString) return { wrapperTag: "div", children: [] };
  
  const div = document.createElement("div");
  div.innerHTML = htmlString;
  
  const firstChild = div.firstElementChild;
  if (firstChild && (firstChild.tagName === "UL" || firstChild.tagName === "OL")) {
    return {
      wrapperTag: firstChild.tagName.toLowerCase(),
      children: Array.from(firstChild.children).map(child => child.innerHTML)
    };
  }
  
  if (div.children.length > 0) {
    return {
      wrapperTag: "div",
      children: Array.from(div.children).map(child => child.outerHTML)
    };
  }
  
  if (div.textContent.trim()) {
    return {
      wrapperTag: "div",
      children: [`<p>${div.innerHTML}</p>`]
    };
  }
  
  return { wrapperTag: "div", children: [] };
};

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

  const [measuredHeights, setMeasuredHeights] = useState(null);
  const [pages, setPages] = useState([]);
  const measureRef = useRef(null);

  const showClientInformation = quotation.display?.showClientInformation ?? true;
  const dividerColor = quotation.display?.dividerColor ?? "#0b2343";
  const sectionTitleColor = quotation.display?.sectionTitleColor ?? "#0f172a";
  const sectionTitleSize = quotation.display?.sectionTitleSize ?? 11;
  const tableHeaderBg = quotation.display?.tableHeaderBg ?? "#0b2343";
  const tableHeaderColor = quotation.display?.tableHeaderColor ?? "#ffffff";
  const companyTitle = quotation.companyTitle ?? "From";
  const clientTitle = quotation.clientTitle ?? "Client";
  const watermark = quotation.watermark || { enabled: false };

  const logoJustify = {
    left: "flex-start",
    center: "center",
    right: "flex-end"
  }[quotation.logo.align] || "flex-start";

  const measureAndPaginate = () => {
    const container = measureRef.current;
    if (!container) return;

    const header = container.querySelector("#m-header");
    const details = container.querySelector("#m-details");
    const metadata = container.querySelector("#m-metadata");
    const tableThead = container.querySelector("#m-table-thead");
    const tableRows = container.querySelectorAll("#m-table-tbody tr");
    const tableTfoot = container.querySelector("#m-table-tfoot");
    const overview = container.querySelector("#m-overview");
    const customSections = container.querySelectorAll(".m-custom-section");
    const footer = container.querySelector("#m-footer");

    const headerHeight = header ? header.offsetHeight : 0;
    const detailsHeight = details ? details.offsetHeight : 0;
    const metadataHeight = metadata ? metadata.offsetHeight : 0;
    const tableTheadHeight = tableThead ? tableThead.offsetHeight : 0;
    const tableTfootHeight = tableTfoot ? tableTfoot.offsetHeight : 0;
    const overviewHeight = overview ? overview.offsetHeight : 0;
    const footerHeight = footer ? footer.offsetHeight : 0;

    const rowHeights = Array.from(tableRows).map((row) => row.offsetHeight);

    const sectionSpecs = [];
    customSections.forEach((secElement) => {
      const secId = secElement.getAttribute("data-sec-id");
      const headingEl = secElement.querySelector(".m-sec-heading");
      const headingHeight = headingEl ? headingEl.offsetHeight : 0;
      
      const childElements = secElement.querySelectorAll(".m-sec-child");
      const childHeights = Array.from(childElements).map(el => el.offsetHeight + 4);
      
      sectionSpecs.push({
        id: secId,
        headingHeight,
        childHeights
      });
    });

    setMeasuredHeights({
      H: headerHeight,
      D: detailsHeight,
      M: metadataHeight,
      T: tableTheadHeight,
      R: rowHeights,
      TF: tableTfootHeight,
      O: overviewHeight,
      S: sectionSpecs.map(s => ({ heading: s.headingHeight, children: s.childHeights })),
      F: footerHeight
    });

    // A4 height is ~1122.5px
    // Margins + borders inside page border = 52px. Page numbers + padding = ~30px.
    // BUDGET_PX = 1010px leaves a safe 30px bottom margin for perfect page-breaks.
    const BUDGET_PX = 1010;

    let computedPages = [];
    let currentPage = {
      hasHeader: false,
      hasDetails: false,
      hasMetadata: false,
      tableRows: [],
      showTableHeader: false,
      showTableFooter: false,
      hasOverview: false,
      sections: [],
      hasFooter: false
    };
    let currentHeight = 0;

    const startNewPage = () => {
      computedPages.push(currentPage);
      currentPage = {
        hasHeader: false,
        hasDetails: false,
        hasMetadata: false,
        tableRows: [],
        showTableHeader: false,
        showTableFooter: false,
        hasOverview: false,
        sections: [],
        hasFooter: false
      };
      currentHeight = 0;
    };

    // 1. Place Header, Details, Metadata (Page 1)
    currentPage.hasHeader = true;
    currentPage.hasDetails = true;
    currentPage.hasMetadata = true;
    // We add 48px to account for collapsing vertical margins and paddings between blocks
    currentHeight += headerHeight + detailsHeight + metadataHeight + 48;

    // 2. Place Table
    if (rowHeights.length > 0) {
      rowHeights.forEach((rowHeight, idx) => {
        const isFirstRowOnPage = currentPage.tableRows.length === 0;
        // Table top margin + header height offset
        const extra = isFirstRowOnPage ? (tableTheadHeight + 24) : 0;
        const needed = rowHeight + extra;

        if (currentHeight > 0 && currentHeight + needed > BUDGET_PX) {
          startNewPage();
          currentPage.showTableHeader = true;
          currentHeight += tableTheadHeight + rowHeight + 24;
        } else {
          if (isFirstRowOnPage) {
            currentPage.showTableHeader = true;
            currentHeight += tableTheadHeight + 24;
          }
          currentHeight += rowHeight;
        }
        currentPage.tableRows.push(idx);
      });

      // Place table footer
      // Adding 16px bottom margin of table section
      if (currentHeight > 0 && currentHeight + tableTfootHeight + 16 > BUDGET_PX) {
        startNewPage();
        currentPage.showTableHeader = true;
        currentPage.showTableFooter = true;
        currentHeight += tableTheadHeight + tableTfootHeight + 16;
      } else {
        currentPage.showTableFooter = true;
        currentHeight += tableTfootHeight + 16;
      }
    }

    // 3. Place Overview
    if (overviewHeight > 0) {
      if (currentHeight > 0 && currentHeight + overviewHeight + 16 > BUDGET_PX) {
        startNewPage();
      }
      currentPage.hasOverview = true;
      currentHeight += overviewHeight + 16;
    }

    // 4. Place Custom Sections (with sub-element splitting to avoid large white gaps)
    sectionSpecs.forEach((spec) => {
      const headingHeight = spec.headingHeight;
      const childHeights = spec.childHeights;

      if (childHeights.length === 0) {
        if (currentHeight > 0 && currentHeight + headingHeight + 16 > BUDGET_PX) {
          startNewPage();
        }
        currentPage.sections.push({
          id: spec.id,
          hasHeading: true,
          childIndices: []
        });
        currentHeight += headingHeight + 16;
        return;
      }

      // Check if heading + first child fits on current page (avoids orphan headings)
      const neededForFirst = headingHeight + childHeights[0] + 12 + 16;
      if (currentHeight > 0 && currentHeight + neededForFirst > BUDGET_PX) {
        startNewPage();
      }

      // Place heading
      currentPage.sections.push({
        id: spec.id,
        hasHeading: true,
        childIndices: []
      });
      currentHeight += headingHeight + 12;

      // Place list items/paragraphs one by one
      childHeights.forEach((childHeight, idx) => {
        if (currentHeight > 0 && currentHeight + childHeight + 12 > BUDGET_PX) {
          startNewPage();
          currentPage.sections.push({
            id: spec.id,
            hasHeading: false,
            childIndices: [idx]
          });
          currentHeight += childHeight + 12;
        } else {
          const currentSectionsList = currentPage.sections;
          let currentSec = currentSectionsList[currentSectionsList.length - 1];
          if (!currentSec || currentSec.id !== spec.id) {
            currentSec = {
              id: spec.id,
              hasHeading: false,
              childIndices: []
            };
            currentSectionsList.push(currentSec);
            currentHeight += 12;
          }
          currentSec.childIndices.push(idx);
          currentHeight += childHeight;
        }
      });

      // Section gap
      currentHeight += 16;
    });

    // 5. Place Footer
    if (footerHeight > 0) {
      if (currentHeight > 0 && currentHeight + footerHeight + 16 > BUDGET_PX) {
        startNewPage();
      }
      currentPage.hasFooter = true;
      currentHeight += footerHeight + 16;
    }

    computedPages.push(currentPage);
    setPages(computedPages);
  };

  useLayoutEffect(() => {
    measureAndPaginate();
    if (document.fonts?.ready) {
      document.fonts.ready.then(measureAndPaginate);
    }
  }, [quotation]);

  const handleImageLoad = () => {
    measureAndPaginate();
  };

  return (
    <>
      {/* Hidden measurement container */}
      <div
        ref={measureRef}
        style={{
          position: "absolute",
          left: "-9999px",
          top: "-9999px",
          width: "210mm",
          fontFamily: fontFamilyStack(quotation.display?.fontFamily ?? defaultFontFamily),
          boxSizing: "border-box",
          visibility: "hidden"
        }}
      >
        <div className="border-2 border-slate-500 p-6">
          <header id="m-header" className="pb-3 mb-4" style={{ borderBottom: `4px solid ${dividerColor}` }}>
            <div className="flex" style={{ justifyContent: logoJustify }}>
              {quotation.logo.src && (
                <img
                  src={quotation.logo.src}
                  alt="Company logo"
                  style={{ width: quotation.logo.width }}
                  className="max-h-24 object-contain"
                  onLoad={handleImageLoad}
                />
              )}
            </div>
            <div className="mt-2 text-center">
              <RichHtml className="text-3xl font-black uppercase leading-tight text-navy-900" html={quotation.heading.text} />
              <RichHtml className="mt-2 text-base font-semibold text-slate-500" html={quotation.heading.subText} />
            </div>
          </header>

          <section id="m-details" className={`mt-4 grid grid-cols-1 gap-6 border-b border-slate-200 pb-6 ${showClientInformation ? "md:grid-cols-[0.9fr_1.1fr]" : ""}`}>
            <DetailsList title={companyTitle} fields={quotation.companyDetails} titleColor={sectionTitleColor} titleSize={sectionTitleSize} />
            {showClientInformation && (
              <DetailsList title={clientTitle} fields={quotation.clientDetails} titleColor={sectionTitleColor} titleSize={sectionTitleSize} />
            )}
          </section>

          <section id="m-metadata" className="mt-2 flex flex-wrap items-center justify-between gap-3 rounded-md bg-slate-50 px-4 py-2 mb-4">
            <div>{quotation.quotationNumber}</div>
            <div>{quotation.issueDate}</div>
          </section>

          {quotation.pricing.rows.length > 0 && (
            <section id="m-table-container" className="mt-6 overflow-hidden rounded-lg border border-slate-200 mb-4">
              <table id="m-table" className="w-full border-collapse text-sm">
                <thead id="m-table-thead" style={{ backgroundColor: tableHeaderBg, color: tableHeaderColor }}>
                  <tr>
                    {quotation.pricing.columns.map((col) => (
                      <th key={col.id} className={`px-3 py-3 text-xs font-bold uppercase tracking-wide ${col.label?.toLowerCase() === "description" ? "text-left" : "text-center"}`}>
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody id="m-table-tbody">
                  {quotation.pricing.rows.map((row) => (
                    <tr key={row.id} className="border-b border-slate-100">
                      {quotation.pricing.columns.map((col) => (
                        <td key={col.id} className={`px-3 py-3 align-middle text-slate-700 ${col.label?.toLowerCase() === "description" ? "text-left" : "text-center"}`}>
                          {col.type === "currency" || col.type === "total" ? money(row.cells[col.id]) : col.type === "text" ? <RichHtml html={row.cells[col.id]} /> : row.cells[col.id]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
                <tfoot id="m-table-tfoot">
                  <tr className="bg-slate-50">
                    <td className="px-3 py-4 text-right font-bold text-slate-700" colSpan={quotation.pricing.columns.length - 1}>Grand Total</td>
                    <td className="px-3 py-4 text-lg font-black text-navy-900">{money(grandTotal)}</td>
                  </tr>
                </tfoot>
              </table>
            </section>
          )}

          <div id="m-overview" className="mb-4">
            <RichHtml className="text-sm leading-6" html={quotation.overview} />
          </div>

          {quotation.sections.map((section) => {
            const parsed = parseHtmlToChildren(section.content);
            const Tag = parsed.wrapperTag === "ol" ? "ol" : parsed.wrapperTag === "ul" ? "ul" : "div";
            return (
              <section key={section.id} data-sec-id={section.id} className="m-custom-section pdf-section mb-4">
                <div className="m-sec-heading">
                  <RichHtml
                    className="border-b border-slate-200 pb-2 font-extrabold uppercase tracking-wide text-navy-900"
                    html={section.heading}
                  />
                </div>
                <div className="mt-3 text-sm leading-6 rich-content">
                  <Tag>
                    {parsed.children.map((childHtml, idx) => {
                      if (parsed.wrapperTag === "ul" || parsed.wrapperTag === "ol") {
                        return (
                          <li key={idx} className="m-sec-child">
                            <RichHtml html={childHtml} />
                          </li>
                        );
                      } else {
                        return (
                          <div key={idx} className="m-sec-child">
                            <RichHtml html={childHtml} />
                          </div>
                        );
                      }
                    })}
                  </Tag>
                </div>
              </section>
            );
          })}

          <footer id="m-footer" className="relative z-10 border-t border-slate-200 pt-3 mt-4">
            <RichHtml className="text-xs leading-5 text-slate-500" html={quotation.footer.note} />
            {(quotation.footer.signatureEnabled ?? true) && (
              <div className="mt-6 flex items-end justify-between gap-4">
                <div>
                  {quotation.footer.signature ? (
                    <img src={quotation.footer.signature} alt="Signature" className="mb-2 h-16 object-contain" onLoad={handleImageLoad} />
                  ) : (
                    <div className="mb-2 h-16 w-44 border-b border-slate-300" />
                  )}
                  <RichHtml className="text-xs font-semibold text-slate-700" html={quotation.footer.signatureLabel} />
                </div>
                <div className="text-right text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Client-ready quotation
                </div>
              </div>
            )}
          </footer>
        </div>
      </div>

      {/* Visible page-by-page rendering */}
      <div id={id || undefined} className="quotation-container flex flex-col items-center select-text">
        {pages.map((page, pageIdx) => (
          <article
            key={pageIdx}
            className="quotation-page relative bg-white"
            style={{
              fontFamily: fontFamilyStack(quotation.display?.fontFamily ?? defaultFontFamily)
            }}
          >
            {/* Watermark Overlay */}
            {watermark.enabled && (
              <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none flex items-center justify-center">
                {watermark.type === "image" && watermark.image && (
                  <img
                    src={watermark.image}
                    alt="Watermark"
                    style={{
                      width: watermark.size ? `${watermark.size}px` : "450px",
                      opacity: watermark.opacity ?? 0.15,
                      transform: `rotate(${watermark.rotation ?? -45}deg)`,
                      transformOrigin: "center center",
                      maxWidth: "90%",
                      maxHeight: "90%",
                      objectContain: "contain"
                    }}
                  />
                )}
                {watermark.type === "text" && watermark.text && (
                  <div
                    className="font-black uppercase tracking-widest text-slate-400"
                    style={{
                      transform: `rotate(${watermark.rotation ?? -45}deg)`,
                      transformOrigin: "center center",
                      fontSize: watermark.size ? `${watermark.size / 60}rem` : "6rem",
                      fontWeight: 900,
                      opacity: watermark.opacity ?? 0.10,
                      whiteSpace: "nowrap"
                    }}
                  >
                    {watermark.text}
                  </div>
                )}
              </div>
            )}

            {/* Inner printable boundary frame */}
            <div className="relative z-10 border-2 border-slate-500 p-6 h-full flex flex-col justify-between">
              <div>
                {/* 1. Header */}
                {page.hasHeader && (
                  <header className="pb-3 mb-4" style={{ borderBottom: `4px solid ${dividerColor}` }}>
                    <div className="flex" style={{ justifyContent: logoJustify }}>
                      {quotation.logo.src && (
                        <img
                          src={quotation.logo.src}
                          alt="Company logo"
                          style={{ width: quotation.logo.width }}
                          className="max-h-24 object-contain"
                        />
                      )}
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
                )}

                {/* 2. Details */}
                {page.hasDetails && (
                  <section
                    className={`mt-4 grid grid-cols-1 gap-6 border-b border-slate-200 pb-6 ${
                      showClientInformation ? "md:grid-cols-[0.9fr_1.1fr]" : ""
                    }`}
                  >
                    <DetailsList title={companyTitle} fields={quotation.companyDetails} titleColor={sectionTitleColor} titleSize={sectionTitleSize} />
                    {showClientInformation && (
                      <DetailsList title={clientTitle} fields={quotation.clientDetails} titleColor={sectionTitleColor} titleSize={sectionTitleSize} />
                    )}
                  </section>
                )}

                {/* 3. Metadata */}
                {page.hasMetadata && (
                  <section className="mt-2 flex flex-wrap items-center justify-between gap-3 rounded-md bg-slate-50 px-4 py-2 mb-4">
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
                )}

                {/* 4. Table */}
                {page.tableRows.length > 0 && (
                  <section className="mt-6 overflow-hidden rounded-lg border border-slate-200 mb-4">
                    <table className="w-full border-collapse text-sm">
                      {page.showTableHeader && (
                        <thead style={{ backgroundColor: tableHeaderBg, color: tableHeaderColor }}>
                          <tr>
                            {quotation.pricing.columns.map((column) => (
                              <th
                                key={column.id}
                                className={`px-3 py-3 text-xs font-bold uppercase tracking-wide ${
                                  column.label?.toLowerCase() === "description" ? "text-left" : "text-center"
                                }`}
                              >
                                {column.label}
                              </th>
                            ))}
                          </tr>
                        </thead>
                      )}
                      <tbody>
                        {page.tableRows.map((rowIdx) => {
                          const row = quotation.pricing.rows[rowIdx];
                          if (!row) return null;
                          return (
                            <tr key={row.id} className="border-b border-slate-100">
                              {quotation.pricing.columns.map((column) => (
                                <td
                                  key={column.id}
                                  className={`px-3 py-3 align-middle text-slate-700 ${
                                    column.label?.toLowerCase() === "description" ? "text-left" : "text-center"
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
                          );
                        })}
                      </tbody>
                      {page.showTableFooter && (
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
                      )}
                    </table>
                  </section>
                )}

                {/* 5. Overview */}
                {page.hasOverview && (
                  <div className="mb-4">
                    <RichHtml className="text-sm leading-6" html={quotation.overview} />
                  </div>
                )}

                {/* 6. Custom Sections (with sub-element splitting across pages) */}
                {page.sections.map((secSpec, idx) => {
                  const section = quotation.sections.find((s) => s.id === secSpec.id);
                  if (!section) return null;

                  const parsed = parseHtmlToChildren(section.content);
                  const Tag = parsed.wrapperTag === "ol" ? "ol" : parsed.wrapperTag === "ul" ? "ul" : "div";

                  return (
                    <section key={`${secSpec.id}-${idx}`} className="pdf-section mb-4">
                      {secSpec.hasHeading && (
                        <RichHtml
                          className="border-b border-slate-200 pb-2 font-extrabold uppercase tracking-wide text-navy-900"
                          html={section.heading}
                        />
                      )}
                      {secSpec.childIndices.length > 0 && (
                        <div className="mt-3 text-sm leading-6 rich-content">
                          <Tag
                            start={parsed.wrapperTag === "ol" ? secSpec.childIndices[0] + 1 : undefined}
                            style={parsed.wrapperTag === "ol" ? { counterReset: `ol-counter ${secSpec.childIndices[0]}` } : undefined}
                          >
                            {secSpec.childIndices.map((childIdx) => {
                              const childHtml = parsed.children[childIdx];
                              if (!childHtml) return null;
                              if (parsed.wrapperTag === "ul" || parsed.wrapperTag === "ol") {
                                return (
                                  <li key={childIdx}>
                                    <RichHtml html={childHtml} />
                                  </li>
                                );
                              } else {
                                return (
                                  <RichHtml key={childIdx} html={childHtml} />
                                );
                              }
                            })}
                          </Tag>
                        </div>
                      )}
                    </section>
                  );
                })}
              </div>

              {/* 7. Footer & Page Numbers */}
              <div>
                {page.hasFooter && (
                  <footer className="relative z-10 border-t border-slate-200 pt-3 mt-4">
                    <RichHtml className="text-xs leading-5 text-slate-500" html={quotation.footer.note} />
                    {(quotation.footer.signatureEnabled ?? true) && (
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
                    )}
                  </footer>
                )}

                {/* Visual A4 Page Number indicator */}
                <div className="text-center text-xs font-semibold text-slate-400 mt-2 select-none border-t border-slate-100 pt-1">
                  Page {pageIdx + 1} of {pages.length}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
};
