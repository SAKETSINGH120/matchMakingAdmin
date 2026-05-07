// import React from 'react';
// import Breaker from "../../compoents/Breaker";
// import { useNavigate } from 'react-router-dom';
// import { useParams } from 'react-router-dom';
// import {getBlogApi} from  "../../Services/BlogApi"
// import { useState,useEffect } from 'react';
// import Loader from "../../compoents/Loader"
// import { Carousel } from 'react-responsive-carousel';
// import toast from 'react-hot-toast';
// import "react-responsive-carousel/lib/styles/carousel.min.css";

// const BASE_URL = import.meta.env.VITE_BASE_URL;
// const BlogView = () => {
//   const { id } = useParams();
//   const [ownerData, setOwnerData] = useState({});
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchOwnerData = async () => {
//       try {
//         setIsLoading(true);
//         const data = await getBlogApi(id);
//         if (data?.status) {
//           setOwnerData(data.data);
//           toast.success(' fetch blog details successfully!');
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
// <h1 className='text-3xl font-medium p-5  opacity-60 ' >Blogs Details</h1>
// <div className='bg-gray-50 h-[500px] rounded-xl ml-6 mr-6 mt-2 relative'>
//    <div className='grid grid-cols-2 '>
// <div>
// <h1 className='font-normal text-2xl pt-7 pl-5 opacity-60'>Personal Details</h1>
// <div className="flex flex-wrap gap-6 mt-3 ml-3">
// {ownerData.thumbImage && (
//     <div>
//       <p className="text-sm  text-gray-600 mb-3  font-sans">Thumbnail Image:</p>
//       <img
//         className="w-45 h-34  object-cover shadow-md rounded-md"
//         src={`${BASE_URL}/${ownerData.thumbImage}`}
//         alt="Thumbnail"
//       />
//     </div>
//   )}
//   {/* Main Blog Images */}
//   <div>
//     <p className="text-sm text-gray-700 mb-1 font-sans">Blog Images:</p>
//     <div className="flex flex-wrap gap-4">
//        {/* Thumbnail Image */}

//        {Array.isArray(ownerData.image) && ownerData.image.length > 0 ? (
//   <Carousel
//     showThumbs={false}
//     infiniteLoop
//     autoPlay
//     interval={3000}
//     showStatus={false}
//     showIndicators={true}
//     className="w-[190px] h-[130px] rounded-xl"
//   >
//     {ownerData.image.map((img, index) => (
//       <div key={index}>
//         <img
//           src={`${BASE_URL}/${img}`}
//           alt={`Blog Image ${index + 1}`}
//           className="object-cover rounded-xl h-[130px] mt-3 w-full"
//         />
//       </div>
//     ))}
//   </Carousel>
// ) : (
//   <p className="text-gray-500 text-sm">No blog images available.</p>
// )}

//     </div>
//   </div>

// </div>

//  <div className='ml-3 mt-8 grid grid-cols-3 gap-3'>
// <h1 className='font-mono opacity-80  '>Banner Name:</h1><h1 className='  opacity-70'>
//   {ownerData.title}</h1><br />
//   <h1 className='font-mono opacity-80  '>Description:</h1><h1 className='  opacity-70'>
//     <div dangerouslySetInnerHTML={{ __html:  ownerData.description}}></div></h1><br />

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

// export default BlogView;

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Breaker from "../../compoents/Breaker";
import { getBlogApi } from "../../Services/BlogApi";
import Loader from "../../compoents/Loader";
import { Carousel } from "react-responsive-carousel";
import toast from "react-hot-toast";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { MdDescription } from "react-icons/md";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const BlogView = () => {
  const { id } = useParams();
  const [ownerData, setOwnerData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOwnerData = async () => {
      try {
        setIsLoading(true);
        const data = await getBlogApi(id);
        if (data?.status) {
          toast.success("Fetched blog details successfully!");
          setOwnerData(data.data);
        } else {
          setError(data?.message || "Failed to load blog details");
          toast.error(data?.message || "Failed to load blog details");
        }
      } catch (error) {
        setError(error.message);
        toast.error("Error fetching blog details: " + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOwnerData();
  }, [id]);

  if (isLoading) return <Loader />;
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-md p-6 text-center text-red-500">
          Error: {error}
        </div>
      </div>
    );
  }

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Breaker />
      <div className="max-w-9xl mx-auto">
        <h1 className="text-3xl font-bold mb-2  shadow shadow-amber-100 ml-6 mt-4 text-gray-800">
          View Blog <span className="text-red-500">Details</span>
        </h1>
        <div className="bg-white shadow-xl rounded-xl p-8 space-y-10">
          {/* Blog Images Section */}
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Images</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ownerData.thumbImage && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Thumbnail</p>
                  <img
                    src={`${BASE_URL}/${ownerData.thumbImage}`}
                    alt="Thumbnail"
                    className="w-full max-w-xs h-48 object-cover rounded-lg border"
                    onError={(e) =>
                      (e.target.src = "https://via.placeholder.com/192")
                    }
                  />
                </div>
              )}

              <div>
                <p className="text-sm text-gray-500 mb-1">Gallery</p>
                {Array.isArray(ownerData.image) &&
                ownerData.image.length > 0 ? (
                  <Carousel
                    showThumbs={false}
                    infiniteLoop
                    autoPlay
                    interval={3000}
                    showStatus={false}
                    className="rounded-lg overflow-hidden"
                  >
                    {ownerData.image.map((img, index) => (
                      <div key={index}>
                        <img
                          src={`${BASE_URL}/${img}`}
                          alt={`Blog Image ${index + 1}`}
                          className="h-48 w-full object-cover"
                        />
                      </div>
                    ))}
                  </Carousel>
                ) : (
                  <p className="text-gray-500 text-sm">
                    No blog images uploaded.
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Blog Content */}
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Content
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Title</p>
                <p className="text-base font-medium text-gray-800">
                  {ownerData.title || "Not provided"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Status</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    ownerData.status
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {ownerData.status ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-xl font-bold text-gray-500 mb-1 pl-2 flex">
                <div className="m-1">
                  <MdDescription />
                </div>
                Description
              </p>
              <hr className="text-fuchsia-400 " />
              <div
                className="prose max-w-none text-gray-700"
                dangerouslySetInnerHTML={{
                  __html: ownerData.description || "<p>Not provided</p>",
                }}
              />
            </div>
          </section>

          {/* Meta Information */}
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Meta Info
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Created At</p>
                <p className="text-base text-gray-800">
                  {ownerData.createdAt
                    ? new Date(ownerData.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )
                    : "Not provided"}
                </p>
              </div>
              {/* Additional fields like author/admin name can be added here */}
            </div>
          </section>
          <div className="flex justify-between items-center mb-6">
            <h1></h1>
            <button
              onClick={handleBackClick}
              className="bg-gradient-to-l from-[#181e2a] to-[#232a3b] text-white px-5 py-2 rounded-lg font-semibold hover:scale-105 transition-transform duration-300"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogView;
