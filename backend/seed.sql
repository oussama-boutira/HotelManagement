-- Sample data for Hotel Management System
-- Run this after schema.sql

-- Insert sample hotels (user_id = 1 assumes the test user exists)
INSERT INTO hotels (name, city, stars, price_per_night, amenities, status, image_url, user_id) VALUES
('Riad Marrakech Palace', 'Marrakech', 5, 250.00, '["wifi", "pool", "spa", "restaurant"]', 'available', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', 1),
('Atlas Mountain Lodge', 'Marrakech', 4, 180.00, '["wifi", "parking", "restaurant"]', 'available', 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800', 1),
('Casablanca Grand Hotel', 'Casablanca', 5, 320.00, '["wifi", "pool", "gym", "spa", "restaurant"]', 'available', 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800', 1),
('Marina Bay Resort', 'Casablanca', 4, 200.00, '["wifi", "pool", "parking", "ac"]', 'available', 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800', 1),
('Rabat Royal Suites', 'Rabat', 5, 280.00, '["wifi", "spa", "restaurant", "workspace"]', 'available', 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800', 1),
('Kasbah Agadir', 'Agadir', 4, 150.00, '["wifi", "pool", "parking", "kitchen"]', 'available', 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800', 1),
('Beach Paradise Hotel', 'Agadir', 5, 220.00, '["wifi", "pool", "spa", "gym", "restaurant"]', 'available', 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800', 1),
('Fes Medina Riad', 'Fes', 4, 175.00, '["wifi", "restaurant", "ac"]', 'available', 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800', 1),
('Tangier Bay View', 'Tangier', 4, 165.00, '["wifi", "parking", "kitchen", "workspace"]', 'full', 'https://images.unsplash.com/photo-1596436889106-be35e843f974?w=800', 1),
('Essaouira Wind Palace', 'Essaouira', 3, 120.00, '["wifi", "kitchen", "parking"]', 'available', 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800', 1),
('Ouarzazate Desert Camp', 'Ouarzazate', 3, 95.00, '["wifi", "parking", "restaurant"]', 'available', 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800', 1),
('Chefchaouen Blue House', 'Chefchaouen', 3, 85.00, '["wifi", "kitchen", "ac"]', 'available', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', 1);

-- Verify insertion
SELECT COUNT(*) as total_hotels FROM hotels;
