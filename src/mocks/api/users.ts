import type { IUser } from '@/types/users';

const users: IUser[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
  },
];

export const getUsers = () => users;
export const getUserId = (id: string) => users.find((user) => user.id === id);
export const createUser = () => ({});
export const updateUser = () => ({});
export const deleteUser = () => {};
