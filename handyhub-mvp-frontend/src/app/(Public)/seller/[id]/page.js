import { getBackendBaseUrl } from "@/config/envConfig";
import SellerByIdContainer from "./_components/SellerByIdContainer";

export async function generateMetadata({ params }) {
  const id = (await params).id;

  // fetch data
  const sellerRes = await fetch(`${getBackendBaseUrl()}/users/${id}`);
  const seller = await sellerRes.json();

  return {
    title: seller?.data?.name,
    description: `Seller description page of ${seller?.data?.name}`,
  };
}

export default async function SellerProfilePage({ params }) {
  const id = (await params)?.id;

  return <SellerByIdContainer id={id} />;
}
