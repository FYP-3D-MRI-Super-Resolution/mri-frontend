# Frontend-Backend Architecture Documentation

## 📐 Architecture Overview

This project follows **Clean Architecture** principles with a layered approach, implementing **SOLID**, **DRY**, and other best practices.

```
┌─────────────────────────────────────────────────────────────┐
│                       Presentation Layer                     │
│                   (Components & Pages)                       │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                      Hook Layer                              │
│              (Custom React Query Hooks)                      │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                     Service Layer                            │
│            (Business Logic & API Calls)                      │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                      API Layer                               │
│            (HTTP Client & Interceptors)                      │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                    Backend API                               │
│                 (FastAPI Server)                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Folder Structure

```
frontend/src/
├── api/                    # API layer
│   ├── config.ts          # Axios configuration & interceptors
│   ├── services/          # Service classes (one per domain)
│   │   ├── auth.service.ts
│   │   ├── jobs.service.ts
│   │   ├── preprocess.service.ts
│   │   ├── inference.service.ts
│   │   ├── files.service.ts
│   │   └── index.ts
│   └── index.ts
│
├── types/                  # TypeScript type definitions
│   ├── index.ts           # Core types (User, Job, File, etc.)
│   └── api.types.ts       # API request/response types
│
├── constants/              # Application constants
│   └── index.ts           # API endpoints, messages, config
│
├── hooks/                  # Custom React hooks
│   ├── useAuth.ts         # Authentication hooks
│   ├── useJobs.ts         # Jobs management hooks
│   ├── useUpload.ts       # File upload hooks
│   ├── useInference.ts    # Inference hooks
│   ├── useFiles.ts        # File operations hooks
│   ├── useToast.ts        # Toast notifications hook
│   └── index.ts
│
├── stores/                 # Zustand state stores
│   ├── authStore.ts       # Authentication state
│   ├── uiStore.ts         # UI state (sidebar, theme)
│   └── index.ts
│
├── utils/                  # Utility functions
│   └── index.ts           # Helper functions
│
├── components/             # Reusable UI components
│   ├── ErrorBoundary.tsx  # Error handling component
│   ├── Toast.tsx          # Notification component
│   ├── Layout.tsx
│   ├── JobStatus.tsx
│   ├── MRIViewer.tsx
│   └── UploadForm.tsx
│
├── pages/                  # Page components
│   ├── Home.tsx
│   ├── Upload.tsx
│   ├── Jobs.tsx
│   └── Viewer.tsx
│
├── App.tsx                 # Root component
└── main.tsx               # Entry point
```

---

## 🏗️ Architecture Principles

### 1. **SOLID Principles**

#### **Single Responsibility Principle (SRP)**
- Each service class handles one domain (auth, jobs, files, etc.)
- Each hook handles one specific operation
- Each component has one clear purpose

```typescript
// ✅ Good: Each service has single responsibility
class AuthService {
  async login() { ... }
  async register() { ... }
  async logout() { ... }
}

class JobsService {
  async getJobs() { ... }
  async getJob() { ... }
  async retryJob() { ... }
}
```

#### **Open/Closed Principle (OCP)**
- Services are open for extension but closed for modification
- Easy to add new methods without changing existing code

```typescript
// ✅ Easy to extend
class JobsService {
  // Existing methods remain unchanged
  async getJobs() { ... }
  
  // New functionality added without modifying existing code
  async pollJobStatus() { ... }
}
```

#### **Liskov Substitution Principle (LSP)**
- All services implement consistent interfaces
- Functions accept base types and work with derived types

#### **Interface Segregation Principle (ISP)**
- Types are specific to their use case
- No component is forced to depend on interfaces it doesn't use

```typescript
// ✅ Specific interfaces for specific needs
interface LoginRequest { email: string; password: string }
interface RegisterRequest extends LoginRequest { name: string }
```

#### **Dependency Inversion Principle (DIP)**
- Components depend on abstractions (hooks) not implementations (services)
- High-level modules don't depend on low-level modules

```typescript
// ✅ Component depends on hook (abstraction)
function MyComponent() {
  const { data, isLoading } = useJobs() // Abstract hook
  // Not directly calling jobsService.getJobs()
}
```

---

### 2. **DRY Principle (Don't Repeat Yourself)**

#### **Single Source of Truth**
```typescript
// ✅ Constants defined once
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    // ...
  }
}

// ✅ Types defined once
export interface User {
  id: string
  email: string
  name: string
}
```

#### **Reusable Services**
```typescript
// ✅ Service methods used by multiple hooks
export const authService = new AuthService()

// Used in multiple places
useLogin() // Uses authService.login()
useRegister() // Uses authService.register()
```

#### **Utility Functions**
```typescript
// ✅ Common operations in utilities
export const formatDate = (date: string) => { ... }
export const formatFileSize = (bytes: number) => { ... }
```

---

### 3. **Separation of Concerns**

#### **Layer Responsibilities**

**Components (Presentation)**
- Render UI
- Handle user interactions
- Display data from hooks

```typescript
function JobsList() {
  const { data: jobs } = useJobs() // Get data from hook
  return <div>{ /* Render jobs */ }</div>
}
```

**Hooks (Data Fetching)**
- Fetch data using React Query
- Manage loading/error states
- Cache and synchronize server state

```typescript
export const useJobs = () => {
  return useQuery({
    queryKey: QUERY_KEYS.JOBS.LIST,
    queryFn: () => jobsService.getJobs(),
  })
}
```

**Services (Business Logic)**
- Encapsulate API calls
- Handle data transformation
- Contain business rules

```typescript
class JobsService {
  async getJobs(): Promise<Job[]> {
    const response = await apiClient.get(API_ENDPOINTS.JOBS.LIST)
    return response.data
  }
}
```

**API Client (HTTP Layer)**
- Configure axios
- Add interceptors (auth, errors)
- Handle low-level HTTP concerns

```typescript
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  config.headers.Authorization = `Bearer ${token}`
  return config
})
```

---

## 🔄 Data Flow

### **Example: Fetching Jobs**

```
User Action (Click "View Jobs")
         │
         ▼
    Component
  (Jobs.tsx)
         │
         ▼
    Custom Hook
  (useJobs)
         │
         ▼
   React Query
  (QueryClient)
         │
         ▼
     Service
  (JobsService)
         │
         ▼
   API Client
  (axios)
         │
         ▼
   Backend API
  (FastAPI)
         │
         ▼
    Response
         │
         ▼
   React Query
  (Caching)
         │
         ▼
    Component
  (Re-render)
```

---

## 🎯 Key Features

### **1. Type Safety**
- Full TypeScript coverage
- Strict type checking
- IntelliSense support

### **2. Error Handling**
- Global error boundary
- Axios interceptors
- User-friendly error messages
- Toast notifications

### **3. State Management**
- React Query for server state
- Zustand for client state
- Persistent auth state

### **4. Performance**
- Request caching (React Query)
- Automatic refetching
- Optimistic updates
- Code splitting

### **5. Developer Experience**
- Path aliases (@/components)
- React Query DevTools
- Hot module replacement
- TypeScript intellisense

---

## 📝 Usage Examples

### **Authentication**

```typescript
import { useLogin, useAuth } from '@/hooks'

function LoginPage() {
  const { mutate: login, isLoading } = useLogin()
  const { isAuthenticated } = useAuth()

  const handleLogin = (email: string, password: string) => {
    login({ email, password }, {
      onSuccess: () => {
        // Navigate to dashboard
      },
      onError: (error) => {
        // Show error message
      }
    })
  }

  return <form onSubmit={handleLogin}>...</form>
}
```

### **File Upload with Progress**

```typescript
import { useUploadFiles } from '@/hooks'

function UploadPage() {
  const { mutate: upload, uploadProgress } = useUploadFiles()

  const handleUpload = (files: File[]) => {
    upload(files, {
      onSuccess: (data) => {
        console.log('Job created:', data.job_id)
      }
    })
  }

  return (
    <div>
      <input type="file" onChange={handleUpload} />
      <progress value={uploadProgress} max="100" />
    </div>
  )
}
```

### **Real-time Job Monitoring**

```typescript
import { useJobPolling } from '@/hooks'

function JobMonitor({ jobId }: { jobId: string }) {
  const { data: job } = useJobPolling(jobId, {
    onComplete: (job) => {
      console.log('Job completed!', job)
    }
  })

  return (
    <div>
      <p>Status: {job?.status}</p>
      <p>Progress: {job?.progress}%</p>
    </div>
  )
}
```

---

## 🔧 Configuration

### **Environment Variables**

```env
# .env
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=MRI Super-Resolution
VITE_ENABLE_DEV_TOOLS=true
```

### **Path Aliases**

```typescript
// Import using clean paths
import { authService } from '@/api/services'
import { useAuth } from '@/hooks'
import { User } from '@/types'
import { formatDate } from '@/utils'
import { API_ENDPOINTS } from '@/constants'
```

---

## 🚀 Getting Started

### **1. Install Dependencies**
```bash
npm install
```

### **2. Configure Environment**
```bash
cp .env.example .env
# Edit .env with your settings
```

### **3. Run Development Server**
```bash
npm run dev
```

### **4. Build for Production**
```bash
npm run build
```

---

## 🧪 Testing Recommendations

### **Service Layer**
```typescript
// Test business logic
describe('JobsService', () => {
  it('should fetch jobs', async () => {
    const jobs = await jobsService.getJobs()
    expect(jobs).toBeDefined()
  })
})
```

### **Hooks Layer**
```typescript
// Test hooks with React Query
import { renderHook } from '@testing-library/react-hooks'

it('should fetch jobs', () => {
  const { result } = renderHook(() => useJobs())
  expect(result.current.data).toBeDefined()
})
```

---

## 📚 Best Practices

1. **Always use hooks in components** - Never call services directly
2. **Keep services focused** - One service per domain
3. **Type everything** - No `any` types unless absolutely necessary
4. **Handle errors gracefully** - Use error boundaries and toast notifications
5. **Cache strategically** - Configure React Query cache times appropriately
6. **Use constants** - No magic strings or numbers
7. **Follow naming conventions** - Clear, descriptive names
8. **Document complex logic** - Add comments where needed

---

## 🎨 Code Style

- **Services**: PascalCase classes (`AuthService`)
- **Hooks**: camelCase starting with `use` (`useAuth`)
- **Components**: PascalCase (`LoginPage`)
- **Types**: PascalCase (`User`, `JobStatus`)
- **Constants**: UPPER_SNAKE_CASE (`API_ENDPOINTS`)
- **Functions**: camelCase (`formatDate`)

---

## 🔐 Security

- JWT tokens stored in localStorage
- Auto-refresh on 401 responses
- CSRF protection via axios
- Sanitized error messages
- Secure environment variables

---

## 📖 Further Reading

- [React Query Documentation](https://tanstack.com/query/latest)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
