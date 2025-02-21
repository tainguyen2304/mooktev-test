import { logBookingActivity } from "@/actions/booking-ride";
import { getAllBookingLogs } from "@/data/booking-rides";
import { BOOKING_RIDE_LOGS_QUERY_KEY } from "@/keys/query-keys";
import { ApiResponse, IBookingLogs } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const useBookingRideLogs = () => {
  const queryClient = useQueryClient();

  const {
    data: { data: bookingLogs },
    isLoading: isLoadingBookingLogs,
    isFetching,
    isRefetching,
  } = useQuery<ApiResponse<IBookingLogs[] | null>>({
    initialData: { data: [], message: "", status: 0 },
    queryKey: BOOKING_RIDE_LOGS_QUERY_KEY,
    queryFn: () => getAllBookingLogs(),
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  const createBookingLog = useMutation({
    mutationFn: logBookingActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOOKING_RIDE_LOGS_QUERY_KEY });
    },
    onError: (error) => {
      throw new Error(error.message);
    },
  });

  const isLoading = isLoadingBookingLogs || isFetching || isRefetching;

  return {
    isLoading,
    bookingLogs: bookingLogs ?? [],
    createBookingLog,
  };
};

export default useBookingRideLogs;
