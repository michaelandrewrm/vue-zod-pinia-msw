# Vue 3 User Management Application

A Vue 3 application showcasing user management with Mock Service Worker (MSW) integration, built using the Composition API, TypeScript, and Pinia for state management.

## ✨ Features

- **Data Fetching**: Integrated with MSW to mock API calls for user data
- **User List UI**: Clean, responsive list interface with search functionality
- **User Detail View**: Detailed user information page with professional layout
- **Vue 3 Composition API**: Modern Vue development patterns
- **Component-based Design**: Reusable components with proper separation of concerns
- **State Management**: Pinia for reactive state management
- **TypeScript Support**: Full type safety throughout the application
- **Responsive Design**: Mobile-first responsive UI
- **Routing**: Vue Router for navigation between views
- **Mock API**: MSW for realistic API mocking during development

## 🚀 Getting Started

### Prerequisites

- Node.js (^20.19.0 || >=22.12.0)
- npm

### Installation

````bash
# Clone the repository
git clone <repository-url>

# Navigate to the project directory
cd msw-playground

# Install dependencies
npm install

## Project Setup

```sh
npm install
````

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

The application will be available at `http://localhost:5173/`

## 🔧 Key Components

### UserCard Component (`/src/components/UserCard.vue`)

A reusable card component for displaying user information:

```vue
<UserCard :user="user" :clickable="true" @click="handleUserClick" />
```

**Props:**

- `user`: IUser object containing user data
- `clickable`: Boolean to enable/disable click interactions

## 📊 Mock Data Structure

The application uses rich mock data with the following user interface:

```typescript
interface IUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  phone?: string;
  company?: string;
  department?: string;
  location?: string;
  bio?: string;
  joinDate?: string;
  status?: 'active' | 'inactive' | 'pending';
}
```

### Example JSON Data

```json
{
  "id": "1",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "role": "Senior Developer",
  "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  "phone": "+1 (555) 123-4567",
  "company": "Tech Corp",
  "department": "Engineering",
  "location": "San Francisco, CA",
  "bio": "Passionate full-stack developer with 8+ years of experience building scalable web applications.",
  "joinDate": "2020-03-15",
  "status": "active"
}
```

## 🌐 Navigation Flow

1. **Landing Page** (`/`) → Redirects to `/users`
2. **User List** (`/users`) → Browse all users with search
3. **User Detail** (`/users/:id`) → View individual user details
4. **Back Navigation** → Return to user list from detail view
