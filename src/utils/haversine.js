/**
 * Haversine Formula — calculates the great-circle distance between two GPS points.
 * Returns distance in kilometres.
 *
 * @param {number} lat1  Starting latitude  (degrees)
 * @param {number} lng1  Starting longitude (degrees)
 * @param {number} lat2  Ending   latitude  (degrees)
 * @param {number} lng2  Ending   longitude (degrees)
 * @returns {number}  Distance in kilometres
 */
export function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // km
}

function toRad(deg) {
  return deg * (Math.PI / 180);
}

/**
 * Accumulates total distance from an ordered array of GPS history points.
 * @param {Array<{lat: number, lng: number}>} history
 * @returns {number} Total distance in kilometres
 */
export function totalDistanceFromHistory(history) {
  if (!history || history.length < 2) return 0;
  let total = 0;
  for (let i = 1; i < history.length; i++) {
    total += haversineKm(
      history[i - 1].lat,
      history[i - 1].lng,
      history[i].lat,
      history[i].lng
    );
  }
  return total;
}
