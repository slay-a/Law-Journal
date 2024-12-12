const express = require("express");
const router = express.Router();
const multer = require("multer");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

// Ensure the 'files' directory exists
const filesPath = path.join(__dirname, 'files');
if (!fs.existsSync(filesPath)) {
  fs.mkdirSync(filesPath, { recursive: true });
}
router.use('/files', express.static(filesPath));

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, filesPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});
const upload = multer({ storage: storage });

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

// Route to upload files
router.post("/upload-files", authenticateToken, upload.single("file"), async (req, res) => {
  try {
    console.log("File uploaded:", req.file);
    const title = req.body.title;
    const fileName = req.file.filename;
    const db = router.locals.db; // Get Knex instance

    await db('PdfDetails').insert({
      title: title,
      pdf: fileName,
      user_id: req.user_id
    });

    res.json({ status: "ok", message: "File uploaded successfully" });
  } catch (error) {
    console.error("Error inserting file into database:", error);
    res.status(500).json({ status: "error", message: "Failed to upload file" });
  }
});

// Route to retrieve all files
router.get("/get-files", authenticateToken, async (req, res) => {
  try {
    const db = router.locals.db; // Get Knex instance
    const files = await db('PdfDetails')
      .select('*')
      .where({ user_id: req.user_id });

    res.json({ status: "ok", data: files });
  } catch (error) {
    console.error("Error retrieving files from database:", error);
    res.status(500).json({ status: "error", message: "Failed to retrieve files" });
  }
});

// Route to check server status
router.get("/", (req, res) => {
  res.send("Success!!!!!!");
});

module.exports = {
  path: '/lawjournal',
  router,
};

// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const mysql = require("mysql2");
// const dotenv = require('dotenv');
// const fs = require('fs');
// const path = require('path');
// router.use('/files', express.static(path.join(__dirname, 'files')));
// const jwt = require('jsonwebtoken');

// // Authentication middleware
// const authenticateToken = async (req, res, next) => {
//   try {
//     const token = req.cookies.jwt_token || req.headers['authorization']?.split(' ')[1];
//     if (!token) return res.status(401).json({ success: false, message: 'No token provided' });

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.session_id = decoded.session_id;
//     next();
//   } catch (err) {
//     console.error('Authentication error:', err);
//     return res.status(500).json({ success: false, message: 'Error during authentication' });
//   }
// };
// // MySQL connection setup
// const db = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     port: process.env.DB_PORT,
// });

// db.connect((err) => {
//   if (err) {
//     console.error("Error connecting to MySQL database:", err);
//     return;
//   }
//   console.log("Connected to MySQL database");
// });
// // Ensure the 'files' directory exists
// const filesPath = path.join(__dirname, 'files');
// if (!fs.existsSync(filesPath)) {
//   fs.mkdirSync(filesPath, { recursive: true });
// }
// // Set up multer for file uploads
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       const filesPath = path.join(__dirname, 'files');
//       cb(null, filesPath);
//     },
//     filename: function (req, file, cb) {
//       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//       cb(null, uniqueSuffix + '-' + file.originalname);
//     },
//   });
  
// // const storage = multer.diskStorage({
// //   destination: function (req, file, cb) {
// //     cb(null, "filesPath");
// //   },
// //   filename: function (req, file, cb) {
// //     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
// //     cb(null, uniqueSuffix + '-' + file.originalname);
// //   },
// // });

// const upload = multer({ storage: storage });

// // Route to upload files
// router.post("/upload-files", upload.single("file"), (req, res) => {
//   console.log("File uploaded:", req.file);
//   const title = req.body.title;
//   const fileName = req.file.filename;

//   const query = "INSERT INTO PdfDetails (title, pdf) VALUES (?, ?)";
//   const values = [title, fileName];

//   db.query(query, values, (error, results) => {
//     if (error) {
//       console.error("Error inserting file into database:", error);
//       res.status(500).json({ status: "error", message: "Failed to upload file" });
//     } else {
//       res.json({ status: "ok", message: "File uploaded successfully" });
//     }
//   });
// });

// // Route to retrieve all files
// router.get("/get-files", (req, res) => {
//   const query = "SELECT * FROM PdfDetails";
  
//   db.query(query, (error, results) => {
//     if (error) {
//       console.error("Error retrieving files from database:", error);
//       res.status(500).json({ status: "error", message: "Failed to retrieve files" });
//     } else {
//       res.json({ status: "ok", data: results });
//     }
//   });
// });

// // Route to check server status
// router.get("/", (req, res) => {
//   res.send("Success!!!!!!");
// });


// module.exports = {
//   path: '/lawjournal',
//   router,
// };