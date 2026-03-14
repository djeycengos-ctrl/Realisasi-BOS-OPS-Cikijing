import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("bos_ops.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    tanggal TEXT,
    kegiatan TEXT,
    rekening TEXT,
    nobukti TEXT,
    uraian TEXT,
    terima REAL DEFAULT 0,
    keluar REAL DEFAULT 0,
    transaksi TEXT
  );

  CREATE TABLE IF NOT EXISTS profile (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    nama TEXT,
    npsn TEXT,
    kepsek TEXT,
    nipKepsek TEXT,
    bendahara TEXT,
    nipBendahara TEXT,
    password TEXT
  );
`);

// Seed default profile if empty
const profileCount = db.prepare("SELECT COUNT(*) as count FROM profile").get() as { count: number };
if (profileCount.count === 0) {
  db.prepare(`
    INSERT INTO profile (id, nama, npsn, kepsek, nipKepsek, bendahara, nipBendahara, password)
    VALUES (1, 'SDN Cikijing', '12345678', 'Nama Kepsek', '1980...', 'Nama Bendahara', '1985...', '1234')
  `).run();
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // --- API Routes ---

  // Auth
  app.post("/api/login", (req, res) => {
    const { password } = req.body;
    const profile = db.prepare("SELECT password FROM profile WHERE id = 1").get() as { password: string };
    if (profile.password === password) {
      res.json({ success: true });
    } else {
      res.status(401).json({ success: false, message: "Password salah!" });
    }
  });

  // Transactions
  app.get("/api/data", (req, res) => {
    const data = db.prepare("SELECT * FROM transactions ORDER BY tanggal DESC").all();
    res.json(data);
  });

  app.post("/api/data", (req, res) => {
    const item = req.body;
    const id = item.id || Math.random().toString(36).substring(2, 11);
    
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO transactions (id, tanggal, kegiatan, rekening, nobukti, uraian, terima, keluar, transaksi)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      id,
      item.tanggal,
      item.kegiatan,
      item.rekening,
      item.nobukti,
      item.uraian,
      Number(item.terima) || 0,
      Number(item.keluar) || 0,
      item.transaksi
    );
    
    res.json({ success: true, id });
  });

  app.post("/api/data/batch", (req, res) => {
    const { items } = req.body;
    const insert = db.prepare(`
      INSERT OR REPLACE INTO transactions (id, tanggal, kegiatan, rekening, nobukti, uraian, terima, keluar, transaksi)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const transaction = db.transaction((items) => {
      for (const item of items) {
        const id = item.id || Math.random().toString(36).substring(2, 11);
        insert.run(
          id,
          item.tanggal,
          item.kegiatan,
          item.rekening,
          item.nobukti,
          item.uraian,
          Number(item.terima) || 0,
          Number(item.keluar) || 0,
          item.transaksi
        );
      }
    });

    transaction(items);
    res.json({ success: true, count: items.length });
  });

  app.delete("/api/data/:id", (req, res) => {
    const { id } = req.params;
    db.prepare("DELETE FROM transactions WHERE id = ?").run(id);
    res.json({ success: true });
  });

  // Profile
  app.get("/api/profile", (req, res) => {
    const profile = db.prepare("SELECT * FROM profile WHERE id = 1").get();
    res.json(profile);
  });

  app.post("/api/profile", (req, res) => {
    const p = req.body;
    db.prepare(`
      UPDATE profile SET 
        nama = ?, npsn = ?, kepsek = ?, nipKepsek = ?, bendahara = ?, nipBendahara = ?, password = ?
      WHERE id = 1
    `).run(p.nama, p.npsn, p.kepsek, p.nipKepsek, p.bendahara, p.nipBendahara, p.password);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
