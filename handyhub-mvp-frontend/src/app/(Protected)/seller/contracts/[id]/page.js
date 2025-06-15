import { Suspense } from "react";
import SellerContractDetailsContainer from "./_components/SellerContractDetailsContainer";

export const metadata = {
  title: "Contract Details",
  description: "Customer's contract page",
};

export default async function CustomerContractPage({ params }) {
  const id = (await params)?.id;

  return (
    <Suspense fallback={"Loading..."}>
      <SellerContractDetailsContainer id={id} />
    </Suspense>
  );
}
