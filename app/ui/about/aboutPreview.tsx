import { getTableclothTeam } from "@/app/lib/database/query";
import NavButton from "../button/navigationButton";
import UserCard from "../team/userCard";
// import TeamSkeleton from "../skeleton/teamSkeleton";

export default async function AboutPreview() {
  const team = await getTableclothTeam();
  return (
    <div className="flex flex-col gap-1 md:flex-row-reverse md:gap-15">
      <article className="block">
        <h2 className="capitalize font-bold text-2xl md:text-4xl mb-4">
          A magazine by indie devs, artists, & gamers -{" "}
          <span className="text-[var(--table-1)]">for you</span>
        </h2>
        <p className="text-[var(--t-dark-4)] mb-10">
          The Tablecloth is a magazine created by alumni and members of the
          Video Game Development Club @ UCI. Our goal is to create and nurture
          community between current students and alumni by sharing each
          other&apos;s work. The magazine focues on a variety of game
          development topics, including interviews, post-mortems, opinion
          pieces, and more. Thank you for reading and supporting our work.
        </p>
        <NavButton
          href="/about"
          className="mt-2 border-1 border-solid border-stone-400 dark:bg-[var(--foreground)]  transition hover:bg-stone-100 focus:border-black text-stone-700"
        >
          Our Team
        </NavButton>
      </article>
      <div className="my-12 px-3 shrink-0 grid grid-cols-4 gap-3">
        {/* <TeamSkeleton teamCount={12} /> */}
        {team.map((user) => (
          <UserCard user={user} key={user.id} />
        ))}
      </div>
    </div>
  );
}
