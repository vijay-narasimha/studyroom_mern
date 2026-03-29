# StudyRoom MERN

## 📌 Overview

StudyRoom is a full-stack web application built with the **MERN stack** (MongoDB, Express, React, Node.js). It provides a real-time collaborative environment where users can create/join rooms, chat, and connect with other users.

## 🧩 Key Features

### ✅ Authentication & User Management

- User signup and login with JWT-based authentication.
- Secure password storage and login flow.
- User profile pages with editable information.
- Update profile details via the frontend UI.

### 🏠 Rooms & Topics

- Create and manage **Study Rooms**.
- Rooms can have a topic, description, and participants.
- Users can browse existing rooms and join them.
- Room editing/deletion is restricted to the room creator.

### 💬 Real-time Chat

- Real-time chat inside rooms using **Socket.IO**.
- Messages are stored persistently in MongoDB.
- Supports multi-user chat and live message updates.

### 👥 Participants & Private Chat

- View room participants and their profiles.
- Private chat support between users (if implemented in the frontend).

### 🔐 Error Handling & Security

- Centralized error handling via middleware (`errorController.js`).
- Async errors caught using helper wrapper (`catchasync.js`).
- API follows REST conventions and enforces permissions.

## 🗂️ Project Structure

### Backend (`/backend`)

- `server.js` / `app.js` – Express server and middleware setup.
- `router.js` – API routes.
- `controllers/` – Request handlers for auth, rooms, users, errors.
- `models/` – Mongoose models: `User`, `Room`, `Topic`, `Messages`.
- `utils/` – Utility/helpers (`apperror.js`, `catchasync.js`).

### Frontend (`/frontend`)

- Built with **Create React App**.
- Uses **React Router** for navigation.
- Components for authentication, rooms, chat, profiles, and UI.
- Uses **Bootstrap** + **React-Bootstrap** for styling.

## 🚀 Running the Project

### Backend

1. `cd backend`
2. `npm install`
3. Configure environment variables (e.g., `MONGO_URI`, `JWT_SECRET`).
4. `npm start` (or `npm run dev` if using nodemon).

### Seeder Script

To populate the database with dummy users, rooms, and messages:

- Full seed (create users/rooms/messages):
  - `node seed.js`
- Clean and seed everything from scratch:
  - `node seed.js --clean`
- Add messages only (use existing users/rooms):
  - `node seed.js --messages-only`

Example (if using local Mongo URI directly):

- `MONGO_URI=mongodb://localhost:27017/studyroom node seed.js`
- `MONGO_URI=mongodb://localhost:27017/studyroom node seed.js --messages-only`

### Frontend

1. `cd frontend`
2. `npm install`
3. `npm start`

## 📌 Notes

- The frontend expects the backend API to be running (default: `http://localhost:5000`).
- Ensure MongoDB is running and accessible via your connection string.
