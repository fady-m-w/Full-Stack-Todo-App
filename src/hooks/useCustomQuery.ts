import { useQuery } from "@tanstack/react-query";
import api from "../config/axios.config";
import type { AxiosRequestConfig } from "axios";

interface ICustomQuery {
  queryKey: string[];
  url: string;
  config?: AxiosRequestConfig;
}

const useCustomQuery = ({ queryKey, url, config }: ICustomQuery) => {
  return useQuery({
    queryKey,
    queryFn: async () => {
      const { data } = await api.get(url, config);
      return data;
    },
  });
};

export default useCustomQuery;
