import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import NavBar from "./ui/navigationBar";
import Footer from "./ui/footer";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tablecloth Magazine",
  description:
    "The Tablecloth is a gamedev magazine run by alumni and current members of the Video Game Development Club @ UCI. Read interviews, post-mortems, and more!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${outfit.variable} ${inter.variable} antialiased`}
      >
        <NavBar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
