const pool = require("../config/db");
const { validateHotel } = require("../utils/validators");

// Get all unique amenities/categories
const getCategories = async (req, res) => {
  try {
    const [hotels] = await pool.query(
      "SELECT amenities FROM hotels WHERE amenities IS NOT NULL"
    );

    // Extract all unique amenities
    const allAmenities = new Set();
    hotels.forEach((hotel) => {
      const amenities =
        typeof hotel.amenities === "string"
          ? JSON.parse(hotel.amenities)
          : hotel.amenities || [];
      amenities.forEach((a) => allAmenities.add(a));
    });

    // Map amenities to category objects with icons
    const iconMap = {
      wifi: "wifi",
      pool: "pool",
      spa: "spa",
      gym: "fitness_center",
      restaurant: "restaurant",
      parking: "local_parking",
      ac: "ac_unit",
      kitchen: "kitchen",
      workspace: "work",
      beachfront: "beach_access",
      luxury: "diamond",
      cabin: "cabin",
    };

    const categories = Array.from(allAmenities).map((amenity) => ({
      id: amenity,
      name:
        amenity.charAt(0).toUpperCase() + amenity.slice(1).replace("_", " "),
      icon: iconMap[amenity] || "category",
    }));

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("GetCategories error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching categories",
    });
  }
};

// Get all unique cities from hotels
const getCities = async (req, res) => {
  try {
    const [cities] = await pool.query(
      "SELECT DISTINCT city FROM hotels WHERE city IS NOT NULL AND city != '' ORDER BY city ASC"
    );

    res.json({
      success: true,
      data: cities.map((c) => c.city),
    });
  } catch (error) {
    console.error("GetCities error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching cities",
    });
  }
};

// Get all hotels with pagination, search, and filters
const getAllHotels = async (req, res) => {
  try {
    const {
      search,
      city,
      status,
      stars,
      amenity,
      page = 1,
      limit = 6,
    } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let query =
      "SELECT h.*, u.username as owner_name FROM hotels h LEFT JOIN users u ON h.user_id = u.id WHERE 1=1";
    let countQuery = "SELECT COUNT(*) as total FROM hotels WHERE 1=1";
    const params = [];
    const countParams = [];

    // Search by name
    if (search) {
      query += " AND h.name LIKE ?";
      countQuery += " AND name LIKE ?";
      params.push(`%${search}%`);
      countParams.push(`%${search}%`);
    }

    // Filter by city
    if (city) {
      query += " AND h.city LIKE ?";
      countQuery += " AND city LIKE ?";
      params.push(`%${city}%`);
      countParams.push(`%${city}%`);
    }

    // Filter by status
    if (status) {
      query += " AND h.status = ?";
      countQuery += " AND status = ?";
      params.push(status);
      countParams.push(status);
    }

    // Filter by stars
    if (stars) {
      query += " AND h.stars = ?";
      countQuery += " AND stars = ?";
      params.push(parseInt(stars));
      countParams.push(parseInt(stars));
    }

    // Filter by amenity (search in JSON array)
    if (amenity) {
      query += " AND JSON_CONTAINS(h.amenities, ?)";
      countQuery += " AND JSON_CONTAINS(amenities, ?)";
      params.push(JSON.stringify(amenity));
      countParams.push(JSON.stringify(amenity));
    }

    // Add ordering and pagination
    query += " ORDER BY h.created_at DESC LIMIT ? OFFSET ?";
    params.push(parseInt(limit), offset);

    // Execute queries
    const [hotels] = await pool.query(query, params);
    const [countResult] = await pool.query(countQuery, countParams);

    const totalItems = countResult[0].total;
    const totalPages = Math.ceil(totalItems / parseInt(limit));

    // Parse amenities JSON and add favorite status
    let processedHotels = hotels.map((h) => ({
      ...h,
      amenities:
        typeof h.amenities === "string"
          ? JSON.parse(h.amenities)
          : h.amenities || [],
    }));

    // If user is logged in, add favorite status
    if (req.user) {
      const [favorites] = await pool.query(
        "SELECT hotel_id FROM favorites WHERE user_id = ?",
        [req.user.id]
      );
      const favoriteIds = favorites.map((f) => f.hotel_id);
      processedHotels = processedHotels.map((h) => ({
        ...h,
        is_favorite: favoriteIds.includes(h.id),
      }));
    }

    res.json({
      success: true,
      data: processedHotels,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("GetAllHotels error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching hotels",
    });
  }
};

// Get single hotel by ID
const getHotelById = async (req, res) => {
  try {
    const { id } = req.params;

    const [hotels] = await pool.query(
      "SELECT h.*, u.username as owner_name FROM hotels h LEFT JOIN users u ON h.user_id = u.id WHERE h.id = ?",
      [id]
    );

    if (hotels.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found",
      });
    }

    let hotel = {
      ...hotels[0],
      amenities:
        typeof hotels[0].amenities === "string"
          ? JSON.parse(hotels[0].amenities)
          : hotels[0].amenities || [],
    };

    // Check if favorite for logged in user
    if (req.user) {
      const [favorites] = await pool.query(
        "SELECT id FROM favorites WHERE user_id = ? AND hotel_id = ?",
        [req.user.id, id]
      );
      hotel.is_favorite = favorites.length > 0;
    }

    res.json({
      success: true,
      data: hotel,
    });
  } catch (error) {
    console.error("GetHotelById error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching hotel",
    });
  }
};

// Create new hotel
const createHotel = async (req, res) => {
  try {
    const { name, city, stars, price_per_night, amenities, status, image_url } =
      req.body;

    // Validate input
    const validation = validateHotel(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.errors.join(", "),
      });
    }

    const [result] = await pool.query(
      `INSERT INTO hotels (name, city, stars, price_per_night, amenities, status, image_url, user_id)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name.trim(),
        city.trim(),
        parseInt(stars),
        parseFloat(price_per_night),
        JSON.stringify(amenities || []),
        status || "available",
        image_url || null,
        req.user.id,
      ]
    );

    // Fetch the created hotel
    const [hotels] = await pool.query("SELECT * FROM hotels WHERE id = ?", [
      result.insertId,
    ]);

    res.status(201).json({
      success: true,
      data: {
        ...hotels[0],
        amenities: amenities || [],
      },
    });
  } catch (error) {
    console.error("CreateHotel error:", error);
    res.status(500).json({
      success: false,
      message: "Server error creating hotel",
    });
  }
};

// Update hotel (owner only)
const updateHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, city, stars, price_per_night, amenities, status, image_url } =
      req.body;

    // Check if hotel exists and user is owner
    const [hotelCheck] = await pool.query(
      "SELECT user_id FROM hotels WHERE id = ?",
      [id]
    );

    if (hotelCheck.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found",
      });
    }

    if (hotelCheck[0].user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can only edit your own hotels",
      });
    }

    // Build update query dynamically
    const updates = [];
    const values = [];

    if (name !== undefined) {
      updates.push("name = ?");
      values.push(name.trim());
    }
    if (city !== undefined) {
      updates.push("city = ?");
      values.push(city.trim());
    }
    if (stars !== undefined) {
      updates.push("stars = ?");
      values.push(parseInt(stars));
    }
    if (price_per_night !== undefined) {
      updates.push("price_per_night = ?");
      values.push(parseFloat(price_per_night));
    }
    if (amenities !== undefined) {
      updates.push("amenities = ?");
      values.push(JSON.stringify(amenities));
    }
    if (status !== undefined) {
      updates.push("status = ?");
      values.push(status);
    }
    if (image_url !== undefined) {
      updates.push("image_url = ?");
      values.push(image_url);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update",
      });
    }

    values.push(id);
    const query = `UPDATE hotels SET ${updates.join(", ")} WHERE id = ?`;

    await pool.query(query, values);

    // Fetch updated hotel
    const [hotels] = await pool.query("SELECT * FROM hotels WHERE id = ?", [
      id,
    ]);

    res.json({
      success: true,
      data: {
        ...hotels[0],
        amenities:
          typeof hotels[0].amenities === "string"
            ? JSON.parse(hotels[0].amenities)
            : hotels[0].amenities,
      },
    });
  } catch (error) {
    console.error("UpdateHotel error:", error);
    res.status(500).json({
      success: false,
      message: "Server error updating hotel",
    });
  }
};

// Delete hotel (owner only)
const deleteHotel = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if hotel exists and user is owner
    const [hotelCheck] = await pool.query(
      "SELECT user_id FROM hotels WHERE id = ?",
      [id]
    );

    if (hotelCheck.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found",
      });
    }

    if (hotelCheck[0].user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own hotels",
      });
    }

    await pool.query("DELETE FROM hotels WHERE id = ?", [id]);

    res.json({
      success: true,
      message: "Hotel deleted successfully",
    });
  } catch (error) {
    console.error("DeleteHotel error:", error);
    res.status(500).json({
      success: false,
      message: "Server error deleting hotel",
    });
  }
};

module.exports = {
  getCategories,
  getCities,
  getAllHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
};
