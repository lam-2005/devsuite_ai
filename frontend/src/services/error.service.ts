import apiClient from "@/lib/axios";
import axios from "axios";
const errorAPI = {
  fetchAll: async (page = 1, limit = 5) => {
    try {
      const res = await apiClient.get("/logs/errors", {
        params: {
          page,
          limit,
        },
      });
      return res.data;
    } catch (error) {
      console.log(error);

      if (axios.isAxiosError(error)) {
        throw new Error(error.message);
      }

      if (error instanceof Error) {
        throw error;
      }

      throw new Error("Unknown error");
    }
  },

  fetchOne: async (id: string) => {
    try {
      const res = await apiClient.get(`/logs/errors/${id}`);
      return res.data;
    } catch (error) {
      console.log(error);

      if (axios.isAxiosError(error)) {
        throw new Error(error.message);
      }

      if (error instanceof Error) {
        throw error;
      }

      throw new Error("Unknown error");
    }
  },
};

export default errorAPI;
