# Hành Trình Yêu Thương (Our Journey - Timeline Visualizer)

![Version](https://img.shields.io/badge/version-1.1-brightgreen?style=for-the-badge)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![MapLibre GL](https://img.shields.io/badge/MapLibre_GL-3.6.2-blue?style=for-the-badge)

Ứng dụng web tương tác giúp trực quan hóa dữ liệu bản đồ `.kml` và `.kmz` thành chuyến đi 3D mượt mà, bám sát từng cung đường thực tế. Được xây dựng hoàn toàn bằng công nghệ Client-side (Vanilla Web), ứng dụng hỗ trợ trình chiếu lộ trình kỷ niệm, tự động tính toán thông số quãng đường và tích hợp hệ thống âm thanh nền đa dạng.

---

## Tính Năng Chính

### 1. Bản đồ 3D và hiển thị đa tầng (Multi-layer Map)
- Sử dụng MapLibre GL 3D Engine hỗ trợ hiển thị mượt mà, tùy chỉnh góc nghiêng (pitch) và xoay tự do (bearing).
- Hỗ trợ lựa chọn 4 nguồn bản đồ khác nhau, khắc phục triệt để lỗi chặn kết nối (CORS / HTTP 403):
  - **CartoDB Pastel Voyager** (Mặc định): Tông màu pastel nhẹ nhàng, thanh lịch.
  - **Google Maps**: Bản đồ đường phố độ nét cao, hiển thị tiếng Việt chi tiết.
  - **ESRI World Street Map**: Bản đồ giao thông quốc tế ổn định.
  - **Mapbox Streets v12**: Tùy biến thông qua Mapbox Access Token cá nhân.

### 2. Hai chế độ di chuyển (Routing Modes)
- **Xe chạy (Navigation)**: Tự động kết nối OSRM (Open Source Routing Machine) và Mapbox Directions API để vẽ đường đi thực tế uốn lượn theo mạng lưới giao thông đường bộ.
- **Chim bay (Direct)**: Nối thẳng các tọa độ địa lý theo thuật toán Haversine, phù hợp với hành trình bay hoặc các chặng di chuyển thẳng.
- Bộ lọc nội suy (Interpolation) giúp chuyển động của icon dẫn đường luôn êm ái qua từng góc cua.

### 3. Điều hướng và góc nhìn Camera
- Chế độ tự động bám theo tâm điểm (Auto Camera Tracking) giữ khung hình luôn tập trung vào vị trí hiện tại của hành trình.
- Người dùng có thể chủ động kéo thả hoặc phóng to, thu nhỏ bản đồ bất kỳ lúc nào; hệ thống có nút căn giữa (Recenter) để tiếp tục bám theo lộ trình.
- La bàn (Compass) tự động quay theo hướng nhìn thực tế và hỗ trợ click để đưa bản đồ quay về hướng Bắc.
- Cụm nút phóng to (+) và thu nhỏ (-) trực quan ngay trên giao diện.

### 4. Phân tích dữ liệu và thống kê
- **Thanh thông số thời gian thực (Stat Bar)**:
  - Tổng số lượng địa điểm trong hành trình.
  - Tổng quãng đường của toàn bộ chuyến đi (km).
  - Số km đã hoàn thành theo thời gian thực.
  - Tỷ lệ phần trăm tiến độ chuyến đi.
- **Thẻ thông tin chi tiết (Stop Card)**:
  - Thứ tự điểm, tên địa điểm và tọa độ GPS (kinh độ, vĩ độ).
  - Khoảng cách giữa hai điểm liên tiếp (km).
  - Khoảng cách tích lũy từ điểm xuất phát.
- **Điểm mốc quan trọng (Featured Points)**:
  - Cho phép ghim tối đa 2 điểm đặc biệt để đo khoảng cách chim bay trực tiếp giữa hai mốc này.
- **Tổng kết hành trình (Journey Summary)**:
  - Tự động hiển thị bảng thông tin tổng kết khi chuyến đi kết thúc và cung cấp nút xem lại từ đầu.

### 5. Quản lý danh sách địa điểm (Sidebar Panel)
- Liệt kê toàn bộ các điểm đến theo đúng thứ tự hành trình kèm khoảng cách chặng.
- Click vào điểm bất kỳ để di chuyển camera tức thì tới vị trí đó.
- Tích hợp nút mở nhanh tọa độ trực tiếp trên Google Maps.

### 6. Hệ thống âm thanh nền đa dạng
- **Tone.js**: Tự động sinh hợp âm thư giãn, êm dịu theo phong cách Lofi Ambient.
- **Lofi Chill & Piano**: Các bản nhạc mẫu tích hợp sẵn.
- **Phát nhạc theo liên kết**: Hỗ trợ nhập link video YouTube (chạy ngầm thông qua YouTube IFrame Player API) hoặc đường dẫn trực tiếp tới file `.mp3`.

### 7. Tiện ích bổ sung
- Chụp ảnh khung cảnh (Screenshot): Xuất góc nhìn 3D hiện tại thành tệp ảnh `.png` sắc nét.
- Chế độ Toàn màn hình (Fullscreen).
- Thanh trượt thời gian (Timeline scrubber) kèm danh sách các điểm mốc (ticks) trực quan.
- Tùy chỉnh tốc độ phát linh hoạt (1x, 1.5x, 2x, 0.5x).

---

## Công Nghệ Sử Dụng

Dự án hoạt động hoàn toàn ở phía trình duyệt (Client-side 100%), không yêu cầu môi trường Node.js hay máy chủ trung gian:

- **Map Engine**: [MapLibre GL JS (v3.6.2)](https://maplibre.org/)
- **Giải nén tệp tin**: [JSZip](https://stuk.github.io/jszip/) (đọc tệp `.kmz` và trích xuất file `.kml`)
- **Xử lý âm thanh**: [Tone.js](https://tonejs.github.io/) và YouTube IFrame Player API
- **Routing API**: OSRM (Open Source Routing Machine) và Mapbox Directions API
- **Nền tảng**: HTML5, CSS3, Vanilla JavaScript (ES6+)

---

## Hướng Dẫn Sử Dụng

1. Tải toàn bộ mã nguồn về máy tính hoặc clone repository.
2. Mở trực tiếp tệp `our-journey.html` bằng bất kỳ trình duyệt hiện đại nào (Chrome, Edge, Safari, Firefox...).
3. Nhấn nút **Tải bản đồ lên** (hoặc **Đổi bản đồ**) để chọn tệp `.kml` hoặc `.kmz` (xuất từ Google My Maps, Google Earth hoặc các ứng dụng GPS tracker).
4. Hệ thống sẽ tự động phân tích dữ liệu, vẽ đường đi và sẵn sàng trình chiếu.

### Hệ Thống Phím Tắt

| Phím | Chức Năng |
| :--- | :--- |
| `Space` | Phát / Tạm dừng hành trình |
| `->` (Mũi tên phải) | Chuyển đến địa điểm kế tiếp |
| `<-` (Mũi tên trái) | Quay lại địa điểm trước đó |
| `M` | Mở bảng điều khiển âm nhạc |
| `F` | Bật / Tắt chế độ toàn màn hình |
| `Kéo chuột trái` | Di chuyển bản đồ (Pan) |
| `Kéo chuột phải` | Xoay hướng nhìn và thay đổi độ nghiêng 3D (Bearing / Pitch) |
| `Cuộn chuột` | Phóng to / Thu nhỏ (Zoom) |

---

## Nhật Ký Phiên Bản (Changelog)

<details>
<summary><b>Xem chi tiết lịch sử cập nhật</b></summary>
<br>

### Phiên bản 1.1
- **Nâng cấp Map Engine**: Chuyển đổi từ cơ chế render gạch Three.js sang MapLibre GL JS 3D Engine, nâng cao hiệu năng và độ ổn định trên mọi thiết bị.
- **Đa dạng lớp bản đồ**: Bổ sung 4 nguồn bản đồ (CartoDB Pastel Voyager, Google Maps, ESRI World Street, Mapbox Streets v12), xử lý triệt để lỗi 403 từ OpenStreetMap cũ.
- **Bổ sung chế độ Xe chạy và Chim bay**: Tích hợp định tuyến thực tế từ OSRM / Mapbox giúp đường đi uốn lượn theo mạng lưới giao thông thực tế.
- **Bảng số liệu thời gian thực**: Bổ sung thanh thống kê (số km đã đi, tỷ lệ hoàn thành hành trình), thẻ thông tin chi tiết từng chặng và hộp thoại tổng kết chuyến đi.
- **Tối ưu hóa Camera & Điều hướng**: Bổ sung la bàn tương tác, nút khóa theo dõi (Recenter), cụm phím phóng to/thu nhỏ chuyên dụng.
- **Nâng cấp hệ thống âm thanh**: Bổ sung các bản nhạc mẫu và cơ chế phát nhạc YouTube chìm ổn định hơn.
- **Tối ưu hóa bộ phân tích KML/KMZ**: Đọc dữ liệu nhanh hơn, hỗ trợ màu sắc và giải nén mượt mà.

### Phiên bản 1.0
- Khởi tạo dự án trực quan hóa hành trình với Three.js và OpenStreetMap.
- Hỗ trợ đọc tệp `.kml` và `.kmz`.
- Trình phát nhạc Tone.js cơ bản và tính năng chụp ảnh khung cảnh.

</details>

---

## Giấy Phép (License)

Dự án được phát hành dưới giấy phép mã nguồn mở. Bạn có thể tự do sử dụng, chỉnh sửa và phát triển cho mục đích cá nhân.

---

<h3 align="center">
  <i>build with love by nhattan ❤️</i>
</h3>
