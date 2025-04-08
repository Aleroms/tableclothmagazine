import {
  carouselPlaceholder,
  eventsPlaceholder,
  showcasePlaceholder,
} from "./lib/placeholder-data";
import ArticlePreview from "./ui/articlePreview";
import IssueCarousel from "./ui/carousel/issueCarousel";
import NavButton from "./ui/button/navigationButton";
import InfiniteCarousel from "./ui/carousel/infiniteCarousel";
import AboutPreview from "./ui/about/aboutPreview";
import UpcomingEvents from "./ui/upcomingEvents";
import { latestThreeEvents } from "./lib/utils";

export default function Home() {
  const sortedCarousel = carouselPlaceholder.sort(
    (a, b) => b.release_date.getTime() - a.release_date.getTime()
  );

  const latestThree = latestThreeEvents(eventsPlaceholder);

  return (
    <>
      <main className="mt-15 mb-40">
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
          <h2 className="capitalize font-bold text-2xl md:text-4xl">
            Showcase
          </h2>
          <InfiniteCarousel items={showcasePlaceholder} />
          <div className="my-80">
            <AboutPreview />
          </div>
        </div>
        {/* Upcoming Events  */}
        <div className="my-12 md:my-30 mx-4 md:max-w-4xl lg:mx-auto">
          <h2 className="font-bold capitalize text-2xl md:text-4xl">
            Upcoming events
          </h2>
          <UpcomingEvents events={latestThree} />
        </div>
        <div className="flex justify-center m-10">
          <NavButton
            href="/events/"
            className="mt-2 border-1 border-solid border-stone-400 bg-[var(--foreground)]  transition hover:bg-stone-100 focus:border-black text-stone-700"
          >
            Show All Events
          </NavButton>
        </div>
      </main>
    </>
  );
}
