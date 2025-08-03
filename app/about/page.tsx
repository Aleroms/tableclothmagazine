import UserTeamPreview from "../ui/team/userTeamPreview";
import { Metadata } from "next";
import { getTableclothTeam } from "../lib/database/query";

export const metadata: Metadata = {
  title: "About",
  description: "The Tablecloth is created by talented volunteers.",
};

export default async function About() {
  const tableclothTeam = await getTableclothTeam();
  return (
    <>
      <main className="my-10 md:my-5 lg:my-10">
        <div className="my-3 mx-3 flex gap-3 flex-col justify-center items-center md:my-10 lg:my-15">
          <h2 className="capitalize font-bold text-3xl md:text-5xl">
            Meet the <span className="text-[var(--table-1)]">team</span>
          </h2>
          <p className="my-0 mx-10 md:text-xl text-[var(--t-light-2)] max-w-2xl lg:max-w-3xl text-center">
            The Tablecloth is created by talented volunteers. Get to know them
            and support their other work below!
          </p>
        </div>
        <UserTeamPreview users={tableclothTeam} />
      </main>
    </>
  );
}
