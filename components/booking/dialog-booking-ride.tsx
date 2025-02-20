"use client";

import DialogCustome from "../dialog-custome";
import { BookingForm } from "./booking-form";

export const DIALOG_BOOKING_RIDE_NAME = "DIALOG_BOOKING_RIDE";

export const DialogBookingRide = () => {
  return (
    <DialogCustome name={DIALOG_BOOKING_RIDE_NAME}>
      <BookingForm />
    </DialogCustome>
  );
};
