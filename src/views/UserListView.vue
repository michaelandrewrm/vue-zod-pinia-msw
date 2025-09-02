<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUsersStore } from '@/stores/users';
import UserCard from '@/components/UserCard.vue';
import type { IUser } from '@/types/users';

const router = useRouter();
const usersStore = useUsersStore();

const searchTerm = ref('');

const filteredUsers = computed(() => {
  if (!searchTerm.value) return usersStore.usersList;

  const term = searchTerm.value.toLowerCase();
  return usersStore.usersList.filter(
    (user) =>
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.role.toLowerCase().includes(term) ||
      user.department?.toLowerCase().includes(term)
  );
});

const handleUserClick = (user: IUser) => {
  router.push({ name: 'UserDetail', params: { id: user.id } });
};

const retryFetch = () => {
  usersStore.error = null;
  loadUsers();
};

const loadUsers = async () => {
  try {
    await usersStore.getUsers();
  } catch (error) {
    console.error('Failed to load users:', error);
  }
};

onMounted(() => {
  loadUsers();
});
</script>

<template>
  <div class="user-list-view">
    <!-- Header -->
    <div class="header">
      <h1 class="title">Team Directory</h1>
      <p class="subtitle">Meet our amazing team members</p>
    </div>

    <!-- Search -->
    <div class="search-section">
      <div class="search-container">
        <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input v-model="searchTerm" type="text" placeholder="Search users by name, email, role, or department..." class="search-input" />
        <div v-if="searchTerm" class="search-results-count">
          {{ filteredUsers.length }} result{{ filteredUsers.length !== 1 ? 's' : '' }}
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="usersStore.loading" class="loading">
      <div class="loading-spinner"></div>
      <p>Loading users...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="usersStore.error" class="error">
      <div class="error-icon">⚠️</div>
      <p class="error-message">{{ usersStore.error }}</p>
      <button class="retry-button" @click="retryFetch">Try Again</button>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredUsers.length === 0 && !usersStore.loading" class="empty">
      <div class="empty-icon">👥</div>
      <p class="empty-message">
        {{ searchTerm ? 'No users found matching your search.' : 'No users found.' }}
      </p>
      <button v-if="searchTerm" class="clear-search-button" @click="searchTerm = ''">Clear Search</button>
    </div>

    <!-- Users List -->
    <div v-else class="users-grid">
      <TransitionGroup name="user-list" tag="div" class="users-container">
        <UserCard v-for="user in filteredUsers" :key="user.id" :user="user" @click="handleUserClick" />
      </TransitionGroup>
    </div>

    <!-- Stats -->
    <div v-if="usersStore.usersList.length > 0" class="stats">
      <div class="stat">
        <span class="stat-number">{{ usersStore.usersList.length }}</span>
        <span class="stat-label">Total Users</span>
      </div>
      <div class="stat">
        <span class="stat-number">{{ new Set(usersStore.usersList.map((u) => u.department)).size }}</span>
        <span class="stat-label">Departments</span>
      </div>
      <div class="stat">
        <span class="stat-number">{{ usersStore.usersList.filter((u) => u.status === 'active').length }}</span>
        <span class="stat-label">Active Users</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-list-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
}

.title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 1.125rem;
  color: #6b7280;
  margin: 0;
}

.search-section {
  margin-bottom: 2rem;
}

.search-container {
  position: relative;
  max-width: 32rem;
  margin: 0 auto;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.25rem;
  height: 1.25rem;
  color: #9ca3af;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  font-size: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  background: white;
  transition: border-color 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.search-results-count {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 0;
  color: #6b7280;
}

.loading-spinner {
  width: 3rem;
  height: 3rem;
  border: 3px solid #e5e7eb;
  border-top: 3px solid #6366f1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 0;
  text-align: center;
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.error-message {
  color: #ef4444;
  font-size: 1.125rem;
  margin-bottom: 1.5rem;
}

.retry-button {
  padding: 0.75rem 1.5rem;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.retry-button:hover {
  background: #4f46e5;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 0;
  text-align: center;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-message {
  color: #6b7280;
  font-size: 1.125rem;
  margin-bottom: 1.5rem;
}

.clear-search-button {
  padding: 0.75rem 1.5rem;
  background: #f3f4f6;
  color: #374151;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.clear-search-button:hover {
  background: #e5e7eb;
}

.users-grid {
  margin-bottom: 3rem;
}

.users-container {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
}

.stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
  padding: 2rem 0;
  border-top: 1px solid #e5e7eb;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #6366f1;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

/* Transitions */
.user-list-enter-active,
.user-list-leave-active {
  transition: all 0.3s ease;
}

.user-list-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.user-list-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.user-list-move {
  transition: transform 0.3s ease;
}

@media (max-width: 768px) {
  .users-container {
    grid-template-columns: 1fr;
  }

  .title {
    font-size: 2rem;
  }

  .stats {
    gap: 1rem;
  }

  .stat-number {
    font-size: 1.5rem;
  }
}
</style>
