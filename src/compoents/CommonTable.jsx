import React from "react";
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { StyledTableCell, StyledTableRow } from "../utils/tableStyleTemplates";

const CommonTable = ({
  columns, // Array of column definitions: { header: string, render: (row) => JSX }
  data, // Array of row data
  loading, // Boolean to show "No data" or rows
  page,
  rowsPerPage,
  emptyMessage = "No data found",
}) => {
  return (
    <TableContainer
      component={Paper}
      className="overflow-hidden rounded-xl border shadow-lg transition-colors duration-200"
      sx={{
        backgroundColor: "var(--color-bg-secondary)",
        borderColor: "var(--color-border)",
      }}
    >
      <Table sx={{ minWidth: 700 }} aria-label="common table">
        <TableHead>
          <TableRow sx={{ backgroundColor: "var(--color-action-primary)" }}>
            {columns.map((col, idx) => (
              <StyledTableCell
                key={idx}
                sx={{
                  backgroundColor: "var(--color-action-primary)",
                  color: "#ffffff",
                  fontWeight: 600,
                  borderBottom: "1px solid var(--color-border)",
                }}
              >
                {col.header}
              </StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <StyledTableRow>
              <StyledTableCell
                colSpan={columns.length}
                align="center"
                className="py-8"
                sx={{
                  color: "var(--color-text-secondary)",
                  backgroundColor: "var(--color-bg-secondary)",
                }}
              >
                <div className="flex justify-center items-center gap-2">
                  Loading...
                </div>
              </StyledTableCell>
            </StyledTableRow>
          ) : data.length === 0 ? (
            <StyledTableRow>
              <StyledTableCell
                colSpan={columns.length}
                align="center"
                className="py-10 text-lg"
                sx={{
                  color: "var(--color-text-secondary)",
                  backgroundColor: "var(--color-bg-secondary)",
                  fontStyle: "italic",
                }}
              >
                {emptyMessage}
              </StyledTableCell>
            </StyledTableRow>
          ) : (
            data.map((row, index) => (
              <StyledTableRow
                key={row.id || index}
                sx={{
                  "&:nth-of-type(odd)": {
                    backgroundColor: "var(--color-bg-secondary)",
                  },
                  "&:nth-of-type(even)": {
                    backgroundColor: "var(--color-bg-secondary)",
                  },
                  "&:hover": {
                    backgroundColor:
                      "color-mix(in srgb, var(--color-action-info) 10%, var(--color-bg-secondary)) !important",
                  },
                  borderBottom: "1px solid var(--color-border)",
                }}
              >
                {columns.map((col, colIdx) => (
                  <StyledTableCell
                    key={colIdx}
                    sx={{
                      color: "var(--color-text-primary)",
                      borderBottom: "1px solid var(--color-border)",
                    }}
                  >
                    {col.render
                      ? col.render(row, index, page, rowsPerPage)
                      : row[col.key] || "N/A"}
                  </StyledTableCell>
                ))}
              </StyledTableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CommonTable;
