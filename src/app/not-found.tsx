import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center px-6 pt-24">
      <div className="glass-card max-w-xl p-10 text-center">
        <p className="pink-label mb-4">404</p>
        <h1 className="mb-4 font-serif text-4xl text-foreground">Page not found</h1>
        <p className="mb-8 text-muted-foreground">
          The page you&apos;re looking for may have moved during the site migration.
        </p>
        <Link href="/" className="btn-primary">
          Back to Home
        </Link>
      </div>
    </section>
  );
}
