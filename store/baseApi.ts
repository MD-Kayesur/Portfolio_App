// store/baseApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://nur-jahan-fevrics-server.vercel.app',
  }),
  tagTypes: ['Blogs', 'Users', 'Projects'],
  endpoints: () => ({}),
});



export default baseApi;