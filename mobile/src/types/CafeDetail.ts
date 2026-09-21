import { CafeSummary } from './CafeSummary';

export type CafeReview = {
    id: number;
    rating: number;
    comment: string;
    createdAt: string;

    coffeeRating: number | null;
    foodRating: number | null;
    serviceRating: number | null;
    comfortRating: number | null;
    quietRating: number | null;

    goodForWork: boolean | null;
    goodForStudy: boolean | null;
    goodForDate: boolean | null;

    user: {
        id: number;
        name: string;
    };
};

export type CafeDetail = CafeSummary & {
    buscafeReviews: CafeReview[];

    currentOpeningHours: string[];
    regularOpeningHours: string[];

    website: string | null;
    phone: string | null;
    googleMapsUrl: string | null;
};