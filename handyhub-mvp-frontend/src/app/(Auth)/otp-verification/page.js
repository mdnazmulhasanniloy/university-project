import ResponsiveContainer from "@/components/ResponsiveContainer/ResponsiveContainer";
import React from "react";
import OtpVerificationForm from "./_components/OtpVerificationForm";

export const metadata = {
  title: "Otp Verification",
  description: "Otp Verification page",
};

export default function page() {
  return <OtpVerificationForm />;
}
