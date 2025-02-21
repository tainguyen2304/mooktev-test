import ButtonBack from "@/components/button-back";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { getDetailDriver } from "@/data/driver";
import { Star } from "lucide-react";

const DriverDetail = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const id = (await params).id;
  const { data: driver } = await getDetailDriver(id);

  let averageRating = 0;
  if (driver?.reviews && driver.reviews.length > 0) {
    averageRating =
      driver.reviews.reduce((acc, review) => acc + review.rating, 0) /
      driver.reviews.length;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <ButtonBack />
        <h1 className="text-[32px] font-bold mr-auto">Ride Information</h1>
      </div>
      <hr />
      <Card>
        <CardContent className="p-4">
          <p className="text-xl font-bold">{driver?.name}</p>
          <p className="text-gray-600">📧 {driver?.email}</p>
          <p className="text-gray-600">📞 {driver?.phone}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <p className="text-lg font-semibold">Vehicle Details</p>
          <p>
            {driver?.vehicle?.brand} - {driver?.vehicle?.model}
          </p>
          <p>Plate: {driver?.vehicle?.plate}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <p className="text-lg font-semibold">Completed Rides</p>
          <div className="space-y-2">
            {driver?.trips.map((trip) => {
              const review = driver.reviews.find((r) => r.tripId === trip.id);
              return (
                <Card key={trip.id} className="border p-2 rounded-md">
                  <CardContent>
                    <p className="text-sm font-medium">
                      Trip with {trip.customerName}
                    </p>
                    <p className="text-xs text-gray-500">
                      Pick-up: {trip.pickUpLocation} → Drop-off:{" "}
                      {trip.dropOffLocation}
                    </p>
                    <p className="text-xs text-gray-500">
                      Status: {trip.rideStatus}
                    </p>
                    {review && (
                      <div className="mt-2 p-2 border rounded-md bg-gray-50">
                        <div className="flex items-center gap-2">
                          <Avatar>
                            <AvatarImage src={""} />
                            <AvatarFallback className="bg-sky-500">
                              {trip.customerName.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <p className="text-sm font-semibold">
                            {trip.customerName}
                          </p>
                        </div>
                        <p className="text-sm font-medium flex items-center gap-1 mt-1">
                          ⭐ {review.rating} - {review.comment}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <p className="text-lg font-semibold flex items-center gap-1">
            Rating: {averageRating.toFixed(1)}
            <Star className="w-4 h-4 text-yellow-500" />
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DriverDetail;
