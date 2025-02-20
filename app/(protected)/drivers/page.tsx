"use client";

import {
  ColumnFiltersState,
  RowSelectionState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import unidecode from "unidecode";

import { deleteDriver, deleteManyDrivers } from "@/actions/driver";
import AlerDelete from "@/components/alert-dialog-confirm-delete";
import CustomTableCell from "@/components/custom-table-cell";
import {
  DIALOG_DRIVER_NAME,
  DialogDriver,
} from "@/components/driver/dialog-driver";
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
import useDriver from "@/hooks/useDriver";
import { debounce, toastFailed, toastSuccess } from "@/lib/utils";
import { DRIVERS_QUERY_KEY } from "@/keys/query-keys";
import { Driver } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash,
  View,
} from "lucide-react";
import { useRouter } from "next/navigation";

const ALERT_DELETE_DRIVER_NAME = "aler-confirm-delete";

const Drivers = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const { drivers, isRefetching, isLoading, isFetching } = useDriver();

  const {
    handleOpen,
    handleClose,
    data: driverId,
  } = useDialog<Driver | string>();

  const normalizeText = (text: string) => unidecode(text).toLowerCase();

  const deleteDriverMutation = useMutation({
    mutationFn: deleteDriver,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DRIVERS_QUERY_KEY });
      handleClose();
      toastSuccess("Deleted success");
    },
    onError: () => {
      toastFailed("Deleted failed");
    },
  });

  const deleteManyDriversMuatation = useMutation({
    mutationFn: deleteManyDrivers,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DRIVERS_QUERY_KEY });
      handleClose();
      toastSuccess("Deleted success");
    },
    onError: () => {
      toastFailed("Deleted failed");
    },
  });

  const isloading = useMemo(
    () =>
      isLoading ||
      isFetching ||
      isRefetching ||
      deleteDriverMutation.isPending ||
      deleteManyDriversMuatation.isPending,
    [
      deleteDriverMutation.isPending,
      deleteManyDriversMuatation.isPending,
      isFetching,
      isLoading,
      isRefetching,
    ]
  );

  const columns: ColumnDef<Driver>[] = [
    {
      id: "select",
      header: ({ table }) => (
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
              <Trash
                className="w-[16px] ml-1 text-red-600 hover:cursor-pointer hover:opacity-80"
                onClick={() => {
                  handleOpen(ALERT_DELETE_DRIVER_NAME);
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
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Full Name
            <ArrowUpDown className="w-[16px] h-[16px] ml-1" />
          </Button>
        );
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email
            <ArrowUpDown className="w-[16px] h-[16px] ml-1" />
          </Button>
        );
      },
    },
    {
      accessorKey: "phone",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Phone number
            <ArrowUpDown className="w-[16px] h-[16px] ml-1" />
          </Button>
        );
      },
    },
    {
      accessorKey: "vehicle",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Vehicle
            <ArrowUpDown className="w-[16px] h-[16px] ml-1" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const driver = row.original;
        const vehicle = driver.vehicle;
        return (
          <div>{`${vehicle.brand}-${vehicle.model}-${vehicle.plate}`}</div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const driver = row.original;

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
                  handleOpen(DIALOG_DRIVER_NAME, driver);
                }}
              >
                <Pencil className="w-[16px]" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-2"
                onClick={() => {
                  router.push(`/drivers/${row.getValue("id")}`);
                }}
              >
                <View className="w-[16px]" />
                View detail
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-2 !text-red-600"
                onClick={() => {
                  handleOpen(ALERT_DELETE_DRIVER_NAME, row.getValue("id"));
                }}
              >
                <Trash className="w-[16px]" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: drivers,
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
    []
  );

  const handleDelete = () => {
    if (selectedRowIds.length) {
      deleteManyDriversMuatation.mutate(selectedRowIds);
    } else if (typeof driverId === "string") {
      deleteDriverMutation.mutate(driverId);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-end gap-4 py-2">
        <h1 className="text-[32px] font-bold mr-auto">Driver list</h1>

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

        <Button
          onClick={() => {
            handleOpen(DIALOG_DRIVER_NAME);
          }}
        >
          <Plus className="h-[16px]" />
          Create driver
        </Button>
      </div>
      <hr />
      <br />

      <div className="rounded-md border">
        <Table className="">
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
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>

      <DialogDriver />
      <AlerDelete name={ALERT_DELETE_DRIVER_NAME} onOk={handleDelete} />
    </div>
  );
};

export default Drivers;
