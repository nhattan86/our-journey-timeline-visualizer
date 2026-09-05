# Hành Trình Yêu Thương (our journey - timeline visualizer)

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Threejs](https://img.shields.io/badge/threejs-black?style=for-the-badge&logo=three.js&logoColor=white)

Một ứng dụng web tương tác giúp trực quan hóa dữ liệu bản đồ `.kml` / `.kmz` thành một chuyến bay mượt mà trên nền tảng **OpenStreetMap**. Được thiết kế với giao diện lãng mạn, hiện đại, ứng dụng này sinh ra để lưu giữ và trình diễn các chuyến đi, hành trình kỷ niệm của bạn một cách sống động nhất.

---

## Tính Năng Nổi Bật

*   🚀 **Trình diễn 3D Cinematic:** Render đường đi (trail) với hiệu ứng phát sáng Neon Cam rực rỡ, điểm đến (marker) Xanh Dương hiện đại và một trái tim Đỏ Tươi lơ lửng dẫn đường bay qua từng tọa độ.
*   🗺️ **Bản Đồ Nền OpenStreetMap:** Tích hợp trực tiếp thuật toán lấy gạch bản đồ (tiles) từ OpenStreetMap, hiển thị sắc nét, không lo lỗi CORS.
*   🎵 **Trình Phát Nhạc Tích Hợp (YouTube API):** 
    *   Sinh nhạc Lofi thư giãn tự động bằng **Tone.js**.
    *   Phát nhạc từ link **YouTube** bất kỳ (vượt rào chặn Autoplay nhờ IFrame API chìm).
    *   Hỗ trợ đọc link file `.mp3` trực tiếp.
*   📍 **Phân Tích Dữ Liệu Địa Lý:** Tự động tính toán tổng quãng đường đã đi, khoảng cách giữa 2 điểm liên tiếp và tính toán **khoảng cách đường chim bay (Haversine)** giữa 2 điểm quan trọng tự chọn.
*   📋 **Bảng Điều Khiển Thông Minh (Sidebar):** Quản lý danh sách các điểm đến, theo dõi lộ trình real-time và cung cấp nút **liên kết trực tiếp tới vị trí đó trên Google Maps**.
*   📸 **Chụp Ảnh Khoảnh Khắc:** Lưu lại góc nhìn 3D hiện tại dưới dạng ảnh `.png` chỉ với 1 cú click.

---

## Công Nghệ Sử Dụng

Dự án được xây dựng hoàn toàn bằng **Vanilla Web Technologies** (không sử dụng framework nặng nề như React/Vue), đảm bảo tốc độ load cực nhanh và chạy trực tiếp trên trình duyệt không cần cài đặt môi trường.

*   **Lõi đồ họa:** [Three.js (r128)](https://threejs.org/)
*   **Giải nén File:** [JSZip](https://stuk.github.io/jszip/) (để đọc file nén `.kmz`)
*   **Xử lý Âm thanh:** [Tone.js](https://tonejs.github.io/)
*   **API Bổ trợ:** YouTube IFrame Player API

---

## Hướng Dẫn Sử Dụng

Vì là một ứng dụng Client-side 100%, bạn không cần phải cài đặt Node.js hay bất kỳ local server nào.

1. Tải toàn bộ source code về máy.
2. Mở trực tiếp file `our-journey.html` bằng bất kỳ trình duyệt hiện đại nào (Chrome, Edge, Safari, Firefox...).
3. Tại màn hình chính, kéo thả hoặc bấm chọn nút tải lên file bản đồ (`.kml` hoặc `.kmz`) của bạn (có thể xuất file này từ Google My Maps hoặc Google Earth).
4. Tận hưởng chuyến bay!

### Hệ Thống Phím Tắt (Hotkeys)
*   <kbd>Space</kbd> : Phát / Tạm dừng chuyến bay.
*   <kbd>→</kbd> / <kbd>←</kbd> : Bay đến điểm kế tiếp / Quay lại điểm trước.
*   <kbd>M</kbd> : Mở bảng điều khiển Nhạc Nền.
*   <kbd>F</kbd> : Bật / Tắt chế độ Toàn Màn Hình (Fullscreen).
*   **Chuột/Cảm ứng**: Kéo để xoay góc nhìn, lăn chuột để Phóng to/Thu nhỏ (Zoom).

---

## Giấy Phép (License)

Dự án này là mã nguồn mở. Bạn có thể tự do sử dụng, chỉnh sửa và tùy biến theo ý thích cá nhân.

---
<h3 align="center">
  <i>build with love by nhattan ❤️</i>
</h3>
