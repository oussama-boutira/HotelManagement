// Seed script to populate hotels table with sample data
const pool = require("./config/db");

const sampleHotels = [
  {
    name: "Riad Marrakech Palace",
    city: "Marrakech",
    stars: 5,
    price_per_night: 250.0,
    amenities: ["wifi", "pool", "spa", "restaurant"],
    status: "available",
    image_url:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
  },
  {
    name: "Atlas Mountain Lodge",
    city: "Marrakech",
    stars: 4,
    price_per_night: 180.0,
    amenities: ["wifi", "parking", "restaurant"],
    status: "available",
    image_url:
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
  },
  {
    name: "Casablanca Grand Hotel",
    city: "Casablanca",
    stars: 5,
    price_per_night: 320.0,
    amenities: ["wifi", "pool", "gym", "spa", "restaurant"],
    status: "available",
    image_url:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
  },
  {
    name: "Marina Bay Resort",
    city: "Casablanca",
    stars: 4,
    price_per_night: 200.0,
    amenities: ["wifi", "pool", "parking", "ac"],
    status: "available",
    image_url:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
  },
  {
    name: "Rabat Royal Suites",
    city: "Rabat",
    stars: 5,
    price_per_night: 280.0,
    amenities: ["wifi", "spa", "restaurant", "workspace"],
    status: "available",
    image_url:
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800",
  },
  {
    name: "Kasbah Agadir",
    city: "Agadir",
    stars: 4,
    price_per_night: 150.0,
    amenities: ["wifi", "pool", "parking", "kitchen"],
    status: "available",
    image_url:
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800",
  },
  {
    name: "Beach Paradise Hotel",
    city: "Agadir",
    stars: 5,
    price_per_night: 220.0,
    amenities: ["wifi", "pool", "spa", "gym", "restaurant"],
    status: "available",
    image_url:
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800",
  },
  {
    name: "Fes Medina Riad",
    city: "Fes",
    stars: 4,
    price_per_night: 175.0,
    amenities: ["wifi", "restaurant", "ac"],
    status: "available",
    image_url:
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800",
  },
  {
    name: "Tangier Bay View",
    city: "Tangier",
    stars: 4,
    price_per_night: 165.0,
    amenities: ["wifi", "parking", "kitchen", "workspace"],
    status: "full",
    image_url:
      "https://images.unsplash.com/photo-1596436889106-be35e843f974?w=800",
  },
  {
    name: "Essaouira Wind Palace",
    city: "Essaouira",
    stars: 3,
    price_per_night: 120.0,
    amenities: ["wifi", "kitchen", "parking"],
    status: "available",
    image_url:
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800",
  },
  {
    name: "Ouarzazate Desert Camp",
    city: "Ouarzazate",
    stars: 3,
    price_per_night: 95.0,
    amenities: ["wifi", "parking", "restaurant"],
    status: "available",
    image_url:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
  },
  {
    name: "Chefchaouen Blue House",
    city: "Chefchaouen",
    stars: 3,
    price_per_night: 85.0,
    amenities: ["wifi", "kitchen", "ac"],
    status: "available",
    image_url:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
  },
];

async function seedHotels() {
  try {
    console.log("🌱 Seeding hotels...");

    // Check if user exists, if not create one
    const [users] = await pool.query("SELECT id FROM users LIMIT 1");
    let userId;

    if (users.length === 0) {
      // Create a default user
      const bcrypt = require("bcryptjs");
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash("password123", salt);

      const [result] = await pool.query(
        "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
        ["admin", "admin@hotels.com", hash]
      );
      userId = result.insertId;
      console.log(
        "✅ Created admin user (email: admin@hotels.com, password: password123)"
      );
    } else {
      userId = users[0].id;
    }

    // Insert hotels
    for (const hotel of sampleHotels) {
      await pool.query(
        `INSERT INTO hotels (name, city, stars, price_per_night, amenities, status, image_url, user_id)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          hotel.name,
          hotel.city,
          hotel.stars,
          hotel.price_per_night,
          JSON.stringify(hotel.amenities),
          hotel.status,
          hotel.image_url,
          userId,
        ]
      );
      console.log(`  ✅ Added: ${hotel.name}`);
    }

    console.log(`\n🎉 Successfully seeded ${sampleHotels.length} hotels!`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error.message);
    process.exit(1);
  }
}

seedHotels();
