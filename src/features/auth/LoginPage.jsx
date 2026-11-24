import { useState } from "react";
import { loginUser } from "../../services/authService";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import "./login.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await loginUser(email.trim(), password);
      // Status autentikasi akan ditangani oleh AuthGate.
    } catch (err) {
      console.error("Login error:", err);

      const errorMessages = {
        "auth/invalid-credential": "Email atau password tidak sesuai.",
        "auth/user-not-found": "Akun pengguna tidak ditemukan.",
        "auth/wrong-password": "Password yang dimasukkan salah.",
        "auth/too-many-requests":
          "Terlalu banyak percobaan. Silakan coba kembali nanti.",
        "auth/network-request-failed":
          "Koneksi internet bermasalah. Periksa jaringan Anda.",
        "auth/invalid-email": "Format email tidak valid.",
        "auth/user-disabled": "Akun ini telah dinonaktifkan.",
      };

      setError(
        errorMessages[err.code] ||
          "Login gagal. Periksa kembali data akun Anda."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-background">
        <div className="login-orb login-orb-one" />
        <div className="login-orb login-orb-two" />
        <div className="login-grid" />
      </div>

      <section className="login-container">
        <div className="login-brand">
          <img
            src={`${import.meta.env.BASE_URL}assets/images/logo-onesay.png`}
            alt="Logo ONESAY"
          />

          <div>
            <strong>ONESAY</strong>
            <span>SCHOOL MANAGEMENT SYSTEM</span>
          </div>
        </div>

        <div className="login-card">
          <div className="login-icon">
            <ShieldCheck size={30} />
          </div>

          <div className="login-heading">
            <span>SECURE ACCESS PORTAL</span>
            <h1>Selamat Datang</h1>
            <p>
              Masuk menggunakan akun resmi untuk mengakses
              sistem manajemen sekolah ONESAY.
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <label htmlFor="login-email">Alamat Email</label>

            <div className="login-input-wrap">
              <Mail size={19} />
              <input
                id="login-email"
                type="email"
                placeholder="nama@sekolah.id"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="username"
                required
              />
            </div>

            <label htmlFor="login-password">Password</label>

            <div className="login-input-wrap">
              <LockKeyhole size={19} />
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className="login-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={
                  showPassword ? "Sembunyikan password" : "Tampilkan password"
                }
              >
                {showPassword ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>
            </div>

            {error && (
              <div className="login-error" role="alert">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              {loading ? "Memverifikasi akun..." : "Masuk ke Portal"}
              {!loading && <ArrowRight size={19} />}
            </button>
          </form>

          <div className="login-security">
            <ShieldCheck size={15} />
            <span>Akses terlindungi oleh Firebase Authentication</span>
          </div>
        </div>

        <footer className="login-footer">
          <strong>ONESAY</strong> · School Management System
          <span>SMP Negeri 1 Sayan</span>
        </footer>
      </section>
    </main>
  );
}

export default LoginPage;