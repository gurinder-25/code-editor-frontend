import { createContext, useCallback, useContext, useReducer, type ReactNode } from "react";
import { fetchCodeSnippetsApi } from "./fetchCodeSnippetsApi";
import { fetchCodeSnippetsReducer, initialState } from "./fetchCodeSnippetsReducer";
import { FETCH_CODE_SNIPPETS_ACTIONS } from "./fetchCodeSnippetsTypes";
import type { FetchCodeSnippetsState } from "./fetchCodeSnippetsTypes";

interface FetchCodeSnippetsContextValue extends FetchCodeSnippetsState {
  fetchCodeSnippet: (language: string) => Promise<string | null>;
}

const FetchCodeSnippetsContext = createContext<FetchCodeSnippetsContextValue | undefined>(undefined);

export function FetchCodeSnippetsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(fetchCodeSnippetsReducer, initialState);

  const fetchCodeSnippet = useCallback(async (language: string): Promise<string | null> => {
    dispatch({ type: FETCH_CODE_SNIPPETS_ACTIONS.START });
    try {
      const snippet = await fetchCodeSnippetsApi.getCodeSnippet(language);
      dispatch({ type: FETCH_CODE_SNIPPETS_ACTIONS.SUCCESS, payload: snippet });
      return snippet;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load code snippet";
      dispatch({ type: FETCH_CODE_SNIPPETS_ACTIONS.ERROR, payload: message });
      return null;
    }
  }, []);

  return (
    <FetchCodeSnippetsContext.Provider value={{ ...state, fetchCodeSnippet }}>
      {children}
    </FetchCodeSnippetsContext.Provider>
  );
}

export function useFetchCodeSnippets() {
  const ctx = useContext(FetchCodeSnippetsContext);
  if (!ctx) {
    throw new Error("useFetchCodeSnippets must be used within a FetchCodeSnippetsProvider");
  }
  return ctx;
}
