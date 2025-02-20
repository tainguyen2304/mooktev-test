"use client";

import DialogCustome from "../dialog-custome";
import { DriverForm } from "./driver-form";

export const DIALOG_DRIVER_NAME = "DIALOG_DRIVER";

export const DialogDriver = () => {
  return (
    <DialogCustome name={DIALOG_DRIVER_NAME}>
      <DriverForm />
    </DialogCustome>
  );
};
