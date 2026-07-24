import { useEffect, useRef, useState } from "react";

interface LanguageSelectProps {
  language: string;
  languages: string[];
  onChange: (lang: string) => void;
}

export function LanguageSelect({ language, languages, onChange }: LanguageSelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside or pressing Escape.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const select = (lang: string) => {
    onChange(lang);
    setOpen(false);
  };

  return (
    <div className="lang-select" ref={rootRef}>
      <button
        type="button"
        className={`lang-trigger ${open ? "open" : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="lang-dot" />
        <span className="lang-trigger-label">{language || "language"}</span>
        <svg className="lang-chevron" width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
          <path
            d="M2 3.5L5 6.5L8 3.5"
            stroke="currentColor"
            strokeWidth="1.3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {open && (
        <ul className="lang-menu" role="listbox">
          {languages.map((lang) => (
            <li
              key={lang}
              role="option"
              aria-selected={lang === language}
              className={`lang-option ${lang === language ? "selected" : ""}`}
              onClick={() => select(lang)}
            >
              <span className="lang-option-dot" />
              {lang}
              {lang === language && <span className="lang-check">✓</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
