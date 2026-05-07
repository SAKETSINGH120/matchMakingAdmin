import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { RxCross2 } from "react-icons/rx";

const Dropzone = ({
  name,
  onFilesUpdate,
  multipleFiles = true,
  title,
  isEditingDisable,
}) => {
  const onDrop = (acceptedFiles) => {
    onFilesUpdate(name, acceptedFiles);
  };

  const { getInputProps, getRootProps } = useDropzone({
    onDrop: onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    multiple: multipleFiles,
    disabled: isEditingDisable,
  });

  return !isEditingDisable ? (
    <div
      {...getRootProps()}
      className={`mt-1 flex rounded-md border-2 border-dashed border-gray-300 px-6 pb-6 pt-5 ${
        isEditingDisable ? "pointer-events-none opacity-50" : "cursor-pointer"
      } ${multipleFiles ? "justify-center" : "w-fit"}`}
    >
      <div className="space-y-1 text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 48 48"
          aria-hidden="true"
        >
          <path
            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div className="flex items-center text-sm text-light-gray dark:text-gray-300">
          <label
            htmlFor="file-upload"
            className="relative cursor-pointer rounded-md bg-blue-100 p-1 px-2 font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500 dark:bg-white"
          >
            {!isEditingDisable && (
              <span>{title ? title : "Upload a file"}</span>
            )}
            <input {...getInputProps()} disabled={isEditingDisable} />
          </label>
          <p className="pl-1">or drag and drop</p>
        </div>
        <p className="text-xs text-light-gray/90 dark:text-gray-200">
          PNG, JPG, webp up to 10MB
        </p>
      </div>
    </div>
  ) : null;
};

export const DropzoneFiles = ({
  files,
  fieldName,
  removeFile,
  isEditingDisable,
}) => {
  return (
    <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      {files?.map((file, index) => (
        <div key={index} className="relative">
          <img
            src={
              isEditingDisable && typeof file === "string"
                ? file
                : typeof file === "string"
                ? file
                : URL.createObjectURL(file)
            }
            alt={`${fieldName} ${index + 1}`}
            className="h-24 w-full rounded object-cover"
          />
          {typeof file !== "string" && (
            <button
              type="button"
              onClick={() => removeFile(fieldName, index)}
              className="absolute -right-2 -top-2 inline-flex items-center rounded-full border border-transparent bg-red-600 p-1 text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export const SingleFileUpload = ({
  name,
  title,
  onFilesUpdate,
  onRemoveFile,
  isEditingDisable,
  fileValue,
}) => {
  const [file, setFile] = useState(null);
  const fileUrl = isEditingDisable
    ? fileValue
    : file
    ? URL.createObjectURL(file)
    : typeof fileValue === "string"
    ? fileValue
    : null;

  const handleOnFileUpdate = (name, acceptedFiles) => {
    setFile(acceptedFiles[0]);
    onFilesUpdate(name, acceptedFiles);
  };

  const handleOnRemoveFile = () => {
    setFile(null);
    onRemoveFile(name);
  };

  return (
    <div className="flex flex-wrap items-start gap-4">
      {!isEditingDisable && (
        <Dropzone
          name={name}
          title={title}
          onFilesUpdate={handleOnFileUpdate}
          isEditingDisable={isEditingDisable}
        />
      )}
      {fileUrl && (
        <div className="relative">
          <img
            src={fileUrl}
            alt={`preview ${name}`}
            className="h-24 w-full rounded object-cover"
          />
          {!isEditingDisable && (
            <button
              className="absolute -right-2 -top-2 inline-flex items-center rounded-full border border-transparent bg-red-600 p-1 text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              onClick={handleOnRemoveFile}
            >
              <RxCross2 className="h-5 w-5 text-white" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Dropzone;
