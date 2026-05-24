// redux/feature/projects/projectApi.ts
import { baseApi } from '../../../store/baseApi';

export interface Project {
    _id: string;
    name: string;
    description: string;
    skills: string[];
    implementation: string;
    liveLink: string;
    codeLink: string;
    serverCodeLink: string;
    image: string;
    images?: string[];
}

export const projectApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getProjects: builder.query<Project[], void>({
            query: () => '/projects',
            transformResponse: (response: { success: boolean; data: any[] }) => {
                return response.data.map(item => ({
                    _id: item._id,
                    name: item.title,
                    description: item.description,
                    skills: item.tech || [],
                    implementation: item.status || '',
                    liveLink: item.live || '',
                    codeLink: item.clientcode || '',
                    serverCodeLink: item.servercode || '',
                    image: item.img && item.img.length > 0 ? item.img[0] : '',
                    images: item.img || []
                }));
            },
            providesTags: ['Projects'],
        }),

        getProjectById: builder.query<Project, string>({
            query: (id) => `/projects/${id}`,
            transformResponse: (response: { success: boolean; data: any }) => {
                const item = response.data;
                return {
                    _id: item._id,
                    name: item.title,
                    description: item.description,
                    skills: item.tech || [],
                    implementation: item.status || '',
                    liveLink: item.live || '',
                    codeLink: item.clientcode || '',
                    serverCodeLink: item.servercode || '',
                    image: item.img && item.img.length > 0 ? item.img[0] : '',
                    images: item.img || []
                };
            },
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
