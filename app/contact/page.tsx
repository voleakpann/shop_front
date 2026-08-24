import PageHeader from "@/components/PageHeader";
import ContactForm from "@/components/ContactForm";
import Ph from "@/components/Ph";

export const metadata = { title: "Contact — MiniStore" };

function InfoBlock({ title }: { title: string }) {
  return (
    <div>
      <h4 className="text-sm font-medium uppercase tracking-[0.1em] text-ink">{title}</h4>
      <div className="mt-3 space-y-1 text-sm leading-relaxed text-muted">
        <p>Teuk Thla, Phnom Penh, Cambodia</p>
        <p>0964 040 006</p>
        <p className="text-brand">pvoleak55@gmail.com</p>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <>
      <PageHeader title="Contact" crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]} />

      <section className="container-x py-14">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Contact info */}
          <div>
            <h2 className="text-2xl font-light uppercase tracking-[0.06em] text-ink">Contact Info</h2>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
              Have a question about an order, a product, or anything else?
              Reach out and our team will get back to you shortly.
            </p>
            <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
              <InfoBlock title="Office" />
              <InfoBlock title="Management" />
            </div>
          </div>

          {/* Form */}
          <div>
            <h2 className="text-2xl font-light uppercase tracking-[0.06em] text-ink">Any Questions?</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Use the form below to get in touch with us.
            </p>
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Map placeholder */}
      <section className="container-x pb-16">
        <Ph glyph="photo" alt="Store location map" className="aspect-[21/9] w-full" />
      </section>
    </>
  );
}
