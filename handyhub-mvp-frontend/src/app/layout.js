import localFont from "next/font/local";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import Providers from "@/config/Providers";
import Navbar from "@/components/shared/Navbar/Navbar";
import Footer from "@/components/shared/Footer/Footer";
import GridBg from "@/components/shared/GridBg/GridBg";
import "react-pagination-bar/dist/index.css";
import Toploader from "@/components/Toploader/Toploader";

// Import Swiper.js styles
import "swiper/css";
import ScrollToTopBtn from "@/components/ScrollToTopBtn/ScrollToTopBtn";
import { Toaster } from "@/components/ui/sonner";

const cabinetGrotesk = localFont({
  src: "../../public/fonts/CabinetGrotesk-Variable.woff2",
  display: "block",
  variable: "--font-cabinet-grotesk",
  weight: "400 800",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["200", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: {
    default: "HandyHub - Find perfect professionals for you",
    template: "%s | HandyHub",
  },
  description:
    "Handyhub is a platform that provides a convenient way for users to find, hire, and manage service providers, with an emphasis on ease of use and reliability.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className="antialiased scrollbar-thin scrollbar-track-gray-500 scrollbar-thumb-gray-300"
    >
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </head>

      <body
        className={`${cabinetGrotesk.className} ${cabinetGrotesk.variable} ${dmSans.variable} antialiased lg:overflow-x-hidden`}
      >
        <Providers>
          <div className="flex min-h-screen flex-col justify-between">
            <Navbar />

            <GridBg />

            <main className="mt-12 flex-1 lg:mt-16">{children}</main>

            <Footer />
          </div>
        </Providers>

        <Toaster richColors duration={4500} position="top-center" closeButton />
        <Toploader />
        <ScrollToTopBtn />
      </body>
    </html>
  );
}
