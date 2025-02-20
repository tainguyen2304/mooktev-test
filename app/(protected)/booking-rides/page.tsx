"use client";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useCallback, useEffect, useMemo } from "react";
import unidecode from "unidecode";

import {
  DIALOG_BOOKING_RIDE_NAME,
  DialogBookingRide,
} from "@/components/booking/dialog-booking-ride";
import CustomTableCell from "@/components/custom-table-cell";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useDialog from "@/hooks/useDialog";
import {
  BOOKING_RIDE_LOGS_QUERY_KEY,
  BOOKING_RIDES_QUERY_KEY,
} from "@/keys/query-keys";
import { debounce, getRideStatus, toastSuccess } from "@/lib/utils";
import { ApiResponse } from "@/types";
import {
  BookingLogs,
  BookingLogsAction,
  Bookings,
  TripStatus,
  User,
  UserRole,
} from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import clsx from "clsx";
import {
  ArrowUpDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  GalleryVerticalEnd,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash,
  Trash2,
  View,
} from "lucide-react";
import { useRouter } from "next/navigation";

import AlerDelete from "@/components/alert-dialog-confirm-delete";
import {
  DIALOG_BOOKING_ACTIVITY_LOGS_NAME,
  DialogBookingRideLogs,
} from "@/components/bookingLogs/dialog-booking-logs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useBookingRide from "@/hooks/useBookingRide";
import { useBookingTableStore } from "@/hooks/useBookingTableStore";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import useSocket from "@/hooks/useSocket";
import {
  CREATE_BOOKING_RIDE,
  CREATE_BOOKING_RIDE_LOGS,
  DELETE_BOOKING_RIDE,
  DELETE_MANY_BOOKING_RIDES,
  NOTIFICATION,
  UPDATE_BOOKING_RIDE,
} from "@/keys/socket-keys";
import { useCurrentRole } from "@/hooks/useCurrentRole";

const ALERT_DELETE_RIDE_NAME = "ALERT_DELETE_RIDE";

const Rides = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    handleOpen,
    handleClose,
    data: rideId,
  } = useDialog<Bookings | string>();

  const role = useCurrentRole();
  const socket = useSocket();
  const { bookingrides, isloading, deleteRide, deleteManyRides } =
    useBookingRide();

  const isAdmin = useMemo(() => role === UserRole.ADMIN, [role]);

  const {
    sorting,
    setSorting,
    searchText,
    setSearchText,
    debouncedSearch,
    setDebouncedSearch,
    rowSelection,
    setRowSelection,
    columnFilters,
    setColumnFilters,
    columnVisibility,
    setColumnVisibility,
  } = useBookingTableStore();

  const currentUser = useCurrentUser();

  const normalizeText = useCallback(
    (text: string) => unidecode(text).toLowerCase(),
    []
  );

  const columns: ColumnDef<Bookings>[] = [
    {
      id: "select",
      header: () => (
        <div className="flex items-center">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />

          <div className="w-[16px]">
            {selectedRowIds?.length > 0 && (
              <Trash2
                className="w-[16px] ml-1 text-red-600 hover:cursor-pointer hover:opacity-80"
                onClick={() => {
                  handleOpen(ALERT_DELETE_RIDE_NAME);
                }}
              />
            )}
          </div>
        </div>
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Ride ID
            <ArrowUpDown className="w-[16px] h-[16px] ml-1" />
          </Button>
        );
      },
    },
    {
      accessorKey: "customerName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Customer Name
            <ArrowUpDown className="w-[16px] h-[16px] ml-1" />
          </Button>
        );
      },
    },
    {
      accessorKey: "pickUpLocation",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Pickup locations
            <ArrowUpDown className="w-[16px] h-[16px] ml-1" />
          </Button>
        );
      },
    },
    {
      accessorKey: "dropOffLocation",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Drop-off Locations
            <ArrowUpDown className="w-[16px] h-[16px] ml-1" />
          </Button>
        );
      },
    },
    {
      accessorKey: "driver.name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Driver Name
            <ArrowUpDown className="w-[16px] h-[16px] ml-1" />
          </Button>
        );
      },
    },
    {
      accessorKey: "rideStatus",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Status
            <ArrowUpDown className="w-[16px] h-[16px] ml-1" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const rideStatus = getRideStatus(row.getValue("rideStatus"));

        return (
          <div
            className={clsx("rounded-md border px-2 py-1 w-fit", {
              "bg-gray-200": row.getValue("rideStatus") === TripStatus.PENDING,
              "bg-red-200": row.getValue("rideStatus") === TripStatus.CANCELED,
              "bg-blue-200":
                row.getValue("rideStatus") === TripStatus.INPROGRESS,
              "bg-green-200":
                row.getValue("rideStatus") === TripStatus.COMPLETED,
            })}
          >
            {rideStatus}
          </div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const bookingRide = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                className="flex items-center gap-2"
                onClick={() => {
                  handleOpen(DIALOG_BOOKING_RIDE_NAME, bookingRide);
                }}
              >
                <Pencil className="w-[16px]" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-2"
                onClick={() => {
                  router.push(`/booking-rides/${row.getValue("id")}`);
                }}
              >
                <View className="w-[16px]" />
                View detail
              </DropdownMenuItem>

              {isAdmin && (
                <DropdownMenuItem
                  className="flex items-center gap-2 !text-red-600"
                  onClick={() => {
                    handleOpen(ALERT_DELETE_RIDE_NAME, row.getValue("id"));
                  }}
                >
                  <Trash className="w-[16px]" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: bookingrides ?? [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter: debouncedSearch,
    },

    globalFilterFn: (row, columnId, filterValue) => {
      const cellValue: string = row.getValue(columnId);
      return normalizeText(cellValue).includes(normalizeText(filterValue));
    },
  });

  const selectedRowIds = table
    .getSelectedRowModel()
    .rows.map((row) => row.original.id);

  const handleSearch = useMemo(
    () =>
      debounce((value: string) => {
        setDebouncedSearch(value);
      }, 1000),
    [setDebouncedSearch]
  );

  const handleDelete = async () => {
    if (selectedRowIds.length) {
      await deleteManyRides.mutateAsync(selectedRowIds, {
        onSuccess: () => {
          setRowSelection({});
          if (socket) {
            socket.emit(DELETE_MANY_BOOKING_RIDES, {
              ids: selectedRowIds,
              senderId: socket.id,
            });
          }
        },
      });
    } else if (typeof rideId === "string") {
      await deleteRide.mutateAsync(rideId, {
        onSuccess: () => {
          if (socket) {
            socket.emit(DELETE_BOOKING_RIDE, {
              id: rideId,
              sernderId: socket.id,
            });
          }
        },
      });
    }

    if (socket) {
      socket.emit(NOTIFICATION, {
        data: currentUser,
        action: BookingLogsAction.DELETE,
        senderId: socket.id,
      });
    }

    handleClose();
  };

  const handleNoti = useCallback((user: User, action: BookingLogsAction) => {
    const role = user.role === UserRole.ADMIN ? "Admin" : "Operator";
    const mess = `A ride is ${action.toLowerCase()}d by ${role} ${user.name}`;
    toastSuccess(mess);
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on(
      NOTIFICATION,
      ({
        data,
        action,
        senderId,
      }: {
        data: User;
        action: BookingLogsAction;
        senderId: string;
      }) => {
        if (senderId !== socket.id) {
          handleNoti(data, action);
        }
      }
    );

    socket.on(
      CREATE_BOOKING_RIDE_LOGS,
      ({ log, senderId }: { log: BookingLogs; senderId: string }) => {
        if (senderId !== socket.id) {
          queryClient.setQueryData<ApiResponse<BookingLogs[]>>(
            BOOKING_RIDE_LOGS_QUERY_KEY,
            (prev) => ({
              message: "New log",
              status: 200,
              data: prev?.data ? [log, ...prev.data] : [log],
            })
          );
        }
      }
    );

    socket.on(
      CREATE_BOOKING_RIDE,
      ({ data, senderId }: { data: Bookings; senderId: string }) => {
        if (senderId !== socket.id) {
          queryClient.setQueryData<ApiResponse<Bookings[] | null>>(
            BOOKING_RIDES_QUERY_KEY,
            (prev) => ({
              message: "Updated",
              status: 200,
              data: prev?.data ? [data, ...prev.data] : [data],
            })
          );
        }
      }
    );

    socket.on(
      UPDATE_BOOKING_RIDE,
      ({ data, senderId }: { data: Bookings; senderId: string }) => {
        if (senderId !== socket.id) {
          queryClient.setQueryData<ApiResponse<Bookings[] | null>>(
            BOOKING_RIDES_QUERY_KEY,
            (prev) => ({
              message: "Updated",
              status: 200,
              data: prev?.data
                ? prev.data.map((booking) =>
                    booking.id === data.id ? data : booking
                  )
                : [],
            })
          );
        }
      }
    );

    socket.on(
      DELETE_BOOKING_RIDE,
      ({ id, senderId }: { id: string; senderId: string }) => {
        if (senderId !== socket.id) {
          queryClient.setQueryData<ApiResponse<Bookings[] | null>>(
            BOOKING_RIDES_QUERY_KEY,
            (prev) => ({
              message: "Updated",
              status: 200,
              data: prev?.data
                ? prev.data.filter((booking) => booking.id !== id)
                : [],
            })
          );
        }
      }
    );

    socket.on(
      DELETE_MANY_BOOKING_RIDES,
      ({ ids, senderId }: { ids: string[]; senderId: string }) => {
        if (senderId !== socket.id) {
          queryClient.setQueryData<ApiResponse<Bookings[] | null>>(
            BOOKING_RIDES_QUERY_KEY,
            (prev) => ({
              message: "Updated",
              status: 200,
              data: prev?.data
                ? prev.data.filter((booking) => !ids.includes(booking.id))
                : [],
            })
          );
        }
      }
    );

    return () => {
      socket.off(CREATE_BOOKING_RIDE_LOGS);
      socket.off(CREATE_BOOKING_RIDE);
      socket.off(UPDATE_BOOKING_RIDE);
      socket.off(DELETE_BOOKING_RIDE);
      socket.off(DELETE_MANY_BOOKING_RIDES);
      socket.off(NOTIFICATION);
    };
  }, [handleNoti, queryClient, socket]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-end gap-4 py-2">
        <h1 className="text-[32px] font-bold mr-auto flex items-center gap-2">
          Booking ride list
          <Tooltip>
            <TooltipTrigger asChild>
              <GalleryVerticalEnd
                className=" hover:cursor-pointer hover:opacity-80"
                onClick={() => {
                  handleOpen(DIALOG_BOOKING_ACTIVITY_LOGS_NAME);
                }}
              />
            </TooltipTrigger>
            <TooltipContent side="right" align="center">
              Activity logs
            </TooltipContent>
          </Tooltip>
        </h1>

        <Input
          placeholder="Search ..."
          value={searchText}
          onChange={(event) => {
            setSearchText(event.target.value);
            handleSearch(event.target.value);
          }}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>

        {isAdmin && (
          <Button
            onClick={() => {
              handleOpen(DIALOG_BOOKING_RIDE_NAME);
            }}
          >
            <Plus className="h-[16px]" />
            Booking ride
          </Button>
        )}
      </div>
      <hr />
      <br />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isloading ? (
              [...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  {[...Array(table.getAllColumns().length - 1)].map(
                    (_, index) => (
                      <TableCell key={`table-cell-${index}`}>
                        <Skeleton className="w-full h-5 bg-gray-200 animate-pulse rounded-md" />
                      </TableCell>
                    )
                  )}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <CustomTableCell key={cell.id} cell={cell} />
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>

      <DialogBookingRide />
      <DialogBookingRideLogs />
      <AlerDelete
        name={ALERT_DELETE_RIDE_NAME}
        onOk={handleDelete}
        isPending={deleteRide.isPending || deleteManyRides.isPending}
      />
    </div>
  );
};

export default Rides;
