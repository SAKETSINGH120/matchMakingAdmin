

// import React, { useState } from "react";
// import Paper from "@mui/material/Paper";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TableRow from "@mui/material/TableRow";
// import IconButton from "@mui/material/IconButton";
// import Menu from "@mui/material/Menu";
// import MenuItem from "@mui/material/MenuItem";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import { StyledTableCell, StyledTableRow } from "../utils/tableStyleTemplates";
// import { PencilIcon, TrashIcon, EyeIcon } from "@heroicons/react/24/outline";
// import LoaderBtn from "./LoderBtn";

// const GenericTable = ({
//   data,
//   columns,
//   isLoading = false,
//   ariaLabel = "table",
//   hasAction = true,
//   limit = 10,
//   page = 1,
//   hasEdit = true,
//   hasDelete = true,
//   hasView = true,
//   hasIncentive = false,
//   // ── NEW PROPS ──
//   hasCommissionList = false,
//   onCommissionList,
//   // ───────────────
//   onEdit,
//   onView,
//   onDelete,
//   onIncentive,
// }) => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [selectedRowId, setSelectedRowId] = useState(null);

//   const handleMenuOpen = (event, id) => {
//     setAnchorEl(event.currentTarget);
//     setSelectedRowId(id);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//     setSelectedRowId(null);
//   };

//   return (
//     <TableContainer
//       component={Paper}
//       className="rounded-xl shadow-lg overflow-hidden"
//     >
//       <Table sx={{ minWidth: 500, tableLayout: "auto" }} aria-label={ariaLabel}>
//         <TableHead>
//           <TableRow>
//             <StyledTableCell>S.No</StyledTableCell>
//             {columns.map((col) => (
//               <StyledTableCell>{col.label}</StyledTableCell>
//             ))}
//             {hasAction && (
//               <StyledTableCell align="center">Actions</StyledTableCell>
//             )}
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {isLoading ? (
//             <LoaderBtn />
//           ) : data.length === 0 ? (
//             <StyledTableRow>
//               <StyledTableCell
//                 colSpan={4}
//                 align="center"
//                 className="py-8 text-gray-500 text-lg"
//               >
//                 No Data found
//               </StyledTableCell>
//             </StyledTableRow>
//           ) : (
//             data.map((row, index) => (
//               <StyledTableRow key={row._id}>
//                 <StyledTableCell>
//                   {(page - 1) * limit + index + 1}
//                 </StyledTableCell>
//                 {columns.map((col) => (
//                   <StyledTableCell
//                     className="font-medium text-gray-800"
//                     key={row[col.key] || col.key}
//                   >
//                     {col.render
//                       ? col.render(row[col.key], row)
//                       : row[col.key] ?? "N/A"}
//                   </StyledTableCell>
//                 ))}
//                 {hasAction && (
//                   <StyledTableCell align="center">
//                     <IconButton
//                       onClick={(e) => handleMenuOpen(e, row._id)}
//                       className="text-gray-500 hover:text-gray-700"
//                       aria-label={`Actions for ${row.name ?? row._id}`}
//                     >
//                       <MoreVertIcon />
//                     </IconButton>
//                     <Menu
//                       anchorEl={anchorEl}
//                       open={Boolean(anchorEl) && selectedRowId === row._id}
//                       onClose={handleMenuClose}
//                       PaperProps={{
//                         className: "shadow-lg rounded-lg",
//                       }}
//                     >
//                       {hasView && (
//                         <MenuItem
//                           onClick={() => {
//                             handleMenuClose();
//                             onView(row);
//                           }}
//                           className="flex items-center gap-2 text-gray-700 hover:bg-gray-100"
//                         >
//                           <EyeIcon className="h-5 w-5 text-blue-600" />
//                           View
//                         </MenuItem>
//                       )}
//                       {/* ── NEW OPTION ADDED HERE ── */}
//                       {hasCommissionList && (
//                         <MenuItem
//                           onClick={() => {
//                             handleMenuClose();
//                             onCommissionList(row);
//                           }}
//                           className="flex items-center gap-2 text-gray-700 hover:bg-gray-100"
//                         >
//                           <span className="pl-1 text-yellow-600 font-bold text-2xl ">₹</span>
//                           Agent Commission List
//                         </MenuItem>
//                       )}
//                       {/* ──────────────────────────── */}
//                       {hasIncentive && (
//                         <MenuItem
//                           onClick={() => {
//                             handleMenuClose();
//                             onIncentive(row);
//                           }}
//                           className="flex items-center gap-2 text-gray-700 hover:bg-gray-100"
//                         >
//                           <span className="pl-2 h-6 w-6 text-xl text-yellow-600 font-bold">₹</span>
//                           Incentive
//                         </MenuItem>
//                       )}
//                       {hasEdit && (
//                         <MenuItem
//                           onClick={() => {
//                             handleMenuClose();
//                             onEdit(row);
//                           }}
//                           className="flex items-center gap-2 text-gray-700 hover:bg-gray-100"
//                         >
//                           <PencilIcon className="h-5 w-5 text-green-600" />
//                           Edit
//                         </MenuItem>
//                       )}
//                       {hasDelete && (
//                         <MenuItem
//                           onClick={() => {
//                             handleMenuClose();
//                             onDelete(row);
//                           }}
//                           className="flex items-center gap-2 text-gray-700 hover:bg-gray-100"
//                         >
//                           <TrashIcon className="h-5 w-5 text-red-600" />
//                           Delete
//                         </MenuItem>
//                       )}
//                     </Menu>
//                   </StyledTableCell>
//                 )}
//               </StyledTableRow>
//             ))
//           )}
//         </TableBody>
//       </Table>
//     </TableContainer>
//   );
// };

// export default GenericTable;


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
  ClipboardDocumentListIcon
} from "@heroicons/react/24/outline";

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

  // Helper to render Skeleton Rows while loading
  const renderSkeletons = () => (
    Array.from(new Array(limit)).map((_, index) => (
      <TableRow key={`skeleton-${index}`}>
        <TableCell><Skeleton variant="text" width={20} /></TableCell>
        {columns.map((_, i) => (
          <TableCell key={`col-skel-${i}`}><Skeleton variant="text" /></TableCell>
        ))}
        {hasAction && <TableCell><Skeleton variant="circular" width={30} height={30} className="mx-auto" /></TableCell>}
      </TableRow>
    ))
  );

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      className="border border-gray-200 rounded-xl overflow-hidden shadow-sm transition-all"
    >
      <Table sx={{ minWidth: 650 }} stickyHeader aria-label={ariaLabel}>
        <TableHead>
          <TableRow>
            <TableCell className="bg-gray-50 font-bold text-gray-600 uppercase text-[11px] tracking-wider py-4">
              S.No
            </TableCell>
            {columns.map((col, idx) => (
              <TableCell
                key={idx}
                className="bg-gray-50 font-bold text-gray-600 uppercase text-[11px] tracking-wider py-4"
              >
                {col.label}
              </TableCell>
            ))}
            {hasAction && (
              <TableCell align="center" className="bg-gray-50 font-bold text-gray-600 uppercase text-[11px] tracking-wider py-4">
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
              <TableCell colSpan={columns.length + 2} align="center" className="py-20">
                <div className="flex flex-col items-center">
                  <div className="bg-gray-50 p-4 rounded-full mb-3">
                    <ClipboardDocumentListIcon className="h-8 w-8 text-gray-300" />
                  </div>
                  <Typography variant="body1" className="text-gray-400 font-medium">
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
                className="transition-colors hover:bg-blue-50/30 group"
              >
                <TableCell className="text-gray-500 text-sm">
                  {(page - 1) * limit + index + 1}
                </TableCell>

                {columns.map((col, colIdx) => (
                  <TableCell key={colIdx} className="text-gray-700 text-sm">
                    {col.render
                      ? col.render(row[col.key], row)
                      : (row[col.key] ?? <span className="text-gray-300">—</span>)
                    }
                  </TableCell>
                ))}

                {hasAction && (
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, row)}
                      className="text-gray-400 group-hover:text-blue-600 transition-colors"
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Modernized Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        TransitionComponent={Fade}
        elevation={3}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          className: "mt-1 min-w-[180px] rounded-lg border border-gray-100 shadow-xl",
          style: { padding: '4px' }
        }}
      >
        {hasView && (
          <MenuItem
            onClick={() => { handleMenuClose(); onView(selectedRow); }}
            className="rounded-md gap-3 py-2 text-sm text-gray-600 hover:text-blue-600"
          >
            <EyeIcon className="h-4 w-4" /> View Details
          </MenuItem>
        )}

        {hasCommissionList && (
          <MenuItem
            onClick={() => { handleMenuClose(); onCommissionList(selectedRow); }}
            className="rounded-md gap-3 py-2 text-sm text-gray-600 hover:text-yellow-700"
          >
            <CurrencyRupeeIcon className="h-4 w-4" /> Commission List
          </MenuItem>
        )}

        {hasIncentive && (
          <MenuItem
            onClick={() => { handleMenuClose(); onIncentive(selectedRow); }}
            className="rounded-md gap-3 py-2 text-sm text-gray-600 hover:text-yellow-700"
          >
            <CurrencyRupeeIcon className="h-4 w-4" /> Incentive
          </MenuItem>
        )}

        {hasEdit && (
          <MenuItem
            onClick={() => { handleMenuClose(); onEdit(selectedRow); }}
            className="rounded-md gap-3 py-2 text-sm text-gray-600 hover:text-green-600"
          >
            <PencilIcon className="h-4 w-4" /> Edit Record
          </MenuItem>
        )}

        {hasDelete && (
          <div className="border-t border-gray-50 my-1" />
        )}

        {hasDelete && (
          <MenuItem
            onClick={() => { handleMenuClose(); onDelete(selectedRow); }}
            className="rounded-md gap-3 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <TrashIcon className="h-4 w-4" /> Delete
          </MenuItem>
        )}
      </Menu>
    </TableContainer>
  );
};

export default GenericTable;