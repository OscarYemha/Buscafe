import 'dotenv/config';
import { GoogleNearbySearchResponse } from '../types/googlePlaces.js';

const GOOGLE_PLACES_URL = 'https://places.googleapis.com/v1/places:searchNearby';

export async function searchNearbyCafes(latitude: number, longitude: number): Promise<GoogleNearbySearchResponse>
{
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;

    if (!apiKey)
    {
        throw new Error('GOOGLE_PLACES_API_KEY no está definida');
    }

    const response = await fetch(GOOGLE_PLACES_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': apiKey,
            'X-Goog-FieldMask': [
                'places.id',
                'places.displayName',
                'places.formattedAddress',
                'places.location',
                'places.primaryType',
                'places.rating',
                'places.userRatingCount',
                'places.priceLevel',
                'places.currentOpeningHours.openNow',
            ].join(','),
        },
        body: JSON.stringify({
            includedTypes: ['cafe'],
            maxResultCount: 5,
            locationRestriction: {
                circle: {
                    center: {
                        latitude,
                        longitude,
                    },
                    radius: 1000,
                },
            },
        }),
    });

    if (!response.ok)
    {
        const errorBody = await response.text();

        throw new Error(`Error de Google Places: ${response.status} ${errorBody}`);
    }
    
    const data =
        await response.json() as GoogleNearbySearchResponse;

    return data;
}