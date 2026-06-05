import { createFileRoute } from "@tanstack/react-router";
import { DownloadsTab } from "@/components/DownloadsTab";
import { Header } from "@/components/Header";

export const Route = createFileRoute("/downloads")({
  component: DownloadsPage,
  head: () => ({
    meta: [
      { title: "Downloads · ŁĄCZEK STREAM" },
      { name: "description", content: "Your offline downloads — pause, resume, and watch without internet." },
    ],
  }),
});

function DownloadsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto max-w-4xl px-4 pb-24 pt-6">
        <h1 className="mb-4 text-2xl font-black tracking-tight">Downloads</h1>
        <DownloadsTab />
      </main>
    </div>
  );
}
