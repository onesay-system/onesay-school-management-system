import GtkModule from "./features/gtk/GtkModule";
import { useState } from "react";
import { useAuth } from "./features/auth/AuthGate";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Bell,
  BookOpen,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  CircleHelp,
  Database,
  Eye,
  EyeOff,
  GraduationCap,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  MoreVertical,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Users,
  X,
  ChartNoAxesColumn,
  UserRound,
  Wifi,
  Clock3,
  Layers3,
} from "lucide-react";

const ROLE_LABELS = {
  admin_induk: "Administrator Induk",
  admin_gtk: "Administrator GTK",
  waka_sarpras: "Wakil Kepala Sekolah Bidang Sarpras",
  waka_kurikulum: "Wakil Kepala Sekolah Bidang Kurikulum",
  waka_kesiswaan: "Wakil Kepala Sekolah Bidang Kesiswaan",
  viewer: "Pengguna Viewer",
};

const MODULE_PERMISSIONS = {
  gtk: ["admin_induk", "admin_gtk"],
  sarpras: ["admin_induk", "waka_sarpras"],
  kurikulum: ["admin_induk", "waka_kurikulum"],
  "peserta-didik": ["admin_induk", "waka_kesiswaan"],
};

const modules = [
  {
    id: "gtk",
    title: "Sistem GTK",
    description: "Guru dan Tenaga Kependidikan",
    role: "Administrator GTK",
    icon: Users,
    color: "blue",
    symbol: "GTK",
  },
  {
    id: "sarpras",
    title: "Sistem Sarpras",
    description: "Sarana dan Prasarana Sekolah",
    role: "Waka Sarpras",
    icon: Building2,
    color: "teal",
    symbol: "SARPRAS",
  },
  {
    id: "kurikulum",
    title: "Sistem Kurikulum",
    description: "Akademik dan Pembelajaran",
    role: "Waka Kurikulum",
    icon: BookOpen,
    color: "purple",
    symbol: "KURIKULUM",
  },
  {
    id: "peserta-didik",
    title: "Sistem Peserta Didik",
    description: "Data dan Administrasi Peserta Didik",
    role: "Waka Kesiswaan",
    icon: GraduationCap,
    color: "orange",
    symbol: "PESERTA DIDIK",
  },
];

const activities = [
  {
    title: "Portal diakses oleh Admin Induk",
    time: "2 menit yang lalu",
    icon: Check,
    color: "success",
  },
  {
    title: "Sinkronisasi data GTK selesai",
    time: "15 menit yang lalu",
    icon: RefreshCw,
    color: "blue",
  },
  {
    title: "Pembaruan data Kurikulum",
    time: "1 jam yang lalu",
    icon: BookOpen,
    color: "purple",
  },
  {
    title: "Data Peserta Didik diperbarui",
    time: "2 jam yang lalu",
    icon: Users,
    color: "orange",
  },
];

const navigation = [
  { id: "portal", label: "Portal", icon: Home },
  { id: "gtk", label: "GTK", icon: Users },
  { id: "sarpras", label: "Sarpras", icon: Building2 },
  { id: "kurikulum", label: "Kurikulum", icon: BookOpen },
  { id: "peserta-didik", label: "Peserta Didik", icon: GraduationCap },
  { id: "laporan", label: "Laporan", icon: ChartNoAxesColumn },
  { id: "pengaturan", label: "Pengaturan", icon: Settings },
];

function App() {
  const { user, profile, claims, logout } = useAuth();

  const role = claims?.role;
  const modulesAccess = claims?.modules || {};

  const [activeMenu, setActiveMenu] = useState("portal");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showActivityMenu, setShowActivityMenu] = useState(false);
  const [notice, setNotice] = useState("");

  const canAccessModule = (moduleId) => {
    if (role === "admin_induk") return true;

    const allowedRoles = MODULE_PERMISSIONS[moduleId] || [];

    const roleAllowed = allowedRoles.includes(role);
    const moduleGranted = modulesAccess[moduleId === "peserta-didik"
      ? "peserta_didik"
      : moduleId];

    return roleAllowed && moduleGranted === true;
  };

  const visibleModules = modules.filter((module) =>
    canAccessModule(module.id)
  );

  const visibleNavigation = navigation.filter((item) => {
    if (["portal", "laporan", "pengaturan"].includes(item.id)) {
      return role === "admin_induk";
    }

    return canAccessModule(item.id);
  });

  const displayName = profile?.nama || user?.email || "Pengguna";
  const displayRole = ROLE_LABELS[role] || "Pengguna";

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout gagal:", error);
      setNotice("Gagal keluar dari sistem. Silakan coba kembali.");
    }
  };

  const openModule = (id, label) => {
    if (id === "portal") {
      setActiveMenu("portal");
      setNotice("");
      return;
    }

    if (MODULE_PERMISSIONS[id]) {
      if (!canAccessModule(id)) {
        setNotice("Anda tidak memiliki izin untuk mengakses modul ini.");
        return;
      }

      setActiveMenu(id);
      setNotice("");
      return;
    }

    if (id === "laporan" || id === "pengaturan") {
      if (role !== "admin_induk") {
        setNotice("Anda tidak memiliki izin untuk mengakses halaman ini.");
        return;
      }
    }

    setActiveMenu(id);
    setNotice(`Halaman ${label} akan tersedia pada tahap pengembangan berikutnya.`);
  };

  const handleSearch = () => {
    setNotice("Fitur pencarian global akan dihubungkan dengan data ONESAY.");
  };

  return (
    <div className="onesay-app">
      <header className="topbar">
        <a
          href="#portal"
          className="brand"
          onClick={(event) => {
            event.preventDefault();
            openModule("portal", "Portal");
          }}
        >
          <div className="brand-mark">
            <img
              src={`${import.meta.env.BASE_URL}assets/images/logo-onesay.png`}
              alt="Logo ONESAY"
            />
          </div>
          <div className="brand-copy">
            <strong>ONESAY</strong>
            <span>SCHOOL MANAGEMENT SYSTEM</span>
          </div>
        </a>

        <button
          className="mobile-toggle"
          onClick={() => setMobileMenu(!mobileMenu)}
          aria-label="Buka navigasi"
        >
          {mobileMenu ? <X /> : <Menu />}
        </button>

        <nav className={`main-navigation ${mobileMenu ? "open" : ""}`}>
          {visibleNavigation.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`nav-item ${activeMenu === item.id ? "active" : ""}`}
                onClick={() => {
                  openModule(item.id, item.label);
                  setMobileMenu(false);
                }}
              >
                <Icon size={19} strokeWidth={2.4} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="header-actions">
          <button
            className="header-icon"
            aria-label="Cari"
            onClick={handleSearch}
          >
            <Search size={21} />
          </button>

          <div className="header-popover-wrap">
            <button
              className="header-icon notification-trigger"
              aria-label="Notifikasi"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfile(false);
              }}
            >
              <Bell size={21} />
              <span className="notification-badge" />
            </button>

            {showNotifications && (
              <div className="header-popover">
                <strong>Notifikasi</strong>
                <p>Belum ada notifikasi baru.</p>
              </div>
            )}
          </div>

          <div className="header-popover-wrap">
            <button
              className="user-profile"
              onClick={() => {
                setShowProfile(!showProfile);
                setShowNotifications(false);
              }}
            >
              <div className="user-avatar">
                <UserRound size={26} />
              </div>
              <div className="user-details">
                <strong>{displayName}</strong>
                <span>{displayRole}</span>
              </div>
              <ChevronDown size={17} />
            </button>

            {showProfile && (
              <div className="header-popover profile-popover">
                <strong>{displayName}</strong>
                <button onClick={() => setNotice("Profil pengguna akan dikembangkan.")}>
                  <UserRound size={15} /> Profil Saya
                </button>
                <button onClick={() => setNotice("Pengaturan akun akan dikembangkan.")}>
                  <Settings size={15} /> Pengaturan Akun
                </button>
                <button onClick={handleLogout}>
                  <LogOut size={15} /> Keluar
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main id="portal" className="dashboard">
        {activeMenu === "gtk" ? (
          <GtkModule onBack={() => setActiveMenu("portal")} />
        ) : (
          <>
            {notice && (
              <div className="notice-banner" role="status">
                <span>{notice}</span>
                <button onClick={() => setNotice("")} aria-label="Tutup">
                  <X size={17} />
                </button>
              </div>
            )}

        <section className="hero">
          <div className="hero-photo" />
          <div className="hero-shade" />
          <div className="hero-light hero-light-one" />
          <div className="hero-light hero-light-two" />
          <div className="hero-content">
            <div className="hero-tag">
              <span /> INTEGRATED SCHOOL PLATFORM
            </div>

            <h1>
              ONESAY
              <span>School Management System</span>
            </h1>

            <h2>Satu Sekolah. Satu Ekosistem. Tanpa Batas.</h2>

            <p>
              Pusat kendali digital sekolah untuk mengelola data, layanan, dan
              seluruh aktivitas pendidikan secara terintegrasi, modern, dan
              profesional.
            </p>

            <div className="hero-buttons">
              <a href="#modul" className="primary-hero-button">
                <LayoutDashboard size={20} />
                Jelajahi Sistem
              </a>
              <button
                className="secondary-hero-button"
                onClick={() => setNotice("Panduan penggunaan ONESAY akan disiapkan pada tahap dokumentasi.")}
              >
                <CircleHelp size={20} />
                Lihat Panduan
              </button>
            </div>
          </div>
        </section>

        <section className="dashboard-layout">
          <div className="dashboard-main-column">
            <section className="stats-grid">
              <StatCard
                label="Guru & Tendik"
                value="86 Orang"
                growth="+2,4%"
                icon={Users}
                color="blue"
              />
              <StatCard
                label="Peserta Didik"
                value="1.248 Siswa"
                growth="+1,8%"
                icon={GraduationCap}
                color="cyan"
              />
              <StatCard
                label="Sarana & Prasarana"
                value="124 Unit"
                growth="+3,3%"
                icon={Building2}
                color="teal"
              />
              <StatCard
                label="Mata Pelajaran"
                value="42 Mapel"
                growth="− 0,0%"
                icon={BookOpen}
                color="purple"
                neutral
              />
            </section>

            <section className="module-section" id="modul">
              <div className="module-section-heading">
                <div className="section-stack-icon">
                  <Layers3 size={31} />
                </div>
                <div>
                  <h2>Pusat Kendali Sekolah</h2>
                  <p>
                    Pilih sistem yang ingin Anda kelola dan pantau
                    perkembangannya secara real-time.
                  </p>
                </div>
              </div>

              <div className="module-grid">
                {visibleModules.map((module) => (
                  <ModuleCard
                    key={module.id}
                    module={module}
                    onOpen={() => openModule(module.id, module.title)}
                  />
                ))}
              </div>
            </section>

            <section className="dapodik-banner">
              <div className="dapodik-database">
                <Database size={54} strokeWidth={1.5} />
              </div>

              <div className="dapodik-copy">
                <h2>Integrasi Dapodik</h2>
                <p>
                  Tarik dan sinkronkan data sekolah melalui Web Service Dapodik.
                </p>
              </div>

              <div className="server-art" aria-hidden="true">
                <div className="server-platform" />
                <div className="server-stack">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="server-orbit orbit-a" />
                <div className="server-orbit orbit-b" />
              </div>

              <button
                className="dapodik-button"
                onClick={() => setNotice("Pengaturan integrasi Dapodik akan tersedia setelah konektor dan backend keamanan disiapkan.")}
              >
                <RefreshCw size={19} />
                Kelola Integrasi Dapodik
                <ArrowRight size={21} />
              </button>
            </section>
          </div>

          <aside className="dashboard-sidebar">
            <section className="side-panel activity-panel" id="aktivitas">
              <div className="side-panel-heading">
                <div>
                  <Activity size={21} />
                  <h3>Aktivitas Sistem</h3>
                </div>
                <div className="activity-menu-wrap">
                  <button
                    className="more-button"
                    aria-label="Menu aktivitas"
                    onClick={() => setShowActivityMenu(!showActivityMenu)}
                  >
                    <MoreVertical size={20} />
                  </button>
                  {showActivityMenu && (
                    <div className="activity-dropdown">
                      <button onClick={() => setNotice("Riwayat aktivitas lengkap akan dikembangkan.")}>
                        Lihat semua aktivitas
                      </button>
                      <button onClick={() => setShowActivityMenu(false)}>
                        Tutup menu
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="activity-list">
                {activities.map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <div className="activity-row" key={index}>
                      <div className={`activity-icon ${activity.color}`}>
                        <Icon size={16} strokeWidth={2.8} />
                      </div>
                      <div className="activity-description">
                        <strong>{activity.title}</strong>
                      </div>
                      <span className="activity-time">{activity.time}</span>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="side-panel integration-panel">
              <div className="side-panel-heading integration-title">
                <div>
                  <Layers3 size={21} />
                  <h3>Status Integrasi</h3>
                </div>
              </div>

              <div className="integration-card">
                <div className="integration-card-heading">
                  <strong>Dapodik Web Service</strong>
                  <span className="connected-status">
                    <Check size={13} /> Terhubung
                  </span>
                </div>

                <div className="integration-details">
                  <div>
                    <span>Aplikasi</span>
                    <b>ONESAY-School</b>
                  </div>
                  <div>
                    <span>IP Address</span>
                    <b>192.168.1.100</b>
                  </div>
                  <div>
                    <span>Key (Token)</span>
                    <b className="token-value">
                      {showToken ? "DEMO-TOKEN" : "••••••••••"}
                    </b>
                    <button
                      className="token-toggle"
                      onClick={() => setShowToken(!showToken)}
                      aria-label="Tampilkan token demonstrasi"
                    >
                      {showToken ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </div>
              </div>
              <p className="integration-demo-note">
                <ShieldCheck size={13} />
                Informasi demonstrasi, belum terhubung ke server Dapodik.
              </p>
            </section>
          </aside>
        </section>

<footer className="dashboard-footer">
  <div className="footer-brand">
    <strong>
      © <span className="footer-brand-name">ONESAY</span>
      {" "}School Management System
    </strong>
  </div>

  <div className="footer-center">
    <Wifi size={13} />
    <span>Portal Antarmuka</span>
    <span className="footer-separator">•</span>
    <Clock3 size={13} />
    <span>Versi Pengembangan</span>
  </div>

  <span className="footer-copyright">
    Developed by <strong>Rohu</strong> - CP:
    <a
      href="https://wa.me/628993248127"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Hubungi Rohu melalui WhatsApp"
    >
      08993248127
    </a>
  </span>
</footer>
    </>
  )}
</main>
    </div>
  );
}

function StatCard({ label, value, growth, icon: Icon, color, neutral }) {
  return (
    <article className={`stat-card ${color}`}>
      <div className="stat-icon">
        <Icon size={29} strokeWidth={2.5} />
      </div>
      <div className="stat-copy">
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
      <div className={`stat-growth ${neutral ? "neutral" : ""}`}>
        {!neutral && <span>↑</span>}
        {growth}
      </div>
    </article>
  );
}

function ModuleCard({ module, onOpen }) {
  const Icon = module.icon;

  return (
    <button
      className={`module-card ${module.color}`}
      onClick={onOpen}
      aria-label={`Buka ${module.title}`}
    >
      <div className="module-art" aria-hidden="true">
        <div className="module-art-circle" />
        <div className="module-art-wave" />
      </div>

      <div className="module-card-icon">
        <Icon size={31} strokeWidth={2.6} />
      </div>

      <div className="module-card-content">
        <h3>{module.title}</h3>
        <p>{module.description}</p>
      </div>

      <span className="module-role">
        <ShieldCheck size={14} />
        {module.role}
      </span>

      <span className="module-arrow">
        <ArrowRight size={23} />
      </span>
    </button>
  );
}

export default App;
