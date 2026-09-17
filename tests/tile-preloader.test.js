/**
 * @file tile-preloader.test.js
 * @description Bộ kiểm thử hình thức cho Động cơ Tải trước Bản đồ (Tile Preloader Engine).
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { TilePreloader } from './engine.js';

describe('Formal Test Suite: Tile Preloader Engine & Cache Warming', () => {

  // TC-PRE-01: Sinh URL tile chuẩn xác cho từng nguồn bản đồ
  test('TC-PRE-01: Generates correct tile URLs for different styles', () => {
    const preloader = new TilePreloader({ layerType: 'carto' });
    const cartoUrl = preloader.getTileUrl(100, 200, 14);
    assert.ok(cartoUrl.includes('/14/100/200@2x.png'), 'URL CartoDB phải đúng cấu trúc tile');

    preloader.setLayer('google');
    const googleUrl = preloader.getTileUrl(100, 200, 14);
    assert.ok(googleUrl.includes('x=100&y=200&z=14'), 'URL Google Maps phải đúng tham số x, y, z');

    preloader.setLayer('mapbox', 'pk.test_token');
    const mapboxUrl = preloader.getTileUrl(100, 200, 14);
    assert.ok(mapboxUrl.includes('/14/100/200?access_token=pk.test_token'));
  });

  // TC-PRE-02: Tải trước toàn bộ tile trong corridor với mock fetcher
  test('TC-PRE-02: Preloads route corridor tiles to 100% readiness', async () => {
    const requestedUrls = [];
    const mockFetcher = async (url) => {
      requestedUrls.push(url);
      return { ok: true, status: 200, blob: async () => ({}) };
    };

    const preloader = new TilePreloader({
      layerType: 'carto',
      maxConcurrency: 4,
      fetcher: mockFetcher
    });

    const route = [
      [106.68, 10.76],
      [106.70, 10.78]
    ];

    let progressFired = false;
    preloader.onProgress((status) => {
      progressFired = true;
      assert.ok(status.total > 0);
    });

    // Chỉ test zoom 14 để kiểm thử nhanh
    const status = await preloader.preloadRoute(route, [14]);

    assert.ok(progressFired, 'Sự kiện progress phải được kích hoạt');
    assert.strictEqual(status.percent, 100, 'Phần trăm hoàn thành phải đạt 100%');
    assert.strictEqual(status.ready, true, 'Trạng thái ready phải là true');
    assert.ok(requestedUrls.length > 0, 'Phải có request tải tile được gửi đi');
    assert.ok(preloader.getLoadedCount() > 0, 'Số lượng tile trong cache phải lớn hơn 0');
  });

  // TC-PRE-03: Dynamic Lookahead thêm các tile phía trước vào hàng đợi ưu tiên cao
  test('TC-PRE-03: Dynamic lookahead enqueues tiles ahead of camera heading', () => {
    const preloader = new TilePreloader();
    const currentCoord = [106.6983, 10.7725]; // TP.HCM
    const headingNorth = 0; // Hướng Bắc (0 độ)

    preloader.prefetchAhead(currentCoord, headingNorth, 1000, 14);

    // Hàng đợi phải chứa các tile phía trước với priority = 150
    assert.ok(preloader.queue.length > 0, 'Hàng đợi phải được bổ sung các tile đón đầu');
    const topItem = preloader.queue[0];
    assert.strictEqual(topItem.priority, 150, 'Tile đón đầu phải có mức ưu tiên cao nhất (150)');
  });

  // TC-PRE-04: Đổi kiểu bản đồ tự động xóa cache và reset hàng đợi
  test('TC-PRE-04: Changing layer resets tile cache and queue', () => {
    const preloader = new TilePreloader({ layerType: 'carto' });
    preloader.cachedTileKeys.add('14/100/100');
    assert.strictEqual(preloader.getLoadedCount(), 1);

    preloader.setLayer('google');
    assert.strictEqual(preloader.getLoadedCount(), 0, 'Cache phải được dọn sạch khi đổi layer');
  });
});
