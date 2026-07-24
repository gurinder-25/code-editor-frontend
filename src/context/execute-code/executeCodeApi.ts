import { api } from "../../api/client";
import { ENDPOINTS } from "../../api/endpoints";
import type { ExecuteRequest, ExecuteResponse } from "./executeCodeTypes";

export const executeCodeApi = {
  execute(request: ExecuteRequest) {
    return api.post<ExecuteRequest, ExecuteResponse>(ENDPOINTS.EXECUTE, request);
  },
};
