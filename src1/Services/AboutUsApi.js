const BASE_URL = import.meta.env.VITE_BASE_URL;
import toast from "react-hot-toast";

export const getCmsPage = async (pageType) => {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(
      `${BASE_URL}/api/v1/admin/cms/${pageType}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return await res.json();
  } catch (error) {
    console.error("Error fetching CMS page:", error);
    return { success: false };
  }
};


export const updatePrivacyPolicy = async (content) => {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`${BASE_URL}/api/v1/admin/cms`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pageType: "about-us",
        content: content,
      }),
    });

    return await res.json();
  } catch (error) {
    console.error("Error updating privacy policy:", error);
    return { success: false };
  }
};