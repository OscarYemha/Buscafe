import { createContext, ReactNode, useContext, useState } from "react";

type ReviewDraft = {
    cafeId: string | null;
    rating: number;
    comment: string;
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