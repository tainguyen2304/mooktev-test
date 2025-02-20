import { getAllDrivers } from "@/data/driver";
import { DRIVERS_QUERY_KEY } from "@/keys/query-keys";
import { ApiResponse } from "@/types";
import { Driver } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

const useDriver = () => {
  const {
    data: { data: drivers },
    isLoading,
    isFetching,
    isRefetching,
  } = useQuery<ApiResponse<Driver[] | null>>({
    initialData: { data: [], message: "", status: 0 },
    queryKey: DRIVERS_QUERY_KEY,
    queryFn: () => getAllDrivers(),
  });

  return { drivers: drivers ?? [], isFetching, isLoading, isRefetching };
};

export default useDriver;
