import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    background: "var(--color-action-primary)",
    color: "#ffffff",
    fontWeight: 600,
    fontSize: "0.95rem",
    padding: "12px 16px",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    borderBottom: "1px solid var(--color-border)",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: "0.9rem",
    color: "var(--color-text-primary)",
    padding: "12px 16px",
    borderBottom: "1px solid var(--color-border)",
  },
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "var(--color-bg-secondary)",
  },
  "&:hover": {
    backgroundColor:
      "color-mix(in srgb, var(--color-action-info) 10%, var(--color-bg-secondary))",
    transition: "background-color 0.2s ease",
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));
