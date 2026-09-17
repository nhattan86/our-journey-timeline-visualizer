/**
 * @file build-standalone.js
 * @description Kiểm tra tính toàn vẹn của our-journey.html và xác nhận tệp chuyển hướng index.html phục vụ GitHub Pages.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const htmlPath = path.join(rootDir, 'our-journey.html');
const indexPath = path.join(rootDir, 'index.html');

console.log('=== KIỂM TRA TOÀN VẸN ỨNG DỤNG STANDALONE & GITHUB PAGES ===');

if (!fs.existsSync(htmlPath)) {
  console.error('[LỖI] Không tìm thấy tệp our-journey.html!');
  process.exit(1);
}

const htmlContent = fs.readFileSync(htmlPath, 'utf8');

const checks = [
  { name: 'MapLibre GL v5.2.0 CSS', regex: /maplibre-gl@5\.2\.0\/dist\/maplibre-gl\.css/ },
  { name: 'MapLibre GL v5.2.0 JS', regex: /maplibre-gl@5\.2\.0\/dist\/maplibre-gl\.js/ },
  { name: 'JSZip Library', regex: /jszip/ },
  { name: 'Tone.js v15.0.4', regex: /tone@15\.0\.4\/build\/Tone\.js/ },
  { name: 'Preload Badge HTML', regex: /id="preloadBadge"/ },
  { name: 'Preload Badge CSS', regex: /\.preload-badge/ },
  { name: 'TilePreloader Class', regex: /class TilePreloader/ },
  { name: 'Web Mercator Tile Math', regex: /function latLonToTile/ },
  { name: 'Preload Route Execution', regex: /tilePreloader\.preloadRoute/ },
  { name: 'Lookahead Tile Prefetch', regex: /tilePreloader\.prefetchAhead/ }
];

let allPassed = true;
checks.forEach(c => {
  if (c.regex.test(htmlContent)) {
    console.log(`  [PASS] ${c.name}`);
  } else {
    console.error(`  [FAIL] Thiếu thành phần: ${c.name}`);
    allPassed = false;
  }
});

// Kiểm tra không lạm dụng emoji
const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1FA00}-\u{1FAFF}]/u;
if (emojiRegex.test(htmlContent)) {
  console.error('  [FAIL] Phát hiện emoji còn sót lại trong our-journey.html!');
  allPassed = false;
} else {
  console.log('  [PASS] Không phát hiện emoji lạm dụng trong our-journey.html');
}

// Kiểm tra tệp chuyển hướng index.html
if (!fs.existsSync(indexPath)) {
  console.error('  [FAIL] Không tìm thấy tệp chuyển hướng index.html!');
  allPassed = false;
} else {
  const indexContent = fs.readFileSync(indexPath, 'utf8');
  if (indexContent.includes('our-journey.html') && indexContent.includes('location.replace')) {
    console.log('  [PASS] index.html chuyển hướng chính xác sang our-journey.html');
  } else {
    console.error('  [FAIL] index.html chưa cấu hình chuyển hướng hợp lệ.');
    allPassed = false;
  }
}

if (allPassed) {
  console.log('\n[THÀNH CÔNG] Tất cả kiểm tra toàn vẹn ứng dụng đều đạt chuẩn chất lượng.');
} else {
  console.error('\n[THẤT BẠI] Kiểm tra không đạt yêu cầu.');
  process.exit(1);
}
