const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://aiia-backend-t0xe.onrender.com";

export async function apiFetch(endpoint, options = {}) {
  const token =
    localStorage.getItem("access_token") || localStorage.getItem("token");

  // Ensure leading slash
  let cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  // Enforce trailing slash before query parameters to avoid FastAPI 307 redirects
  if (!cleanEndpoint.includes("?") && !cleanEndpoint.endsWith("/")) {
    cleanEndpoint += "/";
  }

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${cleanEndpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message =
        errorData.detail || `API error: ${response.status} ${response.statusText}`;

      if (response.status === 401 && token) {
        console.warn("Unauthorized access - Token expired or invalid.");
      }

      throw new Error(message);
    }

    return await response.json();
  } catch (error) {
    console.error(`[API Fetch Error] ${cleanEndpoint}:`, error.message);
    throw error;
  }
}