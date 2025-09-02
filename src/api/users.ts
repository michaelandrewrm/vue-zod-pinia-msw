import type { IUser } from '@/types/users';
import axios from 'axios';
import { baseUrl } from '@/constants';

const getUsers = () => axios.get<IUser[]>(`${baseUrl}/users`);
const getUserById = (userId: string) => axios.get<IUser>(`${baseUrl}/users/${userId}`);

export default {
  getUsers,
  getUserById,
};
