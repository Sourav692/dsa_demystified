import { Breadcrumbs } from "@/components/shell";
import { SavedLibrary } from "@/components/saved-library";
export const metadata = { title: "Saved items" };
export default function Page() {
  return (
    <main id="main-content" className="container">
      <div className="reading-content">
        <div className="page-heading">
          <Breadcrumbs items={[{ title: "Saved" }]} />
          <h1>Your next steps, kept close.</h1>
          <p>
            Return to the lessons, approaches, and problems you want to
            remember.
          </p>
        </div>
        <SavedLibrary />
      </div>
    </main>
  );
}
