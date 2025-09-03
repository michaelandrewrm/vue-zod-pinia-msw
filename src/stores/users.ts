import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import type { IUser } from '@/types/users';
import userApi from '@/api/users';

export const useUsersStore = defineStore('users', () => {
  const users = ref(new Map<string, IUser>());
  const loading = ref(false);
  const error = ref<string | null>(null);

  const usersList = computed(() => Array.from(users.value.values()));

  const getUsers = async (): Promise<IUser[]> => {
    loading.value = true;
    error.value = null;

    try {
      const { data } = await userApi.getUsers();
      users.value = new Map((data || []).map((user: IUser) => [user.id, user]));
      return usersList.value;
    } catch (err) {
      error.value = 'Failed to fetch users';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const getUserById = async (userId: string): Promise<IUser | null> => {
    loading.value = true;
    error.value = null;

    try {
      const { data } = await userApi.getUserById(userId);
      if (data) {
        // Cache the user
        users.value.set(data.id, data);
        return data;
      }
      return null;
    } catch (err) {
      error.value = 'Failed to fetch user details';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    users,
    usersList,
    loading,
    error,
    getUsers,
    getUserById,
  };
});
