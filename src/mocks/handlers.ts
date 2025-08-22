import { http, HttpResponse } from 'msw';
import { usersMocks } from './api/index';

export const handlers = [
  http.get('https:/api/users', () => {
    return HttpResponse.json(usersMocks.getUsers());
  }),
];
