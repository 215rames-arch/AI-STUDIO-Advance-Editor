import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Configure Multer for file uploads
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      // In this environment, we'll store in public/uploads
      cb(null, path.join(process.cwd(), "public/uploads/"));
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    },
  });

  const upload = multer({ storage: storage });

  app.use(express.json());

  // API Routes
  app.post("/api/upload", upload.single("file"), (req: any, res: any) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    res.json({
      message: "File uploaded successfully",
      file: {
        name: req.file.filename,
        path: `/uploads/${req.file.filename}`,
        mimetype: req.file.mimetype,
        size: req.file.size,
      },
    });
  });

  app.post("/api/analyze", async (req, res) => {
    const { name, type } = req.body;
    try {
      const model = (genAI as any).getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `
        You are the Core Intelligence of a Professional AI Video Editing Studio.
        The user has uploaded a ${type} file named "${name}".
        
        ### Task:
        Generate a "Cinematic Project Plan" with focus on Trending Edit Styles:
        1. VIDEO WALLPAPER CHANGE: Identify if the subject can be masked for background replacement. Suggest specific cinematic wallpapers (Cyberpunk, Abstract, Nature).
        2. LOGO & BRANDING: If this is a logo or image, suggest "AI Logo Animation" paths (Reveal, Particle Dissolve, Glitch). Design a brand identity palette.
        3. SMART CUTS: Logic for removal of silence or redundant frames.
        4. 3D STUDIO: Recommend 3D assets (overlaid characters, particles) that match the background choice.
        5. AUDIO: AI Voiceover, Music ducking, and Beat-sync logic.

        ### REQUIRED OUTPUT FORMAT (Markdown):
        # 🎬 Project Plan: ${name}
        
        ## 🖼️ Background & Visuals
        - Recommended Wallpaper/Greenscreen replacement.
        - Cinematic Color Grading (Vibrant, Moody, Noir).
        
        ## 🏷️ Brand & Logo Studio
        - AI Logo Animation style (Reveal/Glitch/3D).
        - Recommended Brand Palette & Typography.
        
        ## 3️⃣ 3D Asset Integration
        - Suggested 3D overlays from the library.
        
        ## 🎵 Audio Workspace
        - Music mood & Ducking strategy.
        
        ## ✂️ SMART Timeline
        - Logic for automated clips distribution.

        Keep it professional and trending.
      `;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      res.json({ plan: response.text() });
    } catch (error) {
      console.error("Gemini analysis failed:", error);
      res.status(500).json({ error: "Intelligence service unavailable." });
    }
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Serve uploaded files
  app.use("/uploads", express.static(path.join(process.cwd(), "public/uploads")));

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: any, res: any) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
