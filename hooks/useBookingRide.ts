import {
  createBooking,
  deleteBookingRide,
  deleteManyBookingRides,
  updateBooking,
} from "@/actions/booking-ride";
import { getAllBookingsRide } from "@/data/booking-rides";
import { BOOKING_RIDES_QUERY_KEY } from "@/keys/query-keys";
import { toastFailed, toastSuccess } from "@/lib/utils";
import { ApiResponse } from "@/types";
import { Bookings } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";

const useBookingRide = () => {
  const queryClient = useQueryClient();

  const {
    data: { data: bookingrides },
    isLoading,
    isFetching,
    isRefetching,
  } = useQuery<ApiResponse<Bookings[] | null>>({
    initialData: { data: [], message: "", status: 0 },
    queryKey: BOOKING_RIDES_QUERY_KEY,
    queryFn: () => getAllBookingsRide(),
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    console.log(
      "boking ids",
      bookingrides?.map((data) => data.id)
    );
  }, [bookingrides]);

  const createRide = useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOOKING_RIDES_QUERY_KEY });
      toastSuccess("Created success");
    },
    onError: () => {
      toastFailed("Created failed");
    },
  });

  const updateRide = useMutation({
    mutationFn: updateBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOOKING_RIDES_QUERY_KEY });
    },
    onError: () => {
      toastFailed("Updated failed");
    },
  });

  const deleteRide = useMutation({
    mutationFn: deleteBookingRide,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOOKING_RIDES_QUERY_KEY });
      toastSuccess("Deleted success");
    },
    onError: () => {
      toastFailed("Deleted failed");
    },
  });

  const deleteManyRides = useMutation({
    mutationFn: deleteManyBookingRides,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOOKING_RIDES_QUERY_KEY });
      toastSuccess("Deleted success");
    },
    onError: () => {
      toastFailed("Deleted failed");
    },
  });

  const isloading = useMemo(
    () =>
      isLoading ||
      isFetching ||
      isRefetching ||
      deleteRide.isPending ||
      deleteManyRides.isPending,
    [
      deleteManyRides.isPending,
      deleteRide.isPending,
      isFetching,
      isLoading,
      isRefetching,
    ]
  );

  return {
    bookingrides,
    isloading,
    createRide,
    updateRide,
    deleteRide,
    deleteManyRides,
  };
};

export default useBookingRide;
