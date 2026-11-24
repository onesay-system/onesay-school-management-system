
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { getIdTokenResult } from "firebase/auth";

import LoginPage from "./LoginPage";
import {
  observeAuthState,
  logoutUser,
} from "../../services/authService";
import { getRecord } from "../../services/firestoreService";

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

function AuthGate({ children }) {
  const [authState, setAuthState] = useState({
    loading: true,
    user: null,
    profile: null,
    claims: null,
    error: "",
  });

  const [loggingOut, setLoggingOut] = useState(false);

  const rejectAccess = useCallback(async (message) => {
    setAuthState({
      loading: false,
      user: null,
      profile: null,
      claims: null,
      error: message,
    });

    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, []);

  useEffect(() => {
    let active = true;

    const unsubscribe = observeAuthState(async (user) => {
      if (!active) return;

      if (!user) {
        setAuthState({
          loading: false,
          user: null,
          profile: null,
          claims: null,
          error: "",
        });
        return;
      }

      setAuthState((previous) => ({
        ...previous,
        loading: true,
        error: "",
      }));

      try {
        // 1. Ambil Custom Claims terbaru dari Firebase.
        const tokenResult = await getIdTokenResult(user, true);
        const claims = tokenResult.claims;

        // 2. Periksa role dan modul dari Custom Claims.
        const role = claims.role;
        const modules = claims.modules;

        if (
          typeof role !== "string" ||
          !modules ||
          typeof modules !== "object"
        ) {
          throw new Error("Hak akses akun belum dikonfigurasi.");
        }

        // 3. Ambil profil pengguna berdasarkan UID.
        const profile = await getRecord("pengguna", user.uid);

        if (!profile) {
          throw new Error("Profil pengguna tidak ditemukan.");
        }

        // 4. Periksa status akun.
        if (profile.status !== "aktif") {
          throw new Error("Akun tidak aktif. Hubungi Admin Induk.");
        }

        // 5. Pastikan role Firestore sama dengan Custom Claims.
        if (profile.role !== role) {
          throw new Error("Konfigurasi role akun tidak sesuai.");
        }

        // 6. Pastikan modul pada profil sama dengan Custom Claims.
        const profileModules = profile.modules || {};
        const moduleKeys = [
          "gtk",
          "sarpras",
          "kurikulum",
          "peserta_didik",
        ];

        const modulesMatch = moduleKeys.every(
          (key) =>
            Boolean(profileModules[key]) === Boolean(modules[key])
        );

        if (!modulesMatch) {
          throw new Error("Konfigurasi hak akses modul tidak sesuai.");
        }

        if (!active) return;

        setAuthState({
          loading: false,
          user,
          profile,
          claims,
          error: "",
        });
      } catch (error) {
        console.error("AuthGate verification error:", error);

        if (!active) return;

        await rejectAccess(
          error.message || "Akses akun tidak dapat diverifikasi."
        );
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [rejectAccess]);

  const handleLogout = async () => {
    setLoggingOut(true);

    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout error:", error);
      setLoggingOut(false);
    }
  };

  // Tampilan pemeriksaan autentikasi.
  if (authState.loading) {
    return (
      <div style={screenStyle}>
        <div style={loadingStyle}>
          <div style={spinnerStyle} />
          <strong>ONESAY</strong>
          <span>Memverifikasi keamanan akun...</span>
        </div>
      </div>
    );
  }

  // Pengguna belum login.
  if (!authState.user) {
    return <LoginPage />;
  }

  // Akun gagal melewati pemeriksaan.
  if (authState.error) {
    return (
      <div style={screenStyle}>
        <div style={blockedStyle}>
          <h2>Akses Ditolak</h2>
          <p>{authState.error}</p>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            style={buttonStyle}
          >
            {loggingOut ? "Memproses..." : "Kembali ke Halaman Login"}
          </button>
        </div>
      </div>
    );
  }

  // Pengguna berhasil diverifikasi.
  return (
    <AuthContext.Provider
      value={{
        user: authState.user,
        profile: authState.profile,
        claims: authState.claims,
        role: authState.claims?.role,
        modules: authState.claims?.modules || {},
        logout: logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

const screenStyle = {
  minHeight: "100vh",
  display: "grid",
  placeItems: "center",
  background: "#071326",
  color: "#fff",
  fontFamily: "Inter, sans-serif",
  padding: "24px",
};

const loadingStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "14px",
};

const spinnerStyle = {
  width: "38px",
  height: "38px",
  border: "3px solid rgba(255,255,255,.2)",
  borderTopColor: "#60a5fa",
  borderRadius: "50%",
  animation: "onesay-spin 0.8s linear infinite",
};

const blockedStyle = {
  maxWidth: "420px",
  padding: "32px",
  textAlign: "center",
  background: "#14233b",
  border: "1px solid rgba(255,255,255,.15)",
  borderRadius: "18px",
};

const buttonStyle = {
  padding: "12px 20px",
  border: "none",
  borderRadius: "9px",
  background: "#2563eb",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
};

export default AuthGate;
