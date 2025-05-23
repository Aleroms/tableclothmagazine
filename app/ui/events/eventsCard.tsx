import { Event } from "@/app/lib/definitions";
import { ExternalLink } from "lucide-react";

interface EventsCardProps {
  event: Event;
}


export default function EventsCard({ event }: EventsCardProps) {
  const { startDate, endDate, duration, title, externalLink, notes } = event;

  const startDayOfWeekName = startDate.toLocaleString("default", {
    weekday: "short",
  });
  const startDateNum = startDate.getDate();

  const endDayOfWeekName = endDate?.toLocaleString("default", {
    weekday: "short",
  });

  const endDateNum = endDate?.getDate();

  return (
    <div className="mx-2 my-4 lg:my-8 grid grid-2 lg:grid-cols-[33%_66%]">
      {/* displays the start - endDate?  */}
      <div>
        <h2 className="uppercase font-light text-xl md:text-2xl lg:text-3xl">
          {endDate
            ? `${startDayOfWeekName} - ${endDayOfWeekName}`
            : startDayOfWeekName}
        </h2>
        <h3 className="text-lg font-medium text-[var(--t-dark-4)]">
          {endDate ? `${startDateNum} - ${endDateNum}` : startDateNum}
        </h3>
      </div>

      {/* displays the event information  */}
      <div>
        <div className="flex flex-col md:flex-row gap-2 md:gap-4">
          <p className="text-[var(--t-dark-4)] mr-4 md:text-lg mt-4 md:mr-0 md:mt-0">
            {duration ? duration : "All Day"}
          </p>
          <div className="flex items-center">
            <p className="md:text-lg">{title}</p>
            {externalLink && (
              <a href={externalLink} className="ml-4">
                <ExternalLink size={22}/>
              </a>
            )}
          </div>
        </div>
        {notes && <p className="text-[var(--t-dark-4)]">{notes}</p>}
      </div>
    </div>
  );
}
