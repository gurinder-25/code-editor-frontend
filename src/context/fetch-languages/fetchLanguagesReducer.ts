import { FETCH_LANGUAGES_ACTIONS } from "./fetchLanguagesTypes";
import type { FetchLanguagesAction, FetchLanguagesState } from "./fetchLanguagesTypes";

export const initialState: FetchLanguagesState = {
  loading: false,
  languages: [],
  error: null,
};

export function fetchLanguagesReducer(
  state: FetchLanguagesState,
  action: FetchLanguagesAction,
): FetchLanguagesState {
  switch (action.type) {
    case FETCH_LANGUAGES_ACTIONS.START:
      return { ...state, loading: true, error: null };
    case FETCH_LANGUAGES_ACTIONS.SUCCESS:
      return { ...state, loading: false, languages: action.payload };
    case FETCH_LANGUAGES_ACTIONS.ERROR:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}
