import { FETCH_CODE_SNIPPETS_ACTIONS } from "./fetchCodeSnippetsTypes";
import type { FetchCodeSnippetsAction, FetchCodeSnippetsState } from "./fetchCodeSnippetsTypes";

export const initialState: FetchCodeSnippetsState = {
  loading: false,
  snippet: "",
  error: null,
};

export function fetchCodeSnippetsReducer(
  state: FetchCodeSnippetsState,
  action: FetchCodeSnippetsAction,
): FetchCodeSnippetsState {
  switch (action.type) {
    case FETCH_CODE_SNIPPETS_ACTIONS.START:
      return { ...state, loading: true, error: null };
    case FETCH_CODE_SNIPPETS_ACTIONS.SUCCESS:
      return { ...state, loading: false, snippet: action.payload };
    case FETCH_CODE_SNIPPETS_ACTIONS.ERROR:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}
