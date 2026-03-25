// redux/feature/chat/chatApi.ts
import { baseApi } from '../../../store/baseApi';

export interface ChatResponse {
    reply: string;
}

export interface ChatRequest {
    message: string;
}

export const chatApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        sendMessage: builder.mutation<ChatResponse, ChatRequest>({
            query: (data) => ({
                url: '/chat',
                method: 'POST',
                body: data,
            }),
        }),
    }),
});

export const { useSendMessageMutation } = chatApi;
