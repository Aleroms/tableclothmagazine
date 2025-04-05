import { carouselPlaceholder } from "./lib/placeholder-data";
import ArticlePreview from "./ui/articlePreview";
import IssueCarousel from "./ui/issueCarousel";
import NavButton from "./ui/button/navigationButton";

export default function Home() {
  const sortedCarousel = carouselPlaceholder.sort(
    (a, b) => b.release_date.getTime() - a.release_date.getTime()
  );

  return (
    <>
      <main className="my-15">
        {/* Latest Releases  */}
        <IssueCarousel slides={sortedCarousel} />
        <ArticlePreview />
        <div className="flex justify-center m-10">
          <NavButton
            href="/issues/"
            className="border-1 border-solid border-stone-400 transition hover:bg-stone-100/5 focus:border-white text-stone-400"
          >
            View More
          </NavButton>
        </div>
      </main>
    </>
  );
}
