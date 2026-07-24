export interface RunResult {
  output: string;
  exitCode: number;
  status: "success" | "error";
  /** Real measured wall time in ms. */
  runtime: number;
}
