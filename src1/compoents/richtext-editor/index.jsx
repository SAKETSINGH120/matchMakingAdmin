import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    ["link"],
    ["clean"],
  ],
};

const RichTextEditor = ({ onChange, initialValue = "", className = "" }) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleChange = (content) => {
    setValue(content);
    onChange(content);
  };

  return (
    <div className={`w-full ${className}`}>
      <ReactQuill
        value={value}
        onChange={handleChange}
        modules={modules}
        className="bg-white"
      />
    </div>
  );
};

export default RichTextEditor;
