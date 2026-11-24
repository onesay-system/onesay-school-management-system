
require("dotenv").config();

const express = require("express");
const os = require("os");

const {
  getConfig,
  saveConfig,
  hasToken,
  getTokenForInternalUse,
} = require("./configService");

const app = express();

const HOST = "127.0.0.1";
const PORT = Number(process.env.PORT || 3001);

const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "http://127.0.0.1:5175"
];

app.disable("x-powered-by");
app.use(express.json({ limit: "20kb" }));

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    return res.status(403).json({
      success: false,
      message: "Asal permintaan tidak diizinkan."
    });
  }

  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type"
    );
  }

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

// Status Connector
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    service: "ONESAY Dapodik Connector",
    status: "running",
    host: HOST,
    port: PORT,
    nodeVersion: process.version,
    platform: os.platform(),
    timestamp: new Date().toISOString()
  });
});

// Membaca konfigurasi tanpa pernah mengirim token
app.get("/api/dapodik/config", (req, res) => {
  try {
    const config = getConfig();

    res.json({
      success: true,
      config: {
        appName: config.appName,
        ipAddress: config.ipAddress,
        dapodikBaseUrl: config.dapodikBaseUrl,
        tokenConfigured: hasToken(),
        updatedAt: config.updatedAt || null
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Menyimpan konfigurasi Web Service
app.post("/api/dapodik/config", (req, res) => {
  try {
    const { appName, ipAddress, token } = req.body;

    const result = saveConfig({
      appName,
      ipAddress,
      token
    });

    res.json({
      success: true,
      message: "Konfigurasi Dapodik berhasil disimpan.",
      config: {
        appName: result.appName,
        ipAddress: result.ipAddress,
        dapodikBaseUrl: result.dapodikBaseUrl,
        tokenConfigured: true,
        updatedAt: result.updatedAt
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * Tes autentikasi ke Web Service Dapodik.
 * NPSN dikirim dari Profil Sekolah ONESAY.
 * Token hanya digunakan di sisi Connector.
 */
app.post("/api/dapodik/test", async (req, res) => {
  try {
    const { npsn } = req.body || {};

    if (!/^\d{8}$/.test(String(npsn || ""))) {
      return res.status(400).json({
        success: false,
        message: "NPSN tidak valid. Periksa Profil Sekolah ONESAY.",
      });
    }

    if (!hasToken()) {
      return res.status(400).json({
        success: false,
        message: "Key Dapodik belum tersimpan pada Connector.",
      });
    }

    const token = getTokenForInternalUse();

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Key Dapodik tidak tersedia. Silakan simpan ulang konfigurasi.",
      });
    }

    const dapodikUrl =
      `http://localhost:5774/WebService/getSekolah?npsn=${encodeURIComponent(npsn)}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    let dapodikResponse;

    try {
      dapodikResponse = await fetch(dapodikUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
        },
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }

    const responseText = await dapodikResponse.text();

    let dapodikData;

    try {
      dapodikData = JSON.parse(responseText);
    } catch {
      return res.status(502).json({
        success: false,
        message:
          "Dapodik merespons, tetapi format data bukan JSON yang dikenali.",
        httpStatus: dapodikResponse.status,
      });
    }

    if (!dapodikResponse.ok) {
      return res.status(502).json({
        success: false,
        message: "Web Service Dapodik menolak atau gagal memproses permintaan.",
        httpStatus: dapodikResponse.status,
      });
    }

    // Menangani format respons yang memiliki penanda error.
    if (
      dapodikData &&
      typeof dapodikData === "object" &&
      (dapodikData.success === false || dapodikData.error)
    ) {
      return res.status(502).json({
        success: false,
        message: "Dapodik mengembalikan pesan kesalahan.",
        httpStatus: dapodikResponse.status,
      });
    }

    return res.json({
      success: true,
      authenticated: true,
      service: "Dapodik Web Service",
      endpoint: "getSekolah",
      message: "Autentikasi Web Service Dapodik berhasil.",
      httpStatus: dapodikResponse.status,
      testedAt: new Date().toISOString(),
    });
  } catch (error) {
    const isTimeout = error.name === "AbortError";

    return res.status(502).json({
      success: false,
      message: isTimeout
        ? "Koneksi ke Dapodik melewati batas waktu 12 detik."
        : "Connector gagal menghubungi Web Service Dapodik.",
      detail: isTimeout ? "DAPODIK_TIMEOUT" : "DAPODIK_CONNECTION_ERROR",
    });
  }
});

// Status integrasi
app.get("/api/dapodik/status", (req, res) => {
  try {
    const config = getConfig();

    res.json({
      success: true,
      configured: Boolean(config.appName && config.ipAddress),
      tokenConfigured: hasToken(),
      connected: false,
      message: hasToken()
        ? "Konfigurasi tersedia. Koneksi Dapodik belum diuji."
        : "Key Dapodik belum dimasukkan."
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "ONESAY Dapodik Connector API aktif."
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint tidak ditemukan."
  });
});

app.use((err, req, res, next) => {
  console.error("Connector error:", err.message);

  res.status(500).json({
    success: false,
    message: "Terjadi kesalahan pada Dapodik Connector."
  });
});

app.listen(PORT, HOST, () => {
  console.log("------------------------------------------");
  console.log(" ONESAY DAPODIK CONNECTOR");
  console.log("------------------------------------------");
  console.log(` Server : http://${HOST}:${PORT}`);
  console.log(" Status : RUNNING");
  console.log("------------------------------------------");
});
