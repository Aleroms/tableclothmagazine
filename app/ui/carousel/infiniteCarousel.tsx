import { Showcase } from "@/app/lib/definitions";
import Image from "next/image";
import Marquee from "react-fast-marquee";

interface InfProps {
  items: Showcase[];
}

export default function InfiniteCarousel({ items }: InfProps) {
  return (
    <div className="m-4">
      <Marquee pauseOnHover direction="left" speed={50} loop={0} autoFill>
        {items.map(({ link, id, name, img_url }) => (
          <a href={link} key={id}>
            <Image
              width={250}
              height={175}
              alt={name}
              src={img_url}
              className="w-[250px] h-[175px] rounded-sm mr-3 md:mr-6 lg:mr-12"
              priority
            />
          </a>
        ))}
      </Marquee>
    </div>
  );
}
