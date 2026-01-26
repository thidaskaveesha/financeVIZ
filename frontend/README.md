# financeVIZ Frontend

Modern Next.js frontend for financeVIZ financial visualization platform.

## Features

- 🎨 Dark mode theme (Modern Fintech, Premium Feel)
- 🔐 Complete authentication flow (Sign Up, Login, Email Verification, Password Reset)
- 📱 Responsive design
- ⚡ Fast and optimized with Next.js 14
- 🎯 Form validation with React Hook Form and Zod
- 🔒 Protected routes with authentication context
- 💳 Landing page with features, API integration, AI insights, and pricing

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.example` to `.env.local` and configure:
```bash
cp .env.example .env.local
```

3. Update `NEXT_PUBLIC_API_URL` in `.env.local` to match your backend URL

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3001](http://localhost:3001) in your browser

## Project Structure

```
frontend/
├── app/
│   ├── dashboard/          # Protected dashboard page
│   ├── login/              # Login page
│   ├── signup/             # Sign up page
│   ├── verify-email/       # Email verification page
│   ├── forgot-password/    # Password reset page
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Landing page
│   └── globals.css         # Global styles
├── contexts/
│   └── AuthContext.tsx     # Authentication context
├── lib/
│   └── api.ts              # API client
└── package.json
```

## Authentication Flow

1. **Sign Up**: User creates account → receives email verification code
2. **Email Verify**: User enters 8-digit code → email verified
3. **Login**: User logs in → receives JWT token → redirected to dashboard
4. **Password Reset**: User requests reset code → verifies code → can reset password

## Pages

### Landing Page (`/`)
- Hero section with CTA
- Feature highlights
- API integration section
- AI insights section (Pro feature)
- Pricing plans

### Authentication Pages
- `/signup` - Create new account
- `/login` - Sign in
- `/verify-email` - Verify email with code
- `/forgot-password` - Request and verify reset code

### Dashboard (`/dashboard`)
- Protected route (requires authentication)
- Shows user information
- Financial overview (placeholder for future charts)

## Technologies

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Axios** - HTTP client
- **js-cookie** - Cookie management
- **Lucide React** - Icons

## Environment Variables

- `NEXT_PUBLIC_API_URL` - Backend API URL (default: http://localhost:3000/api)

## Notes

- JWT tokens are stored in HTTP-only cookies (via js-cookie)
- All API calls include authentication token automatically
- Protected routes redirect to login if not authenticated
- Subscription level is read-only from backend (cannot be tampered)
