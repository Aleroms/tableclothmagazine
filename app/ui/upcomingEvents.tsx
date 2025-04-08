import { Event } from "../lib/definitions";
import EventCard from "./card/eventCard";

interface EventsProp {
  events: Event[];
}

export default function UpcomingEvents({ events }: EventsProp) {
  return (
    <div className="flex flex-col md:flex-row gap-6 my-8">
      {events.map((item, idx) =>
        // highlight the first (latest) event
        idx === 0 ? (
          <EventCard key={item.id} event={item} styling="bg-blue-500 text-white" />
        ) : (
          <EventCard key={item.id} event={item} styling="bg-blue-100 text-[var(--t-dark-3)] " />
        )
      )}
    </div>
  );
}
