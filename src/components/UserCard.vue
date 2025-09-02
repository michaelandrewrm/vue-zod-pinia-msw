<script setup lang="ts">
import type { IUser } from '@/types/users';

interface Props {
  user: IUser;
  clickable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  clickable: true,
});

const emit = defineEmits<{
  click: [user: IUser];
}>();

const handleClick = () => {
  if (props.clickable) {
    emit('click', props.user);
  }
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
</script>

<template>
  <div class="user-card" :class="{ clickable }" @click="handleClick">
    <div class="user-avatar">
      <img
        :src="user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff`"
        :alt="`${user.name}'s avatar`"
      />
    </div>

    <div class="user-info">
      <div class="user-name">{{ user.name }}</div>
      <div class="user-role">{{ user.role }}</div>
      <div class="user-email">{{ user.email }}</div>
      <div v-if="user.department" class="user-department">{{ user.department }}</div>
    </div>

    <div class="user-status">
      <div class="status-indicator" :style="{ backgroundColor: getStatusColor(user.status) }"></div>
      <span class="status-text">{{ user.status || 'unknown' }}</span>
    </div>
  </div>
</template>

<style scoped>
.user-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.user-card.clickable {
  cursor: pointer;
}

.user-card.clickable:hover {
  border-color: #6366f1;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transform: translateY(-1px);
}

.user-avatar {
  flex-shrink: 0;
}

.user-avatar img {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #f3f4f6;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-weight: 600;
  font-size: 1.125rem;
  color: #111827;
  margin-bottom: 0.25rem;
}

.user-role {
  font-size: 0.875rem;
  color: #6366f1;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.user-email {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.user-department {
  font-size: 0.75rem;
  color: #9ca3af;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.user-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.status-indicator {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
}

.status-text {
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
  text-transform: capitalize;
}

@media (max-width: 640px) {
  .user-card {
    padding: 1rem;
    gap: 0.75rem;
  }

  .user-avatar img {
    width: 3rem;
    height: 3rem;
  }

  .user-name {
    font-size: 1rem;
  }

  .user-status {
    flex-direction: column;
    align-items: flex-end;
    gap: 0.25rem;
  }
}
</style>
