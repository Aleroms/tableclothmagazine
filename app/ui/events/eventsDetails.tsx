import { Event } from "@/app/lib/definitions";
import { JSX } from "react";
import EventsCard from "./eventsCard";

interface EventsDetailsProps {
  events: Event[];
}


// export interface Event {
//   id: string;
//   startDate: Date;
//   endDate?: Date;
//   title: string;
//   notes?: string;
//   externalLink?: string;
// }

export default function EventsDetails({ events }: EventsDetailsProps) {
  const createEventBody = () => {
    let currentYear: number | null = null;
    let currentMonthIdx: number | null = null;
    const items: JSX.Element[] = [];

    for (const event of events) {
      const date = event.startDate;
      const year = date.getFullYear();
      const monthName = date.toLocaleString("default", { month: "long" });
      const monthIdx = date.getMonth();

      // event divider i.e March 2025 ---
      if (year !== currentYear) {
        currentYear = year;
        currentMonthIdx = monthIdx;
        items.push(
          <div
            key={`month-${year}-${monthIdx}`}
            id={`month-${year}-${monthIdx}`}
            className="relative flex py-5 items-center scroll-mt-10"
          >
            <h2 className="flex-shrink mr-3 font-bold text-xl">{`${monthName} ${currentYear}`}</h2>
            <div className="flex-grow border-t-2 border-[var(--t-dark-4)]" />
          </div>
        );
        continue;
      }

      // the content of the current event
      items.push(<EventsCard key={event.id} event={event} />);

      // event divider i.e March 2025 ---
      if (monthIdx !== currentMonthIdx) {
        currentMonthIdx = monthIdx;
        items.push(
          <div
            key={`month-${year}-${monthIdx}`}
            id={`month-${year}-${monthIdx}`}
            className="relative flex py-5 items-center scroll-mt-10"
          >
            <h2 className="flex-shrink mr-3 font-bold text-xl">{`${monthName} ${currentYear}`}</h2>
            <div className="flex-grow border-t-2 border-[var(--t-dark-4)]" />
          </div>
        );
      }
    }

    return items;
  };
  return (
    <main className="flex flex-col p-4 bg-[var(--t-dark-3)] md:min-w-lg lg:min-w-2xl rounded-sm">
      {createEventBody()}
    </main>
  );
}
