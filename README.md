# P2P Hotels - Full Stack Hotel Management System

A full-stack web application for hotel management with JWT authentication, CRUD operations, favorites system, and n8n scraping integration.

## 🎯 Description

This Hotel Management System allows users to browse hotels, add their own properties, save favorites, and analyze market competition using n8n workflows.

## 🛠️ Technologies

- **Frontend**: HTML5, CSS3 (Tailwind CSS), JavaScript
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL (Supabase)
- **Authentication**: JWT (jsonwebtoken, bcryptjs)
- **Automation**: n8n Workflow Integration
- **Deployment**: Vercel

## 📋 Features

- ✅ JWT Authentication (Register, Login, Protected Routes)
- ✅ CRUD Operations for Hotels
- ✅ Favorites/Wishlist System
- ✅ Search & Filter by City, Status, Stars
- ✅ Pagination (6 items per page)
- ✅ n8n Workflow Integration for Market Analysis
- ✅ Responsive Airbnb-style Design
- ✅ Owner-only Edit/Delete permissions

## 🚀 Installation

### Prerequisites

- Node.js (v18+)
- PostgreSQL database (or Supabase account)
- npm or yarn

### Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Copy environment template
cp ../.env.example ../.env

# Edit .env with your credentials
# Then start the server
npm start
```

### Database Setup

1. Create a PostgreSQL database (or use Supabase)
2. Run the SQL schema from `backend/schema.sql`
3. Update `.env` with your database credentials

### Environment Variables

```env
DB_HOST=your-supabase-host.supabase.co
DB_USER=postgres
DB_PASSWORD=your-password
DB_NAME=postgres
DB_PORT=5432
JWT_SECRET=your-super-secret-key
N8N_WEBHOOK_URL=https://your-n8n.app/webhook/scraping
PORT=3000
```

### Running Locally

```bash
# Start the backend server
cd backend
npm run dev

# Open browser at http://localhost:3000
```

## 📝 API Documentation

### Authentication

| Method | Endpoint             | Description                  |
| ------ | -------------------- | ---------------------------- |
| POST   | `/api/auth/register` | Register new user            |
| POST   | `/api/auth/login`    | Login and get JWT            |
| GET    | `/api/auth/me`       | Get current user (protected) |

### Hotels

| Method | Endpoint          | Description                |
| ------ | ----------------- | -------------------------- |
| GET    | `/api/hotels`     | Get all hotels (paginated) |
| GET    | `/api/hotels/:id` | Get single hotel           |
| POST   | `/api/hotels`     | Create hotel (protected)   |
| PUT    | `/api/hotels/:id` | Update hotel (owner only)  |
| DELETE | `/api/hotels/:id` | Delete hotel (owner only)  |

**Query Parameters for GET /api/hotels:**

- `search` - Search by hotel name
- `city` - Filter by city
- `status` - Filter by status (available/full)
- `stars` - Filter by star rating (1-5)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 6)

### Favorites

| Method | Endpoint                      | Description           |
| ------ | ----------------------------- | --------------------- |
| GET    | `/api/favorites/my-favorites` | Get user's favorites  |
| POST   | `/api/favorites/:hotelId`     | Add to favorites      |
| DELETE | `/api/favorites/:hotelId`     | Remove from favorites |

### Scraping

| Method | Endpoint                | Description          |
| ------ | ----------------------- | -------------------- |
| POST   | `/api/scraping/trigger` | Trigger n8n workflow |

## 📁 Project Structure

```
HotelManagement/
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── schema.sql
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── hotels.js
│   │   ├── favorites.js
│   │   └── scraping.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── hotelController.js
│   │   ├── favoriteController.js
│   │   └── scrapingController.js
│   └── utils/
│       └── validators.js
├── frontend/
│   ├── index.html
│   ├── login.html
│   ├── add-hotel.html
│   ├── my-properties.html
│   ├── favorites.html
│   ├── css/
│   │   └── styles.css
│   └── js/
│       ├── api.js
│       ├── auth.js
│       └── hotels.js
├── vercel.json
├── .env.example
└── README.md
```

## 🌐 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project on Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Supabase Database

1. Create project on Supabase
2. Go to SQL Editor
3. Run schema from `backend/schema.sql`
4. Copy connection details to Vercel env vars

## 🔄 n8n Workflow Setup

1. Create n8n.cloud account
2. Create workflow:
   - **Webhook** node (POST)
   - **HTTP Request** to scraping API
   - **Google Sheets** to save results
   - **Respond to Webhook** with sheet URL
3. Activate workflow
4. Copy webhook URL to `N8N_WEBHOOK_URL`

## 📸 Screenshots

### Homepage

Hotel listing page with search, filters, and favorites

### Login/Register

Clean authentication forms with toggle

### My Properties

Dashboard to manage your hotels

### Add Property

Form with amenities selection and star rating

## 👤 Author

Created for the Full Stack Development Project

## 📄 License

MIT
