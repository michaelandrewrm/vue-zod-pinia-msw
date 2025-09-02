import { http, HttpResponse } from 'msw';
import { usersMocks } from './api/index';
import { baseUrl } from '@/constants';

export const handlers = [
  http.get(`${baseUrl}/users`, () => {
    return HttpResponse.json(usersMocks.getUsers());
  }),

  http.get(`${baseUrl}/users/:userId`, ({ params }) => {
    const { userId } = params;

    if (!userId) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(usersMocks.getUserById(userId as string));
  }),
];
