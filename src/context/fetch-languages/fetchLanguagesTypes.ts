
export interface LanguagesResponse {
  availableLanguages: string[];
}

export interface FetchLanguagesState {
  loading: boolean;
  languages: string[];
  error: string | null;
}

export const FETCH_LANGUAGES_ACTIONS = {
  START: "FETCH_LANGUAGES_START",
  SUCCESS: "FETCH_LANGUAGES_SUCCESS",
  ERROR: "FETCH_LANGUAGES_ERROR",
} as const;

export type FetchLanguagesAction =
  | { type: typeof FETCH_LANGUAGES_ACTIONS.START }
  | { type: typeof FETCH_LANGUAGES_ACTIONS.SUCCESS; payload: string[] }
  | { type: typeof FETCH_LANGUAGES_ACTIONS.ERROR; payload: string };
