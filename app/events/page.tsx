import Image from "next/image";
import { getUpcomingCurrentIssueEvents } from "../lib/utils";
import NavButton from "../ui/button/navigationButton";
import EventsDetails from "../ui/events/eventsDetails";

export default function Events() {
  const events = getUpcomingCurrentIssueEvents();

  return (
    <div>
      <h1 className="capitalize text-3xl md:text-4xl lg:text-6xl text-center font-bold mx-6 my-20">
        Events Calendar
      </h1>

      {events.length === 0 ? (
        <div className="my-60 flex flex-col items-center justify-center">
          <Image
            src="/tableLogo/logo.svg"
            alt="tablecloth logo"
            width={150}
            height={150}
          />
          <p className="text-xl mb-6">Stay tuned for more events to come!!</p>
        </div>
      ) : (
        <div
          className="flex flex-col md:flex-row gap-6 md:items-start 
    justify-center mb-40 md:top-4"
        >
          <EventsDetails events={events} />
        </div>
      )}

      {/* Past Events  */}
      <div className="mb-20 text-center max-w-xl m-auto">
        <h2 className="capitalize text-3xl md:text-4xl lg:text-6xl font-bold mx-6">
          Past Events
        </h2>
        <p className="text-xl mb-6 ">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. In distinctio
          saepe deserunt necessitatibus. Odio corrupti deleniti minima, et
          perspiciatis libero!
        </p>
        <NavButton
          href="/events/past"
          className="mt-2 border-1 border-solid border-stone-400 bg-[var(--foreground)]  transition hover:bg-stone-100 focus:border-black text-stone-700"
        >
          Archived Events
        </NavButton>
      </div>
    </div>
  );
}
