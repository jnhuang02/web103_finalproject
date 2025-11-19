# Simple Google OAuth Setup (No Firebase!)

This is the simplest possible setup - just Google OAuth, nothing else!

## Step 1: Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Choose **Web application**
6. Add authorized JavaScript origins:
   - Development: `http://localhost:5173`
   - Production: `https://yourdomain.com`
7. Add authorized redirect URIs (not needed for this flow, but good to have):
   - Development: `http://localhost:5173`
   - Production: `https://yourdomain.com`
8. Copy your **Client ID** (you don't need the secret for this!)

## Step 2: Add Environment Variables

### Client (`client/.env`):
```env
VITE_GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
```

### Server (`server/.env`):
```env
GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
```

**That's it!** Same Client ID for both frontend and backend.

## Step 3: Test It

1. Restart your dev server: `npm run dev`
2. Click the Google login button in the navbar
3. Sign in with Google
4. Done! 🎉

## How It Works

- **Frontend**: `@react-oauth/google` handles the OAuth popup
- **Backend**: Verifies the JWT token using `google-auth-library`
- **Storage**: User info stored in `localStorage` (simple!)
- **No sessions**: Everything is stateless

## Benefits

✅ No Firebase project needed  
✅ No separate service  
✅ Just Google OAuth  
✅ Super simple setup  
✅ One Client ID for everything

