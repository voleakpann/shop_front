"use client";

import { useState } from "react";

const inputClass =
  "w-full border border-line px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted focus:border-brand";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage({ type: "error", text: result.error || "Failed to send message" });
        return;
      }

      setMessage({ type: "success", text: result.message || "Thank you! We'll get back to you soon." });
      setFormData({ fullName: "", email: "", phone: "", subject: "", message: "" });
    } catch (error) {
      console.error("Form submission error:", error);
      setMessage({ type: "error", text: "An error occurred. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {message && (
        <div
          className={`p-4 text-sm rounded ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <input
          className={inputClass}
          placeholder="Your full name *"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
        <input
          className={inputClass}
          type="email"
          placeholder="Write your email here *"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <input
        className={inputClass}
        placeholder="Phone number"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
      />

      <input
        className={inputClass}
        placeholder="Write your subject here *"
        name="subject"
        value={formData.subject}
        onChange={handleChange}
        required
      />

      <textarea
        className={`${inputClass} min-h-32 resize-y`}
        placeholder="Write your message here *"
        name="message"
        value={formData.message}
        onChange={handleChange}
        required
      />

      <button
        type="submit"
        className="btn-dark disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={loading}
      >
        {loading ? "Sending..." : "Submit It"}
      </button>
    </form>
  );
}
