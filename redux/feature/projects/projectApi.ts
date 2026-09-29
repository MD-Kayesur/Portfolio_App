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
            transformResponse: (response: any) => {
                let list: any[] = [];
                if (Array.isArray(response)) {
                    list = response;
                } else if (response && Array.isArray(response.data)) {
                    list = response.data;
                } else if (response && response.data && Array.isArray(response.data.data)) {
                    list = response.data.data;
                } else if (response && typeof response === 'object') {
                    const foundArr = Object.values(response).find(val => Array.isArray(val));
                    if (foundArr) list = foundArr as any[];
                }

                return list.map(item => ({
                    _id: item._id || item.id || String(Math.random()),
                    name: item.title || item.name || 'Untitled Project',
                    description: item.description || '',
                    skills: item.tech || item.skills || [],
                    implementation: item.status || item.implementation || '',
                    liveLink: item.live || item.liveLink || '',
                    codeLink: item.clientcode || item.codeLink || '',
                    serverCodeLink: item.servercode || item.serverCodeLink || '',
                    image: Array.isArray(item.img) && item.img.length > 0 ? item.img[0] : (item.image || item.img || ''),
                    images: Array.isArray(item.img) ? item.img : [item.image || item.img].filter(Boolean)
                }));
            },
            providesTags: ['Projects'],
        }),

        getProjectById: builder.query<Project, string>({
            query: (id) => `/projects/${id}`,
            transformResponse: (response: any) => {
                const item = response?.data || response?.result || response || {};
                return {
                    _id: item._id || item.id || '',
                    name: item.title || item.name || 'Project Details',
                    description: item.description || '',
                    skills: item.tech || item.skills || [],
                    implementation: item.status || item.implementation || '',
                    liveLink: item.live || item.liveLink || '',
                    codeLink: item.clientcode || item.codeLink || '',
                    serverCodeLink: item.servercode || item.serverCodeLink || '',
                    image: Array.isArray(item.img) && item.img.length > 0 ? item.img[0] : (item.image || item.img || ''),
                    images: Array.isArray(item.img) ? item.img : [item.image || item.img].filter(Boolean)
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
