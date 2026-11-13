
import './App.css'

function App() {
  return (
    <main className="onesay">
      <header className="onesay-header">
        <div className="school-brand">
          <img
            src={`${import.meta.env.BASE_URL}assets/logos/04_onesay.jpeg`}
            alt="Logo ONESAY"
            className="school-logo-image"
          />
          <div>
            <strong>ONESAY</strong>
            <span>School Management System</span>
          </div>
        </div>

        <a className="login-button" href="#masuk">
          Masuk Portal
        </a>
      </header>

      <section className="hero-section">
        <span className="hero-label">SISTEM INFORMASI SEKOLAH TERPADU</span>

        <h1>
          <br />
          Satu Data, Satu Sistem dalam Portal
          <br />
          <span>ONESAY</span>
        </h1>

        <p>
          Portal informasi dan manajemen sekolah yang terintegrasi
          untuk mendukung pembelajaran, tata kelola, dan evaluasi
          di SMP Negeri 1 Sayan.
        </p>

        <div className="hero-actions">
          <a className="primary-button" href="#profil">
            Jelajahi Portal
          </a>
          <a className="secondary-button" href="#modul">
            Lihat Modul
          </a>
        </div>

        <div className="principles">
          <div>
            <span>01</span>
            <strong>ONE DATA</strong>
            <small>Satu Data</small>
          </div>
          <div>
            <span>02</span>
            <strong>ONE LEARNING</strong>
            <small>Satu Pembelajaran</small>
          </div>
          <div>
            <span>03</span>
            <strong>ONE MANAGEMENT</strong>
            <small>Satu Manajemen</small>
          </div>
          <div>
            <span>04</span>
            <strong>ONE EVALUATION</strong>
            <small>Satu Evaluasi</small>
          </div>
        </div>
      </section>

      <section className="modules-section" id="modul">
        <div className="section-heading" id="profil">
          <span>EKOSISTEM SEKOLAH</span>
          <h2>Seluruh kebutuhan sekolah dalam satu portal.</h2>
          <p>
            Terhubung melalui sistem informasi yang terstruktur
            dan mudah digunakan.
          </p>
        </div>

        <div className="module-grid">
          {[
            ['01', 'Dashboard Utama', 'Ringkasan informasi sekolah.'],
            ['02', 'Profil Sekolah', 'Identitas dan informasi sekolah.'],
            ['03', 'Peserta Didik', 'Data dan administrasi murid.'],
            ['04', 'Guru dan GTK', 'Data pendidik dan tenaga kependidikan.'],
            ['05', 'Pembelajaran', 'Pengelolaan kegiatan pembelajaran.'],
            ['06', 'Kurikulum', 'Program dan administrasi kurikulum.'],
            ['07', 'Sarana Prasarana', 'Data inventaris dan fasilitas.'],
            ['08', 'BOSP', 'Pengelolaan administrasi BOSP.'],
            ['09', 'Kesiswaan', 'Administrasi dan pembinaan murid.'],
            ['10', 'Ekstrakurikuler', 'Kegiatan pengembangan minat.'],
            ['11', 'Evaluasi', 'Pemantauan dan evaluasi sekolah.'],
            ['12', 'Arsip Digital', 'Dokumen sekolah terorganisasi.'],
          ].map(([number, title, description]) => (
            <article className="module-card" key={number}>
              <span className="module-number">{number}</span>
              <h3>{title}</h3>
              <p>{description}</p>
              <span className="module-arrow" aria-hidden="true">
                ↗
              </span>
            </article>
          ))}
        </div>
      </section>

      <footer className="onesay-footer">
        <strong>ONESAY</strong>
        <p>SMP Negeri 1 Sayan · School Management System</p>
        <small>
          Satu Data · Satu Pembelajaran · Satu Manajemen · Satu Evaluasi
        </small>
      </footer>
    </main>
  )
}

export default App
