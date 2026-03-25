// redux/feature/projects/projectApi.ts
import { baseApi } from '../../../store/baseApi';

export interface Project {
    _id: string;
    name: string;
    description: string;
    image: string;
    link: string;
    techStack: string[];
}

export const projectApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getProjects: builder.query<Project[], void>({
            query: () => '/projects',
            providesTags: ['Projects'],
        }),

        getProjectById: builder.query<Project, string>({
            query: (id) => `/projects/${id}`,
            providesTags: ['Projects'],
        }),

        addProject: builder.mutation<Project, Partial<Project>>({
            query: (newProject) => ({
                url: '/projects',
                method: 'POST',
                body: newProject,
            }),
            invalidatesTags: ['Projects'],
        }),

        updateProject: builder.mutation<Project, { id: string; data: Partial<Project> }>({
            query: ({ id, data }) => ({
                url: `/projects/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['Projects'],
        }),

        deleteProject: builder.mutation<void, string>({
            query: (id) => ({
                url: `/projects/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Projects'],
        }),
    }),
});

export const {
    useGetProjectsQuery,
    useGetProjectByIdQuery,
    useAddProjectMutation,
    useUpdateProjectMutation,
    useDeleteProjectMutation,
} = projectApi;
