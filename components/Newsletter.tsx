"use client";

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email before sending
    const emailTrim = email.trim();
    if (!emailTrim || !emailTrim.includes("@")) {
      setStatus("error");
      setErrorMsg("Please enter a valid email address");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailTrim }),
      });

      const data = await response.json();
      console.log("Newsletter response:", { status: response.status, data });

      if (response.ok) {
        setStatus("success");
        setEmail("");
        setTimeout(() => {
          setStatus("idle");
          setErrorMsg("");
        }, 5000);
      } else {
        setStatus("error");
        setErrorMsg(data.error || "Failed to subscribe");
      }
    } catch (err) {
      console.error("Newsletter error:", err);
      setStatus("error");
      setErrorMsg("Connection error. Please try again.");
    }
  };

  return (
    <section className="container-x py-14">
      <div className="flex flex-col items-start justify-between gap-6 bg-charcoal px-8 py-10 text-white sm:px-12 md:flex-row md:items-center">
        {status === "success" ? (
          <div className="w-full text-center">
            <p className="text-lg font-light">✓ Thank you for subscribing!</p>
            <p className="mt-2 text-sm text-white/70">
              Check your email for the latest news and updates.
            </p>
          </div>
        ) : (
          <>
            <div>
              <h3 className="text-2xl font-light uppercase tracking-[0.08em]">
                Subscribe Us Now
              </h3>
              <p className="mt-2 text-sm text-white/70">
                Get latest news, updates and deals directly mailed to your inbox.
              </p>
            </div>
            <div className="w-full max-w-md">
              <form
                className="flex items-stretch"
                onSubmit={handleSubmit}
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address here"
                  className="w-full bg-white px-4 py-3 text-sm text-ink outline-none placeholder:text-muted"
                  disabled={status === "loading"}
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="btn bg-brand px-6 text-white hover:bg-brand-dark disabled:opacity-50"
                >
                  {status === "loading" ? "..." : "Subscribe"}
                </button>
              </form>
              {status === "error" && (
                <p className="mt-2 text-sm text-red-300">
                  {errorMsg}
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
