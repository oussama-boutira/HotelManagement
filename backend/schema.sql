-- Hotel Management System Database Schema for MySQL
-- Run this in your MySQL database

-- Create database (if needed)
-- CREATE DATABASE IF NOT EXISTS hotel_management;
-- USE hotel_management;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Hotels table
CREATE TABLE IF NOT EXISTS hotels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    stars INT CHECK (stars >= 1 AND stars <= 5),
    price_per_night DECIMAL(10,2) NOT NULL,
    amenities JSON DEFAULT NULL,
    status VARCHAR(20) DEFAULT 'available',
    image_url TEXT,
    user_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CHECK (status IN ('available', 'full'))
);

-- Favorites table
CREATE TABLE IF NOT EXISTS favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    hotel_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE,
    UNIQUE KEY unique_favorite (user_id, hotel_id)
);

-- Create indexes for better performance
CREATE INDEX idx_hotels_city ON hotels(city);
CREATE INDEX idx_hotels_status ON hotels(status);
CREATE INDEX idx_hotels_user_id ON hotels(user_id);
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
