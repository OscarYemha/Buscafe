import { GooglePlace } from '../types/googlePlaces';
import { CafeSummary } from '../types/CafeSummary';

export function mapGooglePlaceToCafeSummary(
    place: GooglePlace
): CafeSummary | null {
    if (!place.displayName?.text || 
        !place.formattedAddress ||
        !place.location
    )
    {
        return null;
    }

    return {
        googlePlaceId: place.id,
        name: place.displayName.text,
        address: place.formattedAddress,
        latitude: place.location.latitude,
        longitude: place.location.longitude,

        googleRating: place.rating?? null,
        googleReviewsCount: place.userRatingCount ?? 0,

        buscafeRating: null,
        buscafeReviewsCount: 0,

        distanceKm: null,
        priceLevel: null,
        isOpen: place.currentOpeningHours?.openNow ?? null,
    };
}