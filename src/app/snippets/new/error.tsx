"use client";
// it has to be a client component

interface ErrorPageProps {
  error: Error;
  // refresh a route
  reset: () => void;
}

// it doesn't give to the user the possibility to submit again
// because we are showing now the error page, but they cannot access to the
// form in the new page.
export default function ErrorPage({ error }: ErrorPageProps) {
  return <div>{error.message}</div>;
}
