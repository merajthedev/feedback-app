require("dotenv").config();

const express = require("express");
const path = require("path");
const { Pool } = require("pg");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// 🔵 PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Test connection + create table
pool.query(`
  CREATE TABLE IF NOT EXISTS feedback (
    id SERIAL PRIMARY KEY,
    name TEXT,
    message TEXT
  )
`)
.then(() => console.log("✅ PostgreSQL Connected"))
.catch(err => console.error("❌ DB Error:", err));


// 🔵 POST API
app.post("/api/feedback", async (req, res) => {
  console.log("📥 Incoming:", req.body);

  const { name, message } = req.body;

  if (!name || !message) {
    return res.status(400).json({ error: "All fields required" });
  }

  try {
    await pool.query(
      "INSERT INTO feedback (name, message) VALUES ($1, $2)",
      [name, message]
    );

    res.json({ success: true });

  } catch (err) {
    console.error("❌ DB ERROR:", err);
    res.status(500).json({ error: "Database error" });
  }
});


// 🔵 GET API
app.get("/api/feedback", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM feedback ORDER BY id DESC"
    );

    res.json(result.rows);

  } catch (err) {
    console.error("❌ DB ERROR:", err);
    res.status(500).json({ error: "Database error" });
  }
});


// 🔵 fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});


// 🔵 start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});