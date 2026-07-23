import type { ExecOutcome } from "../types";

const TIMEOUT_MS = 3000;

const WORKER_SRC = `
self.onmessage = function(e){
  const { code, inputs } = e.data;
  let idx = 0;
  const out = [];
  const input = () => (idx < inputs.length ? inputs[idx++] : "");
  const fmt = v => {
    if (typeof v === "string") return v;
    if (v instanceof Error) return String(v);
    try { return typeof v === "object" && v !== null ? JSON.stringify(v) : String(v); }
    catch (_) { return String(v); }
  };
  const log = (...a) => out.push(a.map(fmt).join(" "));
  const fakeConsole = { log, info: log, warn: log, error: log, debug: log };
  try {
    const fn = new Function("console", "input", "prompt", "readline", code);
    fn(fakeConsole, input, input, input);
    self.postMessage({ ok: true, out });
  } catch (err) {
    self.postMessage({ ok: false, out, error: String(err) });
  }
};
`;

/**
 * Really executes JavaScript, sandboxed in a Web Worker so infinite loops
 * can be killed after TIMEOUT_MS. console.* is captured to stdout;
 * input()/prompt()/readline() consume stdin lines.
 */
export function runJavaScript(code: string, inputs: string[]): Promise<ExecOutcome> {
  return new Promise((resolve) => {
    let worker: Worker;
    try {
      const url = URL.createObjectURL(new Blob([WORKER_SRC], { type: "text/javascript" }));
      worker = new Worker(url);
      URL.revokeObjectURL(url);
    } catch {
      resolve(runInline(code, inputs));
      return;
    }
    const timer = setTimeout(() => {
      worker.terminate();
      resolve({
        ok: false,
        out: [],
        error: `Error: execution timed out after ${TIMEOUT_MS / 1000} seconds`,
      });
    }, TIMEOUT_MS);
    worker.onmessage = (e: MessageEvent<ExecOutcome>) => {
      clearTimeout(timer);
      worker.terminate();
      resolve(e.data);
    };
    worker.onerror = (e) => {
      clearTimeout(timer);
      worker.terminate();
      resolve({ ok: false, out: [], error: String(e.message || "worker error") });
    };
    worker.postMessage({ code, inputs });
  });
}

/** Fallback when Workers are unavailable — no timeout protection. */
function runInline(code: string, inputs: string[]): ExecOutcome {
  let idx = 0;
  const out: string[] = [];
  const input = () => (idx < inputs.length ? inputs[idx++] : "");
  const log = (...a: unknown[]) =>
    out.push(
      a
        .map((v) => (typeof v === "object" && v !== null ? JSON.stringify(v) : String(v)))
        .join(" "),
    );
  try {
    new Function("console", "input", "prompt", "readline", code)(
      { log, info: log, warn: log, error: log, debug: log },
      input,
      input,
      input,
    );
    return { ok: true, out };
  } catch (err) {
    return { ok: false, out, error: String(err) };
  }
}
