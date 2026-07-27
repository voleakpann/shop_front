"use client";

// Decorative only — the blog has no real backend/content system yet, so this
// form doesn't post anywhere. See components/CommentForm.tsx for the real,
// backend-wired version used on product pages.
export default function BlogCommentForm() {
  return (
    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
      <p className="text-sm text-muted">
        Your email address will not be published. Required fields are marked *
      </p>
      <textarea
        className="min-h-28 w-full resize-y border border-line px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted focus:border-brand"
        placeholder="Write your comment here *"
        required
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <input
          className="w-full border border-line px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted focus:border-brand"
          placeholder="Write your name here *"
          required
        />
        <input
          className="w-full border border-line px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted focus:border-brand"
          type="email"
          placeholder="Write your email here *"
          required
        />
      </div>
      <label className="flex items-center gap-2 text-xs text-muted">
        <input type="checkbox" className="accent-brand" />
        Save my name, email, and website in this browser for the next time I comment.
      </label>
      <button type="submit" className="btn-dark">Post Comment</button>
    </form>
  );
}
