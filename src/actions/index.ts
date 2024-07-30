"use server";
import { db } from "@/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
export async function editSnippet(id: number, code: string) {
  // as we are not showing the code, it's not necessary to revalidate and call
  // the latest version of the cache.
  await db.snippet.update({
    where: { id },
    data: { code },
  });

  // revalidate so when we edit the snippet we have the latest version of the cache
  // we have to do this because we added the generateStaticParams, and that
  // is generating static pages. So we have to revalidate the cache
  revalidatePath(`snippets/${id}`);
  redirect(`/snippets/${id}`);
}

export async function deleteSnippet(id: number) {
  await db.snippet.delete({
    where: {
      id,
    },
  });
  // we refresh the cache after deleting the snippet for the home page
  // so when the user it's redirected to the home page, the snippet is up to date
  revalidatePath("/");
  redirect("/");
}

export async function createSnippet(
  formState: { message: string },
  formData: FormData
) {
  try {
    // validation for title and code
    const title = formData.get("title") as string;
    const code = formData.get("code") as string;

    if (typeof title !== "string" || title.length < 3) {
      return {
        message: "Title must be longer",
      };
    }

    if (typeof code !== "string" || code.length < 10) {
      return {
        message: "Code must be longer",
      };
    }

    await db.snippet.create({
      data: {
        title,
        code,
      },
    });
    // handle error if db fails and we get a Error
    // error.tsx -> handles errors from server components
    // with the error.tsx page the user cannot submit again

    // so, for handling that, instead of throw an error
    // we return an object with a message to the user.
    // NOT THROW AN ERROR
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        message: error.message,
      };
    } else {
      return {
        message: "Something went wrong",
      };
    }
  }
  // we refresh the cache after deleting the snippet for the home page
  // so when the user it's redirected to the home page, the snippet is up to date
  revalidatePath("/");
  // try/catch, redirects returns an error and
  // next js handles it, so we don't have to put it inside a try/catch,
  // always outside
  redirect("/");
}
