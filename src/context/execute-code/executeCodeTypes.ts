/** Request body for POST /api/v1/execute. */
export interface ExecuteRequest {
  language: string;
  code: string;
  stdin: string;
}

/** Execution status values returned by the backend. */
export const EXECUTE_STATUS = {
  SUCCESS: "SUCCESS",
  ERROR: "ERROR",
} as const;

export type ExecuteStatus = (typeof EXECUTE_STATUS)[keyof typeof EXECUTE_STATUS];

/** Response from POST /api/v1/execute. */
export interface ExecuteResponse {
  status: ExecuteStatus;
  stdout: string;
  stderr: string;
  exitCode: number;
  executionTimeMs: number;
}

/** State held by the execute-code context. */
export interface ExecuteCodeState {
  loading: boolean;
  result: ExecuteResponse | null;
  error: string | null;
}

/** Action type constants for the execute-code reducer. */
export const EXECUTE_CODE_ACTIONS = {
  START: "EXECUTE_START",
  SUCCESS: "EXECUTE_SUCCESS",
  ERROR: "EXECUTE_ERROR",
} as const;

/** Actions the execute-code reducer understands. */
export type ExecuteCodeAction =
  | { type: typeof EXECUTE_CODE_ACTIONS.START }
  | { type: typeof EXECUTE_CODE_ACTIONS.SUCCESS; payload: ExecuteResponse }
  | { type: typeof EXECUTE_CODE_ACTIONS.ERROR; payload: string };
