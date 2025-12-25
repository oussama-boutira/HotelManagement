// Authentication module

// Check if user is logged in
const isLoggedIn = () => {
  return !!getToken();
};

// Handle login
const handleLogin = async (email, password) => {
  const result = await api.login({ email, password });

  if (result.ok && result.data.success) {
    setToken(result.data.token);
    setUser(result.data.user);
    return { success: true, user: result.data.user };
  }

  return { success: false, message: result.data.message || "Login failed" };
};

// Handle registration
const handleRegister = async (username, email, password) => {
  const result = await api.register({ username, email, password });

  if (result.ok && result.data.success) {
    setToken(result.data.token);
    setUser(result.data.user);
    return { success: true, user: result.data.user };
  }

  return {
    success: false,
    message: result.data.message || "Registration failed",
  };
};

// Handle logout
const handleLogout = () => {
  removeToken();
  removeUser();
  window.location.href = "/login.html";
};

// Verify current user
const verifyUser = async () => {
  if (!getToken()) return null;

  const result = await api.getMe();

  if (result.ok && result.data.success) {
    setUser(result.data.user);
    return result.data.user;
  }

  // Token invalid
  removeToken();
  removeUser();
  return null;
};

// Require authentication (redirect if not logged in)
const requireAuth = () => {
  if (!isLoggedIn()) {
    window.location.href = "/login.html";
    return false;
  }
  return true;
};

// Update UI based on auth state
const updateAuthUI = () => {
  const user = getUser();
  const loggedIn = isLoggedIn();

  console.log("Auth state:", { loggedIn, user }); // Debug log

  // Update user menu elements - use classList for better Tailwind compatibility
  document.querySelectorAll(".auth-logged-in").forEach((el) => {
    if (loggedIn) {
      el.classList.remove("hidden");
      el.style.display = ""; // Reset any inline style
    } else {
      el.classList.add("hidden");
    }
  });

  document.querySelectorAll(".auth-logged-out").forEach((el) => {
    if (loggedIn) {
      el.classList.add("hidden");
    } else {
      el.classList.remove("hidden");
      el.style.display = ""; // Reset any inline style
    }
  });

  // Update username displays
  document.querySelectorAll(".user-name").forEach((el) => {
    el.textContent = user?.username || "";
  });

  document.querySelectorAll(".user-email").forEach((el) => {
    el.textContent = user?.email || "";
  });
};

// Export for use in other files
window.isLoggedIn = isLoggedIn;
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.handleLogout = handleLogout;
window.verifyUser = verifyUser;
window.requireAuth = requireAuth;
window.updateAuthUI = updateAuthUI;
