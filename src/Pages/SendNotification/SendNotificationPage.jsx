import React, { useEffect, useState, useRef, useCallback } from "react";
import { createNotification } from "../../Services/NotificationApi";
import Breaker from "../../compoents/Breaker";
import Loader from "../../compoents/Loader";
import toast from "react-hot-toast";
import { getAllStudents } from "../../Services/StudentApi";
import { getAllCounsellor } from "../../Services/CounsellorApi";
import { useNavigate } from "react-router-dom";

const ROWS_PER_PAGE = 20;

const SendNotificationPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    recipientType: "user",
    allUsers: false,
    allCounsellors: false,
    userIds: [],
    counsellorIds: [],
    image: null,
    notificationType: "",
    type: "",
  });
  const [data, setData] = useState({
    user: { list: [], page: 1, hasMore: true, search: "" },
    counsellor: { list: [], page: 1, hasMore: true, search: "" },
  });
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const observer = useRef();
  const dropdownRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const navigate = useNavigate();

  const currentList = data[formData.recipientType].list;
  const selectedIds = formData[`${formData.recipientType}Ids`];
  const allKey = `all${
    formData.recipientType.charAt(0).toUpperCase() +
    formData.recipientType.slice(1)
  }s`;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch Function
  const fetchData = useCallback(
    async (data, type, page, search = "", reset = false) => {
      if (!data[type].hasMore && !reset) return;
      setLoading(true);

      try {
        let res;
        if (type === "user") {
          res = await getAllStudents({
            page,
            rowsPerPage: ROWS_PER_PAGE,
            searchQuery: search,
          });
        } else if (type === "counsellor") {
          res = await getAllCounsellor({
            page,
            rowsPerPage: ROWS_PER_PAGE,
            searchQuery: search,
          });
        }

        const newItems = res?.data || [];
        setData((prev) => ({
          ...prev,
          [type]: {
            list: reset ? newItems : [...prev[type].list, ...newItems],
            page: reset ? 2 : prev[type].page + 1,
            hasMore: newItems.length === ROWS_PER_PAGE,
            search,
          },
        }));
      } catch (err) {
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
        setIsSearching(false);
      }
    },
    []
  );

  // Initial Load
  useEffect(() => {
    fetchData(data, "user", 1, "", true);
    fetchData(data, "counsellor", 1, "", true);
  }, [fetchData]);

  // Search with Debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchQuery !== data[formData.recipientType].search) {
        setIsSearching(true);
        fetchData(data, formData.recipientType, 1, searchQuery, true);
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchQuery, formData.recipientType, fetchData]);

  // Infinite Scroll Observer
  const lastItemRef = useCallback(
    (node) => {
      if (loading || isSearching) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && data[formData.recipientType].hasMore) {
          fetchData(
            data,
            formData.recipientType,
            data[formData.recipientType].page,
            data[formData.recipientType].search
          );
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, isSearching, formData.recipientType, fetchData]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (file) setFormData((p) => ({ ...p, image: file }));
  };

  const toggleSelection = (id) => {
    const type = formData.recipientType;
    setFormData((p) => ({
      ...p,
      [`${type}Ids`]: p[`${type}Ids`].includes(id)
        ? p[`${type}Ids`].filter((i) => i !== id)
        : [...p[`${type}Ids`], id],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setApiError({});

    const errors = {};
    if (!formData.notificationType.trim())
      errors.notificationType = "NotificationType is required.";

    if (!formData.title.trim()) {
      errors.title = "Title is required.";
    }

    if (!formData.type.trim()) {
      errors.type = "Type is required.";
    }

    if (!formData.message.trim()) {
      errors.message = "Message is required.";
    }

    if (Object.keys(errors).length > 0) {
      setApiError(errors);
      setSubmitLoading(false);
      return;
    }

    const payload = new FormData();
    payload.append("title", formData.title);
    if (formData.message) payload.append("message", formData.message);
    payload.append("recipientType", formData.recipientType);

    const type = formData.recipientType;
    const allKey = `all${type.charAt(0).toUpperCase() + type.slice(1)}s`;

    if (formData[allKey]) {
      payload.append("specificUserIds", "[]");
    } else {
      formData[`${type}Ids`].forEach((id) =>
        payload.append("specificUserIds", id)
      );
    }
    payload.append("notificationType", formData.notificationType);
    payload.append("type", formData.type);

    if (formData.image) payload.append("image", formData.image);

    try {
      const res = await createNotification(payload);
      if (res.status) {
        toast.success(`Notification queued! Job ID: ${res.data?.jobId}`);
      }

      setFormData((p) => ({
        ...p,
        title: "",
        message: "",
        image: null,
        [`${type}Ids`]: [],
      }));
      navigate(-1);
    } catch (err) {
      toast.error(err.message || "Failed to send");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="m-3">
      <div className="mb-4">
        <Breaker label="Send Bulk Notification" />
      </div>

      <div className="ml-5 mt-8 bg-white p-6 max-w-9xl rounded-xl shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Send Bulk Notification
        </h2>

        {/* Tabs */}
        <div className="flex gap-3 mb-6 flex-wrap">
          {["user", "counsellor"].map((type) => (
            <button
              key={type}
              onClick={() => {
                setFormData((p) => ({ ...p, recipientType: type }));
                setSearchQuery(data[type].search);
              }}
              className={`px-6 py-2 rounded-xl font-medium transition-all capitalize ${
                formData.recipientType === type
                  ? "bg-linear-to-l from-[#181e2a] to-[#181e2a] text-white shadow-md"
                  : "border border-gray-400 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {type + "s"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="ml-2 font-medium block text-gray-700">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full h-11 border border-gray-400 rounded-xl pl-4 focus:outline-none focus:border-[#c1ab87]"
              placeholder="Notification title"
            />
            {apiError.title && (
              <p className="text-red-500 text-sm ml-2 mt-1">{apiError.title}</p>
            )}
          </div>

          {/* ---------- Notification Type ---------- */}
          <div className=" flex flex-col gap-y-1 my-4">
            <label className="ml-2 font-normal mb-1">NotificationType:</label>
            <select
              name="notificationType"
              value={formData.notificationType}
              onChange={handleChange}
              className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
            >
              <option value="">Select notificationType</option>
              <option value="push">Firebase Push Notification</option>
              <option value="email">Email Notification</option>
            </select>
            {apiError.notificationType && (
              <p className="text-red-500 text-sm ml-2">
                {apiError.notificationType}
              </p>
            )}
          </div>

          {/* ---------- Type ---------- */}
          <div className=" flex flex-col gap-y-1 my-4">
            <label className="ml-2 font-normal mb-1">Type:</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
            >
              <option value="">Select Type</option>
              <option value="custom">Custom</option>
              <option value="application">Application</option>
              <option value="booking">Booking</option>
              <option value="scholarship">Scholarship</option>
            </select>
            {apiError.type && (
              <p className="text-red-500 text-sm ml-2">{apiError.type}</p>
            )}
          </div>

          {/* Recipient Selection */}
          <div>
            <label className="ml-2 font-medium block text-gray-700 mb-2">
              Select Recipients
            </label>

            <div className="flex items-center mb-3">
              <input
                type="checkbox"
                checked={formData[allKey]}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    [allKey]: e.target.checked,
                    [`${formData.recipientType}Ids`]: e.target.checked
                      ? []
                      : p[`${formData.recipientType}Ids`],
                  }))
                }
                className="mr-2 w-4 h-4"
              />
              <span className="font-medium">
                Send to All {formData.recipientType + "s"}
              </span>
            </div>

            {!formData[allKey] && (
              <div className="relative" ref={dropdownRef}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, email, mobile..."
                  className="w-full h-11 border border-gray-400 rounded-xl pl-4 pr-10 focus:outline-none focus:border-[#c1ab87]"
                  onClick={() => setIsDropdownOpen(true)}
                />
                <span className="absolute right-3 top-3 text-gray-500">
                  Search
                </span>

                {isDropdownOpen && (
                  <div className="mt-1 max-h-64 overflow-y-auto border border-gray-300 rounded-xl bg-white shadow-lg absolute w-full z-10 mb-4 py-2">
                    {currentList.length === 0 && !loading ? (
                      <p className="p-3 text-gray-500 text-center">No data</p>
                    ) : (
                      currentList.map((item, index) => (
                        <label
                          key={item._id}
                          ref={
                            index === currentList.length - 1
                              ? lastItemRef
                              : null
                          }
                          className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                          onClick={() => toggleSelection(item._id)}
                        >
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(item._id)}
                            readOnly
                            className="mr-3"
                          />
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-500">
                              {item.email} {item.mobile && `| ${item.mobile}`}
                            </p>
                          </div>
                        </label>
                      ))
                    )}
                    {loading && (
                      <div className="p-3 text-center">
                        <Loader small />
                      </div>
                    )}
                  </div>
                )}

                {selectedIds.length > 0 && (
                  <p className="mt-2 text-sm text-gray-600">
                    {selectedIds.length} selected
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Message */}
          <div>
            <label className="ml-2 font-medium block text-gray-700">
              Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-400 rounded-xl pl-4 pt-3 focus:outline-none focus:border-[#c1ab87] resize-none"
              placeholder="Message"
            />
            {apiError.message && (
              <p className="text-red-500 text-sm ml-2 mt-1">
                {apiError.message}
              </p>
            )}
          </div>

          {/* Image */}
          {formData.notificationType === "push" && (
            <div>
              <label className="ml-2 font-medium block text-gray-700">
                Image (Optional)
              </label>
              <label
                htmlFor="image-upload"
                className="flex items-center justify-center h-11 border border-dashed border-gray-400 rounded-xl cursor-pointer hover:border-[#c1ab87] transition"
              >
                Upload Image
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImage}
                className="hidden"
              />
              {formData.image && (
                <p className="mt-1 text-sm text-gray-600 ml-2">
                  {formData.image.name}
                </p>
              )}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitLoading}
            className="w-full bg-gradient-to-l from-[#181e2a] to-[#181e2a] text-white font-bold py-3 rounded-xl "
          >
            {submitLoading ? "Sending..." : "Send Notification"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SendNotificationPage;
