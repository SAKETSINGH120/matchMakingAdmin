const BASE_URL = import.meta.env.VITE_BASE_URL;

async function handleResponse(res) {
  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const text = isJson ? await res.json() : await res.text();
  if (!res.ok) {
    const msg = isJson ? text?.message || JSON.stringify(text) : text;
    const error = new Error(msg || `Request failed: ${res.status}`);
    error.status = res.status;
    throw error;
  }
  return text;
}

export async function getEmailTemplate() {
  const token = localStorage.getItem("token");
  const headers = {
    Accept: "application/json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}/api/v1/admin/email-template`, {
    method: "GET",
    // credentials: "include",
    headers,
  });
  return handleResponse(res);
}

export async function saveEmailTemplate(payload) {
  // payload: { subject, body }
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}/api/v1/admin/email-template`, {
    method: "POST",
    // credentials: "include",
    headers,
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export default {
  getEmailTemplate,
  saveEmailTemplate,
};
