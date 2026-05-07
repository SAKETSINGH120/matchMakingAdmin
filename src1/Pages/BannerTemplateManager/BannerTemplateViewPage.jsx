import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Breaker from "../../compoents/Breaker";
import { getBannerTemplate } from "../../Services/BannerApi";
import Loader from "../../compoents/Loader";
import toast from "react-hot-toast";
import attachUrl from "../../utils/attachUrl";
import { convertUTCToLocalDateString } from "../../utils/convertUTCtoLocalDate";

const BannerTemplateViewPage = () => {
  const { id } = useParams();
  const [bannerData, setBannerData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBannerData = async () => {
      try {
        setIsLoading(true);
        const response = await getBannerTemplate(id);
        if (response?.status) {
          toast.success("Banner details loaded successfully");
          setBannerData(response.data);
        } else {
          throw new Error(response?.message || "Failed to load banner");
        }
      } catch (err) {
        setError(err.message);
        toast.error("Error: " + err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBannerData();
  }, [id]);

  const handleBackClick = () => navigate(-1);

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-xl shadow-md text-center text-red-600 font-medium">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Breaker />
      <div className="max-w-9xl mt-1 mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Banner Template <span className="text-red-500">Overview</span>
        </h1>

        <div className="bg-white p-8 rounded-2xl shadow-xl space-y-10">
          {/* Image */}
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Banners Preview
            </h2>
            {Array.isArray(bannerData.image) && bannerData.image.length > 0 ? (
              <div className="grid grid-cols-2 gap-x-6 gap-y-6">
                {bannerData.image.map((image, index) => (
                  <img
                    key={index}
                    src={attachUrl(image)}
                    alt={`Banner ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No image uploaded</p>
            )}
          </section>

          {/* Details */}
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Banner Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <Detail label="Title" value={bannerData.title} />
              <Detail label="Type" value={bannerData.type} />
              <Detail
                label="Created On"
                value={
                  convertUTCToLocalDateString(bannerData.createdAt) ??
                  "Not Provided"
                }
              />
            </div>
          </section>

          {/* Action */}
          <div className="flex justify-end">
            <button
              onClick={handleBackClick}
              className="bg-gradient-to-l from-[#181e2a] to-[#232a3b] text-white font-semibold py-3 px-6 rounded-xl hover:scale-105 cursor-pointer active:scale-95 transition-transform duration-300"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Detail Component
const Detail = ({ label, value }) => (
  <div>
    <p className="text-gray-500 font-medium mb-1">{label}</p>
    <p className="text-gray-800">{value || "Not provided"}</p>
  </div>
);

export default BannerTemplateViewPage;
