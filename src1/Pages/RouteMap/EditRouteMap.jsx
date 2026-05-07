// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import RouteMapForm from "./RouteMapForm";
// import toast from "react-hot-toast";
// import {
//   getRouteMapById,
//   updateRouteMap,
// } from "../../Services/routeMapServices";

// export default function EditRouteMap() {
//   const { id } = useParams();
//   const [data, setData] = useState(null);

//   useEffect(() => {
//     getRouteMapById(id).then((res) => setData(res.data));
//   }, [id]);

//   const handleUpdate = async (formData) => {
//     try {
//       await updateRouteMap(id, formData);
//       toast.success("Route map updated successfully");
//     } catch (err) {
//       toast.error("Update failed");
//     }
//   };

//   if (!data) return <p>Loading...</p>;

//   return (
//     <div className="px-6 py-8">
//       <h1 className="text-xl font-bold mb-4">Edit Route Map</h1>
//       <RouteMapForm onSubmit={handleUpdate} defaultValues={data} />
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import RouteMapForm from "./RouteMapForm";
import Breaker from "../../compoents/Breaker";
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";
import {
  getRouteMapById,
  updateRouteMap,
} from "../../Services/routeMapServices";

export default function EditRouteMap() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    getRouteMapById(id).then((res) => setData(res.data));
  }, [id]);

  const handleUpdate = async (formData) => {
    try {
      await updateRouteMap(id, formData);
      toast.success("Route map updated successfully");
      setTimeout(() => {
        navigate('/Home/routeMap');
      }, 1200);
    } catch (err) {
      toast.error("Update failed");
    }
  };

  if (!data) return <p>Loading...</p>;

  return (
    <div className="px-6 py-8">
      <div className="mb-6">
        <Breaker />
      </div>
      <h1 className="text-xl font-bold mb-4">Edit Route Map</h1>
      <RouteMapForm onSubmit={handleUpdate} defaultValues={data} />
    </div>
  );
}
