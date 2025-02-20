import ButtonBack from "@/components/button-back";
import { getDetailBookingRide } from "@/data/booking-rides";
import { getRideStatus } from "@/lib/utils";

const BookingRideDetail = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const id = (await params).id;
  const { data: rideDetail } = await getDetailBookingRide(id);

  const informationDetailMap = [
    {
      title: "Booker information",
      content: [
        {
          label: "Full name",
          value: rideDetail?.customerName,
        },
        {
          label: "Pick up location",
          value: rideDetail?.pickUpLocation,
        },
        {
          label: "Drop off location",
          value: rideDetail?.dropOffLocation,
        },
        {
          label: "Status",
          value: getRideStatus(rideDetail?.rideStatus),
        },
      ],
    },

    {
      title: "Driver information",
      content: [
        {
          label: "Full name",
          value: rideDetail?.driver?.name,
        },
        {
          label: "Email",
          value: rideDetail?.driver?.email,
        },
        {
          label: "Phone number",
          value: rideDetail?.driver?.phone,
        },
        {
          label: "Motobike",
          value: `${rideDetail?.driver?.vehicle?.brand} - ${rideDetail?.driver?.vehicle?.model} - ${rideDetail?.driver?.vehicle?.plate}`,
        },
      ],
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-2">
        <ButtonBack />
        <h1 className="text-[32px] font-bold mr-auto">Ride Information</h1>
      </div>
      <hr /> <br />
      <div className="grid grid-cols-2 gap-4">
        {informationDetailMap.map((infor) => (
          <div key={infor.title}>
            <h1 className="font-bold text-[22px] mb-8">{infor.title}</h1>
            {infor.content.map((content, index) => (
              <div
                key={`${infor.title}-${index}`}
                className="flex items-center mb-4"
              >
                <label className="font-bold min-w-[140px]">
                  {content.label}
                </label>
                <p className="pl-8">{content.value}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingRideDetail;
