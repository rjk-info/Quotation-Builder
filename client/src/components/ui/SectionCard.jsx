import { ChevronDown } from "lucide-react";

export const SectionCard = ({ title, description, children, locked = false }) => (
  <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
    <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 py-3">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-slate-900">{title}</h2>
          {locked ? (
            <span className="rounded-full bg-navy-50 px-2 py-0.5 text-[11px] font-semibold text-navy-700">Core</span>
          ) : null}
        </div>
        {description ? <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p> : null}
      </div>
      <ChevronDown aria-hidden="true" className="mt-1 h-4 w-4 text-slate-400" />
    </div>
    <div className="grid gap-4 p-4">{children}</div>
  </section>
);

