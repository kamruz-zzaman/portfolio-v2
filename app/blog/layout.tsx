import type React from "react";
import "@/app/globals.css";
import { Inter } from "next/font/google";

import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Kamruz - Full Stack Developer",
  description:
    "Portfolio website of Kamruz, a Full Stack Developer specializing in modern web applications.",
};

export default function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
