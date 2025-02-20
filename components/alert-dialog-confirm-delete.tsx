import React from "react";
import useDialog from "../hooks/useDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";

interface AlertDeleteProps {
  onOk: () => void;
  name: string;
  isPending?: boolean;
}

const AlerDelete = ({ name: nameProp, onOk, isPending }: AlertDeleteProps) => {
  const { name, open, handleClose } = useDialog();
  return (
    <AlertDialog open={open && nameProp === name} onOpenChange={handleClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-600">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-black-600">
            This action cannot be undone. This will permanently remove your data
            from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleClose}>Cancel</AlertDialogCancel>
          <Button
            className="bg-red-600"
            onClick={onOk}
            disabled={isPending ?? false}
          >
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlerDelete;
