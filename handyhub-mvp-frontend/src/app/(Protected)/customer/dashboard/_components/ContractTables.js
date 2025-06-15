"use client";

import { DataTable } from "@/components/ui/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { useReactTable } from "@tanstack/react-table";
import {
  getPaginationRowModel,
  getFilteredRowModel,
  getCoreRowModel,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";

export default function ContractTables({ columns, data, loading }) {
  const [columnFilters, setColumnFilters] = useState([]);

  const tableData = useMemo(
    () => (loading ? Array(30).fill({}) : data),
    [loading, data],
  );

  const tableColumns = useMemo(
    () =>
      loading
        ? columns.map((column) => ({
            ...column,
            Cell: () => (
              <Skeleton className="absolute left-3 top-[39px] h-[14px] w-[60%] rounded-sm" />
            ),
          }))
        : columns,
    [loading],
  );

  const table = useReactTable({
    data: tableData,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      columnFilters,
    },
  });

  return <DataTable data={data} columns={columns} table={table} />;
}
