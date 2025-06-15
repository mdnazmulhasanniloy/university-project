import EditServicePost from "./_components/EditServicePost";

export default async function EditServicePostPage({ params }) {
  const id = (await params)?.id;

  return <EditServicePost id={id} />;
}
