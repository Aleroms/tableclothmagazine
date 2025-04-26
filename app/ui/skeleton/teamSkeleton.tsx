interface teamSkeleton {
  teamCount: number;
}

export default function TeamSkeleton({ teamCount }: teamSkeleton) {
  const team = Array.from({ length: teamCount }, (_, idx) => (
    <div
      key={idx}
      className="h-13 w-13 md:h-15 md:w-15 bg-[var(--t-dark-4)] rounded-lg shadow-md"
    />
  ));
  return (
    <div className="grid grid-cols-4 grid-rows-3 gap-6 gap-y-8 md:gap-y-6">
      {team}
    </div>
  );
}
