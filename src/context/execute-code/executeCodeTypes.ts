export interface ExecuteRequest {
  language: string;
  code: string;
  stdin: string;
}

export const EXECUTE_STATUS = {
  SUCCESS: "SUCCESS",
  ERROR: "ERROR",
} as const;

export type ExecuteStatus = (typeof EXECUTE_STATUS)[keyof typeof EXECUTE_STATUS];

export interface ExecuteResponse {
  status: ExecuteStatus;
  stdout: string;
  stderr: string;
  exitCode: number;
  executionTimeMs: number;
}

export interface ExecuteCodeState {
  loading: boolean;
  result: ExecuteResponse | null;
  error: string | null;
}

export const EXECUTE_CODE_ACTIONS = {
  START: "EXECUTE_START",
  SUCCESS: "EXECUTE_SUCCESS",
  ERROR: "EXECUTE_ERROR",
} as const;

export type ExecuteCodeAction =
  | { type: typeof EXECUTE_CODE_ACTIONS.START }
  | { type: typeof EXECUTE_CODE_ACTIONS.SUCCESS; payload: ExecuteResponse }
  | { type: typeof EXECUTE_CODE_ACTIONS.ERROR; payload: string };
