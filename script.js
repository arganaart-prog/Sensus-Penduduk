const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxTTgYWvDf9-RAgTFu2UsjfrLyej2apFA4cExyPShEasGzfxaAXg1WwMR1qPtqP5xZ5/exec";
const SHEET_LINK_KEY = "demoEdukasiSheetLink";

const censusForm = document.getElementById("censusForm");
const startDemoButton = document.getElementById("startDemo");
const statusMessage = document.getElementById("statusMessage");
const resultArea = document.getElementById("resultArea");
const formSummary = document.getElementById("formSummary");
const latitudeValue = document.getElementById("latitudeValue");
const longitudeValue = document.getElementById("longitudeValue");
const accuracyValue = document.getElementById("accuracyValue");
const timestampValue = document.getElementById("timestampValue");
const userAgentValue = document.getElementById("userAgentValue");
const mapsLink = document.getElementById("mapsLink");

const sheetForm = document.getElementById("sheetForm");
const sheetLinkInput = document.getElementById("sheetLink");
const openSheetLink = document.getElementById("openSheetLink");

let currentCensusData = null;

if (censusForm && startDemoButton) {
  censusForm.addEventListener("submit", handleCensusSubmit);
} else if (startDemoButton) {
  startDemoButton.addEventListener("click", requestLocation);
}

if (sheetForm && sheetLinkInput && openSheetLink) {
  setupDashboard();
}

function handleCensusSubmit(event) {
  event.preventDefault();

  if (!censusForm.reportValidity()) {
    return;
  }

  currentCensusData = collectCensusData();
  requestLocation();
}

function collectCensusData() {
  const data = new FormData(censusForm);

  return {
    respondentCode: sanitizeShortValue(data.get("respondentCode")),
    ageRange: data.get("ageRange") || "",
    householdSize: data.get("householdSize") || "",
    housingStatus: data.get("housingStatus") || "",
    internetAccess: data.get("internetAccess") || "",
    areaCode: data.get("areaCode") || ""
  };
}

function requestLocation() {
  if (!navigator.geolocation) {
    setStatus("Browser ini tidak mendukung geolokasi.", "error");
    return;
  }

  startDemoButton.disabled = true;
  startDemoButton.textContent = "Menunggu izin browser...";
  setStatus("Form demo sudah siap. Permintaan izin lokasi dikirim. Pilih Izinkan atau Tolak pada dialog browser.", "warning");

  navigator.geolocation.getCurrentPosition(handleLocationSuccess, handleLocationError, {
    enableHighAccuracy: true,
    timeout: 15000,
    maximumAge: 0
  });
}

function handleLocationSuccess(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  const accuracy = Math.round(position.coords.accuracy);
  const timestamp = new Date().toISOString();
  const userAgent = navigator.userAgent;
  const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

  latitudeValue.textContent = latitude.toFixed(6);
  longitudeValue.textContent = longitude.toFixed(6);
  accuracyValue.textContent = `${accuracy} meter`;
  timestampValue.textContent = formatDate(timestamp);
  userAgentValue.textContent = userAgent;
  mapsLink.href = googleMapsUrl;

  if (formSummary && currentCensusData) {
    formSummary.innerHTML = `
      <h2>Ringkasan form yang ikut terbaca</h2>
      <dl>
        <div><dt>Kode responden</dt><dd>${escapeHtml(currentCensusData.respondentCode)}</dd></div>
        <div><dt>Rentang usia</dt><dd>${escapeHtml(currentCensusData.ageRange)}</dd></div>
        <div><dt>Jumlah anggota rumah</dt><dd>${escapeHtml(currentCensusData.householdSize)}</dd></div>
        <div><dt>Status tempat tinggal</dt><dd>${escapeHtml(currentCensusData.housingStatus)}</dd></div>
        <div><dt>Akses internet</dt><dd>${escapeHtml(currentCensusData.internetAccess)}</dd></div>
        <div><dt>Wilayah simulasi</dt><dd>${escapeHtml(currentCensusData.areaCode)}</dd></div>
      </dl>
    `;
  }

  resultArea.classList.remove("hidden");
  setStatus("Form dan lokasi berhasil dibaca setelah tombol ditekan dan izin diberikan.", "success");
  startDemoButton.textContent = "Demo Selesai";

  sendDemoData({
    ...currentCensusData,
    latitude,
    longitude,
    accuracy,
    timestamp,
    userAgent,
    consent: true
  });
}

function handleLocationError(error) {
  startDemoButton.disabled = false;
  startDemoButton.textContent = "Kirim Form & Mulai Verifikasi Lokasi Lagi";

  if (error.code === error.PERMISSION_DENIED) {
    setStatus("Akses lokasi ditolak. Ini keputusan yang aman saat membuka link tidak dikenal.", "success");
    return;
  }

  if (error.code === error.TIMEOUT) {
    setStatus("Permintaan lokasi kehabisan waktu. Coba lagi atau periksa pengaturan lokasi perangkat.", "error");
    return;
  }

  setStatus("Lokasi tidak dapat dibaca oleh browser saat ini.", "error");
}

function sendDemoData(data) {
  if (!SCRIPT_URL || SCRIPT_URL === "ISI_URL_GOOGLE_APPS_SCRIPT_DI_SINI") {
    setStatus("Form dan lokasi tampil di halaman ini. SCRIPT_URL belum diisi, jadi data belum dikirim ke Google Sheets.", "warning");
    return;
  }

  const formData = new FormData();
  formData.append("respondentCode", data.respondentCode || "");
  formData.append("ageRange", data.ageRange || "");
  formData.append("householdSize", data.householdSize || "");
  formData.append("housingStatus", data.housingStatus || "");
  formData.append("internetAccess", data.internetAccess || "");
  formData.append("areaCode", data.areaCode || "");
  formData.append("latitude", data.latitude);
  formData.append("longitude", data.longitude);
  formData.append("accuracy", data.accuracy);
  formData.append("timestamp", data.timestamp);
  formData.append("userAgent", data.userAgent);
  formData.append("consent", data.consent);

  fetch(SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    body: formData
  })
    .then(() => {
      setStatus("Form dan lokasi tampil di halaman ini. Permintaan pengiriman ke Google Sheets sudah dilakukan.", "success");
    })
    .catch(() => {
      setStatus("Form dan lokasi tampil di halaman ini, tetapi pengiriman ke Google Sheets gagal. Periksa SCRIPT_URL dan deployment Apps Script.", "error");
    });
}

function setStatus(message, type) {
  if (!statusMessage) {
    return;
  }

  statusMessage.textContent = message;
  statusMessage.className = `status-message ${type || ""}`.trim();
}

function formatDate(timestamp) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "medium"
  }).format(new Date(timestamp));
}

function sanitizeShortValue(value) {
  return String(value || "").replace(/[^a-zA-Z0-9\-_.]/g, "").slice(0, 12);
}

function escapeHtml(value) {
  return String(value || "-")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function setupDashboard() {
  const savedLink = localStorage.getItem(SHEET_LINK_KEY);

  if (savedLink) {
    sheetLinkInput.value = savedLink;
    updateSheetLink(savedLink);
  }

  sheetForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const link = sheetLinkInput.value.trim();

    if (!link) {
      updateSheetLink("");
      return;
    }

    localStorage.setItem(SHEET_LINK_KEY, link);
    updateSheetLink(link);
    window.open(link, "_blank", "noopener,noreferrer");
  });
}

function updateSheetLink(link) {
  if (!openSheetLink) {
    return;
  }

  if (!link) {
    openSheetLink.href = "#";
    openSheetLink.setAttribute("aria-disabled", "true");
    return;
  }

  openSheetLink.href = link;
  openSheetLink.setAttribute("aria-disabled", "false");
}
