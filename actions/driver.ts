"use server";

import { Driver } from "@prisma/client";
import { z } from "zod";
import { getUserById } from "../data/user";
import { currentUser } from "../lib/auth";
import { db } from "../lib/db";
import { DriverSchema } from "../schemas";
import { ApiResponse } from "../types";

export const createDriver = async (
  values: z.infer<typeof DriverSchema>,
  callback?: () => void
): Promise<ApiResponse<Driver | null>> => {
  const user = await currentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    throw new Error("Unauthorized");
  }

  const validatedFields = DriverSchema.safeParse(values);

  if (!validatedFields.success) {
    throw new Error("Invalid fields");
  }

  const { name, email, phone, brandVehicle, modelVehicle, plateVehicle } =
    validatedFields.data;

  const existingDriver = await db.driver.findUnique({
    where: { email },
  });

  if (existingDriver) {
    throw new Error("Email đã tồn tại! Vui lòng dùng email khác.");
  }

  const existingVehicle = await db.vehicle.findUnique({
    where: { plate: plateVehicle },
  });

  if (existingVehicle) {
    throw new Error("ehicle plate already exists");
  }

  const maxOrder = await db.driver.aggregate({
    _max: { orderIndex: true },
  });

  const newOrderIndex = (maxOrder._max.orderIndex || 0) + 1;

  try {
    const data = await db.driver.create({
      data: {
        name,
        email,
        phone,
        vehicle: {
          create: {
            brand: brandVehicle,
            model: modelVehicle,
            plate: plateVehicle,
          },
        },
        orderIndex: newOrderIndex,
      },
      include: {
        vehicle: true,
      },
    });

    if (callback) {
      callback();
    }

    return { status: 200, message: "Created success", data };
  } catch (error) {
    return { data: null, message: "Server error", status: 500 };
  }
};

interface reqUpdateBookingProps {
  values: z.infer<typeof DriverSchema>;
  id: string;
}
export const updateDriver = async (
  req: reqUpdateBookingProps,
  callback?: () => {}
): Promise<ApiResponse<Driver | null>> => {
  const user = await currentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    throw new Error("Unauthorized");
  }

  const { values, id } = req;

  const validatedFields = DriverSchema.safeParse(values);

  if (!validatedFields.success) {
    throw new Error("Invalid fields");
  }

  const { name, email, phone, brandVehicle, modelVehicle, plateVehicle } =
    validatedFields.data;

  const data = await db.driver.update({
    where: {
      id,
    },
    data: {
      name,
      email,
      phone,
      vehicle: {
        update: {
          brand: brandVehicle,
          model: modelVehicle,
          plate: plateVehicle,
        },
      },
    },
    include: {
      vehicle: true,
    },
  });

  if (callback) {
    callback();
  }

  return { status: 200, message: "Update success", data };
};

export const deleteDriver = async (
  id: string,
  callback?: () => void
): Promise<ApiResponse<Driver | null>> => {
  const user = await currentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    throw new Error("Unauthorized");
  }

  const data = await db.driver.delete({
    where: {
      id,
    },
  });

  if (callback) {
    callback();
  }

  return { status: 200, message: "Delete success", data: data };
};

export const deleteManyDrivers = async (
  ids: string[],
  callback?: () => void
): Promise<ApiResponse<Driver | null>> => {
  const user = await currentUser();
  1;
  if (!user) {
    throw new Error("Unauthorized");
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    throw new Error("Unauthorized");
  }

  const data = await db.driver.deleteMany({
    where: {
      id: { in: ids },
    },
  });

  if (callback) {
    callback();
  }

  return { status: 200, message: "Delete success", data: data };
};
