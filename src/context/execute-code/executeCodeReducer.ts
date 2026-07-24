import { EXECUTE_CODE_ACTIONS } from "./executeCodeTypes";
import type { ExecuteCodeAction, ExecuteCodeState } from "./executeCodeTypes";

export const initialState: ExecuteCodeState = {
  loading: false,
  result: null,
  error: null,
};

export function executeCodeReducer(
  state: ExecuteCodeState,
  action: ExecuteCodeAction,
): ExecuteCodeState {
  switch (action.type) {
    case EXECUTE_CODE_ACTIONS.START:
      return { ...state, loading: true, error: null };
    case EXECUTE_CODE_ACTIONS.SUCCESS:
      return { ...state, loading: false, result: action.payload };
    case EXECUTE_CODE_ACTIONS.ERROR:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}
