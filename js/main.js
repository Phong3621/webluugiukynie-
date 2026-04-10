const STORAGE_KEYS = {
  users: "kyyeu_users_v1",
  session: "kyyeu_session_v1",
  guestbook: "kyyeu_guestbook_v1",
  moments: "kyyeu_moments_v1",
  comments: "kyyeu_comments_v1",
  futureNotes: "kyyeu_future_notes_v1",
  musicUnlocked: "kyyeu_music_unlocked_v1",
  playerState: "kyyeu_player_state_v1",
};

const DEFAULT_PASSWORD = "123456";
const AVATAR_CLASSES = ["avatar-sky", "avatar-gold", "avatar-rose", "avatar-mint"];
const MEMBER_PREFIXES = [
  "Minh", "Gia", "Khánh", "Thu", "Hoàng", "Bảo", "Ngọc", "Phương", "Quốc", "Tú",
  "Quỳnh", "Hải", "An", "Linh", "Duy", "Trâm", "Vy", "Phong", "Mai", "Nam",
];
const MEMBER_SUFFIXES = [
  "An", "Ly", "Khôi", "Trang", "Hà", "Yến", "Bình", "Phúc", "Đạt", "Nhi",
  "Ngân", "Khang", "My", "Quân", "Thư", "Vân", "Tường", "Nghi", "Khánh", "Uyên",
];
const QUOTES = [
  "Nếu đã đi cùng nhau đến đây thì hãy nhớ nhau thật lâu.",
  "Tuổi học trò đẹp nhất vì có bạn bè và những ngày rất thật.",
  "Ba năm qua rồi nhưng tiếng cười vẫn còn ở lại.",
  "Mỗi bức ảnh là một lần thanh xuân quay lại.",
  "Ngày chia tay là ngày biết lớp mình quan trọng đến mức nào.",
];
const TIMELINE_MILESTONES = [
  {
    year: "2024",
    title: "Bắt đầu hành trình 12A5",
    detail: "Ngày đầu làm quen, những buổi sinh hoạt đầu tiên và danh sách lớp chính thức.",
  },
  {
    year: "2025",
    title: "Cùng nhau tăng tốc",
    detail: "Những kỳ thi quan trọng, hoạt động tập thể và các lần ôn thi xuyên tối.",
  },
  {
    year: "2026",
    title: "Mùa kỷ yếu",
    detail: "Chụp ảnh kỷ yếu, viết lưu bút và gom lại toàn bộ khoảnh khắc lên website lớp.",
  },
  {
    year: "2027",
    title: "Lời hẹn sau tốt nghiệp",
    detail: "Giữ liên lạc và hẹn ngày gặp lại với phiên bản trưởng thành hơn của cả lớp.",
  },
];

const pageTransition = document.getElementById("page-transition");
const transitionVideo = document.getElementById("transition-video");
const entryGate = document.getElementById("entry-gate");
const entryButton = document.getElementById("entry-button");
const menuToggle = document.querySelector(".menu-toggle");
const topNav = document.querySelector(".top-nav");
const deviceChip = document.getElementById("device-chip");
const membersGrid = document.getElementById("members-grid");
const guestbookGrid = document.getElementById("guestbook-grid");
const momentsFeed = document.getElementById("moments-feed");
const imageVaultGrid = document.getElementById("image-vault-grid");
const galleryStatus = document.getElementById("gallery-status");
const memberModal = document.getElementById("member-modal");
const memberModalBackdrop = document.getElementById("member-modal-backdrop");
const memberModalClose = document.getElementById("member-modal-close");
const memberModalAvatar = document.getElementById("member-modal-avatar");
const memberModalRole = document.getElementById("member-modal-role");
const memberModalName = document.getElementById("member-modal-name");
const memberModalNickname = document.getElementById("member-modal-nickname");
const memberModalQuote = document.getElementById("member-modal-quote");
const memberModalMeta = document.getElementById("member-modal-meta");
const guestbookForm = document.getElementById("guestbook-form");
const momentForm = document.getElementById("moment-form");
const loginForm = document.getElementById("login-form");
const logoutButton = document.getElementById("logout-button");
const sessionRole = document.getElementById("session-role");
const sessionName = document.getElementById("session-name");
const sessionStatus = document.getElementById("session-status");
const adminPanel = document.getElementById("admin-panel");
const adminStats = document.getElementById("admin-stats");
const adminMomentsList = document.getElementById("admin-moments-list");
const adminGuestbookList = document.getElementById("admin-guestbook-list");
const adminCommentsList = document.getElementById("admin-comments-list");
const timelineList = document.getElementById("timeline-list");
const futureNoteForm = document.getElementById("future-note-form");
const futureNoteGrid = document.getElementById("future-note-grid");

const trackItems = Array.from(document.querySelectorAll(".track-item"));
const trackTitle = document.getElementById("track-title");
const trackArtist = document.getElementById("track-artist");
const playToggle = document.getElementById("play-toggle");
const nextTrack = document.getElementById("next-track");
const prevTrack = document.getElementById("prev-track");
const audioPlayer = document.getElementById("audio-player");
const playerHint = document.getElementById("player-hint");
const widgetToggle = document.getElementById("widget-toggle");
const musicWidget = document.querySelector(".music-widget");
const widgetSizeToggle = document.getElementById("widget-size-toggle");
const widgetBubbleToggle = document.getElementById("widget-bubble-toggle");
const musicBubble = document.getElementById("music-bubble");
const widgetDragHandle = document.getElementById("widget-drag-handle");
const widgetResizeHandle = document.getElementById("widget-resize-handle");

let currentTrack = 0;
let isPlaying = false;
let dragState = null;
let resizeState = null;
let hasEnteredSite = false;

const WIDGET_MIN_WIDTH = 320;
const WIDGET_MIN_HEIGHT = 260;
const WIDGET_MAX_WIDTH = 520;
const VIEWPORT_MARGIN = 8;
const SECTION_TRANSITION_DURATION = 760;
const PAGE_NAVIGATION_DELAY = 620;
const ENTRY_SESSION_KEY = "kyyeu_entered_session_v1";
const RESUME_ON_GESTURE_KEY = "kyyeu_resume_on_gesture_v1";

let playbackUnlockBound = false;

function readStorage(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function slug(number) {
  return String(number).padStart(2, "0");
}

function makeId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatDate(value) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function getUsers() {
  let users = readStorage(STORAGE_KEYS.users, null);

  if (!users) {
    users = [
      {
        username: "admin12a5",
        password: DEFAULT_PASSWORD,
        name: "Lớp trưởng 12A5",
        nickname: "Admin",
        quote: "Mình duyệt từng kỷ niệm để mọi thứ lên web đều thật đẹp.",
        role: "admin",
        avatarClass: AVATAR_CLASSES[0],
      },
    ];

    for (let index = 1; index <= 44; index += 1) {
      const prefix = MEMBER_PREFIXES[(index - 1) % MEMBER_PREFIXES.length];
      const suffix = MEMBER_SUFFIXES[(index - 1) % MEMBER_SUFFIXES.length];
      users.push({
        username: `member${slug(index)}`,
        password: DEFAULT_PASSWORD,
        name: `${prefix} ${suffix}`,
        nickname: `${suffix} ${index}`,
        quote: QUOTES[(index - 1) % QUOTES.length],
        role: "member",
        avatarClass: AVATAR_CLASSES[index % AVATAR_CLASSES.length],
      });
    }

    writeStorage(STORAGE_KEYS.users, users);
  }

  return users;
}

function getSession() {
  return readStorage(STORAGE_KEYS.session, null);
}

function setSession(session) {
  if (session) {
    writeStorage(STORAGE_KEYS.session, session);
    return;
  }

  window.localStorage.removeItem(STORAGE_KEYS.session);
}

function getGuestbookEntries() {
  let entries = readStorage(STORAGE_KEYS.guestbook, null);

  if (!entries) {
    entries = [
      {
        id: makeId("guestbook"),
        title: "Gửi 12A5",
        message: "Chúc cả lớp đỗ đúng nơi mình mơ ước và sau này đọc lại vẫn thấy năm cuối thật đẹp.",
        author: "Lớp trưởng 12A5",
        username: "admin12a5",
        status: "approved",
        createdAt: new Date().toISOString(),
      },
      {
        id: makeId("guestbook"),
        title: "Một lời nhắn nhỏ",
        message: "Nếu có một sáng nào đó nhớ lớp cũ, hy vọng website này sẽ đưa chúng ta quay về.",
        author: "Minh An",
        username: "member01",
        status: "approved",
        createdAt: new Date().toISOString(),
      },
    ];

    writeStorage(STORAGE_KEYS.guestbook, entries);
  }

  return entries;
}

function setGuestbookEntries(entries) {
  writeStorage(STORAGE_KEYS.guestbook, entries);
}

function getMoments() {
  let moments = readStorage(STORAGE_KEYS.moments, null);

  if (!moments) {
    moments = [
      {
        id: makeId("moment"),
        title: "Ngày chụp kỷ yếu",
        caption: "Một bức ảnh tập thể đại diện cho cả hành trình thanh xuân của 12A5.",
        image: "",
        author: "Lớp trưởng 12A5",
        username: "admin12a5",
        status: "approved",
        createdAt: new Date().toISOString(),
      },
    ];

    writeStorage(STORAGE_KEYS.moments, moments);
  }

  return moments;
}

function setMoments(moments) {
  writeStorage(STORAGE_KEYS.moments, moments);
}

function getComments() {
  let comments = readStorage(STORAGE_KEYS.comments, null);

  if (!comments) {
    comments = [];
    writeStorage(STORAGE_KEYS.comments, comments);
  }

  return comments;
}

function setComments(comments) {
  writeStorage(STORAGE_KEYS.comments, comments);
}

function getFutureNotes() {
  let notes = readStorage(STORAGE_KEYS.futureNotes, null);

  if (!notes) {
    notes = [
      {
        id: makeId("future_note"),
        title: "Hẹn gặp lại sau 5 năm",
        message: "Mong rằng khi đọc lại note này, cả lớp vẫn còn giữ liên lạc như hôm nay.",
        targetYear: 2030,
        author: "Lớp trưởng 12A5",
        username: "admin12a5",
        createdAt: new Date().toISOString(),
      },
      {
        id: makeId("future_note"),
        title: "Giữ vững lời hứa",
        message: "Dù đi đâu, hãy nhớ một phần thanh xuân của chúng ta nằm ở 12A5.",
        targetYear: 2032,
        author: "Minh An",
        username: "member01",
        createdAt: new Date().toISOString(),
      },
    ];
    writeStorage(STORAGE_KEYS.futureNotes, notes);
  }

  return notes;
}

function setFutureNotes(notes) {
  writeStorage(STORAGE_KEYS.futureNotes, notes);
}

function currentUser() {
  const session = getSession();
  if (!session) {
    return null;
  }

  return getUsers().find((user) => user.username === session.username) || null;
}

function requireLogin() {
  if (currentUser()) {
    return true;
  }

  window.alert("Hãy đăng nhập trước.");
  return false;
}

function startTransitionOverlay() {
  if (!pageTransition) {
    return;
  }

  pageTransition.classList.add("is-active");

  if (!transitionVideo) {
    return;
  }

  transitionVideo.currentTime = 0;
  const playAttempt = transitionVideo.play();
  if (playAttempt && typeof playAttempt.catch === "function") {
    playAttempt.catch(() => {});
  }
}

function stopTransitionOverlay() {
  if (!pageTransition) {
    return;
  }

  pageTransition.classList.remove("is-active");
  transitionVideo?.pause();
  if (transitionVideo) {
    transitionVideo.currentTime = 0;
  }
}

function triggerSectionTransition(targetId) {
  const target = document.querySelector(targetId);
  if (!target) {
    window.location.href = `index.html${targetId}`;
    return;
  }

  startTransitionOverlay();
  window.setTimeout(() => {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 220);
  window.setTimeout(() => {
    stopTransitionOverlay();
  }, SECTION_TRANSITION_DURATION);
}

function triggerPageNavigation(url) {
  startTransitionOverlay();
  window.setTimeout(() => {
    window.location.href = url;
  }, PAGE_NAVIGATION_DELAY);
}

function detectDeviceType() {
  const mobileByWidth = window.innerWidth <= 760;
  const mobileByTouch = window.matchMedia("(pointer: coarse)").matches && window.innerWidth <= 1024;
  return mobileByWidth || mobileByTouch ? "mobile" : "desktop";
}

function applyDeviceLayout(force = false) {
  const deviceType = detectDeviceType();
  document.body.classList.toggle("device-mobile", deviceType === "mobile");
  document.body.classList.toggle("device-desktop", deviceType === "desktop");

  if (deviceChip) {
    deviceChip.setAttribute("data-device", deviceType);
    deviceChip.title = deviceType === "mobile" ? "Giao diện tối ưu cho điện thoại" : "Giao diện tối ưu cho máy tính";
  }

  if (!musicWidget) {
    return;
  }

  if (deviceType === "mobile") {
    musicWidget.classList.add("is-compact");
    musicWidget.classList.remove("is-large");
    musicWidget.style.width = "";
    if (force || !musicWidget.dataset.mobileInit) {
      musicWidget.classList.add("is-bubble");
      musicWidget.dataset.mobileInit = "true";
    }
  } else {
    musicWidget.classList.remove("is-compact");
    musicWidget.classList.add("is-large");
    if (force || !musicWidget.dataset.desktopInit) {
      musicWidget.classList.remove("is-bubble");
      musicWidget.classList.add("is-open");
      musicWidget.dataset.desktopInit = "true";
    }
  }
}

function renderSession() {
  if (!sessionRole || !sessionName || !sessionStatus) {
    return;
  }

  const user = currentUser();

  if (!user) {
    sessionRole.textContent = "Khách";
    sessionName.textContent = "Chưa đăng nhập";
    sessionStatus.textContent = "Khách vẫn có thể xem bài viết, ảnh và lưu bút đã hiển thị trên website.";
    if (adminPanel) {
      adminPanel.hidden = true;
    }
    return;
  }

  sessionRole.textContent = user.role === "admin" ? "Admin" : "Thành viên";
  sessionName.textContent = user.name;
  sessionStatus.textContent =
    user.role === "admin"
      ? "Bạn có thể duyệt khoảnh khắc, lưu bút và bình luận chờ xử lý."
      : "Bạn có thể gửi lưu bút, đăng ảnh khoảnh khắc và thêm bình luận.";

  if (adminPanel) {
    adminPanel.hidden = user.role !== "admin";
  }
}

function renderMembers() {
  if (!membersGrid) {
    return;
  }

  const users = getUsers();
  membersGrid.innerHTML = users
    .map((user, index) => {
      const initials = user.name
        .split(" ")
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase();

      return `
        <article class="member-card" data-member="${user.username}">
          <div class="avatar ${user.avatarClass || AVATAR_CLASSES[index % AVATAR_CLASSES.length]}">${initials}</div>
          <div class="member-body">
            <div class="member-headline">
              <h3>${user.name}</h3>
              <span class="role-pill ${user.role}">${user.role === "admin" ? "Admin" : "Member"}</span>
            </div>
            <p class="member-role">Biệt danh: ${user.nickname}</p>
            <p>"${user.quote}"</p>
          </div>
        </article>
      `;
    })
    .join("");
}

function openMemberModal(username) {
  const user = getUsers().find((entry) => entry.username === username);
  if (!user) {
    return;
  }

  const initials = user.name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  memberModalAvatar.textContent = initials;
  memberModalAvatar.className = `member-modal-avatar ${user.avatarClass || AVATAR_CLASSES[0]}`;
  memberModalRole.textContent = user.role === "admin" ? "Admin" : "Thành viên lớp";
  memberModalName.textContent = user.name;
  memberModalNickname.textContent = `Biệt danh: ${user.nickname}`;
  memberModalQuote.textContent = `"${user.quote}"`;
  memberModalMeta.innerHTML = `
    <span>Trường: THPT YD số 3</span>
    <span>Lớp: 12A5</span>
    <span>Niên khóa: 2024 - 2027</span>
    <span>Vai trò: ${user.role === "admin" ? "Lớp trưởng / quản trị" : "Thành viên"}</span>
  `;
  memberModal.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeMemberModal() {
  if (!memberModal) {
    return;
  }
  memberModal.hidden = true;
  document.body.style.overflow = "";
}

function renderGuestbook() {
  if (!guestbookGrid) {
    return;
  }

  const entries = getGuestbookEntries()
    .filter((entry) => entry.status === "approved")
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  guestbookGrid.innerHTML = entries.length
    ? entries
        .map(
          (entry, index) => `
            <article class="note-card">
              <span class="note-chip">Lưu bút ${slug(index + 1)}</span>
              <h3>${entry.title}</h3>
              <p>${entry.message}</p>
              <strong>- ${entry.author}</strong>
              <small>${formatDate(entry.createdAt)}</small>
            </article>
          `
        )
        .join("")
    : `<div class="empty-state">Chưa có lưu bút nào được duyệt.</div>`;
}

function renderMoments() {
  if (!momentsFeed) {
    return;
  }

  const comments = getComments();
  const moments = getMoments()
    .filter((moment) => moment.status === "approved")
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  momentsFeed.innerHTML = moments.length
    ? moments
        .map((moment, index) => {
          const approvedComments = comments.filter(
            (comment) => comment.momentId === moment.id && comment.status === "approved"
          );

          return `
            <article class="moment-post ${index === 0 ? "moment-post-featured" : ""}">
              <div class="moment-post-media">
                ${
                  moment.image
                    ? `<img src="${moment.image}" alt="${moment.title}">`
                    : `<div class="moment-placeholder">Ảnh đang chờ được thay bằng ảnh thật của lớp</div>`
                }
              </div>
              <div class="moment-post-body">
                <div class="moment-post-head">
                  <span class="moment-tag">Đã duyệt</span>
                  <span class="moment-meta">${moment.author} • ${formatDate(moment.createdAt)}</span>
                </div>
                <h3>${moment.title}</h3>
                <p>${moment.caption}</p>
                <div class="comment-list">
                  ${
                    approvedComments.length
                      ? approvedComments
                          .map(
                            (comment) => `
                              <article class="comment-card">
                                <strong>${comment.author}</strong>
                                <p>${comment.message}</p>
                                <small>${formatDate(comment.createdAt)}</small>
                              </article>
                            `
                          )
                          .join("")
                      : `<div class="empty-inline">Chưa có bình luận nào được duyệt.</div>`
                  }
                </div>
                <form class="comment-form" data-moment-id="${moment.id}">
                  <textarea name="message" rows="2" placeholder="Viết bình luận cho khoảnh khắc này..." required></textarea>
                  <button class="button ghost" type="submit">Gửi bình luận</button>
                </form>
              </div>
            </article>
          `;
        })
        .join("")
    : `<div class="empty-state">Chưa có khoảnh khắc nào được duyệt.</div>`;
}

function renderImageVault() {
  if (!imageVaultGrid || !galleryStatus) {
    return;
  }

  const user = currentUser();
  const moments = getMoments().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const visibleMoments = moments.filter((moment) => {
    if (moment.status === "approved") {
      return true;
    }

    if (!user) {
      return false;
    }

    return user.role === "admin" || user.username === moment.username;
  });

  const approvedCount = moments.filter((moment) => moment.status === "approved").length;
  const pendingCount = moments.filter((moment) => moment.status === "pending").length;

  galleryStatus.innerHTML = `
    <span class="gallery-pill">${approvedCount} ảnh đã duyệt</span>
    <span class="gallery-pill">${pendingCount} ảnh chờ duyệt</span>
    <span class="gallery-pill">${user ? `Đang xem với quyền ${user.role === "admin" ? "admin" : "member"}` : "Khách chỉ xem ảnh đã duyệt"}</span>
  `;

  imageVaultGrid.innerHTML = visibleMoments.length
    ? visibleMoments
        .map(
          (moment) => `
            <article class="vault-card">
              <div class="vault-thumb">
                ${
                  moment.image
                    ? `<img src="${moment.image}" alt="${moment.title}">`
                    : `<div class="moment-placeholder">Ảnh chưa sẵn sàng</div>`
                }
                <span class="vault-badge ${moment.status}">${moment.status === "approved" ? "Đã duyệt" : "Chờ duyệt"}</span>
              </div>
              <h3>${moment.title}</h3>
              <p>${moment.caption}</p>
              <div class="vault-meta">
                <span>${moment.author}</span>
                <span>${formatDate(moment.createdAt)}</span>
              </div>
            </article>
          `
        )
        .join("")
    : `<div class="empty-state">Kho ảnh chưa có ảnh nào phù hợp để hiển thị.</div>`;
}

function renderAdmin() {
  if (!adminPanel || !adminStats || !adminMomentsList || !adminGuestbookList || !adminCommentsList) {
    return;
  }

  const user = currentUser();
  if (!user || user.role !== "admin") {
    adminPanel.hidden = true;
    return;
  }

  adminPanel.hidden = false;

  const pendingMoments = getMoments().filter((moment) => moment.status === "pending");
  const pendingGuestbook = getGuestbookEntries().filter((entry) => entry.status === "pending");
  const pendingComments = getComments().filter((comment) => comment.status === "pending");

  adminStats.innerHTML = `
    <div class="stat-card"><strong>${pendingMoments.length}</strong><span>khoảnh khắc chờ duyệt</span></div>
    <div class="stat-card"><strong>${pendingGuestbook.length}</strong><span>lưu bút chờ duyệt</span></div>
    <div class="stat-card"><strong>${pendingComments.length}</strong><span>bình luận chờ duyệt</span></div>
  `;

  adminMomentsList.innerHTML = renderAdminItems(pendingMoments, "moment");
  adminGuestbookList.innerHTML = renderAdminItems(pendingGuestbook, "guestbook");
  adminCommentsList.innerHTML = renderAdminItems(pendingComments, "comment");
}

function renderAdminItems(items, type) {
  if (!items.length) {
    return `<div class="empty-inline">Không có mục chờ duyệt.</div>`;
  }

  return items
    .map((item) => {
      const text =
        type === "comment"
          ? item.message
          : type === "guestbook"
            ? `${item.title}: ${item.message}`
            : `${item.title}: ${item.caption}`;

      return `
        <article class="admin-item">
          <div>
            <strong>${item.author}</strong>
            <p>${text}</p>
            <small>${formatDate(item.createdAt)}</small>
          </div>
          <div class="admin-actions">
            <button class="button primary admin-action" data-type="${type}" data-id="${item.id}" data-action="approve" type="button">Duyệt</button>
            <button class="button ghost admin-action" data-type="${type}" data-id="${item.id}" data-action="reject" type="button">Từ chối</button>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderTimeline() {
  if (!timelineList) {
    return;
  }

  timelineList.innerHTML = TIMELINE_MILESTONES.map(
    (milestone) => `
      <article class="timeline-card">
        <span class="timeline-year">${escapeHtml(milestone.year)}</span>
        <h3>${escapeHtml(milestone.title)}</h3>
        <p>${escapeHtml(milestone.detail)}</p>
      </article>
    `
  ).join("");
}

function renderFutureNotes() {
  if (!futureNoteGrid) {
    return;
  }

  const notes = getFutureNotes().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  futureNoteGrid.innerHTML = notes.length
    ? notes
        .map(
          (note) => `
            <article class="future-note-card">
              <h3>${escapeHtml(note.title)}</h3>
              <p>${escapeHtml(note.message)}</p>
              <div class="future-note-meta">
                <span>Gửi năm ${escapeHtml(note.targetYear)}</span>
                <span>${escapeHtml(note.author)}</span>
                <span>${escapeHtml(formatDate(note.createdAt))}</span>
              </div>
            </article>
          `
        )
        .join("")
    : `<div class="empty-state">Chưa có lời nhắn nào cho tương lai.</div>`;
}

function rerenderApp() {
  renderSession();
  renderMembers();
  renderGuestbook();
  renderMoments();
  renderImageVault();
  renderAdmin();
  renderTimeline();
  renderFutureNotes();
  setupRevealTargets();
}

function updateCollectionItem(type, id, action) {
  const collections = {
    moment: [getMoments(), setMoments],
    guestbook: [getGuestbookEntries(), setGuestbookEntries],
    comment: [getComments(), setComments],
  };

  const [items, setter] = collections[type] || [];
  if (!items || !setter) {
    return;
  }

  const nextItems = items
    .map((item) => (item.id === id ? { ...item, status: action === "approve" ? "approved" : "rejected" } : item))
    .filter((item) => item.status !== "rejected");

  setter(nextItems);
  rerenderApp();
}

function handleLogin(event) {
  event.preventDefault();
  if (!loginForm) {
    return;
  }

  const formData = new FormData(loginForm);
  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "").trim();
  const user = getUsers().find(
    (entry) => entry.username.toLowerCase() === username.toLowerCase() && entry.password === password
  );

  if (!user) {
    window.alert("Sai tài khoản hoặc mật khẩu.");
    return;
  }

  setSession({ username: user.username });
  loginForm.reset();
  rerenderApp();
}

function handleLogout() {
  setSession(null);
  rerenderApp();
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Không đọc được file ảnh."));
    reader.readAsDataURL(file);
  });
}

async function handleMomentSubmit(event) {
  event.preventDefault();
  if (!momentForm) {
    return;
  }

  if (!requireLogin()) {
    return;
  }

  const user = currentUser();
  const formData = new FormData(momentForm);
  const file = formData.get("image");

  if (!(file instanceof File) || !file.size) {
    window.alert("Hãy chọn một ảnh.");
    return;
  }

  const image = await fileToDataUrl(file);
  const moments = getMoments();
  moments.unshift({
    id: makeId("moment"),
    title: String(formData.get("title") || "").trim(),
    caption: String(formData.get("caption") || "").trim(),
    image,
    author: user.name,
    username: user.username,
    status: user.role === "admin" ? "approved" : "pending",
    createdAt: new Date().toISOString(),
  });
  setMoments(moments);
  momentForm.reset();
  rerenderApp();
}

function handleGuestbookSubmit(event) {
  event.preventDefault();
  if (!guestbookForm) {
    return;
  }

  if (!requireLogin()) {
    return;
  }

  const user = currentUser();
  const formData = new FormData(guestbookForm);
  const entries = getGuestbookEntries();
  entries.unshift({
    id: makeId("guestbook"),
    title: String(formData.get("title") || "").trim(),
    message: String(formData.get("message") || "").trim(),
    author: user.name,
    username: user.username,
    status: user.role === "admin" ? "approved" : "pending",
    createdAt: new Date().toISOString(),
  });
  setGuestbookEntries(entries);
  guestbookForm.reset();
  rerenderApp();
}

function handleCommentSubmit(event) {
  const form = event.target.closest(".comment-form");
  if (!form) {
    return;
  }

  event.preventDefault();

  if (!requireLogin()) {
    return;
  }

  const user = currentUser();
  const formData = new FormData(form);
  const message = String(formData.get("message") || "").trim();

  if (!message) {
    return;
  }

  const comments = getComments();
  comments.unshift({
    id: makeId("comment"),
    momentId: form.dataset.momentId || "",
    message,
    author: user.name,
    username: user.username,
    status: user.role === "admin" ? "approved" : "pending",
    createdAt: new Date().toISOString(),
  });
  setComments(comments);
  form.reset();
  rerenderApp();
}

function handleFutureNoteSubmit(event) {
  event.preventDefault();
  if (!futureNoteForm) {
    return;
  }

  const formData = new FormData(futureNoteForm);
  const title = String(formData.get("title") || "").trim();
  const message = String(formData.get("message") || "").trim();
  const targetYear = Number.parseInt(String(formData.get("targetYear") || "0"), 10);

  if (!title || !message || !Number.isFinite(targetYear)) {
    return;
  }

  const user = currentUser();
  const notes = getFutureNotes();
  notes.unshift({
    id: makeId("future_note"),
    title,
    message,
    targetYear,
    author: user ? user.name : "Khách",
    username: user ? user.username : "guest",
    createdAt: new Date().toISOString(),
  });
  setFutureNotes(notes);
  futureNoteForm.reset();

  const targetYearInput = futureNoteForm.querySelector('input[name="targetYear"]');
  if (targetYearInput instanceof HTMLInputElement) {
    targetYearInput.value = "2030";
  }

  rerenderApp();
}

function setupRevealTargets() {
  const revealTargets = document.querySelectorAll(
    ".spotlight-card, .member-card, .note-card, .composer-card, .moment-post, .section-heading, .auth-card, .admin-review-card, .timeline-shell, .timeline-card, .future-note-shell, .future-note-card"
  );

  if (!("IntersectionObserver" in window)) {
    revealTargets.forEach((target) => target.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, activeObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          activeObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealTargets.forEach((target) => {
    if (!target.classList.contains("reveal")) {
      target.classList.add("reveal");
    }
    observer.observe(target);
  });
}

function keepWidgetInViewport() {
  if (!musicWidget || musicWidget.classList.contains("is-bubble")) {
    return;
  }

  const rect = musicWidget.getBoundingClientRect();
  const left = clamp(rect.left, VIEWPORT_MARGIN, window.innerWidth - rect.width - VIEWPORT_MARGIN);
  const top = clamp(rect.top, VIEWPORT_MARGIN, window.innerHeight - rect.height - VIEWPORT_MARGIN);

  musicWidget.style.left = `${left}px`;
  musicWidget.style.top = `${top}px`;
  musicWidget.style.right = "auto";
  musicWidget.style.bottom = "auto";
}

function renderTrack(index) {
  currentTrack = index;
  trackItems.forEach((item, itemIndex) => item.classList.toggle("is-active", itemIndex === index));

  const activeItem = trackItems[index];
  if (!activeItem || !trackTitle || !trackArtist) {
    return;
  }

  trackTitle.textContent = activeItem.dataset.title || "";
  trackArtist.textContent = activeItem.dataset.artist || "";

  if (audioPlayer) {
    const nextSource = activeItem.dataset.src || "";
    if (audioPlayer.getAttribute("src") !== nextSource) {
      audioPlayer.src = nextSource;
      audioPlayer.load();
    }
  }
}

function savePlayerState() {
  if (!audioPlayer) {
    return;
  }

  writeStorage(STORAGE_KEYS.playerState, {
    trackIndex: currentTrack,
    currentTime: audioPlayer.currentTime || 0,
    isPlaying,
  });
}

function clearPlaybackUnlock() {
  if (!playbackUnlockBound) {
    return;
  }
  const handler = tryResumePlaybackFromGesture;
  window.removeEventListener("touchstart", handler);
  window.removeEventListener("pointerdown", handler);
  window.removeEventListener("click", handler);
  window.removeEventListener("keydown", handler);
  playbackUnlockBound = false;
}
function bindPlaybackUnlock() {
  if (playbackUnlockBound) {
    return;
  }
  const handler = tryResumePlaybackFromGesture;
  window.addEventListener("touchstart", handler, { passive: true });
  window.addEventListener("pointerdown", handler, { passive: true });
  window.addEventListener("click", handler);
  window.addEventListener("keydown", handler);
  playbackUnlockBound = true;
}
function tryResumePlaybackFromGesture() {
  if (window.sessionStorage.getItem(RESUME_ON_GESTURE_KEY) !== "true") {
    clearPlaybackUnlock();
    return;
  }
  playCurrentTrack({ fromGesture: true });
}
async function playCurrentTrack(options = {}) {
  if (!audioPlayer) {
    return;
  }
  const { fromGesture = false } = options;
  try {
    await audioPlayer.play();
    isPlaying = true;
    playToggle.textContent = "Tạm dừng";
    playerHint.textContent = "";
    window.sessionStorage.removeItem(RESUME_ON_GESTURE_KEY);
    clearPlaybackUnlock();
    savePlayerState();
  } catch {
    isPlaying = false;
    playToggle.textContent = "Phát";
    if (!fromGesture) {
      window.sessionStorage.setItem(RESUME_ON_GESTURE_KEY, "true");
      bindPlaybackUnlock();
      playerHint.textContent = "Trình duyệt đang chặn tự phát. Chạm màn hình một lần để tiếp tục nhạc.";
    } else {
      window.sessionStorage.removeItem(RESUME_ON_GESTURE_KEY);
      clearPlaybackUnlock();
      playerHint.textContent = "Không thể phát nhạc trên thiết bị này.";
    }
    savePlayerState();
  }
}
function enterSite() {
  if (hasEnteredSite) {
    return;
  }

  hasEnteredSite = true;
  window.localStorage.setItem(STORAGE_KEYS.musicUnlocked, "true");
  window.sessionStorage.setItem(ENTRY_SESSION_KEY, "true");
  entryGate?.classList.add("is-hidden");
  entryGate?.setAttribute("aria-hidden", "true");
  if (trackItems.length > 0) {
    const randomIndex = Math.floor(Math.random() * trackItems.length);
    renderTrack(randomIndex);
  }
  playCurrentTrack();
}

function pauseCurrentTrack() {
  audioPlayer?.pause();
  isPlaying = false;
  playToggle.textContent = "Phát";
  window.sessionStorage.removeItem(RESUME_ON_GESTURE_KEY);
  clearPlaybackUnlock();
  savePlayerState();
}

function restoreEntryState() {
  const enteredInSession = window.sessionStorage.getItem(ENTRY_SESSION_KEY) === "true";
  if (!enteredInSession) {
    hasEnteredSite = false;
    entryGate?.classList.remove("is-hidden");
    entryGate?.setAttribute("aria-hidden", "false");
    return;
  }

  hasEnteredSite = true;
  entryGate?.classList.add("is-hidden");
  entryGate?.setAttribute("aria-hidden", "true");
}

function restorePlayerState() {
  if (!audioPlayer || trackItems.length === 0) {
    return;
  }
  audioPlayer.setAttribute("playsinline", "");
  if ("webkitPlaysInline" in audioPlayer) {
    audioPlayer.webkitPlaysInline = true;
  }
  const state = readStorage(STORAGE_KEYS.playerState, null);
  if (!state) {
    if (window.sessionStorage.getItem(RESUME_ON_GESTURE_KEY) === "true") {
      bindPlaybackUnlock();
    }
    return;
  }
  const index = Number.isInteger(state.trackIndex) ? state.trackIndex : 0;
  renderTrack(clamp(index, 0, trackItems.length - 1));
  const resumePlayback = () => {
    if (typeof state.currentTime === "number" && Number.isFinite(state.currentTime)) {
      audioPlayer.currentTime = Math.max(0, state.currentTime);
    }
    if (window.localStorage.getItem(STORAGE_KEYS.musicUnlocked) === "true" && state.isPlaying) {
      playCurrentTrack({ fromGesture: false });
    }
  };
  if (audioPlayer.readyState >= 1) {
    resumePlayback();
  } else {
    audioPlayer.addEventListener("loadedmetadata", resumePlayback, { once: true });
  }
  if (window.sessionStorage.getItem(RESUME_ON_GESTURE_KEY) === "true") {
    bindPlaybackUnlock();
  }
}

function togglePlayback() {
  if (isPlaying) {
    pauseCurrentTrack();
    return;
  }
  playCurrentTrack();
}

function setupEvents() {
  if (menuToggle && topNav) {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.addEventListener("click", () => {
      const isOpen = topNav.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  document.addEventListener("click", (event) => {
    if (!topNav || !menuToggle) {
      return;
    }

    const target = event.target;
    if (!(target instanceof Node)) {
      return;
    }

    if (topNav.contains(target) || menuToggle.contains(target)) {
      return;
    }

    topNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  });

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const targetId = anchor.getAttribute("href");
      if (!targetId || targetId === "#") {
        return;
      }
      event.preventDefault();
      triggerSectionTransition(targetId);
      topNav?.classList.remove("is-open");
      menuToggle?.setAttribute("aria-expanded", "false");
    });
  });

  document.querySelectorAll("a[href]").forEach((anchor) => {
    const href = anchor.getAttribute("href") || "";
    if (!href || href.startsWith("#")) {
      return;
    }

    const isInternalPage = /(^|\/)(index|members|moments|guestbook|member)\.html(\?|$|#)/.test(href);
    if (!isInternalPage) {
      return;
    }

    anchor.addEventListener("click", (event) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
        return;
      }

      event.preventDefault();
      savePlayerState();
      triggerPageNavigation(href);
    });
  });

  loginForm?.addEventListener("submit", handleLogin);
  logoutButton?.addEventListener("click", handleLogout);
  guestbookForm?.addEventListener("submit", handleGuestbookSubmit);
  momentForm?.addEventListener("submit", handleMomentSubmit);
  momentsFeed?.addEventListener("submit", handleCommentSubmit);
  futureNoteForm?.addEventListener("submit", handleFutureNoteSubmit);
  entryButton?.addEventListener("click", enterSite);
  membersGrid?.addEventListener("click", (event) => {
    const card = event.target.closest(".member-card");
    if (!(card instanceof HTMLElement)) {
      return;
    }
    const username = card.dataset.member || "";
    if (!username) {
      return;
    }
    savePlayerState();
    triggerPageNavigation(`member.html?user=${encodeURIComponent(username)}`);
  });
  memberModalBackdrop?.addEventListener("click", closeMemberModal);
  memberModalClose?.addEventListener("click", closeMemberModal);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && memberModal && !memberModal.hidden) {
      closeMemberModal();
    }
  });

  adminPanel?.addEventListener("click", (event) => {
    const button = event.target.closest(".admin-action");
    if (!(button instanceof HTMLElement)) {
      return;
    }
    updateCollectionItem(button.dataset.type, button.dataset.id, button.dataset.action);
  });

  trackItems.forEach((item, index) => item.addEventListener("click", () => {
    renderTrack(index);
    playCurrentTrack();
  }));
  playToggle?.addEventListener("click", togglePlayback);
  nextTrack?.addEventListener("click", () => {
    renderTrack((currentTrack + 1) % trackItems.length);
    playCurrentTrack();
  });
  prevTrack?.addEventListener("click", () => {
    renderTrack((currentTrack - 1 + trackItems.length) % trackItems.length);
    playCurrentTrack();
  });
  audioPlayer?.addEventListener("ended", () => {
    renderTrack((currentTrack + 1) % trackItems.length);
    playCurrentTrack();
  });
  audioPlayer?.addEventListener("timeupdate", savePlayerState);

  widgetToggle?.addEventListener("click", () => {
    musicWidget.classList.toggle("is-open");
    widgetToggle.textContent = musicWidget.classList.contains("is-open") ? "Playlist" : "Mở playlist";
  });

  widgetSizeToggle?.addEventListener("click", () => {
    const isCompact = musicWidget.classList.toggle("is-compact");
    musicWidget.classList.toggle("is-large", !isCompact);
    widgetSizeToggle.textContent = isCompact ? "Phóng to" : "Thu gọn";
    musicWidget.style.width = isCompact ? "340px" : "380px";
    keepWidgetInViewport();
  });

  widgetBubbleToggle?.addEventListener("click", () => {
    musicWidget.classList.add("is-bubble");
  });

  musicBubble?.addEventListener("click", () => {
    musicWidget.classList.remove("is-bubble");
    keepWidgetInViewport();
  });

  musicBubble?.addEventListener("mousedown", (event) => {
    if (window.innerWidth <= 760) {
      return;
    }
    const rect = musicWidget.getBoundingClientRect();
    dragState = { offsetX: event.clientX - rect.left, offsetY: event.clientY - rect.top };
    musicWidget.style.left = `${rect.left}px`;
    musicWidget.style.top = `${rect.top}px`;
    musicWidget.style.right = "auto";
    musicWidget.style.bottom = "auto";
    document.body.style.userSelect = "none";
    event.preventDefault();
  });

  widgetDragHandle?.addEventListener("mousedown", (event) => {
    if (window.innerWidth <= 760) {
      return;
    }
    if (event.target instanceof HTMLElement && event.target.closest("button")) {
      return;
    }
    const rect = musicWidget.getBoundingClientRect();
    dragState = { offsetX: event.clientX - rect.left, offsetY: event.clientY - rect.top };
    musicWidget.style.left = `${rect.left}px`;
    musicWidget.style.top = `${rect.top}px`;
    musicWidget.style.right = "auto";
    musicWidget.style.bottom = "auto";
    document.body.style.userSelect = "none";
  });

  widgetResizeHandle?.addEventListener("mousedown", (event) => {
    if (window.innerWidth <= 760) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();

    const rect = musicWidget.getBoundingClientRect();
    resizeState = {
      startX: event.clientX,
      startY: event.clientY,
      startWidth: rect.width,
      startHeight: rect.height,
      left: rect.left,
      top: rect.top,
    };

    musicWidget.style.left = `${rect.left}px`;
    musicWidget.style.top = `${rect.top}px`;
    musicWidget.style.right = "auto";
    musicWidget.style.bottom = "auto";
    document.body.style.userSelect = "none";
  });

  document.addEventListener("mousemove", (event) => {
    if (dragState) {
      const nextLeft = clamp(
        event.clientX - dragState.offsetX,
        VIEWPORT_MARGIN,
        window.innerWidth - musicWidget.offsetWidth - VIEWPORT_MARGIN
      );
      const nextTop = clamp(
        event.clientY - dragState.offsetY,
        VIEWPORT_MARGIN,
        window.innerHeight - musicWidget.offsetHeight - VIEWPORT_MARGIN
      );
      musicWidget.style.left = `${nextLeft}px`;
      musicWidget.style.top = `${nextTop}px`;
    }

    if (resizeState) {
      const maxWidthByViewport = Math.min(WIDGET_MAX_WIDTH, window.innerWidth - resizeState.left - VIEWPORT_MARGIN);
      const maxHeightByViewport = window.innerHeight - resizeState.top - VIEWPORT_MARGIN;
      const nextWidth = clamp(
        resizeState.startWidth + (event.clientX - resizeState.startX),
        WIDGET_MIN_WIDTH,
        maxWidthByViewport
      );
      const nextHeight = clamp(
        resizeState.startHeight + (event.clientY - resizeState.startY),
        WIDGET_MIN_HEIGHT,
        maxHeightByViewport
      );

      musicWidget.style.width = `${nextWidth}px`;
      const panel = musicWidget.querySelector(".music-widget-panel");
      if (panel instanceof HTMLElement) {
        panel.style.maxHeight = `${nextHeight}px`;
      }
    }
  });

  document.addEventListener("mouseup", () => {
    if (dragState || resizeState) {
      document.body.style.userSelect = "";
    }
    dragState = null;
    resizeState = null;
  });

  window.addEventListener("resize", () => {
    applyDeviceLayout();
    if (!musicWidget || window.innerWidth <= 760) {
      return;
    }
    keepWidgetInViewport();
  });

  window.addEventListener("beforeunload", savePlayerState);
  window.addEventListener("pageshow", () => {
    stopTransitionOverlay();
  });
  window.addEventListener("pagehide", () => {
    transitionVideo?.pause();
  });
}

setupEvents();
applyDeviceLayout(true);
rerenderApp();
renderTrack(0);
stopTransitionOverlay();
restoreEntryState();
restorePlayerState();
