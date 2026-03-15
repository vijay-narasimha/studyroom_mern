# Backend Environment Variables

Create a `.env` file in the backend directory with the following variables:

- `MONGODB`: MongoDB connection string (e.g., `mongodb://localhost:27017/studyroom`)
- `PORT`: Port number for the server (optional, defaults to 5000)
- `JWTSECRET`: Secret key for JWT token signing (e.g., a random string like `your-secret-key`)
- `CLIENTURL`: URL of the frontend client for CORS configuration (e.g., `http://localhost:3000`)