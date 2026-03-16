# Quick Start Guide

## Run the Blog App in 5 Minutes

### 1. Start MongoDB
```bash
mongod
```

### 2. Start Backend
```bash
cd backend
npm install
npm run dev
```
Backend will run on `http://localhost:5000`

### 3. Start Frontend (in new terminal)
```bash
cd frontend
npm install
npm start
```
Frontend will open on `http://localhost:3000`

### 4. Create an Account
- Click "Register" 
- Fill in your details
- Click "Register" button

### 5. Create Your First Post
- Enter a title and content
- Click "Publish Post"
- View your post in the feed!

## Testing the API with Postman

### 1. Register a User
```
POST http://localhost:5000/api/auth/register
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "test123"
}
```
Copy the returned `token`

### 2. Create a Post
```
POST http://localhost:5000/api/posts
Authorization: Bearer <your-token>
{
  "title": "My Test Post",
  "content": "This is a test post"
}
```

### 3. Get All Posts
```
GET http://localhost:5000/api/posts
```

## Troubleshooting

**"Cannot find MongoDB"**
- Download MongoDB from https://www.mongodb.com/try/download/community
- Start MongoDB service

**"Port 5000 already in use"**
- Kill the process: `lsof -ti:5000 | xargs kill -9` (Mac/Linux)
- Or change PORT in `.env`

**"CORS errors"**
- Make sure frontend runs on `localhost:3000`
- Backend must run on `localhost:5000`

---

Need help? Check the main README.md for more details!
