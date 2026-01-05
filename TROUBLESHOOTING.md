# Troubleshooting Guide

## Firebase Configuration Issues

### 1. Check if Authentication is Enabled

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **streamflix-6cfbd**
3. Click **Authentication** in the left sidebar
4. Click **Get Started** if you haven't already
5. Go to the **Sign-in method** tab
6. Make sure **Email/Password** is enabled (toggle should be ON)
7. Click **Save**

### 2. Check if Firestore Database is Created

1. In Firebase Console, click **Firestore Database** in the left sidebar
2. If you see "Create database", click it and:
   - Choose **Production mode** (or Test mode for development)
   - Select a location
   - Click **Enable**
3. If database already exists, make sure it's active

### 3. Set up Firestore Security Rules

1. In Firestore Database, click the **Rules** tab
2. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own wishlist
    match /users/{userId}/wishlist/{movieId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Click **Publish**

### 4. Verify Firebase Config File

Make sure `src/firebase/config.js` has your correct Firebase credentials:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyAFHzXWyms3DrBUIaecTceEogxgmTOrb80",
  authDomain: "streamflix-6cfbd.firebaseapp.com",
  projectId: "streamflix-6cfbd",
  storageBucket: "streamflix-6cfbd.firebasestorage.app",
  messagingSenderId: "659088495466",
  appId: "1:659088495466:web:f7ba213dd703b19a824b13"
};
```

### 5. Common Error Messages

#### "Firebase: Error (auth/operation-not-allowed)"
- **Solution**: Enable Email/Password authentication in Firebase Console (Step 1)

#### "Firebase: Error (auth/user-not-found)"
- **Solution**: The email doesn't exist. Sign up first, then sign in.

#### "Firebase: Error (auth/wrong-password)"
- **Solution**: Incorrect password. Try resetting your password or use the correct one.

#### "Firebase: Error (auth/email-already-in-use)"
- **Solution**: Email already registered. Use the login page instead.

#### "Permission denied" or Firestore errors
- **Solution**: Check Firestore security rules (Step 3)

#### "Failed to get document"
- **Solution**: Make sure Firestore Database is created and rules are published

### 6. Test Your Setup

1. Open your app in the browser
2. Open Developer Tools (F12)
3. Go to the Console tab
4. Look for any Firebase errors
5. Try signing up with a test account
6. Check Firebase Console > Authentication > Users to see if the user was created
7. Try adding a movie to wishlist
8. Check Firebase Console > Firestore Database to see if the data was saved

### 7. Clear Browser Cache

Sometimes cached data can cause issues:

1. Press `Ctrl + Shift + Delete` (Windows) or `Cmd + Shift + Delete` (Mac)
2. Clear cache and cookies
3. Refresh the page

### 8. Check Network/Console Errors

1. Open Developer Tools (F12)
2. Check the **Console** tab for JavaScript errors
3. Check the **Network** tab to see if Firebase requests are failing
4. Look for any red error messages

### 9. Verify Firebase Project Status

1. Go to Firebase Console
2. Make sure your project is active (not suspended)
3. Check if you have any billing/quota issues
4. Verify the project ID matches: **streamflix-6cfbd**

## Still Not Working?

1. Double-check all steps above
2. Make sure you've saved all changes
3. Restart your development server (`npm start`)
4. Clear browser cache and try again
5. Check the browser console for specific error messages
6. Verify your Firebase project is active and not in test mode (unless you want test mode)

## Quick Checklist

- [ ] Firebase Authentication enabled (Email/Password)
- [ ] Firestore Database created
- [ ] Firestore Security Rules published
- [ ] Firebase config file updated with correct credentials
- [ ] No console errors in browser
- [ ] Development server restarted after config changes



