"use server";

import { ApiResponse, IBookingLogs, IRideDetail } from "@/types/index";
import { db } from "@/lib/db";
import { BookingLogs, Bookings } from "@prisma/client";

export const getAllBookingsRide = async (): Promise<
  ApiResponse<Bookings[] | null>
> => {
  try {
    const allBooking = await db.bookings.findMany({
      include: {
        driver: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        orderIndex: "desc",
      },
    });

    return { message: "Get success", status: 200, data: allBooking };
  } catch {
    return { message: "Error fetching booking", status: 500, data: null };
  }
};

export const getDetailBookingRide = async (
  rideId: string
): Promise<ApiResponse<IRideDetail | null>> => {
  try {
    const rideDetail = await db.bookings.findUnique({
      where: { id: rideId },
      include: {
        user: true,
        driver: {
          include: {
            vehicle: true,
          },
        },
      },
    });

    if (!rideDetail) {
      return { status: 400, data: null, message: "Not found" };
    }
    return {
      status: 200,
      data: rideDetail,
      message: "Find booking detail",
    };
  } catch (error) {
    return {
      message: "Error fetching booking detail",
      data: null,
      status: 500,
    };
  }
};

export const getAllBookingLogs = async (): Promise<
  ApiResponse<IBookingLogs[] | null>
> => {
  try {
    const logs = await db.bookingLogs.findMany({
      include: {
        user: true,
        booking: {
          include: {
            driver: true,
          },
        },
      },
      orderBy: {
        timestamp: "desc",
      },
    });

    return { status: 200, data: logs, message: "Found booking logs" };
  } catch (error) {
    return {
      message: "Error fetching booking logs",
      data: null,
      status: 500,
    };
  }
};
