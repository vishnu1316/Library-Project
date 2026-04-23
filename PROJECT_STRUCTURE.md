# LibraNova Project Structure - Reorganized

## New Project Layout

```
library-_01-main/
├── backend/                          # All backend code
│   ├── .env                         # Backend environment variables
│   ├── server.js                    # Backend entry point
│   ├── server/
│   │   ├── index.js                 # Express app setup
│   │   ├── config/
│   │   │   └── db.js               # MongoDB connection
│   │   ├── data/
│   │   │   └── db.json             # JSON fallback storage
│   │   ├── middleware/
│   │   │   └── auth.js             # Authentication middleware
│   │   ├── models/
│   │   │   ├── AuditLog.js
│   │   │   ├── Bibliography.js
│   │   │   ├── Book.js
│   │   │   ├── ReadingProgress.js
│   │   │   ├── Recommendation.js
│   │   │   ├── Syllabus.js
│   │   │   ├── Transaction.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── aiRoutes.js
│   │   │   ├── api.js
│   │   │   ├── auditRoutes.js
│   │   │   ├── authRoutes.js
│   │   │   ├── bookRoutes.js
│   │   │   ├── facultyRoutes.js
│   │   │   ├── settingsRoutes.js
│   │   │   ├── transactionRoutes.js
│   │   │   └── userRoutes.js
│   │   ├── scripts/
│   │   │   └── seed.js
│   │   └── services/
│   │       └── storageService.js
│   └── controllers/
│       ├── bookController.js
│       └── userController.js
│
├── frontend/                         # All frontend code
│   ├── index.html                   # React entry point
│   ├── tsconfig.json                # TypeScript config
│   ├── vite.config.ts               # Vite configuration
│   ├── vitest.config.ts             # Testing config
│   ├── package-lock.json            # Frontend dependencies lock
│   ├── src/
│   │   ├── main.jsx                 # React DOM render
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   ├── main.ts
│   │   ├── counter.ts
│   │   ├── style.css
│   │   ├── vitest.setup.ts
│   │   ├── api/
│   │   │   └── userApi.js
│   │   ├── assets/
│   │   │   ├── hero.png
│   │   │   ├── typescript.svg
│   │   │   └── vite.svg
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   ├── common/
│   │   │   ├── faculty/
│   │   │   ├── librarian/
│   │   │   ├── shared/
│   │   │   └── student/
│   │   ├── contexts/
│   │   │   ├── LibraryContext.jsx
│   │   │   └── LibraryContext.test.jsx
│   │   └── pages/
│   │       ├── AdminPage.jsx
│   │       ├── AuthPage.jsx
│   │       ├── FacultyPage.jsx
│   │       ├── Landing.jsx
│   │       ├── LibrarianPage.jsx
│   │       └── StudentPage.jsx
│   └── public/
│       ├── favicon.svg
│       ├── icons.svg
│       └── Discover_Excellence_Your_Future_at_VEMU_Institute_Of_Technology_vemuitchittoor_720P.mp4
│
├── .env                             # Root environment (used as backup)
├── .gitignore
├── package.json                     # Root scripts (updated with new paths)
├── package-lock.json                # Root dependencies (main dependencies)
├── README.md
└── node_modules/


## Updated NPM Scripts

From `library-_01-main/package.json`:

```json
"scripts": {
  "dev:frontend": "cd frontend && vite",           # Run frontend dev server
  "dev:backend": "nodemon backend/server/index.js", # Run backend with hot reload
  "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"", # Run both
  "build": "cd frontend && tsc && vite build",     # Build frontend
  "preview": "cd frontend && vite preview",        # Preview production build
  "test": "cd frontend && vitest",                 # Run tests
  "test:ui": "cd frontend && vitest --ui",        # Test UI dashboard
  "start": "nodemon backend/server.js",            # Run backend only
  "seed": "node backend/server/scripts/seed.js"    # Seed database
}
```


## How to Run

### Backend Only (port 5000)
```bash
npm start
```
or
```bash
npm run dev:backend
```

### Frontend Only (port 5173)
```bash
npm run dev:frontend
```

### Full Development (Backend + Frontend)
```bash
npm run dev
```
This runs both backend and frontend concurrently.

### Build Frontend
```bash
npm run build
```

### Run Tests
```bash
npm test           # Run tests in watch mode
npm run test:ui    # Open test dashboard
```


## Environment Variables

- **Root**: `.env` (contains MongoDB Atlas connection)
- **Backend**: `backend/.env` (copy of root .env)
- **Frontend**: No .env file needed (uses backend API at http://localhost:5000)

## API Proxy

Frontend (Vite) is configured to proxy API calls:
- Frontend requests to `/api/*` → automatically forwarded to `http://localhost:5000/api/*`


## Key Changes Made

1. ✅ Created `/backend` folder with all server-side code
2. ✅ Created `/frontend` folder with all React code
3. ✅ Updated `package.json` scripts to reference new paths
4. ✅ Copied `.env` to backend folder
5. ✅ Created `frontend/vite.config.ts` with React + API proxy setup
6. ✅ All imports in source files remain relative (automatically work with new structure)


## Important Notes

- MongoDB Atlas connection is configured but has TLS issues in this environment
- App falls back to JSON file storage (`backend/server/data/db.json`)
- All features work with the JSON fallback
- MongoDB can be fixed later by updating connection settings in `backend/.env`
