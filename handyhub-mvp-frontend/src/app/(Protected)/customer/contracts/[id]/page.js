import { Suspense } from "react";
import ContractDetailsContainer from "./_components/ContractDetailsContainer";

export const metadata = {
  title: "Contract Details",
  description: "Customer's contract page",
};

export default async function CustomerContractPage({ params }) {
  const id = (await params)?.id;

  return <ContractDetailsContainer id={id} />;
}
