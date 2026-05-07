import React from "react";

const CreateUpdateButton = ({ loading, className = "", text = "Create" }) => {
    return (
        <button
            type="submit"
            disabled={loading}
            className={`w-80 bg-[#FB721D] text-white hover:scale-105 active:scale-95 transition-transform duration-500 py-3 mt-2 rounded-2xl cursor-pointer ${className}`}
        >
            {text}
        </button>
    );
};

export default CreateUpdateButton;
