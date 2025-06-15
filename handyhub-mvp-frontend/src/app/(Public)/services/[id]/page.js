import { getBackendBaseUrl } from "@/config/envConfig";
import ServicePostPageContainer from "./_components/ServicePostPageContainer";

export async function generateMetadata({ params }) {
  const id = (await params).id;

  const servicePost = await fetch(
    `${getBackendBaseUrl()}/service-post/${id}`,
  ).then((res) => res.json());

  return {
    title: `${servicePost?.data?.title}`,
    description: `Service details page of ${servicePost?.data?.title}. ${servicePost?.data?.description}`,
  };
}

export default async function DynamicServicePage({ params }) {
  const id = (await params)?.id;

  return <ServicePostPageContainer id={id} />;
}
