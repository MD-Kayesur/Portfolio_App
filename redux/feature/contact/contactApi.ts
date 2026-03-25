// redux/feature/contact/contactApi.ts
import { baseApi } from '../../../store/baseApi';

export interface ContactResponse {
    success: boolean;
    insertedId?: string;
    message?: string;
}

export interface ContactRequest {
    name: string;
    email: string;
    message: string;
}

export const contactApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        sendContact: builder.mutation<ContactResponse, ContactRequest>({
            query: (data) => ({
                url: '/contact',
                method: 'POST',
                body: data,
            }),
        }),
    }),
});

export const { useSendContactMutation } = contactApi;
