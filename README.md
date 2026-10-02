# Faster Shop Nigeria

Vendor-focused shopping for independent Nigerian fashion and lifestyle brands.

## Local setup

Requirements: Node.js 20.19+ and npm.

1. Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/).
2. Add a Web app in **Project settings** and copy its web configuration.
3. In **Authentication → Sign-in method**, enable **Email/Password** and **Google**. Add your local and deployed domains under **Authorized domains**.
4. Create a **Cloud Firestore** database in production mode.
5. Copy `.env.example` to `.env.local` and fill in the values from your Firebase web app configuration.
6. Install dependencies and start the development server:

	```sh
	npm install
	npm run dev
	```

Restart the dev server after changing `.env.local`. Until the Firebase values are present, the authentication screen stays available but sign-in actions are disabled.

## Firebase configuration

The client reads `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, and `VITE_FIREBASE_APP_ID`. These web-app settings identify the Firebase project; they are not server credentials. Never put a service-account key or other privileged secret in a `VITE_` variable.

The Firebase client is initialized in `src/lib/firebase.js`. Authentication and profile operations live in `src/features/auth/authService.js`, while `AuthContext` keeps the signed-in user and profile synchronized with the app.

## Vercel deployment

This app is ready for a standard Vercel static build:

```sh
npm run build
```

The repository includes a `vercel.json` file that rewrites unknown routes back to the SPA entry point and sets the output directory to `dist`.

Add the same `VITE_FIREBASE_*` variables to your Vercel project environment and deploy the repository normally. The app will initialize with Firebase at runtime without a custom server.

## Seed the catalog

To seed the app catalog with products for Rubian Girl, Kinging, and House of Cupid, set the corresponding vendor auth credentials in `.env.local` and run:

```sh
node scripts/seed-catalog.mjs
```

This script signs in as each approved vendor account and writes product entries to the `products` collection.

## Authentication and roles

Email/password registration, email/password sign-in, and Google popup sign-in are implemented. A first sign-in creates a profile; subsequent sign-ins preserve the existing role.

The initial Firestore schema is `users/{uid}`:

| Field | Type | Purpose |
| --- | --- | --- |
| `uid` | string | Firebase Authentication user ID; matches the document ID |
| `email` | string | Sign-in email |
| `displayName` | string | Account name |
| `photoURL` | string or null | Optional profile image |
| `role` | string | `buyer` or server-approved `vendor` |
| `createdAt` | timestamp | Profile creation time |
| `updatedAt` | timestamp | Last profile update time |

New client-created profiles are always `buyer`. The deployed `firestore.rules` allow a user to read only their own profile and update only their display name and photo; clients cannot change a role, email, or UID. Do not promote vendors by writing from the browser. Add vendor application/review flow through a trusted Cloud Function or other server using the Firebase Admin SDK, and validate the applicant and approval before assigning `vendor`.

`firebase.json` points the Firebase CLI at the Firestore rules and index files. Review and deploy rules with the Firebase CLI after linking your project, for example:

```sh
npx firebase-tools use YOUR_PROJECT_ID
npx firebase-tools deploy --only firestore:rules
```

The rules intentionally deny all other Firestore access. Future collections such as `vendors/{vendorId}`, `products/{productId}`, and `orders/{orderId}` need explicit ownership and access rules before the app uses them. Keep order creation, vendor approval, and other privileged transitions behind trusted server logic.
