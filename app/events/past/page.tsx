import PastEventsCalendar from "@/app/ui/events/pastEventsCalendar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Past Events",
};
export default function PastEventsPage() {
  return (
    <div>
      <h1 className="capitalize text-3xl md:text-4xl lg:text-6xl text-center font-bold mx-6 my-20">
        Past Events
      </h1>
      <PastEventsCalendar />
    </div>
  );
}
