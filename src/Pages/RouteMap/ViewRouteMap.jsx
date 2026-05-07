import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getRouteMapById } from "../../Services/routeMapServices";

export default function ViewRouteMap() {
  const { id } = useParams();
  const [routeMap, setRouteMap] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRouteMapById(id, true)
      .then((res) => {
        setRouteMap(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading route details...</p>;
  if (!routeMap) return <p>Route not found</p>;

  return (
    <div className="space-y-6 py-8 px-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">View Route Map</h1>
        <Link
          to={`/home/routeMap/update/${routeMap._id}`}
          className="btn-primary"
        >
          Edit Route
        </Link>
      </div>
      <div className="card">
        <h2 className="section-title">Basic Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <Info label="Route Name" value={routeMap.name} />
          <Info
            label="Status"
            value={routeMap.isActive ? "Active" : "Inactive"}
            badge
          />
          <Info label="Total Distance" value={`${routeMap.totalDistance} km`} />
          <Info label="Full Price" value={`₹ ${routeMap.fullPrice}`} />
          <Info
            label="Convenience Fee"
            value={`₹ ${routeMap.convienienceFee || 0}`}
          />
        </div>
      </div>

      <div className="card">
        <h2 className="section-title">Route Stops</h2>

        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Location Name</th>
                <th>Order</th>
                <th>Distance to Next (km)</th>
              </tr>
            </thead>
            <tbody>
              {routeMap.locations
                .sort((a, b) => a.order - b.order)
                .map((stop, index) => (
                  <tr key={stop._id}>
                    <td>{index + 1}</td>
                    <td>{stop.location?.name || "N/A"}</td>
                    <td>{stop.order}</td>
                    <td>{stop.distanceToNext}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="card">
        <h2 className="section-title">Metadata</h2>
        <div className="grid grid-cols-2 gap-4">
          <Info
            label="Created At"
            value={new Date(routeMap.createdAt).toLocaleString()}
          />
          <Info
            label="Last Updated"
            value={new Date(routeMap.updatedAt).toLocaleString()}
          />
        </div>
      </div>
    </div>
  );
}

function Info({ label, value, badge }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      {badge ? (
        <span
          className={`inline-block px-3 py-1 rounded-full text-sm ${
            value === "Active"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {value}
        </span>
      ) : (
        <p className="font-medium">{value}</p>
      )}
    </div>
  );
}
