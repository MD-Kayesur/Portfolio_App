// redux/feature/blogs/blogApi.ts
import { baseApi } from '../../../store/baseApi';

export interface Blog {
  _id: string;
  about: string;
  description: string;
  email?: string;
  media: string;
  date: string;
}

export const blogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBlogs: builder.query<Blog[], void>({
      query: () => '/blogs',
      providesTags: ['Blogs'],
    }),

    getBlogById: builder.query<Blog, string>({
      query: (id) => `/blogs/${id}`,
      providesTags: ['Blogs'],
    }),

    addBlog: builder.mutation<Blog, Partial<Blog>>({
      query: (newBlog) => ({
        url: '/blogs',
        method: 'POST',
        body: newBlog,
      }),
      invalidatesTags: ['Blogs'],
    }),

    updateBlog: builder.mutation<Blog, { id: string; data: Partial<Blog> }>({
      query: ({ id, data }) => ({
        url: `/blogs/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Blogs'],
    }),

    deleteBlog: builder.mutation<void, string>({
      query: (id) => ({
        url: `/blogs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Blogs'],
    }),
  }),
});

export const {
  useGetBlogsQuery,
  useGetBlogByIdQuery,
  useAddBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} = blogApi;