import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useBookingRide from "@/hooks/useBookingRide";
import useBookingRideLogs from "@/hooks/useBookingRideLogs";
import useDriver from "@/hooks/useDriver";
import { useSocketStore } from "@/hooks/useSocket";
import {
  CREATE_BOOKING_RIDE,
  CREATE_BOOKING_RIDE_LOGS,
  NOTIFICATION,
  UPDATE_BOOKING_RIDE,
} from "@/keys/socket-keys";
import { getRideStatus, toastSuccess } from "@/lib/utils";
import { BookingSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BookingLogsAction,
  Driver,
  TripStatus,
  UserRole,
} from "@prisma/client";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import useDialog from "../../hooks/useDialog";
import { DialogTitle } from "../ui/dialog";
import { DIALOG_BOOKING_RIDE_NAME } from "./dialog-booking-ride";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useCurrentRole } from "@/hooks/useCurrentRole";

export const BookingForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const { socket } = useSocketStore();
  const { data: bookingRideDetail, name, handleClose } = useDialog();

  const role = useCurrentRole();
  const { drivers } = useDriver();
  const currentUser = useCurrentUser();
  const { createRide, updateRide } = useBookingRide();
  const { createBookingLog } = useBookingRideLogs();

  const form = useForm<z.infer<typeof BookingSchema>>({
    resolver: zodResolver(BookingSchema),
    defaultValues: {
      customerName: "",
      driverId: "",
      pickUpLocation: "",
      dropOffLocation: "",
      rideStatus: "PENDING",
    },
  });

  const isOperator = useMemo(() => role === UserRole.USER, [role]);

  const isPending = useMemo(
    () =>
      createRide.isPending ||
      updateRide.isPending ||
      createBookingLog.isPending,
    [createBookingLog.isPending, createRide.isPending, updateRide.isPending]
  );

  const handleCancel = () => {
    form.reset();
    handleClose();
  };

  const onSubmit = (values: z.infer<typeof BookingSchema>) => {
    setError("");
    setSuccess("");

    if (bookingRideDetail) {
      updateRide.mutate(
        { values, id: bookingRideDetail.id },
        {
          onSuccess: async ({ data }) => {
            if (socket) {
              socket.emit(UPDATE_BOOKING_RIDE, { data, senderId: socket.id });
            }

            await createBookingLog.mutateAsync(
              {
                bookingId: data?.id ?? null,
                action: BookingLogsAction.UPDATE,
                oldValues: bookingRideDetail,
                newValues: data,
              },
              {
                onSuccess: ({ data: log }) => {
                  if (socket) {
                    socket.emit(CREATE_BOOKING_RIDE_LOGS, {
                      log,
                      senderId: socket.id,
                    });

                    socket.emit(NOTIFICATION, {
                      data: currentUser,
                      action: BookingLogsAction.UPDATE,
                      senderId: socket.id,
                    });
                  }
                },
              }
            );

            toastSuccess("Updated success");
            handleCancel();
          },
        }
      );
    } else {
      createRide.mutate(values, {
        onSuccess: ({ data }) => {
          form.reset();
          if (socket) {
            socket.emit(CREATE_BOOKING_RIDE, { data, senderId: socket.id });
          }
          // ghi log
          createBookingLog.mutate(
            {
              bookingId: data?.id ?? null,
              action: BookingLogsAction.CREATE,
              oldValues: null,
              newValues: data,
            },
            {
              onSuccess: ({ data: log }) => {
                if (socket) {
                  socket.emit(CREATE_BOOKING_RIDE_LOGS, {
                    log,
                    senderId: socket.id,
                  });

                  socket.emit(NOTIFICATION, {
                    data: currentUser,
                    action: BookingLogsAction.CREATE,
                    senderId: socket.id,
                  });
                }
              },
            }
          );
        },
      });
    }
  };

  useEffect(() => {
    if (
      bookingRideDetail &&
      name === DIALOG_BOOKING_RIDE_NAME &&
      drivers.length
    ) {
      setTimeout(() => {
        form.reset(bookingRideDetail);
      }, 0);
    }
  }, [bookingRideDetail, drivers, form, name]);

  return (
    <Card className="w-[400px] shadow-md">
      <CardHeader>
        <DialogTitle className="font-bold text-2xl">
          {bookingRideDetail
            ? "Update ride information"
            : "Create ride information"}
        </DialogTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending || isOperator}
                        placeholder="Please input your name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pickUpLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pickup Location</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending || isOperator}
                        placeholder="Please input your pickup"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="dropOffLocation"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dropoff Location</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending || isOperator}
                        placeholder="Please input your dropoff"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="driverId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Driver</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isPending || isOperator}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Please select driver" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {drivers.map((driver: Driver) => (
                          <SelectItem key={driver.id} value={driver.id}>
                            {driver.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rideStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isPending}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Please select driver" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(TripStatus).map(([key, value]) => (
                          <SelectItem key={key} value={key}>
                            {getRideStatus(value)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            <FormError message={error} />
            <FormSuccess message={success} />

            <div className="flex justify-end gap-2">
              <Button
                type="submit"
                className="min-w-[78px]"
                disabled={isPending}
              >
                {bookingRideDetail ? "Edit" : "Create"}
              </Button>

              <Button
                type="button"
                className="bg-red-600"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
