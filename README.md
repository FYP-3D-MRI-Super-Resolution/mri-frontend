# MRI Super-Resolution Frontend

React + TypeScript frontend for the MRI Super-Resolution web application.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Backend API running on `http://localhost:8000`

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
frontend/
├── src/
│   ├── api/              # API client and service functions
│   ├── components/       # Reusable React components
│   │   ├── Layout.tsx
│   │   ├── MRIViewer.tsx
│   │   ├── UploadForm.tsx
│   │   └── JobStatus.tsx
│   ├── pages/            # Page components
│   │   ├── Home.tsx
│   │   ├── Upload.tsx
│   │   ├── Jobs.tsx
│   │   └── Viewer.tsx
│   ├── stores/           # Zustand state management
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
├── public/               # Static assets
└── package.json
```

## 🛠️ Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TailwindCSS** - Styling
- **React Router** - Client-side routing
- **React Query** - Server state management
- **Zustand** - Global state management
- **Axios** - HTTP client
- **NiiVue** - Medical imaging 3D viewer
- **React Dropzone** - File upload handling

## 📦 Available Scripts

```bash
# Development
npm run dev          # Start dev server (port 3000)

# Build
npm run build        # Build for production
npm run preview      # Preview production build

# Linting
npm run lint         # Run ESLint
```

## 🔌 API Integration

The frontend connects to the backend API at the URL specified in `.env`:

```env
VITE_API_URL=http://localhost:8000/api
```

### API Endpoints Used

- `POST /api/preprocess/upload` - Upload MRI files
- `GET /api/jobs` - List all jobs
- `GET /api/jobs/:id` - Get job details
- `POST /api/infer` - Run super-resolution inference
- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration

## 🎨 Key Features

### 1. File Upload
- Drag-and-drop interface for NIfTI files
- File validation and size checking
- Progress tracking

### 2. Job Management
- Real-time status updates
- Progress indicators
- Auto-refresh every 5 seconds

### 3. 3D Visualization
- **NiiVue** integration for medical imaging
- Multi-planar views (Axial, Coronal, Sagittal)
- Side-by-side comparison (LR vs HR)
- Overlay mode with opacity control

### 4. Responsive Design
- Works on desktop and tablets
- Dark mode support
- Mobile-friendly navigation

## 🧩 Key Components

### MRIViewer
3D viewer component using NiiVue library for interactive MRI visualization.

```tsx
<MRIViewer fileUrl="/path/to/scan.nii.gz" title="High Resolution" />
```

### UploadForm
Drag-and-drop file upload with validation.

```tsx
<UploadForm onSuccess={(jobId) => console.log(jobId)} />
```

### JobStatus
Display job progress and status.

```tsx
<JobStatus jobId="123" status="processing" progress={75} />
```

## 🔐 Authentication

Authentication tokens are stored in `localStorage` and automatically attached to API requests.

```typescript
// Login
const { token } = await login(email, password)
useAuthStore.getState().login(token, user)

// Logout
useAuthStore.getState().logout()
```

## 📊 State Management

### React Query
Used for server state (API data):
- Automatic caching
- Background refetching
- Optimistic updates

### Zustand
Used for client state (auth, UI):
- Lightweight and simple
- TypeScript support
- Persistent storage

## 🎯 Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:8000/api
```

## 🐛 Development Notes

### Hot Module Replacement (HMR)
Vite provides instant HMR - changes appear immediately without full reload.

### Type Safety
All components are fully typed with TypeScript. Run type checking:

```bash
npm run build  # TypeScript errors will show during build
```

### Proxy Configuration
API requests are proxied in development (see `vite.config.ts`):
- `/api/*` → `http://localhost:8000/api/*`

## 📦 Building for Production

```bash
# Build production bundle
npm run build

# Output will be in /dist folder
# Serve with any static file server
```

## 🚢 Deployment

### Option 1: Static Hosting (Vercel, Netlify)
```bash
npm run build
# Deploy /dist folder
```

### Option 2: Docker
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🔧 Troubleshooting

### CORS Errors
Ensure backend allows requests from frontend origin:
```python
# backend: main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### NiiVue Not Loading
Check browser console for WebGL support:
```javascript
const canvas = document.createElement('canvas')
const gl = canvas.getContext('webgl2')
if (!gl) console.error('WebGL 2 not supported')
```

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev/guide/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [NiiVue Documentation](https://github.com/niivue/niivue)
- [React Query Guide](https://tanstack.com/query/latest)

## 📄 License

Part of MRI Super-Resolution Pipeline FYP Project

---

**Note**: This frontend requires the backend API to be running. See `../backend/README.md` for backend setup instructions.
