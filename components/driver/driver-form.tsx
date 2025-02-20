import { createDriver, updateDriver } from "@/actions/driver";
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
import { toastFailed, toastSuccess } from "@/lib/utils";
import { DRIVERS_QUERY_KEY } from "@/keys/query-keys";
import { DriverSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import useDialog from "../../hooks/useDialog";
import { DIALOG_DRIVER_NAME } from "./dialog-driver";

export const DriverForm = () => {
  const queryClient = useQueryClient();

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const { data: driverDetail, name, handleClose } = useDialog();

  const plusDriver = useMutation({
    mutationFn: createDriver,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DRIVERS_QUERY_KEY });
    },
  });

  const editDriver = useMutation({
    mutationFn: updateDriver,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DRIVERS_QUERY_KEY });
    },
  });

  const form = useForm<z.infer<typeof DriverSchema>>({
    resolver: zodResolver(DriverSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      brandVehicle: "",
      modelVehicle: "",
      plateVehicle: "",
    },
  });

  const isPending = useMemo(
    () => plusDriver.isPending || editDriver.isPending,
    [editDriver.isPending, plusDriver.isPending]
  );

  const handleCancel = () => {
    form.reset();
    handleClose();
  };

  const onSubmit = (values: z.infer<typeof DriverSchema>) => {
    setError("");
    setSuccess("");

    if (driverDetail) {
      editDriver.mutate(
        { values, id: driverDetail.id },
        {
          onSuccess: () => {
            toastSuccess("Updated success");
            handleCancel();
          },
          onError: (error) => {
            const message = error.message || "Updated failed";
            toastFailed(message);
          },
        }
      );
    } else {
      plusDriver.mutate(values, {
        onSuccess: () => {
          toastSuccess("Created success");
          form.reset();
        },
        onError: (error) => {
          const message = error.message || "Created failed";
          toastFailed(message);
        },
      });
    }
  };

  useEffect(() => {
    if (driverDetail && name === DIALOG_DRIVER_NAME) {
      setTimeout(() => {
        form.reset({
          ...driverDetail,
          brandVehicle: driverDetail.vehicle.brand,
          modelVehicle: driverDetail.vehicle.model,
          plateVehicle: driverDetail.vehicle.plate,
        });
      }, 0);
    }
  }, [driverDetail, form, name]);

  return (
    <Card className="w-[400px] shadow-md">
      <CardHeader className="font-bold text-2xl">
        {driverDetail
          ? "Update driver information"
          : "Create driver information"}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="Please input full name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="Please input email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="phone"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone number</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="Please input phone number"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                name="brandVehicle"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vehicle brand</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="Please input vehicle brand"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="modelVehicle"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vehicle model</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="Please input vehicle model"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="plateVehicle"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vehicle plate</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="Please input vehicle plate"
                      />
                    </FormControl>
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
                {driverDetail ? "Edit" : "Create"}
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
