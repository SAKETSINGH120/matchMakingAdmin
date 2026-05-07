import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Breaker from "../../compoents/Breaker";
import toast from "react-hot-toast";
import Loader from "../../compoents/Loader";
import {
  getNotification,
  updateNotification,
} from "../../Services/NotificationApi";

const UpdateNotificationPage = () => {
  const { id } = useParams();
  const [apiMessage, setApiMessage] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    notificationType: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [apiError, setApiError] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      if (id) {
        try {
          setFetching(true);
          const res = await getNotification(id);
          if (res.status) {
            const data = res.data;
            setFormData({
              title: data?.title,
              notificationType: data?.notificationType,
              message: data?.message,
            });
          }
        } catch (error) {
          console.log(
            "Error while fetching notification details with err - ",
            error
          );
        } finally {
          setFetching(false);
        }
      }
    })();
  }, []);

  // -----------------------------------------------------------------
  // Generic text / number change
  // -----------------------------------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // -----------------------------------------------------------------
  // Form submit
  // -----------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setApiError({});
    setApiMessage("");

    // ---------- client‑side validation ----------
    const errors = {};
    if (!formData.title?.trim()) errors.title = "Title is required.";
    if (!formData.message?.trim()) errors.title = "Message is required.";
    if (!formData.notificationType?.trim())
      errors.notificationType = "NotificationType is required.";

    if (Object.keys(errors).length) {
      setApiError(errors);
      setLoading(false);
      return;
    }

    // ---------- build FormData ----------
    const bodyPayload = {
      title: formData.title?.trim(),
      message: formData.message?.trim(),
      notificationType: formData.notificationType?.trim(),
    };

    try {
      const res = await updateNotification({ id, data: bodyPayload });
      if (res.status) {
        toast.success("Notification updated successfully!");
        navigate(-1);
      } else {
        const msg =
          res?.message || res?.error?.message || "Something went wrong!";
        toast.error(msg);
        setApiMessage(msg);
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Server error occurred";
      toast.error(msg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------
  if (loading | fetching) return <Loader />;

  return (
    <div className="m-3">
      <div className="mb-4">
        <Breaker />
      </div>

      <div className="ml-5 mt-10 bg-white p-6 max-w-9xl rounded-xl shadow-xl">
        <form onSubmit={handleSubmit}>
          {/* ---------- Title ---------- */}
          <div className=" flex flex-col gap-y-1 my-4">
            <label className="ml-2 font-normal mb-1">Title:</label>
            <input
              className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
              type="text"
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleChange}
            />
            {apiError.title && (
              <p className="text-red-500 text-sm ml-2">{apiError.title}</p>
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

          {/* ---------- Message ---------- */}
          <div className="flex flex-col gap-y-1 my-4">
            <label className="ml-2 font-normal mb-1">Message:</label>
            <textarea
              className="w-full h-24 mb-1 border rounded-xl pl-4 border-gray-500 resize-y"
              name="message"
              placeholder="Message"
              value={formData.message}
              onChange={handleChange}
            />
            {apiError.message && (
              <p className="text-red-500 text-sm ml-2">{apiError.message}</p>
            )}
          </div>

          {/* ---------- Submit ---------- */}
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
              className="bg-gradient-to-l from-[#181e2a] to-[#232a3b] text-white hover:scale-105 active:scale-95 transition-transform duration-500 py-3 px-6 rounded-2xl cursor-pointer"
            >
              {loading ? "Updating..." : "Update Notification"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateNotificationPage;
