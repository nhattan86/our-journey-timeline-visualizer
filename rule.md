# BO QUY TAC PHAT TRIEN & KIEM THU HINH THUC (ENGINEERING & VERIFICATION RULES)
> **Du an:** Our Journey - Timeline Visualizer  
> **Ap dung cho:** Tat ca cac phien lam viec, refactor, phat trien tinh nang moi va kiem thu ma nguon.

---

## I. VAI TRO & TRIET LY COT LOI (CORE PHILOSOPHY)

Khi tiep nhan bat ky yeu cau lap trinh hay sua loi nao trong du an nay, ky su luon dong vai tro la **Chuyen Gia Cao Cap ve Ky Nghe Kiem Thu Phan Mem (Lead QA/Verification Engineer) va Embedded/System Engineer**.

1. **Triet ly Bat Toan cua Karl Popper (Falsificationism):**
   - Muc tieu toi thuong cua kiem thu **khong phai la chung minh phan mem chay duoc**, ma la thuc nghiem co he thong nham **chi ra cac diem gay do (failure points) va su bat toan cua he thong so voi dac ta**.
   - Bat ky doan ma hay tinh nang nao moi sinh ra deu phai chiu su chat van nghiem ngat o cac truong hop bien, du lieu di dang, mat ket noi mang va xung dot trang thai (race conditions).

2. **Tuan thu 7 Tien De Kiem Thu cua ISTQB / ISO/IEC/IEEE 29119:**
   - **Tien de 1 (Testing shows presence of defects):** Kiem thu chi ra su hien dien cua loi, khong the chung minh 100% khong co loi.
   - **Tien de 2 (Exhaustive testing is impossible):** Khong kiem thu vet can vo tan, bat buoc dung Phan vung tuong duong (EP) va Phan tich gia tri bien (BVA).
   - **Tien de 3 (Early testing):** Kiem tra ngay tu tang logic toan hoc toa do, phan tich cu phap KML truoc khi ghep vao giao dien.
   - **Tien de 4 (Defect clustering):** Chu y cac cum loi nhay cam: XML KML la, ket noi dinh tuyen OSRM timeout, may trang thai FSM khi nguoi dung keo tua timeline don dap.
   - **Tien de 5 (Pesticide paradox):** Thuong xuyen bo sung cac test vector moi khi them tinh nang.
   - **Tien de 6 (Testing is context dependent):** Kiem thu Web GIS/3D animation phu thuoc vao WebGL context, kich thuoc man hinh va toc do tai tile mang.
   - **Tien de 7 (Absence-of-errors fallacy):** Ung dung khong crash nhung giat lag hoac trang khung hinh ban do van bi coi la loi nghiem trong.

---

## II. QUY TAC THIET KE TEST CASE HINH THUC (FORMAL TEST MODEL)

Moi Test Case trong du an bat buoc phai duoc mo hinh hoa theo **Tuple Toan Hoc 5 Thanh Phan**:

$$\mathcal{TC} = \langle S_{pre}, I, E, S_{post}, \mathcal{O} \rangle$$

- **$S_{pre}$ (Preconditions):** Trang thai he thong, cau hinh bo nho/FSM truoc khi kich hoat.
- **$I$ (Input Vector):** Du lieu kich thich dau vao, bao gom ca yeu to dinh thoi (timing/delay/timeout).
- **$E$ (Expected Output):** Ket qua ky vong hoac ngoai le bat buoc phai xuat hien.
- **$S_{post}$ (Postconditions):** Trang thai he thong sau khi test (don dep buffer, giai phong listener, rollback cache, trang thai FSM).
- **$\mathcal{O}$ (Test Oracle):** Co che tham dinh Pass/Fail doc lap va khong the choi cai (`assert.strictEqual`, ma loi, bat bien trang thai).

### Ky thuat Bat Buoc Khi Viet Test:
1. **Boundary Value Analysis (BVA 3-gia tri):**
   - Luon kiem tra bo 3 gia tri $\{b - \epsilon, b, b + \epsilon\}$ tai moi nguong:
     - So diem moc: $N = 0, 1, 2$; nguong chunking $N = 24$; nguong tracklog $N = 80$.
     - Tien trinh timeline: $p = 0, N - 1$, vuot bien am $p < 0$, vuot bien duong $p > N - 1$.
     - Toa do dia ly: Vi do $[-90, 90]$, Kinh do $[-180, 180]$.
     - Toc do phat: $[1, 2, 4, 0.4]$, timeout mang $3500\text{ms}$.
2. **Decision Table Testing:**
   - Kiem tra day du bang chan tri da dieu kien:
     - Mode (Nav / Direct) $\times$ Token Mapbox (Co / Khong) $\times$ Ket noi mang (Online / Timeout / Offline).
3. **Negative & Security Testing:**
   - Thuc nghiem chuoi XML khong the dong, file rong, XML injection chua `<script>` hoac `<img onerror>`.
4. **Automated Verification Runner:**
   - Bo test dat tai thu muc `tests/*.test.js`, chay truc tiep bang `npm test` hoac `make test`.
   - **Quy tac thep:** 100% test cases phai PASS truoc khi commit va deploy.

---

## III. NGUYEN TAC KIEN TRUC & MA NGUON (ARCHITECTURE & CODE QUALITY)

1. **Kien Truc Nguon Duy Nhat (Single-Source Standalone Architecture):**
   - **`our-journey.html` LA FILE NGUON CHINH DUY NHAT:** Chuan hoa toan bo ma nguon, logic ban do 3D, he thong am thanh, xu ly KML va giao dien vao duy nhat tep nay. Khong duy tri trung lap thu muc `src/` nham tranh tinh trang lech pha ma nguon.
   - **`index.html` LA TEP DIEU HUONG GITHUB PAGES:** `index.html` chi dong vai tro la entrypoint chuyen huong nhe (0ms redirect) den `our-journey.html` de phuc vu GitHub Pages goc.
   - Nguoi dung co the nhap dup chuot truc tiep vao `our-journey.html` de mo offline ma khong can Node.js hay bundler.

2. **Nghiem Cam Lam Dung Icon & Emoji (Strict Zero-Icon Abuse Rule):**
   - **Tuyet doi khong dung emoji trang tri:** Loai bo hoan toan emoji trang tri trong ma nguon, giao dien nguoi dung, `README.md`, `rule.md` va commit messages.
   - **Uu tien vector SVG toi gian:** Khi can bieu tuong chuc nang, su dung `<svg>` vector thanh manh (Feather/Lucide style), su dung `currentColor` va stroke mong tinh te.

3. **Hieu Nang Toi Thuong & Dong Co Tai Truoc Ban Do (Tile Preloader Engine):**
   - Tuyet doi khong de xay ra hien tuong chop trang/xam khung hinh (blank/gray tile flash) khi camera di chuyen.
   - Su dung giai thuat chuyen doi toa do **Web Mercator (EPSG:3857)** de tinh toan corridor tiles va nap truoc vao cache HTTP voi worker pool dong thoi ($\le 6$).
   - Luon duy tri co che **Dynamic Lookahead Preloading** trong vong lap animation (du doan va nap truoc tile phia truoc $1000\text{m} - 1500\text{m}$).
   - Moi hieu ung hat Canvas 2D bat buoc ap dung **Particle Pool Pattern** de loai bo hien tuong khuc xa bo nho do Garbage Collection.

4. **Bao Toan Logic Nghiep Vu Dung 100%:**
   - Khong xoa hoac lam hu hai cac tinh nang dung:
     - Che do Xe chay (Navigation) va Chim bay (Direct).
     - Chu quyen quan dao Hoang Sa va Truong Sa thuoc Viet Nam.
     - He thong am thanh Tone.js ambient va YouTube iframe player.
     - Tinh nang xong hanh Tieng Viet va Tieng Anh.
     - Do khoang cach giua 2 diem moc quan trong (Featured Points).

5. **Do Phuc Tap Tuan Hoan (Cyclomatic Complexity - $V(G)$):**
   - Moi ham moi hoac sau refactor phai tuan thu $V(G) \le 5$. Tuan thu nguyen tac trach nhiem don nhat (Single Responsibility Principle).

---

## IV. QUY TRINH DEPLOY & CAM KET TOAN VEN (DEPLOYMENT & COMMIT PROTOCOL)

Truoc khi ban giao cong viec va day ma nguon len GitHub:

1. **Kiem thu va Kiem tra Toan ven:**
   - Chay `make test` de kiem tra 27/27 test cases.
   - Chay `make build` de kiem tra tinh toan ven cua `our-journey.html` va `index.html`.
2. **Cam ket Commit Day Du (Commit Everything):**
   - Bat buoc thuc hien `git add -A` de dua toan bo cac tep sua doi va tep moi vao staging area.
   - Khong de sot bat ky tep untracked hay thay doi dang do nao truoc khi push.
3. **Thuc thi Deploy:**
   - Chay `make deploy` de thuc hien chuoi hanh dong tu dong: Test -> Build -> Stage All -> Commit -> Push `origin main`.
   - Xac nhan kho luu tru GitHub da nhan day du commit moi nhat.

---
*Bo quy tac nay la tieu chuan bat buoc cho moi ky su va AI agent lam viec tren du an.*
