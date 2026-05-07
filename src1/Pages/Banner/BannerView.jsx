// import React from 'react';
// import Breaker from "../../compoents/Breaker";
// import { useNavigate } from 'react-router-dom';
// import { useParams } from 'react-router-dom';
// import {getBannerApi} from  "../../Services/BannerApi"
// import { useState,useEffect } from 'react';
// import Loader from "../../compoents/Loader"

// import toast from 'react-hot-toast';
// const BASE_URL = import.meta.env.VITE_BASE_URL;
// const BannerView = () => {
//   const { id } = useParams();
//   const [ownerData, setOwnerData] = useState({});
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchOwnerData = async () => {
//       try {
//         setIsLoading(true);
//         const data = await getBannerApi(id);
//         if (data?.status) {
//           toast.success(' fetch banner successfully!');
//           setOwnerData(data.data);
//         } else {
//           setError(data?.message || 'Failed to load business owner details');
//          // Show error using toast
//         }
//       } catch (error) {
//         setError(error.message);
//         // Show error using toast
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchOwnerData();
//   }, [id]);

//   // Show loader while data is being fetched
//   if (isLoading) return <Loader />;

//   // Show error message if there's an error
//   if (error) return <div>Error: {error}</div>;
//  const handleAddClick=()=>{
//   navigate(-1)
//  }
//   return (
//     <div>
//       <Breaker />
//       <div className="p-4">
//         <div className="bg-white h-[650px] rounded-xl shadow-md ">
// <h1 className='text-3xl font-medium p-5  opacity-60 ' >Banner Details</h1>
// <div className='bg-gray-50 h-[500px] rounded-xl ml-6 mr-6 mt-2 relative'>
//    <div className='grid grid-cols-2 '>
// <div>
// <h1 className='font-normal text-2xl pt-7 pl-5 opacity-60'>Personal Details</h1>
// <img className='h-35 w-65  m-5 shadow-xl rounded-md ' src={`${BASE_URL}/${ownerData.image}`} alt="" />

//  <div className='ml-3 mt-8 grid grid-cols-3 gap-3'>
// <h1 className='font-mono opacity-80  '>Banner Name:</h1><h1 className='  opacity-70'>
//   {ownerData.title}</h1><br />
//   <h1 className='font-mono opacity-80  '>Priority:</h1><h1 className='  opacity-70'>
//   {ownerData.priority}</h1><br />
//   <h1 className='font-mono opacity-80  '>Platform:</h1><h1 className='  opacity-70'>
//   {ownerData.platform}</h1><br />
//   <h1 className='font-mono opacity-80  '>Status:</h1><h1 className='  opacity-70'>
//   {ownerData.status? "Active" : "Inactive"}</h1><br />

//  </div>
// </div>
// <div className='font-normal text-2xl pt-7 pl-5 opacity-60'>Other Details</div>
//    </div>
//    <button onClick={handleAddClick} className=" hover:scale-105 active:scale-95 transition-transform duration-500 absolute right-4 bottom-4 bg-gradient-to-l from-[#DD2630] to-[#800303]  rounded-xl px-5 text-md font-bold text-white   py-3" >Back</button>
// </div>

//         </div>

//       </div>
//     </div>
//   );
// };

// export default BannerView;

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Breaker from "../../compoents/Breaker";
import { getBannerApi } from "../../Services/BannerApi";
import Loader from "../../compoents/Loader";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const BannerView = () => {
  const { id } = useParams();
  const [bannerData, setBannerData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBannerData = async () => {
      try {
        setIsLoading(true);
        const response = await getBannerApi(id);
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

  const handleBackClick = () => navigate(-1);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Breaker />
      <div className="max-w-9xl mt-1 mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Banner <span className="text-red-500">Overview</span>
        </h1>

        <div className="bg-white p-8 rounded-2xl shadow-xl space-y-10">
          {/* Image */}
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Banner Preview
            </h2>
            {bannerData.image ? (
              <img
                src={`${BASE_URL}/${bannerData.image}`}
                alt={bannerData.title || "Banner"}
                className="w-full max-w-md h-48 object-cover rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
                onError={(e) =>
                  (e.target.src = "https://via.placeholder.com/256x160")
                }
              />
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
              <Detail label="Priority" value={bannerData.priority} />
              <Detail
                label="Platform"
                value={
                  bannerData.platform
                    ? bannerData.platform.charAt(0).toUpperCase() +
                      bannerData.platform.slice(1)
                    : null
                }
              />
              <Detail
                label="Status"
                value={
                  bannerData.status ? (
                    <span className="text-green-600 font-medium">Active</span>
                  ) : (
                    <span className="text-red-600 font-medium">Inactive</span>
                  )
                }
              />
              <Detail
                label="Created On"
                value={
                  bannerData.createdAt
                    ? new Date(bannerData.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )
                    : null
                }
              />
            </div>
          </section>

          {/* Action */}
          <div className="flex justify-end">
            <button
              onClick={handleBackClick}
              className="bg-gradient-to-l from-[#181e2a] to-[#232a3b] text-white font-semibold py-3 px-6 rounded-xl hover:scale-105 active:scale-95 transition-transform duration-300"
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

export default BannerView;
