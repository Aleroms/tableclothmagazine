import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";

import NavBar from "./ui/navigationBar";
import Footer from "./ui/footer";

import SessionProvider from "@/app/ui/sessionProvider";
import { getServerSession } from "next-auth/next";

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
  title: {
    default: "Tablecloth Magazine",
    template: "%s | Tablecloth Magazine",
  },
  description:
    "The Tablecloth is a gamedev magazine run by alumni and current members of the Video Game Development Club @ UCI. Read interviews, post-mortems, and more!",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();

  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${outfit.variable} ${inter.variable} antialiased`}>
        <SessionProvider session={session}>
          <NavBar />
          {children}
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
