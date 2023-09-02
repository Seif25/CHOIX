import "./globals.css";
import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

const raleway = Raleway({
  weight: ["300", "500", "700", "800", "900"],
  subsets: ["latin"],
  style: ["italic", "normal"],
});

export const metadata: Metadata = {
  title: "CHOIX",
  description: "An app to help you make decisions",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={raleway.className}>
        <div className="px-24 py-10 flex flex-col items-center justify-between w-full h-[100vh]">
          <nav className="flex items-center justify-center">
            <Link href="/">
              <Image
                src="/1_r.png"
                alt="CHOIX"
                width={200}
                height={200}
              />
            </Link>
          </nav>
          {children}
          <footer>
            <h3 className="text-[#FAF774] font-extrabold text-xs pb-5">
              CHOIX © 2023, All Rights Reserved
            </h3>
          </footer>
        </div>
      </body>
    </html>
  );
}
