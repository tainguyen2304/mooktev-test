import {
  ColumnFiltersState,
  RowSelectionState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";

import { create } from "zustand";

interface BookingTableState {
  sorting: SortingState;
  setSorting: (
    update: SortingState | ((prev: SortingState) => SortingState)
  ) => void;

  searchText: string;
  setSearchText: (update: string | ((prev: string) => string)) => void;

  debouncedSearch: string;
  setDebouncedSearch: (update: string | ((prev: string) => string)) => void;

  rowSelection: RowSelectionState;
  setRowSelection: (
    update: RowSelectionState | ((prev: RowSelectionState) => RowSelectionState)
  ) => void;

  columnFilters: ColumnFiltersState;
  setColumnFilters: (
    update:
      | ColumnFiltersState
      | ((prev: ColumnFiltersState) => ColumnFiltersState)
  ) => void;

  columnVisibility: VisibilityState;
  setColumnVisibility: (
    update: VisibilityState | ((prev: VisibilityState) => VisibilityState)
  ) => void;
}

export const useBookingTableStore = create<BookingTableState>((set) => ({
  sorting: [],
  setSorting: (update) =>
    set((state) => ({
      sorting: typeof update === "function" ? update(state.sorting) : update,
    })),

  searchText: "",
  setSearchText: (update) =>
    set((state) => ({
      searchText:
        typeof update === "function" ? update(state.searchText) : update,
    })),

  debouncedSearch: "",
  setDebouncedSearch: (update) =>
    set((state) => ({
      debouncedSearch:
        typeof update === "function" ? update(state.debouncedSearch) : update,
    })),

  rowSelection: {},
  setRowSelection: (update) =>
    set((state) => ({
      rowSelection:
        typeof update === "function" ? update(state.rowSelection) : update,
    })),

  columnFilters: [],
  setColumnFilters: (update) =>
    set((state) => ({
      columnFilters:
        typeof update === "function" ? update(state.columnFilters) : update,
    })),

  columnVisibility: {},
  setColumnVisibility: (update) =>
    set((state) => ({
      columnVisibility:
        typeof update === "function" ? update(state.columnVisibility) : update,
    })),
}));
