import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:4288",
  headers: {
    "Content-Type": "application/json",
  },
});

const extractData = <T>(response: { data: T }) => response.data;

export const api = {
  get: <Res>(endpoint: string) => client.get<Res>(endpoint).then(extractData),

  post: <Req, Res>(endpoint: string, data: Req) =>
    client.post<Res>(endpoint, data).then(extractData),
};
