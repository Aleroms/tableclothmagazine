import {
  carouselPlaceholder,
  showcasePlaceholder,
} from "./lib/placeholder-data";
import ArticlePreview from "./ui/articlePreview";
import IssueCarousel from "./ui/carousel/issueCarousel";
import NavButton from "./ui/button/navigationButton";
import InfiniteCarousel from "./ui/carousel/infiniteCarousel";
import AboutPreview from "./ui/about/aboutPreview";

export default function Home() {
  const sortedCarousel = carouselPlaceholder.sort(
    (a, b) => b.release_date.getTime() - a.release_date.getTime()
  );

  return (
    <>
      <main className="my-15">
        {/* Latest Releases  */}
        <IssueCarousel slides={sortedCarousel} />
        {/* Article preview  */}
        <ArticlePreview />
        <div className="flex justify-center m-10">
          <NavButton
            href="/issues/"
            className="border-1 border-solid border-stone-400 transition hover:bg-stone-100/5 focus:border-white text-stone-400"
          >
            View More
          </NavButton>
        </div>
        {/* Showcase + About  */}
        <div className="mx-4 my-80 max-w-5xl lg:mx-auto">
          <h2 className="capitalize font-bold text-2xl md:text-4xl">Showcase</h2>
          <InfiniteCarousel items={showcasePlaceholder} />
          <div className="my-80">
            <AboutPreview />
          </div>
        </div>
      </main>
    </>
  );
}
