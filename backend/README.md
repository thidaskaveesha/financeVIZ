# financeVIZ Backend

Secure Node.js backend for financeVIZ financial visualization platform.

## Features

- Secure authentication system with JWT tokens
- Password hashing with bcrypt and unique salts
- Email verification system
- Password reset functionality
- CORS protection
- Server-side validation only
- Resistant to client-side tampering

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.example` to `.env` and fill in your configuration:
```bash
cp .env.example .env
```

3. Configure your Supabase database:
   - Create the `user` table using the schema in `prompt_auth.md`
   - Add your Supabase URL and service role key to `.env`

4. Configure email service:
   - Set up SMTP credentials or use Gmail
   - Add email credentials to `.env`

5. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### Authentication

- `POST /api/auth/sign-up` - Create a new user account
- `POST /api/auth/login` - Authenticate and get JWT token
- `POST /api/auth/email-verify` - Generate and send email verification code
- `POST /api/auth/verify-email-code` - Verify email with code
- `POST /api/auth/reset-code-generate` - Generate password reset code
- `POST /api/auth/reset-code-verify` - Verify password reset code

### Health Check

- `GET /health` - Check server status

## Security Features

- Password hashing with bcrypt (12 rounds)
- JWT tokens with server-verified claims
- CORS with strict origin whitelist
- Server-side validation only
- No trust in frontend-controlled values
- Subscription level enforced server-side

## Project Structure

```
backend/
├── config/
│   └── database.js          # Supabase connection
├── controllers/
│   └── authController.js    # Auth endpoint handlers
├── middleware/
│   └── validation.js        # Request validation
├── routes/
│   └── auth.js              # Auth routes
├── utils/
│   ├── security.js          # Password hashing, JWT, tokens
│   └── email.js             # Email service
├── server.js                # Express server setup
├── package.json
└── .env.example
```

## Database Schema

See `prompt_auth.md` for the complete database schema.

## Notes

- All subscription levels are set server-side only
- Email verification codes expire in 5 minutes
- Reset codes expire in 5 minutes
- JWT tokens include server-verified subscription level
- Frontend cannot modify user privileges
