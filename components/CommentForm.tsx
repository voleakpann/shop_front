"use client";

import { useEffect, useRef, useState } from "react";
import { postComment } from "@/lib/api";
import { useAuth } from "@/lib/useAuth";
import LoginModal from "./LoginModal";

const inputClass =
  "w-full border border-line px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted focus:border-brand";

export default function CommentForm({
  slug,
  parentId,
  initialContent,
  onPosted,
  onCancel,
}: {
  slug: string;
  parentId?: number;
  initialContent?: string;
  onPosted: () => void;
  onCancel?: () => void;
}) {
  const { loggedIn, ready } = useAuth();
  const [content, setContent] = useState(initialContent ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // When pre-filled with an "@mention", set cursor to the end so new text appends correctly
  useEffect(() => {
    if (textareaRef.current && initialContent) {
      const len = initialContent.length;
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.setSelectionRange(len, len);
          textareaRef.current.focus();
        }
      }, 0);
    }
  }, [initialContent]);

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // Ctrl+Enter or Cmd+Enter submits the form
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      submit(e as any);
    }
  };

  if (!ready) return null;

  if (!loggedIn) {
    return (
      <>
        <button
          onClick={() => setShowLoginModal(true)}
          className="text-sm text-brand hover:underline"
        >
          Sign in with Google
        </button>
        {" "}to {parentId ? "reply" : "leave a comment"}.
        <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      </>
    );
  }

  // Full-width reply form for nested replies (matches the flat list style)
  if (parentId) {
    return (
      <form className="space-y-2 mt-2" onSubmit={submit}>
        <textarea
          ref={textareaRef}
          className={`${inputClass} min-h-10 py-2`}
          placeholder="Write a reply..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          required
        />
        <div className="flex items-center gap-3">
          <button type="submit" className="btn-dark px-4 py-2 text-xs" disabled={submitting}>
            {submitting ? "…" : "REPLY"}
          </button>
          {onCancel && (
            <button type="button" onClick={onCancel} className="text-xs text-muted hover:text-ink">
              ×
            </button>
          )}
        </div>
      </form>
    );
  }

  // Full textarea for top-level comments
  return (
    <form className="space-y-4" onSubmit={submit}>
      <textarea
        ref={textareaRef}
        className={`${inputClass} min-h-28 resize-y`}
        placeholder="Write your comment here * (Ctrl+Enter to submit)"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        required
      />
      {error && <p className="text-sm text-brand">{error}</p>}
      <div className="flex items-center gap-4">
        <button type="submit" className="btn-dark" disabled={submitting}>
          {submitting ? "Posting…" : "Post Comment"}
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
