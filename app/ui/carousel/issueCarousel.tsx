"use client";
import { IssueThumbnail } from "@/app/lib/definitions";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export interface CarouselProps {
  thumbnails: IssueThumbnail[];
}

export default function IssueCarousel({ thumbnails }: CarouselProps) {
  const [current, setCurrent] = useState(0);
  const visibleSlides = 3;

  function nextSlide() {
    setCurrent(current === thumbnails.length - 1 ? 0 : current + 1);
  }

  function prevSlide() {
    setCurrent(current === 0 ? thumbnails.length - 1 : current - 1);
  }
  return (
    <div className="m-auto max-w-7xl dark:bg-[var(--t-dark-2)] p-2 flex flex-col rounded-sm">
      <div className="flex items-center justify-center">
        {/* left button  */}
        <button
          onClick={prevSlide}
          className="hidden sm:inline-flex bg-[var(--t-dark-1)] dark:bg-[var(--t-light-1)] h-18 w-5 rounded-xl mx-4 hover:bg-neutral-400 dark:hover:bg-neutral-200 cursor-pointer"
        />
        <div className="carousel-body flex flex-col p-2 w-full justify-center">
          <h2 className="capitalize font-bold text-2xl md:text-4xl inline mt-5 mb-5">
            Latest Releases
          </h2>
          <div className="my-1">
            <div className=" flex overflow-x-auto gap-2 sm:gap-8 md:gap-8 lg:gap-8">
              {thumbnails
                .slice(current, current + visibleSlides)
                .concat(
                  current + visibleSlides > thumbnails.length
                    ? thumbnails.slice(
                        0,
                        (current + visibleSlides) % thumbnails.length
                      )
                    : []
                )
                .map(({ id, name, img_url }) => (
                  <div
                    key={id}
                    className="relative w-[250px] md:w-[350px] aspect-[3/4] shrink-0 mt-2 mx-2 sm:mr-0 sm:ml-0"
                  >
                    <Link href={`issues/${id}`}>
                      <Image
                        src={img_url}
                        fill
                        sizes="(max-width: 768px) 150px, 250px"
                        alt={name}
                        className="object-cover rounded-sm shadow-md"
                        draggable="false"
                      />
                    </Link>
                  </div>
                ))}
            </div>
          </div>
        </div>
        {/* right button  */}
        <button
          onClick={nextSlide}
          className="hidden sm:inline-flex bg-[var(--t-dark-1)] dark:bg-[var(--t-light-1)] h-18 w-5 rounded-xl mx-4 hover:bg-neutral-400 dark:hover:bg-neutral-200  cursor-pointer"
        />
      </div>
      {/* pagination hidden on mobile  */}
      <div className="hidden sm:flex justify-center items-center gap-4 m-4">
        {thumbnails.map((_, idx) => (
          <div
            key={idx}
            className={clsx(
              "h-4 w-4 rounded-full transition delay-150 ease-in-out",
              idx === current ? "bg-black dark:bg-white" : "bg-stone-300",
              "dark:hover:bg-neutral-300 hover:bg-neutral-400"
            )}
            onClick={() => setCurrent(idx)}
          />
        ))}
      </div>
    </div>
  );
}
