import EventsDetails from "./eventsDetails";
import EventsSelector from "./eventsSelector";
import { getPastEvents } from "@/app/lib/database/query";

export default async function PastEventsCalendar() {
  const events = await getPastEvents();
  return (
    <div
      className="flex flex-col md:flex-row gap-6 md:items-start 
    justify-center mb-40 md:top-4"
    >
      <EventsSelector events={events} />
      <EventsDetails events={events} />
    </div>
  );
}
