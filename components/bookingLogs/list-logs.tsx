import useBookingRideLogs from "@/hooks/useBookingRideLogs";
import useDriver from "@/hooks/useDriver";
import { BookingLogsAction, UserRole } from "@prisma/client";
import { useCallback, useEffect } from "react";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";

const SkeletonCard = () => (
  <div className="space-y-4 animate-pulse">
    <div className="bg-gray-300 h-6 w-full rounded" />
    <div className="bg-gray-300 h-6 w-full rounded" />
    <div className="bg-gray-300 h-6 w-full rounded" />
    <div className="bg-gray-300 h-6 w-full rounded" />
    <div className="bg-gray-300 h-6 w-full rounded" />
    <div className="bg-gray-300 h-6 w-full rounded" />
    <div className="bg-gray-300 h-6 w-full rounded" />
  </div>
);

const ListLogs = () => {
  const { isLoading, bookingLogs } = useBookingRideLogs();

  return (
    <Card className="p-4">
      <h2 className="text-xl font-bold mb-4">Lịch sử hành động</h2>
      {isLoading ? (
        <SkeletonCard />
      ) : (
        <ScrollArea className="h-[80vh]">
          {bookingLogs.length > 0 ? (
            bookingLogs.map((log, index) => (
              <Card
                key={log.id}
                className={`border p-2 !mb-4 shadow-lg ${
                  index % 2 === 0 ? "bg-gray-200" : "bg-white"
                }`}
              >
                <CardHeader className="flex justify-between">
                  <span className="text-xl font-semibold">
                    {`${log.user.name} (${
                      log.user.role === UserRole.ADMIN ? "Admin" : "Opetator"
                    })`}
                  </span>
                  <Badge variant="outline">
                    {new Date(log.timestamp).toLocaleString()}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-500">
                      <strong>Booking ID:</strong> {log.bookingId}
                    </div>
                    <div className="text-sm text-gray-500">
                      <strong>Action</strong>{" "}
                      {log.action === BookingLogsAction.CREATE &&
                        "Chuyến đi được tạo"}
                      {log.action === BookingLogsAction.UPDATE &&
                        "Dữ liệu chuyến đi được cập nhật"}
                      {log.action === BookingLogsAction.DELETE &&
                        "Chuyến đi đã bị xóa"}
                    </div>
                    <div className="text-sm text-gray-500">
                      <strong>Details:</strong>

                      {log.action === BookingLogsAction.UPDATE && (
                        <ul className="list-inside list-disc ml-4">
                          {log.details.oldValues && log.details.newValues ? (
                            Object.keys(log.details.newValues).map((key) => {
                              if (
                                log.details.oldValues[key] !==
                                log.details.newValues[key]
                              ) {
                                return (
                                  <li key={key}>
                                    <strong>{key}:</strong>{" "}
                                    {log.details.oldValues[key]}
                                    {" → "}
                                    {log.details.newValues[key]}
                                  </li>
                                );
                              }
                              return null;
                            })
                          ) : (
                            <li>Không có thay đổi nào</li>
                          )}
                        </ul>
                      )}
                      {log.action === BookingLogsAction.CREATE && (
                        <ul className="list-inside list-disc ml-4">
                          <li>
                            Khách hàng: {log.details.newValues.customerName}
                          </li>
                          <li>
                            Địa chỉ đón: {log.details.newValues.pickUpLocation}
                          </li>
                          <li>
                            Địa chỉ trả: {log.details.newValues.dropOffLocation}
                          </li>
                          <li>Tài xế: {log.booking.driver.name}</li>
                        </ul>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center">No data</div>
          )}
        </ScrollArea>
      )}
    </Card>
  );
};

export default ListLogs;
