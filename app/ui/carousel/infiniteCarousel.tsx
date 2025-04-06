import { Showcase } from "@/app/lib/definitions";
import Image from "next/image";
import Marquee from "react-fast-marquee";

interface InfProps {
  items: Showcase[];
}

export default function InfiniteCarousel({ items }: InfProps) {
  return (
    <div className="m-4">
      <Marquee
        pauseOnHover
        direction="left"
        speed={50}
        loop={0}
        gradient
        gradientColor="var(--background)"
        autoFill
      >
        {items.map((item) => (
          <a href={item.link} key={item.id}>
            <Image
              width={250}
              height={175}
              alt={item.name || "external link"}
              src={item.img_url}
              className="w-[250px] h-[175px] rounded-sm mr-3 md:mr-6 lg:mr-12"
              priority
            />
          </a>
        ))}
      </Marquee>
    </div>
  );
}
