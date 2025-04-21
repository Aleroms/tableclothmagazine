import EventsCalendar from "../ui/events/eventsCalendar";

export default function Events() {

  return (
    <>
      <h1 className="capitalize text-3xl md:text-4xl lg:text-6xl text-center font-bold mx-6 my-20">
        Events Calendar
      </h1>
      <EventsCalendar/>
    </>
  );
}
