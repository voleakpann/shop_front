"use client";

import { useState } from "react";
import { AUTH_BASE_URL, postComment } from "@/lib/api";
import { useAuth } from "@/lib/useAuth";

const inputClass =
  "w-full border border-line px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted focus:border-brand";

export default function CommentForm({
  slug,
  parentId,
  onPosted,
  onCancel,
}: {
  slug: string;
  parentId?: number;
  onPosted: () => void;
  onCancel?: () => void;
}) {
  const { loggedIn, ready } = useAuth();
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setSubmitting(true);
    setError("");
    const result = await postComment(slug, content.trim(), parentId);
    setSubmitting(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }
    setContent("");
    onPosted();
  };

  if (!ready) return null;

  if (!loggedIn) {
    const loginUrl = `${AUTH_BASE_URL}/oauth2/authorization/google`;
    return (
      <p className="text-sm text-muted">
        <a href={loginUrl} className="text-brand hover:underline">Sign in with Google</a>{" "}
        to {parentId ? "reply" : "leave a comment"}.
      </p>
    );
  }

  return (
    <form className="space-y-4" onSubmit={submit}>
      <textarea
        className={`${inputClass} min-h-28 resize-y`}
        placeholder={parentId ? "Write your reply here *" : "Write your comment here *"}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      {error && <p className="text-sm text-brand">{error}</p>}
      <div className="flex items-center gap-4">
        <button type="submit" className="btn-dark" disabled={submitting}>
          {submitting ? "Posting…" : parentId ? "Post Reply" : "Post Comment"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="text-xs text-muted hover:text-ink">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
