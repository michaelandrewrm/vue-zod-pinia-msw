<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUsersStore } from '@/stores/users';
import type { IUser } from '@/types/users';

interface Props {
  id: string;
}

const props = defineProps<Props>();
const router = useRouter();
const usersStore = useUsersStore();

const user = ref<IUser | null>(null);

const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const getStatusColor = (status?: string) => {
  switch (status) {
    case 'active':
      return '#10b981';
    case 'inactive':
      return '#ef4444';
    case 'pending':
      return '#f59e0b';
    default:
      return '#6b7280';
  }
};

const goBack = () => {
  router.push({ name: 'UserList' });
};

const loadUser = async () => {
  try {
    user.value = await usersStore.getUserById(props.id);
  } catch (err) {
    console.error('Error loading user:', err);
  }
};

const retryLoad = () => {
  usersStore.error = null;
  loadUser();
};

onMounted(() => {
  loadUser();
});
</script>

<template>
  <div class="user-detail-view">
    <!-- Navigation -->
    <div class="navigation">
      <button class="back-button" @click="goBack">
        <svg class="back-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Users
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="usersStore.loading" class="loading">
      <div class="loading-spinner"></div>
      <p>Loading user details...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="usersStore.error" class="error">
      <div class="error-icon">⚠️</div>
      <p class="error-message">{{ usersStore.error }}</p>
      <button class="retry-button" @click="retryLoad">Try Again</button>
    </div>

    <!-- User Not Found -->
    <div v-else-if="!user" class="not-found">
      <div class="not-found-icon">👤</div>
      <h2 class="not-found-title">User Not Found</h2>
      <p class="not-found-message">The user with ID "{{ props.id }}" could not be found.</p>
      <button class="back-button-alt" @click="goBack">Return to User List</button>
    </div>

    <!-- User Detail -->
    <div v-else class="user-detail">
      <!-- Header Section -->
      <div class="user-header">
        <div class="avatar-section">
          <img
            :src="user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff&size=128`"
            :alt="`${user.name}'s avatar`"
            class="avatar"
          />
          <div class="status-badge">
            <div class="status-indicator" :style="{ backgroundColor: getStatusColor(user.status) }"></div>
            <span class="status-text">{{ user.status || 'unknown' }}</span>
          </div>
        </div>

        <div class="user-info">
          <h1 class="user-name">{{ user.name }}</h1>
          <p class="user-role">{{ user.role }}</p>
          <p class="user-email">
            <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <a :href="`mailto:${user.email}`">{{ user.email }}</a>
          </p>
          <p v-if="user.phone" class="user-phone">
            <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <a :href="`tel:${user.phone}`">{{ user.phone }}</a>
          </p>
        </div>
      </div>

      <!-- Details Grid -->
      <div class="details-grid">
        <div class="detail-card">
          <h3 class="detail-title">Professional Information</h3>
          <div class="detail-content">
            <div class="detail-row">
              <span class="detail-label">Company</span>
              <span class="detail-value">{{ user.company || 'N/A' }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Department</span>
              <span class="detail-value">{{ user.department || 'N/A' }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Join Date</span>
              <span class="detail-value">{{ formatDate(user.joinDate) }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Location</span>
              <span class="detail-value">{{ user.location || 'N/A' }}</span>
            </div>
          </div>
        </div>

        <div v-if="user.bio" class="detail-card">
          <h3 class="detail-title">About</h3>
          <div class="detail-content">
            <p class="bio-text">{{ user.bio }}</p>
          </div>
        </div>

        <div class="detail-card">
          <h3 class="detail-title">Contact Information</h3>
          <div class="detail-content">
            <div class="contact-item">
              <svg class="contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <div>
                <span class="contact-label">Email</span>
                <a :href="`mailto:${user.email}`" class="contact-value">{{ user.email }}</a>
              </div>
            </div>
            <div v-if="user.phone" class="contact-item">
              <svg class="contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <div>
                <span class="contact-label">Phone</span>
                <a :href="`tel:${user.phone}`" class="contact-value">{{ user.phone }}</a>
              </div>
            </div>
            <div v-if="user.location" class="contact-item">
              <svg class="contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div>
                <span class="contact-label">Location</span>
                <span class="contact-value">{{ user.location }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-detail-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.navigation {
  margin-bottom: 2rem;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #f3f4f6;
  color: #374151;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.back-button:hover {
  background: #e5e7eb;
}

.back-icon {
  width: 1.25rem;
  height: 1.25rem;
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

.error,
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 0;
  text-align: center;
}

.error-icon,
.not-found-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.error-message {
  color: #ef4444;
  font-size: 1.125rem;
  margin-bottom: 1.5rem;
}

.not-found-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.5rem;
}

.not-found-message {
  color: #6b7280;
  font-size: 1.125rem;
  margin-bottom: 1.5rem;
}

.retry-button,
.back-button-alt {
  padding: 0.75rem 1.5rem;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.retry-button:hover,
.back-button-alt:hover {
  background: #4f46e5;
}

.user-detail {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.user-header {
  display: flex;
  gap: 2rem;
  margin-bottom: 3rem;
  padding: 2rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.avatar-section {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.avatar {
  width: 8rem;
  height: 8rem;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #f3f4f6;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #f9fafb;
  border-radius: 2rem;
  border: 1px solid #e5e7eb;
}

.status-indicator {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
}

.status-text {
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: capitalize;
  color: #374151;
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.user-name {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.user-role {
  font-size: 1.25rem;
  font-weight: 600;
  color: #6366f1;
  margin: 0;
}

.user-email,
.user-phone {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  margin: 0;
}

.user-email a,
.user-phone a {
  color: inherit;
  text-decoration: none;
  transition: color 0.2s ease;
}

.user-email a:hover,
.user-phone a:hover {
  color: #6366f1;
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
}

.details-grid {
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
}

.detail-card {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

.detail-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  padding: 1.5rem 1.5rem 0;
  margin: 0 0 1rem 0;
}

.detail-content {
  padding: 0 1.5rem 1.5rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f3f4f6;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-weight: 500;
  color: #6b7280;
}

.detail-value {
  font-weight: 500;
  color: #111827;
}

.bio-text {
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
}

.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #f3f4f6;
}

.contact-item:last-child {
  border-bottom: none;
}

.contact-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: #6366f1;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.contact-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.contact-value {
  display: block;
  font-weight: 500;
  color: #111827;
  text-decoration: none;
  transition: color 0.2s ease;
}

a.contact-value:hover {
  color: #6366f1;
}

@media (max-width: 768px) {
  .user-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1.5rem;
  }

  .details-grid {
    grid-template-columns: 1fr;
  }

  .user-name {
    font-size: 1.75rem;
  }

  .avatar {
    width: 6rem;
    height: 6rem;
  }
}

@media (max-width: 480px) {
  .user-detail-view {
    padding: 1rem 0.5rem;
  }

  .user-header {
    padding: 1.5rem;
  }

  .detail-content {
    padding: 0 1rem 1rem;
  }

  .detail-title {
    padding: 1rem 1rem 0;
  }
}
</style>
