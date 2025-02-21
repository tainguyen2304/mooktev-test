import { BookingLogsAction, TripStatus, User, Vehicle } from "@prisma/client";

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export interface IDriver {
  id: string;
  name: string;
  email: string;
  phone: string;
  orderIndex: number;
  vehicle?: IVehicle | null;
}

export interface IDriverDetail extends IDriver {
  reviews: IReview[];
  trips: IBookings[];
}

export interface IVehicle {
  id: string;
  driverId: string;
  brand: string;
  model: string;
  plate: string;
}

export interface IBookings {
  id: string;
  customerName: string;
  pickUpLocation: string;
  dropOffLocation: string;
  userId: string;
  driverId: string;
  rideStatus: TripStatus;
  createdAt: string | Date;
  orderIndex: number;
}

export interface IRideDetail extends IBookings {
  user: User;
  driver: IDriver;
}

export interface IReview {
  id: string;
  userId: string;
  driverId: string;
  tripId: string;
  rating: number;
  comment?: string | null;
}

export interface IBookingLogs {
  id: string;
  bookingId?: string;
  userId: string;
  action: BookingLogsAction;
  timestamp: string;
  details: any;
}
