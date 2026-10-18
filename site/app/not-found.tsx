import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main-content" className="container not-found">
      <h1>Let’s find your way back.</h1>
      <p>This lesson is not available on the website yet.</p>
      <Link className="button primary" href="/foundations/trees/">
        Explore the Trees learning path
      </Link>
    </main>
  );
}
