/* =========================================================
   Trainghienkhachhang.online – Mobile-First Web App
   Giao diện chuẩn điện thoại theo mẫu baocaovanhanh.online
   Lưu trữ: IndexedDB (cả hình ảnh & video) – chạy hoàn toàn offline
   ========================================================= */

// ---------- Cấu hình nội dung ----------
const DEFAULT_CONTENT = "Nâng cao trải nghiệm khách hàng";
const AREAS = ["Máng trượt 1", "Máng trượt 2", "Máng trượt 3", "FEC"];
const CHECKERS = [
  "Nguyễn Hồng Hoài Phong",
  "Dương Thanh Nhân",
  "Phạm Thị Hồng Gấm",
  "Phan Thị Thu Hiền",
  "Nguyễn Chí Thiên",
  "Mạc Phước Quy",
  "Nguyễn Phước Bảo Hiếu",
  "Mạc Tư Khoa",
];
const STAFF = [
  "Phùng Tấn Lệ",
  "Lê Thị Bích Trâm",
  "Phan Thị Thơ",
  "Nguyễn Văn Thông",
  "Trương Thị Thanh Nga",
  "Dương Thanh Nhân",
  "Phạm Thị Lệ",
  "Nguyễn Chí Thiên",
  "Lê Phước Tri",
  "Lê Thị Thùy My",
  "Phan Thị Thu Hiền",
  "Trịnh Văn Quốc Việt",
  "Trần Thiện Thành",
  "Mạc Tư Khoa",
  "Võ Thị Kiều",
  "Nguyễn Duy Thanh",
  "Mạc Như Duy",
  "Nguyễn Thị Như Ý",
  "Nguyễn Phước Bảo Hiếu",
  "Nguyễn Mạnh Hưng",
  "Nguyễn Thị Huân",
  "Trần Thị Thanh Tuyền",
  "Phạm Thị Hồng Gấm",
  "Bạch Mai Diệu Thảo",
  "Lê Thị Mỹ Kiều",
  "Trần Thị Ngọc Bích",
  "Phạm Bùi Như Quỳnh",
  "Trần Phan Hải Yến",
  "Phan Thị Lan Anh",
  "Phan Thị Tú Trinh",
  "Trần Nhật Phương",
  "Hồ Quỳnh Hương",
  "Lê Thị Kiều Oanh",
  "Từ Ngọc Hóa",
  "Nguyễn Thị Hậu",
  "Phạm Văn Quang",
  "Lê Thị Diễm My",
  "Đặng Thị Như Quỳnh",
  "Phan Thị Hà Châu",
  "Phạm Hương Giang",
  "Nguyễn Minh Hào",
  "Nguyễn Thị Ánh Đào",
  "Đoàn Đức Huy",
  "Võ Thị Linh Hương",
  "Lê Thị Mai Trâm",
  "Hoàng Thị Hương Giang",
  "Châu Thị Minh Thư",
  "Đặng Thị Thùy Nhung",
  "Trương Thị Thu Hằng",
  "Huỳnh Thị Như",
];

// Tiêu chí đánh giá: Hình ảnh – Tác phong – Dịch vụ (Đón khách / Tiễn khách)
const CHECKLIST = [
  {
    group: "Hình ảnh",
    items: [
      {
        id: "hinhanh",
        short: "Hình ảnh",
        text: "Hình ảnh chỉn chu",
        hint: "Trang phục đúng quy định, sạch sẽ, phẳng phiu; giày tất sạch; đầu tóc gọn gàng; khuôn mặt tươi tắn; móng tay ≤ 2mm; phụ kiện đơn giản, không lộ hình xăm.",
      },
    ],
  },
  {
    group: "Tác phong",
    items: [
      {
        id: "tacphong",
        short: "Tác phong",
        text: "Tác phong chuẩn mực",
        hint: "Đúng giờ, đúng vị trí; tư thế đi/đứng chuẩn; không tụ tập, làm việc riêng, ăn uống, dùng điện thoại; không hành vi thiếu lịch sự; giữ vệ sinh khu vực.",
      },
    ],
  },
  {
    group: "Dịch vụ",
    items: [
      {
        id: "donkhach",
        short: "Đón khách",
        text: "Dịch vụ: Đón khách",
        hint: "Mỉm cười, cúi chào: “Chào mừng Anh/Chị đã đến với… / Welcome to…”, “Cả nhà đã sẵn sàng chưa ạ?… Xin mời / Are you ready, guys? …Let’s go”.",
      },
      {
        id: "tienkhach",
        short: "Tiễn khách",
        text: "Dịch vụ: Tiễn khách",
        hint: "“Cả nhà tiếp tục hành trình vui vẻ nhá / Enjoy the rest of your day”, “Cảm ơn cả nhà, hẹn gặp lại nhé / Thanks, everyone! See you next time”.",
      },
    ],
  },
];

const BRIEF = {
  hinhanh: "Trang phục, đầu tóc, vệ sinh, phụ kiện",
  tacphong: "Đúng giờ, đúng vị trí, tư thế, không làm việc riêng",
  donkhach: "Mỉm cười, cúi chào, câu chào đón khách",
  tienkhach: "Cảm ơn, chúc khách, câu tiễn khách",
};
const ITEM_MAP = {};
CHECKLIST.forEach((g) => g.items.forEach((it) => (ITEM_MAP[it.id] = { ...it, group: g.group })));
const itemLabel = (id) => (ITEM_MAP[id] ? (ITEM_MAP[id].group === "Dịch vụ" ? "Dịch vụ: " : "") + ITEM_MAP[id].short : `Tiêu chí cũ (${id})`);

// ---------- Tiện ích ----------
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const pad = (n) => String(n).padStart(2, "0");
const fmt = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parse = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const vnDate = (s) => { const d = parse(s); return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`; };
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
const esc = (s = "") => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function weekStart(d) {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const wd = (x.getDay() + 6) % 7;
  return addDays(x, -wd);
}

function isoWeek(d) {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - day);
  const y0 = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  return Math.ceil(((t - y0) / 86400000 + 1) / 7);
}

const urlCache = new WeakMap();
function urlFor(item) {
  if (!item) return "";
  if (typeof item === "string") return item;
  if (item.url) return item.url;
  const blob = item.blob || item;
  if (blob instanceof Blob) {
    if (!urlCache.has(blob)) urlCache.set(blob, URL.createObjectURL(blob));
    return urlCache.get(blob);
  }
  return "";
}

function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(t._h);
  t._h = setTimeout(() => t.classList.remove("show"), 2500);
}

function scoreClass(s) {
  return s >= 90 ? "good" : s >= 75 ? "mid" : "low";
}

// ---------- IndexedDB & Firebase Hybrid Store ----------
const DB_NAME = "elevate-experience", STORE = "records";
let dbp;
function db() {
  if (!dbp) {
    dbp = new Promise((res, rej) => {
      const r = indexedDB.open(DB_NAME, 1);
      r.onupgradeneeded = () => {
        const s = r.result.createObjectStore(STORE, { keyPath: "id" });
        s.createIndex("date", "date");
      };
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    });
  }
  return dbp;
}

async function tx(mode, fn) {
  const d = await db();
  return new Promise((res, rej) => {
    const t = d.transaction(STORE, mode);
    const s = t.objectStore(STORE);
    const out = fn(s);
    t.oncomplete = () => res(out && out.result !== undefined ? out.result : out);
    t.onerror = () => rej(t.error);
  });
}

// ---------- Firebase Engine & Auth ----------
let fbApp = null, fbDb = null, fbStorage = null, fbAuth = null;
const FB_KEY = "ete_firebase_config";

let currentUser = null;
let isUserAdmin = false;

const ADMIN_EMAILS_KEY = "ete_admin_emails";
const ADMIN_STATUS_KEY = "ete_is_admin_override";
const DEFAULT_ADMIN_EMAILS = [
  "phongnhh@gmail.com",
  "laotuung@gmail.com",
  "admin@trainghienkhachhang.online"
];

function getAdminEmails() {
  try {
    const custom = JSON.parse(localStorage.getItem(ADMIN_EMAILS_KEY)) || [];
    return [...new Set([...DEFAULT_ADMIN_EMAILS, ...custom])];
  } catch {
    return DEFAULT_ADMIN_EMAILS;
  }
}

function computeIsAdmin(user) {
  if (!user) return false;
  if (localStorage.getItem(ADMIN_STATUS_KEY) === "true") return true;
  if (!user.email) return false;
  const list = getAdminEmails().map((e) => e.toLowerCase());
  return list.includes(user.email.toLowerCase());
}

function updateAuthUI() {
  const avatarEl = $("#headerUserAvatar");
  const loginOverlay = $("#loginOverlay");

  if (!currentUser) {
    if (loginOverlay) loginOverlay.hidden = false;
    if (avatarEl) {
      avatarEl.innerHTML = "?";
      avatarEl.title = "Chưa đăng nhập";
    }
    document.body.classList.add("role-staff");
    document.body.classList.remove("role-admin");
    return;
  }

  if (loginOverlay) loginOverlay.hidden = true;
  isUserAdmin = computeIsAdmin(currentUser);

  if (avatarEl) {
    if (currentUser.photoURL) {
      avatarEl.innerHTML = `<img src="${esc(currentUser.photoURL)}" alt="${esc(currentUser.displayName || 'User')}" referrerpolicy="no-referrer" />`;
    } else {
      const initial = (currentUser.displayName || currentUser.email || "U").charAt(0).toUpperCase();
      avatarEl.innerHTML = initial;
    }
    avatarEl.title = `${currentUser.displayName || currentUser.email} (${isUserAdmin ? "Quản trị viên" : "Nhân sự"})`;
  }

  if (isUserAdmin) {
    document.body.classList.remove("role-staff");
    document.body.classList.add("role-admin");
  } else {
    document.body.classList.remove("role-admin");
    document.body.classList.add("role-staff");
  }

  const activeTab = document.querySelector(".b-tab.active")?.dataset?.tab;
  if (!isUserAdmin && (activeTab === "history" || activeTab === "settings")) {
    switchTab("dashboard");
  }
}

// Load cached user early
try {
  const cached = localStorage.getItem("ete_cached_user");
  if (cached) currentUser = JSON.parse(cached);
} catch {}

function getActiveFirebaseConfig() {
  try {
    const saved = localStorage.getItem(FB_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  if (window.FIREBASE_CONFIG && window.FIREBASE_CONFIG.apiKey && window.FIREBASE_CONFIG.apiKey !== "YOUR_API_KEY") {
    return window.FIREBASE_CONFIG;
  }
  return null;
}

function initFirebase() {
  if (typeof firebase === "undefined") {
    updateAuthUI();
    return;
  }
  const cfg = getActiveFirebaseConfig();
  const statusEl = $("#firebaseStatus");
  const discBtn = $("#btnDisconnectFirebase");

  if (!cfg) {
    if (statusEl) statusEl.innerHTML = "Trạng thái: ⚪ Chưa kết nối (đang chạy bộ nhớ máy)";
    if (discBtn) discBtn.style.display = "none";
    updateAuthUI();
    return;
  }

  try {
    if (!firebase.apps.length) {
      fbApp = firebase.initializeApp(cfg);
    } else {
      fbApp = firebase.app();
    }
    fbDb = firebase.firestore();
    fbStorage = firebase.storage();

    if (firebase.auth) {
      fbAuth = firebase.auth();
      fbAuth.onAuthStateChanged((user) => {
        if (user) {
          currentUser = {
            uid: user.uid,
            email: user.email || "",
            displayName: user.displayName || user.email?.split("@")[0] || "Nhân sự",
            photoURL: user.photoURL || ""
          };
          localStorage.setItem("ete_cached_user", JSON.stringify(currentUser));
        } else {
          const cached = localStorage.getItem("ete_cached_user");
          if (cached) {
            try { currentUser = JSON.parse(cached); } catch {}
          }
        }
        updateAuthUI();
      });
    } else {
      updateAuthUI();
    }

    if (statusEl) statusEl.innerHTML = `Trạng thái: 🟢 Đã kết nối Cloud (<b style="color:#0284c7">${esc(cfg.projectId || "Firebase")}</b>)`;
    if (discBtn) discBtn.style.display = "inline-block";

    fbDb.collection("records").onSnapshot(
      () => {
        renderDashboard();
        refreshLists();
      },
      (err) => console.warn("Firestore snapshot:", err)
    );
  } catch (e) {
    console.error("Firebase init error:", e);
    if (statusEl) statusEl.innerHTML = `Trạng thái: 🔴 Lỗi cấu hình (${esc(e.message)})`;
    updateAuthUI();
  }
}

async function putRecord(r) {
  await tx("readwrite", (s) => s.put(r));
  if (fbDb) {
    try {
      const fbRec = { ...r };
      if (fbStorage && Array.isArray(r.media) && r.media.length) {
        fbRec.media = await Promise.all(
          r.media.map(async (m, i) => {
            if (m.url) return { name: m.name, type: m.type, url: m.url };
            if (m.blob instanceof Blob) {
              try {
                const path = `ete_media/${r.id}_${i}_${m.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
                const ref = fbStorage.ref(path);
                await ref.put(m.blob);
                const url = await ref.getDownloadURL();
                return { name: m.name, type: m.type, url };
              } catch (err) {
                console.warn("Storage upload err:", err);
              }
            }
            return { name: m.name, type: m.type, url: "" };
          })
        );
      } else {
        fbRec.media = (r.media || []).map((m) => ({ name: m.name, type: m.type, url: m.url || "" }));
      }
      await fbDb.collection("records").doc(r.id).set(fbRec);
    } catch (err) {
      console.warn("Firebase putRecord failed:", err);
    }
  }
}

async function allRecords() {
  if (fbDb) {
    try {
      const snap = await fbDb.collection("records").get();
      if (!snap.empty) {
        const list = snap.docs.map((d) => d.data());
        for (const item of list) {
          await tx("readwrite", (s) => s.put(item));
        }
        return list;
      }
    } catch (err) {
      console.warn("Firebase fetch fallback:", err);
    }
  }
  return tx("readonly", (s) => s.getAll());
}

async function deleteRecord(id) {
  await tx("readwrite", (s) => s.delete(id));
  if (fbDb) {
    try {
      await fbDb.collection("records").doc(id).delete();
    } catch (err) {
      console.warn("Firebase deleteRecord failed:", err);
    }
  }
}

const clearRecords = () => tx("readwrite", (s) => s.clear());

// ---------- Xử lý nén ảnh & upload ----------
async function compressImage(file, max = 1600, q = 0.82) {
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
    const c = document.createElement("canvas");
    c.width = Math.round(bmp.width * scale);
    c.height = Math.round(bmp.height * scale);
    c.getContext("2d").drawImage(bmp, 0, 0, c.width, c.height);
    const blob = await new Promise((r) => c.toBlob(r, "image/jpeg", q));
    return blob && blob.size < file.size ? blob : file;
  } catch {
    return file;
  }
}

function setupUploader(inputSel, previewSel, allowVideo) {
  const state = { files: [] };
  const input = $(inputSel), box = $(previewSel);
  const render = () => {
    box.innerHTML = state.files
      .map((f, i) => {
        const isV = f.type.startsWith("video");
        const media = isV
          ? `<video src="${urlFor(f.blob)}" muted></video>`
          : `<img src="${urlFor(f.blob)}" />`;
        return `
          <div class="pv-thumb">
            ${media}
            <button type="button" class="del-btn" data-i="${i}">✕</button>
            ${isV ? '<span class="video-badge">VIDEO</span>' : ""}
          </div>`;
      })
      .join("");
  };

  box.addEventListener("click", (e) => {
    const b = e.target.closest(".del-btn");
    if (b) {
      state.files.splice(+b.dataset.i, 1);
      render();
    }
  });

  input.addEventListener("change", async () => {
    for (const f of input.files) {
      if (f.type.startsWith("image")) {
        state.files.push({ name: f.name, type: "image/jpeg", blob: await compressImage(f) });
      } else if (allowVideo && f.type.startsWith("video")) {
        if (f.size > 200 * 1024 * 1024) {
          toast(`Video "${f.name}" > 200MB, vui lòng chọn file nhỏ hơn`);
          continue;
        }
        state.files.push({ name: f.name, type: f.type, blob: f });
      }
    }
    input.value = "";
    render();
  });

  state.reset = () => {
    state.files = [];
    render();
  };
  return state;
}

// ---------- Tab switching (Bottom bar only) ----------
function switchTab(tabId) {
  if (!isUserAdmin && (tabId === "history" || tabId === "settings")) {
    toast("⚠️ Mục này chỉ dành cho Quản trị viên (Admin). Bạn có quyền trên: Tổng quan, Briefing và Checklist.");
    tabId = "dashboard";
  }

  $$(".b-tab").forEach((b) => b.classList.toggle("active", b.dataset.tab === tabId));
  $$(".tab-pane").forEach((t) => t.classList.toggle("active", t.id === "tab-" + tabId));
  $("#headerDate").classList.toggle("hidden", tabId !== "dashboard");
  window.scrollTo({ top: 0, behavior: "smooth" });

  if (tabId === "dashboard") renderDashboard();
  if (tabId === "history") renderHistory();
  if (tabId === "settings") renderStorage();
}

$("#bottomTabs").addEventListener("click", (e) => {
  const b = e.target.closest(".b-tab");
  if (b) switchTab(b.dataset.tab);
});

// ---------- Interactive Area Selection Pills (Weather-style in screenshot) ----------
function setupAreaPills() {
  $$(".area-pills").forEach((grid) => {
    const targetSelect = $(grid.dataset.target);
    grid.addEventListener("click", (e) => {
      const btn = e.target.closest(".pill-opt");
      if (!btn) return;
      const val = btn.dataset.val;
      $$(".pill-opt", grid).forEach((p) => p.classList.toggle("active", p === btn));
      if (targetSelect) {
        targetSelect.value = val;
        targetSelect.dispatchEvent(new Event("change"));
      }
    });
  });
}

function syncAreaPills(form, val = "") {
  const grid = $(".area-pills", form);
  if (!grid) return;
  $$(".pill-opt", grid).forEach((p) => p.classList.toggle("active", p.dataset.val === val));
}

// ---------- Xác nhận trước khi gửi báo cáo ----------
function showConfirmDialog({ icon, title, contentHtml, onConfirm }) {
  const modal = $("#confirmModal");
  if (!modal) return;
  $("#confirmIcon").textContent = icon || "📋";
  $("#confirmTitle").textContent = title || "Xác nhận gửi báo cáo";
  $("#confirmBody").innerHTML = contentHtml;

  const btnCancel = $("#btnConfirmCancel");
  const btnOk = $("#btnConfirmOk");

  const cleanup = () => {
    modal.hidden = true;
    btnCancel.onclick = null;
    btnOk.onclick = null;
  };

  btnCancel.onclick = () => cleanup();

  btnOk.onclick = async () => {
    btnOk.disabled = true;
    btnOk.innerHTML = "⏳ Đang lưu kết quả...";
    try {
      await onConfirm();
      cleanup();
    } catch (err) {
      alert("Lỗi khi lưu dữ liệu: " + err.message);
    } finally {
      btnOk.disabled = false;
      btnOk.innerHTML = "✅ Xác nhận & Gửi lưu";
    }
  };

  modal.hidden = false;
}

// ---------- Briefing ----------
const briefUp = setupUploader("#briefingFiles", "#briefingPreviews", false);

$("#briefingForm").addEventListener("reset", (e) => {
  setTimeout(() => {
    e.target.date.value = fmt(new Date());
    syncAreaPills(e.target, "");
    briefUp.reset();
  });
});

$("#briefingForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const f = e.target;
  if (!f.area.value) return toast("Vui lòng chọn khu vực briefing");
  if (!briefUp.files.length) return toast("Vui lòng chụp hoặc thêm hình ảnh báo cáo");

  const area = f.area.value.trim();
  const leader = f.leader.value.trim();
  const attendees = +f.attendees.value || 0;
  const date = f.date.value;
  const note = f.note.value.trim();
  const mediaCount = briefUp.files.length;
  const authorName = currentUser?.displayName || "Nhân sự Vận hành";
  const authorEmail = currentUser?.email || "";

  const contentHtml = `
    <div class="confirm-table">
      <div class="confirm-row">
        <span class="confirm-label">Loại báo cáo:</span>
        <span class="confirm-val highlight">🎓 Đào tạo & Briefing đầu ca</span>
      </div>
      <div class="confirm-row">
        <span class="confirm-label">Ngày thực hiện:</span>
        <span class="confirm-val">${esc(date)}</span>
      </div>
      <div class="confirm-row">
        <span class="confirm-label">Khu vực:</span>
        <span class="confirm-val">${esc(area)}</span>
      </div>
      <div class="confirm-row">
        <span class="confirm-label">Người chủ trì:</span>
        <span class="confirm-val">${esc(leader || "(Chưa nhập)")}</span>
      </div>
      <div class="confirm-row">
        <span class="confirm-label">Số người tham gia:</span>
        <span class="confirm-val">${attendees} nhân sự</span>
      </div>
      <div class="confirm-row">
        <span class="confirm-label">Hình ảnh đính kèm:</span>
        <span class="confirm-val">${mediaCount} ảnh đã chụp</span>
      </div>
      ${note ? `
      <div class="confirm-row">
        <span class="confirm-label">Ghi chú:</span>
        <span class="confirm-val">${esc(note)}</span>
      </div>` : ""}
      <div class="confirm-row" style="border-bottom:none;margin-top:8px;background:#f8fafc;padding:6px 10px;border-radius:10px">
        <span class="confirm-label">Người gửi:</span>
        <span class="confirm-val" style="color:#0284c7">${esc(authorName)} ${authorEmail ? `(${esc(authorEmail)})` : ""}</span>
      </div>
    </div>
  `;

  showConfirmDialog({
    icon: "🎓",
    title: "Xác nhận gửi Báo cáo Briefing",
    contentHtml,
    onConfirm: async () => {
      await putRecord({
        id: uid(),
        type: "briefing",
        createdAt: Date.now(),
        leader: leader,
        content: f.content.value.trim() || DEFAULT_CONTENT,
        attendees: attendees,
        date: date,
        area: area,
        note: note,
        media: briefUp.files.slice(),
        author: {
          name: authorName,
          email: authorEmail,
          uid: currentUser?.uid || ""
        }
      });

      toast("✅ Đã gửi và lưu báo cáo Briefing thành công!");
      f.reset();
      refreshLists();
      switchTab("dashboard");
    }
  });
});

// ---------- Checklist ----------
const clUp = setupUploader("#checklistFiles", "#checklistPreviews", true);
let clResult = {};

function renderChecklistItems() {
  $("#checklistItems").innerHTML = CHECKLIST.map((g) => `
    ${g.items.map((it) => `
      <div class="cl-card ${clResult[it.id] === "fail" ? "fail" : ""}" data-id="${it.id}">
        <div class="cl-head">
          <div class="cl-head-text">
            <span class="cl-tag">${esc(g.group)}</span>
            <div class="cl-title">${esc(it.text)}</div>
          </div>
          <button type="button" class="cl-more" aria-expanded="false">Chi tiết ▾</button>
        </div>
        <div class="cl-brief">${esc(BRIEF[it.id] || "")}</div>
        <div class="cl-hint" hidden>${esc(it.hint)}</div>
        <div class="cl-action-btns">
          <button type="button" class="cl-btn ${clResult[it.id] === "pass" ? "on" : ""}" data-v="pass">
            <span>✅</span> <b>Đạt</b>
          </button>
          <button type="button" class="cl-btn ${clResult[it.id] === "fail" ? "on" : ""}" data-v="fail">
            <span>❌</span> <b>Không đạt</b>
          </button>
        </div>
      </div>`).join("")}
  `).join("");
  updateScore();
}

function calcScore(result) {
  const vals = Object.values(result);
  const p = vals.filter((v) => v === "pass").length;
  const fl = vals.filter((v) => v === "fail").length;
  return p + fl ? Math.round((p / (p + fl)) * 100) : null;
}

function updateScore() {
  const s = calcScore(clResult);
  const box = $("#scoreBox");
  const fails = Object.values(clResult).filter((v) => v === "fail").length;
  const done = Object.keys(clResult).length;
  const total = Object.keys(ITEM_MAP).length;

  if (done === 0) {
    box.innerHTML = `<span style="color:#64748b">Chưa đánh giá</span>`;
  } else if (done < total) {
    box.innerHTML = `<span style="color:#0284c7">Đã chọn ${done}/${total}</span>`;
  } else {
    box.innerHTML = fails === 0
      ? `<span style="color:var(--ok-green)">✅ ĐẠT (100%)</span>`
      : `<span style="color:var(--fail-red)">❌ K.ĐẠT (${fails} lỗi)</span>`;
  }
}

$("#checklistItems").addEventListener("click", (e) => {
  const more = e.target.closest(".cl-more");
  if (more) {
    const card = more.closest(".cl-card");
    const hint = $(".cl-hint", card);
    hint.hidden = !hint.hidden;
    more.textContent = hint.hidden ? "Chi tiết ▾" : "Thu gọn ▴";
    more.setAttribute("aria-expanded", String(!hint.hidden));
    return;
  }
});
$("#checklistItems").addEventListener("click", (e) => {
  const b = e.target.closest(".cl-btn");
  if (!b) return;
  const card = b.closest(".cl-card");
  const id = card.dataset.id;
  clResult[id] = b.dataset.v;

  $$(".cl-btn", card).forEach((x) => x.classList.toggle("on", x === b));
  card.classList.toggle("fail", b.dataset.v === "fail");
  updateScore();
});

$("#allPass").addEventListener("click", () => {
  Object.keys(ITEM_MAP).forEach((id) => (clResult[id] = "pass"));
  renderChecklistItems();
  toast("Đã chọn tất cả Đạt ✓");
});


// ---------- Danh sách nhân sự (cố định + tự thêm) ----------
const CUSTOM_KEY = "ete_custom_staff";
const getCustomStaff = () => { try { return JSON.parse(localStorage.getItem(CUSTOM_KEY)) || []; } catch { return []; } };
function fillEmployeeSelect() {
  const sel = $('#checklistForm select[name="employee"]');
  if (!sel) return;
  const cur = sel.value;
  const names = [...new Set([...STAFF, ...getCustomStaff()])];
  sel.innerHTML = '<option value="" disabled selected>-- Chọn nhân sự --</option>' + names.map((n) => `<option>${esc(n)}</option>`).join("") + '<option value="__other__">✍️ Khác (tự nhập tên)</option>';
  if (cur && names.includes(cur)) sel.value = cur;
}
function toggleEmployeeOther() {
  const other = $('#checklistForm select[name="employee"]').value === "__other__";
  $("#employeeOther").style.display = other ? "block" : "none";
  if (other) $("#employeeOther").focus();
}
$('#checklistForm select[name="employee"]').addEventListener("change", toggleEmployeeOther);
function addCustomStaff(name) {
  if (!name || STAFF.includes(name)) return;
  const list = getCustomStaff();
  if (list.includes(name)) return;
  list.push(name);
  localStorage.setItem(CUSTOM_KEY, JSON.stringify(list));
  fillEmployeeSelect();
}
function toggleCheckerOther() {
  const other = $("#checkerSelect").value === "__other__";
  $("#checkerOther").style.display = other ? "block" : "none";
  if (other) $("#checkerOther").focus();
}
$("#checkerSelect").addEventListener("change", toggleCheckerOther);
$("#checklistForm").addEventListener("reset", (e) => {
  setTimeout(() => {
    e.target.date.value = fmt(new Date());
    toggleCheckerOther();
    toggleEmployeeOther();
        syncAreaPills(e.target, "");
    clResult = {};
    renderChecklistItems();
    clUp.reset();
  });
});

$("#checklistForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const f = e.target;
  if (!f.area.value) return toast("Vui lòng chọn khu vực kiểm tra");
  let employee = f.employee.value;
  if (employee === "__other__") {
    employee = $("#employeeOther").value.trim().replace(/\s+/g, " ");
    if (!employee) return toast("Vui lòng nhập tên nhân sự được kiểm tra");
  }
  let checker = f.checker.value;
  if (checker === "__other__") {
    checker = $("#checkerOther").value.trim().replace(/\s+/g, " ");
    if (!checker) return toast("Vui lòng nhập tên người kiểm tra");
  }
  const missing = Object.keys(ITEM_MAP).filter((id) => !clResult[id]);
  if (missing.length) return toast(`Còn ${missing.length} tiêu chí chưa chọn kết quả`);
  if (!clUp.files.length) return toast("Vui lòng chụp ảnh hoặc tải video minh chứng");

  const fails = Object.keys(clResult).filter((id) => clResult[id] === "fail");
  const score = calcScore(clResult) ?? 100;
  const area = f.area.value.trim();
  const date = f.date.value;
  const note = f.note.value.trim();
  const mediaCount = clUp.files.length;
  const authorName = currentUser?.displayName || "Nhân sự Vận hành";
  const authorEmail = currentUser?.email || "";

  const breakdownHtml = CHECKLIST.map((g) =>
    g.items.map((it) => {
      const isPass = clResult[it.id] === "pass";
      return `
        <div class="confirm-cl-item">
          <span>${esc(it.name)}</span>
          <span class="${isPass ? "badge-pass" : "badge-fail"}">${isPass ? "✓ Đạt" : "✗ Không đạt"}</span>
        </div>
      `;
    }).join("")
  ).join("");

  const contentHtml = `
    <div class="confirm-table">
      <div class="confirm-row">
        <span class="confirm-label">Loại báo cáo:</span>
        <span class="confirm-val highlight">📋 Checklist Kiểm tra Nhân sự</span>
      </div>
      <div class="confirm-row">
        <span class="confirm-label">Ngày kiểm tra:</span>
        <span class="confirm-val">${esc(date)}</span>
      </div>
      <div class="confirm-row">
        <span class="confirm-label">Khu vực:</span>
        <span class="confirm-val">${esc(area)}</span>
      </div>
      <div class="confirm-row">
        <span class="confirm-label">Người kiểm tra:</span>
        <span class="confirm-val">${esc(checker)}</span>
      </div>
      <div class="confirm-row">
        <span class="confirm-label">Nhân sự được kiểm tra:</span>
        <span class="confirm-val" style="color:#d97706;font-size:14px">${esc(employee)}</span>
      </div>
      <div class="confirm-row">
        <span class="confirm-label">Điểm đánh giá:</span>
        <span class="confirm-val" style="color:${score >= 80 ? "#15803d" : "#b91c1c"}">${score} / 100 điểm</span>
      </div>
      <div class="confirm-row">
        <span class="confirm-label">Minh chứng (ảnh/video):</span>
        <span class="confirm-val">${mediaCount} tệp đính kèm</span>
      </div>
      ${note ? `
      <div class="confirm-row">
        <span class="confirm-label">Ghi chú:</span>
        <span class="confirm-val">${esc(note)}</span>
      </div>` : ""}

      <div style="margin-top:10px;font-size:12px;font-weight:700;color:#334155">Kết quả 4 tiêu chí đánh giá:</div>
      <div class="confirm-cl-breakdown">
        ${breakdownHtml}
      </div>

      <div class="confirm-row" style="border-bottom:none;margin-top:8px;background:#f8fafc;padding:6px 10px;border-radius:10px">
        <span class="confirm-label">Người ghi nhận:</span>
        <span class="confirm-val" style="color:#0284c7">${esc(authorName)} ${authorEmail ? `(${esc(authorEmail)})` : ""}</span>
      </div>
    </div>
  `;

  showConfirmDialog({
    icon: "✅",
    title: "Xác nhận Kết quả Kiểm tra Nhân sự",
    contentHtml,
    onConfirm: async () => {
      await putRecord({
        id: uid(),
        type: "checklist",
        createdAt: Date.now(),
        date: date,
        area: area,
        checker,
        employee,
        result: { ...clResult },
        fails,
        score,
        note: note,
        media: clUp.files.slice(),
        author: {
          name: authorName,
          email: authorEmail,
          uid: currentUser?.uid || ""
        }
      });

      if (f.checker.value === "__other__") addCustomStaff(checker);
      if (f.employee.value === "__other__") addCustomStaff(employee);
      toast("✅ Đã lưu kết quả kiểm tra thành công!");
      f.reset();
      refreshLists();
      switchTab("dashboard");
    }
  });
});

// Gợi ý tên đã nhập
async function refreshLists() {
  const all = await allRecords();
  const fill = (sel, vals) => ($(sel).innerHTML = [...new Set(vals.filter(Boolean))].sort().map((n) => `<option value="${esc(n)}">`).join(""));
  fill("#leaderList", all.filter((r) => r.type === "briefing").map((r) => r.leader));
}

// ---------- Dashboard ----------
let curWeek = weekStart(new Date());
$("#prevWeek").onclick = () => { curWeek = addDays(curWeek, -7); renderDashboard(); };
$("#nextWeek").onclick = () => { curWeek = addDays(curWeek, 7); renderDashboard(); };

function inRange(r, start) {
  const a = fmt(start), b = fmt(addDays(start, 6));
  return r.date >= a && r.date <= b;
}

function trendHtml(cur, prev, lowerIsBetter = true) {
  const diff = cur - prev;
  if (diff === 0) return `<span class="trend eq">= tuần trước</span>`;
  const bad = lowerIsBetter ? diff > 0 : diff < 0;
  return `<span class="trend ${bad ? "up" : "down"}">${diff > 0 ? "▲" : "▼"} ${Math.abs(diff)} vs tuần trước</span>`;
}

function staffStats(cl) {
  const st = {};
  cl.forEach((r) => {
    const s = (st[r.employee] ||= { name: r.employee, fails: 0, n: 0, sum: 0, crit: {}, areas: new Set() });
    s.fails += r.fails.length;
    s.n++;
    s.sum += r.score;
    s.areas.add(r.area);
    r.fails.forEach((id) => (s.crit[id] = (s.crit[id] || 0) + 1));
  });
  Object.values(st).forEach((s) => (s.avg = Math.round(s.sum / s.n)));
  return st;
}

async function renderDashboard() {
  const all = await allRecords();
  const prevStart = addDays(curWeek, -7);
  const wk = all.filter((r) => inRange(r, curWeek)), pw = all.filter((r) => inRange(r, prevStart));
  const br = wk.filter((r) => r.type === "briefing"), pbr = pw.filter((r) => r.type === "briefing");
  const cl = wk.filter((r) => r.type === "checklist"), pcl = pw.filter((r) => r.type === "checklist");
  const end = addDays(curWeek, 6);

  const dmy = (d) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
  $("#weekLabel").textContent = `${dmy(curWeek)} – ${dmy(end)}`;

  // Calculations
  const sumAtt = (a) => a.reduce((s, r) => s + (r.attendees || 0), 0);
  const sumFails = (a) => a.reduce((s, r) => s + r.fails.length, 0);
  const avg = (a) => (a.length ? Math.round(a.reduce((s, r) => s + (r.score || 0), 0) / a.length) : 0);
  const passRate = (a) => (a.length ? Math.round((a.filter((r) => r.score >= 90).length / a.length) * 100) : 0);

  const st = staffStats(cl), pst = staffStats(pcl);
  const vio = Object.values(st).filter((s) => s.fails > 0).sort((a, b) => b.fails - a.fails || a.avg - b.avg).slice(0, 10);

  // Update Alert Badge in Header
  $("#headerAlertCount").textContent = sumFails(cl);

  // (a) Briefing summary table
  const byLeader = {};
  br.forEach((r) => {
    const x = (byLeader[r.leader] ||= { n: 0, att: 0 });
    x.n++;
    x.att += r.attendees || 0;
  });
  const leaders = Object.entries(byLeader).sort((a, b) => b[1].n - a[1].n || b[1].att - a[1].att);
  $("#briefingWeek").innerHTML = leaders.length
    ? `
    <table class="lead-table">
      <thead><tr><th>Nhân sự chủ trì</th><th>Số buổi</th><th>Tổng NS</th></tr></thead>
      <tbody>${leaders.map(([n, x]) => `<tr><td><b>${esc(n)}</b></td><td>${x.n}</td><td>${x.att}</td></tr>`).join("")}</tbody>
      <tfoot><tr><td>Tổng cộng</td><td>${br.length}</td><td>${sumAtt(br)}</td></tr></tfoot>
    </table>`
    : `<div class="empty-state">Chưa có buổi Briefing nào trong tuần này</div>`;

  // (b) Top 2 xuất sắc nhất
  const bests = Object.values(st).sort((a, b) => b.avg - a.avg || a.fails - b.fails || b.n - a.n).slice(0, 2);
  const medals = ["🥇", "🥈"];
  $("#bestStaff").innerHTML = bests.length
    ? bests.map((best, i) => `
    <div class="bc-item">
      <div class="bc-medal">${medals[i]}</div>
      <div class="bc-name">${esc(best.name)}</div>
      <div class="bc-meta">${[...best.areas].map(esc).join(", ")}</div>
      <div class="bc-score">${best.avg}%</div>
      <div class="bc-sub">${best.n} lượt · ${best.fails} lỗi</div>
    </div>`).join("")
    : `<div class="empty-state">Chưa có dữ liệu đánh giá trong tuần này</div>`;

  // (c) Top 10 Violations
  $("#topStaff").innerHTML = vio.length
    ? vio
        .map(
          (s, i) => `
    <div class="vio-item">
      <div class="vio-rank r${i + 1}">${i + 1}</div>
      <div class="vio-details">
        <div class="vio-name">${esc(s.name)}</div>
        <div class="vio-meta">${[...s.areas].map(esc).join(", ")} · ${s.n} lượt · TB <span class="score-badge ${scoreClass(s.avg)}">${s.avg}%</span></div>
        <div class="vio-chips">
          ${Object.entries(s.crit)
            .sort((a, b) => b[1] - a[1])
            .map(([id, c]) => `<span class="vio-chip">${esc(itemLabel(id))} ×${c}</span>`)
            .join("")}
        </div>
      </div>
      <div class="vio-count-badge">${s.fails}<small>lỗi</small></div>
    </div>`
        )
        .join("")
    : `<div class="empty-state">🎉 Không có nhân sự vi phạm trong tuần này!</div>`;
}


// ---------- History ----------
["#histType", "#histArea", "#histFrom", "#histTo", "#histSearch"].forEach((s) => $(s)?.addEventListener("input", renderHistory));

async function renderHistory() {
  const type = $("#histType").value;
  const area = $("#histArea")?.value || "";
  const from = $("#histFrom").value;
  const to = $("#histTo").value;
  const q = $("#histSearch").value.toLowerCase();

  const list = (await allRecords())
    .filter((r) => (type === "all" || r.type === type) && (!area || r.area === area) && (!from || r.date >= from) && (!to || r.date <= to))
    .filter((r) => !q || [r.area, r.leader, r.employee, r.checker, r.note, r.content].join(" ").toLowerCase().includes(q))
    .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt);

  $("#historyList").innerHTML = list.length
    ? list
        .map((r) => {
          const img = r.media.find((m) => m.type.startsWith("image"));
          const vids = r.media.filter((m) => m.type.startsWith("video")).length;
          const thumb = img ? `background-image:url('${urlFor(img.blob)}')` : "";
          const title = r.type === "briefing" ? `${esc(r.content || DEFAULT_CONTENT)}` : `${esc(r.employee)}`;
          const resultTag = r.fails?.length === 0 ? "ĐẠT" : "K.ĐẠT";
          const sub =
            r.type === "briefing"
              ? `Chủ trì: <b>${esc(r.leader)}</b> · ${r.attendees} NS tham gia`
              : `Kiểm tra: <b>${esc(r.checker)}</b> · <span class="score-badge ${scoreClass(r.score)}">${resultTag}</span> (${r.fails.length} lỗi)`;

          return `
      <div class="h-record-card" data-id="${r.id}">
        <div class="h-thumb-box" style="${thumb}">
          <span class="h-badge ${r.type}">${r.type === "briefing" ? "BRIEFING" : "CHECKLIST"}</span>
          <span class="h-media-count">📷 ${r.media.length - vids}${vids ? ` · 🎬 ${vids}` : ""}</span>
        </div>
        <div class="h-details">
          <div class="h-title">${title}</div>
          <div class="h-meta">${vnDate(r.date)} · ${esc(r.area)}</div>
          <div class="h-sub">${sub}</div>
        </div>
      </div>`;
        })
        .join("")
    : `<div class="empty-state mobile-card">Chưa có báo cáo nào phù hợp bộ lọc</div>`;
}

$("#historyList").addEventListener("click", async (e) => {
  const c = e.target.closest(".h-record-card");
  if (!c) return;
  const r = (await allRecords()).find((x) => x.id === c.dataset.id);
  if (r) openDetail(r);
});

function openDetail(r) {
  const gallery = `<div class="modal-gallery">${r.media
    .map((m) =>
      m.type.startsWith("video")
        ? `<video src="${urlFor(m.blob)}" controls></video>`
        : `<a href="${urlFor(m.blob)}" target="_blank"><img src="${urlFor(m.blob)}" /></a>`
    )
    .join("")}</div>`;

  let body;
  if (r.type === "briefing") {
    body = `
      <div class="sec-title">
        <span class="sec-icon">🎓</span>
        <h3>BÁO CÁO BRIEFING ĐẦU CA</h3>
      </div>
      <div class="modal-kv">
        <div>Nhân sự chủ trì</div><div><b>${esc(r.leader)}</b></div>
        <div>Nội dung</div><div>${esc(r.content || DEFAULT_CONTENT)}</div>
        <div>Số NS tham gia</div><div><b>${r.attendees}</b> người</div>
        <div>Ngày</div><div>${vnDate(r.date)}</div>
        <div>Khu vực</div><div>${esc(r.area)}</div>
        <div>Ghi chú</div><div>${esc(r.note) || "–"}</div>
      </div>`;
  } else {
    const rows = Object.keys(ITEM_MAP)
      .map((id) => {
        const v = r.result?.[id];
        const isFail = v === "fail";
        return `<li style="color:${isFail ? "var(--fail-red)" : "var(--ok-green)"};margin-bottom:4px">
          ${esc(itemLabel(id))}: <b>${isFail ? "❌ Không đạt" : "✅ Đạt"}</b>
        </li>`;
      })
      .join("");

    body = `
      <div class="sec-title">
        <span class="sec-icon">✅</span>
        <h3>KẾT QUẢ KIỂM TRA NHÂN SỰ</h3>
      </div>
      <div class="modal-kv">
        <div>Nhân sự</div><div><b>${esc(r.employee)}</b></div>
        <div>Ngày</div><div>${vnDate(r.date)}</div>
        <div>Khu vực</div><div>${esc(r.area)}</div>
        <div>Người kiểm tra</div><div><b>${esc(r.checker)}</b></div>
        <div>Kết quả</div><div><span class="score-badge ${scoreClass(r.score)}">${r.fails.length === 0 ? "✅ ĐẠT" : "❌ KHÔNG ĐẠT"}</span> (${r.score}% · ${r.fails.length} lỗi)</div>
        <div>Ghi chú</div><div>${esc(r.note) || "–"}</div>
      </div>
      <h4 style="margin:14px 0 6px;font-size:13px;text-transform:uppercase">Tiêu chí đánh giá</h4>
      <ul style="padding-left:18px;margin:0 0 10px">${rows}</ul>`;
  }

  $("#modalBody").innerHTML =
    body +
    `<h4 style="margin:14px 0 6px;font-size:13px;text-transform:uppercase">Hình ảnh / Video (${r.media.length})</h4>` +
    gallery +
    `<div style="margin-top:16px"><button class="btn-sub" id="delRec" style="color:var(--fail-red);width:100%">🗑️ Xóa báo cáo này</button></div>`;

  $("#modal").hidden = false;
  $("#delRec").onclick = async () => {
    if (!confirm("Xác nhận xóa báo cáo này?")) return;
    await deleteRecord(r.id);
    closeModal();
    renderHistory();
    toast("Đã xóa báo cáo");
  };
}

function closeModal() {
  $("#modal").hidden = true;
  $$("#modalBody video").forEach((v) => v.pause());
}
$("#modalClose").onclick = closeModal;
$("#modal").addEventListener("click", (e) => {
  if (e.target.id === "modal") closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

// ---------- Dữ liệu: export / import / demo ----------
function download(name, blob) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
const blobToDataURL = (b) =>
  new Promise((res) => {
    const fr = new FileReader();
    fr.onload = () => res(fr.result);
    fr.readAsDataURL(b);
  });
const csvCell = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
const toCsv = (rows) => "\uFEFF" + rows.map((l) => l.map(csvCell).join(",")).join("\r\n");

$("#exportCsv").onclick = async () => {
  const all = (await allRecords()).sort((a, b) => a.date.localeCompare(b.date));
  const res = (r, id) => ({ pass: "Đạt", fail: "Không đạt" }[r.result?.[id]] || "");
  const cl = all.filter((r) => r.type === "checklist");
  download(
    `checklist_${fmt(new Date())}.csv`,
    new Blob(
      [
        toCsv([
          ["Ngày", "Tuần", "Khu vực", "Nhân sự được kiểm tra", "Người kiểm tra", ...Object.keys(ITEM_MAP).map(itemLabel), "Điểm %", "Số lỗi", "Ghi chú", "Số file"],
          ...cl.map((r) => [
            vnDate(r.date),
            isoWeek(parse(r.date)),
            r.area,
            r.employee,
            r.checker,
            ...Object.keys(ITEM_MAP).map((id) => res(r, id)),
            r.score,
            r.fails.length,
            r.note,
            r.media.length,
          ]),
        ]),
      ],
      { type: "text/csv;charset=utf-8" }
    )
  );

  const br = all.filter((r) => r.type === "briefing");
  download(
    `briefing_${fmt(new Date())}.csv`,
    new Blob(
      [
        toCsv([
          ["Ngày", "Tuần", "Nhân sự chủ trì", "Nội dung", "Số NS tham gia", "Khu vực", "Ghi chú", "Số ảnh"],
          ...br.map((r) => [vnDate(r.date), isoWeek(parse(r.date)), r.leader, r.content || DEFAULT_CONTENT, r.attendees, r.area, r.note, r.media.length]),
        ]),
      ],
      { type: "text/csv;charset=utf-8" }
    )
  );
  toast("Đã tải 2 file Excel thành công");
};

$("#exportJson").onclick = async (e) => {
  e.target.disabled = true;
  toast("Đang nén dữ liệu sao lưu...");
  const recs = await allRecords();
  for (const r of recs) {
    r.media = await Promise.all(
      r.media.map(async (m) => ({ name: m.name, type: m.type, data: await blobToDataURL(m.blob) }))
    );
  }
  download(
    `trainghienkhachhang_backup_${fmt(new Date())}.json`,
    new Blob([JSON.stringify({ app: "elevate-experience", version: 2, records: recs })], { type: "application/json" })
  );
  e.target.disabled = false;
};

$("#importJson").onchange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    for (const r of data.records) {
      r.media = await Promise.all(
        r.media.map(async (m) => ({ name: m.name, type: m.type, blob: await (await fetch(m.data)).blob() }))
      );
      await putRecord(r);
    }
    toast(`Đã khôi phục ${data.records.length} báo cáo`);
    renderStorage();
    refreshLists();
  } catch (err) {
    alert("File không hợp lệ: " + err.message);
  }
  e.target.value = "";
};

$("#clearAll").onclick = async () => {
  if (!confirm("Xác nhận xóa TOÀN BỘ dữ liệu? Hành động không thể hoàn tác.")) return;
  await clearRecords();
  toast("Đã xóa toàn bộ dữ liệu");
  renderStorage();
  refreshLists();
};

function demoImage(title, sub, color) {
  const c = document.createElement("canvas");
  c.width = 640;
  c.height = 420;
  const g = c.getContext("2d");
  const gr = g.createLinearGradient(0, 0, 640, 420);
  gr.addColorStop(0, color);
  gr.addColorStop(1, "#192030");
  g.fillStyle = gr;
  g.fillRect(0, 0, 640, 420);
  g.fillStyle = "#ffffff";
  g.textAlign = "center";
  g.font = "bold 32px -apple-system, BlinkMacSystemFont, Segoe UI, Roboto";
  g.fillText(title, 320, 200);
  g.font = "20px -apple-system, BlinkMacSystemFont, Segoe UI, Roboto";
  g.fillText(sub, 320, 245);
  return new Promise((r) => c.toBlob((b) => r({ name: "demo.jpg", type: "image/jpeg", blob: b }), "image/jpeg", 0.8));
}

$("#seedDemo").onclick = async () => {
  if (!window.__autoSeed && !confirm("Tạo dữ liệu mẫu cho 2 tuần gần nhất?")) return;
  const staff = STAFF;
  const skill = staff.map(() => 0.05 + Math.random() * 0.35);
  const areas = AREAS;
  const leaders = CHECKERS;
  const rnd = (a) => a[Math.floor(Math.random() * a.length)];
  const today = new Date();

  for (let i = 13; i >= 0; i--) {
    const ds = fmt(addDays(today, -i));
    for (let k = 0; k < 2; k++) {
      await putRecord({
        id: uid(),
        type: "briefing",
        createdAt: Date.now(),
        leader: rnd(leaders),
        content: DEFAULT_CONTENT,
        attendees: 8 + Math.floor(Math.random() * 10),
        date: ds,
        area: rnd(areas),
        note: "Briefing đầu ca hoàn tất an toàn",
        media: [await demoImage("BRIEFING ĐẦU CA", vnDate(ds), "#0e4e46")],
      });
    }

    for (let k = 0; k < 4; k++) {
      const idx = Math.floor(Math.random() * staff.length);
      const emp = staff[idx];
      const result = {};
      Object.keys(ITEM_MAP).forEach(
        (id) => (result[id] = Math.random() < skill[idx] * (id.startsWith("tien") || id.startsWith("don") ? 1.2 : 0.8) ? "fail" : "pass")
      );
      const fails = Object.keys(result).filter((id) => result[id] === "fail");
      await putRecord({
        id: uid(),
        type: "checklist",
        createdAt: Date.now(),
        date: ds,
        area: rnd(areas),
        checker: rnd(leaders),
        employee: emp,
        result,
        fails,
        score: calcScore(result),
        note: fails.length ? "Đã nhắc nhở cải thiện trực tiếp" : "Rất tốt, phát huy",
        media: [await demoImage("CHECKLIST NHÂN SỰ", emp, "#ea580c")],
      });
    }
  }

  toast("Đã tạo dữ liệu mẫu thành công");
  renderDashboard();
  renderStorage();
  refreshLists();
};

async function renderStorage() {
  const recs = await allRecords();
  const b = recs.filter((r) => r.type === "briefing").length;
  const c = recs.length - b;
  let info = `Đang lưu: ${b} báo cáo Briefing, ${c} báo cáo Checklist.`;
  if (navigator.storage?.estimate) {
    const e = await navigator.storage.estimate();
    info += ` Dung lượng đã dùng: ${(e.usage / 1048576).toFixed(1)} MB / ${(e.quota / 1073741824).toFixed(1)} GB.`;
  }
  $("#storageInfo").textContent = info;
}

// Header buttons
$("#btnRefresh")?.addEventListener("click", () => {
  renderDashboard();
  renderHistory();
  refreshLists();
  toast("Đã làm mới dữ liệu ✓");
});

$("#btnAlerts")?.addEventListener("click", () => {
  switchTab("dashboard");
  setTimeout(() => {
    $("#sec-top-warnings")?.scrollIntoView({ behavior: "smooth" });
  }, 100);
});

$("#fabScrollTop")?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ---------- Google Auth & User Profile Handlers ----------
$("#btnGoogleLogin")?.addEventListener("click", async () => {
  if (!fbAuth) {
    const name = prompt("Nhập họ tên của bạn để đăng nhập:", "Nhân viên Vận hành");
    if (!name) return;
    currentUser = {
      uid: "user_" + Date.now(),
      displayName: name,
      email: name.toLowerCase().replace(/[^a-z0-9]/g, "") + "@banahills.sunworld.vn",
      photoURL: ""
    };
    localStorage.setItem("ete_cached_user", JSON.stringify(currentUser));
    updateAuthUI();
    toast(`👋 Chào mừng ${currentUser.displayName}!`);
    return;
  }

  const provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  try {
    toast("Đang mở đăng nhập Google...");
    const res = await fbAuth.signInWithPopup(provider);
    currentUser = {
      uid: res.user.uid,
      displayName: res.user.displayName || "Nhân sự",
      email: res.user.email || "",
      photoURL: res.user.photoURL || ""
    };
    localStorage.setItem("ete_cached_user", JSON.stringify(currentUser));
    updateAuthUI();
    toast(`👋 Đăng nhập thành công! Chào ${currentUser.displayName}`);
  } catch (err) {
    console.error("Google sign-in error:", err);
    if (err.code === "auth/popup-blocked" || err.code === "auth/popup-closed-by-user") {
      try {
        await fbAuth.signInWithRedirect(provider);
        return;
      } catch {}
    }
    if (err.code === "auth/operation-not-allowed" || err.code === "auth/configuration-not-found") {
      alert("⚠️ Tài khoản Google chưa được kích hoạt trong Firebase Console.\n\nVui lòng vào Firebase Console -> Authentication -> Sign-in method -> Bật Google -> Save.\n\n(Hiện tại bạn có thể bấm 'Dùng thử nhanh (Chế độ Khách)' để vào trải nghiệm ngay).");
    } else {
      alert("Đăng nhập Google: " + (err.message || err));
    }
  }
});

$("#btnGuestMode")?.addEventListener("click", () => {
  currentUser = {
    uid: "guest_" + Date.now(),
    displayName: "Nhân sự Vận hành",
    email: "nhansu@banahills.sunworld.vn",
    photoURL: ""
  };
  localStorage.setItem("ete_cached_user", JSON.stringify(currentUser));
  updateAuthUI();
  toast("Đã đăng nhập chế độ Nhân sự ✓");
});

// Click avatar opens Profile Modal
$("#headerUserAvatar")?.addEventListener("click", () => {
  if (!currentUser) {
    $("#loginOverlay").hidden = false;
    return;
  }
  const modal = $("#profileModal");
  if (!modal) return;

  $("#profileName").textContent = currentUser.displayName || "Người dùng";
  $("#profileEmail").textContent = currentUser.email || "(Chưa có email)";

  const avatarLarge = $("#profileAvatarLarge");
  if (currentUser.photoURL) {
    avatarLarge.innerHTML = `<img src="${esc(currentUser.photoURL)}" alt="avatar" referrerpolicy="no-referrer" />`;
  } else {
    avatarLarge.innerHTML = (currentUser.displayName || currentUser.email || "U").charAt(0).toUpperCase();
  }

  const roleBadge = $("#profileRoleBadge");
  const scopeText = $("#profileScopeText");
  const btnToggleAdmin = $("#btnToggleAdminCode");

  if (isUserAdmin) {
    roleBadge.className = "role-pill admin";
    roleBadge.innerHTML = "👑 Quản trị viên (Admin)";
    scopeText.innerHTML = "<b>Phạm vi thao tác:</b><br />• 🌟 Toàn quyền quản trị hệ thống<br />• 📊 <b>Tổng quan:</b> Xem bảng xếp hạng tuần<br />• 🎓 <b>Briefing:</b> Báo cáo đào tạo đầu ca<br />• ✅ <b>Checklist:</b> Kiểm tra nhân sự<br />• 📜 <b>Lịch sử:</b> Xem tất cả & Xóa báo cáo<br />• ⚙️ <b>Menu:</b> Cài đặt Cloud & Quản trị";
    btnToggleAdmin.textContent = "🔒 Khóa về quyền Nhân viên";
  } else {
    roleBadge.className = "role-pill staff";
    roleBadge.innerHTML = "👤 Nhân sự (Staff)";
    scopeText.innerHTML = "<b>Phạm vi được phép thao tác:</b><br />• 📊 <b>Tổng quan:</b> Xem bảng xếp hạng tuần<br />• 🎓 <b>Briefing:</b> Báo cáo đào tạo đầu ca<br />• ✅ <b>Checklist:</b> Kiểm tra nhân sự<br /><i>(Mục Lịch sử và Menu chỉ dành cho Quản trị viên)</i>";
    btnToggleAdmin.textContent = "🔑 Nhập mã Admin";
  }

  modal.hidden = false;
});

$("#profileClose")?.addEventListener("click", () => {
  $("#profileModal").hidden = true;
});

$("#btnToggleAdminCode")?.addEventListener("click", () => {
  if (isUserAdmin) {
    if (confirm("Chuyển về giao diện quyền Nhân viên (Staff)?")) {
      localStorage.removeItem(ADMIN_STATUS_KEY);
      isUserAdmin = false;
      updateAuthUI();
      $("#profileModal").hidden = true;
      toast("Đã chuyển về quyền Nhân viên");
    }
  } else {
    const code = prompt("Nhập mã bí mật Quản trị viên (Mặc định: sunworld2026):");
    if (!code) return;
    if (code.trim() === "sunworld2026" || code.trim() === "admin123") {
      localStorage.setItem(ADMIN_STATUS_KEY, "true");
      isUserAdmin = true;
      updateAuthUI();
      $("#profileModal").hidden = true;
      toast("👑 Đã kích hoạt quyền Quản trị viên (Admin)!");
    } else {
      alert("Mã quản trị viên không chính xác!");
    }
  }
});

$("#btnLogout")?.addEventListener("click", async () => {
  if (!confirm("Bạn có chắc chắn muốn đăng xuất tài khoản?")) return;
  try {
    if (fbAuth) await fbAuth.signOut();
  } catch {}
  currentUser = null;
  localStorage.removeItem("ete_cached_user");
  localStorage.removeItem(ADMIN_STATUS_KEY);
  $("#profileModal").hidden = true;
  updateAuthUI();
  toast("Đã đăng xuất tài khoản");
});

// ---------- Khởi tạo ----------
$("#briefingForm").date.value = fmt(new Date());
$("#checklistForm").date.value = fmt(new Date());
setupAreaPills();
fillEmployeeSelect();
renderChecklistItems();
refreshLists();

// Firebase UI Buttons
$("#btnConfigFirebase")?.addEventListener("click", () => {
  const current = localStorage.getItem(FB_KEY) || (window.FIREBASE_CONFIG ? JSON.stringify(window.FIREBASE_CONFIG, null, 2) : "");
  const input = prompt(
    "Dán đoạn cấu hình firebaseConfig (dạng JSON hoặc object):\nVí dụ:\n{\n  \"apiKey\": \"...\",\n  \"projectId\": \"...\",\n  \"storageBucket\": \"...\"\n}",
    current
  );
  if (!input) return;
  try {
    let cfg;
    const cleaned = input.replace(/^[^{]*{/, "{").replace(/}[^}]*$/, "}");
    try {
      cfg = JSON.parse(cleaned);
    } catch {
      cfg = new Function("return " + cleaned)();
    }
    if (!cfg.apiKey || !cfg.projectId) throw new Error("Thiếu apiKey hoặc projectId");
    localStorage.setItem(FB_KEY, JSON.stringify(cfg));
    toast("✅ Đã lưu cấu hình Firebase! Đang kết nối...");
    initFirebase();
    renderDashboard();
  } catch (err) {
    alert("Cấu hình không hợp lệ: " + err.message);
  }
});

$("#btnDisconnectFirebase")?.addEventListener("click", () => {
  if (!confirm("Ngắt kết nối Firebase và chuyển về chạy bộ nhớ máy?")) return;
  localStorage.removeItem(FB_KEY);
  toast("Đã ngắt kết nối Firebase");
  location.reload();
});

$("#btnSyncLocalToFirebase")?.addEventListener("click", async () => {
  if (!fbDb) return toast("Chưa kết nối Firebase");
  toast("Đang tải dữ liệu lên Cloud...");
  try {
    const local = await tx("readonly", (s) => s.getAll());
    let count = 0;
    for (const r of local) {
      await putRecord(r);
      count++;
    }
    toast(`✅ Đã đồng bộ ${count} báo cáo lên Firebase Cloud!`);
    renderDashboard();
    renderStorage();
  } catch (err) {
    alert("Lỗi đồng bộ: " + err.message);
  }
});

initFirebase();
renderDashboard();
navigator.storage?.persist?.();

// Xem thử nhanh: mở index.html?demo=1 để tự tạo dữ liệu mẫu nếu máy chưa có dữ liệu
if (new URLSearchParams(location.search).get("demo") === "1") {
  allRecords().then((r) => {
    if (!r.length) { window.__autoSeed = true; $("#seedDemo").click(); }
  });
}

window.addEventListener("scroll", () => document.getElementById("fabScrollTop")?.classList.toggle("show", window.scrollY > 400), { passive: true });




