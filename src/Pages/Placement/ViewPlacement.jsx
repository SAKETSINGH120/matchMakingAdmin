import * as React from "react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion } from "framer-motion";
import Loader from "../../compoents/Loader";
import Breaker from "../../compoents/Breaker";
import toast from "react-hot-toast";
import { getPlacementApi } from "../../Services/PlacementApi"; // Adjust path if needed
import LocationCityIcon from "@mui/icons-material/LocationCity";
import StarIcon from "@mui/icons-material/Star";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import UpdateIcon from "@mui/icons-material/Update";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DescriptionIcon from "@mui/icons-material/Description";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import BusinessIcon from "@mui/icons-material/Business";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PeopleIcon from "@mui/icons-material/People";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function ViewPlacement() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await getPlacementApi(id);
      if (result?.status) {
        toast.success("Placement details fetched successfully!");
        setData(result.data);
      } else {
        toast.error(result?.message || "Failed to fetch placement details.");
      }
    } catch (error) {
      console.error("Error fetching placement:", error);
      toast.error("Error fetching placement details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true,
      easing: "ease-in-out",
    });
  }, []);

  const handleBackClick = () => {
    navigate(-1);
  };

  if (loading) return <Loader />;

  if (!data) {
    return (
      <div className="p-8 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
        <p className="text-center text-red-600 text-xl font-semibold">
          No data available
        </p>
      </div>
    );
  }

  const college = data.college || {};

  // Helper: Parse rating
  const parseRating = (ratingStr) => {
    if (!ratingStr) return { score: "N/A", reviews: "N/A" };
    const match = ratingStr.match(/([\d.]+) \/5\((\d+) Reviews\)/);
    return match
      ? { score: match[1], reviews: match[2] }
      : { score: ratingStr, reviews: "N/A" };
  };
  const rating = parseRating(college.rating);

  // Helper: Parse Q&A
  const parseQA = (qaStr) => {
    if (!qaStr) return "N/A";
    const match = qaStr.match(/([\d.]+)k Student Q&A/);
    return match ? `${parseFloat(match[1]) * 1000} Student Q&A` : qaStr;
  };

  // Helper: Info row component
  const InfoRow = ({ IconComp, title, value }) => (
    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
      {IconComp && <IconComp sx={{ fontSize: 24, color: "#000000" }} />}
      <div>
        <p className="font-semibold text-gray-800 text-lg">{title}</p>
        <p className="text-gray-600">{value ?? "N/A"}</p>
      </div>
    </div>
  );

  // Helper: Render stats table
  const StatsTable = ({ title, IconComp, dataArray }) =>
    dataArray && dataArray.length > 0 ? (
      <div className="bg-white rounded-xl p-4 shadow-md">
        <h2 className="flex items-center gap-3 text-xl font-bold text-[#000000] mb-3">
          {IconComp && <IconComp sx={{ fontSize: 24, color: "#000000" }} />}
          {title}
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-50 border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left text-gray-800 font-semibold">
                  Year
                </th>
                <th className="px-4 py-2 text-left text-gray-800 font-semibold">
                  Statistics
                </th>
              </tr>
            </thead>
            <tbody>
              {dataArray.map((item, i) => (
                <tr key={i} className="border-t">
                  <td className="px-4 py-2 text-gray-600">
                    {item.year || "-"}
                  </td>
                  <td className="px-4 py-2 text-gray-600">
                    {item.statistics || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    ) : null;

  return (
    <div className="p-8  min-h-screen">
      <Breaker />
      <div
        className="mx-auto max-w-9xl rounded-2xl shadow-2xl bg-gradient-to-br mt-5 from-white to-gray-50 overflow-hidden relative before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-2 before:bg-gradient-to-r before:from-[#000000] before:to-[#000000]"
        data-aos="zoom-in"
      >
        <div className="flex justify-between items-center mb-8 pb-6 border-b-2 border-gray-200 px-6 pt-6">
          <div>
            <h1 className="text-3xl font-bold text-[#000000] tracking-wide">
              Placements - {college.collegeName}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Created:{" "}
              {data.createdAt ? new Date(data.createdAt).toLocaleString() : "-"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <motion.div whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.05 }}>
              <button
                onClick={handleBackClick}
                className="bg-gradient-to-r from-[#000000] to-[#000000] text-white px-5 py-2 rounded-xl font-semibold hover:from-[#000000] hover:to-[#000000] hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
              >
                Back
              </button>
            </motion.div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 pb-6">
          {/* Left: College Banner, Logo, and Basic Info */}
          <div className="col-span-1 bg-white p-4 rounded-xl shadow-md">
            <div className="flex flex-col items-center text-center gap-3">
              {college.bannerImage && (
                <img
                  src={college.bannerImage}
                  alt={`${college.collegeName} Banner`}
                  className="w-full h-48 object-cover rounded-md shadow-sm"
                />
              )}
              {college.logoUrl && (
                <img
                  src={college.logoUrl}
                  alt={`${college.collegeName} Logo`}
                  className="w-24 h-24 object-contain rounded-full shadow-sm -mt-12 border-4 border-white"
                />
              )}
              <h3 className="text-xl font-bold text-gray-800 mt-3">
                {college.collegeName || "-"}
              </h3>
              <div className="w-full mt-3 grid grid-cols-2 gap-2">
                <div className="p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-500">Rating</p>
                  <p className="text-sm font-medium flex items-center gap-1">
                    <StarIcon sx={{ fontSize: 16, color: "#FFD700" }} />
                    {rating.score} ({rating.reviews} Reviews)
                  </p>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-500">Q&A</p>
                  <p className="text-sm font-medium flex items-center gap-1">
                    <QuestionAnswerIcon
                      sx={{ fontSize: 16, color: "#000000" }}
                    />
                    {parseQA(college.qa)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Middle: Description & Updates */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-md">
              <h2 className="flex items-center gap-3 text-xl font-bold text-[#000000] mb-3">
                <DescriptionIcon sx={{ fontSize: 24, color: "#000000" }} />
                Placement Description
              </h2>
              <p className="text-gray-600">
                {data.description || "No description available"}
              </p>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-md">
              <h2 className="flex items-center gap-3 text-xl font-bold text-[#000000] mb-3">
                <UpdateIcon sx={{ fontSize: 24, color: "#000000" }} />
                College Updates
              </h2>
              <div className="space-y-3">
                {college.details ? (
                  college.details
                    .split("\n")
                    .filter((line) => line.trim())
                    .map((update, i) => (
                      <p
                        key={i}
                        className="text-gray-600 flex items-start gap-2"
                      >
                        <CalendarTodayIcon
                          sx={{
                            fontSize: 16,
                            color: "#000000",
                            marginTop: "4px",
                          }}
                        />
                        {update}
                      </p>
                    ))
                ) : (
                  <p className="text-gray-600">No updates available</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Placement Statistics */}
        <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatsTable
            title="Offers Made"
            IconComp={TrendingUpIcon}
            dataArray={data.offerMade}
          />
          <StatsTable
            title="Average Salary"
            IconComp={AttachMoneyIcon}
            dataArray={data.averageSalary}
          />
          <StatsTable
            title="Highest Salary"
            IconComp={AttachMoneyIcon}
            dataArray={data.highestSalary}
          />
          <StatsTable
            title="Students Placed"
            IconComp={PeopleIcon}
            dataArray={data.studentPlaced}
          />
          <StatsTable
            title="Companies Visited"
            IconComp={BusinessIcon}
            dataArray={data.companyVisited}
          />
        </div>
      </div>
    </div>
  );
}
