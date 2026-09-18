export type GooglePlace = {
    id: string;

    displayName?: {
        text: string;
        languageCode?: string;
    };

    formattedAddress?: string;

    location?: {
        latitude: number;
        longitude: number;
    };

    primaryType?: string;

    rating?: number;
    userRatingCount?: number;
    priceLevel?: string;

    currentOpeningHours?: {
        openNow?: boolean;
    }
};

export type GoogleNearbySearchResponse = {
    places?: GooglePlace[];
};