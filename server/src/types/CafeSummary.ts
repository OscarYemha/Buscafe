export type CafeSummary = {
    googlePlaceId: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;

    googleRating: number | null;
    googleReviewsCount: number;

    buscafeRating: number | null;
    buscafeReviewsCount: number;

    distanceKm: number | null;
    priceLevel: number | null;
    isOpen: boolean | null;
};