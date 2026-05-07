import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { updateFAQApi, getFAQByIdApi } from "../../Services/FaqApi";

const FaqUpdatePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    sectionName: "",
  });

  useEffect(() => {
    const fetchFAQ = async () => {
      try {
        const res = await getFAQByIdApi(id);
        if (res?.status) {
          setFormData({
            question: res.data.question,
            answer: res.data.answer,
            sectionName: res.data?.sectionName ?? "",
          });
        }
      } catch (err) {
        toast.error("Failed to load FAQ details");
      }
    };
    fetchFAQ();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
      const res = await updateFAQApi(id, formData);
      if (res?.status) {
        toast.success("FAQ updated successfully!");
        navigate(-1);
      } else {
        toast.error(res?.message || "Update failed");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleOnSelect = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, sectionName: value }));
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-6 mt-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-700">Update FAQ</h2>
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
          <label className="block text-sm font-medium text-gray-700">
            Question
          </label>
          <input
            type="text"
            name="question"
            value={formData.question}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Answer */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Answer
          </label>
          <textarea
            name="answer"
            value={formData.answer}
            onChange={handleChange}
            required
            rows="4"
            className="w-full p-2 border rounded-md"
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-l from-[#181e2a] to-[#161b27] text-white font-bold hover:scale-105 active:scale-95 transition-transform duration-500 py-3 mt-6 rounded-2xl"
        >
          Update FAQ
        </button>
      </form>
    </div>
  );
};

export default FaqUpdatePage;
