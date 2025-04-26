import { getAllTableclothUsers } from "@/app/lib/utils";
import NavButton from "../button/navigationButton";
import UserCard from "../team/userCard";
// import TeamSkeleton from "../skeleton/teamSkeleton";

export default function AboutPreview() {
  const team = getAllTableclothUsers();
  return (
    <div className="flex flex-col gap-1 md:flex-row-reverse md:gap-15">
      <article className="block">
        <h2 className="capitalize font-bold text-2xl md:text-4xl mb-4">
          A magazine by indie devs, artists, & gamers -{" "}
          <span className="text-[var(--table-1)]">for you</span>
        </h2>
        <p className="text-[var(--t-dark-4)] mb-10">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat
          aliquam veritatis aspernatur quis exercitationem, repellendus eligendi
          numquam debitis, obcaecati nesciunt perferendis. Temporibus autem est
          deleniti possimus? Illum atque expedita at quam voluptatum similique.
          Numquam quae fugiat sapiente? Placeat voluptatibus eos perspiciatis
          quis provident molestiae, ea, quos dolorem iusto similique reiciendis
          consequuntur sit nihil expedita est. Delectus qui cumque dolorum.
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
