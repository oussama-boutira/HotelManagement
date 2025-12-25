// Simple validation helpers

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  // At least 6 characters
  return password && password.length >= 6;
};

const validateUsername = (username) => {
  // 3-50 characters, alphanumeric and underscores
  const usernameRegex = /^[a-zA-Z0-9_]{3,50}$/;
  return usernameRegex.test(username);
};

const validateHotel = (data) => {
  const errors = [];

  if (!data.name || data.name.trim().length < 2) {
    errors.push("Hotel name must be at least 2 characters");
  }

  if (!data.city || data.city.trim().length < 2) {
    errors.push("City must be at least 2 characters");
  }

  if (!data.stars || data.stars < 1 || data.stars > 5) {
    errors.push("Stars must be between 1 and 5");
  }

  if (!data.price_per_night || data.price_per_night < 0) {
    errors.push("Price per night must be a positive number");
  }

  if (data.status && !["available", "full"].includes(data.status)) {
    errors.push('Status must be "available" or "full"');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

module.exports = {
  validateEmail,
  validatePassword,
  validateUsername,
  validateHotel,
};
