import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-x flex flex-col items-center py-32 text-center">
      <h1 className="text-6xl font-light text-ink">404</h1>
      <p className="mt-4 text-muted">The page you are looking for could not be found.</p>
      <Link href="/" className="btn-dark mt-8">Back To Home</Link>
    </div>
  );
}
