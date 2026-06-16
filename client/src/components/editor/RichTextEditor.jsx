import { useLayoutEffect, useRef } from "react";

export const RichTextEditor = ({
  value,
  onChange,
  placeholder = "Write content...",
  className = "",
  minHeight = "min-h-28"
}) => {
  const editorRef = useRef(null);
  const lastEmittedValue = useRef(value ?? "");

  useLayoutEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const nextValue = value ?? "";
    const isLocalUpdate = document.activeElement === editor && lastEmittedValue.current === nextValue;

    if (!isLocalUpdate && editor.innerHTML !== nextValue) {
      editor.innerHTML = nextValue;
    }

    lastEmittedValue.current = nextValue;
  }, [value]);

  const emitChange = () => {
    const nextValue = editorRef.current?.innerHTML ?? "";
    lastEmittedValue.current = nextValue;
    onChange(nextValue);
  };

  return (
    <div className="rounded-md border border-slate-200 bg-white">
      <div
        ref={editorRef}
        className={[
          "rich-editor rich-content w-full rounded-md px-3 py-2 text-sm leading-6 text-slate-800 outline-none focus:ring-2 focus:ring-navy-100",
          minHeight,
          className
        ].filter(Boolean).join(" ")}
        contentEditable
        data-rich-editor="true"
        data-placeholder={placeholder}
        onInput={emitChange}
        onBlur={emitChange}
        suppressContentEditableWarning
      />
    </div>
  );
};
