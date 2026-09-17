/**
 * @file geo-math.test.js
 * @description Bộ kiểm thử hình thức cho mô đun Toán học Địa lý & Web Mercator Tiles.
 * Tuân thủ mô hình Tuple toán học: TC = <S_pre, I, E, S_post, O>.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  haversineKm,
  interpolateRoute,
  latLonToTile,
  tileToLatLon,
  computeBoundingBox,
  computeTilesForBBox,
  computeTilesForRoute,
  getLookAheadCoord
} from './engine.js';

describe('Formal Test Suite: Geo Math & Tile Projections', () => {

  // TC-GEO-01: BVA 3-giá trị cho khoảng cách Haversine trùng tọa độ (dist = 0)
  test('TC-GEO-01: Haversine distance with zero distance boundary', () => {
    // S_pre: Hàm toán học khởi tạo
    // I: P1(10.7725, 106.6983), P2(10.7725, 106.6983)
    const dist = haversineKm(10.7725, 106.6983, 10.7725, 106.6983);
    // E: dist === 0
    // S_post: Trạng thái không đổi
    // O: assert.strictEqual(dist, 0)
    assert.strictEqual(dist, 0, 'Khoảng cách giữa hai điểm trùng nhau bắt buộc phải bằng 0');
  });

  // TC-GEO-02: EP - Khoảng cách thực tế giữa Hà Nội và TP.HCM
  test('TC-GEO-02: Haversine distance Hanoi to HCMC (~1138 km)', () => {
    // S_pre: Tọa độ Hà Nội (21.0285, 105.8542) và TP.HCM (10.7725, 106.6983)
    const hanoi = [21.0285, 105.8542];
    const hcm = [10.7725, 106.6983];
    const dist = haversineKm(hanoi[0], hanoi[1], hcm[0], hcm[1]);
    // E: Khoảng cách đường chim bay ~ 1144.0 km (dung sai cho phép +- 5km)
    // O:
    assert.ok(
      Math.abs(dist - 1144.0) < 5.0,
      `Khoảng cách tính toán (${dist.toFixed(2)} km) phải xấp xỉ 1144 km`
    );
  });

  // TC-GEO-03: Boundary latLonToTile tại xích đạo và kinh tuyến gốc (Lat=0, Lon=0, Z=14)
  test('TC-GEO-03: Web Mercator Tile conversion at (0, 0, Z=14)', () => {
    // S_pre: Zoom 14 -> 2^14 = 16384 tiles mỗi chiều
    // I: Lat=0, Lon=0, Z=14
    const tile = latLonToTile(0, 0, 14);
    // E: Tâm bản đồ phải là tile (8192, 8192)
    // O:
    assert.deepStrictEqual(
      tile,
      { x: 8192, y: 8192, z: 14, key: '14/8192/8192' },
      'Tile tại (0,0) ở zoom 14 bắt buộc phải là 8192/8192'
    );
  });

  // TC-GEO-04: EP - Tile Corridor Generation dọc tuyến đường 3 điểm (Hà Nội, Đà Nẵng, TP.HCM)
  test('TC-GEO-04: Route corridor tile calculation with no duplicates', () => {
    const route = [
      [105.8525, 21.0287], // HN
      [108.2272, 16.0611], // DN
      [106.6983, 10.7725]  // HCM
    ];
    const tiles = computeTilesForRoute(route, 8, 1);
    assert.ok(tiles.length > 0, 'Phải sinh ra danh sách tile');
    // Kiểm tra tính duy nhất (không trùng lặp key)
    const uniqueKeys = new Set(tiles.map(t => t.key));
    assert.strictEqual(
      uniqueKeys.size,
      tiles.length,
      'Danh sách tile corridor không được chứa phần tử trùng lặp'
    );
  });

  // TC-GEO-05: Bounding Box & BBox tiles coverage
  test('TC-GEO-05: Bounding Box calculation and tile coverage', () => {
    const coords = [
      [105.0, 10.0],
      [107.0, 12.0]
    ];
    const bbox = computeBoundingBox(coords);
    assert.deepStrictEqual(bbox, [105.0, 10.0, 107.0, 12.0]);

    const bboxTiles = computeTilesForBBox(bbox, 6);
    assert.ok(bboxTiles.length >= 1, 'Phải có ít nhất 1 tile bao phủ BBox ở zoom 6');
  });

  // TC-GEO-06: Tái lấy mẫu nội suy (Interpolation) tăng mật độ điểm
  test('TC-GEO-06: Interpolation increases point density smoothly', () => {
    const sparse = [
      [106.0, 10.0],
      [106.01, 10.01] // cách nhau ~1.5 km
    ];
    const dense = interpolateRoute(sparse, 100); // bước 100m
    assert.ok(dense.length > 10, 'Nội suy bước 100m phải sinh ra hơn 10 điểm');
    // Điểm đầu và điểm cuối phải bảo toàn
    assert.deepStrictEqual(dense[0], sparse[0]);
    assert.deepStrictEqual(dense[dense.length - 1], sparse[1]);
  });

  // TC-GEO-07: Tọa độ đón đầu camera (Lookahead vector)
  test('TC-GEO-07: Lookahead vector calculates ahead position along segment', () => {
    const route = [
      [106.0, 10.0],
      [106.0, 10.01],
      [106.0, 10.02]
    ];
    const current = route[0];
    const lead = getLookAheadCoord(route, current, 0, 100); // đón đầu 100m
    assert.ok(lead[1] > current[1], 'Vĩ độ điểm đón đầu phải tiến về phía trước theo hướng đi');
  });
});
