import type { RunResult } from "../types";

interface Props {
  result: RunResult;
  onBack: () => void;
  onRunAgain: () => void;
}

export function OutputScreen({ result, onBack, onRunAgain }: Props) {
  const ok = result.status === "success";

  return (
    <div className="screen">
      <div className="topbar">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span className={`mono status-pill ${ok ? "success" : "error"}`}>
            <span className="status-dot" />
            {ok ? "success" : "error"}
          </span>
          <span className="mono run-meta">
            exit {result.exitCode} · {result.runtime}ms
            {result.simulated ? " · simulated" : ""}
          </span>
        </div>
      </div>
      <div className="output-body">
        <div className="mono output-label">
          <span className="prompt">&gt;</span> stdout
        </div>
        <pre className="mono output-text">{result.output}</pre>
      </div>
      <div className="fab-row" style={{ gap: 12 }}>
        <button
          className="btn-outline"
          style={{ padding: "13px 20px", borderRadius: 12, background: "#fbfbfa", boxShadow: "0 4px 14px rgba(50,50,50,0.08)" }}
          onClick={onBack}
        >
          ← Edit code
        </button>
        <button className="btn-dark" style={{ padding: "13px 24px" }} onClick={onRunAgain}>
          Run again
        </button>
      </div>
    </div>
  );
}
