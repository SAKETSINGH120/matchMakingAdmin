// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem("token") || null,
    user: null,
  });
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const fetchUserProfile = async () => {
    if (!auth.token) {
      setAuth((prev) => ({ ...prev, user: null }));
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(`${BASE_URL}/api/v1/admin/profile`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });

      if (res.data.success) {
        const userData = res.data.data.admin;

        setAuth((prev) => ({
          ...prev,
          user: {
            id: userData._id,
            name: userData.name,
            email: userData.email,
            role: userData.role?.name,
            permission: userData.role?.permissions || [],
          },
        }));
      }
    } catch (error) {
      console.error("Failed to fetch user profile", error);
      localStorage.removeItem("token");
      setAuth({ token: null, user: null });
    } finally {
      setLoading(false);
    }
  };

  fetchUserProfile();
}, [auth.token]);
  // const login = async ({ email, password }) => {
  //   try {
  //     const response = await axios.post(`${BASE_URL}/api/v1/admin/login`, {
  //       email,
  //       password,
  //     });

  //     const token = response.data.data.token;
  //     console.log(token)
  //     if (token) {
  //       localStorage.setItem("token", token);
  //       setAuth({ token, user: null }); 
  //       return { success: true };
  //     } else {
  //       throw new Error("Token not found in response");
  //     }
  //   } catch (error) {
  //     console.error("Login failed:", error);
  //     return { success: false, error: error.message };
  //   }
  // };

  const login = async ({ email, password }) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/v1/admin/login`, {
      email,
      password,
    });

    const userData = response.data.data;  
    const token = userData.token;

    console.log(response,"user login response +++++++++")

    if (token) {
      localStorage.setItem("token", token);

      setAuth({ token, user: null }); 
      console.log(auth?.user?.role)

      return { success: true };
    } else {
      throw new Error("Token not found in response");
    }
  } catch (error) {
    console.error("Login failed:", error);
    return { success: false, error: error.message };
  }
};


  const logout = () => {
    localStorage.removeItem("token");
    setAuth({ token: null, user: null });
  };

  // const hasPermission = (sectionName, action) => {
  //   console.log("auth.user.role.permissions",auth.user);
  //   if (!auth.user?.role?.permissions) return false;
  //   const permissions = auth.user.role.permissions;
  //   const section = Object.keys(permissions).find(
  //     (p) => p === sectionName && permissions[p] === true
  //   );
  //   if (!section) return false;
  //   return true;
  // };

  // const hasPermission = (sectionName, action = "list") => {
  //   if (!auth.user?.permissions) return false;

  //   const permissions = auth.user.permission;

  //   return Boolean(
  //     permissions?.[sectionName]?.[action]
  //   );
  // };

  // src/context/AuthContext.js  (only showing the changed part)

const hasPermission = (sectionName, requiredAction) => {
  // Super admin bypass
  if (auth?.user?.role === "super_admin") {
    return true;
  }

  // Normal users
  if (!auth?.user?.permission) {
    return false;
  }

  const perm = auth.user.permission.find(
    p => p.sectionName === sectionName
  );

  if (!perm) {
    return false;
  }

  const action = (requiredAction || "").toLowerCase();

  // We only care about "read" / "list" / "view" right now
  if (action === "read" || action === "view" || action === "list") {
    return perm.isRead === true;
  }

  // For other actions we return false (as per your example data)
  return false;
};

  return (
    <AuthContext.Provider
      value={{ auth, login,hasPermission, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
