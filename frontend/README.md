# HUSTLEHUBKE — Frontend

React + Vite frontend for the HUSTLEHUBKE platform.

## Stack
- **React 18** with JSX in `.js` files
- **React Router v6** — client-side routing
- **Axios** — API calls with automatic JWT injection
- **Vite** — dev server + build tool

## Quick Start

```powershell
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

> The FastAPI backend must be running on port 8000.
> Vite automatically proxies `/api/*` → `http://localhost:8000/*`
> so there are no CORS issues in development.

## Folder Structure

```
frontend/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Navbar.js          # Sticky nav, adapts to auth state
│   │   ├── ProtectedRoute.js  # Redirects to /login if not authenticated
│   │   ├── LoadingSpinner.js  # Full-screen and inline spinner
│   │   └── Toast.js           # In-app notifications (success/error/info)
│   ├── context/
│   │   └── AuthContext.js     # Global user state + auth actions
│   ├── pages/
│   │   ├── LandingPage.js     # Public hero + features
│   │   ├── LoginPage.js       # Sign in form
│   │   ├── RegisterPage.js    # Sign up form + password strength
│   │   ├── DashboardPage.js   # Authenticated home
│   │   └── ProfilePage.js     # Edit profile + delete account
│   ├── services/
│   │   ├── api.js             # Axios instance + JWT interceptors
│   │   ├── authService.js     # register, login, logout
│   │   └── userService.js     # getMe, updateMe, deleteMe
│   ├── App.js                 # Router + providers
│   ├── main.js                # Vite entry point
│   └── index.css              # Global design system (CSS variables)
├── index.html                 # Vite HTML shell
├── vite.config.js             # Dev server + /api proxy
├── package.json
├── .env                       # Local secrets (gitignored)
├── .env.example               # Safe template to commit
├── .gitignore
└── README.md
```

## Pages & Routes

| Route        | Access    | Page            |
|--------------|-----------|-----------------|
| `/`          | Public    | Landing page    |
| `/login`     | Public    | Sign in         |
| `/register`  | Public    | Create account  |
| `/dashboard` | Protected | User dashboard  |
| `/profile`   | Protected | Edit profile    |

## How Auth Works

1. User logs in → `POST /auth/login` → JWT stored in `localStorage`
2. Every API request → Axios interceptor attaches `Authorization: Bearer <token>`
3. Any 401 response → token cleared, user redirected to `/login`
4. Page refresh → `AuthContext` calls `GET /users/me` to rehydrate session
5. Logout → token removed from `localStorage`, user state cleared

## Production Build

```powershell
# Set your deployed backend URL first
# In .env: VITE_API_URL=https://your-api.onrender.com

npm run build     # outputs to dist/
npm run preview   # preview the build locally
```

Deploy the `dist/` folder to **Vercel** or **Netlify** — both support
Vite out of the box with zero configuration.
