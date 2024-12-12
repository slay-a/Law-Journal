const express = require("express");
const router = express.Router();
const multer = require("multer");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

// Ensure the 'images' directory exists
const imagesPath = path.join(__dirname, 'images');
if (!fs.existsSync(imagesPath)) {
  fs.mkdirSync(imagesPath, { recursive: true });
}
router.use('/images', express.static(imagesPath));

// Set up multer for image uploads with file type validation
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imagesPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'));
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter 
});

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  try {
    const token = req.cookies.jwt_token || req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.session_id = decoded.session_id;

    const db = router.locals.db; // Get Knex instance
    const user = await db('Users')
      .select('user_id')
      .where({ session_id: req.session_id })
      .first();
    
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid session ID' });
    }

    req.user_id = user.user_id; // Attach the user_id to the request object
    next();
  } catch (err) {
    console.error('Authentication error:', err);
    return res.status(500).json({ success: false, message: 'Error during authentication' });
  }
};

router.post("/upload-image", authenticateToken, upload.single("image"), async (req, res) => {
    try {
      console.log("Image uploaded:", req.file);
      const title = req.body.title || 'Profile Image';
      const imageName = req.file.filename;
      const db = router.locals.db; // Get Knex instance
  
      // 🔥 Check if the user already has an existing image
      const existingImage = await db('ImagesDetails')
        .select('image')
        .where({ user_id: req.user_id })
        .first();
  
      if (existingImage) {
        // 🔥 Delete the existing image file from the filesystem
        const existingImagePath = path.join(imagesPath, existingImage.image);
        if (fs.existsSync(existingImagePath)) {
          fs.unlinkSync(existingImagePath);
          console.log(`Deleted existing image: ${existingImagePath}`);
        }
  
        // 🔥 Delete the old image entry from the database
        await db('ImagesDetails')
          .where({ user_id: req.user_id })
          .del();
        console.log('Deleted existing image record from database');
      }
  
      // 🔥 Insert new image into the database
      await db('ImagesDetails').insert({
        title: title,
        image: imageName,
        user_id: req.user_id
      });
  
      res.json({ 
        status: "ok", 
        message: "Image uploaded successfully", 
        data: { image: imageName }
      });
  
    } catch (error) {
      console.error("Error inserting image into database:", error);
      res.status(500).json({ status: "error", message: "Failed to upload image" });
    }
  });

// Route to retrieve all images
router.get("/get-images", authenticateToken, async (req, res) => {
  try {
    const db = router.locals.db; // Get Knex instance
    const images = await db('ImagesDetails')
      .select('*')
      .where({ user_id: req.user_id });

    res.json({ status: "ok", data: images });
  } catch (error) {
    console.error("Error retrieving images from database:", error);
    res.status(500).json({ status: "error", message: "Failed to retrieve images" });
  }
});

// Route to check server status
router.get("/", (req, res) => {
  res.send("Image Upload API is Working Successfully!");
});

module.exports = {
  path: '/images',
  router,
};