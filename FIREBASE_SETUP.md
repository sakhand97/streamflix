# Firebase Setup Instructions

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard to create your project

## Step 2: Enable Authentication

1. In your Firebase project, go to **Authentication** in the left sidebar
2. Click **Get Started**
3. Enable **Email/Password** authentication:
   - Click on "Email/Password"
   - Toggle "Enable" to ON
   - Click "Save"

## Step 3: Create Firestore Database

1. Go to **Firestore Database** in the left sidebar
2. Click **Create database**
3. Choose **Production mode** (or Test mode for development)
4. Select a location for your database
5. Click **Enable**

## Step 4: Set up Firestore Security Rules

Go to **Firestore Database** > **Rules** and update the rules to:

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

Click **Publish** to save the rules.

## Step 5: Get Firebase Configuration

1. Go to **Project Settings** (gear icon next to Project Overview)
2. Scroll down to "Your apps" section
3. Click the **Web** icon (`</>`)
4. Register your app with a nickname (e.g., "StreamFlix Web")
5. Copy the Firebase configuration object

## Step 6: Update Firebase Config in Your App

Open `src/firebase/config.js` and replace the placeholder values with your Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyAFHzXWyms3DrBUIaecTceEogxgmTOrb80",
  authDomain: "streamflix-6cfbd.firebaseapp.com",
  projectId: "streamflix-6cfbd",
  storageBucket: "streamflix-6cfbd.firebasestorage.app",
  messagingSenderId: "659088495466",
  appId: "1:659088495466:web:f7ba213dd703b19a824b13",
  measurementId: "G-RX3MWVP591"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
```

## Step 7: Test Your Setup

1. Run `npm start` to start your app
2. Try signing up with a new account
3. Add a movie to your wishlist
4. Check Firestore Database to see if the data is saved correctly

## Troubleshooting

- **Authentication not working**: Make sure Email/Password is enabled in Firebase Console
- **Wishlist not saving**: Check Firestore security rules and ensure the user is authenticated
- **Config errors**: Verify all Firebase config values are correct and match your project

Your app is now ready to use Firebase for authentication and wishlist storage!



