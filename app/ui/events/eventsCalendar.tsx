import { getAllEvents } from "@/app/lib/utils";
import EventsDetails from "./eventsDetails";
import EventsSelector from "./eventsSelector";

export default function EventsCalendar() {
  const events = getAllEvents();
  return (
    <div className="flex flex-col md:flex-row gap-6 md:items-start md:max-w-lg md:m-auto">
      <EventsSelector events={events} />
      <EventsDetails events={events} />
    </div>
  );
}
