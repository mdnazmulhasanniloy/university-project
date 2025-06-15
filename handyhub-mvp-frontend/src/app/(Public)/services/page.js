import ResponsiveContainer from "@/components/ResponsiveContainer/ResponsiveContainer";
import ServicesSearchBar from "./_components/ServicesSearchBar";
import ServiceFilters from "./_components/ServiceFilters";
import ServicesPageProvider from "@/context/ServicesPageContext";
import ServicesContainer from "./_components/ServicesContainer";
import { Suspense } from "react";

export const metadata = {
  title: "Services",
  description: "Services page",
};

export default function ServicesPage() {
  return (
    <ServicesPageProvider>
      <ResponsiveContainer>
        <section className="text-center">
          <h1 className="text-3xl font-semibold lg:text-4xl 2xl:text-5xl">
            Get High Quality Services & Offers
          </h1>
          <p className="mb-8 mt-2 font-dm-sans text-xl text-dark-gray">
            Looking for affordable offers for services? HandyHub has you
            covered!
          </p>

          <ServicesSearchBar />
        </section>

        <section className="mt-16 flex flex-col items-start justify-between lg:flex-row lg:gap-x-12">
          <Suspense fallback={"Loading..."}>
            <ServiceFilters className="w-full pb-10 lg:w-[25%] 2xl:w-[30%]" />
          </Suspense>

          <ServicesContainer className="w-full lg:flex-grow" />
        </section>
      </ResponsiveContainer>
    </ServicesPageProvider>
  );
}
