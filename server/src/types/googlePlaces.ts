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

    types?: string[];

    primaryType?: string;

    primaryTypeDisplayName?: {
        text: string;
        languageCode?: string;
    };

    googleMapsTypeLabel?: {
        text: string;
        languageCode?: string;
    };

    rating?: number;
    userRatingCount?: number;
    priceLevel?: string;

    currentOpeningHours?: {
        openNow?: boolean;
    }
};

export type GoogleTextSearchResponse = {
    places?: GooglePlace[];
    nextPageToken?: string;
};
