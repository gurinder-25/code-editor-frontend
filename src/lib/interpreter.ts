import type { ExecOutcome } from "../types";

/**
 * Mini pattern-matching interpreter for the non-JavaScript languages.
 * It simulates execution: it understands print statements, simple
 * assignments (optionally with a type keyword), `cout <<` chains, and
 * `for <v> in range(...)` loops. Everything else is skipped.
 */

type Vars = Record<string, string>;
type Consume = () => string;

function splitTop(s: string, sep: string): string[] {
  const out: string[] = [];
  let cur = "";
  let q: string | null = null;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (q) {
      cur += c;
      if (c === q && s[i - 1] !== "\\") q = null;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      q = c;
      cur += c;
      continue;
    }
    if (sep === "<<") {
      if (c === "<" && s[i + 1] === "<") {
        out.push(cur);
        cur = "";
        i++;
        continue;
      }
    } else if (c === sep) {
      out.push(cur);
      cur = "";
      continue;
    }
    cur += c;
  }
  out.push(cur);
  return out;
}

function resolveTerm(p: string, vars: Vars, consume: Consume): string {
  p = p.trim();
  if (!p) return "";
  if (
    /^(?:input|readline|readLine|gets|scanf|Scanner)\s*\(.*\)?$/.test(p) ||
    p === "cin" ||
    p === "std::cin"
  )
    return consume();
  if (p === "endl" || p === '"\\n"' || p === "'\\n'") return "";
  const sm = p.match(/^["'`]([\s\S]*)["'`]$/);
  if (sm) return sm[1].replace(/\\n/g, "\n").replace(/\\t/g, "\t");
  if (/^-?\d+\.?\d*$/.test(p)) return p;
  if (Object.prototype.hasOwnProperty.call(vars, p)) return vars[p];
  return p;
}

function resolveExpr(raw: string, vars: Vars, consume: Consume): string {
  const parts = splitTop(raw, "+");
  const vals = parts.map((p) => resolveTerm(p, vars, consume));
  if (parts.length > 1 && vals.every((v) => /^-?\d+\.?\d*$/.test(v)))
    return String(vals.reduce((a, b) => a + parseFloat(b), 0));
  return vals.join("");
}

function resolvePrint(raw: string, vars: Vars, consume: Consume, joiner: string): string {
  return splitTop(raw, ",")
    .map((cp) => resolveExpr(cp.trim(), vars, consume))
    .join(joiner);
}

function exec(lines: string[], vars: Vars, consume: Consume, out: string[]): void {
  let i = 0;
  while (i < lines.length) {
    const raw = lines[i];
    const t = raw.trim();
    const indent = (raw.match(/^\s*/) ?? [""])[0].length;
    if (!t || t.startsWith("//") || t.startsWith("#")) {
      i++;
      continue;
    }

    const forM = t.match(/^for\s+(\w+)\s+in\s+range\s*\(([^)]*)\)\s*:?\s*\{?\s*$/);
    if (forM) {
      const varName = forM[1];
      const nums = forM[2]
        .split(",")
        .map((a) => parseInt(resolveTerm(a.trim(), vars, consume), 10))
        .filter((n) => !isNaN(n));
      let start = 0;
      let stop = 0;
      let stepv = 1;
      if (nums.length === 1) stop = nums[0];
      else if (nums.length >= 2) {
        start = nums[0];
        stop = nums[1];
        if (nums[2]) stepv = nums[2];
      }
      const body: string[] = [];
      let j = i + 1;
      while (j < lines.length) {
        const bl = lines[j];
        if (!bl.trim()) {
          body.push(bl);
          j++;
          continue;
        }
        if ((bl.match(/^\s*/) ?? [""])[0].length > indent) {
          body.push(bl);
          j++;
        } else break;
      }
      let guard = 0;
      for (let k = start; stepv > 0 ? k < stop : k > stop; k += stepv) {
        if (guard++ > 10000) break;
        vars[varName] = String(k);
        exec(body, vars, consume, out);
      }
      i = j;
      continue;
    }

    let m = t.match(
      /^(?:(?:int|long|float|double|char|bool|string|String|auto|var|let|const)\s+)?(\w+)\s*=(?!=)\s*(.+?);?\s*$/,
    );
    if (m && !/^(if|elif|while|for|return|def|function|class|public|private|static)\b/.test(t)) {
      vars[m[1]] = resolveExpr(m[2], vars, consume);
      i++;
      continue;
    }

    if (/\bcout\b/.test(t)) {
      const cm = t.match(/cout\s*<<\s*(.+?);?\s*$/);
      if (cm) {
        out.push(
          splitTop(cm[1], "<<")
            .map((p) => resolveExpr(p.trim(), vars, consume))
            .join(""),
        );
        i++;
        continue;
      }
    }

    m = t.match(
      /^(?:print|println|echo|puts|printf|System\.out\.println|Console\.WriteLine|fmt\.Println)\s*\(?\s*([\s\S]*?)\)?\s*;?\s*$/,
    );
    if (m) {
      out.push(resolvePrint(m[1], vars, consume, " "));
      i++;
      continue;
    }

    i++;
  }
}

export function interpret(code: string, inputs: string[]): ExecOutcome {
  let idx = 0;
  const consume: Consume = () => (idx < inputs.length ? inputs[idx++] : "");
  const out: string[] = [];
  try {
    exec(code.split(/\r?\n/), {}, consume, out);
    return { ok: true, out };
  } catch (e) {
    return { ok: false, out, error: String(e) };
  }
}
