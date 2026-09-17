/**
 * @file engine.js (Test Harness for Standalone HTML)
 * @description Trích xuất các hàm giải thuật toán học lõi và FSM phục vụ bộ kiểm thử hình thức tự động,
 * tương ứng 100% với các hàm thực thi bên trong index.html và our-journey.html.
 */

const EARTH_RADIUS_KM = 6371.0088;

export function haversineKm(lat1, lon1, lat2, lon2) {
  if (lat1 === lat2 && lon1 === lon2) return 0;
  const toRad = d => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(Math.max(0, 1 - a)));
  return EARTH_RADIUS_KM * c;
}

export function interpolateRoute(coords, stepMeters = 20) {
  if (!Array.isArray(coords) || coords.length < 2) {
    return Array.isArray(coords) ? [...coords] : [];
  }
  const result = [coords[0]];
  for (let i = 0; i < coords.length - 1; i++) {
    const p1 = coords[i];
    const p2 = coords[i + 1];
    const distM = haversineKm(p1[1], p1[0], p2[1], p2[0]) * 1000;
    const steps = Math.max(1, Math.floor(distM / Math.max(1, stepMeters)));
    for (let s = 1; s <= steps; s++) {
      const t = s / steps;
      result.push([
        p1[0] + (p2[0] - p1[0]) * t,
        p1[1] + (p2[1] - p1[1]) * t
      ]);
    }
  }
  return result;
}

export function latLonToTile(lat, lon, zoom) {
  const clampedLat = Math.max(-85.05112878, Math.min(85.05112878, lat));
  const clampedLon = Math.max(-180, Math.min(180, lon));
  const n = 2 ** zoom;
  const x = Math.floor(((clampedLon + 180) / 360) * n);
  const latRad = (clampedLat * Math.PI) / 180;
  const y = Math.floor(
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n
  );
  const clampedX = Math.max(0, Math.min(n - 1, x));
  const clampedY = Math.max(0, Math.min(n - 1, y));
  return { x: clampedX, y: clampedY, z: zoom, key: `${zoom}/${clampedX}/${clampedY}` };
}

export function tileToLatLon(x, y, zoom) {
  const n = 2 ** zoom;
  const lon = (x / n) * 360 - 180;
  const latRad = Math.atan(Math.sinh(Math.PI * (1 - (2 * y) / n)));
  const lat = (latRad * 180) / Math.PI;
  return { lon, lat };
}

export function computeBoundingBox(coords) {
  if (!Array.isArray(coords) || coords.length === 0) return [0, 0, 0, 0];
  let minLon = Infinity, minLat = Infinity, maxLon = -Infinity, maxLat = -Infinity;
  for (let i = 0; i < coords.length; i++) {
    const [lon, lat] = coords[i];
    if (lon < minLon) minLon = lon;
    if (lon > maxLon) maxLon = lon;
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
  }
  return [minLon, minLat, maxLon, maxLat];
}

export function computeTilesForBBox(bbox, zoom) {
  const [minLon, minLat, maxLon, maxLat] = bbox;
  const nw = latLonToTile(maxLat, minLon, zoom);
  const se = latLonToTile(minLat, maxLon, zoom);
  const tiles = [];
  const minX = Math.min(nw.x, se.x), maxX = Math.max(nw.x, se.x);
  const minY = Math.min(nw.y, se.y), maxY = Math.max(nw.y, se.y);
  for (let x = minX; x <= maxX; x++) {
    for (let y = minY; y <= maxY; y++) {
      tiles.push({ x, y, z: zoom, key: `${zoom}/${x}/${y}` });
    }
  }
  return tiles;
}

export function computeTilesForRoute(coords, zoom, bufferTiles = 1) {
  if (!Array.isArray(coords) || coords.length === 0) return [];
  const tileMap = new Map();
  const maxTile = (2 ** zoom) - 1;
  for (let i = 0; i < coords.length; i++) {
    const [lon, lat] = coords[i];
    const center = latLonToTile(lat, lon, zoom);
    for (let dx = -bufferTiles; dx <= bufferTiles; dx++) {
      for (let dy = -bufferTiles; dy <= bufferTiles; dy++) {
        const tx = center.x + dx, ty = center.y + dy;
        if (tx >= 0 && tx <= maxTile && ty >= 0 && ty <= maxTile) {
          const key = `${zoom}/${tx}/${ty}`;
          if (!tileMap.has(key)) {
            tileMap.set(key, { x: tx, y: ty, z: zoom, key });
          }
        }
      }
    }
  }
  return Array.from(tileMap.values());
}

export function getLookAheadCoord(routeCoords, currentCoord, segIdx, leadMeters = 75) {
  if (!routeCoords || routeCoords.length === 0) return currentCoord;
  let accumulated = 0;
  let leadPos = currentCoord;
  for (let j = segIdx; j < routeCoords.length - 1; j++) {
    const pA = routeCoords[j], pB = routeCoords[j + 1];
    const d = haversineKm(pA[1], pA[0], pB[1], pB[0]) * 1000;
    if (accumulated + d >= leadMeters) {
      const rem = leadMeters - accumulated;
      const frac = d > 0 ? rem / d : 0;
      leadPos = [
        pA[0] + (pB[0] - pA[0]) * frac,
        pA[1] + (pB[1] - pA[1]) * frac
      ];
      break;
    }
    accumulated += d;
    leadPos = pB;
  }
  return leadPos;
}

export function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function isValidLatLng(lat, lon) {
  return typeof lat === 'number' && typeof lon === 'number' &&
         isFinite(lat) && isFinite(lon) &&
         lat >= -90 && lat <= 90 &&
         lon >= -180 && lon <= 180;
}

export function validateWaypoints(points) {
  if (!Array.isArray(points)) {
    throw new Error('Dữ liệu điểm dừng phải là một mảng.');
  }
  if (points.length < 2) {
    throw new Error('Lộ trình yêu cầu tối thiểu 2 điểm dừng hợp lệ để trực quan hóa.');
  }
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    if (!p || !isValidLatLng(p.lat, p.lon)) {
      throw new Error(`Điểm dừng thứ ${i + 1} có tọa độ không hợp lệ.`);
    }
  }
  return true;
}

export function parseKmlHeadless(text) {
  if (typeof text !== 'string' || !text.trim()) {
    throw new Error('Nội dung file KML rỗng.');
  }
  if (!text.includes('</kml>') && !text.includes('</Placemark>') && !text.includes('</LineString>')) {
    throw new Error('File KML bị lỗi định dạng XML (thiếu thẻ đóng).');
  }
  const placemarkRegex = /<Placemark[\s\S]*?<\/Placemark>/gi;
  const matches = text.match(placemarkRegex);
  const out = [];

  if (matches) {
    matches.forEach((pm, idx) => {
      const nameMatch = pm.match(/<name>(.*?)<\/name>/i);
      const rawName = nameMatch ? nameMatch[1].trim() : `Điểm ${idx + 1}`;
      const name = escapeHtml(rawName);

      const pointMatch = pm.match(/<Point[\s\S]*?<coordinates>([\s\S]*?)<\/coordinates>[\s\S]*?<\/Point>/i);
      if (pointMatch) {
        const nums = pointMatch[1].match(/[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?/g);
        if (nums && nums.length >= 2) {
          const lon = parseFloat(nums[0]);
          const lat = parseFloat(nums[1]);
          if (isValidLatLng(lat, lon)) {
            out.push({ name, lon, lat, colorHex: null });
          }
        }
      }
    });
  }

  if (out.length === 0) {
    const lsMatch = text.match(/<LineString[\s\S]*?<coordinates>([\s\S]*?)<\/coordinates>[\s\S]*?<\/LineString>/i);
    if (lsMatch) {
      const tuples = lsMatch[1].trim().split(/\s+/);
      tuples.forEach((tStr, tIdx) => {
        const parts = tStr.split(',');
        if (parts.length >= 2) {
          const lon = parseFloat(parts[0]);
          const lat = parseFloat(parts[1]);
          if (isValidLatLng(lat, lon)) {
            out.push({
              name: tIdx === 0 ? 'Khởi hành' : tIdx === tuples.length - 1 ? 'Đích đến' : `Mốc ${tIdx + 1}`,
              lon,
              lat,
              colorHex: null
            });
          }
        }
      });
      if (out.length > 80) {
        const step = Math.ceil(out.length / 50);
        const sampled = [out[0]];
        for (let s = step; s < out.length - 1; s += step) sampled.push(out[s]);
        sampled.push(out[out.length - 1]);
        return sampled;
      }
      return out;
    }
  }

  if (out.length === 0) {
    throw new Error('Không tìm thấy tọa độ địa điểm nào trong file KML.');
  }
  return out;
}

export class RouteService {
  constructor() {
    this.cache = new Map();
  }
  computeDirectRoute(coords) {
    const directInterp = interpolateRoute(coords, 20);
    let totalDistKm = 0;
    for (let i = 1; i < coords.length; i++) {
      totalDistKm += haversineKm(coords[i - 1][1], coords[i - 1][0], coords[i][1], coords[i][0]);
    }
    return { coordinates: directInterp, distanceKm: totalDistKm, mode: 'direct' };
  }
  async fetchRealisticRoute(coordinates) {
    if (!coordinates || coordinates.length < 2) return this.computeDirectRoute(coordinates);
    const key = `nav:${coordinates.length}:${coordinates[0]}`;
    if (this.cache.has(key)) return this.cache.get(key);

    const maxChunk = 24;
    const chunks = [];
    for (let i = 0; i < coordinates.length - 1; i += maxChunk - 1) {
      chunks.push(coordinates.slice(i, i + maxChunk));
    }
    const chunkResults = await Promise.all(chunks.map(chunk => this.fetchChunk(chunk)));
    let fullCoords = [];
    let totalMeters = 0;
    for (const res of chunkResults) {
      totalMeters += res.distance;
      if (fullCoords.length > 0) fullCoords.push(...res.coordinates.slice(1));
      else fullCoords.push(...res.coordinates);
    }
    const result = { coordinates: interpolateRoute(fullCoords, 18), distanceKm: totalMeters / 1000, mode: 'nav' };
    this.cache.set(key, result);
    return result;
  }
  async fetchChunk(chunk) {
    let segDist = 0;
    for (let k = 1; k < chunk.length; k++) {
      segDist += haversineKm(chunk[k - 1][1], chunk[k - 1][0], chunk[k][1], chunk[k][0]) * 1000;
    }
    return { coordinates: chunk, distance: segDist };
  }
}

export class TilePreloader {
  constructor(options = {}) {
    this.maxConcurrency = options.maxConcurrency || 6;
    this.layerType = options.layerType || 'carto';
    this.mapboxToken = options.mapboxToken || '';
    this.fetcher = options.fetcher || null;
    this.cachedTileKeys = new Set();
    this.inFlightKeys = new Set();
    this.queue = [];
    this.activeWorkers = 0;
    this.totalTilesInJob = 0;
    this.loadedTilesInJob = 0;
    this.failedTilesInJob = 0;
    this.onProgressCallback = null;
  }
  onProgress(cb) { this.onProgressCallback = cb; }
  setLayer(layer, token = '') {
    this.layerType = layer;
    this.mapboxToken = token;
    this.cachedTileKeys.clear();
    this.inFlightKeys.clear();
    this.queue = [];
  }
  getTileUrl(x, y, z) {
    if (this.layerType === 'mapbox' && this.mapboxToken) {
      return `https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/${z}/${x}/${y}?access_token=${this.mapboxToken}`;
    }
    if (this.layerType === 'google') {
      return `https://mt1.google.com/vt/lyrs=m&hl=vi&x=${x}&y=${y}&z=${z}`;
    }
    return `https://a.basemaps.cartocdn.com/rastertiles/voyager/${z}/${x}/${y}@2x.png`;
  }
  async preloadRoute(routeCoords, targetZooms = [14]) {
    const tileMap = new Map();
    targetZooms.forEach(z => {
      computeTilesForRoute(routeCoords, z, 1).forEach((t, idx) => {
        if (!tileMap.has(t.key)) tileMap.set(t.key, { ...t, priority: idx < 10 ? 100 : 20 });
      });
    });
    const pending = Array.from(tileMap.values()).filter(t => !this.cachedTileKeys.has(t.key));
    this.totalTilesInJob = pending.length;
    this.loadedTilesInJob = 0;
    this.queue = pending.sort((a, b) => b.priority - a.priority);
    this.emitProgress();

    return new Promise(resolve => {
      if (this.queue.length === 0) { resolve(this.getStatus()); return; }
      const checkFinish = () => {
        if (this.queue.length === 0 && this.activeWorkers === 0) resolve(this.getStatus());
      };
      const spawn = () => {
        while (this.activeWorkers < this.maxConcurrency && this.queue.length > 0) {
          const item = this.queue.shift();
          if (this.cachedTileKeys.has(item.key)) continue;
          this.inFlightKeys.add(item.key);
          this.activeWorkers++;
          this.fetchTile(item)
            .then(() => { this.cachedTileKeys.add(item.key); this.loadedTilesInJob++; })
            .catch(() => { this.failedTilesInJob++; })
            .finally(() => {
              this.inFlightKeys.delete(item.key);
              this.activeWorkers--;
              this.emitProgress();
              spawn();
              checkFinish();
            });
        }
        checkFinish();
      };
      spawn();
    });
  }
  prefetchAhead(currentCoord, headingDeg, distanceMeters = 1000, zoom = 14) {
    if (!currentCoord) return;
    const [lon, lat] = currentCoord;
    const rad = (headingDeg * Math.PI) / 180;
    const dKm = distanceMeters / 1000;
    const R = 6371.0088;
    const lat1 = (lat * Math.PI) / 180, lon1 = (lon * Math.PI) / 180;
    const lat2 = Math.asin(Math.sin(lat1) * Math.cos(dKm / R) + Math.cos(lat1) * Math.sin(dKm / R) * Math.cos(rad));
    const lon2 = lon1 + Math.atan2(Math.sin(rad) * Math.sin(dKm / R) * Math.cos(lat1), Math.cos(dKm / R) - Math.sin(lat1) * Math.sin(lat2));
    const ahead = [(lon2 * 180) / Math.PI, (lat2 * 180) / Math.PI];
    computeTilesForRoute([currentCoord, ahead], zoom, 1).forEach(t => {
      if (!this.cachedTileKeys.has(t.key)) this.queue.unshift({ ...t, priority: 150 });
    });
  }
  async fetchTile(tile) {
    if (this.fetcher) {
      await this.fetcher(this.getTileUrl(tile.x, tile.y, tile.z));
    }
  }
  isTileCached(key) { return this.cachedTileKeys.has(key); }
  getLoadedCount() { return this.cachedTileKeys.size; }
  getStatus() {
    const total = this.totalTilesInJob, loaded = this.loadedTilesInJob;
    const percent = total > 0 ? Math.min(100, Math.round((loaded / total) * 100)) : 100;
    return { total, loaded, percent, ready: total === 0 || percent >= 95 };
  }
  emitProgress() {
    if (this.onProgressCallback) this.onProgressCallback(this.getStatus());
  }
}

export const SPEED_STEPS = [1, 2, 4, 0.4];

export class TimelineEngine {
  constructor() {
    this.state = 'IDLE';
    this.progress = 0;
    this.speedIdx = 0;
    this.speed = SPEED_STEPS[this.speedIdx];
    this.waypoints = [];
    this.routeCoords = [];
    this.routeCumDists = [];
    this.waypointDists = [];
    this.totalKm = 0;
  }
  setRoute(waypoints, routeData) {
    this.waypoints = waypoints;
    this.routeCoords = routeData.coordinates || [];
    this.totalKm = routeData.distanceKm || 0;
    this.routeCumDists = [0];
    for (let i = 1; i < this.routeCoords.length; i++) {
      const d = haversineKm(this.routeCoords[i - 1][1], this.routeCoords[i - 1][0], this.routeCoords[i][1], this.routeCoords[i][0]);
      this.routeCumDists.push(this.routeCumDists[i - 1] + d);
    }
    this.waypointDists = this.waypoints.map(p => {
      let closestIdx = 0, minDist = Infinity;
      for (let i = 0; i < this.routeCoords.length; i++) {
        const d = haversineKm(p.lat, p.lon, this.routeCoords[i][1], this.routeCoords[i][0]);
        if (d < minDist) { minDist = d; closestIdx = i; }
      }
      return this.routeCumDists[closestIdx] || 0;
    });
    this.progress = 0;
    this.setState('PAUSED');
  }
  setState(st) { this.state = st; }
  play() {
    if (this.waypoints.length <= 1) return;
    if (this.progress >= this.waypoints.length - 1) this.progress = 0;
    this.setState('PLAYING');
  }
  pause() { this.setState('PAUSED'); }
  startScrubbing() { this.setState('SCRUBBING'); }
  stopScrubbing() { this.setState('PAUSED'); }
  cycleSpeed() {
    this.speedIdx = (this.speedIdx + 1) % SPEED_STEPS.length;
    this.speed = SPEED_STEPS[this.speedIdx];
    return this.speed;
  }
  setProgress(val) {
    const N = this.waypoints.length;
    if (N === 0) return;
    this.progress = Math.max(0, Math.min(N - 1, val));
  }
  getPositionAtProgress(prog) {
    const N = this.waypoints.length;
    if (!this.routeCoords.length || N === 0) return { coord: [0, 0], routeCoordIdx: 0, distanceKm: 0 };
    const idxFloor = Math.floor(prog);
    const idxCeil = Math.min(N - 1, idxFloor + 1);
    const frac = prog - idxFloor;
    const d1 = this.waypointDists[idxFloor] || 0;
    const d2 = this.waypointDists[idxCeil] || this.totalKm;
    const targetDist = d1 + (d2 - d1) * frac;
    let low = 0, high = this.routeCumDists.length - 1;
    while (low <= high) {
      const mid = (low + high) >> 1;
      if (this.routeCumDists[mid] < targetDist) low = mid + 1;
      else high = mid - 1;
    }
    const segIdx = Math.max(0, Math.min(this.routeCoords.length - 2, low - 1));
    const segD1 = this.routeCumDists[segIdx];
    const segD2 = this.routeCumDists[segIdx + 1];
    const segSpan = segD2 - segD1;
    const segFrac = segSpan > 0 ? (targetDist - segD1) / segSpan : 0;
    const pA = this.routeCoords[segIdx], pB = this.routeCoords[segIdx + 1] || pA;
    return {
      coord: [pA[0] + (pB[0] - pA[0]) * segFrac, pA[1] + (pB[1] - pA[1]) * segFrac],
      routeCoordIdx: segIdx,
      distanceKm: targetDist
    };
  }
  update(dt) {
    if (this.state !== 'PLAYING') return;
    const N = this.waypoints.length;
    if (N <= 1) return;
    const nextProg = this.progress + dt * this.speed * 0.38;
    if (nextProg >= N - 1) {
      this.setProgress(N - 1);
      this.setState('COMPLETED');
    } else {
      this.setProgress(nextProg);
    }
  }
}
