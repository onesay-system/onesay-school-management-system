
import { useState } from 'react'
import './App.css'

const modules = [
  {
    number: '01',
    icon: '📊',
    title: 'Dashboard Utama',
    description: 'Ringkasan informasi, aktivitas, dan kondisi sekolah dalam satu tampilan.',
    color: 'blue',
  },
  {
    number: '02',
    icon: '🏫',
    title: 'Profil Sekolah',
    description: 'Identitas, informasi, visi, misi, dan data kelembagaan sekolah.',
    color: 'violet',
  },
  {
    number: '03',
    icon: '🎓',
    title: 'Peserta Didik',
    description: 'Pengelolaan data dan administrasi murid secara terintegrasi.',
    color: 'cyan',
  },
  {
    number: '04',
    icon: '👩‍🏫',
    title: 'Guru dan GTK',
    description: 'Data pendidik dan tenaga kependidikan dalam satu basis data.',
    color: 'emerald',
  },
  {
    number: '05',
    icon: '📚',
    title: 'Pembelajaran',
    description: 'Pengelolaan kegiatan pembelajaran dan administrasi kelas.',
    color: 'orange',
  },
  {
    number: '06',
    icon: '📝',
    title: 'Kurikulum',
    description: 'Pengelolaan program, perangkat, dan administrasi kurikulum.',
    color: 'pink',
  },
  {
    number: '07',
    icon: '🏗️',
    title: 'Sarana Prasarana',
    description: 'Pendataan inventaris, aset, dan fasilitas sekolah.',
    color: 'indigo',
  },
  {
    number: '08',
    icon: '🌟',
    title: 'Kesiswaan',
    description: 'Administrasi, pembinaan, dan pengembangan karakter murid.',
    color: 'rose',
  },
  {
    number: '09',
    icon: '⚽',
    title: 'Ekstrakurikuler',
    description: 'Pengelolaan kegiatan dan pengembangan minat serta bakat.',
    color: 'teal',
  },
  {
    number: '10',
    icon: '📈',
    title: 'Evaluasi',
    description: 'Pemantauan, pengukuran, dan evaluasi mutu sekolah.',
    color: 'purple',
  },
  {
    number: '11',
    icon: '🗂️',
    title: 'Arsip Digital',
    description: 'Penyimpanan dan pengelolaan dokumen sekolah secara terorganisasi.',
    color: 'slate',
  },
]

const principles = [
  {
    number: '01',
    title: 'ONE DATA',
    description: 'Satu sumber data yang terintegrasi dan saling terhubung.',
    color: 'blue',
    icon: '◈',
  },
  {
    number: '02',
    title: 'ONE LEARNING',
    description: 'Ekosistem pembelajaran yang terarah dan berkelanjutan.',
    color: 'violet',
    icon: '✳',
  },
  {
    number: '03',
    title: 'ONE MANAGEMENT',
    description: 'Manajemen sekolah yang efektif, tertib, dan transparan.',
    color: 'emerald',
    icon: '⌘',
  },
  {
    number: '04',
    title: 'ONE EVALUATION',
    description: 'Evaluasi terpadu untuk peningkatan mutu pendidikan.',
    color: 'orange',
    icon: '↗',
  },
]

function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  return (
    <main className="onesay">
      {/* HEADER */}
      <header className="onesay-header">
        <div className="header-container">
          <a className="brand" href="#beranda" onClick={closeMenu}>
            <div className="brand-logo">
              <img
                src={`${import.meta.env.BASE_URL}assets/logos/04_onesay.jpeg`}
                alt="Logo ONE SAY"
              />
            </div>
            <div className="brand-copy">
              <span className="brand-name">ONE SAY</span>
              <span className="brand-subtitle">SCHOOL MANAGEMENT SYSTEM</span>
            </div>
          </a>

          <button
            className={`menu-toggle ${menuOpen ? 'is-active' : ''}`}
            type="button"
            aria-label={menuOpen ? 'Tutup navigasi' : 'Buka navigasi'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span />
            <span />
            <span />
          </button>

          <nav className={`main-nav ${menuOpen ? 'nav-open' : ''}`}>
            <a href="#beranda" onClick={closeMenu}>Beranda</a>
            <a href="#tentang" onClick={closeMenu}>Tentang</a>
            <a href="#prinsip" onClick={closeMenu}>Prinsip</a>
            <a href="#modul" onClick={closeMenu}>Modul Sistem</a>
            <a href="#kontak" onClick={closeMenu}>Kontak</a>
            <a className="nav-login" href="#masuk" onClick={closeMenu}>
              Masuk Sistem <span>↗</span>
            </a>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="hero-section" id="beranda">
        <div className="hero-orb hero-orb-one" />
        <div className="hero-orb hero-orb-two" />
        <div className="hero-grid-pattern" />

        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-eyebrow">
              <span className="eyebrow-dot" />
              INTEGRATED SCHOOL MANAGEMENT PLATFORM
            </div>

            <h1>
              Satu Data.
              <br />
              Satu Sistem.
              <br />
              <span className="gradient-text">Satu Tujuan.</span>
            </h1>

            <p className="hero-description">
              Membangun ekosistem digital sekolah yang terintegrasi,
              modern, dan berkelanjutan untuk mendukung tata kelola
              serta peningkatan mutu pendidikan.
            </p>

            <div className="hero-actions">
              <a className="button-primary" href="#modul">
                Jelajahi Sistem <span>→</span>
              </a>
              <a className="button-secondary" href="#tentang">
                Kenali ONE SAY <span>↗</span>
              </a>
            </div>

            <div className="hero-trust">
              <span className="trust-line" />
              <span>TERINTEGRASI</span>
              <span className="trust-separator">·</span>
              <span>TERSTRUKTUR</span>
              <span className="trust-separator">·</span>
              <span>BERKELANJUTAN</span>
            </div>
          </div>

          <div className="hero-visual">
            <div className="visual-glow" />
            <div className="visual-card">
              <div className="visual-card-top">
                <div>
                  <span className="visual-label">DIGITAL ECOSYSTEM</span>
                  <h3>ONE SAY Platform</h3>
                </div>
                <span className="visual-status">
                  <span /> SYSTEM
                </span>
              </div>

              <div className="visual-logo-wrap">
                <div className="visual-logo-ring">
                  <img
                    src={`${import.meta.env.BASE_URL}assets/logos/04_onesay.jpeg`}
                    alt="ONE SAY"
                  />
                </div>
                <div className="visual-logo-text">
                  <strong>ONE SAY</strong>
                  <span>School Management System</span>
                </div>
              </div>

              <div className="visual-stat-grid">
                <div className="visual-stat stat-blue">
                  <span>◈</span>
                  <strong>ONE DATA</strong>
                  <small>Integrated</small>
                </div>
                <div className="visual-stat stat-violet">
                  <span>✳</span>
                  <strong>ONE LEARNING</strong>
                  <small>Connected</small>
                </div>
                <div className="visual-stat stat-green">
                  <span>⌘</span>
                  <strong>ONE MANAGEMENT</strong>
                  <small>Organized</small>
                </div>
                <div className="visual-stat stat-orange">
                  <span>↗</span>
                  <strong>ONE EVALUATION</strong>
                  <small>Continuous</small>
                </div>
              </div>

              <div className="visual-card-bottom">
                <span className="visual-bottom-mark">✦</span>
                <span>One Integrated School Ecosystem</span>
                <span className="visual-bottom-line" />
              </div>
            </div>

            <div className="floating-chip chip-top">
              <span>✦</span> Smart Management
            </div>
            <div className="floating-chip chip-bottom">
              <span>●</span> Connected System
            </div>
          </div>
        </div>

        <div className="hero-bottom-wave" />
      </section>

      {/* INTRODUCTION */}
      <section className="intro-section" id="tentang">
        <div className="section-container intro-layout">
          <div className="intro-heading">
            <span className="section-kicker">MENGENAL ONE SAY</span>
            <h2>
              Bukan sekadar aplikasi.
              <br />
              <span className="text-gradient">Sebuah ekosistem sekolah.</span>
            </h2>
          </div>

          <div className="intro-description">
            <p>
              ONE SAY merupakan platform manajemen sekolah terintegrasi
              yang dirancang untuk menyatukan informasi, pembelajaran,
              administrasi, dan evaluasi dalam satu sistem digital.
            </p>
            <p>
              Setiap bagian saling terhubung untuk menciptakan pengelolaan
              sekolah yang lebih efektif, akuntabel, dan berorientasi
              pada peningkatan kualitas layanan pendidikan.
            </p>
          </div>
        </div>
      </section>

      {/* PRINCIPLES */}
      <section className="principles-section" id="prinsip">
        <div className="section-container">
          <div className="section-heading centered">
            <span className="section-kicker">THE ONE SAY FOUNDATION</span>
            <h2>Empat Pilar. <span className="text-gradient">Satu Ekosistem.</span></h2>
            <p>Fondasi utama dalam membangun sistem manajemen sekolah yang terintegrasi.</p>
          </div>

          <div className="principles-grid">
            {principles.map((item) => (
              <article className={`principle-card principle-${item.color}`} key={item.number}>
                <div className="principle-top">
                  <span className="principle-icon">{item.icon}</span>
                  <span className="principle-number">{item.number}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <span className="principle-decoration">{item.icon}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* MODULES */}
      <section className="modules-section" id="modul">
        <div className="section-container">
          <div className="modules-heading">
            <div className="section-heading">
              <span className="section-kicker">INTEGRATED SCHOOL MODULES</span>
              <h2>Seluruh Kebutuhan Sekolah, <span className="text-gradient">Dalam Satu Sistem.</span></h2>
              <p>
                Sebelas modul utama yang dirancang untuk mendukung
                pengelolaan sekolah secara menyeluruh.
              </p>
            </div>
            <div className="module-count">
              <strong>11</strong>
              <span>MODUL<br />TERINTEGRASI</span>
            </div>
          </div>

          <div className="module-grid">
            {modules.map((module) => (
              <article className={`module-card module-${module.color}`} key={module.number}>
                <div className="module-card-top">
                  <span className="module-icon">{module.icon}</span>
                  <span className="module-number">{module.number}</span>
                </div>
                <h3>{module.title}</h3>
                <p>{module.description}</p>
                <div className="module-card-bottom">
                  <span>MODUL ONE SAY</span>
                  <span className="module-arrow">↗</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="cta-section" id="masuk">
        <div className="cta-container">
          <div className="cta-decoration cta-decoration-one" />
          <div className="cta-decoration cta-decoration-two" />
          <span className="cta-kicker">ONE PLATFORM · ONE ECOSYSTEM</span>
          <h2>
            Bersama, Kita Bangun
            <br />
            <span>Masa Depan Pendidikan.</span>
          </h2>
          <p>
            Integrasi data, pembelajaran, dan manajemen untuk sekolah
            yang lebih maju dan berdaya saing.
          </p>
          <a className="cta-button" href="#modul">
            Mulai Jelajahi <span>→</span>
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="onesay-footer" id="kontak">
        <div className="footer-main">
          <div className="footer-brand">
            <div className="footer-brand-logos">
              <img
                src={`${import.meta.env.BASE_URL}assets/logos/01_kemendikdasmen.png`}
                alt="Logo Kemendikdasmen"
              />
              <img
                src={`${import.meta.env.BASE_URL}assets/logos/02_kabupaten_melawi.png`}
                alt="Logo Kabupaten Melawi"
              />
              <img
                src={`${import.meta.env.BASE_URL}assets/logos/03_disdikbud_kab_melawi.png`}
                alt="Logo Dinas Pendidikan dan Kebudayaan Kabupaten Melawi"
              />
              <img
                src={`${import.meta.env.BASE_URL}assets/logos/04_onesay.jpeg`}
                alt="Logo ONE SAY"
              />
            </div>
            <h3>ONE SAY</h3>
            <span className="footer-brand-subtitle">SCHOOL MANAGEMENT SYSTEM</span>
            <p>
              Satu ekosistem digital untuk mendukung pengelolaan
              dan peningkatan mutu pendidikan.
            </p>
          </div>

          <div className="footer-links">
            <h4>Navigasi</h4>
            <a href="#beranda">Beranda</a>
            <a href="#tentang">Tentang ONE SAY</a>
            <a href="#prinsip">Prinsip Sistem</a>
            <a href="#modul">Modul Sistem</a>
          </div>

          <div className="footer-links">
            <h4>Ekosistem</h4>
            <span>One Data</span>
            <span>One Learning</span>
            <span>One Management</span>
            <span>One Evaluation</span>
          </div>

          <div className="footer-contact">
            <h4>Informasi Sekolah</h4>
            <strong>SMP Negeri 1 Sayan</strong>
            <p>Kecamatan Sayan, Kabupaten Melawi, Kalimantan Barat</p>
            <span className="footer-contact-note">
              Platform pengelolaan sekolah terintegrasi.
            </span>
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} ONE SAY School Management System.
          </span>

          <span>
            Developed by <strong>Rohu</strong> - CP:{' '}
            <a
              href="https://wa.me/628993248127"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Hubungi Rohu melalui WhatsApp"
            >
              08993248127
            </a>
          </span>
        </div>
      </footer>
    </main>
  )
}

export default App
