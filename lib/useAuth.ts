"use client";

import { useEffect, useState } from "react";

const JWT_STORAGE_KEY = "ministore_jwt";

/** True when a non-expired backend JWT (from Google login) is present. */
function isValid(token: string | null): boolean {
  if (!token) return false;
  try {
    const payload = JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
    );
    return !(payload.exp && payload.exp * 1000 < Date.now());
  } catch {
    return false;
  }
}

/**
 * Client hook: is the visitor signed in with a valid backend JWT?
 * `ready` is false until the localStorage check runs (avoids a UI flash /
 * hydration mismatch).
 */
export function useAuth() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const check = () => setLoggedIn(isValid(localStorage.getItem(JWT_STORAGE_KEY)));
    check();
    setReady(true);
    // Keep in sync across tabs / after login in another view.
    window.addEventListener("storage", check);
    return () => window.removeEventListener("storage", check);
  }, []);

  return { loggedIn, ready };
}
