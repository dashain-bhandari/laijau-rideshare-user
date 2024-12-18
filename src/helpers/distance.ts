
//haversine distance

export const calculateDistance = ({ lat1, lat2, long1, long2 }: { lat1: number, long1: number, lat2: number, long2: number }) => {
    if (lat1 && lat2 && long1 && long1) {
        const R = 6371e3; // metres
        const φ1 = lat1 * Math.PI / 180; // φ, λ in radians
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (long2 - long1) * Math.PI / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const d = R * c; // in metres
        return Number((d / 1000).toFixed(2));
    }
    else {
        return 0;
    }
}

export const checkValidDestination = (distance: number) => {
    //for now only minimum range
    if (distance < 0.9) {
        return false
    }
    else {
        return true
    }
}