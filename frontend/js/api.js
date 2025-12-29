// API utility functions

const API_BASE_URL = "/api";

// Cookie helper functions
const setCookie = (name, value, days = 7) => {
  const expires = new Date(
    Date.now() + days * 24 * 60 * 60 * 1000
  ).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; expires=${expires}; path=/; SameSite=Strict; Secure`;
};

const getCookie = (name) => {
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split("=");
    if (cookieName === name) {
      return decodeURIComponent(cookieValue);
    }
  }
  return null;
};

const deleteCookie = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict; Secure`;
};

// Get token from cookie
const getToken = () => {
  return getCookie("token");
};

// Set token in cookie
const setToken = (token) => setCookie("token", token, 7);

// Remove token from cookie
const removeToken = () => deleteCookie("token");

// User data is fetched from API, not stored locally
let cachedUser = null;

// Get user (returns cached user or null)
const getUser = () => cachedUser;

// Set user (only in memory, not persisted)
const setUser = (user) => {
  cachedUser = user;
};

// Remove user from memory
const removeUser = () => {
  cachedUser = null;
};

// Make API request with optional auth
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    // Handle token expiration
    if (response.status === 401 && data.message?.includes("expired")) {
      removeToken();
      removeUser();
      window.location.href = "/login.html";
      return;
    }

    return { ok: response.ok, status: response.status, data };
  } catch (error) {
    console.error("API Error:", error);
    return { ok: false, status: 500, data: { message: "Network error" } };
  }
};

// API methods
const api = {
  // Auth
  register: (userData) =>
    apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  login: (credentials) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  getMe: () => apiRequest("/auth/me"),

  // Hotels
  getCategories: () => apiRequest("/hotels/categories"),

  getCities: () => apiRequest("/hotels/cities"),

  getHotels: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/hotels${queryString ? "?" + queryString : ""}`);
  },

  getHotel: (id) => apiRequest(`/hotels/${id}`),

  createHotel: (hotelData) =>
    apiRequest("/hotels", {
      method: "POST",
      body: JSON.stringify(hotelData),
    }),

  updateHotel: (id, hotelData) =>
    apiRequest(`/hotels/${id}`, {
      method: "PUT",
      body: JSON.stringify(hotelData),
    }),

  deleteHotel: (id) =>
    apiRequest(`/hotels/${id}`, {
      method: "DELETE",
    }),

  // Favorites
  getFavorites: () => apiRequest("/favorites/my-favorites"),

  addFavorite: (hotelId) =>
    apiRequest(`/favorites/${hotelId}`, {
      method: "POST",
    }),

  removeFavorite: (hotelId) =>
    apiRequest(`/favorites/${hotelId}`, {
      method: "DELETE",
    }),

  // Scraping
  triggerScraping: (city, keyword) =>
    apiRequest("/scraping/trigger", {
      method: "POST",
      body: JSON.stringify({ city, keyword }),
    }),
};

// Export for use in other files
window.api = api;
window.getToken = getToken;
window.setToken = setToken;
window.removeToken = removeToken;
window.getUser = getUser;
window.setUser = setUser;
window.removeUser = removeUser;
