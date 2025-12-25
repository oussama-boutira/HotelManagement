// API utility functions

const API_BASE_URL = "/api";

// Get token from localStorage (check both standalone token and user.token)
const getToken = () => {
  // First check standalone token
  const token = localStorage.getItem("token");
  if (token) return token;

  // Also check if token is stored inside user object
  const user = localStorage.getItem("user");
  if (user) {
    try {
      const parsedUser = JSON.parse(user);
      if (parsedUser?.token) return parsedUser.token;
    } catch (e) {}
  }
  return null;
};

// Set token in localStorage
const setToken = (token) => localStorage.setItem("token", token);

// Remove token from localStorage
const removeToken = () => localStorage.removeItem("token");

// Get user from localStorage
const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// Set user in localStorage
const setUser = (user) => localStorage.setItem("user", JSON.stringify(user));

// Remove user from localStorage
const removeUser = () => localStorage.removeItem("user");

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
