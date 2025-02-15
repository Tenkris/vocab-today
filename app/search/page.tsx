import { Header } from "@/components/header";
import { SearchSection } from "@/components/search-section";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function SearchPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("user", user);

  if (!user) {
    return redirect("/sign-in");
  }
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
