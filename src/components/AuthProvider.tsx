"use client";

import { useEffect, ReactNode } from "react";
import { onAuthStateChanged, getIdToken } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/config";
import { useAuthStore } from "@/store/useAuthStore";
import { UserProfile } from "@/types";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        setLoading(true);

        if (firebaseUser) {
          // Fetch custom claims to check superAdmin status
          const idTokenResult = await firebaseUser.getIdTokenResult();
          const superAdmin = idTokenResult.claims.superAdmin === true;

          // Verify email is verified or skip if not strictly enforced yet
          // Fetch additional profile data from Firestore
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const userSnapshot = await getDoc(userDocRef);

          let profileData: UserProfile;

          if (userSnapshot.exists()) {
            const data = userSnapshot.data();
            profileData = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || "",
              displayName: data.displayName || firebaseUser.displayName || "User",
              avatarUrl: data.avatarUrl || firebaseUser.photoURL || null,
              joinedDate: data.joinedDate || new Date().toISOString(),
              stats: data.stats,
              disabled: data.disabled || false,
              superAdmin,
            };
          } else {
            // Fallback profile if Firestore doc hasn't been created yet
            profileData = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || "",
              displayName: firebaseUser.displayName || "User",
              avatarUrl: firebaseUser.photoURL || null,
              joinedDate: new Date().toISOString(),
              stats: { total: 0, completed: 0, pending: 0, overdue: 0 },
              disabled: false,
              superAdmin,
            };
          }

          if (profileData.disabled) {
            // If user is disabled, sign them out
            await auth.signOut();
            await fetch("/api/auth/session", { method: "DELETE" });
            setUser(null);
            return;
          }

          setUser(profileData);

          // Get fresh ID token and set session cookie
          const idToken = await getIdToken(firebaseUser, true);
          await fetch("/api/auth/session", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ idToken }),
          });
        } else {
          setUser(null);
          // Delete session cookie
          await fetch("/api/auth/session", { method: "DELETE" });
        }
      } catch (error) {
        console.error("Auth state synchronization error:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [setUser, setLoading]);

  return <>{children}</>;
}
