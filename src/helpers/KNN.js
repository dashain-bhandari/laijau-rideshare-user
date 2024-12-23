// Haversine formula to calculate distance between two coordinates
function haversineDistance(coord1, coord2) {
  console.log("coord1",coord1)
  console.log("coord2",coord2)
  const toRad = (value) => (value * Math.PI) / 180;

  const R = 6371; // Radius of Earth in kilometers
  const lat1 = coord1.lat1;
  const lon1 = coord1.lon1;
  const lat2 = coord2.lat2;
  const lon2 = coord2.lon2;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
}

// KNN Algorithm to find the k-nearest drivers with preference points
export function KNN(drivers, riderLocation, k, preferenceWeight = 1) {
  /*
    riderLocation: { lat: number, lon: number }
    drivers: [ { id: number, lat: number, lon: number, preferencePoints: number } ]
    k: number (number of nearest drivers to find)
    preferenceWeight: number (importance of preference points)
  */
  drivers = drivers?.filter((i) => {
    console.log("driver",i)
    console.log("rider location", riderLocation);
    return i?.vehicleType == riderLocation?.vehicleType
  })

  console.log("filtered", drivers)

  const distances = drivers?.map((driver) => {
    const distance = haversineDistance({lat1:riderLocation?.location?.lat1,lon1:riderLocation?.location?.lon1}, {
      lat2: driver?.lat2,
      lon2: driver?.lon2,
    });
    console.log("distance",distance)

    const preferenceMatch = driver?.vehicleType === riderLocation.preference ? 0 : 1;

    // Calculate combined score
    const combinedScore = (
      (1 - preferenceWeight) * (distance / 100) + // Normalize distance
      preferenceWeight * preferenceMatch
    );

    return {
     
      combinedScore,
     id:driver.id
    };
  });

  // Sort drivers by weighted score (ascending order)
  distances.sort((a, b) => a.combinedScore - b.combinedScore);

  const topDriverIds = distances
  .slice(0, k) // Get the top k nearest drivers
  .map(driver => driver.id); // Extract only the IDs

return topDriverIds;
}

// Example usage:
const riderLocation = { lat: 27.7172, lon: 85.3240 }; // Rider's location (Kathmandu)

const drivers = [
  { id: 1, lat: 27.7185, lon: 85.3205, preferencePoints: 4.5 }, // Driver 1
  { id: 2, lat: 27.7190, lon: 85.3255, preferencePoints: 3.8 }, // Driver 2
  { id: 3, lat: 27.7150, lon: 85.3220, preferencePoints: 5.0 }, // Driver 3
  { id: 4, lat: 27.7210, lon: 85.3280, preferencePoints: 4.0 }, // Driver 4
];

