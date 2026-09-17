# Hanh Trinh Yeu Thuong (Our Journey - Timeline Visualizer)

![Version](https://img.shields.io/badge/version-2.0.0-brightgreen?style=for-the-badge)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![MapLibre GL](https://img.shields.io/badge/MapLibre_GL-5.2.0-blue?style=for-the-badge)
![Tone.js](https://img.shields.io/badge/Tone.js-15.0.4-orange?style=for-the-badge)
![Tests](https://img.shields.io/badge/Formal_Tests-27%2F27_Passed-success?style=for-the-badge)
![Deployment](https://img.shields.io/badge/GitHub_Pages-Live-success?style=for-the-badge)

Ung dung web tuong tac truc quan hoa du lieu ban do `.kml` va `.kmz` thanh chuyen di 3D bam sat tung cung duong thuc te. Du an duoc thiet ke theo kien truc **Single-Source Standalone Application** toi uu hoa cho GitHub Pages, tich hop **Dong co Tai truoc Ban do Thong minh (Intelligent Map Tile Preloader)** va he thong **Kiem thu Hinh thuc (Formal Verification Testing)** dat tieu chuan 100% Pass.

- **Truy cap truc tiep tren GitHub Pages**: [https://nhattan86.github.io/our-journey-timeline-visualizer/](https://nhattan86.github.io/our-journey-timeline-visualizer/)

---

## Huong Dan Cach Chay Ung Dung (Quick Start)

### Cach 1: Truy cap truc tuyen (GitHub Pages)
Truy cap truc tiep vao dia chi:
[https://nhattan86.github.io/our-journey-timeline-visualizer/](https://nhattan86.github.io/our-journey-timeline-visualizer/)

Tep `index.html` se tu dong chuyen huong sang `our-journey.html` ngay lap tuc ma khong co do tre.

---

### Cach 2: Mo truc tiep cuc bo (Offline Standalone)
Nho kien truc doc lap khong phu thuoc bundler:
1. Tai ma nguon hoac clone repository ve may tinh:
   ```bash
   git clone https://github.com/nhattan86/our-journey-timeline-visualizer.git
   cd our-journey-timeline-visualizer
   ```
2. Nhap dup chuot truc tiep vao tep **`our-journey.html`** de mo bang bat ky trinh duyet hien dai nao (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari).
3. Bam nut **"Kham pha lo trinh mau"** hoac **"Doi ban do"** de nap file `.kml` / `.kmz` cua ban.

---

### Cach 3: Chay qua Local Web Server
Neu ban muon phat trien ma nguon hoac kiem thu qua may chu cuc bo:
```bash
# Cach A: Su dung Python
python -m http.server 8000

# Cach B: Su dung Node npx serve
npx serve .
```
Mo trinh duyet tai dia chi `http://localhost:8000/our-journey.html`.

---

## Quy Trinh Trien Khai & Tu Dong Hoa (Makefile)

Du an duoc trang bi `Makefile` chuan hoa moi thao tac kiem thu, kiem tra dong bo va day code len GitHub Pages:

| Lenh | Mo ta chi tiet |
| :--- | :--- |
| `make test` | Chay toan bo 27 formal test cases tu dong bang Node.js Test Runner |
| `make build` | Kiem tra toan ven ma nguon `our-journey.html` va tep dieu huong `index.html` |
| `make status` | Hien thi trang thai Git hien thoi |
| `make deploy` | Tu dong: Chay test -> Chay build -> Stage toan bo (`git add -A`) -> Commit -> Push len `origin main` |
| `make clean` | Don dep cac tep tam thoi |
| `make help` | Hien thi huong dan su dung cac lenh |

Vi du trien khai nhanh voi commit tuy chinh:
```bash
make deploy COMMIT_MSG="Cap nhat tinh nang va toi uu hoa hieu nang"
```

---

## Bo Kiem Thu Hinh Thuc (Formal Test Suite)

Dua tren triet ly **Falsificationism (Karl Popper)** va tieu chuan **ISO/IEC/IEEE 29119**, he thong kiem thu duoc to chuc doc lap trong thu muc `tests/`:

```bash
# Chay kiem thu toan bo
npm test

# Hoac chay truc tiep qua Node.js
node --test tests/*.test.js
```

Ket qua nghiem thu: **27/27 Test Cases Dat Chuan (100% Pass) trong ~350ms:**
- `TC-GEO-01` den `TC-GEO-07`: Giai thuat Haversine, Web Mercator Tile conversion, Route Corridor calculation, Lookahead vector.
- `TC-KML-01` den `TC-KML-06`: Parser KML/KMZ Placemarks, LineString fallback, chong XSS (Cross-Site Scripting), kiem tra bien du lieu.
- `TC-ROU-01` den `TC-ROU-04`: Dinh tuyen OSRM theo chunking $\le 24$ diem, bo nho dem API, co che fallback chim bay tu dong khi mat mang.
- `TC-PRE-01` den `TC-PRE-04`: Dong co Tile Preloader da tang, URL resolver cho 4 kieu ban do, Dynamic Lookahead Prefetch.
- `TC-FSM-01` den `TC-FSM-06`: May trang thai huu han (FSM), scrubbing muot ma, tim kiem nhi phan toa do noi suy.

---

## Cac Tinh Nang Cong Nghe Cot Loi

### 1. Dong Co Tai Truoc Ban Do Thong Minh (Tile Preloader Engine)
- **Triet tieu hien tuong chop trang ban do**: Tu dong tinh toan toa do cac manh ban do Web Mercator $(x, y, z)$ doc theo hanh lang tuyen duong va nap truoc vao cache trinh duyet qua worker pool dong thoi ($\le 6$ workers).
- **Don dau goc nhin (Dynamic Lookahead Prefetch)**: Khi camera di chuyen, thu vien tu dong tinh toan vector huong nhin va tai truoc cac tile phia truoc tu $500\text{m} - 1500\text{m}$.
- **Hien thi tien trinh tai sach se**: Badge trang thai hien thi ro rang ty le nap: `Dang tai truoc ban do: X%` va tu dong an sau khi san sang 100%.

### 2. Ban Do 3D MapLibre GL v5.2.0 WebGL 2.0
- Tang toc render GPU, giu khung hinh on dinh 60fps khi camera luot tren dia hinh 3D nghieng $45^\circ$.
- Tich hop 4 nguon ban do tin cay:
  - **CartoDB Pastel Voyager** (Mac dinh): Gam mau pastel êm diu.
  - **Google Maps**: Ban do giao thong chi tiet, tieng Viet.
  - **ESRI World Street Map**: He thong ban do toan cau khong loi 403.
  - **Mapbox Streets v12**: Ho tro Access Token ca nhan.

### 3. Tuan Thu Chu Quyen Bien Dao Viet Nam
- Hien thi day du va trang trong quan dao **Hoang Sa** va **Truong Sa** thuoc chu quyen Viet Nam tren moi kieu hien thi ban do.

### 4. Am Thanh & Hieu Ung Hat Anh Sang (Particle Engine)
- Tich hop **Tone.js v15.0.4** tao giai dieu ambient sinh dong bang AudioWorklet.
- Ho tro ket noi YouTube Iframe API va nhac MP3 tuy chon.
- Particle Pool tuan hoan bo nho, loai bo hien tuong khuc xa bo nho do Garbage Collection khi ban phao hoa mung ve dich.

---

## Bang Phim Tat Dieu Khien

| Phim | Chuc Nang |
| :--- | :--- |
| `Space` | Phat / Tam dung hanh trinh |
| `->` (Mui ten phai) | Chuyen den moc dia diem ke tiep |
| `<-` (Mui ten trai) | Quay lai moc dia diem truoc do |
| `Home` | Quay ve diem khoi hanh ban dau |
| `End` | Chuyen nhanh den diem ket thuc hanh trinh |
| `Escape` | Dong cac hop thoai (Nhac, Kieu ban do, Danh sach) |
| `M` | Mo bang dieu khien am nhac |
| `F` | Bat / Tat che do toan man hinh |
| `Keo chuot trai` | Di chuyen ban do (Pan) |
| `Keo chuot phai` | Xoay goc nhin va do nghieng 3D (Bearing / Pitch) |
| `Cuon chuot` | Phong to / Thu nho (Zoom) |

---

## Cau Truc Thu Muc Du An

```
our-journey-timeline-visualizer/
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Actions tu dong deploy GitHub Pages
├── .agents/
│   └── rules/
│       └── engineering-rules.md  # Bo quy tac ky thuat va chuan muc ma nguon
├── scripts/
│   └── build-standalone.js   # Script kiem tra toan ven ung dung standalone
├── tests/
│   ├── engine.js             # Engine giai thuat toan hoc & FSM dung cho test
│   ├── geo-math.test.js      # Test toa do, Haversine va Web Mercator
│   ├── kml-parser.test.js    # Test phan tich cu phap KML/KMZ & chong XSS
│   ├── router.test.js        # Test dinh tuyen thuc te & fallback chim bay
│   ├── tile-preloader.test.js# Test tai truoc tile ban do & worker pool
│   └── timeline-fsm.test.js  # Test may trang thai FSM & noi suy thoi gian
├── our-journey.html          # FILE CHINH: Toan bo logic, giao dien va 3D engine
├── index.html                # Entrypoint dieu huong nhanh 0ms phuc vu GitHub Pages
├── Makefile                  # Tu dong hoa test, build va deploy len GitHub
├── package.json              # Khai bao metadata va lenh npm test, npm run build
├── rule.md                   # Ban quy tac danh cho ky su va AI agent
└── README.md                 # Tai lieu ky thuat va huong dan su dung
```

---

## Giay Phep (License)

Du an duoc phat hanh theo giay phep ma nguon mo **MIT License**.
