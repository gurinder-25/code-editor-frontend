import { api } from "../../api/client";
import { ENDPOINTS } from "../../api/endpoints";
import type { CodeSnippetResponse } from "./fetchCodeSnippetsTypes";

export const fetchCodeSnippetsApi = {
  getCodeSnippet(language: string) {
    return api
      .get<CodeSnippetResponse>(`${ENDPOINTS.CODE_SNIPPET}/${language}`)
      .then((res) => res.codeSnippet);
  },
};
