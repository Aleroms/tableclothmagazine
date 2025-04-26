import Image from "next/image";
import { Bowlby_One } from "next/font/google";

const bowlby_one = Bowlby_One({
  subsets: ["latin"],
  weight: "400",
});

interface TableLogoProps {
  isFooter?: boolean;
  size: number;
}
export default function TableLogo({ size, isFooter }: TableLogoProps) {
  return (
    <div className="flex items-center justify-center">
      <Image
        src="/tableLogo/logo.svg"
        width={size}
        height={size}
        priority
        alt="tablecloth magazine"
      />
      <div className="hidden md:flex flex-col ml-4">
        <h2
          className={`text-md lg:text-xl ${bowlby_one.className} ${
            isFooter && "text-white"
          }`}
          style={{ textShadow: "var(--dropShadow-hard)" }}
        >
          THE TABLECLOTH MAGAZINE
        </h2>
        <h2
          className={`text-xs lg:text-md ${bowlby_one.className} ${
            isFooter && "text-white"
          }`}
          style={{ textShadow: "var(--dropShadow-hard)" }}
        >
          covering your game dev news
        </h2>
      </div>
    </div>
  );
}
