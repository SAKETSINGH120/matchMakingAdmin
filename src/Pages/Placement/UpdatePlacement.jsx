import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Breaker from "../../compoents/Breaker";
import {
  updatePlacementApi,
  getPlacementApi,
} from "../../Services/PlacementApi"; // Assuming service file with update/get functions
import { getAllcollage } from "../../Services/CollageApi,"; // Assuming the API is here
import toast from "react-hot-toast";
import Loader from "../../compoents/Loader";

const ROWS_PER_PAGE = 20;

const UpdatePlacement = () => {
  const { id } = useParams(); // Assuming route /update-placement/:id
  const [apiMessage, setApiMessage] = useState("");
  const [formData, setFormData] = useState({
    description: "",
    college: "", // Will hold the selected college ID
    offerMade: [{ statistics: "", year: "" }], // Array of objects
    averageSalary: [{ statistics: "", year: "" }],
    highestSalary: [{ statistics: "", year: "" }],
    studentPlaced: [{ statistics: "", year: "" }],
    companyVisited: [{ statistics: "", year: "" }],
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [apiError, setApiError] = useState({});
  const navigate = useNavigate();
  const [collegeModal, setCollegeModal] = useState(false);
  const [collegeData, setCollegeData] = useState({
    list: [],
    page: 1,
    hasMore: true,
    search: "",
  });
  const collegeList = collegeData.list;
  const [collegeSearchQuery, setCollegeSearchQuery] = useState("");
  const [loadingCollegeData, setLoadingCollegeData] = useState(false);
  const [collegeSearchingFlag, setCollegeSearchingFlag] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const collegeDropdownRef = useRef(null);
  const observer = useRef();

  // Fetch existing placement data
  useEffect(() => {
    const fetchPlacement = async () => {
      try {
        setFetching(true);
        const res = await getPlacementApi(id); // Assume this fetches single placement
        if (res.status) {
          const placement = res.data; // Assuming { status: true, data: { ... } }
          setFormData({
            description: placement.description || "",
            college: placement.college?._id || placement.college || "",
            offerMade:
              placement.offerMade && placement.offerMade.length > 0
                ? placement.offerMade
                : [{ statistics: "", year: "" }],
            averageSalary:
              placement.averageSalary && placement.averageSalary.length > 0
                ? placement.averageSalary
                : [{ statistics: "", year: "" }],
            highestSalary:
              placement.highestSalary && placement.highestSalary.length > 0
                ? placement.highestSalary
                : [{ statistics: "", year: "" }],
            studentPlaced:
              placement.studentPlaced && placement.studentPlaced.length > 0
                ? placement.studentPlaced
                : [{ statistics: "", year: "" }],
            companyVisited:
              placement.companyVisited && placement.companyVisited.length > 0
                ? placement.companyVisited
                : [{ statistics: "", year: "" }],
          });
          if (typeof placement.college === "object" && placement.college)
            setSelectedCollege(placement.college);
        } else {
          toast.error(res.message || "Failed to fetch placement details");
        }
      } catch (error) {
        toast.error("Error fetching placement");
        console.error(error);
      } finally {
        setFetching(false);
      }
    };

    if (id) fetchPlacement();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Generic handlers for array sections
  const addEntry = (section) => {
    setFormData({
      ...formData,
      [section]: [...formData[section], { statistics: "", year: "" }],
    });
  };

  const removeEntry = (section, index) => {
    const newSection = formData[section].filter((_, i) => i !== index);
    setFormData({ ...formData, [section]: newSection });
  };

  const handleEntryChange = (section, index, field, value) => {
    const newSection = [...formData[section]];
    newSection[index][field] = value;
    setFormData({ ...formData, [section]: newSection });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setApiMessage("");
    setApiError({});

    const errors = {};
    if (!formData.description.trim())
      errors.description = "Description is required.";
    if (!formData.college) errors.college = "College is required.";
    // Validate arrays: at least one entry and fields not empty
    if (
      formData.offerMade.length === 0 ||
      formData.offerMade.every(
        (entry) => !entry.statistics.trim() && !entry.year.trim()
      )
    )
      errors.offerMade = "At least one offer made entry is required.";
    if (
      formData.averageSalary.length === 0 ||
      formData.averageSalary.every(
        (entry) => !entry.statistics.trim() && !entry.year.trim()
      )
    )
      errors.averageSalary = "At least one average salary entry is required.";
    if (
      formData.highestSalary.length === 0 ||
      formData.highestSalary.every(
        (entry) => !entry.statistics.trim() && !entry.year.trim()
      )
    )
      errors.highestSalary = "At least one highest salary entry is required.";
    if (
      formData.studentPlaced.length === 0 ||
      formData.studentPlaced.every(
        (entry) => !entry.statistics.trim() && !entry.year.trim()
      )
    )
      errors.studentPlaced = "At least one student placed entry is required.";
    if (
      formData.companyVisited.length === 0 ||
      formData.companyVisited.every(
        (entry) => !entry.statistics.trim() && !entry.year.trim()
      )
    )
      errors.companyVisited = "At least one company visited entry is required.";

    if (Object.keys(errors).length > 0) {
      setApiError(errors);
      setLoading(false);
      return;
    }

    try {
      // Prepare plain JSON payload as per example
      const payload = {
        description: formData.description,
        college: formData.college,
        offerMade: formData.offerMade,
        averageSalary: formData.averageSalary,
        highestSalary: formData.highestSalary,
        studentPlaced: formData.studentPlaced,
        companyVisited: formData.companyVisited,
      };

      const res = await updatePlacementApi({ id, data: payload }); // Send JSON directly, assume service handles
      if (res.status) {
        toast.success("Placement updated successfully!");
        navigate(-1);
      } else {
        const errorMessage =
          res?.message || res?.error?.message || "Something went wrong!";
        toast.error(errorMessage);
        setApiMessage(errorMessage);
      }
    } catch (error) {
      const catchErrorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Server error occurred";
      console.error("Error updating placement:", error);
      toast.error(catchErrorMessage);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelection = (college) => {
    if (college._id !== formData.college) {
      setFormData((prev) => ({ ...prev, college: college._id }));
      setSelectedCollege(college);
    } else {
      setFormData((prev) => ({ ...prev, college: "" }));
      setSelectedCollege(null);
    }
  };

  // Fetch Function
  const fetchData = useCallback(async (page, search = "", reset = false) => {
    if (!collegeData.hasMore && !reset) return;
    setLoadingCollegeData(true);

    try {
      const res = await getAllcollage({
        page,
        rowsPerPage: ROWS_PER_PAGE,
        searchQuery: search,
      });

      const newItems = res?.data || [];
      setCollegeData((prev) => ({
        ...prev,
        list: reset ? newItems : [...prev.list, ...newItems],
        page: reset ? 2 : prev.page + 1,
        hasMore: newItems.length === ROWS_PER_PAGE,
        search,
      }));
    } catch (err) {
      toast.error("Failed to load data");
    } finally {
      setLoadingCollegeData(false);
      setCollegeSearchingFlag(false);
    }
  }, []);

  const collegeLastItemRef = useCallback(
    (node) => {
      if (loadingCollegeData || collegeSearchingFlag) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && collegeData.hasMore) {
          fetchData(collegeData.page, collegeData.search);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loadingCollegeData, collegeSearchingFlag, fetchData]
  );

  // Initial Load
  useEffect(() => {
    fetchData(1, "", true);
  }, [fetchData]);

  // Search with Debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (collegeSearchQuery !== collegeData.search) {
        setCollegeSearchingFlag(true);
        fetchData(1, collegeSearchQuery, true);
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [collegeSearchQuery, fetchData]);

  useEffect(() => {
    const handleOnClick = (event) => {
      if (
        collegeDropdownRef.current &&
        !collegeDropdownRef.current.contains(event.target)
      ) {
        setCollegeModal(false);
      }
    };
    document.addEventListener("click", handleOnClick);

    return () => {
      document.removeEventListener("click", handleOnClick);
    };
  }, []);

  if (fetching) return <Loader />;

  // Helper to render array sections
  const renderArraySection = (section, label) => (
    <div className="mt-4">
      <label className="ml-2 font-normal block">{label}:</label>
      {formData[section].map((entry, index) => (
        <div
          key={index}
          className="border border-gray-300 p-4 mb-4 rounded-xl flex gap-4"
        >
          <div className="flex-1">
            <label className="ml-2 text-sm">Statistics:</label>
            <input
              className="w-full h-10 border rounded-xl pl-4 border-gray-500"
              type="text"
              placeholder="Statistics"
              value={entry.statistics}
              onChange={(e) =>
                handleEntryChange(section, index, "statistics", e.target.value)
              }
            />
          </div>
          <div className="flex-1">
            <label className="ml-2 text-sm">Year:</label>
            <input
              className="w-full h-10 border rounded-xl pl-4 border-gray-500"
              type="text"
              placeholder="Year"
              value={entry.year}
              onChange={(e) =>
                handleEntryChange(section, index, "year", e.target.value)
              }
            />
          </div>
          {formData[section].length > 1 && (
            <button
              type="button"
              onClick={() => removeEntry(section, index)}
              className="text-red-500 self-center"
            >
              Remove
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() => addEntry(section)}
        className="ml-2 text-blue-500 mb-4"
      >
        Add {label} Entry
      </button>
      {apiError[section] && (
        <p className="text-red-500 text-sm ml-2">{apiError[section]}</p>
      )}
    </div>
  );

  return (
    <div className="m-3">
      <div className="mb-4">
        <Breaker />
      </div>
      <div className="ml-5 mt-10 bg-white p-6 max-w-9xl rounded-xl shadow-xl">
        <form onSubmit={handleSubmit}>
          <label className="ml-2 font-normal">Description:</label>
          <br />
          <textarea
            className="w-full h-32 mb-1 mt-2 border rounded-xl pl-4 pt-2 border-gray-500 resize-vertical"
            name="description"
            placeholder="Placement Description"
            value={formData.description}
            onChange={handleChange}
          />
          {apiError.description && (
            <p className="text-red-500 text-sm ml-2">{apiError.description}</p>
          )}

          {/* ---------- College Name ---------- */}
          <div>
            <label className="ml-2 font-normal block mt-4 mb-2">
              Select College:
            </label>
            <div className="relative" ref={collegeDropdownRef}>
              <input
                type="text"
                value={collegeSearchQuery}
                onChange={(e) => setCollegeSearchQuery(e.target.value)}
                placeholder="Search by name..."
                className="w-full h-11 border border-gray-400 rounded-xl pl-4 pr-10 focus:outline-none focus:border-[#c1ab87]"
                onFocus={() => setCollegeModal(true)}
              />

              {collegeModal && (
                <div className="absolute w-full z-10 mt-1 max-h-64 overflow-y-auto border border-gray-300 rounded-xl bg-white shadow-lg">
                  {collegeList.length === 0 && !loadingCollegeData ? (
                    <p className="p-3 text-gray-500 text-center">No data</p>
                  ) : (
                    collegeList.map((item, index) => (
                      <label
                        key={item._id}
                        ref={
                          index === collegeList.length - 1
                            ? collegeLastItemRef
                            : null
                        }
                        className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                        htmlFor={item._id}
                      >
                        <input
                          type="checkbox"
                          checked={formData.college === item._id}
                          readOnly
                          className="mr-3"
                          id={item._id}
                          onClick={() => toggleSelection(item)}
                        />
                        <div>
                          <p className="font-medium">{item.collegeName}</p>
                        </div>
                      </label>
                    ))
                  )}
                  {loadingCollegeData && (
                    <div className="p-3 text-center">
                      <Loader small />
                    </div>
                  )}
                </div>
              )}
            </div>
            {formData.college.length > 0 && selectedCollege && (
              <p className="mt-2 text-sm text-gray-900 font-bold">
                {selectedCollege.collegeName} selected *
              </p>
            )}
            {apiError.college && (
              <p className="text-red-500 text-sm ml-2">{apiError.college}</p>
            )}
          </div>

          {renderArraySection("offerMade", "Offer Made")}
          {renderArraySection("averageSalary", "Average Salary")}
          {renderArraySection("highestSalary", "Highest Salary")}
          {renderArraySection("studentPlaced", "Student Placed")}
          {renderArraySection("companyVisited", "Company Visited")}

          {/* Submit */}
          <div className="flex items-center justify-between mt-6">
            <button
              type="button"
              disabled={loading}
              className="bg-gray-200 text-gray-900 outline-none border-none hover:bg-gray-300 font-medium gap-x-6 px-6 py-3 rounded-lg cursor-pointer"
              onClick={() => navigate(-1)}
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-l from-[#181e2a] to-[#232a3b] text-white hover:scale-105 active:scale-95 transition-transform duration-500 py-3 px-6 rounded-2xl"
            >
              {loading ? "Updating..." : "Update Placement"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePlacement;
