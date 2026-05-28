import { useQuery } from "@tanstack/react-query";
import api from "../config/axios.config";
import type { AxiosRequestConfig } from "axios";

interface IAuthenticatedQuery {
  queryKey: string[];
  url: string;
  config?: AxiosRequestConfig;
}

const useAuthenticatedQuery = ({
  queryKey,
  url,
  config,
}: IAuthenticatedQuery) => {
  return useQuery({
    queryKey,
    queryFn: async () => {
      const { data } = await api.get(url, config);
      return data;
    },
  });
};

export default useAuthenticatedQuery;
