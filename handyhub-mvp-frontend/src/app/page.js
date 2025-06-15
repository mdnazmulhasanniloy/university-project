import Hero from "@/components/home-sections/Hero/Hero";
import Popular from "@/components/home-sections/Popular/Popular";
import Services from "@/components/home-sections/Services/Services";
import TopExpertise from "@/components/home-sections/TopExpertise/TopExpertise";
import WhyChooseUs from "@/components/home-sections/WhyChooseUs/WhyChooseUs";
import Image from "next/image";
import logo from "/public/logos/logo-sm.png";

export const metadata = {
  title: "Home | HandyHub",
  description: "Home page of HandyHub",
};

export default function Home() {
  return (
    <div className="space-y-20 md:space-y-24 lg:space-y-28 xl:space-y-32">
      <Hero />
      <Services />
      <Popular />
      <TopExpertise />
      <WhyChooseUs />
    </div>
  );
}
