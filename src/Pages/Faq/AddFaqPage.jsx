import React, { useState } from "react";
import toast from "react-hot-toast";
import { createFaqApi } from "../../Services/FaqApi";
import { useNavigate } from "react-router-dom";

const AddFaqPage = () => {
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    sectionName: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.question) {
      toast.error("Question is required");
      return;
    }

    if (!formData.answer) {
      toast.error("Answer is required");
      return;
    }

    if (!formData.sectionName) {
      toast.error("Section name is required");
      return;
    }

    try {
      const res = await createFaqApi(formData);
      if (res.status) {
        toast.success("FAQ created successfully!");
        navigate(-1);
        setFormData({ question: "", answer: "" });
      } else {
        toast.error(res.message || "Failed to create FAQ");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  const handleOnSelect = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, sectionName: value }));
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-md p-6 mt-6 rounded-xl">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold mb-4">Create FAQ</h2>
        <div>
          <button
            className="cursor-pointer bg-[#181e2a] text-white px-2 py-1 rounded-md"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Section Name */}
        <div>
          <label className="block text-gray-700 mb-1">Section name</label>
          <select
            className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
            onChange={handleOnSelect}
            value={formData.sectionName}
          >
            <option selected disabled value="">
              Select section name
            </option>
            <option value="study_in_india">Study In India</option>
            <option value="study_abroad">Study Abroad</option>
            <option value="schools">Schools</option>
            <option value="counselling">Counselling</option>
            <option value="top_courses_india">Top Courses India</option>
            <option value="top_courses_abroad">Top Courses Abroad</option>
            <option value="scholarship">Scholarship</option>
          </select>
        </div>
        {/* Question */}
        <div>
          <label className="block text-gray-700 mb-1">Question</label>
          <input
            type="text"
            name="question"
            value={formData.question}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
            required
          />
        </div>

        {/* Answer */}
        <div>
          <label className="block text-gray-700 mb-1">Answer</label>
          <textarea
            name="answer"
            value={formData.answer}
            onChange={handleChange}
            rows="4"
            className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
            required
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-gradient-to-l cursor-pointer from-[#181e2a] to-[#161b27] text-white font-bold hover:scale-105 active:scale-95 transition-transform duration-500 py-3 mt-6 rounded-2xl"
        >
          Create FAQ
        </button>
      </form>
    </div>
  );
};

export default AddFaqPage;
