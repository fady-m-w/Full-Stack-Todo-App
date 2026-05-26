import axios from "axios";
import type { AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: "http://localhost:1337/api",
  timeout: 5000,
});

export default api;
