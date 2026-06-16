export const Field = ({ label, hint, children, as: Component = "label" }) => (
  <Component className="grid gap-1.5 text-sm">
    <span className="font-semibold text-slate-700">{label}</span>
    {children}
    {hint ? <span className="text-xs text-slate-500">{hint}</span> : null}
  </Component>
);

export const inputClass =
  "w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-navy-500 focus:ring-2 focus:ring-navy-100";
