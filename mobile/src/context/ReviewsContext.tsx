import { createContext, ReactNode, useContext, useState } from "react";

import { Review } from "../types/Review";

type ReviewsByCafe = {
    [cafeId: string]: Review[];
}

type ReviewsContextType = {
    reviewsByCafe: ReviewsByCafe;
    addReview: (cafeId: string, review: Review) => void;
    reviewsVersion: number;
    notifyReviewsChanged: () => void;
}

const ReviewContext = 
    createContext<ReviewsContextType | undefined>(undefined);

export function ReviewsProvider({ children,}: { children: ReactNode})
{
    const [reviewsByCafe, setReviewsByCafe] = useState<ReviewsByCafe>({});
    const [reviewsVersion, setReviewsVersion] = useState(0);

    const notifyReviewsChanged = () => {
        setReviewsVersion(current => current + 1);
    };

    const addReview = (
        cafeId: string,
        review: Review
    ) => {
        setReviewsByCafe(currentReviews => ({
            ...currentReviews,
            [cafeId]: [
                ...(currentReviews[cafeId] ?? []),
                review,
            ],
        }));
    };

    return (
        <ReviewContext.Provider
            value={{
                reviewsByCafe,
                addReview,
                reviewsVersion,
                notifyReviewsChanged,
            }}
        >
            {children}
        </ReviewContext.Provider>
    );
}

export function useReviews()
{
    const context = useContext(ReviewContext);

    if (!context)
    {
        throw new Error(
            'useReviews debe usarse dentro de ReviewsProvider'
        )
    }

    return context;
}