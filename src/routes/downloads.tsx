import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Download } from "lucide-react";
import { DownloadsTab } from "@/components/DownloadsTab";

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
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex max-w-4xl items-center gap-3 px-4 py-3">
          <Link to="/" className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-secondary">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <Download className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-black tracking-tight">Downloads</h1>
        </div>
      </header>
      <main className="container mx-auto max-w-4xl px-4 pb-24 pt-6">
        <DownloadsTab />
      </main>
    </div>
  );
}
