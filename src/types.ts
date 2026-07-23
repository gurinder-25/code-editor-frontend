export const LANGUAGES = [
  "Python",
  "JavaScript",
  "C++",
  "Java",
  "Go",
  "Ruby",
  "Plain text",
] as const;

export type Language = (typeof LANGUAGES)[number];

export interface RunResult {
  output: string;
  exitCode: number;
  status: "success" | "error";
  /** Real measured wall time in ms. */
  runtime: number;
  /** True when the run consumed at least one stdin line. */
  usedStdin: boolean;
  /** The stdin text the run was given (for the echo panel). */
  stdin: string;
  /** True when produced by the pattern-matching interpreter, not a real runtime. */
  simulated: boolean;
}

export interface ExecOutcome {
  ok: boolean;
  out: string[];
  error?: string;
}
