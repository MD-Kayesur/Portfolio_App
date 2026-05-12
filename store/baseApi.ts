// store/baseApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.EXPO_PUBLIC_API_URL || 'https://my-own-portfolio-server.vercel.app',
  }),
  tagTypes: ['Blogs', 'Users', 'Projects'],
  endpoints: () => ({}),
});



export default baseApi;