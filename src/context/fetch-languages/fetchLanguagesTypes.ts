/** Response from GET /api/v1/languages. */
export interface LanguagesResponse {
  availableLanguages: string[];
}

/** State held by the fetch-languages context. */
export interface FetchLanguagesState {
  loading: boolean;
  languages: string[];
  error: string | null;
}

/** Action type constants for the fetch-languages reducer. */
export const FETCH_LANGUAGES_ACTIONS = {
  START: "FETCH_LANGUAGES_START",
  SUCCESS: "FETCH_LANGUAGES_SUCCESS",
  ERROR: "FETCH_LANGUAGES_ERROR",
} as const;

/** Actions the fetch-languages reducer understands. */
export type FetchLanguagesAction =
  | { type: typeof FETCH_LANGUAGES_ACTIONS.START }
  | { type: typeof FETCH_LANGUAGES_ACTIONS.SUCCESS; payload: string[] }
  | { type: typeof FETCH_LANGUAGES_ACTIONS.ERROR; payload: string };
