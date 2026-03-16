# ReferralHub

> Skip the Black Hole. Get Referred Directly.

ReferralHub is a two-sided marketplace connecting job seekers directly with company insiders. Break through the resume auto-rejection filter and secure internal referrals to elite tech companies.

![ReferralHub Preview](./placeholder-image.png)

## 🚀 Tech Stack

| Domain | Technology | Description |
|---|---|---|
| **Frontend Core** | React 18, Vite | UI library and fast build tool |
| **Styling** | Tailwind CSS | Utility-first CSS framework for modern minimal design |
| **State Management**| React Query, Zustand | Async state and global app state |
| **Backend Core** | Node.js, Express.js | Robust runtime and API framework |
| **Database** | MongoDB, Mongoose | NoSQL database and Object Data Modeling |
| **Authentication** | JWT, cookies | Secure stateless authentication with rotation |
| **Media Storage** | Cloudinary | Asset management and image optimization |

## ✨ Features

### For Applicants
* **Direct Access**: Browse active referral opportunities at top-tier companies.
* **Streamlined Pitching**: Send targeted cover notes and portfolios directly to referrers.
* **Application Tracking**: Monitor the status of your referral requests in real-time.
* **Premium UI**: Enjoy a modern, fast, and responsive user experience with optimistic loading.

### For Referrers
* **Talent Sourcing**: Create listings for open roles and invite promising candidates.
* **Pipeline Management**: Review, accept, or decline referral requests from a single dashboard.
* **Reputation System**: Build credibility with successful referral metrics and ratings.
* **Privacy Control**: Manage visibility and limit available referral slots seamlessly.

## 💻 Local Development Setup

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas cluster or local instance

### 2. Clone the Repository
```bash
git clone https://github.com/yourusername/referralhub.git
cd referralhub
```

### 3. Install Dependencies
This project uses a monorepo structure. You can install all dependencies and build via:
```bash
npm run build
```
Or manually install both servers:
```bash
cd client && npm install
cd ../server && npm install
```

### 4. Configure Environment Variables
Create `.env` files in both `/client` and `/server`. Follow the structures demonstrated in `.env.production`.

**`/server/.env`**
```env
PORT=5000
MONGO_URI=<your_mongodb_uri>
JWT_SECRET=<your_jwt_secret>
JWT_REFRESH_SECRET=<your_refresh_secret>
JWT_EXPIRE=15m
REFRESH_TOKEN_EXPIRE=30d
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=<your_cloud_name>
CLOUDINARY_API_KEY=<your_api_key>
CLOUDINARY_API_SECRET=<your_api_secret>
NODE_ENV=development
```

**`/client/.env`**
```env
VITE_API_URL=http://localhost:5000/api/v1
```

### 5. Run the Application
From the root directory:
```bash
npm run dev
```
This will concurrently start the backend API on `localhost:5000` and the Vite frontend on `localhost:5173`.

---

## 🔑 Environment Variables Reference

| Variable | Location | Description |
|---|---|---|
| `MONGO_URI` | Backend | Connection string for MongoDB database |
| `JWT_SECRET` | Backend | Secret key used to sign Access Tokens |
| `JWT_REFRESH_SECRET` | Backend| Secret key used to sign Refresh Tokens |
| `CLIENT_URL` | Backend | Allowed origin for CORS (Frontend URL) |
| `CLOUDINARY_CLOUD_NAME`| Backend | Cloudinary Cloud Name for image uploads |
| `CLOUDINARY_API_KEY` | Backend | Cloudinary API Key |
| `CLOUDINARY_API_SECRET`| Backend | Cloudinary API Secret |
| `VITE_API_URL` | Frontend| Base URL pointing to the Backend API |

---

## 📡 API Endpoints 

### Authentication (`/api/v1/auth`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/register` | Register a new user | Public |
| POST | `/login` | Authenticate user & get tokens | Public |
| POST | `/logout` | Clear HTTP-only cookies | Private |
| GET | `/me` | Get current user session | Private |
| POST | `/refresh-token` | Obtain new access token via refresh token | Public |

### Users (`/api/v1/users`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/:id/profile` | View public profile of a user | Public |
| PATCH | `/profile` | Update own account details | Private |
| POST | `/avatar` | Upload profile picture | Private |
| GET | `/stats/referrer` | View referrer performance metrics | Referrer |
| GET | `/stats/applicant`| View applicant application metrics | Applicant|

### Listings (`/api/v1/listings`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/` | Get paginated & filtered listings | Public |
| POST | `/` | Create a new referral listing | Referrer |
| GET | `/my` | Get all active listings created by user | Referrer |
| GET | `/:id` | View specific listing details | Public |
| PUT | `/:id` | Update listing details | Owner |
| DELETE | `/:id` | Remove a listing | Owner |

### Requests (`/api/v1/requests`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/` | Submit a referral application | Applicant |
| GET | `/my` | View applications sent or received | Private |
| GET | `/:id` | View specific request details | Private |
| PATCH | `/:id/status` | Update application status (accept/reject) | Listing Owner|

### Notifications (`/api/v1/notifications`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/` | Retrieve user's notifications | Private |
| PATCH | `/:id/read` | Mark single notification as read | Private |
| PATCH | `/read-all` | Mark all notifications as read | Private |

---

## 🚢 Deployment Guide

### Option A: Render (Backend) & Vercel (Frontend) - Recommended
This splits the infrastructure gracefully. The `/server` mounts on Render.com, and Vite statically serves via Vercel Edge Networks.

#### 1. Setup External Services
- **MongoDB Atlas**: Create a free cluster (`mongodb.com/atlas`). Create DB user and whitelist all IPs (`0.0.0.0/0`). Obtain connection string.
- **Cloudinary**: Create free account (`cloudinary.com`) and fetch Cloud Name, API Key, and Secret.

#### 2. Deploy Backend to Render
1. Push codebase to GitHub.
2. Sign in to Render and create a **New Web Service**.
3. Connect your repository. Render will automatically detect the `render.yaml` configuration in the root parsing API configuration.
4. Input missing Environment Variables (`MONGO_URI`, `CLIENT_URL`, `CLOUDINARY_*`) during setup.
5. Deploy.

#### 3. Deploy Frontend to Vercel
1. Import the same repository to Vercel.
2. Set Framework Preset to **Vite**.
3. Set **Root Directory** to `client`.
4. Ensure Build Command is `npm run build` and Output Directory is `dist`.
5. Add Environment Variable: `VITE_API_URL = https://your-backend-url.onrender.com/api/v1`.
6. Deploy. Vercel automatically respects the configuration in `vercel.json` handling Client-Side Routing and static caching securely!

### Option B: Full-Stack to Railway
A unified deployment utilizing a single monolith structure.

1. Create Project on Railway.app.
2. Connect your GitHub repository.
3. Add all required Environment variables mirroring `.env.production`.
4. Railway will automatically detect the `railway.json` schema and trigger `npm run build` locally in the root compiling both `client` and `server`, wrapping it into a single Express execution pipeline resolving automatically!
