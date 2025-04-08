interface eventsProp {
  count: number;
}
export default function UpcomingEventsSkeleton({ count }: eventsProp) {
  const eventsPlaceholder = Array.from({ length: count }, (_, idx) => (
    <div key={idx} className="h-60 w-full max-w-lg rounded-sm bg-stone-400 drop-shadow-[var(--dropShadow)]"></div>
  ));
  return (
    <div className="flex flex-col md:flex-row gap-6 my-4">{eventsPlaceholder}</div>
  );
}
