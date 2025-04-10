import IssueOverview from "../ui/issues/issueOverview";

export default function Issues() {
  return (
    <main className="mt-20 mb-40">
      <div className="max-w-xl m-auto p-4 lg:text-center">
        <h1 className="capitalize mb-7 font-medium text-5xl md:text-6xl">
          Issues
        </h1>
        <p className="md:mb-30">
          text about our issues and maybe a few words about how often we provide
          issues (when they can expect another issue)
        </p>
      </div>
      <IssueOverview />
    </main>
  );
}
