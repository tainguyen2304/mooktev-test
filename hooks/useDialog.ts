import { useCallback, useMemo } from "react";
import { create } from "zustand";

interface DialogState {
  name: string;
  open: boolean;
  data: any;
  setName: (name: string) => void;
  setOpen: (open: boolean) => void;
  setData: (data: any) => void;
}

const useDialogStore = create<DialogState>((set) => ({
  name: "",
  open: false,
  data: null,
  setName: (name) => set({ name }),
  setOpen: (open) => set({ open }),
  setData: (data) => set({ data }),
}));

interface UseDialogReturn<T = any> {
  name: string;
  open: boolean;
  data: T;
  setData: (data: T) => void;
  handleOpen: (name: string, data?: T) => void;
  handleClose: () => void;
}

const useDialog = <T = any>(): UseDialogReturn<T> => {
  const { name, setName, open, setOpen, data, setData } = useDialogStore();

  const handleOpen = useCallback(
    (name: string, data?: T) => {
      setName(name);
      setOpen(true);
      if (data) {
        setData(data);
      }
    },
    [setData, setName, setOpen]
  );

  const handleClose = useCallback(() => {
    setName("");
    setOpen(false);
    setTimeout(() => {
      setData(null);
    }, 200);
  }, [setData, setName, setOpen]);

  return {
    name,
    open,
    data,
    setData,
    handleOpen,
    handleClose,
  };
};

export default useDialog;
