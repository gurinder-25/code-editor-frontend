import { createContext, useContext, useReducer, type ReactNode } from "react";
import { executeCodeApi } from "./executeCodeApi";
import { executeCodeReducer, initialState } from "./executeCodeReducer";
import { EXECUTE_CODE_ACTIONS } from "./executeCodeTypes";
import type { ExecuteCodeState, ExecuteRequest, ExecuteResponse } from "./executeCodeTypes";

interface ExecuteCodeContextValue extends ExecuteCodeState {
  execute: (request: ExecuteRequest) => Promise<ExecuteResponse | null>;
}

const ExecuteCodeContext = createContext<ExecuteCodeContextValue | undefined>(undefined);

export function ExecuteCodeProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(executeCodeReducer, initialState);

  const execute = async (request: ExecuteRequest): Promise<ExecuteResponse | null> => {
    dispatch({ type: EXECUTE_CODE_ACTIONS.START });
    try {
      const data = await executeCodeApi.execute(request);
      dispatch({ type: EXECUTE_CODE_ACTIONS.SUCCESS, payload: data });
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Execution failed";
      dispatch({ type: EXECUTE_CODE_ACTIONS.ERROR, payload: message });
      return null;
    }
  };

  return (
    <ExecuteCodeContext.Provider value={{ ...state, execute }}>
      {children}
    </ExecuteCodeContext.Provider>
  );
}

export function useExecuteCode() {
  const ctx = useContext(ExecuteCodeContext);
  if (!ctx) {
    throw new Error("useExecuteCode must be used within an ExecuteCodeProvider");
  }
  return ctx;
}
