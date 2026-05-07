// import { createRouteMap } from "../../Services/routeMapServices";
// import { useNavigate } from 'react-router-dom';
// import RouteMapForm from "./RouteMapForm";
// import toast from "react-hot-toast";

// export default function AddRouteMap() {
//   const navigate = useNavigate();
//   const handleCreate = async (data) => {
    
//     try {
//       console.log("Data route map -", data);
//       await createRouteMap(data);
     
//       toast.success("Route map created successfully");
//       navigate('/Home/routeMap');
//     } catch (err) {
//       toast.error("Failed to create route map");
//     }
//   };

//   return (
//     <div className="py-8 px-6">
//       <h1 className="text-xl font-bold mb-4">Add Route Map</h1>
//       <RouteMapForm onSubmit={handleCreate} />
//     </div>
//   );
// }

import { createRouteMap } from "../../Services/routeMapServices";
import { useNavigate } from 'react-router-dom';
import RouteMapForm from "./RouteMapForm";
import toast from "react-hot-toast";
import Breaker from "../../compoents/Breaker";

export default function AddRouteMap() {
  const navigate = useNavigate();
  const handleCreate = async (data) => {

    try {
      console.log("Data route map -", data);
      await createRouteMap(data);

      toast.success("Route map created successfully");
      setTimeout(() => {
        navigate('/Home/routeMap');
      }, 1200);

    } catch (err) {
      toast.error("Failed to create route map");
    }
  };

  return (
    <div className="py-8 px-6">
      <div className="mb-6">
        <Breaker />
      </div>
      <h1 className="text-xl font-bold mb-4">Add Route Map</h1>
      <RouteMapForm onSubmit={handleCreate} />
    </div>
  );
}
