const CLASS_MEMBER_STORAGE_KEY = "kyyeu_users_v1";
const CLASS_DEFAULT_PASSWORD = "123456";
const CLASS_AVATAR_CLASSES = ["avatar-sky", "avatar-gold", "avatar-rose", "avatar-mint"];
const CLASS_MEMBER_NAMES = [
  "Hán Thị Tâm Anh",
  "Lê Thị Ngọc Anh",
  "Nguyễn Duy Anh",
  "Nguyễn Thị Hoàng Anh",
  "Ngụy Quỳnh Chi",
  "Nguyễn Thị Thùy Dung",
  "Phan Văn Dũng",
  "Lưu Thị Mỹ Duyên",
  "Lê Quang Anh Đức",
  "Trần Anh Đức",
  "Hoàng Thị Thu Hằng",
  "Nguyễn Trung Hiếu",
  "Nguyễn Trung Hiếu",
  "Lương Đức Minh Hòa",
  "Nguyễn Thu Hoài",
  "Cao Xuân Khánh",
  "Nguyễn Quốc Khánh",
  "Nguyễn Khắc Khôi",
  "Ngụy Thị Hương Linh",
  "Vũ Thùy Linh",
  "Nguyễn Thị Ly",
  "Nguyễn Bảo Nam",
  "Phạm Nguyên Bảo Nam",
  "Trần Nhật Nam",
  "Chu Thanh Ngọc",
  "Triệu Tấn Phong",
  "Trần Duy Phương",
  "Ngụy Thế Quang",
  "Phan Thị Như Quỳnh",
  "Vũ Thị Quỳnh",
  "Dương Tuấn Tài",
  "Ngụy Phan Tiến Thành",
  "Nguyễn Thị Thanh Thảo",
  "Hồ Quyết Thắng",
  "Nguyễn Xuân Thắng",
  "Phạm Viết Thắng",
  "Nguyễn Thị Thu Trang",
  "Ong Thị Trang",
  "Vũ Thị Huyền Trang",
  "Nguyễn Thị Trinh",
  "Nguyễn Tú Uyên",
  "Bùi Quang Vinh",
  "Hoàng Anh Vũ",
  "Nguyễn Thanh Vương",
];
const CLASS_QUOTES = [
  "Nếu đã đi cùng nhau đến đây thì hãy nhớ nhau thật lâu.",
  "Tuổi học trò đẹp nhất vì có bạn bè và những ngày rất thật.",
  "Ba năm qua rồi nhưng tiếng cười vẫn còn ở lại.",
  "Mỗi bức ảnh là một lần thanh xuân quay lại.",
  "Ngày chia tay là ngày biết lớp mình quan trọng đến mức nào.",
];

function readClassStorage(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeClassStorage(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function classSlug(number) {
  return String(number).padStart(2, "0");
}

function defaultNicknameFromName(name) {
  const parts = name.split(" ");
  return parts.slice(-2).join(" ");
}

function buildOfficialUsers() {
  const adminUser = {
    username: "admin12a5",
    password: CLASS_DEFAULT_PASSWORD,
    name: "Admin 12A5",
    nickname: "Lớp trưởng",
    quote: "Mình duyệt từng kỷ niệm để mọi thứ lên web đều thật đẹp.",
    bio: "Tài khoản quản trị của lớp 12A5 - THPT YD số 3.",
    role: "admin",
    image: "",
    avatarClass: CLASS_AVATAR_CLASSES[0],
  };

  const members = CLASS_MEMBER_NAMES.map((name, index) => ({
    username: `member${classSlug(index + 1)}`,
    password: CLASS_DEFAULT_PASSWORD,
    name,
    nickname: defaultNicknameFromName(name),
    quote: CLASS_QUOTES[index % CLASS_QUOTES.length],
    bio: `Mình là ${name}, một thành viên của lớp 12A5 - THPT YD số 3.`,
    role: "member",
    image: "",
    avatarClass: CLASS_AVATAR_CLASSES[(index + 1) % CLASS_AVATAR_CLASSES.length],
  }));

  return [adminUser, ...members];
}

function ensureClassUsers() {
  const officialUsers = buildOfficialUsers();
  const existingUsers = readClassStorage(CLASS_MEMBER_STORAGE_KEY, []);
  const existingMap = new Map(existingUsers.map((user) => [user.username, user]));

  const mergedUsers = officialUsers.map((officialUser) => {
    const existingUser = existingMap.get(officialUser.username);
    if (!existingUser) {
      return officialUser;
    }

    if (officialUser.role === "admin") {
      return {
        ...officialUser,
        ...existingUser,
        username: officialUser.username,
        role: officialUser.role,
        password: existingUser.password || officialUser.password,
        bio: existingUser.bio || officialUser.bio,
        image: existingUser.image || officialUser.image,
        quote: existingUser.quote || officialUser.quote,
        avatarClass: existingUser.avatarClass || officialUser.avatarClass,
      };
    }

    return {
      ...officialUser,
      password: existingUser.password || officialUser.password,
      bio: existingUser.bio || officialUser.bio,
      image: existingUser.image || officialUser.image,
      quote: existingUser.quote || officialUser.quote,
      avatarClass: existingUser.avatarClass || officialUser.avatarClass,
    };
  });

  writeClassStorage(CLASS_MEMBER_STORAGE_KEY, mergedUsers);
  return mergedUsers;
}

window.ensureClassUsers = ensureClassUsers;
window.readClassStorage = readClassStorage;
window.writeClassStorage = writeClassStorage;
window.classAvatarClasses = CLASS_AVATAR_CLASSES;
window.ensureClassUsers();
