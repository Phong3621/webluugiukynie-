const PROFILE_STORAGE_KEYS = {
  users: "kyyeu_users_v1",
  session: "kyyeu_session_v1",
  guestbook: "kyyeu_guestbook_v1",
  moments: "kyyeu_moments_v1",
};

const profileAvatar = document.getElementById("profile-avatar");
const profileRole = document.getElementById("profile-role");
const profileName = document.getElementById("profile-name");
const profileNickname = document.getElementById("profile-nickname");
const profileQuote = document.getElementById("profile-quote");
const profileMeta = document.getElementById("profile-meta");
const profileBio = document.getElementById("profile-bio");
const profileGuestbook = document.getElementById("profile-guestbook");
const profileMoments = document.getElementById("profile-moments");
const profileEditorCard = document.getElementById("profile-editor-card");
const profileEditForm = document.getElementById("profile-edit-form");
const profileNameField = document.getElementById("profile-name-field");
const profileNicknameField = document.getElementById("profile-nickname-field");
const profileEditHint = document.getElementById("profile-edit-hint");
const profileResetImageButton = document.getElementById("profile-reset-image");
const editNameInput = document.getElementById("edit-name");
const editNicknameInput = document.getElementById("edit-nickname");
const editQuoteInput = document.getElementById("edit-quote");
const editBioInput = document.getElementById("edit-bio");
const editImageInput = document.getElementById("edit-image");

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

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatDate(value) {
  if (!value) {
    return "";
  }

  try {
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return "";
  }
}

function getUsers() {
  return readStorage(PROFILE_STORAGE_KEYS.users, []);
}

function setUsers(users) {
  writeStorage(PROFILE_STORAGE_KEYS.users, users);
}

function getSession() {
  return readStorage(PROFILE_STORAGE_KEYS.session, null);
}

function getGuestbookEntries() {
  return readStorage(PROFILE_STORAGE_KEYS.guestbook, []);
}

function getMoments() {
  return readStorage(PROFILE_STORAGE_KEYS.moments, []);
}

function currentUser() {
  const session = getSession();
  if (!session?.username) {
    return null;
  }

  return getUsers().find((user) => user.username === session.username) || null;
}

function getInitials(name) {
  return String(name || "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] || "")
    .join("")
    .toUpperCase();
}

function profileFromQuery() {
  const query = new URLSearchParams(window.location.search);
  const username = query.get("user");
  if (username) {
    return getUsers().find((user) => user.username === username) || null;
  }

  const viewer = currentUser();
  if (viewer) {
    return viewer;
  }

  return getUsers().find((user) => user.role !== "admin") || getUsers()[0] || null;
}

function canSeePendingContent(viewer, ownerUsername) {
  if (!viewer) {
    return false;
  }

  return viewer.role === "admin" || viewer.username === ownerUsername;
}

function renderNotFound() {
  if (profileName) {
    profileName.textContent = "Không tìm thấy thành viên";
  }
  if (profileNickname) {
    profileNickname.textContent = "Hồ sơ không tồn tại hoặc đã bị xóa.";
  }
  if (profileQuote) {
    profileQuote.textContent = "";
  }
  if (profileMeta) {
    profileMeta.innerHTML = `<span>Vui lòng quay lại danh sách thành viên để chọn lại hồ sơ.</span>`;
  }
  if (profileBio) {
    profileBio.innerHTML = `<p class="empty-inline">Không có dữ liệu để hiển thị.</p>`;
  }
  if (profileGuestbook) {
    profileGuestbook.innerHTML = `<p class="empty-inline">Không có lưu bút.</p>`;
  }
  if (profileMoments) {
    profileMoments.innerHTML = `<p class="empty-inline">Không có khoảnh khắc.</p>`;
  }
  if (profileEditorCard) {
    profileEditorCard.hidden = true;
  }
}

function renderProfileHeader(profileUser) {
  if (profileAvatar) {
    profileAvatar.className = `profile-avatar ${profileUser.avatarClass || "avatar-sky"}`;
    profileAvatar.style.backgroundImage = "";
    profileAvatar.style.backgroundSize = "";
    profileAvatar.style.backgroundPosition = "";
    profileAvatar.style.backgroundRepeat = "";
    profileAvatar.textContent = getInitials(profileUser.name) || "12";

    if (profileUser.image) {
      profileAvatar.style.backgroundImage = `url("${profileUser.image}")`;
      profileAvatar.style.backgroundSize = "cover";
      profileAvatar.style.backgroundPosition = "center";
      profileAvatar.style.backgroundRepeat = "no-repeat";
      profileAvatar.textContent = "";
    }
  }

  if (profileRole) {
    profileRole.textContent = profileUser.role === "admin" ? "Admin" : "Thành viên lớp";
  }
  if (profileName) {
    profileName.textContent = profileUser.name || profileUser.username;
  }
  if (profileNickname) {
    profileNickname.textContent = `Biệt danh: ${profileUser.nickname || "Chưa cập nhật"}`;
  }
  if (profileQuote) {
    profileQuote.textContent = profileUser.quote || "Chưa có câu giới thiệu.";
  }
}

function renderProfileMeta(profileUser) {
  if (!profileMeta) {
    return;
  }

  profileMeta.innerHTML = `
    <span>Username: ${escapeHtml(profileUser.username)}</span>
    <span>Vai trò: ${profileUser.role === "admin" ? "Quản trị viên" : "Thành viên"}</span>
    <span>Trường: THPT YD số 3</span>
    <span>Lớp: 12A5</span>
    <span>Niên khóa: 2024 - 2027</span>
  `;
}

function renderProfileBio(profileUser) {
  if (!profileBio) {
    return;
  }

  const bioText =
    profileUser.bio ||
    `${profileUser.name || "Thành viên"} là một phần thanh xuân của tập thể lớp 12A5 - THPT YD số 3.`;
  profileBio.innerHTML = `<p>${escapeHtml(bioText)}</p>`;
}

function renderProfileGuestbook(profileUser, viewer) {
  if (!profileGuestbook) {
    return;
  }

  const entries = getGuestbookEntries()
    .filter((entry) => entry.username === profileUser.username)
    .filter(
      (entry) => entry.status === "approved" || canSeePendingContent(viewer, profileUser.username)
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (!entries.length) {
    profileGuestbook.innerHTML = `<p class="empty-inline">Thành viên này chưa có lưu bút nào.</p>`;
    return;
  }

  profileGuestbook.innerHTML = entries
    .map((entry) => {
      const status =
        entry.status === "approved"
          ? "Đã duyệt"
          : entry.status === "pending"
            ? "Chờ duyệt"
            : "Đã từ chối";

      return `
        <article class="profile-feed-card">
          <strong>${escapeHtml(entry.title || "Lưu bút")}</strong>
          <p>${escapeHtml(entry.message || "")}</p>
          <small>${escapeHtml(status)} • ${escapeHtml(formatDate(entry.createdAt))}</small>
        </article>
      `;
    })
    .join("");
}

function renderProfileMoments(profileUser, viewer) {
  if (!profileMoments) {
    return;
  }

  const moments = getMoments()
    .filter((moment) => moment.username === profileUser.username)
    .filter(
      (moment) => moment.status === "approved" || canSeePendingContent(viewer, profileUser.username)
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (!moments.length) {
    profileMoments.innerHTML = `<p class="empty-inline">Thành viên này chưa đăng khoảnh khắc nào.</p>`;
    return;
  }

  profileMoments.innerHTML = moments
    .map((moment) => {
      const status =
        moment.status === "approved"
          ? "Đã duyệt"
          : moment.status === "pending"
            ? "Chờ duyệt"
            : "Đã từ chối";
      const imageHtml = moment.image
        ? `<img src="${moment.image}" alt="${escapeHtml(moment.title || "Khoảnh khắc")}">`
        : "";

      return `
        <article class="profile-feed-card">
          ${imageHtml}
          <strong>${escapeHtml(moment.title || "Khoảnh khắc")}</strong>
          <p>${escapeHtml(moment.caption || "")}</p>
          <small>${escapeHtml(status)} • ${escapeHtml(formatDate(moment.createdAt))}</small>
        </article>
      `;
    })
    .join("");
}

function fillEditorForm(profileUser, viewer) {
  if (!profileEditForm || !profileEditorCard) {
    return false;
  }

  const canEdit = Boolean(viewer && (viewer.role === "admin" || viewer.username === profileUser.username));
  profileEditorCard.hidden = !canEdit;

  if (!canEdit) {
    return false;
  }

  const isAdmin = viewer.role === "admin";
  const editingOwnProfile = viewer.username === profileUser.username;

  if (profileNameField) {
    profileNameField.hidden = !isAdmin;
  }
  if (profileNicknameField) {
    profileNicknameField.hidden = !isAdmin;
  }

  if (editNameInput) {
    editNameInput.value = profileUser.name || "";
  }
  if (editNicknameInput) {
    editNicknameInput.value = profileUser.nickname || "";
  }
  if (editQuoteInput) {
    editQuoteInput.value = profileUser.quote || "";
  }
  if (editBioInput) {
    editBioInput.value = profileUser.bio || "";
  }
  if (editImageInput) {
    editImageInput.value = "";
  }

  if (profileEditHint) {
    if (isAdmin && !editingOwnProfile) {
      profileEditHint.textContent = `Bạn đang chỉnh sửa hồ sơ của ${profileUser.name}.`;
    } else if (isAdmin && editingOwnProfile) {
      profileEditHint.textContent = "Bạn đang chỉnh sửa hồ sơ quản trị viên.";
    } else {
      profileEditHint.textContent = "Bạn đang chỉnh sửa hồ sơ của chính mình.";
    }
  }

  return true;
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Không đọc được ảnh đã chọn."));
    reader.readAsDataURL(file);
  });
}

function setupEditor(profileUser, viewer, rerender) {
  const canEdit = fillEditorForm(profileUser, viewer);
  if (!canEdit || !profileEditForm) {
    return;
  }

  profileEditForm.onsubmit = async (event) => {
    event.preventDefault();

    const users = getUsers();
    const index = users.findIndex((user) => user.username === profileUser.username);
    if (index < 0) {
      if (profileEditHint) {
        profileEditHint.textContent = "Không tìm thấy hồ sơ để cập nhật.";
      }
      return;
    }

    const nextUser = { ...users[index] };
    const isAdmin = viewer?.role === "admin";
    const nameValue = String(editNameInput?.value || "").trim();
    const nicknameValue = String(editNicknameInput?.value || "").trim();
    const quoteValue = String(editQuoteInput?.value || "").trim();
    const bioValue = String(editBioInput?.value || "").trim();

    if (isAdmin) {
      if (nameValue) {
        nextUser.name = nameValue;
      }
      if (nicknameValue) {
        nextUser.nickname = nicknameValue;
      }
    }

    nextUser.quote = quoteValue || nextUser.quote || "";
    nextUser.bio = bioValue || "";

    const selectedFile = editImageInput?.files?.[0];
    if (selectedFile) {
      nextUser.image = await fileToDataUrl(selectedFile);
    }

    users[index] = nextUser;
    setUsers(users);

    if (profileEditHint) {
      profileEditHint.textContent = "Đã lưu thay đổi hồ sơ.";
    }

    rerender(nextUser);
  };

  profileResetImageButton?.addEventListener("click", () => {
    const users = getUsers();
    const index = users.findIndex((user) => user.username === profileUser.username);
    if (index < 0) {
      return;
    }

    users[index] = { ...users[index], image: "" };
    setUsers(users);

    if (profileEditHint) {
      profileEditHint.textContent = "Đã xóa ảnh hồ sơ.";
    }

    rerender(users[index]);
  });
}

function renderProfilePage(profileUser) {
  const viewer = currentUser();
  renderProfileHeader(profileUser);
  renderProfileMeta(profileUser);
  renderProfileBio(profileUser);
  renderProfileGuestbook(profileUser, viewer);
  renderProfileMoments(profileUser, viewer);
  setupEditor(profileUser, viewer, renderProfilePage);
}

function bootstrap() {
  const profileUser = profileFromQuery();
  if (!profileUser) {
    renderNotFound();
    return;
  }

  renderProfilePage(profileUser);
}

bootstrap();
