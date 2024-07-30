import SnippetEditForm from "@/components/snippet-edit-form";
import { db } from "@/db";
import { notFound } from "next/navigation";
interface SnippetEditPageProps {
  params: {
    id: string;
  };
}

// it has to be server component because we are fetching data
export default async function SnippetEditPage(props: SnippetEditPageProps) {
  const id = parseInt(props.params.id);
  const snippet = await db.snippet.findFirst({
    where: { id },
  });

  if (!snippet) {
    return notFound();
  }

  return (
    <div>
      {/* client component - we pass the data fetched to the client component
      it is rendered on the SERVER one single time!!! */}
      <SnippetEditForm snippet={snippet} />
    </div>
  );
}
