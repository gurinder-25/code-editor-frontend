import { api } from "../../api/client";
import { ENDPOINTS } from "../../api/endpoints";
import type { LanguagesResponse } from "./fetchLanguagesTypes";

export const fetchLanguagesApi = {
  getLanguages() {
    return api.get<LanguagesResponse>(ENDPOINTS.LANGUAGES).then((res) => res.availableLanguages);
  },
};
