import { Metadata } from "next";
import IssueOverview from "../ui/issues/issueOverview";

export const metadata: Metadata = {
  title: "Issues",
};
export default function Issues() {
  return (
    <main className="mt-10 mb-20">
      <div className="max-w-xl m-auto p-4 lg:text-center">
        <h1 className="capitalize mb-7 font-medium text-5xl md:text-6xl">
          Issues
        </h1>
        <p className="md:mb-5">
          The Tablecloth releases issues on a quarterly basis. Read all of our
          released issues below!
        </p>
      </div>
      <IssueOverview />
    </main>
  );
}
