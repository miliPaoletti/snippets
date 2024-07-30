"use client";

import type { Snippet } from "@prisma/client";
import Editor from "@monaco-editor/react";
import { startTransition, useState } from "react";
import { editSnippet } from "@/actions";
interface SnippetEditFormProps {
  snippet: Snippet;
}

export default function SnippetEditForm({ snippet }: SnippetEditFormProps) {
  const [code, setCode] = useState(snippet.code);
  const handleEditorChange = (value: string = "") => {
    setCode(value);
  };

  // save changes on db, for that we need a server action (saving or changing data)
  // we cannot DEFINE server actions on CLIENT COMPONENTS
  // but we CAN USE THEM -> editSnippet is the action that i created.

  //   Options for calling server actions from client components
  // 1.  Access somme state in a server action -> bind it
  //     we want to pass the code, not a state of the form. (tied to a form)
  //     This is a key difference between the other usage
  //     It CAN BE USE if user isn't running JAVASCRIPT IN THEIR BROWSER (good for that)

  //   it is preloaded with the values that it needs
  const editSnippetAction = editSnippet.bind(null, snippet.id, code);

  //   2. run a server action at any time WE WANT.
  //      startTransition! -> event handler, and we
  //      directly call our server action
  //      MAKES SURE WE HAVE UPDATED DATA BEFORE WE ATTEMPT TO NAVIGATE
  //      IT IS NOT TIED TO A FORM!!
  const handleClick = () => {
    startTransition(async () => {
      await editSnippet(snippet.id, code);
    });
  };

  return (
    <div>
      <Editor
        height="40vh"
        theme="vs-dark"
        language="javascript"
        defaultValue={snippet.code}
        options={{
          minimap: { enabled: false },
        }}
        onChange={handleEditorChange}
      />
      {/* option 1 */}
      {/* <form action={editSnippetAction}>
        <button type="submit">Save OPTION 1</button>
      </form> */}

      {/* option 2 */}
      <button onClick={handleClick}>SUBMIT OPTION 2</button>
    </div>
  );
}
