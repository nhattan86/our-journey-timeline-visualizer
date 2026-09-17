/**
 * @file kml-parser.test.js
 * @description Bộ kiểm thử hình thức cho mô đun KML/KMZ Parser.
 * Kiểm tra các phân vùng Equivalence Partitioning, Boundary Values, và Falsification Tests.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { parseKmlHeadless, validateWaypoints } from './engine.js';

describe('Formal Test Suite: KML Parser & Schema Validation', () => {

  // TC-KML-01: EP - Phân tích cú pháp KML chuẩn chứa Placemark & Point
  test('TC-KML-01: Parses valid KML Placemarks with Points', () => {
    const validKml = `<?xml version="1.0" encoding="UTF-8"?>
    <kml xmlns="http://www.opengis.net/kml/2.2">
      <Document>
        <Placemark>
          <name>Hồ Gươm</name>
          <Point><coordinates>105.8525,21.0287,0</coordinates></Point>
        </Placemark>
        <Placemark>
          <name>Cầu Rồng</name>
          <Point><coordinates>108.2272,16.0611,0</coordinates></Point>
        </Placemark>
      </Document>
    </kml>`;

    const pts = parseKmlHeadless(validKml);
    assert.strictEqual(pts.length, 2, 'Phải trích xuất đủ 2 điểm mốc');
    assert.strictEqual(pts[0].name, 'Hồ Gươm');
    assert.strictEqual(pts[0].lon, 105.8525);
    assert.strictEqual(pts[0].lat, 21.0287);
    assert.strictEqual(pts[1].name, 'Cầu Rồng');
  });

  // TC-KML-02: EP - Tự động trích xuất từ LineString khi không có thẻ Point độc lập
  test('TC-KML-02: Fallbacks to LineString track log coordinates', () => {
    const lineStringKml = `<?xml version="1.0" encoding="UTF-8"?>
    <kml xmlns="http://www.opengis.net/kml/2.2">
      <Document>
        <Placemark>
          <name>Chuyến phượt xuyên Việt</name>
          <LineString>
            <coordinates>
              105.85,21.02,0 106.69,10.77,0 104.72,8.60,0
            </coordinates>
          </LineString>
        </Placemark>
      </Document>
    </kml>`;

    const pts = parseKmlHeadless(lineStringKml);
    assert.strictEqual(pts.length, 3, 'Phải trích xuất 3 đỉnh từ thẻ LineString');
    assert.strictEqual(pts[0].name, 'Khởi hành');
    assert.strictEqual(pts[2].name, 'Đích đến');
  });

  // TC-KML-03: Negative Test - File XML dị dạng (Malformed XML)
  test('TC-KML-03: Throws descriptive error on malformed KML without closing tags', () => {
    const badKml = `<kml><Document><Placemark><name>Hỏng`;
    assert.throws(
      () => parseKmlHeadless(badKml),
      /lỗi định dạng XML/i,
      'Phải ném lỗi kiểm soát khi gặp cú pháp XML sai'
    );
  });

  // TC-KML-04: Security Test - Phòng chống tấn công mã độc XSS trong thẻ name
  test('TC-KML-04: Neutralizes XSS payload in waypoint name', () => {
    const xssKml = `<?xml version="1.0" encoding="UTF-8"?>
    <kml xmlns="http://www.opengis.net/kml/2.2">
      <Document>
        <Placemark>
          <name><script>alert('pwned')</script>Trạm 1</name>
          <Point><coordinates>105.8,21.0,0</coordinates></Point>
        </Placemark>
        <Placemark>
          <name><img src=x onerror=alert(1)>Trạm 2</name>
          <Point><coordinates>106.8,10.7,0</coordinates></Point>
        </Placemark>
      </Document>
    </kml>`;

    const pts = parseKmlHeadless(xssKml);
    assert.strictEqual(pts.length, 2);
    // Chuỗi độc hại phải được mã hóa thực thể HTML, không chứa thẻ thô
    assert.strictEqual(pts[0].name.includes('<script>'), false);
    assert.strictEqual(pts[0].name.includes('&lt;script&gt;'), true);
    assert.strictEqual(pts[1].name.includes('<img'), false);
  });

  // TC-KML-05: BVA 3-giá trị cho số lượng điểm dừng (N=0, N=1, N=2)
  test('TC-KML-05: Boundary validation rejects routes with fewer than 2 waypoints', () => {
    // Biên N=0
    assert.throws(
      () => validateWaypoints([]),
      /tối thiểu 2 điểm dừng/i,
      'Mảng rỗng phải bị từ chối'
    );

    // Biên N=1
    const singlePoint = [{ name: 'Một điểm', lon: 105.8, lat: 21.0 }];
    assert.throws(
      () => validateWaypoints(singlePoint),
      /tối thiểu 2 điểm dừng/i,
      'Chỉ có 1 điểm dừng phải bị từ chối'
    );

    // Biên N=2 (Hợp lệ tối thiểu)
    const twoPoints = [
      { name: 'Điểm 1', lon: 105.8, lat: 21.0 },
      { name: 'Điểm 2', lon: 106.8, lat: 10.7 }
    ];
    assert.strictEqual(validateWaypoints(twoPoints), true, '2 điểm hợp lệ phải vượt qua');
  });

  // TC-KML-06: File rỗng hoặc chỉ có khoảng trắng
  test('TC-KML-06: Rejects empty or whitespace-only content', () => {
    assert.throws(() => parseKmlHeadless('   '), /nội dung file kml rỗng/i);
  });
});
