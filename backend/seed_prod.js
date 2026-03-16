const mongoose = require('mongoose');

// Temporary Mongoose Models to directly inject data without Auth routes
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePic: { type: String, default: null }
}, { timestamps: true });
const User = mongoose.model('User', UserSchema);

const PostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    media: { type: String, default: null },
    mediaType: { type: String, enum: ['image', 'video', 'raw', null], default: null },
    author: {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        name: String,
        email: String,
        profilePic: String
    }
}, { timestamps: true });
const Post = mongoose.model('Post', PostSchema);

const INDIAN_NAMES = ['Aarav Patel', 'Diya Sharma', 'Vivaan Kumar', 'Ananya Singh', 'Advik Gupta', 'Saanvi Reddy', 'Reyansh Iyer', 'Myra Joshi', 'Krishna Menon', 'Ishita Desai'];

const TECH_TITLES = [
    'Why React 19 is a game-changer', 'Understanding the transition to Serverless', 'My experience with Vercel Edge Networks',
    'CSS clamp() makes responsive design trivial', 'The state of MongoDB in 2024', 'Why Node.js 24 matters',
    'How to build a SaaS in a weekend', 'Stop using 100vw, do this instead', 'The hidden cost of large NPM modules', 'Cloudinary vs AWS S3: A realistic comparison'
];

const CONTENT = [
    'I recently migrated an entire monolithic application to a serverless architecture using Vercel. The cold starts are barely noticeable, and the auto-scaling is seamless. Definitely recommend giving it a try for your next project.',
    'Responsive design used to mean writing complex media queries for every possible breakpoint. Now, with CSS clamp(min, val, max), we can let the browser perform the complex calculations for fluid typography and spacing. It is beautiful.',
    'Everyone talks about AI, but the unsung hero of modern web development is Edge caching. Pushing your API responses and static assets to the CDNs closest to your users results in a level of native-app feeling speed you cannot get any other way.',
    'Setting up MongoDB Atlas with an Express backend was surprisingly straightforward once the DNS propagated and the IP whitelist was configured correctly. The true benefit is not having to manage the database server infrastructure yourself.',
    'It took some tweaking, but transitioning from local multer disk storage to Cloudinary was worth it. Not having to worry about blowing up my server hard drive capacity gives me tremendous peace of mind.'
];

const seedDatabase = async () => {
    try {
        console.log("Connecting to Production Database...");
        await mongoose.connect('mongodb+srv://nsaisiddharth05_db_user:FKsGKpTAbZrm23wT@blog.pb9xu8w.mongodb.net/?retryWrites=true&w=majority&appName=blog');
        console.log("Connected.");

        console.log("Emptying old mock posts if any exist...");
        await Post.deleteMany({});

        // Ensure there is at least one 'Mock Admin' user so the posts have a valid Author object structure
        let seedUser = await User.findOne({ email: 'seed@bloghub.com' });
        if (!seedUser) {
            seedUser = await new User({
                name: 'System Admin', email: 'seed@bloghub.com', phone: '9999999999', password: 'mockpassword'
            }).save();
        }

        console.log("Generating 50 random Posts...");
        for (let i = 0; i < 50; i++) {
            const randomName = INDIAN_NAMES[Math.floor(Math.random() * INDIAN_NAMES.length)];
            const randomTitle = TECH_TITLES[Math.floor(Math.random() * TECH_TITLES.length)];
            const randomContent = CONTENT[Math.floor(Math.random() * CONTENT.length)];

            await new Post({
                title: randomTitle,
                content: randomContent,
                author: {
                    _id: seedUser._id,
                    name: randomName, // Fake the name on display
                    email: seedUser.email,
                    profilePic: null
                }
            }).save();
        }

        console.log("✅ Successfully injected 50 posts into MongoDB!");
        process.exit(0);

    } catch (error) {
        console.error("Injection failed:", error);
        process.exit(1);
    }
};

seedDatabase();
