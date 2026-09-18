export function formatDistance(
    distanceKm: number | null
): string {
    if (distanceKm === null)
    {
        return 'Distancia no disponible';
    }

    if (distanceKm < 1)
    {
        const distanceMeters = 
            Math.round(distanceKm * 1000);

        return `${distanceMeters} m`;
    }

    return `${distanceKm.toFixed(1)} km`;
}