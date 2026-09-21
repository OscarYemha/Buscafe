import { createContext, ReactNode, useContext, useState } from "react";

type ReviewDraft = {
    cafeId: string | null;
    rating: number;
    comment: string;

    coffeeRating: number | null;
    foodRating: number | null;
    serviceRating: number | null;
    comfortRating: number | null;
    quietRating: number | null;

    goodForWork: boolean | null;
    goodForStudy: boolean | null;
    goodForDate: boolean | null;
};

type ReviewDraftContextType = {
    draft: ReviewDraft;
    setDraft: (draft: ReviewDraft) => void;
    clearDraft: () => void;
};

const initialDraft: ReviewDraft = {
    cafeId: null,
    rating: 0,
    comment: '',

    coffeeRating: null,
    foodRating: null,
    serviceRating: null,
    comfortRating: null,
    quietRating: null,
    
    goodForWork: null,
    goodForStudy: null,
    goodForDate: null,
};

const ReviewDraftContext = 
    createContext<ReviewDraftContextType | undefined>(undefined);

export function ReviewDraftProvider({children,}:{children: ReactNode})
{
    
    const [draft, setDraft] = 
        useState<ReviewDraft>(initialDraft);

    const clearDraft = () => {
        setDraft(initialDraft);
    }

    return (
        <ReviewDraftContext.Provider
            value={{
                draft,
                setDraft,
                clearDraft
            }}
        >
            {children}
        </ReviewDraftContext.Provider>
    );
}

export function useReviewDraft()
{
    const context = useContext(ReviewDraftContext);

    if(!context)
    {
        throw new Error(
            'UseReviewDraft debe usarse dentro de ReviewDraftProvider'
        )
    }

    return context;
}