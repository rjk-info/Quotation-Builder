import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Eraser,
  Highlighter,
  IndentDecrease,
  IndentIncrease,
  Italic,
  List,
  ListOrdered,
  Redo2,
  Strikethrough,
  Type,
  Underline,
  Undo2
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { fontFamilyOptions } from "../../utils/typography.js";

const textColors = [
  "#172033", "#1e40af", "#15803d", "#b91c1c", "#92400e",
  "#6d28d9", "#0e7490", "#be185d", "#64748b", "#ffffff"
];

const highlightColors = [
  "#fef08a", "#bbf7d0", "#bfdbfe", "#fecaca", "#e9d5ff",
  "#fed7aa", "#a5f3fc", "#fbcfe8", "#f1f5f9", "transparent"
];

const fontSizeOptions = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 60, 72];

const formatCommands = [
  { command: "bold", icon: Bold, label: "Bold" },
  { command: "italic", icon: Italic, label: "Italic" },
  { command: "underline", icon: Underline, label: "Underline" },
  { command: "strikeThrough", icon: Strikethrough, label: "Strikethrough" }
];

const alignmentCommands = [
  { command: "justifyLeft", icon: AlignLeft, label: "Align left" },
  { command: "justifyCenter", icon: AlignCenter, label: "Align center" },
  { command: "justifyRight", icon: AlignRight, label: "Align right" },
  { command: "justifyFull", icon: AlignJustify, label: "Justify" }
];

const listCommands = [
  { command: "insertUnorderedList", icon: List, label: "Bullet list" },
  { command: "insertOrderedList", icon: ListOrdered, label: "Numbered list" }
];

const paragraphCommands = [
  { command: "outdent", icon: IndentDecrease, label: "Decrease indent" },
  { command: "indent", icon: IndentIncrease, label: "Increase indent" }
];

const historyCommands = [
  { command: "undo", icon: Undo2, label: "Undo" },
  { command: "redo", icon: Redo2, label: "Redo" }
];

const clearCommands = [
  { command: "removeFormat", icon: Eraser, label: "Clear formatting" }
];

const getEditableFromNode = (node) => {
  const element = node?.nodeType === 1 ? node : node?.parentElement;
  return element?.closest?.("[data-rich-editor='true']") || null;
};

const getEditableFromSelection = () => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;
  return getEditableFromNode(selection.anchorNode);
};

const getElementFromSelection = () => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;
  return selection.anchorNode?.nodeType === 1 ? selection.anchorNode : selection.anchorNode?.parentElement;
};

const getSelectionFontFamily = () => {
  const element = getElementFromSelection();
  const fontFamily = element ? window.getComputedStyle(element).fontFamily : "";
  const matchedOption = fontFamilyOptions.find((option) => fontFamily.includes(option));
  return matchedOption || fontFamilyOptions[0];
};

const getSelectionFontSize = () => {
  const element = getElementFromSelection();
  const fontSize = element ? parseInt(window.getComputedStyle(element).fontSize, 10) : 14;
  return fontSizeOptions.includes(fontSize) ? fontSize : 14;
};

const Divider = () => <div className="mx-1 w-px self-stretch bg-slate-200" />;

const ColorPicker = ({ colors, icon: Icon, onCaptureSelection, onSelect, title }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        title={title}
        onMouseDown={(event) => {
          event.preventDefault();
          onCaptureSelection();
        }}
        onClick={() => setOpen((previous) => !previous)}
        className="flex h-8 w-8 flex-col items-center justify-center rounded hover:bg-slate-100"
      >
        <Icon className="h-4 w-4" />
        <span
          className="mt-0.5 h-1 w-4 rounded-sm border border-slate-300"
          style={{ background: title === "Text color" ? "currentColor" : "#fef08a" }}
        />
      </button>

      {open ? (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full z-50 mt-1 rounded-md border border-slate-200 bg-white p-2 shadow-lg">
            <p className="mb-1.5 text-xs font-semibold text-slate-500">{title}</p>
            <div className="grid grid-cols-5 gap-1">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  title={color}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    onCaptureSelection();
                  }}
                  onClick={() => {
                    onSelect(color);
                    setOpen(false);
                  }}
                  className="h-6 w-6 rounded border border-slate-300 transition hover:scale-110"
                  style={{ background: color === "transparent" ? "white" : color }}
                />
              ))}
            </div>
            <div className="mt-2 flex items-center gap-1">
              <input
                type="color"
                className="h-6 w-6 cursor-pointer rounded border border-slate-300"
                onMouseDown={onCaptureSelection}
                onChange={(event) => onSelect(event.target.value)}
              />
              <span className="text-xs text-slate-400">Custom</span>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export const GlobalRichToolbar = () => {
  const selectionRef = useRef(null);
  const editorRef = useRef(null);
  const [toolbarState, setToolbarState] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikeThrough: false,
    insertUnorderedList: false,
    insertOrderedList: false,
    justifyLeft: false,
    justifyCenter: false,
    justifyRight: false,
    justifyFull: false,
    fontFamily: fontFamilyOptions[0],
    fontSize: 14
  });

  const captureSelection = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const editor = getEditableFromSelection();
    if (!editor) return;

    selectionRef.current = selection.getRangeAt(0).cloneRange();
    editorRef.current = editor;
  }, []);

  const restoreSelection = () => {
    const range = selectionRef.current;
    const editor = editorRef.current;
    if (!range || !editor || !document.body.contains(editor)) return false;

    editor.focus({ preventScroll: true });
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    return true;
  };

  const emitInput = () => {
    const editor = editorRef.current;
    if (editor && document.body.contains(editor)) {
      editor.dispatchEvent(new window.Event("input", { bubbles: true }));
    }
  };

  const runCommand = (command) => {
    restoreSelection();
    document.execCommand(command, false, null);
    captureSelection();
    emitInput();
  };

  const applyTextColor = (color) => {
    restoreSelection();
    document.execCommand("foreColor", false, color);
    captureSelection();
    emitInput();
  };

  const applyHighlight = (color) => {
    restoreSelection();
    document.execCommand("hiliteColor", false, color);
    captureSelection();
    emitInput();
  };

  const applyFontFamily = (family) => {
    restoreSelection();
    document.execCommand("fontName", false, family);
    captureSelection();
    emitInput();
  };

  const applyFontSize = (size) => {
    if (!restoreSelection()) return;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return;

    const range = selection.getRangeAt(0);
    const span = document.createElement("span");
    span.style.fontSize = `${size}px`;

    try {
      range.surroundContents(span);
    } catch {
      const fragment = range.extractContents();
      span.appendChild(fragment);
      range.insertNode(span);
    }

    const nextRange = document.createRange();
    nextRange.selectNodeContents(span);
    selection.removeAllRanges();
    selection.addRange(nextRange);
    selectionRef.current = nextRange.cloneRange();
    emitInput();
  };

  useEffect(() => {
    const updateStateFromSelection = () => {
      const editor = getEditableFromSelection();
      if (!editor) return;

      captureSelection();
      setToolbarState({
        bold: document.queryCommandState("bold"),
        italic: document.queryCommandState("italic"),
        underline: document.queryCommandState("underline"),
        strikeThrough: document.queryCommandState("strikeThrough"),
        insertUnorderedList: document.queryCommandState("insertUnorderedList"),
        insertOrderedList: document.queryCommandState("insertOrderedList"),
        justifyLeft: document.queryCommandState("justifyLeft"),
        justifyCenter: document.queryCommandState("justifyCenter"),
        justifyRight: document.queryCommandState("justifyRight"),
        justifyFull: document.queryCommandState("justifyFull"),
        fontFamily: getSelectionFontFamily(),
        fontSize: getSelectionFontSize()
      });
    };

    document.addEventListener("selectionchange", updateStateFromSelection);
    return () => document.removeEventListener("selectionchange", updateStateFromSelection);
  }, [captureSelection]);

  const renderCommandButton = ({ command, icon: Icon, label }) => (
    <button
      key={command}
      type="button"
      aria-label={label}
      aria-pressed={Boolean(toolbarState[command])}
      title={label}
      onMouseDown={(event) => {
        event.preventDefault();
        captureSelection();
      }}
      onClick={() => runCommand(command)}
      className={`flex h-8 w-8 items-center justify-center rounded hover:bg-slate-100 ${
        toolbarState[command] ? "bg-navy-50 text-navy-800" : ""
      }`}
    >
      <Icon className="h-4 w-4" />
    </button>
  );

  return (
    <div className="flex flex-wrap items-center gap-1 border-t border-slate-200 bg-white px-4 py-1.5">
      <select
        className="h-8 min-w-36 rounded border border-slate-200 bg-white px-2 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-navy-300"
        value={toolbarState.fontFamily}
        title="Font family"
        aria-label="Font family"
        onMouseDown={captureSelection}
        onChange={(event) => applyFontFamily(event.target.value)}
      >
        {fontFamilyOptions.map((font) => (
          <option key={font} value={font} style={{ fontFamily: font }}>
            {font}
          </option>
        ))}
      </select>

      <Divider />

      <select
        className="h-8 w-20 rounded border border-slate-200 bg-white px-2 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-navy-300"
        value={toolbarState.fontSize}
        title="Font size"
        aria-label="Font size"
        onMouseDown={captureSelection}
        onChange={(event) => applyFontSize(Number(event.target.value))}
      >
        {fontSizeOptions.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>

      <Divider />

      {formatCommands.map(renderCommandButton)}

      <Divider />

      {alignmentCommands.map(renderCommandButton)}

      <Divider />

      {listCommands.map(renderCommandButton)}

      <Divider />

      <ColorPicker
        colors={textColors}
        icon={Type}
        onCaptureSelection={captureSelection}
        onSelect={applyTextColor}
        title="Text color"
      />
      <ColorPicker
        colors={highlightColors}
        icon={Highlighter}
        onCaptureSelection={captureSelection}
        onSelect={applyHighlight}
        title="Highlight color"
      />

      <Divider />

      {paragraphCommands.map(renderCommandButton)}

      <Divider />

      {historyCommands.map(renderCommandButton)}

      <Divider />

      {clearCommands.map(renderCommandButton)}
    </div>
  );
};
