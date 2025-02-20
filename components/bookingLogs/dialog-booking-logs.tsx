"use client";

import DialogCustome from "../dialog-custome";
import ListLogs from "./list-logs";

export const DIALOG_BOOKING_ACTIVITY_LOGS_NAME = "DIALOG_BOOKING_LOGS_RIDE";

export const DialogBookingRideLogs = () => {
  return (
    <DialogCustome
      className="w-[90vw] max-w-[90vw]"
      name={DIALOG_BOOKING_ACTIVITY_LOGS_NAME}
    >
      <ListLogs />
    </DialogCustome>
  );
};
