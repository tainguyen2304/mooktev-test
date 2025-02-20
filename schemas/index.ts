import { TripStatus, UserRole } from "@prisma/client";
import * as z from "zod";

export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum([UserRole.ADMIN, UserRole.USER]),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }

      return true;
    },
    {
      message: "New password is required!",
      path: ["newPassword"],
    }
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false;
      }

      return true;
    },
    {
      message: "Password is required!",
      path: ["password"],
    }
  );

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Minimum of 6 characters required",
  }),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
  code: z.optional(z.string()),
});

export const BookingSchema = z.object({
  customerName: z.string().min(1, {
    message: "Customer name is required",
  }),
  driverId: z.string().min(1, {
    message: "Driver is required",
  }),
  pickUpLocation: z.string().min(1, {
    message: "Pickup location is required",
  }),
  dropOffLocation: z.string().min(1, {
    message: "Dropoff location is required",
  }),
  rideStatus: z.enum([
    TripStatus.PENDING,
    TripStatus.INPROGRESS,
    TripStatus.COMPLETED,
    TripStatus.CANCELED,
  ]),
});

export const DriverSchema = z.object({
  name: z.string().min(1, {
    message: "Driver's name is required",
  }),
  email: z.string().email({
    message: "Driver's email is required",
  }),
  phone: z.string().min(1, {
    message: "Driver's phone number is required",
  }),

  brandVehicle: z.string().min(1, {
    message: "Vehicle's brand is required",
  }),
  modelVehicle: z.string().min(1, {
    message: "Vehicle's model is required",
  }),
  plateVehicle: z.string().min(1, {
    message: "Vehicle's plate is required",
  }),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
  name: z.string().min(1, {
    message: "Name is required",
  }),
});
