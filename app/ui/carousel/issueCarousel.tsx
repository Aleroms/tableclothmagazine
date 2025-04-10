"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export interface Slide {
  to: string;
  img_url: string;
  release_date: Date;
}

export interface CarouselProps {
  slides: Slide[];
}

export default function IssueCarousel({ slides }: CarouselProps) {
  const sortedSlides = slides.sort(
    (a, b) => b.release_date.getTime() - a.release_date.getTime()
  );

  const [current, setCurrent] = useState(0);
  const visibleSlides = 3;

  function nextSlide() {
    setCurrent(current === sortedSlides.length - 1 ? 0 : current + 1);
  }

  function prevSlide() {
    setCurrent(current === 0 ? sortedSlides.length - 1 : current - 1);
  }
  return (
    <div className="m-auto max-w-5xl bg-[var(--t-dark-2)] p-2 flex flex-col rounded-sm">
      <div className="flex items-center justify-center">
        {/* left button  */}
        <button
          onClick={prevSlide}
          className="hidden sm:inline-flex bg-[var(--t-light-1)] h-18 w-5 rounded-xl mx-4 hover:bg-neutral-200 cursor-pointer"
        />
        <div className="carousel-body flex flex-col p-2 w-full justify-center">
          <h2 className="capitalize font-bold text-2xl md:text-4xl inline">
            Latest Release
          </h2>
          <div className="my-1">
            <div className=" flex overflow-x-auto gap-2 sm:gap-3 md:gap-4 lg:gap-8">
              {sortedSlides
                .slice(current, current + visibleSlides)
                .concat(
                  current + visibleSlides > sortedSlides.length
                    ? sortedSlides.slice(
                        0,
                        (current + visibleSlides) % sortedSlides.length
                      )
                    : []
                )
                .map((slide) => (
                  <div
                    key={slide.to}
                    className="relative w-[150px] md:w-[250px] aspect-[3/4] shrink-0 mt-2"
                  >
                    <Link href={slide.to}>
                      <Image
                        src={slide.img_url}
                        fill
                        sizes="(max-width: 768px) 150px, 250px"
                        alt={slide.to.replace(/\//g, " ")}
                        className="object-cover rounded-sm"
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
          className="hidden sm:inline-flex bg-[var(--t-light-1)] h-18 w-5 rounded-xl mx-4 hover:bg-neutral-200 cursor-pointer"
        />
      </div>
      {/* pagination hidden on mobile  */}
      <div className="hidden sm:flex justify-center items-center gap-4 m-4">
        {sortedSlides.map((_, idx) => (
          <div
            key={idx}
            className={`h-4 w-4 rounded-full transition delay-150 ease-in-out ${
              idx === current ? "bg-white" : "bg-neutral-500"
            } hover:bg-neutral-300`}
            onClick={() => setCurrent(idx)}
          />
        ))}
      </div>
    </div>
  );
}
