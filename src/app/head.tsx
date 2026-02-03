import { ReactNode } from "react";

export default function Head(): ReactNode {
  return (
    <>
      <link rel="icon" href="/src/app/favicon.ico" sizes="any" />
      <link rel="icon" type="image/png" sizes="32x32" href="/src/app/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/src/app/favicon-16x16.png" />
      {/* Add more favicon links here if you have more formats */}
    </>
  );
}
