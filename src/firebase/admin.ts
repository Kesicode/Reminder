import { initializeApp, getApps, getApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

let adminApp: any = null;
let adminAuth: any = null;
let adminDb: any = null;

export function getAdminApp() {
  if (adminApp) return adminApp;

  const projectId =
    process.env.FIREBASE_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;
  if (privateKey) {
    // Strip surrounding quotes if present (which happens if pasted with quotes on Vercel)
    if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
      privateKey = privateKey.slice(1, -1);
    }
    privateKey = privateKey.replace(/\\n/g, "\n");
  }

  console.log("[Firebase Admin] Initializing on demand...");
  console.log("[Firebase Admin] projectId:", projectId ? "✓ present" : "✗ MISSING");
  console.log("[Firebase Admin] clientEmail:", clientEmail ? "✓ present" : "✗ MISSING");
  console.log(
    "[Firebase Admin] privateKey:",
    privateKey ? `✓ present (starts with: ${privateKey.slice(0, 30)}...)` : "✗ MISSING"
  );

  if (getApps().length > 0) {
    console.log("[Firebase Admin] Reusing existing app instance");
    adminApp = getApp();
    return adminApp;
  }

  if (!projectId) {
    console.warn("[Firebase Admin] WARNING: FIREBASE_PROJECT_ID is not set.");
  }

  if (clientEmail && privateKey) {
    adminApp = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
    console.log("[Firebase Admin] Initialized with service account credentials ✓");
    return adminApp;
  }

  console.warn(
    "[Firebase Admin] WARNING: FIREBASE_CLIENT_EMAIL or FIREBASE_PRIVATE_KEY is missing. " +
      "Falling back to Application Default Credentials."
  );

  adminApp = initializeApp({ projectId });
  return adminApp;
}

export function getAdminAuth() {
  if (adminAuth) return adminAuth;
  adminAuth = getAuth(getAdminApp());
  return adminAuth;
}

export function getAdminDb() {
  if (adminDb) return adminDb;
  adminDb = getFirestore(getAdminApp());
  return adminDb;
}
