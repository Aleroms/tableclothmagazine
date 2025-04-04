import { carouselPlaceholder } from "./lib/placeholder-data";
import IssueCarousel from "./ui/issueCarousel";

export default function Home() {
  const sortedCarousel = carouselPlaceholder.sort(
    (a, b) => b.release_date.getTime() - a.release_date.getTime()
  );
  return (
    <>
      <main className="my-15">
        {/* Latest Releases  */}
        <IssueCarousel slides={sortedCarousel} />
      </main>
    </>
  );
}
