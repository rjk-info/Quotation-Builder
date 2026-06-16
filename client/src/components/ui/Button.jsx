export const Button = ({ as: Component = "button", children, className, variant = "primary", size = "md", ...props }) => {
  const variants = {
    primary: "bg-navy-900 text-white hover:bg-navy-700",
    secondary: "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50",
    ghost: "text-slate-600 hover:bg-slate-100",
    danger: "bg-red-50 text-red-700 hover:bg-red-100",
    subtle: "bg-slate-100 text-slate-700 hover:bg-slate-200"
  };

  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 text-sm",
    icon: "h-9 w-9 p-0"
  };

  return (
    <Component
      className={[
        "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </Component>
  );
};
