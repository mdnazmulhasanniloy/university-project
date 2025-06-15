"use client";

import { Pagination } from "react-pagination-bar";
import "./CustomPagination.css";
import { cn } from "@/lib/utils";

export default function CustomPagination({
  total,
  pageSize,
  currentPage,
  setCurrentPage,
  className,
  pageNeighbors,
}) {
  return (
    <div className={cn("ml-auto mt-16 w-max", className)}>
      <Pagination
        totalItems={total}
        itemsPerPage={pageSize}
        currentPage={currentPage}
        onPageChange={(pageNumber) => setCurrentPage(pageNumber)}
        pageNeighbours={pageNeighbors}
      />
    </div>
  );
}
