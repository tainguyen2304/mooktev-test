"use server";

import { ApiResponse } from "@/types";
import { BookingLogs, BookingLogsAction, Bookings } from "@prisma/client";
import { z } from "zod";
import { getUserById } from "../data/user";
import { currentUser } from "../lib/auth";
import { db } from "../lib/db";
import { BookingSchema } from "../schemas";

export const logBookingActivity = async ({
  bookingId,
  action,
  oldValues,
  newValues,
}: {
  bookingId: string | null;
  action: BookingLogsAction;
  oldValues?: Bookings | null;
  newValues?: Bookings | null;
}): Promise<ApiResponse<BookingLogs | null>> => {
  const user = await currentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    throw new Error("Unauthorized");
  }

  try {
    const data = await db.bookingLogs.create({
      data: {
        userId: dbUser.id,
        bookingId,
        action,
        details: {
          oldValues,
          newValues,
        },
      },
      include: {
        user: {
          select: {
            name: true,
            role: true,
          },
        },
        booking: {
          include: {
            driver: true,
          },
        },
      },
    });
    return { message: "Booking created", status: 200, data };
  } catch (error) {
    console.log("error", error);
    return { message: "Error creating booking", status: 500, data: null };
  }
};

export const createBooking = async (
  values: z.infer<typeof BookingSchema>,
  callback?: () => void
): Promise<ApiResponse<Bookings | null>> => {
  const user = await currentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    throw new Error("Unauthorized");
  }

  const validatedFields = BookingSchema.safeParse(values);

  if (!validatedFields.success) {
    throw new Error("Invalid fields!");
  }

  const maxOrder = await db.bookings.aggregate({
    _max: { orderIndex: true },
  });

  const newOrderIndex = (maxOrder._max.orderIndex || 0) + 1;

  try {
    const data = await db.bookings.create({
      data: {
        ...validatedFields.data,
        userId: dbUser.id,
        orderIndex: newOrderIndex,
      },
    });

    if (callback) {
      callback();
    }

    return { message: "Booking created", status: 200, data };
  } catch (error) {
    return { message: "Error creating booking", status: 500, data: null };
  }
};

interface reqUpdateBookingProps {
  values: z.infer<typeof BookingSchema>;
  id: string;
}
export const updateBooking = async (
  req: reqUpdateBookingProps,
  callback?: () => {}
): Promise<ApiResponse<Bookings | null>> => {
  const user = await currentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    throw new Error("Unauthorized");
  }

  const { values, id } = req;

  const validatedFields = BookingSchema.safeParse(values);

  if (!validatedFields.success) {
    throw new Error("Invalid fields");
  }

  try {
    const data = await db.bookings.update({
      where: {
        id,
      },
      data: validatedFields.data,
    });

    if (callback) {
      callback();
    }

    return { message: "Booking updated", status: 200, data };
  } catch (error) {
    return { message: "Error updating booking", status: 500, data: null };
  }
};

export const deleteBookingRide = async (
  id: string,
  callback?: () => void
): Promise<ApiResponse<Bookings | null>> => {
  const user = await currentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    throw new Error("Unauthorized");
  }

  try {
    const data = await db.bookings.delete({
      where: {
        id,
      },
    });

    if (callback) {
      callback();
    }

    return { message: "Booking Deleted", status: 200, data: data };
  } catch (error) {
    return { message: "Error deleting booking", status: 500, data: null };
  }
};

export const deleteManyBookingRides = async (
  ids: string[],
  callback?: () => void
): Promise<ApiResponse<{ count: number }>> => {
  const user = await currentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    throw new Error("Unauthorized");
  }

  try {
    const data = await db.bookings.deleteMany({
      where: {
        id: { in: ids },
      },
    });

    if (callback) {
      callback();
    }

    return { message: "Booking Deleted", status: 200, data: data };
  } catch (error) {
    return {
      message: "Error deleting booking",
      status: 500,
      data: { count: 0 },
    };
  }
};
