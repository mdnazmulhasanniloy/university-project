"use client";

import ResponsiveContainer from "@/components/ResponsiveContainer/ResponsiveContainer";
import { AboutSection } from "./AboutSection";
import { ProfileHeader } from "./ProfileHeader";
import { ServicesSection } from "./ServicesSection";
import { ShowcasedServices } from "./ShowcasedServices";
import { useGetUserByIdQuery } from "@/redux/api/userApi";

export default function SellerByIdContainer({ id }) {
  // Get seller by id
  const { data: sellerRes } = useGetUserByIdQuery(id, { skip: !id });
  const seller = sellerRes?.data || {};

  return (
    <ResponsiveContainer className="space-y-2 rounded-lg border bg-white p-5 shadow">
      <ProfileHeader seller={seller} />
      <AboutSection seller={seller} />
      <ServicesSection seller={seller} />
      <ShowcasedServices id={id} />
    </ResponsiveContainer>
  );
}
