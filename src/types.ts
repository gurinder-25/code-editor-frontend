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
}
