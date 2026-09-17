# Hành Trình Yêu Thương (Our Journey - Timeline Visualizer)

![Phiên Bản](https://img.shields.io/badge/version-2.0.0-brightgreen?style=for-the-badge)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![MapLibre GL](https://img.shields.io/badge/MapLibre_GL-5.2.0-blue?style=for-the-badge)
![Tone.js](https://img.shields.io/badge/Tone.js-15.0.4-orange?style=for-the-badge)
![Kiểm Thử](https://img.shields.io/badge/Formal_Tests-27%2F27_Passed-success?style=for-the-badge)
![Triển Khai](https://img.shields.io/badge/GitHub_Pages-Live-success?style=for-the-badge)

Ứng dụng web tương tác trực quan hóa dữ liệu bản đồ `.kml` và `.kmz` thành chuyến đi 3D bám sát từng cung đường thực tế. Dự án được thiết kế theo kiến trúc **Single-Source Standalone Application** tối ưu hóa cho GitHub Pages, tích hợp **Động cơ Tải trước Bản đồ Thông minh (Intelligent Map Tile Preloader)** và hệ thống **Kiểm thử Hình thức (Formal Verification Testing)** đạt tiêu chuẩn 100% Pass.

- **Truy cập trực tiếp trên GitHub Pages**: [https://nhattan86.github.io/our-journey-timeline-visualizer/](https://nhattan86.github.io/our-journey-timeline-visualizer/)

---

## Hướng Dẫn Cách Chạy Ứng Dụng (Quick Start)

### Cách 1: Truy cập trực tuyến (GitHub Pages)
Truy cập trực tiếp vào địa chỉ:
[https://nhattan86.github.io/our-journey-timeline-visualizer/](https://nhattan86.github.io/our-journey-timeline-visualizer/)

Tệp `index.html` sẽ tự động chuyển hướng sang `our-journey.html` ngay lập tức mà không có độ trễ.

---

### Cách 2: Mở trực tiếp cục bộ (Offline Standalone)
Nhờ kiến trúc độc lập không phụ thuộc bundler hay node_modules:
1. Tải mã nguồn hoặc clone repository về máy tính:
   ```bash
   git clone https://github.com/nhattan86/our-journey-timeline-visualizer.git
   cd our-journey-timeline-visualizer
   ```
2. Nhấp đúp chuột trực tiếp vào tệp **`our-journey.html`** để mở bằng bất kỳ trình duyệt hiện đại nào (Google Chrome, Microsoft Edge, Mozilla Firefox, Apple Safari).
3. Bấm nút **"Khám phá lộ trình mẫu"** hoặc **"Đổi bản đồ"** để nạp file `.kml` / `.kmz` của bạn.

---

### Cách 3: Chạy qua Local Web Server
Nếu bạn muốn phát triển mã nguồn hoặc kiểm thử qua máy chủ cục bộ:
```bash
# Cách A: Sử dụng Python
python -m http.server 8000

# Cách B: Sử dụng Node npx serve
npx serve .
```
Mở trình duyệt tại địa chỉ `http://localhost:8000/our-journey.html`.

---

## Quy Trình Triển Khai & Tự Động Hóa (Makefile)

Dự án được trang bị `Makefile` chuẩn hóa mọi thao tác kiểm thử, kiểm tra đồng bộ và đẩy code lên GitHub Pages:

| Lệnh | Mô tả chi tiết |
| :--- | :--- |
| `make test` | Chạy toàn bộ 27 formal test cases tự động bằng Node.js Test Runner |
| `make build` | Kiểm tra toàn vẹn mã nguồn `our-journey.html` và tệp điều hướng `index.html` |
| `make status` | Hiển thị trạng thái Git hiện thời |
| `make deploy` | Tự động: Chạy test -> Chạy build -> Stage toàn bộ (`git add -A`) -> Commit (tiếng Anh) -> Push lên `origin main` |
| `make clean` | Dọn dẹp các tệp tạm thời |
| `make help` | Hiển thị hướng dẫn sử dụng các lệnh |

Ví dụ triển khai nhanh với commit message tiếng Anh tùy chỉnh:
```bash
make deploy COMMIT_MSG="feat: update tile preloading engine and ui polish"
```

---

## Bộ Kiểm Thử Hình Thức (Formal Test Suite)

Dựa trên triết lý **Falsificationism (Karl Popper)** và tiêu chuẩn **ISO/IEC/IEEE 29119**, hệ thống kiểm thử được tổ chức độc lập trong thư mục `tests/`:

```bash
# Chạy kiểm thử toàn bộ
npm test

# Hoặc chạy trực tiếp qua Node.js
node --test tests/*.test.js
```

Kết quả nghiệm thu: **27/27 Test Cases Đạt Chuẩn (100% Pass) trong ~300ms:**
- `TC-GEO-01` đến `TC-GEO-07`: Giải thuật Haversine, chuyển đổi tọa độ Web Mercator Tile, tính toán Route Corridor, véc-tơ Lookahead.
- `TC-KML-01` đến `TC-KML-06`: Parser KML/KMZ Placemarks, LineString fallback, chống XSS (Cross-Site Scripting), kiểm tra biên dữ liệu.
- `TC-ROU-01` đến `TC-ROU-04`: Định tuyến OSRM theo phân đoạn (chunking $\le 24$ điểm), bộ nhớ đệm API, cơ chế fallback đường thẳng tự động khi mất mạng.
- `TC-PRE-01` đến `TC-PRE-04`: Động cơ Tile Preloader đa tầng, URL resolver cho 4 kiểu bản đồ, Dynamic Lookahead Prefetch đón đầu góc nhìn camera.
- `TC-FSM-01` đến `TC-FSM-06`: Máy trạng thái hữu hạn (FSM), tua thanh thời gian mượt mà, tìm kiếm nhị phân tọa độ nội suy chính xác cao.

---

## Các Tính Năng Công Nghệ Cốt Lõi

### 1. Động Cơ Tải Trước Bản Đồ Thông Minh (Tile Preloader Engine)
- **Triệt tiêu hiện tượng chớp trắng bản đồ**: Tự động tính toán tọa độ các mảnh bản đồ Web Mercator $(x, y, z)$ dọc theo hành lang tuyến đường và nạp trước vào cache trình duyệt qua worker pool đồng thời ($\le 6$ workers).
- **Đón đầu góc nhìn (Dynamic Lookahead Prefetch)**: Khi camera di chuyển, hệ thống tự động tính toán véc-tơ hướng nhìn và tải trước các tile phía trước từ $500\text{m} - 1500\text{m}$.
- **Hiển thị tiến trình tải trực quan**: Badge trạng thái hiển thị rõ ràng tỷ lệ nạp: `Đang tải trước bản đồ: X%` và tự động ẩn sau khi sẵn sàng 100%.

### 2. Bản Đồ 3D MapLibre GL v5.2.0 WebGL 2.0
- Tăng tốc độ render GPU, giữ khung hình ổn định 60fps khi camera lướt trên địa hình 3D nghiêng $45^\circ$.
- Tích hợp 4 nguồn bản đồ tin cậy:
  - **CartoDB Pastel Voyager** (Mặc định): Gam màu pastel êm dịu.
  - **Google Maps**: Bản đồ giao thông chi tiết, tiếng Việt chuẩn xác.
  - **ESRI World Street Map**: Hệ thống bản đồ toàn cầu không lỗi 403.
  - **Mapbox Streets v12**: Hỗ trợ Access Token cá nhân.

### 3. Khẳng Định Chủ Quyền Biển Đảo Việt Nam
- Hiển thị đầy đủ và trang trọng quần đảo **Hoàng Sa** và **Trường Sa** thuộc chủ quyền Việt Nam trên mọi kiểu hiển thị bản đồ.

### 4. Âm Thanh & Hiệu Ứng Hạt Ánh Sáng (Particle Engine)
- Tích hợp **Tone.js v15.0.4** tạo giai điệu ambient sinh động bằng AudioWorklet.
- Hỗ trợ kết nối YouTube Iframe API và nhạc MP3 tùy chọn.
- Áp dụng mô hình **Particle Pool Pattern** tuần hoàn bộ nhớ, loại bỏ hoàn toàn hiện tượng khựng khung hình do Garbage Collection khi bắn pháo hoa mừng về đích.

---

## Bảng Phím Tắt Điều Khiển

| Phím | Chức Năng |
| :--- | :--- |
| `Space` | Phát / Tạm dừng hành trình |
| `->` (Mũi tên phải) | Chuyển đến mốc địa điểm kế tiếp |
| `<-` (Mũi tên trái) | Quay lại mốc địa điểm trước đó |
| `Home` | Quay về điểm khởi hành ban đầu |
| `End` | Chuyển nhanh đến điểm kết thúc hành trình |
| `Escape` | Đóng các hộp thoại (Nhạc, Kiểu bản đồ, Danh sách) |
| `M` | Mở bảng điều khiển âm nhạc |
| `F` | Bật / Tắt chế độ toàn màn hình |
| `Kéo chuột trái` | Di chuyển bản đồ (Pan) |
| `Kéo chuột phải` | Xoay góc nhìn và độ nghiêng 3D (Bearing / Pitch) |
| `Cuộn chuột` | Phóng to / Thu nhỏ (Zoom) |

---

## Cấu Trúc Thư Mục Dự Án

```
our-journey-timeline-visualizer/
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Actions tự động deploy GitHub Pages
├── .agents/
│   └── rules/
│       └── engineering-rules.md  # Bộ quy tắc kỹ thuật và chuẩn mực mã nguồn
├── scripts/
│   └── build-standalone.js   # Script kiểm tra toàn vẹn ứng dụng standalone
├── tests/
│   ├── engine.js             # Engine giải thuật toán học & FSM dùng cho test
│   ├── geo-math.test.js      # Test tọa độ, Haversine và Web Mercator
│   ├── kml-parser.test.js    # Test phân tích cú pháp KML/KMZ & chống XSS
│   ├── router.test.js        # Test định tuyến thực tế & fallback chim bay
│   ├── tile-preloader.test.js# Test tải trước tile bản đồ & worker pool
│   └── timeline-fsm.test.js  # Test máy trạng thái FSM & nội suy thời gian
├── our-journey.html          # FILE CHÍNH: Toàn bộ logic, giao diện và 3D engine
├── index.html                # Entrypoint điều hướng nhanh 0ms phục vụ GitHub Pages
├── Makefile                  # Tự động hóa test, build và deploy lên GitHub
├── package.json              # Khai báo metadata và lệnh npm test, npm run build
├── rule.md                   # Bản quy tắc dành cho kỹ sư và AI agent
└── README.md                 # Tài liệu kỹ thuật tiếng Việt có dấu chuẩn
```

---

## Giấy Phép (License)

Dự án được phát hành theo giấy phép mã nguồn mở **MIT License**.
