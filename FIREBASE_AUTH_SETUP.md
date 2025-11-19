# Firebase Auth Setup (Much Simpler!)

This is way easier than Passport! Just follow these steps:

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **Add project**
3. Enter project name (e.g., "eventful-app")
4. Disable Google Analytics (optional)
5. Click **Create project**

## Step 2: Enable Google Authentication

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Click **Google**
3. Toggle **Enable**
4. Enter a project support email
5. Click **Save**

## Step 3: Get Firebase Config

1. In Firebase Console, click the gear icon ⚙️ → **Project settings**
2. Scroll down to **Your apps** section
3. Click the **Web** icon (`</>`)
4. Register app with a nickname (e.g., "Eventful Web")
5. Copy the `firebaseConfig` object

## Step 4: Add Environment Variables

### Client (`client/.env`):
```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

### Server (`server/.env`):
```env
GOOGLE_CLIENT_ID=your-google-client-id
```

**Note:** The `GOOGLE_CLIENT_ID` is the same as `VITE_FIREBASE_API_KEY` or you can find it in Firebase Console → Project Settings → General → Your apps → Web app config.

Actually, wait - for token verification, you need the OAuth 2.0 Client ID. Let me check...

Actually, for `google-auth-library`, you can use the same Client ID from Firebase. But if you want to be precise:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Go to **APIs & Services** → **Credentials**
4. Find the **OAuth 2.0 Client ID** (it should be auto-created by Firebase)
5. Copy the **Client ID** (not the secret - you don't need it!)

## Step 5: That's It!

1. Restart your dev server: `npm run dev`
2. Click "Login with Google" in the navbar
3. A popup will appear - sign in with Google
4. You're done! 🎉

## How It Works

- **Frontend**: Firebase handles the OAuth popup and gives you a JWT token
- **Backend**: Verifies the token using `google-auth-library`
- **No sessions**: Everything is stateless with JWT tokens
- **No Passport**: Much simpler!

## Benefits Over Passport

✅ No session management  
✅ No database tables for sessions  
✅ Simpler code  
✅ Built-in token refresh  
✅ Works offline  
✅ Firebase handles all the OAuth complexity

