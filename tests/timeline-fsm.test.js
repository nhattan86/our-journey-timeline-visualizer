/**
 * @file timeline-fsm.test.js
 * @description Bộ kiểm thử hình thức cho Finite State Machine (FSM) và Binary Search tra cứu tiến trình.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { TimelineEngine } from './engine.js';

describe('Formal Test Suite: Timeline FSM & Progress State Transitions', () => {

  const sampleWaypoints = [
    { name: 'Hà Nội', lon: 105.85, lat: 21.02 },
    { name: 'Đà Nẵng', lon: 108.22, lat: 16.06 },
    { name: 'TP.HCM', lon: 106.69, lat: 10.77 }
  ];

  const sampleRoute = {
    coordinates: [
      [105.85, 21.02],
      [107.0, 18.5],
      [108.22, 16.06],
      [107.5, 13.5],
      [106.69, 10.77]
    ],
    distanceKm: 1200,
    mode: 'direct'
  };

  // TC-FSM-01: 0-Switch State Transition (PAUSED -> PLAYING)
  test('TC-FSM-01: Transitions from PAUSED to PLAYING upon play()', () => {
    const fsm = new TimelineEngine();
    fsm.setRoute(sampleWaypoints, sampleRoute);
    assert.strictEqual(fsm.state, 'PAUSED', 'Trạng thái khởi tạo sau khi nạp route phải là PAUSED');

    fsm.play();
    assert.strictEqual(fsm.state, 'PLAYING', 'Sau play() trạng thái phải chuyển sang PLAYING');
  });

  // TC-FSM-02: 1-Switch State Transition (PLAYING -> SCRUBBING -> PAUSED)
  test('TC-FSM-02: Handles user scrubbing transitions smoothly', () => {
    const fsm = new TimelineEngine();
    fsm.setRoute(sampleWaypoints, sampleRoute);
    fsm.play();

    fsm.startScrubbing();
    assert.strictEqual(fsm.state, 'SCRUBBING', 'Khi bắt đầu kéo timeline trạng thái phải là SCRUBBING');

    fsm.setProgress(1.5);
    assert.strictEqual(fsm.progress, 1.5);

    fsm.stopScrubbing();
    assert.strictEqual(fsm.state, 'PAUSED', 'Khi nhả kéo timeline trạng thái phải chuyển về PAUSED');
  });

  // TC-FSM-03: Boundary Clamping [0, N - 1]
  test('TC-FSM-03: Strictly clamps progress values to [0, N - 1]', () => {
    const fsm = new TimelineEngine();
    fsm.setRoute(sampleWaypoints, sampleRoute); // N = 3, max = 2.0

    // Thử vượt biên dưới
    fsm.setProgress(-10.5);
    assert.strictEqual(fsm.progress, 0, 'Tiến trình không được nhỏ hơn 0');

    // Thử vượt biên trên
    fsm.setProgress(99.9);
    assert.strictEqual(fsm.progress, 2.0, 'Tiến trình không được vượt quá N - 1 = 2');
  });

  // TC-FSM-04: Completion Event khi tiến độ chạm đích
  test('TC-FSM-04: Transitions to COMPLETED state when reaching destination', () => {
    const fsm = new TimelineEngine();
    fsm.setRoute(sampleWaypoints, sampleRoute);
    fsm.setProgress(1.99);
    fsm.play();

    // Mô phỏng 1 frame dt = 0.05
    fsm.update(0.05);

    assert.strictEqual(fsm.progress, 2.0, 'Tiến độ phải kẹp chính xác ở đích');
    assert.strictEqual(fsm.state, 'COMPLETED', 'Trạng thái phải là COMPLETED');
  });

  // TC-FSM-05: Chu trình đổi tốc độ phát (Speed Steps: 1 -> 2 -> 4 -> 0.4 -> 1)
  test('TC-FSM-05: Cycles through predefined speed steps [1, 2, 4, 0.4]', () => {
    const fsm = new TimelineEngine();
    assert.strictEqual(fsm.speed, 1);

    assert.strictEqual(fsm.cycleSpeed(), 2);
    assert.strictEqual(fsm.cycleSpeed(), 4);
    assert.strictEqual(fsm.cycleSpeed(), 0.4);
    assert.strictEqual(fsm.cycleSpeed(), 1);
  });

  // TC-FSM-06: Binary Search O(log M) tra cứu tọa độ nội suy chính xác
  test('TC-FSM-06: Binary search accurately resolves intermediate coordinates', () => {
    const fsm = new TimelineEngine();
    fsm.setRoute(sampleWaypoints, sampleRoute);

    // Tại progress = 0: phải trùng với điểm đầu
    const posStart = fsm.getPositionAtProgress(0);
    assert.ok(Math.abs(posStart.coord[0] - 105.85) < 0.001);
    assert.ok(Math.abs(posStart.coord[1] - 21.02) < 0.001);

    // Tại progress = 2: phải trùng với điểm cuối
    const posEnd = fsm.getPositionAtProgress(2);
    assert.ok(Math.abs(posEnd.coord[0] - 106.69) < 0.001);
    assert.ok(Math.abs(posEnd.coord[1] - 10.77) < 0.001);
  });
});
