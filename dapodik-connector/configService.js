
const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "data");
const CONFIG_FILE = path.join(DATA_DIR, "dapodik-config.json");

// Token hanya disimpan di memori proses.
// Token tidak ditulis ke file konfigurasi.
let dapodikToken = null;

const defaultConfig = {
  appName: "ONESAY",
  ipAddress: "localhost",
  dapodikBaseUrl: "http://localhost:5774"
};

function ensureStorage() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function getConfig() {
  ensureStorage();

  if (!fs.existsSync(CONFIG_FILE)) {
    return { ...defaultConfig };
  }

  try {
    const saved = JSON.parse(
      fs.readFileSync(CONFIG_FILE, "utf8")
    );

    return {
      ...defaultConfig,
      ...saved
    };
  } catch (error) {
    throw new Error("File konfigurasi Dapodik tidak dapat dibaca.");
  }
}

function saveConfig({ appName, ipAddress, token }) {
  if (!appName || !appName.trim()) {
    throw new Error("Nama Aplikasi wajib diisi.");
  }

  if (!ipAddress || !ipAddress.trim()) {
    throw new Error("IP Address wajib diisi.");
  }

  if (!token || !token.trim()) {
    throw new Error("Key Dapodik wajib diisi.");
  }

  const config = {
    appName: appName.trim(),
    ipAddress: ipAddress.trim(),
    dapodikBaseUrl: "http://localhost:5774",
    updatedAt: new Date().toISOString()
  };

  ensureStorage();

  fs.writeFileSync(
    CONFIG_FILE,
    JSON.stringify(config, null, 2),
    { encoding: "utf8", mode: 0o600 }
  );

  dapodikToken = token.trim();

  return {
    ...config,
    tokenConfigured: true
  };
}

function hasToken() {
  return Boolean(dapodikToken);
}

function getTokenForInternalUse() {
  return dapodikToken;
}

function clearToken() {
  dapodikToken = null;
}

module.exports = {
  getConfig,
  saveConfig,
  hasToken,
  getTokenForInternalUse,
  clearToken
};
