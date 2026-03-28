// redux/feature/feedback/feedbackApi.ts
import { baseApi } from '../../../store/baseApi';

export interface Feedback {
    _id: string;
    name: string;
    email: string;
    message: string;
    rating?: number;
    date?: string;
}

export const feedbackApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getFeedbacks: builder.query<Feedback[], void>({
            query: () => '/feedbacks',
            providesTags: ['Feedback' as any],
        }),
        addFeedback: builder.mutation<Feedback, Partial<Feedback>>({
            query: (data) => ({
                url: '/feedbacks',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Feedback' as any],
        }),
    }),
});

export const { useGetFeedbacksQuery, useAddFeedbackMutation } = feedbackApi;
