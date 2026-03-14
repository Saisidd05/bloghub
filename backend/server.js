require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'secretkey123';

// --- CLOUD CONFIGURATION ---
// MongoDB Atlas
mongoose.connect('mongodb+srv://nsaisiddharth05_db_user:FKsGKpTAbZrm23wT@blog.pb9xu8w.mongodb.net/?retryWrites=true&w=majority&appName=blog', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Cloudinary
cloudinary.config({
  cloud_name: 'dkgxl7adi',
  api_key: '654645356389996',
  api_secret: '9JVtlkP-n5sN5hBm-MMxViSuKK4'
});

// Multer + Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Determine resource type based on mime type
    let resource_type = 'auto'; // automatically detects image, video, raw (docs)
    if (file.mimetype.startsWith('video/')) resource_type = 'video';
    else if (file.mimetype.startsWith('image/')) resource_type = 'image';
    else resource_type = 'raw'; // for pdfs, docs, etc.

    return {
      folder: 'bloghub_uploads',
      resource_type: resource_type,
      public_id: Date.now() + '-' + file.originalname.split('.')[0]
    };
  }
});
const upload = multer({ storage: storage });

// --- DATABASE MODELS ---
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, default: null, unique: true, sparse: true },
  phone: { type: String, default: null, unique: true, sparse: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'staff'], required: true },
  department: { type: String, required: true },
  collegeId: { type: String, required: true, unique: true }, // Register Number or Staff ID
  profilePic: { type: String, default: null } // Now stores Cloudinary URL
}, { timestamps: true });
const User = mongoose.model('User', UserSchema);

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  media: { type: String, default: null }, // Cloudinary URL
  mediaType: { type: String, enum: ['image', 'video', 'raw', null], default: null },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    text: { type: String, required: true },
    author: {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      name: String,
      profilePic: String
    },
    createdAt: { type: Date, default: Date.now }
  }],
  author: {
    _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    email: String,
    profilePic: String
  }
}, { timestamps: true });
const Post = mongoose.model('Post', PostSchema);

// --- JWT MIDDLEWARE ---
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id: '...' }
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// --- AUTH ROUTES ---
app.post('/api/auth/register', upload.single('profilePic'), async (req, res) => {
  try {
    const { name, email, password, phone, role, department, collegeId } = req.body;

    if (!role || !department || !collegeId) {
      return res.status(400).json({ message: 'Role, Department, and College ID are required' });
    }

    if (phone && !/^[6-9]\d{9}$/.test(phone)) return res.status(400).json({ message: 'Invalid Indian phone number.' });

    let existingUser = await User.findOne({ collegeId });
    if (existingUser) return res.status(400).json({ message: 'College ID already registered.' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Cloudinary returns the exact HTTPS URL in `req.file.path`
    const profilePicUrl = req.file ? req.file.path : null;

    const user = new User({
      name, email, phone, role, department, collegeId, password: hashedPassword, profilePic: profilePicUrl
    });
    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { _id: user._id, name: user.name, role: user.role, department: user.department, collegeId: user.collegeId, profilePic: user.profilePic } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { collegeId, password } = req.body;
    const user = await User.findOne({ collegeId });
    if (!user) return res.status(400).json({ message: 'Invalid College ID or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid College ID or password' });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { _id: user._id, name: user.name, role: user.role, department: user.department, collegeId: user.collegeId, profilePic: user.profilePic } });
  } catch (err) {
    res.status(500).json({ message: 'Server error during login' });
  }
});

app.put('/api/auth/profile', authMiddleware, upload.single('profilePic'), async (req, res) => {
  try {
    const { name, phone, email } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (phone && phone !== user.phone) {
      if (!/^[6-9]\d{9}$/.test(phone)) return res.status(400).json({ message: 'Invalid Indian phone number.' });
      const exists = await User.findOne({ phone, _id: { $ne: user._id } });
      if (exists) return res.status(400).json({ message: 'Phone number already in use.' });
    }

    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email, _id: { $ne: user._id } });
      if (emailExists) return res.status(400).json({ message: 'Email already in use.' });
    }

    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.email = email || user.email;

    // If a new file was uploaded to Cloudinary, update the URL
    if (req.file) {
      user.profilePic = req.file.path;
    }

    await user.save();
    res.json({ _id: user._id, name: user.name, email: user.email, phone: user.phone, profilePic: user.profilePic });
  } catch (err) {
    res.status(500).json({ message: 'Server error updating profile' });
  }
});

app.put('/api/auth/password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Incorrect current password' });

    if (newPassword.length < 6) return res.status(400).json({ message: 'New password must be at least 6 characters' });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error updating password' });
  }
});

// --- POST ROUTES ---
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching posts' });
  }
});

app.post('/api/posts', authMiddleware, upload.single('media'), async (req, res) => {
  try {
    const { title, content } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    let mediaUrl = null;
    let mediaType = null;

    if (req.file) {
      mediaUrl = req.file.path; // Cloudinary secure URL
      if (req.file.mimetype.startsWith('image/')) mediaType = 'image';
      else if (req.file.mimetype.startsWith('video/')) mediaType = 'video';
      else mediaType = 'raw';
    }

    const newPost = new Post({
      title,
      content,
      media: mediaUrl,
      mediaType: mediaType,
      author: { _id: user._id, name: user.name, email: user.email, profilePic: user.profilePic }
    });

    await newPost.save();
    res.json(newPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error creating post' });
  }
});

app.put('/api/posts/:id/like', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Check if user has already liked
    const index = post.likes.indexOf(req.user.id);
    if (index === -1) {
      post.likes.push(req.user.id);
    } else {
      post.likes.splice(index, 1);
    }

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Server error updating like' });
  }
});

app.post('/api/posts/:id/comment', authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Comment text is required' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.comments.push({
      text,
      author: {
        _id: user._id,
        name: user.name,
        profilePic: user.profilePic
      }
    });

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Server error adding comment' });
  }
});

app.delete('/api/posts/:id', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.author._id.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await post.deleteOne();
    res.json({ message: 'Post removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error deleting post' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Production Server started on port ${PORT}`);
});
