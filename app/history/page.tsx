import { Header } from "@/components/header";
import { HistoryView } from "@/components/history-view";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function HistoryPage() {
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
        <HistoryView />
      </div>
    </main>
  );
}
