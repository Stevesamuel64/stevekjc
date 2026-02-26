const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = 3000;

// ===== MONGODB CONNECTION =====
mongoose.connect("mongodb+srv://stevesamuel64:steve2007@cluster0.8vtx5os.mongodb.net/?appName=Cluster0")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static("public"));

// Basic route
app.get("/api", (req, res) => {
    res.json({ message: "Backend is working 🚀" });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});