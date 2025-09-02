<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useUsersStore } from '@/stores/users';
import UserCard from '@/components/UserCard.vue';
import type { IUser } from '@/types/users';

const usersStore = useUsersStore();
const showAll = ref(false);

const displayedUsers = computed(() => {
  if (showAll.value) return usersStore.usersList;
  return usersStore.usersList.slice(0, 3);
});

const handleUserClick = (user: IUser) => {
  // Emit event for parent component to handle
  emit('user-selected', user);
};

const emit = defineEmits<{
  'user-selected': [user: IUser];
}>();

const loadUsers = async () => {
  try {
    await usersStore.getUsers();
  } catch (error) {
    console.error('Failed to load users:', error);
  }
};

onMounted(() => {
  if (usersStore.usersList.length === 0) {
    loadUsers();
  }
});
</script>

<template>
  <div class="users-widget">
    <div class="widget-header">
      <h3 class="widget-title">Team Members</h3>
      <button v-if="usersStore.usersList.length > 3" class="toggle-button" @click="showAll = !showAll">
        {{ showAll ? 'Show Less' : `View All (${usersStore.usersList.length})` }}
      </button>
    </div>

    <div v-if="usersStore.loading" class="loading">
      <div class="loading-spinner"></div>
      <p>Loading users...</p>
    </div>

    <div v-else-if="usersStore.error" class="error">
      <p>{{ usersStore.error }}</p>
      <button class="retry-button" @click="loadUsers">Retry</button>
    </div>

    <div v-else-if="displayedUsers.length === 0" class="empty">
      <p>No users found.</p>
    </div>

    <div v-else class="users-list">
      <UserCard v-for="user in displayedUsers" :key="user.id" :user="user" @click="handleUserClick" />
    </div>
  </div>
</template>

<style scoped>
.users-widget {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.widget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.widget-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.toggle-button {
  padding: 0.5rem 1rem;
  background: #f3f4f6;
  color: #374151;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.toggle-button:hover {
  background: #e5e7eb;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem 0;
  color: #6b7280;
}

.loading-spinner {
  width: 1.5rem;
  height: 1.5rem;
  border: 2px solid #e5e7eb;
  border-top: 2px solid #6366f1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error {
  text-align: center;
  padding: 2rem 0;
  color: #ef4444;
}

.retry-button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
}

.retry-button:hover {
  background: #dc2626;
}

.empty {
  text-align: center;
  padding: 2rem 0;
  color: #6b7280;
}

.users-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (max-width: 768px) {
  .users-widget {
    padding: 1rem;
  }

  .widget-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
}
</style>
