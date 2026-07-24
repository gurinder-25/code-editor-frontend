import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

const extractData = <T>(response: { data: T }) => response.data;

export const api = {
  post: <Req, Res>(endpoint: string, data: Req) =>
    client.post<Res>(endpoint, data).then(extractData),
};
