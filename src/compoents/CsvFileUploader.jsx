import React, { useState } from "react";
import toast from "react-hot-toast";
import { downloadLocalFile } from "../utils/downloadLocalFile";
import { MdAdd } from "react-icons/md";

const CsvFileUploader = ({
  file,
  setFile,
  templatePath,
  fileUploader,
  fileName = null,
}) => {
  const [csvModalOpen, setCsvModalOpen] = useState(false);
  const [csvLoading, setCsvLoading] = useState(false);

  const handleOnDownloadExcelFormat = () => {
    downloadLocalFile(templatePath, fileName);
  };

  const closeCsvModal = () => {
    setCsvModalOpen(false);
    setFile(null);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
    } else {
      toast.error("Please select a valid CSV file");
    }
  };

  const handleCsvUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("No file selected");
      return;
    }

    setCsvLoading(true);
    try {
      const formData = new FormData();
      formData.append("path", file);

      const result = await fileUploader(formData);
      if (result?.status) {
        toast.success(result.message || "CSV uploaded successfully");
        closeCsvModal();
      } else {
        toast.error(result?.message || "Failed to upload CSV");
      }
    } catch (err) {
      console.log("Error while uploading csv - ", err);
      toast.error("Upload failed");
    } finally {
      setCsvLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <button
        className="flex items-center gap-x-1 rounded-lg py-2 px-4 text-white bg-gradient-to-l from-[#181e2a] to-[#232a3b] cursor-pointer transition-all duration-200 hover:text-gray-200 hover:from-[#232a3b] hover:to-[#181e2a]"
        onClick={() => setCsvModalOpen(true)}
      >
        {csvLoading ? (
          "Uploading..."
        ) : (
          <>
            <MdAdd />
            <span>CSV File Uploader</span>
          </>
        )}
      </button>
      {csvModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/10 flex justify-center items-center z-9999">
          <div className="bg-white p-5 rounded-lg shadow-lg w-[90%] max-w-[400px]">
            <h3 className="text-lg font-semibold text-[#333] mb-4">
              Upload CSV File
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              CSV must follow this format.{" "}
              <span
                role="button"
                onClick={handleOnDownloadExcelFormat}
                className="text-blue-500 text-sm cursor-pointer"
              >
                Get CSV format
              </span>
            </p>
            <form onSubmit={handleCsvUpload}>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="mb-4 rounded border border-[#ccc] border-solid p-2.5 w-full"
              />
              <div className="flex justify-end gap-2.5">
                <button
                  type="submit"
                  disabled={csvLoading}
                  className="disabled:bg-[#ccc]! disabled:cursor-not-allowed py-2.5 px-5 text-base border-none rounded cursor-pointer text-white bg-[#f76f72] hover:bg-[#e55e61]"
                >
                  {csvLoading ? "Uploading..." : "Upload"}
                </button>
                <button
                  type="button"
                  onClick={closeCsvModal}
                  disabled={csvLoading}
                  className="disabled:bg-[#ccc]! disabled:cursor-not-allowed py-2.5 px-5 text-base border-none rounded cursor-pointer text-white bg-[#2499cf] hover:bg-[#1a73e8]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CsvFileUploader;
