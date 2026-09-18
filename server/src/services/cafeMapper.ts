import { GooglePlace } from '../types/googlePlaces';
import { CafeSummary } from '../types/CafeSummary';

function mapGooglePriceLevel(
    priceLevel?: string
): number | null {
    switch (priceLevel)
    {
        case 'PRICE_LEVEL_INEXPENSIVE':
            return 1;

        case 'PRICE_LEVEL_MODERATE':
            return 2;

        case 'PRICE_LEVEL_EXPENSIVE':
            return 3;

        case 'PRICE_LEVEL_VERY_EXPENSIVE':
            return 4;

        default:
            return null;
    }
}

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
        priceLevel: mapGooglePriceLevel(place.priceLevel),
        isOpen: place.currentOpeningHours?.openNow ?? null,
    };
}