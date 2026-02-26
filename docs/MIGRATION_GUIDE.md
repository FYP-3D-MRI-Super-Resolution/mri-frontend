# Migration Guide: Old API → New Architecture

## 🔄 Why Migrate?

The new architecture provides:
- ✅ Better type safety
- ✅ Automatic caching
- ✅ Loading/error states
- ✅ Request deduplication
- ✅ Optimistic updates
- ✅ Better error handling

---

## 📋 Migration Checklist

### Step 1: Update Imports

#### Authentication
```typescript
// ❌ OLD
import { login, register } from '@/api/client'

// ✅ NEW
import { useLogin, useRegister } from '@/hooks'
```

#### Jobs
```typescript
// ❌ OLD
import { fetchJobs, fetchJobDetails } from '@/api/client'

// ✅ NEW
import { useJobs, useJob } from '@/hooks'
```

#### File Upload
```typescript
// ❌ OLD
import { uploadFiles } from '@/api/client'

// ✅ NEW
import { useUploadFiles } from '@/hooks'
```

#### Inference
```typescript
// ❌ OLD
import { runInference } from '@/api/client'

// ✅ NEW
import { useRunInferenceSimple } from '@/hooks'
```

---

### Step 2: Update Component Logic

#### Example: Login Component

**❌ OLD WAY:**
```typescript
import { useState } from 'react'
import { login } from '@/api/client'

function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await login(email, password)
      localStorage.setItem('auth_token', response.token)
      // Manual redirect
      window.location.href = '/dashboard'
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form>
      {error && <div>{error}</div>}
      <button disabled={loading}>
        {loading ? 'Loading...' : 'Login'}
      </button>
    </form>
  )
}
```

**✅ NEW WAY:**
```typescript
import { useLogin } from '@/hooks'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/useToast'

function LoginPage() {
  const { mutate: login, isLoading, error } = useLogin()
  const navigate = useNavigate()
  const { success, error: showError } = useToast()

  const handleLogin = (email: string, password: string) => {
    login(
      { email, password },
      {
        onSuccess: () => {
          success('Login successful!')
          navigate('/dashboard')
        },
        onError: (err) => {
          showError(err.message)
        },
      }
    )
  }

  return (
    <form>
      <button disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Login'}
      </button>
    </form>
  )
}
```

**Benefits:**
- ✅ Less boilerplate
- ✅ Automatic loading state
- ✅ Better error handling
- ✅ Type safety

---

#### Example: Jobs List

**❌ OLD WAY:**
```typescript
import { useState, useEffect } from 'react'
import { fetchJobs } from '@/api/client'

function JobsList() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const data = await fetchJobs()
        setJobs(data)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    loadJobs()
    
    // Manual polling
    const interval = setInterval(loadJobs, 5000)
    return () => clearInterval(interval)
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      {jobs.map(job => (
        <div key={job.id}>{job.status}</div>
      ))}
    </div>
  )
}
```

**✅ NEW WAY:**
```typescript
import { useJobs } from '@/hooks'

function JobsList() {
  const { data: jobs, isLoading, error } = useJobs()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      {jobs?.map(job => (
        <div key={job.id}>{job.status}</div>
      ))}
    </div>
  )
}
```

**Benefits:**
- ✅ 60% less code
- ✅ Automatic caching
- ✅ Automatic refetching
- ✅ No manual cleanup

---

#### Example: File Upload with Progress

**❌ OLD WAY:**
```typescript
import { useState } from 'react'
import { uploadFiles } from '@/api/client'
import axios from 'axios'

function UploadPage() {
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(false)

  const handleUpload = async (files: File[]) => {
    setLoading(true)
    
    const formData = new FormData()
    files.forEach(file => formData.append('files', file))

    try {
      const response = await axios.post('/api/preprocess/upload', formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )
          setProgress(percentCompleted)
        },
      })
      
      console.log('Job created:', response.data.job_id)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
      setProgress(0)
    }
  }

  return (
    <div>
      <input type="file" onChange={(e) => handleUpload(Array.from(e.target.files))} />
      {loading && <progress value={progress} max="100" />}
    </div>
  )
}
```

**✅ NEW WAY:**
```typescript
import { useUploadFiles } from '@/hooks'

function UploadPage() {
  const { mutate: upload, uploadProgress, isLoading } = useUploadFiles()

  const handleUpload = (files: File[]) => {
    upload(files, {
      onSuccess: (data) => {
        console.log('Job created:', data.job_id)
      },
    })
  }

  return (
    <div>
      <input type="file" onChange={(e) => handleUpload(Array.from(e.target.files!))} />
      {isLoading && <progress value={uploadProgress} max="100" />}
    </div>
  )
}
```

**Benefits:**
- ✅ 50% less code
- ✅ Automatic validation
- ✅ Better error handling
- ✅ Cleaner API

---

### Step 3: Update Type Imports

**❌ OLD:**
```typescript
import { Job } from '@/api/client'
```

**✅ NEW:**
```typescript
import type { Job, JobStatus, User } from '@/types'
```

---

### Step 4: Remove Old Client Usage

1. **Find all imports:**
   ```bash
   # Search for old imports
   grep -r "from '@/api/client'" src/
   ```

2. **Replace with new imports:**
   - `login` → `useLogin()`
   - `register` → `useRegister()`
   - `fetchJobs` → `useJobs()`
   - `fetchJobDetails` → `useJob(id)`
   - `uploadFiles` → `useUploadFiles()`
   - `runInference` → `useRunInferenceSimple()`

3. **Update component logic** to use hooks instead of async functions

---

## 🎯 Common Patterns

### Pattern 1: Fetch Data on Mount

**❌ OLD:**
```typescript
useEffect(() => {
  fetchData().then(setData)
}, [])
```

**✅ NEW:**
```typescript
const { data } = useJobs()
// That's it! Data fetches automatically
```

---

### Pattern 2: Refetch Data

**❌ OLD:**
```typescript
const [refresh, setRefresh] = useState(0)

useEffect(() => {
  fetchData()
}, [refresh])

// Later...
setRefresh(prev => prev + 1)
```

**✅ NEW:**
```typescript
const { data, refetch } = useJobs()

// Later...
refetch()
```

---

### Pattern 3: Loading States

**❌ OLD:**
```typescript
const [loading, setLoading] = useState(false)

const handleClick = async () => {
  setLoading(true)
  try {
    await doSomething()
  } finally {
    setLoading(false)
  }
}
```

**✅ NEW:**
```typescript
const { mutate, isLoading } = useSomething()

const handleClick = () => {
  mutate()
}
```

---

### Pattern 4: Error Handling

**❌ OLD:**
```typescript
const [error, setError] = useState(null)

try {
  await doSomething()
} catch (err) {
  setError(err.message)
}

return error && <div>{error}</div>
```

**✅ NEW:**
```typescript
const { error } = useSomething()

return error && <div>{error.message}</div>
```

---

## 📊 Comparison Table

| Feature | Old API | New Architecture |
|---------|---------|------------------|
| Type Safety | Partial | Full |
| Caching | Manual | Automatic |
| Loading States | Manual | Automatic |
| Error Handling | Manual | Automatic |
| Refetching | Manual | Automatic |
| Code Length | Verbose | Concise |
| Boilerplate | High | Low |
| Maintenance | Hard | Easy |

---

## ✅ Verification

After migration, verify:

1. **No old imports:**
   ```bash
   grep -r "from '@/api/client'" src/
   # Should return nothing (except deprecated file)
   ```

2. **TypeScript compiles:**
   ```bash
   npm run build
   # Should complete without errors
   ```

3. **All features work:**
   - Login/Register
   - File upload
   - Job monitoring
   - Inference
   - File download

---

## 🆘 Need Help?

- Check [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) for examples
- Check [ARCHITECTURE.md](./ARCHITECTURE.md) for concepts
- Review service implementations in `src/api/services/`
- Check hook implementations in `src/hooks/`

---

**Migration Time Estimate:** 2-4 hours for typical application

**Recommended Approach:** Migrate one component at a time, test, then move to the next.
