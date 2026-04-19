import express from "express";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import axios from "axios";
import path from "path";
import Parser from "rss-parser";
import fs from "fs";
import archiver from "archiver";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Download Source Code
  app.get("/api/download-source", (req, res) => {
    res.attachment("lexverma-complete.zip");
    const archive = archiver("zip", { zlib: { level: 9 } });
    
    archive.on("error", (err) => {
      res.status(500).send({ error: err.message });
    });

    archive.pipe(res);
    
    // Add all necessary project files
    archive.glob("**/*", {
      cwd: process.cwd(),
      ignore: ["node_modules/**", "dist/**", ".next/**", "*.zip"]
    });
    
    archive.finalize();
  });

  // Google reCAPTCHA Verification
  app.post("/api/verify-recaptcha", async (req, res) => {
    const { token } = req.body;
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    if (!secretKey) {
      return res.status(500).json({ success: false, error: "reCAPTCHA secret key is missing server-side" });
    }

    try {
      const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`);
      if (response.data.success) {
        res.json({ success: true, score: response.data.score });
      } else {
        res.json({ success: false, error: "reCAPTCHA verification failed" });
      }
    } catch (error) {
      res.status(500).json({ success: false, error: "Error verifying reCAPTCHA" });
    }
  });

  // Google Places Reviews API
  app.get("/api/reviews", async (req, res) => {
    const placeId = process.env.VITE_GOOGLE_MAPS_PLACE_ID;
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;

    if (!placeId || !apiKey) {
      return res.status(500).json({ success: false, error: "Google Places API configuration missing" });
    }

    try {
      const response = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json`, {
        params: {
          place_id: placeId,
          fields: "reviews,rating,user_ratings_total",
          key: apiKey,
        },
      });
      res.json({ success: true, data: response.data.result });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch reviews" });
    }
  });

  // Legal News Feed (Using RSS Parser to bypass CORS from client)
  app.get("/api/legal-news", async (req, res) => {
    try {
      const parser = new Parser();
      // Using a sample standard legal/news RSS feed (Google News search for Legal updates India as fallback)
      const feedUrl = "https://news.google.com/rss/search?q=Law+High+Court+Supreme+Court+India&hl=en-IN&gl=IN&ceid=IN:en";
      const feed = await parser.parseURL(feedUrl);
      res.json({ success: true, items: feed.items.slice(0, 5) });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch legal news" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
