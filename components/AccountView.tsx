"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { AUTH_BASE_URL } from "@/lib/api";

// Multi-colour Google "G" logo for the sign-in button.
function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-5 w-5">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

const inputClass =
  "w-full border border-line px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted focus:border-brand";
const labelClass = "block text-sm text-ink";

// Mock auth stored in the browser — no backend.
const STORAGE_KEY = "ministore_user";

// JWT issued by auth-service after a successful Google login.
const JWT_STORAGE_KEY = "ministore_jwt";

type BackendUser = { email?: string; name?: string; picture?: string };

/** Decodes a JWT payload without verifying the signature — display only. */
function decodeJwt(token: string): (BackendUser & { exp?: number }) | null {
  try {
    const payload = token.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const claims = JSON.parse(json);
    return { email: claims.sub, name: claims.name, picture: claims.picture, exp: claims.exp };
  } catch {
    return null;
  }
}

type Mode = "login" | "register";

export default function AccountView() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<string | null>(null);
  const [backendUser, setBackendUser] = useState<BackendUser | null>(null);
  const [ready, setReady] = useState(false);
  const [mode, setMode] = useState<Mode>("login");

  // form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  // Load any saved session on first render.
  useEffect(() => {
    setUser(localStorage.getItem(STORAGE_KEY));

    // auth-service redirects here with ?token=<JWT> after a Google login.
    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl) {
      localStorage.setItem(JWT_STORAGE_KEY, tokenFromUrl);
      setBackendUser(decodeJwt(tokenFromUrl));
      router.replace("/account");
    } else {
      const stored = localStorage.getItem(JWT_STORAGE_KEY);
      const claims = stored ? decodeJwt(stored) : null;
      if (claims?.exp && claims.exp * 1000 < Date.now()) {
        localStorage.removeItem(JWT_STORAGE_KEY);
      } else {
        setBackendUser(claims);
      }
    }

    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setConfirm("");
    setError("");
  };

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }
    localStorage.setItem(STORAGE_KEY, email);
    setUser(email);
    clearForm();
  };

  const register = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all required fields.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    localStorage.setItem(STORAGE_KEY, email);
    setUser(email);
    clearForm();
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(JWT_STORAGE_KEY);
    setUser(null);
    setBackendUser(null);
  };

  const switchMode = (m: Mode) => {
    setMode(m);
    clearForm();
  };

  // Reusable "Continue with Google" button — logs in via the backend
  // auth-service (Spring). It runs the Google OAuth flow and redirects back to
  // /account?token=<JWT>, which the effect above stores as `ministore_jwt`.
  // That JWT is what product/order-service accept, so checkout works.
  const googleButton = (
    <a
      href={`${AUTH_BASE_URL}/oauth2/authorization/google`}
      className="flex w-full items-center justify-center gap-3 rounded-full border border-line bg-white px-4 py-3 text-sm text-ink transition-colors hover:bg-band"
    >
      <GoogleIcon />
      Continue with Google
    </a>
  );

  // Avoid a flash of the wrong state before session + localStorage are read.
  if (status === "loading" || !ready) return null;

  // ---- Logged in via the backend (auth-service issued JWT) ----
  if (backendUser) {
    return (
      <div className="mx-auto max-w-md text-center">
        <h2 className="text-2xl font-light uppercase tracking-[0.06em] text-ink">My Account</h2>
        {backendUser.picture && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={backendUser.picture}
            alt={backendUser.name ?? "User"}
            className="mx-auto mt-6 h-16 w-16 rounded-full"
          />
        )}
        <p className="mt-4 text-sm text-muted">
          Signed in as{" "}
          <span className="text-brand">{backendUser.name ?? backendUser.email}</span>.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/shop" className="btn-dark">Continue Shopping</Link>
          <button onClick={logout} className="btn-dark">Logout</button>
        </div>
      </div>
    );
  }

  // ---- Logged in (NextAuth session takes priority over the mock login) ----
  if (session?.user) {
    return (
      <div className="mx-auto max-w-md text-center">
        <h2 className="text-2xl font-light uppercase tracking-[0.06em] text-ink">My Account</h2>
        {session.user.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={session.user.image}
            alt={session.user.name ?? "User"}
            className="mx-auto mt-6 h-16 w-16 rounded-full"
          />
        )}
        <p className="mt-4 text-sm text-muted">
          Signed in as{" "}
          <span className="text-brand">{session.user.name ?? session.user.email}</span>.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/shop" className="btn-dark">Continue Shopping</Link>
          <button onClick={() => signOut()} className="btn-dark">Logout</button>
        </div>
      </div>
    );
  }

  // ---- Logged in via the browser mock login ----
  if (user) {
    return (
      <div className="mx-auto max-w-md text-center">
        <h2 className="text-2xl font-light uppercase tracking-[0.06em] text-ink">My Account</h2>
        <p className="mt-4 text-sm text-muted">
          You are logged in as <span className="text-brand">{user}</span>.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/shop" className="btn-dark">Continue Shopping</Link>
          <button onClick={logout} className="btn-dark">Logout</button>
        </div>
      </div>
    );
  }

  // ---- Register ----
  if (mode === "register") {
    return (
      <div className="mx-auto max-w-md">
        <h2 className="text-2xl font-light uppercase tracking-[0.06em] text-ink">Register</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Create your account to check out faster and track your orders.
        </p>

        <div className="mt-8">{googleButton}</div>
        <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.12em] text-muted">
          <span className="h-px flex-1 bg-line" /> or <span className="h-px flex-1 bg-line" />
        </div>

        <form className="space-y-4" onSubmit={register}>
          <div>
            <label className={labelClass} htmlFor="name">Full name *</label>
            <input
              id="name"
              className={`${inputClass} mt-2`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              required
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="remail">Email address *</label>
            <input
              id="remail"
              type="email"
              className={`${inputClass} mt-2`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="rpassword">Password *</label>
            <input
              id="rpassword"
              type="password"
              className={`${inputClass} mt-2`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              required
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="confirm">Confirm password *</label>
            <input
              id="confirm"
              type="password"
              className={`${inputClass} mt-2`}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Re-enter your password"
              required
            />
          </div>

          {error && <p className="text-sm text-brand">{error}</p>}

          <button type="submit" className="btn-dark w-full">Create Account</button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Already have an account?{" "}
          <button type="button" onClick={() => switchMode("login")} className="text-brand hover:underline">
            Login
          </button>
        </p>
      </div>
    );
  }

  // ---- Login ----
  return (
    <div className="mx-auto max-w-md">
      <h2 className="text-2xl font-light uppercase tracking-[0.06em] text-ink">Login</h2>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        Welcome back. Please enter your details to sign in.
      </p>

      <div className="mt-8">{googleButton}</div>
      <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.12em] text-muted">
        <span className="h-px flex-1 bg-line" /> or <span className="h-px flex-1 bg-line" />
      </div>

      <form className="space-y-4" onSubmit={login}>
        <div>
          <label className={labelClass} htmlFor="email">Email address *</label>
          <input
            id="email"
            type="email"
            className={`${inputClass} mt-2`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="password">Password *</label>
          <input
            id="password"
            type="password"
            className={`${inputClass} mt-2`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        {error && <p className="text-sm text-brand">{error}</p>}

        <div className="flex items-center justify-between text-sm text-muted">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="h-4 w-4 accent-brand" />
            Remember me
          </label>
          <a href="#" className="hover:text-brand">Lost your password?</a>
        </div>

        <button type="submit" className="btn-dark w-full">Login</button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Don&apos;t have an account?{" "}
        <button type="button" onClick={() => switchMode("register")} className="text-brand hover:underline">
          Register
        </button>
      </p>
    </div>
  );
}
