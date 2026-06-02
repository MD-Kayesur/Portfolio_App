import { baseApi } from '../../../store/baseApi';

export interface Skill {
    _id: string;
    title: string;
    iconName: string;
    color: string;
    type: string;
}

export const skillApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getSkills: builder.query<Skill[], void>({
            query: () => '/skills',
            providesTags: ['Skills' as any],
        }),
    }),
});

export const { useGetSkillsQuery } = skillApi;
