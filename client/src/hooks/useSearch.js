import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../constants/queryKeys";
import { useAuth } from "../context/AuthContext";
import { searchApi } from "../services/api";

export const useSearch = (params = {}) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: queryKeys.search(params),
    queryFn: () => searchApi.search(params),
    enabled: Boolean(user?.token),
    staleTime: 20 * 1000,
    retry: 1
  });
};
