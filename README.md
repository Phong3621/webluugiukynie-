# Ky Yeu 12A5 - Huong Dan Sua Va Su Dung

Tai lieu nay huong dan day du cach chay, su dung, va chinh sua du an website ky yeu lop 12A5.

## 1) Tong quan

Day la website **static front-end** (khong co backend, khong can build), gom:
- HTML + CSS + JavaScript thuan
- Du lieu luu tren trinh duyet bang `localStorage`
- Nhac nen + playlist noi
- Chuyen trang co hieu ung video
- Trang thanh vien, khoanh khac, luu but, profile ca nhan

## 2) Cau truc thu muc

```text
webkyyeu/
  index.html
  members.html
  member.html
  moments.html
  guestbook.html
  README.md
  css/
    style.css
    style.scss
  js/
    main.js
    class-members.js
    member-profile.js
  media/
    page-transition.mp4
    ky-niem.mp4
  logo/
    images.jfif
  music/
    *.mp3
  thu-muc-thanh-vien/
    ... (anh/video goc thanh vien)
```

## 3) Yeu cau moi truong

- Trinh duyet moi (Chrome, Edge, Firefox)
- Co Python (khuyen nghi) de chay server local

## 4) Chay web local

### Cach nhanh (Python)

Mo terminal tai thu muc du an, chay:

```powershell
python -m http.server 5500
```

Mo trinh duyet:

`http://localhost:5500/index.html`

### Dung server khac

Co the dung bat ky static server nao, mien la root la thu muc du an.

## 5) Tai khoan demo

Du lieu user tao trong `js/class-members.js` va dong bo qua `localStorage`.

- Admin:
  - Username: `admin12a5`
  - Password: `123456`
- Member mau:
  - Username: `member01`
  - Password: `123456`

## 6) Chuc nang chinh

- Dang nhap/ dang xuat tren cac trang
- Danh sach thanh vien + profile rieng (`member.html?user=...`)
- Dang khoanh khac (anh + caption)
- Viet luu but
- Binh luan khoanh khac
- Khu admin duyet noi dung cho member
- Kho anh tong hop
- Playlist nhac noi (thu gon/phong to/an dang bong bong)
- Bong bong nhac dung logo truong
- Chuyen trang bang video mini card
- Dung thoi gian (timeline) tren trang chu
- Note loi nhan tuong lai (luu localStorage)
- Khu video ky niem o cuoi trang chu

## 7) Cac key localStorage

Duoc dung trong `js/main.js`:

- `kyyeu_users_v1`
- `kyyeu_session_v1`
- `kyyeu_guestbook_v1`
- `kyyeu_moments_v1`
- `kyyeu_comments_v1`
- `kyyeu_future_notes_v1`
- `kyyeu_music_unlocked_v1`
- `kyyeu_player_state_v1`

Neu can reset trang ve trang thai ban dau:

1. Mo DevTools -> Application -> Local Storage
2. Xoa cac key tren (hoac xoa toan bo localStorage cho `localhost:5500`)
3. Reload trang

## 8) Huong dan chinh sua noi dung nhanh

## 8.1 Chinh text giao dien

- Sua truc tiep trong cac file:
  - `index.html`
  - `members.html`
  - `moments.html`
  - `guestbook.html`
  - `member.html`

## 8.2 Chinh mau, layout, hieu ung

- File chinh: `css/style.css`
- Bien mau toan cuc o dau file:
  - `--bg`, `--surface`, `--text`, `--primary`, ...

## 8.3 Chinh du lieu thanh vien

- File: `js/class-members.js`
- Mang ten thanh vien: `CLASS_MEMBER_NAMES`
- Sau khi sua, can xoa key `kyyeu_users_v1` trong localStorage de tai tao lai danh sach.

## 8.4 Chinh logic trang

- File: `js/main.js`
  - Dang nhap
  - Duyet noi dung
  - Playlist
  - Transition
  - Timeline + Future notes
- File: `js/member-profile.js`
  - Hien thi profile
  - Chinh sua profile (theo quyen)

## 8.5 Chinh playlist nhac

Playlist duoc khai bao trong HTML bang cac nut `.track-item` tren tung trang:
- `index.html`, `members.html`, `moments.html`, `guestbook.html`

Moi bai hat can:
- `data-title`
- `data-artist`
- `data-src` (duong dan file `.mp3` trong thu muc `music/`)

## 8.6 Chinh logo bong bong nhac

- Logo hien tai: `logo/images.jfif`
- CSS su dung tai `.music-bubble` trong `css/style.css`

Neu doi logo:
1. Thay file logo moi trong thu muc `logo/`
2. Sua duong dan `background-image` neu can

## 8.7 Chinh video chuyen trang

- File hien tai: `media/page-transition.mp4`
- Duoc gan trong `index.html`, `members.html`, `moments.html`, `guestbook.html` qua the:
  - `<video class="transition-video" ...>`

## 8.8 Chinh video ky niem cuoi trang chu

- Khu video o `index.html` voi `id="memory-video-player"`
- Nguon mac dinh:
  - `media/ky-niem.mp4`

Chi can thay file video moi dung ten nay, hoac doi `src` trong `index.html`.

## 9) Cac tinh huong loi thuong gap

## 9.1 Quay lai trang bi giu man hinh transition

Da co fix trong `js/main.js` bang `pageshow/pagehide`.
Neu van gap:
- Hard reload (`Ctrl + F5`)
- Xoa cache trinh duyet

## 9.2 Nhac khong tu phat

Do chinh sach autoplay cua trinh duyet.
- Bam 1 lan vao nut `Phat` de mo quyen phat nhac

## 9.3 Da sua file nhung web chua doi

- Kiem tra dang mo dung URL local (`localhost:5500`)
- Hard reload (`Ctrl + F5`)
- Kiem tra dung ten file/duong dan (`media/...`, `music/...`, `logo/...`)

## 9.4 Loi font/tieng Viet bi vo dau

- Dam bao file luu dang UTF-8
- Dam bao HTML co:
  - `<meta charset="UTF-8">`

## 10) Goi y quy trinh chinh sua an toan

1. Backup file truoc khi sua lon
2. Sua tung nhom nho (HTML/CSS/JS)
3. Reload test ngay sau moi nhom thay doi
4. Test tren desktop va mobile width
5. Neu dung Git, commit theo tung feature nho

## 11) Huong dan cap nhat nhanh theo nhu cau

- Doi anh/logo: thu muc `logo/`
- Doi nhac: thu muc `music/` + cap nhat `.track-item`
- Doi transition: `media/page-transition.mp4`
- Doi video ky niem: `media/ky-niem.mp4`
- Them/chinh thanh vien: `js/class-members.js`
- Chinh profile: `js/member-profile.js`
- Chinh giao dien tong the: `css/style.css`

---

Neu can, co the bo sung them mot file `CHANGELOG.md` de theo doi lich su sua doi theo ngay.
