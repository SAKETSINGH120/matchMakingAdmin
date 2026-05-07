// // src/components/CommonTable.jsx
// import React from "react";
// import {
//   Table,
//   TableBody,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
// } from "@mui/material";
// import {
//   StyledTableCell,
//   StyledTableRow,
// } from "../utils/tableStyleTemplates";

// const CommonTable = ({
//   columns,          // Array of column definitions: { header: string, render: (row) => JSX }
//   data,             // Array of row data
//   loading,          // Boolean to show "No data" or rows
//   page,
//   rowsPerPage,
//   emptyMessage = "No data found",
// }) => {
//   return (
//     <TableContainer component={Paper} className="rounded-xl shadow-lg overflow-hidden">
//       <Table sx={{ minWidth: 700 }} aria-label="common table">
//         <TableHead>
//           <TableRow>
//             {columns.map((col, idx) => (
//               <StyledTableCell key={idx}>{col.header}</StyledTableCell>
//             ))}
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {loading ? (
//             <StyledTableRow>
//               <StyledTableCell colSpan={columns.length} align="center" className="py-8">
//                 <div className="flex justify-center">
//                   {/* You can replace this with your Loader component if needed */}
//                   Loading...
//                 </div>
//               </StyledTableCell>
//             </StyledTableRow>
//           ) : data.length === 0 ? (
//             <StyledTableRow>
//               <StyledTableCell
//                 colSpan={columns.length}
//                 align="center"
//                 className="py-8 text-gray-500 text-lg"
//               >
//                 {emptyMessage}
//               </StyledTableCell>
//             </StyledTableRow>
//           ) : (
//             data.map((row, index) => (
//               <StyledTableRow key={row.id || index}>
//                 {columns.map((col, colIdx) => (
//                   <StyledTableCell key={colIdx}>
//                     {col.render
//                       ? col.render(row, index, page, rowsPerPage)
//                       : row[col.key] || "N/A"}
//                   </StyledTableCell>
//                 ))}
//               </StyledTableRow>
//             ))
//           )}
//         </TableBody>
//       </Table>
//     </TableContainer>
//   );
// };

// export default CommonTable;

// src/components/CommonTable.jsx
import React from "react";
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import {
  StyledTableCell,
  StyledTableRow,
} from "../utils/tableStyleTemplates";

const CommonTable = ({
  columns,          // Array of column definitions: { header: string, render: (row) => JSX }
  data,             // Array of row data
  loading,          // Boolean to show "No data" or rows
  page,
  rowsPerPage,
  emptyMessage = "No data found",
}) => {
  return (
    <TableContainer 
      component={Paper} 
      className="rounded-xl shadow-lg overflow-hidden"
      sx={{
        backgroundColor: "#f8fafc", // very light gray-white (clean base)
        border: "1px solid #e2eadf",
      }}
    >
      <Table sx={{ minWidth: 700 }} aria-label="common table">
        <TableHead>
          <TableRow sx={{ backgroundColor: "#e2eadf" }}>
            {columns.map((col, idx) => (
              <StyledTableCell 
                key={idx}
                sx={{
                  backgroundColor: "#e2eadf",
                  color: "#2f4f4f",           // dark slate for contrast
                  fontWeight: 600,
                  borderBottom: "2px solid #c5d5ca",
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
                  color: "#64748b",
                  backgroundColor: "#f9fafb",
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
                  color: "#6b7280",
                  backgroundColor: "#f9fafb",
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
                  '&:nth-of-type(odd)': {
                    backgroundColor: "#fafffd", // almost white with tiny green tint
                  },
                  '&:nth-of-type(even)': {
                    backgroundColor: "#fdfffe", // pure white
                  },
                  '&:hover': {
                    backgroundColor: "#e8f5e9 !important", // light green on hover
                  },
                  borderBottom: "1px solid #e2eadf",
                }}
              >
                {columns.map((col, colIdx) => (
                  <StyledTableCell 
                    key={colIdx}
                    sx={{
                      color: "#1f2937",
                      borderBottom: "1px solid #e2eadf",
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