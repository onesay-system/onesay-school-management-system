
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Users,
  UserPlus,
  Search,
  RefreshCw,
  Download,
  Pencil,
  X,
  Save,
  UserRound,
  BriefcaseBusiness,
  GraduationCap,
  ShieldCheck,
  Database,
  CircleCheck,
  Clock3,
  AlertCircle,
  Settings2,
  Eye,
  EyeOff,
  Wifi,
  WifiOff,
  KeyRound,
  Server,
} from "lucide-react";
import "./gtk.css";

const initialGtkData = [
  {
    id: 1,
    nama: "Ahmad Fauzi, S.Pd.",
    nip: "198501012010011001",
    jabatan: "Guru Matematika",
    status: "PNS",
    sumber: "Dapodik",
    sinkron: "Tersinkron",
    pendidikan: "S1",
  },
  {
    id: 2,
    nama: "Siti Rahmawati, S.Pd.",
    nip: "199203152019032004",
    jabatan: "Guru Bahasa Indonesia",
    status: "PPPK",
    sumber: "Dapodik",
    sinkron: "Tersinkron",
    pendidikan: "S1",
  },
  {
    id: 3,
    nama: "Budi Santoso",
    nip: "-",
    jabatan: "Tenaga Administrasi",
    status: "Non-ASN",
    sumber: "Manual",
    sinkron: "Belum disinkronkan",
    pendidikan: "SMA",
  },
];

const emptyForm = {
  nama: "",
  nip: "",
  jabatan: "",
  status: "PNS",
  pendidikan: "S1",
};

function GtkModule({ onBack }) {
  const [gtkData, setGtkData] = useState(initialGtkData);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [filterSumber, setFilterSumber] = useState("Semua");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [notice, setNotice] = useState("");
  const [showImport, setShowImport] = useState(false);
  const [showDapodikSettings, setShowDapodikSettings] = useState(false);

const [dapodikConfig, setDapodikConfig] = useState({
  appName: "ONESAY",
  ipAddress: "localhost",
  token: "",
});

const [tokenVisible, setTokenVisible] = useState(false);
const [connectorStatus, setConnectorStatus] = useState("unknown");
const [testingConnector, setTestingConnector] = useState(false);
const [savingConfig, setSavingConfig] = useState(false);
const [configLoading, setConfigLoading] = useState(false);

  const filteredData = useMemo(() => {
    return gtkData.filter((item) => {
      const keyword = search.toLowerCase();

      const cocokPencarian =
        item.nama.toLowerCase().includes(keyword) ||
        item.nip.toLowerCase().includes(keyword) ||
        item.jabatan.toLowerCase().includes(keyword);

      const cocokStatus =
        filterStatus === "Semua" || item.status === filterStatus;

      const cocokSumber =
        filterSumber === "Semua" || item.sumber === filterSumber;

      return cocokPencarian && cocokStatus && cocokSumber;
    });
  }, [gtkData, search, filterStatus, filterSumber]);

  const totalPNS = gtkData.filter((item) => item.status === "PNS").length;
  const totalPPPK = gtkData.filter((item) => item.status === "PPPK").length;
  const totalNonASN = gtkData.filter(
    (item) => item.status === "Non-ASN"
  ).length;

  const openAddForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEditForm = (item) => {
    setEditingId(item.id);
    setForm({
      nama: item.nama,
      nip: item.nip === "-" ? "" : item.nip,
      jabatan: item.jabatan,
      status: item.status,
      pendidikan: item.pendidikan,
    });
    setShowForm(true);
  };

  const handleSave = (event) => {
    event.preventDefault();

    if (!form.nama.trim() || !form.jabatan.trim()) {
      setNotice("Nama dan jabatan wajib diisi.");
      return;
    }

    if (editingId !== null) {
      setGtkData((previous) =>
        previous.map((item) =>
          item.id === editingId
            ? {
                ...item,
                ...form,
                nip: form.nip.trim() || "-",
                sumber: item.sumber,
                sinkron:
                  item.sumber === "Dapodik"
                    ? "Perlu diperiksa"
                    : "Belum disinkronkan",
              }
            : item
        )
      );
      setNotice("Data GTK berhasil diperbarui pada tampilan ini.");
    } else {
      setGtkData((previous) => [
        ...previous,
        {
          id: Date.now(),
          ...form,
          nip: form.nip.trim() || "-",
          sumber: "Manual",
          sinkron: "Belum disinkronkan",
        },
      ]);
      setNotice("Data GTK baru berhasil ditambahkan pada tampilan ini.");
    }

    setShowForm(false);
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleImportDemo = () => {
    setShowImport(false);
    setNotice(
      "Simulasi impor selesai. Belum ada koneksi nyata ke Web Service Dapodik."
    );
  };

    const CONNECTOR_URL = "http://127.0.0.1:3001";

    const openDapodikSettings = async () => {
    setShowDapodikSettings(true);
    setConfigLoading(true);

    try {
        const response = await fetch(
        `${CONNECTOR_URL}/api/dapodik/config`
        );

        if (!response.ok) {
        throw new Error("Gagal membaca konfigurasi Connector.");
        }

        const result = await response.json();
        const config = result.config || result;

        setDapodikConfig((previous) => ({
        ...previous,
        appName: config.appName || "ONESAY",
        ipAddress: config.ipAddress || "localhost",
        token: "",
        }));

        setConnectorStatus("unknown");
    } catch (error) {
        setConnectorStatus("offline");
        setNotice(
        "Connector lokal belum dapat dihubungi. Periksa apakah server berjalan."
        );
    } finally {
        setConfigLoading(false);
    }
    };

    const handleTestConnector = async () => {
    setTestingConnector(true);
    setConnectorStatus("checking");

    try {
        const response = await fetch(`${CONNECTOR_URL}/api/health`);

        if (!response.ok) {
        throw new Error("Connector tidak memberikan respons normal.");
        }

        setConnectorStatus("online");
        setNotice("ONESAY Dapodik Connector berhasil dihubungi.");
    } catch (error) {
        setConnectorStatus("offline");
        setNotice(
        "Connector belum dapat dihubungi. Pastikan server lokal berjalan pada port 3001."
        );
    } finally {
        setTestingConnector(false);
    }
    };

    const handleSaveDapodikConfig = async (event) => {
    event.preventDefault();

    if (!dapodikConfig.appName.trim()) {
        setNotice("Nama aplikasi wajib diisi.");
        return;
    }

    if (!dapodikConfig.ipAddress.trim()) {
        setNotice("IP Address wajib diisi.");
        return;
    }

    if (!dapodikConfig.token.trim()) {
        setNotice("Key Dapodik wajib dimasukkan untuk menyimpan konfigurasi.");
        return;
    }

    setSavingConfig(true);

    try {
        const response = await fetch(
        `${CONNECTOR_URL}/api/dapodik/config`,
        {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            appName: dapodikConfig.appName.trim(),
            ipAddress: dapodikConfig.ipAddress.trim(),
            token: dapodikConfig.token.trim(),
            }),
        }
        );

        const result = await response.json();

        if (!response.ok) {
        throw new Error(
            result.message || result.error || "Gagal menyimpan konfigurasi."
        );
        }

        setDapodikConfig((previous) => ({
        ...previous,
        token: "",
        }));

        setShowDapodikSettings(false);
        setNotice(
        "Konfigurasi berhasil dikirim dan diterima oleh Connector lokal."
        );
    } catch (error) {
        setNotice(
        error.message || "Gagal menyimpan konfigurasi Dapodik."
        );
    } finally {
        setSavingConfig(false);
    }
    };

  return (
    <div className="gtk-page">
      <div className="gtk-top-heading">
        <div>
          <button className="gtk-back-button" onClick={onBack}>
            <ArrowLeft size={17} />
            Kembali ke Portal
          </button>

          <div className="gtk-eyebrow">
            <span />
            ONESAY HUMAN RESOURCE MANAGEMENT
          </div>

          <h1>Sistem GTK</h1>
          <p>
            Pusat pengelolaan data Guru dan Tenaga Kependidikan secara
            terintegrasi.
          </p>
        </div>

        <div className="gtk-heading-icon">
          <Users size={38} />
        </div>
      </div>

      {notice && (
        <div className="gtk-notice" role="status">
          <span>{notice}</span>
          <button onClick={() => setNotice("")} aria-label="Tutup notifikasi">
            <X size={17} />
          </button>
        </div>
      )}

      <div className="gtk-stat-grid">
        <div className="gtk-stat-card">
          <div className="gtk-stat-icon blue">
            <Users size={23} />
          </div>
          <div>
            <span>Total GTK</span>
            <strong>{gtkData.length}</strong>
            <small>Data tenaga kependidikan</small>
          </div>
        </div>

        <div className="gtk-stat-card">
          <div className="gtk-stat-icon purple">
            <ShieldCheck size={23} />
          </div>
          <div>
            <span>PNS</span>
            <strong>{totalPNS}</strong>
            <small>Pegawai negeri sipil</small>
          </div>
        </div>

        <div className="gtk-stat-card">
          <div className="gtk-stat-icon cyan">
            <BriefcaseBusiness size={23} />
          </div>
          <div>
            <span>PPPK</span>
            <strong>{totalPPPK}</strong>
            <small>Pegawai pemerintah</small>
          </div>
        </div>

        <div className="gtk-stat-card">
          <div className="gtk-stat-icon orange">
            <UserRound size={23} />
          </div>
          <div>
            <span>Non-ASN</span>
            <strong>{totalNonASN}</strong>
            <small>Tenaga non-ASN</small>
          </div>
        </div>
      </div>

      <section className="gtk-content-panel">
        <div className="gtk-panel-heading">
          <div>
            <h2>Database GTK</h2>
            <p>Kelola dan pantau seluruh data pegawai sekolah.</p>
          </div>

          <div className="gtk-heading-actions">
            <button
            className="gtk-button secondary"
            onClick={openDapodikSettings}
            >
            <Settings2 size={16} />
            Kelola Integrasi Dapodik
            </button>

            <button
              className="gtk-button secondary"
              onClick={() => setShowImport(true)}
            >
              <RefreshCw size={16} />
              Tarik dari Dapodik
            </button>

            <button className="gtk-button primary" onClick={openAddForm}>
              <UserPlus size={16} />
              Tambah GTK
            </button>
          </div>
        </div>

        <div className="gtk-filter-row">
          <div className="gtk-search-box">
            <Search size={18} />
            <input
              type="search"
              placeholder="Cari nama, NIP, atau jabatan..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <select
            value={filterStatus}
            onChange={(event) => setFilterStatus(event.target.value)}
            aria-label="Filter status kepegawaian"
          >
            <option value="Semua">Semua Status</option>
            <option value="PNS">PNS</option>
            <option value="PPPK">PPPK</option>
            <option value="Non-ASN">Non-ASN</option>
          </select>

          <select
            value={filterSumber}
            onChange={(event) => setFilterSumber(event.target.value)}
            aria-label="Filter sumber data"
          >
            <option value="Semua">Semua Sumber</option>
            <option value="Dapodik">Dapodik</option>
            <option value="Manual">Manual</option>
          </select>
        </div>

        <div className="gtk-table-wrap">
          <table className="gtk-table">
            <thead>
              <tr>
                <th>NO.</th>
                <th>IDENTITAS GTK</th>
                <th>NIP</th>
                <th>JABATAN</th>
                <th>STATUS</th>
                <th>SUMBER DATA</th>
                <th>STATUS SINKRONISASI</th>
                <th>AKSI</th>
              </tr>
            </thead>

            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>
                      <strong className="gtk-person-name">
                        {item.nama}
                      </strong>
                      <small className="gtk-person-education">
                        {item.pendidikan}
                      </small>
                    </td>
                    <td>{item.nip}</td>
                    <td>{item.jabatan}</td>
                    <td>
                      <span
                        className={`gtk-status-badge ${item.status
                          .toLowerCase()
                          .replace("-", "")}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <span className="gtk-source-label">
                        {item.sumber === "Dapodik" ? (
                          <Database size={13} />
                        ) : (
                          <UserRound size={13} />
                        )}
                        {item.sumber}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`gtk-sync-label ${
                          item.sinkron === "Tersinkron"
                            ? "synced"
                            : item.sinkron === "Perlu diperiksa"
                              ? "review"
                              : "pending"
                        }`}
                      >
                        {item.sinkron === "Tersinkron" ? (
                          <CircleCheck size={13} />
                        ) : item.sinkron === "Perlu diperiksa" ? (
                          <AlertCircle size={13} />
                        ) : (
                          <Clock3 size={13} />
                        )}
                        {item.sinkron}
                      </span>
                    </td>
                    <td>
                      <button
                        className="gtk-edit-button"
                        onClick={() => openEditForm(item)}
                        aria-label={`Edit ${item.nama}`}
                        title="Edit data"
                      >
                        <Pencil size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="gtk-empty-state">
                    Tidak ada data GTK yang sesuai dengan pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="gtk-table-footer">
          <span>
            Menampilkan <strong>{filteredData.length}</strong> dari{" "}
            <strong>{gtkData.length}</strong> data GTK
          </span>
          <span className="gtk-demo-label">
            Data demonstrasi / belum tersimpan ke database
          </span>
        </div>
      </section>

      <section className="gtk-info-grid">
        <div className="gtk-info-card">
          <div className="gtk-info-icon">
            <GraduationCap size={23} />
          </div>
          <div>
            <h3>Riwayat Pendidikan</h3>
            <p>Pengelolaan riwayat pendidikan dan kualifikasi GTK.</p>
            <span>Pengembangan berikutnya</span>
          </div>
        </div>

        <div className="gtk-info-card">
          <div className="gtk-info-icon">
            <BriefcaseBusiness size={23} />
          </div>
          <div>
            <h3>Riwayat Kepegawaian</h3>
            <p>Catatan pangkat, jabatan, dan perjalanan karier GTK.</p>
            <span>Pengembangan berikutnya</span>
          </div>
        </div>

        <div className="gtk-info-card">
          <div className="gtk-info-icon">
            <Database size={23} />
          </div>
          <div>
            <h3>Integrasi Dapodik</h3>
            <p>Persiapan sinkronisasi data melalui konektor resmi.</p>
            <span>Belum terhubung</span>
          </div>
        </div>
      </section>

      {showForm && (
        <div
          className="gtk-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowForm(false);
            }
          }}
        >
          <div
            className="gtk-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="gtk-form-title"
          >
            <div className="gtk-modal-heading">
              <div>
                <h2 id="gtk-form-title">
                  {editingId !== null ? "Edit Data GTK" : "Tambah GTK Baru"}
                </h2>
                <p>Lengkapi informasi dasar Guru atau Tenaga Kependidikan.</p>
              </div>
              <button
                className="gtk-modal-close"
                onClick={() => setShowForm(false)}
                aria-label="Tutup formulir"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <label>
                Nama Lengkap
                <input
                  value={form.nama}
                  onChange={(event) =>
                    setForm({ ...form, nama: event.target.value })
                  }
                  placeholder="Masukkan nama lengkap"
                  required
                />
              </label>

              <label>
                NIP
                <input
                  value={form.nip}
                  onChange={(event) =>
                    setForm({ ...form, nip: event.target.value })
                  }
                  placeholder="Masukkan NIP (jika ada)"
                />
              </label>

              <label>
                Jabatan
                <input
                  value={form.jabatan}
                  onChange={(event) =>
                    setForm({ ...form, jabatan: event.target.value })
                  }
                  placeholder="Contoh: Guru Bahasa Indonesia"
                  required
                />
              </label>

              <div className="gtk-form-row">
                <label>
                  Status Kepegawaian
                  <select
                    value={form.status}
                    onChange={(event) =>
                      setForm({ ...form, status: event.target.value })
                    }
                  >
                    <option value="PNS">PNS</option>
                    <option value="PPPK">PPPK</option>
                    <option value="Non-ASN">Non-ASN</option>
                  </select>
                </label>

                <label>
                  Pendidikan Terakhir
                  <select
                    value={form.pendidikan}
                    onChange={(event) =>
                      setForm({ ...form, pendidikan: event.target.value })
                    }
                  >
                    <option value="SMA">SMA / SMK</option>
                    <option value="D3">D3</option>
                    <option value="S1">S1</option>
                    <option value="S2">S2</option>
                    <option value="S3">S3</option>
                  </select>
                </label>
              </div>

              <div className="gtk-modal-actions">
                <button
                  type="button"
                  className="gtk-button secondary"
                  onClick={() => setShowForm(false)}
                >
                  Batal
                </button>
                <button type="submit" className="gtk-button primary">
                  <Save size={16} />
                  Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

        {showDapodikSettings && (
        <div
            className="gtk-modal-backdrop"
            onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
                setShowDapodikSettings(false);
            }
            }}
        >
            <div
            className="gtk-modal gtk-dapodik-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dapodik-settings-title"
            >
            <div className="gtk-modal-heading">
                <div>
                <div className="gtk-dapodik-title-icon">
                    <Database size={22} />
                </div>

                <h2 id="dapodik-settings-title">
                    Kelola Integrasi Dapodik
                </h2>

                <p>
                    Konfigurasi koneksi ONESAY dengan layanan Web Service
                    Dapodik pada komputer sekolah.
                </p>
                </div>

                <button
                className="gtk-modal-close"
                onClick={() => setShowDapodikSettings(false)}
                aria-label="Tutup konfigurasi"
                >
                <X size={20} />
                </button>
            </div>

            <div className="gtk-dapodik-section-heading">
                <Server size={16} />
                KONFIGURASI APLIKASI
            </div>

            <form onSubmit={handleSaveDapodikConfig}>
                <label>
                Nama Aplikasi
                <input
                    type="text"
                    value={dapodikConfig.appName}
                    onChange={(event) =>
                    setDapodikConfig({
                        ...dapodikConfig,
                        appName: event.target.value,
                    })
                    }
                    placeholder="Contoh: ONESAY"
                    required
                />
                <small>
                    Nama aplikasi yang didaftarkan pada Web Service Dapodik.
                </small>
                </label>

                <label>
                IP Address
                <input
                    type="text"
                    value={dapodikConfig.ipAddress}
                    onChange={(event) =>
                    setDapodikConfig({
                        ...dapodikConfig,
                        ipAddress: event.target.value,
                    })
                    }
                    placeholder="localhost"
                    required
                />
                <small>
                    Isi sesuai alamat IP yang dikonfigurasi pada Web Service
                    Dapodik.
                </small>
                </label>

                <label>
                Key / Token Dapodik

                <div className="gtk-token-input">
                    <KeyRound size={17} />

                    <input
                    type={tokenVisible ? "text" : "password"}
                    value={dapodikConfig.token}
                    onChange={(event) =>
                        setDapodikConfig({
                        ...dapodikConfig,
                        token: event.target.value,
                        })
                    }
                    placeholder="Masukkan Key Dapodik"
                    autoComplete="new-password"
                    required
                    />

                    <button
                    type="button"
                    onClick={() => setTokenVisible(!tokenVisible)}
                    aria-label={
                        tokenVisible ? "Sembunyikan token" : "Tampilkan token"
                    }
                    >
                    {tokenVisible ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                </div>

                <small>
                    Key digunakan untuk autentikasi. Token tidak ditampilkan
                    kembali setelah konfigurasi dikirim.
                </small>
                </label>

                <div className="gtk-dapodik-security-note">
                <ShieldCheck size={19} />
                <div>
                    <strong>Perlindungan kredensial</strong>
                    <p>
                    Key dikirim langsung ke ONESAY Dapodik Connector lokal.
                    Jangan membagikan Key melalui tangkapan layar atau pesan.
                    </p>
                </div>
                </div>

                <div className="gtk-dapodik-section-heading">
                <Wifi size={16} />
                STATUS CONNECTOR
                </div>

                <div className="gtk-connector-status">
                <div className="gtk-connector-status-icon">
                    {connectorStatus === "online" ? (
                    <Wifi size={19} />
                    ) : (
                    <WifiOff size={19} />
                    )}
                </div>

                <div className="gtk-connector-status-text">
                    <strong>
                    {connectorStatus === "online"
                        ? "Connector Aktif"
                        : connectorStatus === "offline"
                        ? "Connector Tidak Aktif"
                        : connectorStatus === "checking"
                            ? "Memeriksa koneksi..."
                            : "Belum Diperiksa"}
                    </strong>

                    <small>
                    {connectorStatus === "online"
                        ? "Server lokal berhasil memberikan respons."
                        : "Tes ini hanya memeriksa Connector lokal, bukan autentikasi Dapodik."}
                    </small>
                </div>

                <span
                    className={`gtk-connector-indicator ${connectorStatus}`}
                />
                </div>

                <div className="gtk-dapodik-actions">
                <button
                    type="button"
                    className="gtk-button secondary"
                    onClick={handleTestConnector}
                    disabled={testingConnector || configLoading}
                >
                    <RefreshCw
                    size={15}
                    className={testingConnector ? "gtk-spin" : ""}
                    />
                    {testingConnector ? "Memeriksa..." : "Tes Connector"}
                </button>

                <div className="gtk-dapodik-submit-actions">
                    <button
                    type="button"
                    className="gtk-button secondary"
                    onClick={() => setShowDapodikSettings(false)}
                    >
                    Batal
                    </button>

                    <button
                    type="submit"
                    className="gtk-button primary"
                    disabled={savingConfig || configLoading}
                    >
                    <Save size={15} />
                    {savingConfig ? "Menyimpan..." : "Simpan Konfigurasi"}
                    </button>
                </div>
                </div>
            </form>
            </div>
        </div>
        )}
      {showImport && (
        <div className="gtk-modal-backdrop">
          <div
            className="gtk-modal gtk-import-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="gtk-import-title"
          >
            <div className="gtk-modal-heading">
              <div>
                <h2 id="gtk-import-title">Integrasi Dapodik</h2>
                <p>Persiapan pengambilan data GTK dari Dapodik.</p>
              </div>
              <button
                className="gtk-modal-close"
                onClick={() => setShowImport(false)}
                aria-label="Tutup"
              >
                <X size={20} />
              </button>
            </div>

            <div className="gtk-import-notice">
              <AlertCircle size={22} />
              <div>
                <strong>Koneksi belum tersedia</strong>
                <p>
                  Fitur ini masih berupa simulasi antarmuka. Koneksi nyata
                  memerlukan ONESAY Dapodik Connector dan backend yang aman.
                </p>
              </div>
            </div>

            <div className="gtk-import-actions">
              <button
                className="gtk-button secondary"
                onClick={() => setShowImport(false)}
              >
                Tutup
              </button>
              <button
                className="gtk-button primary"
                onClick={handleImportDemo}
              >
                <Download size={16} />
                Simulasi Proses
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="gtk-footer">
        <span>ONESAY · Sistem GTK</span>
        <span>Modul pengembangan</span>
      </footer>
    </div>
  );
}

export default GtkModule;
