// Calculation table as defined by user:
// Até 2 km = 5 min = 50 MT
// 3 km = 7 min = 60 MT
// 5 km = 10 min = 80 MT
// 8 km = 15 min = 110 MT
// 10 km = 20 min = 130 MT
// 15 km = 30 min = 180 MT
// 20 km = 40 min = 230 MT

export interface RoutePriceInfo {
  distanceKm: number;
  estimatedMinutes: number;
  priceMT: number;
}

// Calculate Haversine Distance in km between two GPS coordinates
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10; // 1 decimal place
}

// Interpolate or match fare and time based on exact user pricing rules
export function calculateRoutePrice(distanceKm: number): RoutePriceInfo {
  const roundedDist = Math.max(0.5, distanceKm);

  let estimatedMinutes = 5;
  let priceMT = 50;

  if (roundedDist <= 2) {
    estimatedMinutes = 5;
    priceMT = 50;
  } else if (roundedDist <= 3) {
    estimatedMinutes = 7;
    priceMT = 60;
  } else if (roundedDist <= 5) {
    estimatedMinutes = 10;
    priceMT = 80;
  } else if (roundedDist <= 8) {
    estimatedMinutes = 15;
    priceMT = 110;
  } else if (roundedDist <= 10) {
    estimatedMinutes = 20;
    priceMT = 130;
  } else if (roundedDist <= 15) {
    estimatedMinutes = 30;
    priceMT = 180;
  } else {
    // 20 km+
    estimatedMinutes = 40;
    priceMT = 230;
  }

  return {
    distanceKm: roundedDist,
    estimatedMinutes,
    priceMT
  };
}
