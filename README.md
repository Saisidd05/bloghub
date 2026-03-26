# Agni College of Technology - Campus Portal 🚀

Welcome to the **ACT Campus Portal**, a premium, modern blog application designed for the Agni College of Technology community. This platform allows students and faculty to share updates, news, and creative content in a sleek, interactive environment.

![Campus Portal Logo](act_logo.png)

## ✨ Features

- 🔐 **Secure Authentication**: User registration and login powered by JWT (JSON Web Tokens).
- 📝 **Dynamic Blogging**: Create, read, update, and delete blog posts with ease.
- 🖼️ **Media Support**: Upload images and videos directly to your posts, powered by Cloudinary.
- 💬 **Social Engagement**: Interact with posts through likes and comments.
- 🎨 **Premium UI/UX**: High-end design featuring:
  - Glassmorphism panels
  - Ambient animated backgrounds
  - Responsive layouts for all devices
  - Micro-animations and hover effects
- 🌑 **Dark Mode Aesthetic**: A modern dark-themed interface with vibrant accents.

## 🛠️ Tech Stack

- **Frontend**: Vanilla HTML5, CSS3 (Modern Flexbox/Grid, Glassmorphism), JavaScript (ES6+).
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB with Mongoose ODM.
- **Authentication**: JWT & Bcryptjs.
- **File Storage**: Cloudinary (via Multer).
- **Deployment**: Configured for Vercel.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16.x or higher)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas)
- [Cloudinary Account](https://cloudinary.com/) (For media uploads)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Saisidd05/bloghub.git
   cd bloghub
   ```

2. **Setup Backend**:
   ```bash
   cd backend
   npm install
   ```

3. **Environment Variables**:
   Create a `.env` file in the `backend` directory and add the following:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Run the Application**:
   - Start the backend:
     ```bash
     npm start
     ```
   - Open `index.html` in your browser or use a local live server.

## 📁 Project Structure

```text
├── backend/            # Express.js server and API routes
│   ├── models/         # Mongoose schemas
│   ├── uploads/        # Local temporary storage
│   └── server.js       # Entry point
├── index.html          # Main frontend application
├── act_logo.png        # Project assets
├── vercel.json         # Deployment configuration
└── package.json        # Main project dependencies
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ by [Saisidd05](https://github.com/Saisidd05)
