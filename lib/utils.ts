import { TripStatus } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getRideStatus = (status: TripStatus | undefined): string => {
  const statusMap: Record<TripStatus, string> = {
    [TripStatus.PENDING]: "Đang chờ",
    [TripStatus.CANCELED]: "Đã hủy",
    [TripStatus.COMPLETED]: "Hoàn thành",
    [TripStatus.INPROGRESS]: "Đang di chuyển",
  };

  if (!status) {
    return "Không xác định";
  }

  return statusMap[status];
};

export const toastSuccess = (text: string) => {
  toast(text, {
    style: { borderWidth: 2, borderColor: "green", color: "green" },
  });
};

export const toastFailed = (text: string) => {
  toast(text, {
    style: { borderWidth: 2, borderColor: "red", color: "red" },
  });
};

export const debounce = <T extends (...args: any[]) => void>(
  callback: T,
  delay: number
) => {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      callback(...args);
    }, delay);
  };
};
