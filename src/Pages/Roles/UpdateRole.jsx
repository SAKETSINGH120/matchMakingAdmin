

// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import Breaker from "../../compoents/Breaker";
// import { updateRole, getRoleById } from "../../Services/RoleApi";
// import { getAllCities } from "../../Services/CityApi";
// import CityDropdown from "../Location/components/CityDropdown";
// import { useAuth } from "../../auth/AuthContext";

// const SECTION_MAPPING = {
//   user: {
//     label: "Users",
//     permissions: ["list", "export-excel"],
//   },
//   driver: {
//     label: "Driver",
//     permissions: ["list", "exportExcel", "assignVehicle", "edit", "view"],
//   },
//   agent: {
//     label: "Agent",
//     permissions: ["list", "exportExcel", "edit", "view", "assign"],
//   },
//   package: {
//     label: "Package",
//     permissions: ["list", "exportExcel", "create", "edit", "view", "delete"],
//   },
//   booking: {
//     label: "Bookings",
//     permissions: ["list", "view", "assignDriver", "exportExcel"],
//   },
//   vehicleType: {
//     label: "Vehicle Type",
//     permissions: ["list", "exportExcel", "edit", "delete"],
//   },
//   city: {
//     label: "City",
//     permissions: ["exportExcel", "list", "create", "edit", "delete"],
//   },
//   support: {
//     label: "Support",
//     permissions: ["list"],
//   },
//   location: {
//     label: "Location",
//     permissions: ["list", "exportExcel", "create", "edit", "delete"],
//   },
//   routeMap: {
//     label: "Route Map",
//     permissions: ["exportExcel", "list", "create", "edit", "view"],
//   },
//   redeemAgent: {
//     label: "RedeemAgent",
//     permissions: ["list"],
//   },

//   driverCashCollection: {
//   label: "Driver Cash Collection",
//   permissions: ["list"],
//   },
//   role: {
//     label: "Role",
//     permissions: ["exportExcel", "list", "create", "edit", "delete"],
//   },
//   member: {
//     label: "Member",
//     permissions: ["exportExcel", "list", "create", "delete"],
//   },
//   vehicle: {
//     label: "Vehicle",
//     permissions: ["exportExcel", "list", "create", "edit", "delete"],
//   },
//   setting: {
//     label: "Settings",
//     permissions: ["list"],
//   },
//   sos: {
//     label: "SOS",
//     permissions: ["list", "edit"],
//   },
// };

// const SECTION_KEYS = Object.keys(SECTION_MAPPING);

// const UpdateRole = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { auth, hasPermission, loading: authLoading } = useAuth();

//   const [formData, setFormData] = useState({
//     name: "",
//     cityId: "",
//     permissions: [],
//   });


//   const [selectedCity, setSelectedCity] = useState(null);
//   const [expanded, setExpanded] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [pageLoading, setPageLoading] = useState(true);
//   const [errors, setErrors] = useState({});

//   // Fetch role data
//   useEffect(() => {
//     const fetchRole = async () => {
//       if (authLoading || !auth.user) return;
//       setPageLoading(true);
//       try {
//         const res = await getRoleById(id);
//         if (res?.status && res.data) {
//           const { name, cityId, permissions: apiPermissions } = res.data;

//           const updatedPermissions = SECTION_KEYS.filter((key) =>
//             SECTION_MAPPING[key].permissions.some((p) => hasPermission(key, p))
//           ).map((key) => {
//             const existing = apiPermissions?.[key] || {};
//             const allowed = SECTION_MAPPING[key]?.permissions || [];

//             const permObj = { sectionName: key };
//             allowed.forEach((p) => {
//               permObj[p] = !!existing[p];
//             });

//             return permObj;
//           });

//           setFormData((prev) => ({
//             ...prev,
//             name: name || "",
//             cityId: cityId || "",
//             permissions: updatedPermissions,
//           }));


//           if (cityId) {
//             try {
//               const citiesRes = await getAllCities({
//                 page: "1",
//                 rowsPerPage: "100",
//                 searchQuery: "",
//               });;
//               console.log(citiesRes)


//               if (citiesRes?.status === true && Array.isArray(citiesRes?.data)) {
//                 const matchingCity = citiesRes.data.find(
//                   (c) => c?._id === cityId
//                 );

//                 if (matchingCity && matchingCity.name) {
//                   setSelectedCity({
//                     value: matchingCity._id,
//                     label: matchingCity.name,
//                     _id: matchingCity._id,
//                     name: matchingCity.name,
//                   });
//                 } else {
//                   setSelectedCity({
//                     value: cityId,
//                     label: "City not found in current list",
//                     _id: cityId,
//                     name: "—",
//                   });
//                   console.warn(`City ID ${cityId} not found among ${citiesRes.data.length} fetched cities`);
//                 }
//               } else {
//                 setSelectedCity({
//                   value: cityId,
//                   label: "Cities data unavailable",
//                   _id: cityId,
//                   name: "—",
//                 });
//                 console.warn("getAllCities returned invalid format", citiesRes);
//               }
//             } catch (cityErr) {
//               console.error("Error fetching cities:", cityErr);
//               setSelectedCity({
//                 value: cityId,
//                 label: "City load error",
//                 _id: cityId,
//                 name: "—",
//               });
//             }
//           }


//         } else {
//           toast.error("Failed to load role data");
//         }
//       } catch (err) {
//         console.error(err);
//         toast.error("Error loading role information");
//       } finally {
//         setPageLoading(false);
//       }
//     };

//     if (id && !authLoading && auth.user) fetchRole();
//   }, [id, authLoading, auth.user, hasPermission]);


//   const onSelectCity = (city) => {
//     if (city && selectedCity && city._id === selectedCity._id) {

//       setSelectedCity(null);
//       setFormData((prev) => ({ ...prev, cityId: "" }));
//       return;
//     }
//     setSelectedCity(city);
//     setFormData((prev) => ({ ...prev, cityId: city?._id || "" }));
//   };

//   const toggleExpand = (section) => {
//     setExpanded((prev) => ({ ...prev, [section]: !prev[section] }));
//   };

//   const handleNameChange = (e) => {
//     setFormData((prev) => ({ ...prev, name: e.target.value }));
//     if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
//   };

//   const handleMasterToggle = (index, checked) => {
//     const updated = [...formData.permissions];
//     const sectionKey = updated[index].sectionName;
//     const allowed = SECTION_MAPPING[sectionKey]?.permissions || [];

//     const newPerms = { sectionName: sectionKey };
//     allowed.forEach((perm) => {
//       newPerms[perm] = checked;
//     });

//     updated[index] = newPerms;
//     setFormData((prev) => ({ ...prev, permissions: updated }));
//   };

//   const handlePermissionChange = (index, field, checked) => {
//     const updated = [...formData.permissions];
//     const sectionKey = updated[index].sectionName;
//     const allowed = SECTION_MAPPING[sectionKey]?.permissions || [];

//     if (!allowed.includes(field)) return;

//     updated[index] = { ...updated[index], [field]: checked };
//     setFormData((prev) => ({ ...prev, permissions: updated }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErrors({});
//     setLoading(true);

//     const newErrors = {};
//     if (!formData.name.trim()) {
//       newErrors.name = "Role name is required";
//     }
//     if (!formData.cityId.trim()) {
//       newErrors.city = "City is required";
//     }

//     const hasAnyRealPermission = formData.permissions.some((p) =>
//       Object.keys(p)
//         .filter((key) => key !== "sectionName")
//         .some((key) => p[key] === true)
//     );

//     if (!hasAnyRealPermission) {
//       newErrors.permissions = "Select at least one permission for the role";
//     }

//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       setLoading(false);
//       return;
//     }

//     try {
//       const permissions = {};

//       formData.permissions.forEach((perm) => {
//         const sectionPerms = {};
//         Object.keys(perm).forEach((key) => {
//           if (key !== "sectionName") {
//             sectionPerms[key] = !!perm[key];
//           }
//         });
//         permissions[perm.sectionName] = sectionPerms;
//       });

//       const payload = {
//         name: formData.name.trim(),
//         cityId: formData.cityId.trim(),
//         permissions,
//       };

//       const res = await updateRole({ id, data: payload });

//       if (res?.status) {
//         toast.success("Role updated successfully!");
//         navigate(-1);
//       } else {
//         toast.error(res?.message || "Failed to update role");
//       }
//     } catch (err) {
//       toast.error("Something went wrong. Please try again.");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (authLoading || !auth.user) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
//         <div className="text-lg text-gray-600 dark:text-gray-300">
//           Verifying permissions...
//         </div>
//       </div>
//     );
//   }

//   if (pageLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
//         <div className="text-lg text-gray-600 dark:text-gray-300">
//           Loading role data...
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 p-4 md:p-8">
//       <div className="mx-auto max-w-8xl">
//         <Breaker />
//         <div className="mt-8">
//           <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
//             Edit Role
//           </h1>
//           <p className="text-gray-600 dark:text-gray-400 mb-8">
//             Update role name, city and modify permissions
//           </p>

//           <form onSubmit={handleSubmit} className="space-y-8">
//             {/* Role Name + City */}
//             <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 md:p-5">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Role Name */}
//                 <div className="mt-4">
//                   <label className="ml-2 font-normal block mb-2">Role Name<span className="text-red-500">*</span></label>
//                   <input
//                     type="text"
//                     value={formData.name}
//                     onChange={handleNameChange}
//                     placeholder="e.g. Admin, Support Agent, Driver Manager..."
//                     className={`w-full h-11 border border-gray-400 rounded-xl pl-4 pr-10 focus:outline-none focus:border-[#c1ab87]  ${errors.name
//                       ? "border-red-500 focus:ring-red-200"
//                       : "border-gray-300 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-200"
//                       } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all outline-none`}
//                   />
//                   {errors.name && (
//                     <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">
//                       {errors.name}
//                     </p>
//                   )}
//                 </div>

//                 {/* City Dropdown */}
//                 <div>
//                   <CityDropdown
//                     onSelect={onSelectCity}
//                     selectedCity={selectedCity}
//                   />
//                   {errors.city && (
//                     <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">
//                       {errors.city}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Permissions Section – same as before */}
//             <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
//               <div className="px-6 py-5 md:px-8 border-b border-gray-200 dark:border-gray-800">
//                 <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
//                   Permissions
//                   <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
//                     (update what this role can do)
//                   </span>
//                 </h2>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-gray-800">
//                 {formData.permissions.map((perm, index) => {
//                   const sectionKey = perm.sectionName;
//                   const sectionConfig = SECTION_MAPPING[sectionKey] || {};
//                   const displayName = sectionConfig.label || sectionKey;
//                   const allowedActions = sectionConfig.permissions || [];

//                   const allChecked = allowedActions.every(
//                     (action) => perm[action] === true
//                   );

//                   const isExpanded = expanded[sectionKey];

//                   return (
//                     <div
//                       key={sectionKey}
//                       className="group border-b last:border-b-0 md:border-b-0 md:border-r last:md:border-r-0"
//                     >
//                       <div
//                         className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
//                         onClick={() => toggleExpand(sectionKey)}
//                       >
//                         <div className="flex items-center gap-4">
//                           <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/10 to-indigo-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 font-medium text-lg">
//                             {displayName.charAt(0)}
//                           </div>
//                           <span className="font-medium text-gray-900 dark:text-gray-100">
//                             {displayName}
//                           </span>
//                         </div>
//                         <span className="text-2xl font-light text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
//                           {isExpanded ? "−" : "+"}
//                         </span>
//                       </div>

//                       {isExpanded && (
//                         <div className="px-6 pb-6 pt-2 bg-gray-50/50 dark:bg-gray-900/50">
//                           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
//                             <label className="flex items-center gap-3 cursor-pointer min-w-[180px]">
//                               <input
//                                 type="checkbox"
//                                 checked={allChecked}
//                                 onChange={(e) => handleMasterToggle(index, e.target.checked)}
//                                 className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
//                               />
//                               <span className="font-medium text-gray-800 dark:text-gray-200">
//                                 Full Access
//                               </span>
//                             </label>

//                             <div className="flex flex-wrap gap-x-8 gap-y-4">
//                               {allowedActions.map((action) => (
//                                 <label
//                                   key={action}
//                                   className="flex items-center gap-2.5 cursor-pointer group/label"
//                                 >
//                                   <input
//                                     type="checkbox"
//                                     checked={perm[action] ?? false}
//                                     onChange={(e) =>
//                                       handlePermissionChange(index, action, e.target.checked)
//                                     }
//                                     className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600"
//                                   />
//                                   <span className="capitalize text-sm text-gray-700 dark:text-gray-300 group-hover/label:text-indigo-700 dark:group-hover/label:text-indigo-400 transition-colors">
//                                     {action.replace("-", " ")}
//                                   </span>
//                                 </label>
//                               ))}
//                             </div>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>

//             {errors.permissions && (
//               <p className="text-center text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 py-3 rounded-lg">
//                 {errors.permissions}
//               </p>
//             )}

//             <div className="flex flex-col sm:flex-row gap-4 pt-6 justify-end">
//               <button
//                 type="button"
//                 onClick={() => navigate(-1)}
//                 className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className={`px-6 py-2.5 text-sm font-medium text-white rounded-lg transition-all shadow-sm ${loading
//                   ? "bg-gray-500 cursor-not-allowed"
//                   : "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:scale-[0.98]"
//                   }`}
//               >
//                 {loading ? "Updating..." : "Update Role"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UpdateRole;


import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { updateRole, getRoleById } from "../../Services/RoleApi";
import Breaker from "../../compoents/Breaker";
import toast from "react-hot-toast";
import Loader from "../../compoents/Loader";

const UpdateRole = () => {
  const [formData, setFormData] = useState({
    name: "",
    permission: [],           // ← we keep your naming (permission without s)
  });
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const fetchRole = async () => {
        setLoading(true);
        try {
          const res = await getRoleById(id);
          if (res.status || res.success) {    // support both status & success
            const { name, permissions } = res.data.role || res.data;

            setFormData({
              name: name || "",
              // Rename permissions → permission (your state key)
              permission: (permissions || []).map((perm) => ({
                sectionName: perm.sectionName || "",
                isCreate: !!perm.isCreate,
                isRead: !!perm.isRead,
                isUpdate: !!perm.isUpdate,
                isDelete: !!perm.isDelete,
                // isSection: true,   ← you always force true anyway, can omit if not needed
              })),
            });

            toast.success("Role fetched successfully!");
          } else {
            toast.error("Failed to fetch role data.");
          }
        } catch (err) {
          console.error(err);
          toast.error("Server error while fetching role");
        } finally {
          setLoading(false);
        }
      };
      fetchRole();
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePermissionChange = (index, field, value) => {
    const updatedPermissions = [...formData.permission];
    updatedPermissions[index][field] = value;
    setFormData({ ...formData, permission: updatedPermissions });
  };

  const handleCheckboxChange = (index, field) => {
    const updatedPermissions = [...formData.permission];
    updatedPermissions[index][field] = !updatedPermissions[index][field];
    setFormData({ ...formData, permission: updatedPermissions });
  };

  const handleAddPermission = () => {
    setFormData({
      ...formData,
      permission: [
        ...formData.permission,
        {
          sectionName: "",
          isSection: true,
          isCreate: false,
          isRead: false,
          isUpdate: false,
          isDelete: false,
        },
      ],
    });
  };

  const handleDeletePermission = (index) => {
    const isConfirmed = window.confirm("Are you sure you want to remove this permission?");
    if (isConfirmed) {
      const updatedPermissions = formData.permission.filter((_, i) => i !== index);
      setFormData({ ...formData, permission: updatedPermissions });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const errors = {};
    if (!formData.name.trim()) {
      errors.name = "Role name is required.";
    }

    formData.permission.forEach((perm, i) => {
      if (!perm.sectionName.trim()) {
        errors[`sectionName_${i}`] = `Section name is required for permission ${i + 1}`;
      }
    });

    if (Object.keys(errors).length > 0) {
      setApiError(errors);
      setLoading(false);
      return;
    }

    try {
      const payload = {
        name: formData.name,
        permissions: formData.permission.map((perm) => ({
          sectionName: perm.sectionName,
          isSection: true,                    // your original logic
          isCreate: !!perm.isCreate,
          isRead: !!perm.isRead,
          isUpdate: !!perm.isUpdate,
          isDelete: !!perm.isDelete,
        })),
      };

      const res = await updateRole({ id, data: payload });

      if (res.status || res.success) {
        toast.success("Role updated successfully!");
        navigate("/home/role");
      } else {
        toast.error(res.message || "Failed to update role");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while updating the role.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="theme-page m-3">
      <div className="mb-4">
        <Breaker />
      </div>

      <div className="theme-panel ml-5 mt-10 max-w-9xl p-6 shadow-xl">
        <form onSubmit={handleSubmit}>
          <label className="ml-2 font-normal text-theme-light-textPrimary dark:text-theme-dark-textPrimary">Role Name:</label>
          <input
            className="theme-input mt-1 mb-1 h-10"
            type="text"
            name="name"
            placeholder="Role Name"
            value={formData.name}
            onChange={handleChange}
          />
          {apiError.name && (
            <p className="text-red-500 text-sm ml-2 mb-2">{apiError.name}</p>
          )}

          <label className="ml-2 mt-4 block font-normal text-theme-light-textPrimary dark:text-theme-dark-textPrimary">
            Permissions:
          </label>

          {formData.permission.map((perm, index) => (
            <div key={index} className="relative mt-2 rounded-lg border border-theme-light-border p-4 transition-colors duration-200 dark:border-theme-dark-border">
              <button
                type="button"
                onClick={() => handleDeletePermission(index)}
                className="absolute top-2 right-2 font-bold text-theme-light-danger transition-colors duration-200 hover:brightness-90 dark:text-theme-dark-danger"
                title="Delete this permission"
              >
                ✕
              </button>

              <input
                className="theme-input h-10 w-3/4"
                type="text"
                placeholder="Section Name"
                value={perm.sectionName}
                onChange={(e) =>
                  handlePermissionChange(index, "sectionName", e.target.value)
                }
              />
              {apiError[`sectionName_${index}`] && (
                <p className="text-red-500 text-sm ml-2">
                  {apiError[`sectionName_${index}`]}
                </p>
              )}

              <div className="mt-2 flex flex-wrap gap-4 text-theme-light-textPrimary dark:text-theme-dark-textPrimary">
                <label className="flex items-center gap-1">
                  <input
                    className="theme-checkbox"
                    type="checkbox"
                    checked={perm.isCreate}
                    onChange={() => handleCheckboxChange(index, "isCreate")}
                  />
                  Create
                </label>
                <label className="flex items-center gap-1">
                  <input
                    className="theme-checkbox"
                    type="checkbox"
                    checked={perm.isRead}
                    onChange={() => handleCheckboxChange(index, "isRead")}
                  />
                  Read
                </label>
                <label className="flex items-center gap-1">
                  <input
                    className="theme-checkbox"
                    type="checkbox"
                    checked={perm.isUpdate}
                    onChange={() => handleCheckboxChange(index, "isUpdate")}
                  />
                  Update
                </label>
                <label className="flex items-center gap-1">
                  <input
                    className="theme-checkbox"
                    type="checkbox"
                    checked={perm.isDelete}
                    onChange={() => handleCheckboxChange(index, "isDelete")}
                  />
                  Delete
                </label>
              </div>
            </div>
          ))}

          <div className="flex justify-end">
            <button
              type="button"
              className="theme-btn-primary mt-6 rounded-lg px-4 py-2 text-sm"
              onClick={handleAddPermission}
            >
              + Add Permission
            </button>
          </div>

          <button
            type="submit"
            className="theme-btn-primary mt-6 w-full rounded-2xl py-3"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Role"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateRole;
