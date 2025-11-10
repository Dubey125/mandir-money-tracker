// backend/firebase.js
import admin from "firebase-admin";

// Initialize Firebase Admin using env or service account file
function initAdmin() {
  if (admin.apps.length) return admin.app();

  const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY, GOOGLE_APPLICATION_CREDENTIALS } = process.env;

  try {
    if (FIREBASE_PROJECT_ID && FIREBASE_CLIENT_EMAIL && FIREBASE_PRIVATE_KEY) {
      const privateKey = FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n");
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: FIREBASE_PROJECT_ID,
          clientEmail: FIREBASE_CLIENT_EMAIL,
          privateKey,
        }),
      });
    } else if (GOOGLE_APPLICATION_CREDENTIALS) {
      // Will use Application Default Credentials from JSON file path
      admin.initializeApp();
    } else {
      // Fallback to ADC (useful on GCP/Cloud Run etc.)
      admin.initializeApp();
    }
  } catch (e) {
    console.error("Firebase admin init error (non-fatal):", e?.message || e);
    // Do not throw; allow server to run without Firestore
  }
  return admin.app();
}

let db = null;
try {
  initAdmin();
  db = admin.firestore();
} catch (e) {
  console.warn("Firestore not available; continuing without DB");
  db = null;
}
export { db };
