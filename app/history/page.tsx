import { Header } from "@/components/header";
import { HistoryView } from "@/components/history-view";

export default function HistoryPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <HistoryView />
      </div>
    </main>
  );
}
