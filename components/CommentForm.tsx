"use client";

const inputClass =
  "w-full border border-line px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted focus:border-brand";

export default function CommentForm() {
  return (
    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
      <p className="text-sm text-muted">
        Your email address will not be published. Required fields are marked *
      </p>
      <textarea className={`${inputClass} min-h-28 resize-y`} placeholder="Write your comment here *" required />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <input className={inputClass} placeholder="Write your name here *" required />
        <input className={inputClass} type="email" placeholder="Write your email here *" required />
      </div>
      <label className="flex items-center gap-2 text-xs text-muted">
        <input type="checkbox" className="accent-brand" />
        Save my name, email, and website in this browser for the next time I comment.
      </label>
      <button type="submit" className="btn-dark">Post Comment</button>
    </form>
  );
}
