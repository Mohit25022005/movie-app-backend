# 🎬 Movies Backend API

This project is a **backend API service** for a movie platform, developed using **Node.js**, **Express.js**, and **MongoDB**. It integrates with **The Movie Database (TMDB)** API to fetch movie data and allows authenticated users to manage **reviews** and **favorites** locally.

---

## 🚀 Features

- 🔐 **JWT Authentication** (Signup/Login)
- 🎞️ Fetch **Upcoming**, **Popular**, **Top Rated**, and **Latest** movies from TMDB
- 🔍 **Search** for movies
- 📄 View **Movie Details**
- ✍️ **Add/Delete Reviews** (stored in MongoDB)
- ❤️ **Manage Favorites** (stored in MongoDB)
- 📃 **Pagination Support** for movie listings
- 🔧 Configurable via `.env`

---

## 🧪 API Endpoints

### 🔐 Authentication (JWT-based)

| Method | Endpoint         | Description                     |
|--------|------------------|---------------------------------|
| POST   | `/api/signup`    | Register a new user             |
| POST   | `/api/login`     | Login and receive JWT token     |

---

### 🎬 Movies from TMDB  
> Headers: `Authorization: Bearer <token>`

| Method | Endpoint                          | Description                          |
|--------|-----------------------------------|--------------------------------------|
| GET    | `/api/movies/upcoming?page=1`     | Upcoming movies (with release date)  |
| GET    | `/api/movies/latest`              | Latest movie                         |
| GET    | `/api/movies/popular?page=1`      | Popular movies (with popularity)     |
| GET    | `/api/movies/top_rated?page=1`    | Top-rated movies (with vote stats)   |

---

### 🔍 Search

| Method | Endpoint                            | Description                    |
|--------|-------------------------------------|--------------------------------|
| GET    | `/api/movies/search?q=query&page=1` | Search movies by title         |

---

### 🧾 Movie Details

| Method | Endpoint           | Description                   |
|--------|--------------------|-------------------------------|
| GET    | `/api/movies/:id`  | Detailed info about a movie   |

---

### ✍️ Reviews (MongoDB)

| Method | Endpoint                 | Description                  |
|--------|--------------------------|------------------------------|
| POST   | `/api/reviews`           | Add a review                 |
| GET    | `/api/reviews/:movieId`  | Fetch top 5 reviews for movie|
| DELETE | `/api/reviews/:reviewId` | Delete own review            |

> **Review Schema:**  
`movieId`, `userId`, `authorName`, `avatar`, `content`, `createdAt`

---

### ❤️ Favorites (MongoDB)

| Method | Endpoint         | Description                     |
|--------|------------------|---------------------------------|
| POST   | `/api/favorites` | Add to favorites `{ movieId }` |
| GET    | `/api/favorites` | Fetch user's favorite movies    |

---

## 🛠️ Getting Started

### 📦 Installation

```bash
# Clone the repository
git clone https://github.com/your-username/movies-backend-api.git
cd movies-backend-api

# Install dependencies
npm install

# Docker - Redis Setup
docker run -d --name redis-stack -p 6379:6379 -p 8001:8001 redis/redis-stack:latest
docker ps
docker exec -it (container_id) bash

# Start the server with nodemon
nodemon server.js
```

# Set environment Variables
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
TMDB_API_KEY=your_tmdb_api_key

