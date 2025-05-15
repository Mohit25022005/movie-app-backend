
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

| Method | Endpoint                          | Description                     |
|--------|-----------------------------------|---------------------------------|
| GET    | `/api/movies/upcoming?page=1`     | Upcoming movies (with release date) |
| GET    | `/api/movies/latest`              | Latest movie                    |
| GET    | `/api/movies/popular?page=1`      | Popular movies (with popularity) |
| GET    | `/api/movies/top_rated?page=1`    | Top-rated movies (with vote stats) |

### 🔍 Search

| Method | Endpoint                           | Description                    |
|--------|------------------------------------|--------------------------------|
| GET    | `/api/movies/search?q=query&page=1` | Search movies by title         |

### 🧾 Movie Details

| Method | Endpoint                  | Description                     |
|--------|---------------------------|---------------------------------|
| GET    | `/api/movies/:id`         | Detailed info about a movie     |

---

### ✍️ Reviews (MongoDB)

| Method | Endpoint                  | Description                    |
|--------|---------------------------|--------------------------------|
| POST   | `/api/reviews`            | Add a review                   |
| GET    | `/api/reviews/:movieId`   | Fetch top 5 reviews            |
| DELETE | `/api/reviews/:reviewId`  | Delete own review              |

> Review Schema: `movieId`, `userId`, `authorName`, `avatar`, `content`, `createdAt`

---

### ❤️ Favorites (MongoDB)

| Method | Endpoint         | Description                     |
|--------|------------------|---------------------------------|
| POST   | `/api/favorites` | Add to favorites `{ movieId }` |
| GET    | `/api/favorites` | Fetch user's favorite movies    |

---
