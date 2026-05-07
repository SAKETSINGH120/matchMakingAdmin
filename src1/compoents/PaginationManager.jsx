import React from "react";
import PaginationChanger from "./PaginationChanger";
import { Pagination, Stack } from "@mui/material";

const PaginationManager = ({
  rowsPerPage,
  totalRecord,
  totalPages,
  page,
  setSearchParams,
  searchParams
}) => {
  const handlePageChange = (event, newPage) => {
    const sp = new URLSearchParams(searchParams);
    sp.set("page", String(newPage));
    setSearchParams(sp);
  };

  const handleRowsPerPageChange = (event) => {
    const newLimit = parseInt(event.target.value, 10);
    const sp = new URLSearchParams(searchParams);
    sp.set("rowsPerPage", String(newLimit));
    sp.set("page", "1");
    setSearchParams(sp);
  };

  return (
    <div className="relative flex items-center mb-4 mt-6">
      <PaginationChanger
        value={rowsPerPage}
        onChange={handleRowsPerPageChange}
      />
      {totalRecord > rowsPerPage && (
        <div className="absolute left-1/2 -translate-x-1/2">
          <Stack spacing={2} alignItems="center">
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              variant="outlined"
              color="primary"
              className="rounded-lg p-2"
              boundaryCount={1}
              siblingCount={1}
              aria-label="Pagination for college list"
            />
          </Stack>
        </div>
      )}
    </div>
  );
};

export default PaginationManager;
