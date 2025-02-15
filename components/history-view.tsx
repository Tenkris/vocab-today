"use client";

import { useState, useEffect } from "react";
import { VocabularyCard } from "./vocabulary-card";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

// ... existing MOCK_DATA ...

// Mock data
const MOCK_DATA: VocabEntry[] = [
  {
    id: "1",
    word: "ephemeral",
    phonetic: "/ɪˈfem(ə)rəl/",
    definition: "Lasting for a very short time",
    translation: "ชั่วคราว",
    timestamp: new Date("2024-02-14T09:15:00").getTime(),
    status: "new",
    forms: {
      noun: "ephemerality",
      adjective: "ephemeral",
      adverb: "ephemerally",
    },
    examples: [
      "The ephemeral nature of social media trends",
      "An ephemeral display of northern lights",
      "Their fame proved to be ephemeral",
    ],
    synonyms: ["fleeting", "transient", "momentary", "brief", "temporary"],
    antonyms: ["permanent", "lasting", "eternal", "enduring"],
    collocations: [
      "ephemeral beauty",
      "ephemeral existence",
      "ephemeral moment",
    ],
    user_id: "user1",
  },
  {
    id: "2",
    word: "serendipity",
    phonetic: "/ˌserənˈdɪpɪti/",
    definition: "The occurrence of finding pleasant things by chance",
    translation: "เหตุบังเอิญที่ดี",
    timestamp: new Date("2024-02-14T11:30:00").getTime(),
    status: "learning",
    forms: {
      noun: "serendipity",
      adjective: "serendipitous",
      adverb: "serendipitously",
    },
    examples: [
      "Meeting my best friend was pure serendipity",
      "The serendipity of scientific discoveries",
      "By serendipity, she found her dream job while on vacation",
    ],
    synonyms: ["chance", "fortune", "luck", "destiny", "fate"],
    antonyms: ["misfortune", "design", "plan", "intention"],
    collocations: [
      "pure serendipity",
      "happy serendipity",
      "serendipity effect",
    ],
    user_id: "user1",
  },
  {
    id: "3",
    word: "ubiquitous",
    phonetic: "/juːˈbɪkwɪtəs/",
    definition: "Present, appearing, or found everywhere",
    translation: "มีอยู่ทุกหนทุกแห่ง",
    timestamp: new Date("2024-02-13T14:45:00").getTime(),
    status: "mastered",
    forms: {
      noun: "ubiquity",
      adjective: "ubiquitous",
      adverb: "ubiquitously",
    },
    examples: [
      "Smartphones have become ubiquitous in modern life",
      "The ubiquitous influence of social media",
      "Coffee shops are ubiquitous in this city",
    ],
    synonyms: ["omnipresent", "everywhere", "pervasive", "universal"],
    antonyms: ["rare", "scarce", "uncommon", "limited"],
    collocations: [
      "ubiquitous presence",
      "ubiquitous feature",
      "become ubiquitous",
    ],
    user_id: "user1",
  },
];

interface VocabEntry {
  id: string;
  word: string;
  phonetic: string;
  definition: string;
  translation: string;
  timestamp: number;
  status: "new" | "learning" | "mastered";
  forms: {
    [key: string]: string;
  };
  examples: string[];
  synonyms: string[];
  antonyms: string[];
  collocations: string[];
  user_id: string;
}

export function HistoryView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [vocabularyData, setVocabularyData] = useState<VocabEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchVocabulary();
  }, []);

  const fetchVocabulary = async () => {
    setIsLoading(true);
    const supabase = createClient();

    try {
      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.log("User not authenticated:", userError);
        return;
      }

      // Fetch vocabulary data for current user
      const { data, error } = await supabase
        .from("vocabulary")
        .select("*")
        .eq("user_id", user.id)
        .order("timestamp", { ascending: false });

      if (error) throw error;

      setVocabularyData(data || []);
    } catch (error) {
      console.log("Failed to load vocabulary");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const supabase = createClient();
    try {
      const { error } = await supabase.from("vocabulary").delete().eq("id", id);

      if (error) throw error;

      setVocabularyData((prevData) =>
        prevData.filter((entry) => entry.id !== id)
      );
    } catch (error) {
      console.error("Error deleting word:", error);
    }
  };

  const handleStatusUpdate = async (
    id: string,
    newStatus: "new" | "learning" | "mastered"
  ) => {
    const supabase = createClient();
    try {
      const { error } = await supabase
        .from("vocabulary")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      setVocabularyData((prevData) =>
        prevData.map((entry) =>
          entry.id === id ? { ...entry, status: newStatus } : entry
        )
      );
    } catch (error) {
      console.log("Error updating status:", error);
    }
  };

  // Filter entries based on search query
  const filteredEntries = vocabularyData.filter((entry) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      entry.word.toLowerCase().includes(searchLower) ||
      entry.definition.toLowerCase().includes(searchLower) ||
      entry.translation.toLowerCase().includes(searchLower)
    );
  });

  // Group filtered entries by date
  const groupedEntries = filteredEntries.reduce(
    (acc, entry) => {
      const date = new Date(entry.timestamp).toISOString().split("T")[0];
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(entry);
      return acc;
    },
    {} as Record<string, VocabEntry[]>
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search words, definitions, or translations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-pulse">Loading your vocabulary...</div>
        </div>
      ) : vocabularyData.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No words saved yet. Start by searching and saving some words!
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedEntries).map(([date, entries]) => (
            <div key={date} className="space-y-4">
              <h2 className="text-lg font-semibold sticky top-0 bg-background py-2">
                {new Date(date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </h2>
              <div className="space-y-4">
                {entries.map((entry) => (
                  <VocabularyCard
                    key={entry.id}
                    {...entry}
                    onDelete={() => handleDelete(entry.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
