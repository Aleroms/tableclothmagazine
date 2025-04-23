import { Event } from "@/app/lib/definitions";
import { JSX } from "react";
import Link from "next/link";

interface EventsSelectorProps {
  events: Event[];
}

export default function EventsSelector({ events }: EventsSelectorProps) {
  const createAsideFromEvents = () => {
    let currentYear: number | null = null;
    let currentMonthIndex: number | null = null;

    const items: JSX.Element[] = [];

    for (const event of events) {
      const date = event.startDate;
      const year = date.getFullYear();
      const monthIndex = date.getMonth();
      const monthName = date.toLocaleString("default", { month: "long" });

      if (year !== currentYear) {
        currentYear = year;
        currentMonthIndex = null; // reset month when year changes
        items.push(
          <Link
            href={`#month-${year}-${monthIndex}`}
            key={`year-${year}`}
            className="text-xl font-bold md:mt-4"
          >
            {year}
          </Link>
        );
      }

      if (monthIndex !== currentMonthIndex) {
        currentMonthIndex = monthIndex;
        items.push(
          <Link
            href={`#month-${year}-${monthIndex}`}
            key={`month-${year}-${monthIndex}`}
            className="text-md md:font-medium md:mt-2"
          >
            {monthName}
          </Link>
        );
      }
    }

    return items;
  };

  return (
    <aside
      className="flex gap-8 outline-3
      outline-(--t-dark-1) px-4 py-3 md:pb-6
      items-center justify-evenly bg-[var(--t-dark-3)] 
      overflow-x-scroll md:flex-col md:overflow-y-auto
      md:overflow-x-hidden  md:outline-0 md:rounded-sm shrink-0
      sticky top-0 md:top-2 z-1 md:h-screen"
    >
      {createAsideFromEvents()}
    </aside>
  );
}
