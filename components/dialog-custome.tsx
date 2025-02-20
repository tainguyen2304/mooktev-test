import React from "react";
import useDialog from "../hooks/useDialog";
import { Dialog, DialogContent } from "./ui/dialog";
import { cn } from "@/lib/utils";

interface DialogCustomeProps {
  children: React.ReactNode;
  name: string;
  className?: string;
}

const DialogCustome = ({
  children,
  name: nameProp,
  className,
}: DialogCustomeProps) => {
  const { name, open, handleClose } = useDialog();
  return (
    <Dialog open={open && nameProp === name} onOpenChange={handleClose}>
      <DialogContent
        className={cn("p-0 w-auto bg-transparent border-none", className)}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default DialogCustome;
