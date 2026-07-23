import { useEffect, useMemo, useRef } from "react";
import { highlight } from "../lib/highlight";
import { LANGUAGES, type Language } from "../types";

interface Props {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  code: string;
  onCodeChange: (code: string) => void;
  onExecute: () => void;
}

export function EditorScreen({ language, onLanguageChange, code, onCodeChange, onExecute }: Props) {
  const taRef = useRef<HTMLTextAreaElement>(null);
  const hlRef = useRef<HTMLPreElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);

  const lineCount = useMemo(() => code.split("\n").length, [code]);
  const lineNumbers = useMemo(
    () => Array.from({ length: lineCount }, (_, i) => i + 1).join("\n"),
    [lineCount],
  );
  const highlighted = useMemo(() => highlight(code) + " ", [code]);

  const syncScroll = () => {
    const ta = taRef.current;
    if (!ta) return;
    if (hlRef.current) {
      hlRef.current.scrollTop = ta.scrollTop;
      hlRef.current.scrollLeft = ta.scrollLeft;
    }
    if (gutterRef.current) gutterRef.current.scrollTop = ta.scrollTop;
  };

  useEffect(syncScroll, [code]);

  const PAIRS: Record<string, string> = { "(": ")", "[": "]", "{": "}", '"': '"', "'": "'" };
  const CLOSERS = new Set(Object.values(PAIRS));

  // Mutations go through execCommand (not onCodeChange + slicing) so the browser's
  // native undo/redo stack stays intact — programmatically assigning textarea.value
  // resets it, but execCommand drives the same input pipeline a real keystroke would.
  const insertText = (text: string) => {
    document.execCommand("insertText", false, text);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      onExecute();
      return;
    }
    if (e.key in PAIRS) {
      const ta = e.currentTarget;
      const s = ta.selectionStart;
      const en = ta.selectionEnd;
      const opener = e.key;
      const closer = PAIRS[opener];
      if (s !== en) {
        e.preventDefault();
        insertText(opener + code.slice(s, en) + closer);
        requestAnimationFrame(() => {
          ta.selectionStart = s + 1;
          ta.selectionEnd = en + 1;
        });
        return;
      }
      if ((opener === '"' || opener === "'") && code[s] === opener) {
        e.preventDefault();
        requestAnimationFrame(() => {
          ta.selectionStart = ta.selectionEnd = s + 1;
        });
        return;
      }
      const nextChar = code[s];
      const shouldAutoClose = !nextChar || /[\s)\]}]/.test(nextChar) || CLOSERS.has(nextChar);
      if (shouldAutoClose) {
        e.preventDefault();
        insertText(opener + closer);
        requestAnimationFrame(() => {
          ta.selectionStart = ta.selectionEnd = s + 1;
        });
        return;
      }
    }
    if (CLOSERS.has(e.key) && !(e.key === '"' || e.key === "'")) {
      const ta = e.currentTarget;
      const s = ta.selectionStart;
      const en = ta.selectionEnd;
      if (s === en && code[s] === e.key) {
        e.preventDefault();
        requestAnimationFrame(() => {
          ta.selectionStart = ta.selectionEnd = s + 1;
        });
        return;
      }
    }
    if (e.key === "Backspace") {
      const ta = e.currentTarget;
      const s = ta.selectionStart;
      const en = ta.selectionEnd;
      if (s === en && s > 0) {
        const prevChar = code[s - 1];
        const nextChar = code[s];
        if (PAIRS[prevChar] === nextChar) {
          e.preventDefault();
          ta.selectionStart = s - 1;
          ta.selectionEnd = s + 1;
          document.execCommand("delete");
          return;
        }
      }
    }
    if (e.key === "Tab") {
      e.preventDefault();
      insertText("    ");
      return;
    }
    if (e.key === "Enter") {
      const ta = e.currentTarget;
      const s = ta.selectionStart;
      const lineStart = code.lastIndexOf("\n", s - 1) + 1;
      const currentLine = code.slice(lineStart, s);
      const indentMatch = currentLine.match(/^[ \t]*/);
      const indent = indentMatch ? indentMatch[0] : "";
      const trimmed = currentLine.trim();
      const opensBlock = /[{[(]$/.test(trimmed);
      const closesBlock = /^[)\]}]/.test(code.slice(s).trimStart());
      if (opensBlock) {
        e.preventDefault();
        const inner = indent + "    ";
        if (closesBlock) {
          insertText("\n" + inner + "\n" + indent);
          const newPos = s + 1 + inner.length;
          requestAnimationFrame(() => {
            ta.selectionStart = ta.selectionEnd = newPos;
          });
        } else {
          insertText("\n" + inner);
        }
        return;
      }
      if (indent) {
        e.preventDefault();
        insertText("\n" + indent);
      }
    }
  };

  return (
    <div className="screen">
      <div className="topbar">
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <span className="lang-dot" />
          <select
            className="lang-select"
            value={language}
            onChange={(e) => onLanguageChange(e.target.value as Language)}
          >
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>
        <span className="mono stats">
          {code.length} chars · {lineCount} lines
        </span>
      </div>
      <div className="editor-body">
        <div ref={gutterRef} className="mono gutter">
          {lineNumbers}
        </div>
        <div className="editor-pane">
          <pre
            ref={hlRef}
            aria-hidden="true"
            className="mono editor-highlight"
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />
          <textarea
            ref={taRef}
            className="mono editor-textarea"
            value={code}
            spellCheck={false}
            placeholder="// write some code, then run it"
            onChange={(e) => onCodeChange(e.target.value)}
            onScroll={syncScroll}
            onKeyDown={onKeyDown}
          />
        </div>
      </div>
      <div className="fab-row">
        <span className="mono shortcut-hint">⌘↵ to run</span>
        <button className="btn-dark" onClick={onExecute}>
          <span className="mono" style={{ fontSize: 12 }}>
            ▶
          </span>{" "}
          Execute
        </button>
      </div>
    </div>
  );
}
