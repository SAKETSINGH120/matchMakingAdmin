import React, { useState } from "react";
import LoaderBtn from "./LoderBtn";
import xlsx from "json-as-xlsx";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const ExportButton = ({
  ariaLabel = "",
  excelName = "Data",
  dataToExport = [],
  columns,
  className = "",
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const exportFunc = async () => {
    if (dataToExport.length < 1) {
      return toast.error(`${excelName} list is empty!`);
    }
    setIsExporting(true);

    const settings = {
      fileName: excelName,
      extraLength: 3,
      writeMode: "writeFile",
      writeOptions: {},
      RTL: false,
    };

    const data = [
      {
        sheet: "Admission List",
        columns: columns,
        content: dataToExport,
      },
    ];

    try {
      xlsx(data, settings);
      toast.success("Exported to Excel successfully!");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      toast.error("Failed to export to Excel.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={exportFunc}
      className={`bg-green-600 text-white px-5 py-2.5 rounded-lg font-medium shadow hover:bg-green-700 transition-colors ${className}`}
      aria-label={ariaLabel}
    >
      {isExporting ? (
        <span className="flex items-center gap-2">
          <LoaderBtn />
          Export Excel
        </span>
      ) : (
        "Export Excel"
      )}
    </motion.button>
  );
};

export default ExportButton;
