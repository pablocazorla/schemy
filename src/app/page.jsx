"use client";

import Editor from "@/components/editor";
import Header from "@/components/header";
import Nav from "@/components/nav";
import Screen from "@/components/screen";

export default function Home() {
  return (
    <main>
      <Header />
      <Nav />
      <Screen />
      <Editor />
    </main>
  );
}
