import { Bowlby_One } from "next/font/google";
import { getAllTableclothUsers } from "../lib/utils";
import UserTeamPreview from "../ui/team/userTeamPreview";

const bowlby_one = Bowlby_One({
  subsets: ["latin"],
  weight: "400",
});

export default function About() {
  const tableclothTeam = getAllTableclothUsers();
  return (
    <>
      <main className="my-12 md:my-20 lg:my-40">
        <article className="max-w-4xl md:m-auto">
          <div className="flex flex-col gap-1 items-center justify-center lg:gap-3">
            <h2
              className={`text-xl md:text-3xl lg:text-5xl ${bowlby_one.className}`}
              style={{ textShadow: "var(--dropShadow-hard)" }}
            >
              THE TABLECLOTH MAGAZINE
            </h2>
            <h2
              className={`text-xs md:text-lg ${bowlby_one.className}`}
              style={{ textShadow: "var(--dropShadow-hard)" }}
            >
              covering your game dev news
            </h2>
            <p className="my-12 mx-3 md:text-xl text-[var(--t-light-2)] max-w-2xl lg:max-w-3xl">
              short paragraph about why we chose to make the magazine and what
              we hope to do with it. Basically to introduce the magazine... It
              should take up roughly this amount of space. lorem ipsum set dolor
              sit amit. lorem ipsum set dolor sit amit lorem ipsum set dolor sit
              amit lorem ipsum set dolor sit amit lorem ipsum set dolor sit amit
              lorem ipsum set dolor sit amit lorem ipsum set dolor sit amit
              lorem ipsum set dolor sit am.
            </p>
          </div>
        </article>
        <div className="my-24 mx-3 flex gap-3 flex-col justify-center items-center md:my-40 lg:my-60">
          <h2 className="capitalize font-bold text-3xl md:text-5xl">
            Meet the <span className="text-[var(--table-1)]">team</span>
          </h2>
          <p className="text-[var(--t-light-2)] text-center md:text-xl">
            the team that gets writing done! Add more text here.
          </p>
        </div>
        <UserTeamPreview users={tableclothTeam} />
      </main>
    </>
  );
}
