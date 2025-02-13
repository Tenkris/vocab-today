import { Header } from "@/components/header";
import { SearchSection } from "@/components/search-section";

export default function SearchPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8">Search Vocabulary</h2>
        <SearchSection />
      </div>
    </main>
  );
}
