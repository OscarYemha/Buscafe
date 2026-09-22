import 'dotenv/config';
import {
    GooglePlace,
    GoogleTextSearchResponse,
} from '../types/googlePlaces.js';
import {
    calculateDistanceKm,
} from '../utils/distance.js';


const GOOGLE_TEXT_SEARCH_URL = 'https://places.googleapis.com/v1/places:searchText';
const GOOGLE_PLACE_DETAILS_URL = 'https://places.googleapis.com/v1/places';

const SEARCH_RADIUS_KM = 1;
const METERS_PER_KM = 1000;
const PAGE_SIZE = 20;
const MAX_PAGES = 3;

const CAFE_TYPES = new Set([
    'coffee_shop',
    'cafe',
    'cafeteria',
]);

function isCafe(place: GooglePlace): boolean {
    return place.types?.some(
        (type) => CAFE_TYPES.has(type)
    ) ?? false;
}

async function searchCafesByText(
    latitude: number,
    longitude: number,
    pageToken?: string
): Promise<GoogleTextSearchResponse> {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;

    if (!apiKey) {
        throw new Error(
            'GOOGLE_PLACES_API_KEY no está definida'
        );
    }

    const response = await fetch(
        GOOGLE_TEXT_SEARCH_URL,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': apiKey,
                'X-Goog-FieldMask': [
                    'places.id',
                    'places.displayName',
                    'places.formattedAddress',
                    'places.location',
                    'places.types',
                    'places.primaryType',
                    'places.primaryTypeDisplayName',
                    'places.googleMapsTypeLabel',
                    'places.rating',
                    'places.userRatingCount',
                    'places.priceLevel',
                    'places.allowsDogs',
                    'places.currentOpeningHours.openNow',
                    'nextPageToken',
                ].join(','),
            },
            body: JSON.stringify({
                textQuery: 'cafeterías',
                pageSize: PAGE_SIZE,
                rankPreference: 'DISTANCE',
                locationBias: {
                    circle: {
                        center: {
                            latitude,
                            longitude,
                        },
                        radius:
                            SEARCH_RADIUS_KM *
                            METERS_PER_KM,
                    },
                },
                languageCode: 'es',
                regionCode: 'AR',
                ...(pageToken && {
                    pageToken,
                }),
            }),
        }
    );

    if (!response.ok) {
        const errorBody =
            await response.text();

        throw new Error(
            `Error de Google Text Search: ` +
            `${response.status} ${errorBody}`
        );
    }

    const data: GoogleTextSearchResponse =
        await response.json();

    return data;
}

export async function searchAllCafesByText(
    latitude: number,
    longitude: number
): Promise<GooglePlace[]> {
    const places: GooglePlace[] = [];

    let pageToken: string | undefined;
    let pageCount = 0;

    do {
        pageCount++;
        const response =
            await searchCafesByText(
                latitude,
                longitude,
                pageToken
            );

        places.push(
            ...(response.places ?? [])
        );

        pageToken =
            response.nextPageToken;
    }
    while (
        pageToken &&
        pageCount < MAX_PAGES
    );

    const uniquePlaces =
        Array.from(
            new Map(
                places.map((place) => [
                    place.id,
                    place,
                ])
            ).values()
        );

    const nearbyPlaces =
        uniquePlaces.filter((place) => {
            if (
                !place.location ||
                !isCafe(place)
            ) {
                return false;
            }

            const distanceKm =
                calculateDistanceKm(
                    latitude,
                    longitude,
                    place.location.latitude,
                    place.location.longitude
                );

            return distanceKm <= SEARCH_RADIUS_KM;
        });

    return nearbyPlaces;
}

export async function getPlaceDetails(
    googlePlaceId: string
): Promise<GooglePlace> {
    const apiKey =
        process.env.GOOGLE_PLACES_API_KEY;

    if (!apiKey) {
        throw new Error(
            'GOOGLE_PLACES_API_KEY no está definida'
        );
    }

    const response = await fetch(
        `${GOOGLE_PLACE_DETAILS_URL}/${encodeURIComponent(googlePlaceId)}` +
        `?languageCode=es&regionCode=AR`,
        {
            method: 'GET',
            headers: {
                'X-Goog-Api-Key': apiKey,
                'X-Goog-FieldMask': [
                    'id',
                    'displayName',
                    'formattedAddress',
                    'location',
                    'types',
                    'primaryType',
                    'primaryTypeDisplayName',
                    'googleMapsTypeLabel',
                    'rating',
                    'userRatingCount',
                    'priceLevel',
                    'allowsDogs',
                    'currentOpeningHours',
                    'regularOpeningHours',
                    'websiteUri',
                    'nationalPhoneNumber',
                    'googleMapsUri',
                ].join(','),
            },
        }
    );

    if (!response.ok) {
        const errorBody =
            await response.text();

        throw new Error(
            `Error de Google Place Details: ` +
            `${response.status} ${errorBody}`
        );
    }

    const place: GooglePlace =
        await response.json();

    return place;
}
