/** Response from GET /api/v1/languages/code-snippet/{language}. */
export interface CodeSnippetResponse {
  codeSnippet: string;
}

/** State held by the fetch-code-snippets context. */
export interface FetchCodeSnippetsState {
  loading: boolean;
  snippet: string;
  error: string | null;
}

/** Action type constants for the fetch-code-snippets reducer. */
export const FETCH_CODE_SNIPPETS_ACTIONS = {
  START: "FETCH_CODE_SNIPPETS_START",
  SUCCESS: "FETCH_CODE_SNIPPETS_SUCCESS",
  ERROR: "FETCH_CODE_SNIPPETS_ERROR",
} as const;

/** Actions the fetch-code-snippets reducer understands. */
export type FetchCodeSnippetsAction =
  | { type: typeof FETCH_CODE_SNIPPETS_ACTIONS.START }
  | { type: typeof FETCH_CODE_SNIPPETS_ACTIONS.SUCCESS; payload: string }
  | { type: typeof FETCH_CODE_SNIPPETS_ACTIONS.ERROR; payload: string };
