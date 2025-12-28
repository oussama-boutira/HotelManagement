# 🏨 P2P Hotels - Full Stack Hotel Management Platform

<div align="center">

**A modern, full-stack web application for peer-to-peer hotel rental management**

🌐 **Live Demo**: [https://p2photels.vercel.app](https://p2photels.vercel.app)

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)](https://nodejs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-4169E1?logo=postgresql)](https://supabase.com)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-000?logo=vercel)](https://vercel.com)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

</div>

---

## 📑 Table of Contents

1. [Project Overview](#-project-overview)
2. [Features](#-features)
3. [Technology Stack](#-technology-stack)
4. [System Architecture](#-system-architecture)
5. [Database Schema](#-database-schema)
6. [API Documentation](#-api-documentation)
7. [Project Structure](#-project-structure)
8. [Installation Guide](#-installation-guide)
9. [Deployment](#-deployment)
10. [Security](#-security)
11. [Future Improvements](#-future-improvements)

---

## 🎯 Project Overview

P2P Hotels is a comprehensive hotel management platform inspired by Airbnb's design philosophy. The application enables users to:

- **Browse** a curated collection of hotels with advanced filtering
- **List** their own properties for peer-to-peer rental
- **Save** favorite hotels for quick access
- **Analyze** market competition using integrated n8n workflows

### Problem Statement

Traditional hotel booking platforms lack personalization and peer-to-peer rental capabilities. P2P Hotels bridges this gap by providing a modern, user-friendly interface for both travelers and property owners.

### Solution

A full-stack web application with:

- Secure JWT-based authentication
- Real-time CRUD operations
- Cloud-hosted PostgreSQL database
- Serverless deployment on Vercel

---

## ✨ Features

### Core Features

| Feature                  | Description                                  |
| ------------------------ | -------------------------------------------- |
| 🔐 **Authentication**    | Secure JWT-based login/registration system   |
| 🏠 **Hotel CRUD**        | Create, read, update, delete hotel listings  |
| ❤️ **Favorites System**  | Save and manage favorite hotels              |
| 🔍 **Advanced Search**   | Filter by city, status, stars, and keywords  |
| 📄 **Pagination**        | Efficient loading with 6 items per page      |
| 👤 **Owner Permissions** | Only owners can edit/delete their properties |

### Technical Features

| Feature                  | Description                           |
| ------------------------ | ------------------------------------- |
| 📱 **Responsive Design** | Mobile-first Airbnb-style UI         |
| ⚡ **Serverless**        | Edge-optimized Vercel deployment      |
| 🔄 **n8n Integration**   | Automated market analysis workflows   |
| 🛡️ **Input Validation**  | Server-side validation for all inputs |

---

## 🛠️ Technology Stack

### Frontend

| Technology            | Purpose                        |
| --------------------- | ------------------------------ |
| HTML5                 | Structure and semantics        |
| CSS3 + Tailwind CSS   | Styling and responsive design  |
| Vanilla JavaScript    | DOM manipulation and API calls |
| Google Material Icons | UI iconography                 |

### Backend

| Technology         | Purpose               |
| ------------------ | --------------------- |
| Node.js (v18+)     | Runtime environment   |
| Express.js         | Web framework         |
| JWT (jsonwebtoken) | Authentication tokens |
| bcryptjs           | Password hashing      |

### Database

| Technology         | Purpose                  |
| ------------------ | ------------------------ |
| PostgreSQL         | Relational database      |
| Supabase           | Database hosting (DBaaS) |
| pg (node-postgres) | Database driver          |

### DevOps

| Technology | Purpose             |
| ---------- | ------------------- |
| Vercel     | Serverless hosting  |
| GitHub     | Version control     |
| n8n        | Workflow automation |

---

## 🏗️ System Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│   Frontend      │────▶│   Backend       │────▶│   Database      │
│   (Vercel)      │     │   (Express.js)  │     │   (Supabase)    │
│                 │◀────│                 │◀────│                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
       │                        │
       │                        │
       ▼                        ▼
┌─────────────────┐     ┌─────────────────┐
│  LocalStorage   │     │  n8n Workflow   │
│  (JWT Token)    │     │  (Scraping)     │
└─────────────────┘     └─────────────────┘
```

### Request Flow

1. **User Action** → Frontend sends API request
2. **Authentication** → JWT token validated by middleware
3. **Controller** → Business logic processes request
4. **Database** → PostgreSQL query via connection pool
5. **Response** → JSON data returned to frontend

---

## 🗄️ Database Schema

### Entity Relationship Diagram

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│    users     │       │    hotels    │       │  favorites   │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ id (PK)      │◀──────│ user_id (FK) │       │ id (PK)      │
│ username     │       │ id (PK)      │◀──────│ hotel_id(FK) │
│ email        │       │ name         │       │ user_id (FK) │──▶ users
│ password_hash│       │ city         │       │ created_at   │
│ created_at   │       │ stars        │       └──────────────┘
└──────────────┘       │ price_per_night│
                       │ amenities    │
                       │ status       │
                       │ image_url    │
                       │ created_at   │
                       │ updated_at   │
                       └──────────────┘
```

### Tables

#### Users Table

| Column        | Type         | Constraints      |
| ------------- | ------------ | ---------------- |
| id            | SERIAL       | PRIMARY KEY      |
| username      | VARCHAR(50)  | UNIQUE, NOT NULL |
| email         | VARCHAR(100) | UNIQUE, NOT NULL |
| password_hash | VARCHAR(255) | NOT NULL         |
| created_at    | TIMESTAMP    | DEFAULT NOW()    |

#### Hotels Table

| Column          | Type          | Constraints           |
| --------------- | ------------- | --------------------- |
| id              | SERIAL        | PRIMARY KEY           |
| name            | VARCHAR(100)  | NOT NULL              |
| city            | VARCHAR(100)  | NOT NULL              |
| stars           | INTEGER       | CHECK (1-5)           |
| price_per_night | DECIMAL(10,2) | NOT NULL              |
| amenities       | JSONB         | DEFAULT '[]'          |
| status          | VARCHAR(20)   | 'available' or 'full' |
| image_url       | TEXT          | Optional              |
| user_id         | INTEGER       | FK → users(id)        |
| created_at      | TIMESTAMP     | DEFAULT NOW()         |
| updated_at      | TIMESTAMP     | AUTO-UPDATE           |

#### Favorites Table

| Column     | Type      | Constraints     |
| ---------- | --------- | --------------- |
| id         | SERIAL    | PRIMARY KEY     |
| user_id    | INTEGER   | FK → users(id)  |
| hotel_id   | INTEGER   | FK → hotels(id) |
| created_at | TIMESTAMP | DEFAULT NOW()   |

---

## 📡 API Documentation

### Base URL

```
Production: https://p2photels.vercel.app/api
Local: http://localhost:3000/api
```

### Authentication Endpoints

| Method | Endpoint         | Description       | Auth Required |
| ------ | ---------------- | ----------------- | ------------- |
| POST   | `/auth/register` | Register new user | ❌            |
| POST   | `/auth/login`    | Login user        | ❌            |
| GET    | `/auth/me`       | Get current user  | ✅            |

#### Register Request

```json
POST /api/auth/register
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login Response

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

### Hotels Endpoints

| Method | Endpoint             | Description            | Auth Required |
| ------ | -------------------- | ---------------------- | ------------- |
| GET    | `/hotels`            | List all hotels        | ❌            |
| GET    | `/hotels/:id`        | Get single hotel       | ❌            |
| GET    | `/hotels/categories` | Get amenity categories | ❌            |
| GET    | `/hotels/cities`     | Get all cities         | ❌            |
| POST   | `/hotels`            | Create hotel           | ✅            |
| PUT    | `/hotels/:id`        | Update hotel           | ✅ (Owner)    |
| DELETE | `/hotels/:id`        | Delete hotel           | ✅ (Owner)    |

#### Query Parameters (GET /hotels)

| Parameter | Type    | Description                 |
| --------- | ------- | --------------------------- |
| search    | string  | Search by hotel name        |
| city      | string  | Filter by city              |
| status    | string  | 'available' or 'full'       |
| stars     | integer | Filter by star rating       |
| amenity   | string  | Filter by amenity           |
| page      | integer | Page number (default: 1)    |
| limit     | integer | Items per page (default: 6) |

### Favorites Endpoints

| Method | Endpoint                  | Description           | Auth Required |
| ------ | ------------------------- | --------------------- | ------------- |
| GET    | `/favorites/my-favorites` | Get user's favorites  | ✅            |
| POST   | `/favorites/:hotelId`     | Add to favorites      | ✅            |
| DELETE | `/favorites/:hotelId`     | Remove from favorites | ✅            |

### Scraping Endpoints

| Method | Endpoint            | Description          | Auth Required |
| ------ | ------------------- | -------------------- | ------------- |
| POST   | `/scraping/trigger` | Trigger n8n workflow | ✅            |

---

## 📁 Project Structure

```
HotelManagement/
│
├── 📂 backend/                   # Backend API
│   ├── 📄 server.js              # Express app entry point
│   ├── 📄 package.json           # Dependencies
│   ├── 📄 schema.sql             # Database schema
│   ├── 📄 seed.js                # Sample data seeder
│   │
│   ├── 📂 config/
│   │   └── 📄 db.js              # PostgreSQL connection pool
│   │
│   ├── 📂 middleware/
│   │   └── 📄 auth.js            # JWT authentication middleware
│   │
│   ├── 📂 routes/
│   │   ├── 📄 auth.js            # Auth routes
│   │   ├── 📄 hotels.js          # Hotel routes
│   │   ├── 📄 favorites.js       # Favorites routes
│   │   └── 📄 scraping.js        # Scraping routes
│   │
│   ├── 📂 controllers/
│   │   ├── 📄 authController.js      # Auth logic
│   │   ├── 📄 hotelController.js     # Hotel CRUD logic
│   │   ├── 📄 favoriteController.js  # Favorites logic
│   │   └── 📄 scrapingController.js  # n8n integration
│   │
│   └── 📂 utils/
│       └── 📄 validators.js      # Input validation
│
├── 📂 frontend/                  # Frontend static files
│   ├── 📄 index.html             # Homepage
│   ├── 📄 login.html             # Auth page
│   ├── 📄 hotel-detail.html      # Hotel details
│   ├── 📄 add-hotel.html         # Add/Edit hotel
│   ├── 📄 my-properties.html     # User dashboard
│   ├── 📄 favorites.html         # Favorites page
│   │
│   ├── 📂 css/
│   │   └── 📄 styles.css         # Custom styles
│   │
│   └── 📂 js/
│       ├── 📄 api.js             # API client
│       ├── 📄 auth.js            # Auth handlers
│       └── 📄 hotels.js          # Hotel UI logic
│
├── 📄 vercel.json                # Vercel configuration
├── 📄 .env.example               # Environment template
├── 📄 .gitignore                 # Git ignore rules
└── 📄 README.md                  # Documentation
```

---

## 🚀 Installation Guide

### Prerequisites

- Node.js v18 or higher
- npm or yarn
- PostgreSQL database (or Supabase account)
- Git

### Step 1: Clone Repository

```bash
git clone https://github.com/oussama-boutira/HotelManagement.git
cd HotelManagement
```

### Step 2: Install Dependencies

```bash
cd backend
npm install
```

### Step 3: Configure Environment

Create `.env` file in root directory:

```env
# Database (Supabase)
DATABASE_URL=postgresql://postgres.[project]:[password]@aws-1-eu-west-2.pooler.supabase.com:6543/postgres

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here

# n8n Integration (optional)
N8N_WEBHOOK_URL=https://your-n8n.app/webhook/scraping

# Server
PORT=3000
```

### Step 4: Setup Database

1. Create Supabase project at [supabase.com](https://supabase.com)
2. Go to SQL Editor
3. Copy and run contents of `backend/schema.sql`

### Step 5: Seed Sample Data (Optional)

```bash
cd backend
node seed.js
```

### Step 6: Start Development Server

```bash
npm run dev
# or
npm start
```

Visit http://localhost:3000

---

## 🌐 Deployment

### Deploying to Vercel

#### Method 1: Vercel CLI

```bash
npm i -g vercel
cd HotelManagement
vercel --prod
```

#### Method 2: GitHub Integration

1. Push code to GitHub repository
2. Visit [vercel.com](https://vercel.com) and sign in
3. Click "Add New Project"
4. Import your GitHub repository
5. Add environment variables:
   - `DATABASE_URL`
   - `JWT_SECRET`
6. Click "Deploy"

### Vercel Configuration

The `vercel.json` configures:

- Backend as serverless functions
- Frontend as static files
- Route rewrites for API calls

---

## 🔒 Security

### Authentication

- Passwords hashed with bcrypt (salt rounds: 10)
- JWT tokens expire after 7 days
- Protected routes require valid Bearer token

### Input Validation

- Email format validation
- Username: 3-50 alphanumeric characters
- Password: minimum 6 characters
- Hotel data: name, city, stars (1-5), price validation

### Database Security

- Parameterized queries prevent SQL injection
- SSL connection to Supabase
- Environment variables for credentials

---

## 🔮 Future Improvements

- [ ] Image upload functionality (Supabase Storage)
- [ ] Email verification for registration
- [ ] Password reset functionality
- [ ] Reviews and ratings system
- [ ] Real-time notifications (WebSockets)
- [ ] Admin dashboard
- [ ] Google/GitHub OAuth login
- [ ] Booking/reservation system
- [ ] Payment integration (Stripe)

---

## 👤 Author

**Oussama Boutira**

Full Stack Development Project - 2025

---


<div align="center">

**Made with ❤️ using Node.js, PostgreSQL, and Vercel**

[⬆ Back to Top](#-p2p-hotels---full-stack-hotel-management-platform)

</div>
