import { useEffect, useRef } from "react";

interface Props {
  stdin: string;
  loading?: boolean;
  onStdinChange: (value: string) => void;
  onRun: () => void;
  onSkip: () => void;
  onClose: () => void;
}

export function StdinModal({ stdin, loading = false, onStdinChange, onRun, onSkip, onClose }: Props) {
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    taRef.current?.focus();
  }, []);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      if (!loading) onRun();
    }
    if (e.key === "Escape") onClose();
  };

  return (
    <div className="backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="mono modal-eyebrow">standard input</div>
          <div className="modal-title">Anything your program reads</div>
          <div className="modal-subtitle">One value per line — or skip it.</div>
        </div>
        <div className="stdin-box">
          <div className="mono stdin-box-label">
            <span className="prompt">$</span> stdin
          </div>
          <textarea
            ref={taRef}
            className="mono stdin-textarea"
            value={stdin}
            spellCheck={false}
            placeholder="type input here..."
            onChange={(e) => onStdinChange(e.target.value)}
            onKeyDown={onKeyDown}
          />
        </div>
        <div className="modal-footer">
          <button className="btn-ghost" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <div className="modal-footer-actions">
            <button className="btn-outline" onClick={onSkip} disabled={loading}>
              Skip
            </button>
            <button
              className="btn-dark"
              style={{ padding: "11px 22px", fontSize: 14, opacity: loading ? 0.7 : 1 }}
              onClick={onRun}
              disabled={loading}
            >
              <span className="mono" style={{ fontSize: 11 }}>
                ▶
              </span>{" "}
              {loading ? "Running…" : "Run"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
