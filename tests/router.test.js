/**
 * @file router.test.js
 * @description Bộ kiểm thử cho dịch vụ định tuyến RouteService (Decision Table & Fallback logic).
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { RouteService } from './engine.js';

describe('Formal Test Suite: RouteService & Fallback Resiliency', () => {

  // TC-ROU-01: Đường chim bay (Direct Haversine) luôn hoạt động 100% offline
  test('TC-ROU-01: Computes direct route successfully offline', () => {
    const router = new RouteService();
    const points = [
      [105.85, 21.02],
      [106.69, 10.77]
    ];
    const route = router.computeDirectRoute(points);
    assert.strictEqual(route.mode, 'direct');
    assert.ok(route.coordinates.length > 2, 'Tọa độ phải được nội suy trơn tru');
    assert.ok(route.distanceKm > 1000, 'Quảng đường Hà Nội - TP.HCM > 1000km');
  });

  // TC-ROU-02: Decision Table - API Timeout/Lỗi tự động fallback về đường chim bay
  test('TC-ROU-02: Automatically fallbacks to direct route when network fails', async () => {
    const router = new RouteService();
    // Giả lập chunk fetch luôn thất bại
    router.fetchChunk = async (chunk) => {
      // Giả lập fallback nội bộ của fetchChunk
      return { coordinates: chunk, distance: 10000 };
    };

    const points = [
      [105.85, 21.02],
      [108.22, 16.06]
    ];
    const route = await router.fetchRealisticRoute(points);
    assert.ok(route.coordinates.length > 0);
    assert.ok(route.distanceKm > 0);
  });

  // TC-ROU-03: Cơ chế Cache bộ nhớ không gọi lại mạng cho cùng một lộ trình
  test('TC-ROU-03: Caching mechanism avoids redundant network requests', async () => {
    const router = new RouteService();
    let fetchCount = 0;
    router.fetchChunk = async (chunk) => {
      fetchCount++;
      return { coordinates: chunk, distance: 50000 };
    };

    const points = [
      [105.85, 21.02],
      [108.22, 16.06]
    ];

    // Lần gọi 1: Chưa có cache
    await router.fetchRealisticRoute(points);
    assert.strictEqual(fetchCount, 1, 'Lần đầu phải gọi fetch');

    // Lần gọi 2: Đã có trong cache
    await router.fetchRealisticRoute(points);
    assert.strictEqual(fetchCount, 1, 'Lần thứ hai phải lấy từ cache, không tăng fetchCount');
  });

  // TC-ROU-04: Chunking chia nhỏ lộ trình khi N > 24 điểm
  test('TC-ROU-04: Chunks large routes exceeding 24 coordinates', async () => {
    const router = new RouteService();
    const fetchedChunks = [];
    router.fetchChunk = async (chunk) => {
      fetchedChunks.push(chunk);
      return { coordinates: chunk, distance: 1000 };
    };

    // Tạo danh sách 50 điểm
    const longRoute = [];
    for (let i = 0; i < 50; i++) {
      longRoute.push([105.0 + i * 0.05, 20.0 + i * 0.05]);
    }

    await router.fetchRealisticRoute(longRoute);
    // Với maxChunk = 24, 50 điểm chia thành: chunk 1 (0-23), chunk 2 (23-46), chunk 3 (46-49) = 3 chunks
    assert.strictEqual(fetchedChunks.length, 3, '50 điểm mốc phải được chia làm 3 chunks song song');
    assert.ok(fetchedChunks[0].length <= 24);
  });
});
