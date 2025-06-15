import { Loader } from "lucide-react";
import { TableCell, TableRow } from "../ui/table";
import EmptyContainer from "../EmptyContainer/EmptyContainer";
import CustomLoader from "../CustomLoader/CustomLoader";

export default function TableLoaderWithEmpty({ isLoading, data }) {
  return (
    <>
      {/* ======== Show loading when fetching ======== */}
      {isLoading && (
        <TableRow className="!h-36">
          <TableCell colSpan={8}>
            <CustomLoader color="var(--primary-blue)" className="mx-auto" />
          </TableCell>
        </TableRow>
      )}

      {/* ============ Show empty if no pending quotes found =========== */}
      {!isLoading && data?.length === 0 && (
        <TableRow className="!h-36">
          <TableCell colSpan={8}>
            <EmptyContainer message="No data found" />
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
