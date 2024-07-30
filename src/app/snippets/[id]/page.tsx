import { db } from "@/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import * as actions from "@/actions";

interface SnippetShowPageProps {
  params: {
    id: string;
  };
}
export default async function SnippetShowPage(props: SnippetShowPageProps) {
  const snippet = await db.snippet.findFirst({
    where: {
      id: parseInt(props.params.id),
    },
  });

  if (!snippet) {
    return notFound();
  }

  const deleteSnippetAction = actions.deleteSnippet.bind(null, snippet.id);
  return (
    <div>
      <div className="flex m-4 justify-between items-center">
        <h1 className="text-xl font-bold">{snippet.title}</h1>
        <div className="flex gap-4">
          <Link
            href={`/snippets/${snippet.id}/edit`}
            className="p-2 border rounded"
          >
            Edit
          </Link>
          <form action={deleteSnippetAction}>
            <button type="submit" className="p-2 border rounded">
              Delete
            </button>
          </form>
        </div>
      </div>
      <pre className="border p-3 rounded bg-gray-200 border-gray-200">
        <code>{snippet.code}</code>
      </pre>
    </div>
  );
}

// it's called automatically.
// it maps through all the snippets and generates
// all static pages for each snippet. Ad the folder has [id]
// and we are passing the id as a param, it will generate them
// and will have caches pages for each of the snippets
// in the production build, it will load the page faster.
export async function generateStaticParams() {
  // fecth all the snippets from our db
  const snippets = await db.snippet.findMany();

  return snippets.map((snippet) => {
    return {
      // next expects that everything should be strings
      id: snippet.id.toString(),
    };
  });
}
