import { getPastIssueEvents } from "@/app/lib/utils";
import EventsDetails from "./eventsDetails";
import EventsSelector from "./eventsSelector";

export default function PastEventsCalendar() {
  const events = getPastIssueEvents()
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
