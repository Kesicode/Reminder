import { cookies } from "next/headers";
import { adminAuth } from "@/firebase/admin";

export interface SessionPayload {
  uid: string;
  email: string;
  role?: string;
  superAdmin?: boolean;
}

const SESSION_COOKIE_NAME = "remindsync_session";
// Session expires in 5 days
const EXPIRES_IN = 60 * 60 * 24 * 5 * 1000; 

export async function createSession(idToken: string) {
  try {
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: EXPIRES_IN,
    });

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, sessionCookie, {
      maxAge: EXPIRES_IN / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });

    return true;
  } catch (error) {
    console.error("Error creating session cookie:", error);
    return false;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionCookie) {
      return null;
    }

    const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
    
    return {
      uid: decodedToken.uid,
      email: decodedToken.email || "",
      superAdmin: decodedToken.superAdmin === true,
    };
  } catch (error) {
    console.error("Error verifying session cookie:", error);
    return null;
  }
}

export async function deleteSession() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
    return true;
  } catch (error) {
    console.error("Error deleting session cookie:", error);
    return false;
  }
}
