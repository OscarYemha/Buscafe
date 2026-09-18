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
};

export type GoogleNearbySearchResponse = {
    places?: GooglePlace[];
};