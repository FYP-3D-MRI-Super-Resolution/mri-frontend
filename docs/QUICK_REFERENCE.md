# Frontend Quick Reference Guide

## 🎯 Common Use Cases

### Authentication

#### Login
```typescript
import { useLogin } from '@/hooks'

function LoginForm() {
  const { mutate: login, isLoading, error } = useLogin()

  const handleSubmit = (email: string, password: string) => {
    login(
      { email, password },
      {
        onSuccess: () => {
          // Redirect to dashboard
          navigate('/dashboard')
        },
        onError: (err) => {
          toast.error(err.message)
        },
      }
    )
  }
}
```

#### Check Auth Status
```typescript
import { useAuth } from '@/hooks'

function ProtectedRoute() {
  const { isAuthenticated, user, isLoading } = useAuth()

  if (isLoading) return <Loading />
  if (!isAuthenticated) return <Navigate to="/login" />

  return <Dashboard user={user} />
}
```

#### Logout
```typescript
import { useLogout } from '@/hooks'

function LogoutButton() {
  const { mutate: logout } = useLogout()

  return <button onClick={() => logout()}>Logout</button>
}
```

---

### File Upload

#### Basic Upload
```typescript
import { useUploadFiles } from '@/hooks'

function UploadPage() {
  const { mutate: upload, uploadProgress, isLoading } = useUploadFiles()

  const handleFileUpload = (files: File[]) => {
    upload(files, {
      onSuccess: (data) => {
        console.log('Job created:', data.job_id)
        navigate(`/jobs/${data.job_id}`)
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })
  }

  return (
    <div>
      <input
        type="file"
        multiple
        onChange={(e) => handleFileUpload(Array.from(e.target.files!))}
      />
      {isLoading && <Progress value={uploadProgress} />}
    </div>
  )
}
```

#### With File Validation
```typescript
import { useFileValidation, useUploadFiles } from '@/hooks'

function SmartUploadForm() {
  const { validateFiles, allowedTypes, maxFileSize } = useFileValidation()
  const { mutate: upload } = useUploadFiles()

  const handleUpload = (files: File[]) => {
    const { valid, error } = validateFiles(files)

    if (!valid) {
      toast.error(error)
      return
    }

    upload(files)
  }
}
```

---

### Jobs Management

#### List All Jobs
```typescript
import { useJobs } from '@/hooks'

function JobsList() {
  const { data: jobs, isLoading, error, refetch } = useJobs()

  if (isLoading) return <Loading />
  if (error) return <Error message={error.message} />

  return (
    <div>
      <button onClick={() => refetch()}>Refresh</button>
      {jobs?.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  )
}
```

#### Filter Jobs
```typescript
import { useJobs } from '@/hooks'
import { JobStatus } from '@/types'

function CompletedJobs() {
  const { data: jobs } = useJobs({ status: JobStatus.COMPLETED })

  return <div>{/* Render completed jobs */}</div>
}
```

#### Get Single Job
```typescript
import { useJob } from '@/hooks'

function JobDetail({ jobId }: { jobId: string }) {
  const { data: job, isLoading } = useJob(jobId)

  if (isLoading) return <Loading />

  return (
    <div>
      <h1>{job.id}</h1>
      <p>Status: {job.status}</p>
      <p>Progress: {job.progress}%</p>
    </div>
  )
}
```

#### Monitor Job with Auto-Refresh
```typescript
import { useJobStatus } from '@/hooks'

function LiveJobMonitor({ jobId }: { jobId: string }) {
  const { data: job } = useJobStatus(jobId, {
    // Auto-refresh every 5 seconds
    refetchInterval: 5000,
  })

  return (
    <div>
      <p>Status: {job?.status}</p>
      <ProgressBar value={job?.progress || 0} />
    </div>
  )
}
```

#### Poll Until Completion
```typescript
import { useJobPolling } from '@/hooks'

function JobWithNotification({ jobId }: { jobId: string }) {
  const { data: job } = useJobPolling(jobId, {
    onComplete: (completedJob) => {
      toast.success(`Job ${completedJob.id} completed!`)
    },
    onError: (error) => {
      toast.error(`Job failed: ${error.message}`)
    },
  })

  return <JobDisplay job={job} />
}
```

#### Retry Failed Job
```typescript
import { useRetryJob } from '@/hooks'

function FailedJobCard({ job }: { job: Job }) {
  const { mutate: retry, isLoading } = useRetryJob()

  return (
    <div>
      <p>Job failed: {job.error_message}</p>
      <button
        onClick={() => retry(job.id)}
        disabled={isLoading}
      >
        Retry Job
      </button>
    </div>
  )
}
```

#### Cancel Running Job
```typescript
import { useCancelJob } from '@/hooks'

function CancelButton({ jobId }: { jobId: string }) {
  const { mutate: cancel } = useCancelJob()

  return (
    <button onClick={() => cancel(jobId)}>
      Cancel Job
    </button>
  )
}
```

---

### Inference

#### Run Inference (Simple)
```typescript
import { useRunInferenceSimple } from '@/hooks'

function InferenceButton({ lrFileId }: { lrFileId: string }) {
  const { mutate: runInference, isLoading } = useRunInferenceSimple()

  return (
    <button
      onClick={() =>
        runInference(lrFileId, {
          onSuccess: (data) => {
            console.log('Inference job:', data.inference_job_id)
          },
        })
      }
      disabled={isLoading}
    >
      Run Inference
    </button>
  )
}
```

#### Run Inference (Advanced)
```typescript
import { useRunInference } from '@/hooks'

function AdvancedInference() {
  const { mutate: runInference } = useRunInference()

  const handleInference = () => {
    runInference({
      lr_file_id: 'file-123',
      model_config: {
        model_name: 'ESRGAN',
        scale_factor: 2,
      },
    })
  }
}
```

---

### File Operations

#### Download File
```typescript
import { useDownloadFileFromUrl } from '@/hooks'

function DownloadButton({ fileUrl, filename }: Props) {
  const { mutate: download, isLoading } = useDownloadFileFromUrl()

  return (
    <button
      onClick={() => download({ url: fileUrl, filename })}
      disabled={isLoading}
    >
      {isLoading ? 'Downloading...' : 'Download'}
    </button>
  )
}
```

---

### Toast Notifications

```typescript
import { useToast } from '@/hooks/useToast'
import Toast from '@/components/Toast'

function MyComponent() {
  const { toast, success, error, warning, info, hideToast } = useToast()

  const handleAction = () => {
    success('Operation successful!')
    // or
    error('Something went wrong!')
    // or
    warning('Please be careful!')
    // or
    info('Here is some information')
  }

  return (
    <div>
      <button onClick={handleAction}>Do Something</button>
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </div>
  )
}
```

---

### Using Utilities

#### Format Values
```typescript
import { formatDate, formatFileSize, formatRelativeTime } from '@/utils'

function FileInfo({ file }) {
  return (
    <div>
      <p>Size: {formatFileSize(file.size)}</p>
      <p>Created: {formatDate(file.created_at)}</p>
      <p>Modified: {formatRelativeTime(file.updated_at)}</p>
    </div>
  )
}
```

#### Status Helpers
```typescript
import { getStatusColor, getStatusBadge, isJobActive } from '@/utils'

function JobStatusBadge({ status }) {
  return (
    <span className={getStatusColor(status)}>
      {getStatusBadge(status)}
    </span>
  )
}

function JobActions({ job }) {
  return isJobActive(job.status) ? (
    <CancelButton jobId={job.id} />
  ) : (
    <RetryButton jobId={job.id} />
  )
}
```

---

### Using Stores

#### Auth Store
```typescript
import { useAuthStore } from '@/stores'

function UserProfile() {
  const { user, isAuthenticated } = useAuthStore()

  if (!isAuthenticated) return <Login />

  return <div>Welcome, {user?.name}!</div>
}
```

#### UI Store
```typescript
import { useUIStore } from '@/stores'

function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useUIStore()

  return (
    <aside className={sidebarOpen ? 'open' : 'closed'}>
      <button onClick={toggleSidebar}>Toggle</button>
    </aside>
  )
}
```

---

### Direct Service Access (Advanced)

> ⚠️ Use hooks in components. Only use services directly in non-React contexts.

```typescript
import { authService, jobsService } from '@/api/services'

// In a utility function
async function checkAuthAndFetchJobs() {
  if (authService.isAuthenticated()) {
    const jobs = await jobsService.getJobs()
    return jobs
  }
  return []
}
```

---

## 📦 Import Paths

```typescript
// Types
import type { User, Job, JobStatus } from '@/types'
import type { AuthAPI, JobsAPI } from '@/types/api.types'

// Hooks
import { useAuth, useLogin, useJobs, useUploadFiles } from '@/hooks'

// Services (rarely used directly)
import { authService, jobsService } from '@/api/services'

// Stores
import { useAuthStore, useUIStore } from '@/stores'

// Utils
import { formatDate, formatFileSize } from '@/utils'

// Constants
import { API_ENDPOINTS, QUERY_KEYS } from '@/constants'

// Components
import { ErrorBoundary, Toast } from '@/components'
```

---

## 🎨 Component Patterns

### Loading State
```typescript
function MyComponent() {
  const { data, isLoading, error } = useJobs()

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error} />
  if (!data) return <EmptyState />

  return <DataDisplay data={data} />
}
```

### Error Handling
```typescript
function MyComponent() {
  const { mutate, error } = useUploadFiles()

  useEffect(() => {
    if (error) {
      toast.error(parseErrorMessage(error))
    }
  }, [error])
}
```

### Optimistic Updates
```typescript
import { useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants'

function DeleteButton({ jobId }) {
  const queryClient = useQueryClient()

  const handleDelete = () => {
    // Optimistically remove from UI
    queryClient.setQueryData(QUERY_KEYS.JOBS.ALL, (old) =>
      old.filter((job) => job.id !== jobId)
    )

    // Then make API call
    deleteJob(jobId)
  }
}
```

---

## 🔍 Debugging

### React Query DevTools
```typescript
// Already enabled in main.tsx
// Press bottom-left flower icon in browser
```

### Check Query Cache
```typescript
import { useQueryClient } from '@tanstack/react-query'

function DebugPanel() {
  const queryClient = useQueryClient()

  return (
    <button onClick={() => console.log(queryClient.getQueryData(QUERY_KEYS.JOBS.ALL))}>
      Log Jobs Cache
    </button>
  )
}
```

---

## ⚡ Performance Tips

1. **Use query keys effectively**
   ```typescript
   // Good - specific keys for specific queries
   useJobs({ status: 'completed' })
   useJobs({ status: 'pending' })
   ```

2. **Configure staleTime**
   ```typescript
   useQuery({
     queryKey: ['static-data'],
     staleTime: Infinity, // Never refetch
   })
   ```

3. **Prefetch data**
   ```typescript
   queryClient.prefetchQuery({
     queryKey: QUERY_KEYS.JOBS.GET(jobId),
     queryFn: () => jobsService.getJob(jobId),
   })
   ```

---

## 🚨 Common Mistakes

❌ **Don't call services directly in components**
```typescript
// Bad
function MyComponent() {
  const [data, setData] = useState()

  useEffect(() => {
    jobsService.getJobs().then(setData)
  }, [])
}
```

✅ **Use hooks instead**
```typescript
// Good
function MyComponent() {
  const { data } = useJobs()
}
```

---

❌ **Don't mix old and new API**
```typescript
// Bad
import { uploadFiles } from '@/api/client'
```

✅ **Use new architecture**
```typescript
// Good
import { useUploadFiles } from '@/hooks'
```

---

## 📚 See Also

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Complete architecture documentation
- [React Query Docs](https://tanstack.com/query/latest)
- [Zustand Docs](https://github.com/pmndrs/zustand)
