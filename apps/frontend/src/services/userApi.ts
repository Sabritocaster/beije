import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const normalizedBaseUrl = (
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333'
).replace(/\/+$/, '');

export interface UserSummary {
  username: string;
  email: string;
  isVerified: boolean;
}

export interface RegisterResponse {
  message: string;
  user: UserSummary;
}

export interface CheckVerificationResponse {
  isVerified: boolean;
  message: string;
}

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${normalizedBaseUrl}/user`,
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    register: builder.mutation<RegisterResponse, { username: string; email: string }>({
      query: (body) => ({
        url: '/register',
        method: 'POST',
        body,
      }),
      invalidatesTags: (result) =>
        result ? [{ type: 'User', id: result.user.username }] : [],
    }),
    verifyEmail: builder.mutation<RegisterResponse, { username: string; token: string }>({
      query: ({ username, token }) => ({
        url: `/verify-email/${encodeURIComponent(username)}/${encodeURIComponent(token)}`,
        method: 'GET',
      }),
      invalidatesTags: (result) =>
        result ? [{ type: 'User', id: result.user.username }] : [],
    }),
    checkVerification: builder.query<CheckVerificationResponse, string>({
      query: (username) => ({
        url: `/check-verification/${encodeURIComponent(username)}`,
        method: 'GET',
      }),
      providesTags: (result, error, username) =>
        result?.isVerified ? [{ type: 'User', id: username }] : [],
    }),
  }),
});

export const {
  useRegisterMutation,
  useVerifyEmailMutation,
  useLazyCheckVerificationQuery,
} = userApi;
