"use client";

const inputClass =
  "w-full border border-line px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted focus:border-brand";

export default function ContactForm() {
  return (
    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <input className={inputClass} placeholder="Your full name *" required />
        <input className={inputClass} type="email" placeholder="Write your email here *" required />
      </div>
      <input className={inputClass} placeholder="Phone number" />
      <input className={inputClass} placeholder="Write your subject here *" required />
      <textarea className={`${inputClass} min-h-32 resize-y`} placeholder="Write your message here *" required />
      <button type="submit" className="btn-dark">Submit It</button>
    </form>
  );
}
