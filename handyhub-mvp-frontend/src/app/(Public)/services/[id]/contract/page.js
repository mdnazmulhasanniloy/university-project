import CreateContract from "./_components/CreateContract";

export const metadata = {
  title: "Contract Seller",
  description: "Contract seller for service page",
};

export default async function ContractSeller({ params }) {
  const id = (await params)?.id;

  return <CreateContract id={id} />;
}
