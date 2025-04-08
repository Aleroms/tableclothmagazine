import { Event } from "@/app/lib/definitions";

interface EventCardProp {
  event: Event;
  styling: string;
}

export default function EventCard({ event, styling }: EventCardProp) {
  const startMonth = event.startDate.toLocaleString("default", {
    month: "long",
  });
  const endMonth = event.endDate?.toLocaleString("default", {
    month: "long",
  });
  const startDay = event.startDate.getDate();
  const endDay = event.endDate?.getDate();
  const { title, notes } = event;

  return (
    <div
      className={`p-4 h-60 w-full max-w-lg rounded-sm drop-shadow-[var(--dropShadow)] ${styling}`}
    >
      <h2 className="text-4xl">
        {startDay} {endDay ? `- ${endDay}` : ""}
      </h2>
      <h3 className="mb-12 text-lg font-light">
        {startMonth} {endMonth && endMonth !== startMonth ? `- ${endMonth}` : ""}
      </h3>
      <p className="font-medium capitalize text-lg">{title}</p>
      {notes && <p className="my-2 font-light">{notes}</p>}
    </div>
  );
}
