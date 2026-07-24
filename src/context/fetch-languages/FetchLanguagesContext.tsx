import { createContext, useCallback, useContext, useEffect, useReducer, type ReactNode } from "react";
import { fetchLanguagesApi } from "./fetchLanguagesApi";
import { fetchLanguagesReducer, initialState } from "./fetchLanguagesReducer";
import { FETCH_LANGUAGES_ACTIONS } from "./fetchLanguagesTypes";
import type { FetchLanguagesState } from "./fetchLanguagesTypes";

interface FetchLanguagesContextValue extends FetchLanguagesState {
  fetchLanguages: () => Promise<void>;
}

const FetchLanguagesContext = createContext<FetchLanguagesContextValue | undefined>(undefined);

export function FetchLanguagesProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(fetchLanguagesReducer, initialState);

  const fetchLanguages = useCallback(async () => {
    dispatch({ type: FETCH_LANGUAGES_ACTIONS.START });
    try {
      const languages = await fetchLanguagesApi.getLanguages();
      dispatch({ type: FETCH_LANGUAGES_ACTIONS.SUCCESS, payload: languages });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load languages";
      dispatch({ type: FETCH_LANGUAGES_ACTIONS.ERROR, payload: message });
    }
  }, []);

  useEffect(() => {
    fetchLanguages();
  }, [fetchLanguages]);

  return (
    <FetchLanguagesContext.Provider value={{ ...state, fetchLanguages }}>
      {children}
    </FetchLanguagesContext.Provider>
  );
}

export function useFetchLanguages() {
  const ctx = useContext(FetchLanguagesContext);
  if (!ctx) {
    throw new Error("useFetchLanguages must be used within a FetchLanguagesProvider");
  }
  return ctx;
}
