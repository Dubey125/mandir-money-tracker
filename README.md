# Vishwanath Mandir – Donations & Expenses Tracker

A full-stack app to collect donations via Razorpay (UPI-only), display recent donations, and track expenses. Data is stored in Firebase Firestore. The backend verifies payments through a Razorpay webhook before persisting.

## Features
- Home hero with Sanskrit shloka and image slider
- Donations via Razorpay Checkout with UPI App or UPI QR (no cards/phone prompts)
- Recent Donations page and public dashboard
- Admin: add expenses with description and image (base64 for now)
- Firestore-backed live data with local fallback

## Tech
- Frontend: React + Vite, Tailwind, React Router, Firebase SDK
- Backend: Node/Express, Razorpay SDK, Firebase Admin, Webhooks

## Folder structure
- `src/` – React app
- `backend/` – Express server and webhook handler

## Setup

1) Install dependencies (run in root and backend):
- npm install
- cd backend; npm install

2) Environment variables

Frontend `.env` (see `.env.example`):
- VITE_RAZORPAY_KEY_ID=rzp_test_xxx
- VITE_API_BASE=http://localhost:5000

Backend `.env` (see `backend/.env.example`):
- PORT=5000
- RAZORPAY_KEY_ID=rzp_test_xxx
- RAZORPAY_KEY_SECRET=xxxxx
- RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
- FIREBASE_PROJECT_ID=your-project-id
- FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project-id.iam.gserviceaccount.com
- FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

Note: Keep the newline escapes (\n) in `FIREBASE_PRIVATE_KEY`.

3) Run locally
- In one terminal: npm run dev (frontend)
- In another terminal: cd backend; npm start (backend)

Open http://localhost:5173 and ensure backend health at http://localhost:5000/health.

## Deploy

You can deploy the frontend and backend separately. Make sure the frontend’s `VITE_API_BASE` points to your backend URL.

- Frontend (Vercel/Netlify):
	- Build command: `npm run build`
	- Output: `dist`
	- Environment:
		- `VITE_RAZORPAY_KEY_ID`
		- `VITE_API_BASE` → your backend URL (HTTPS)

- Backend (Render/Railway/VM):
	- Start command: `npm start` (in `backend` directory)
	- Environment:
		- `PORT`
		- `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`
		- `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` (or `GOOGLE_APPLICATION_CREDENTIALS`)
	- Expose HTTPS URL publicly so Razorpay can reach your webhook.

If you prefer to test webhooks locally, expose your backend:

```powershell
# In PowerShell, start a tunnel for port 5000
ngrok http 5000
```

Use the generated HTTPS URL in Razorpay webhook settings.

## Razorpay Webhook

To ensure only verified payments are saved, configure a Razorpay webhook:
- Dashboard → Settings → Webhooks → Add new
- URL: http(s)://<your-host>/razorpay-webhook
- Secret: RAZORPAY_WEBHOOK_SECRET (must match backend .env)
- Events: at least `payment.captured`

For local testing, expose the backend via a tunnel (e.g., `ngrok http 5000`) and use that HTTPS URL in the webhook.

## Firebase

The frontend reads/writes expenses and listens to donations/expenses from Firestore.
The backend writes verified donations on webhook. For production, secure your rules.

Example Firestore rules (public reads, restricted writes):
```
rules_version = '2';
service cloud.firestore {
	match /databases/{database}/documents {
		match /donations/{docId} {
			allow read: if true;       // public read
			allow write: if false;     // only via Admin SDK (backend)
		}
		match /expenses/{docId} {
			allow read: if true;       // public read
			allow write: if request.auth != null && request.auth.token.admin == true; // or restrict appropriately
		}
	}
}
```

### Deploy rules and indexes via Firebase CLI

Install the CLI and initialize once, then deploy rules and indexes using the included `firebase.json`:

```powershell
# Install (once)
npm install -g firebase-tools

# Login and select your project (once)
firebase login
firebase use <your-project-id>

# Deploy Firestore rules and indexes from this repo
firebase deploy --only firestore:rules,firestore:indexes
```

## Notes
- Checkout is locked to UPI-only (Intent on mobile, QR on desktop) to avoid phone/card prompts.
- Client doesn’t write donations to Firestore when cloud is enabled; it relies on the verified webhook to avoid duplicates.
- Expense images are stored as base64 in Firestore for now; consider moving to Firebase Storage for large/real deployments.

## Troubleshooting
- Payment could not start: Ensure backend is running and RAZORPAY_* envs are set; check /health
- Webhook not saving donations: Verify webhook secret and that your backend is publicly reachable
- Firestore not loading: Check Firebase env vars and that Firestore is enabled in your project
