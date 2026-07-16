"use client";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppStore";
import { fetchAllErrors } from "@/lib/features/errorSlice";
import TablePagination from "@mui/material/TablePagination";
const PaginationDashboard = () => {
  const { pagination } = useAppSelector((state) => state.errors);
  const dispatch = useAppDispatch();
  if (!pagination) return null;

  const { page, limit, total } = pagination;
  const handleChangePage = (
    _: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    dispatch(
      fetchAllErrors({
        page: newPage + 1,
        limit,
      }),
    );
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    dispatch(
      fetchAllErrors({
        page: 0,
        limit: +event?.target.value,
      }),
    );
  };
  return (
    <TablePagination
      rowsPerPageOptions={[5, 10, 25, 50]}
      component="div"
      count={total}
      page={page - 1}
      onPageChange={handleChangePage}
      rowsPerPage={limit}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
  );
};

export default PaginationDashboard;
