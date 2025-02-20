"use server";

import { db } from "@/lib/db";
import { ApiResponse } from "@/types";
import { Driver, TripStatus } from "@prisma/client";

export const getAllDrivers = async (): Promise<
  ApiResponse<Driver[] | null>
> => {
  try {
    const allDriver = await db.driver.findMany({
      include: {
        vehicle: true,
      },
      orderBy: { orderIndex: "desc" },
    });
    return { message: "Get success", status: 200, data: allDriver };
  } catch (error) {
    return { message: "Error fetching booking", status: 500, data: null };
  }
};

export const getDetailDriver = async (
  id: string
): Promise<ApiResponse<Driver | null>> => {
  try {
    const driverDetail = await db.driver.findUnique({
      where: { id },
      include: {
        vehicle: true,
        reviews: true,
        trips: {
          where: { rideStatus: TripStatus.COMPLETED },
        },
      },
    });

    if (!driverDetail) {
      return { status: 400, data: null, message: "Not found" };
    }
    return { status: 200, data: driverDetail, message: "Booking not found" };
  } catch (error) {
    return {
      message: "Error fetching booking detail",
      data: null,
      status: 500,
    };
  }
};
