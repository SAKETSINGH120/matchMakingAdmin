import React, { useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Menu,
  MenuItem,
  Skeleton,
  Typography,
  Fade,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CurrencyRupeeIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";
import { useThemeMode } from "../context/ThemeContext";

const GenericTable = ({
  data = [],
  columns = [],
  isLoading = false,
  ariaLabel = "data table",
  hasAction = true,
  limit = 10,
  page = 1,
  hasEdit = true,
  hasDelete = true,
  hasView = true,
  hasIncentive = false,
  hasCommissionList = false,
  onCommissionList,
  onEdit,
  onView,
  onDelete,
  onIncentive,
}) => {
  const { theme } = useThemeMode();
  const isDark = theme === "dark";
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleMenuOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const renderSkeletons = () =>
    Array.from(new Array(limit)).map((_, index) => (
      <TableRow key={`skeleton-${index}`}>
        <TableCell>
          <Skeleton variant="text" width={20} />
        </TableCell>
        {columns.map((_, i) => (
          <TableCell key={`col-skel-${i}`}>
            <Skeleton variant="text" />
          </TableCell>
        ))}
        {hasAction && (
          <TableCell>
            <Skeleton
              variant="circular"
              width={30}
              height={30}
              className="mx-auto"
            />
          </TableCell>
        )}
      </TableRow>
    ));

  const headerColor = isDark ? "#1d1c1c" : "#5F6F5C";
  const headerBorder = isDark ? "#3A3A3A" : "#4E5D4B";

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      className="overflow-hidden rounded-xl border shadow-sm transition-colors duration-200"
      sx={{
        borderColor: "var(--color-border)",
        backgroundColor: "var(--color-bg-secondary)",
      }}
    >
      <Table sx={{ minWidth: 650 }} stickyHeader aria-label={ariaLabel}>
        <TableHead>
          <TableRow
            sx={{
              background: `linear-gradient(90deg, ${headerColor} 0%, ${headerColor} 100%)`,
              "& .MuiTableCell-root": {
                color: "#fff",
                fontWeight: 700,
                textTransform: "uppercase",
                fontSize: "11px",
                letterSpacing: "0.14em",
                py: 2,
                borderBottom: `1px solid ${headerBorder}`,
                backgroundColor: headerColor,
              },
            }}
          >
            <TableCell sx={{ backgroundColor: headerColor }}>S.No</TableCell>
            {columns.map((col, idx) => (
              <TableCell key={idx} sx={{ backgroundColor: headerColor }}>
                {col.label}
              </TableCell>
            ))}
            {hasAction && (
              <TableCell align="center" sx={{ backgroundColor: headerColor }}>
                Actions
              </TableCell>
            )}
          </TableRow>
        </TableHead>

        <TableBody>
          {isLoading ? (
            renderSkeletons()
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length + 2}
                align="center"
                className="py-20"
                sx={{ backgroundColor: "var(--color-bg-secondary)" }}
              >
                <div className="flex flex-col items-center">
                  <div className="mb-3 rounded-full bg-theme-light-bg p-4 dark:bg-theme-dark-bg">
                    <ClipboardDocumentListIcon className="h-8 w-8 text-theme-light-textDisabled dark:text-theme-dark-textDisabled" />
                  </div>
                  <Typography
                    variant="body1"
                    className="font-medium text-theme-light-textSecondary dark:text-theme-dark-textSecondary"
                  >
                    No results found
                  </Typography>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, index) => (
              <TableRow
                key={row._id || index}
                hover
                className="group transition-colors duration-200 hover:bg-theme-light-info/10 dark:hover:bg-theme-dark-info/10"
                sx={{
                  backgroundColor: "var(--color-bg-secondary)",
                  "& .MuiTableCell-root": {
                    borderBottom: "1px solid var(--color-border)",
                    color: "var(--color-text-primary)",
                  },
                }}
              >
                <TableCell className="text-sm text-theme-light-textPrimary dark:text-theme-dark-textPrimary">
                  {(page - 1) * limit + index + 1}
                </TableCell>

                {columns.map((col, colIdx) => (
                  <TableCell
                    key={colIdx}
                    className="text-sm text-theme-light-textPrimary dark:text-theme-dark-textPrimary"
                  >
                    {col.render
                      ? col.render(row[col.key], row)
                      : (row[col.key] ?? (
                          <span className="text-theme-light-textDisabled dark:text-theme-dark-textDisabled">
                            â€”
                          </span>
                        ))}
                  </TableCell>
                ))}

                {hasAction && (
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, row)}
                      sx={{
                        color: "var(--color-text-primary)",
                        transition:
                          "color 200ms ease, background-color 200ms ease",
                        "&:hover": {
                          color: "var(--color-action-info)",
                          backgroundColor:
                            "color-mix(in srgb, var(--color-action-info) 12%, transparent)",
                        },
                      }}
                    >
                      <MoreVertIcon
                        fontSize="small"
                        sx={{ color: "var(--color-text-primary)" }}
                      />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        TransitionComponent={Fade}
        elevation={3}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          className: "mt-1 min-w-[180px] rounded-lg border shadow-xl",
          style: {
            padding: "4px",
            backgroundColor: "var(--color-bg-secondary)",
            borderColor: "var(--color-border)",
            color: "var(--color-text-primary)",
          },
        }}
      >
        {hasView && (
          <MenuItem
            onClick={() => {
              handleMenuClose();
              onView(selectedRow);
            }}
            className="gap-3 rounded-md py-2 text-sm text-theme-light-textSecondary transition-colors duration-200 hover:text-theme-light-info dark:text-theme-dark-textSecondary dark:hover:text-theme-dark-info"
          >
            <EyeIcon className="h-4 w-4" /> View Details
          </MenuItem>
        )}

        {hasCommissionList && (
          <MenuItem
            onClick={() => {
              handleMenuClose();
              onCommissionList(selectedRow);
            }}
            className="gap-3 rounded-md py-2 text-sm text-theme-light-textSecondary transition-colors duration-200 hover:text-theme-light-warningText dark:text-theme-dark-textSecondary dark:hover:text-theme-dark-warning"
          >
            <CurrencyRupeeIcon className="h-4 w-4" /> Commission List
          </MenuItem>
        )}

        {hasIncentive && (
          <MenuItem
            onClick={() => {
              handleMenuClose();
              onIncentive(selectedRow);
            }}
            className="gap-3 rounded-md py-2 text-sm text-theme-light-textSecondary transition-colors duration-200 hover:text-theme-light-warningText dark:text-theme-dark-textSecondary dark:hover:text-theme-dark-warning"
          >
            <CurrencyRupeeIcon className="h-4 w-4" /> Incentive
          </MenuItem>
        )}

        {hasEdit && (
          <MenuItem
            onClick={() => {
              handleMenuClose();
              onEdit(selectedRow);
            }}
            className="gap-3 rounded-md py-2 text-sm text-theme-light-textSecondary transition-colors duration-200 hover:text-theme-light-primaryButton dark:text-theme-dark-textSecondary dark:hover:text-theme-dark-primaryButton"
          >
            <PencilIcon className="h-4 w-4" /> Edit Record
          </MenuItem>
        )}

        {hasDelete && (
          <div className="my-1 border-t border-theme-light-border dark:border-theme-dark-border" />
        )}

        {hasDelete && (
          <MenuItem
            onClick={() => {
              handleMenuClose();
              onDelete(selectedRow);
            }}
            className="gap-3 rounded-md py-2 text-sm text-theme-light-danger transition-colors duration-200 hover:bg-theme-light-danger/10 dark:text-theme-dark-danger dark:hover:bg-theme-dark-danger/10"
          >
            <TrashIcon className="h-4 w-4" /> Delete
          </MenuItem>
        )}
      </Menu>
    </TableContainer>
  );
};

export default GenericTable;
