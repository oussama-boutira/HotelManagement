const pool = require("../config/db");

// Add hotel to favorites
const addFavorite = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const userId = req.user.id;

    // Check if hotel exists
    const hotelCheck = await pool.query("SELECT id FROM hotels WHERE id = $1", [
      hotelId,
    ]);
    if (hotelCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found",
      });
    }

    // Check if already favorited
    const existingFav = await pool.query(
      "SELECT id FROM favorites WHERE user_id = $1 AND hotel_id = $2",
      [userId, hotelId]
    );

    if (existingFav.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Hotel is already in your favorites",
      });
    }

    // Add to favorites
    await pool.query(
      "INSERT INTO favorites (user_id, hotel_id) VALUES ($1, $2)",
      [userId, hotelId]
    );

    res.status(201).json({
      success: true,
      message: "Hotel added to favorites",
    });
  } catch (error) {
    console.error("AddFavorite error:", error);
    res.status(500).json({
      success: false,
      message: "Server error adding to favorites",
    });
  }
};

// Remove hotel from favorites
const removeFavorite = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      "DELETE FROM favorites WHERE user_id = $1 AND hotel_id = $2",
      [userId, hotelId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Hotel was not in your favorites",
      });
    }

    res.json({
      success: true,
      message: "Hotel removed from favorites",
    });
  } catch (error) {
    console.error("RemoveFavorite error:", error);
    res.status(500).json({
      success: false,
      message: "Server error removing from favorites",
    });
  }
};

// Get user's favorites
const getMyFavorites = async (req, res) => {
  try {
    const userId = req.user.id;

    const favorites = await pool.query(
      `SELECT h.*, u.username as owner_name, true as is_favorite
             FROM favorites f
             JOIN hotels h ON f.hotel_id = h.id
             LEFT JOIN users u ON h.user_id = u.id
             WHERE f.user_id = $1
             ORDER BY f.created_at DESC`,
      [userId]
    );

    // Parse amenities JSON (PostgreSQL JSONB is already parsed)
    const processedFavorites = favorites.rows.map((h) => ({
      ...h,
      amenities: h.amenities || [],
    }));

    res.json({
      success: true,
      data: processedFavorites,
    });
  } catch (error) {
    console.error("GetMyFavorites error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching favorites",
    });
  }
};

module.exports = { addFavorite, removeFavorite, getMyFavorites };
