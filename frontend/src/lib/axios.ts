import axios, { AxiosInstance } from "axios";
import ENV from "./environment";

const baseURL = ENV.BASE_API_URL + "/api";

const apiClient: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
});

apiClient.interceptors.response.use(
  (response) => response,

  (error) => Promise.reject(error),
);

export default apiClient;
