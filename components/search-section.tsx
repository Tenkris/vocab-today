"use client";

import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search } from "lucide-react";
import { VocabularyCard } from "./vocabulary-card";
import { createClient } from "@/utils/supabase/client";

interface VocabData {
  word: string;
  phonetic: string;
  definition: string;
  translation: string;
  forms: Record<string, string>;
  examples: string[];
  synonyms: string[];
  antonyms: string[];
  collocations: string[];
}

// // Mock search result
// const MOCK_SEARCH_RESULT = {
//   word: "serendipity",
//   phonetic: "/ˌserənˈdɪpɪti/",
//   definition: "The occurrence of finding pleasant things by chance",
//   translation: "เหตุบังเอิญที่ดี",
//   forms: {
//     noun: "serendipity",
//     adjective: "serendipitous",
//     adverb: "serendipitously",
//   },
//   examples: [
//     "Meeting my best friend was pure serendipity",
//     "The serendipity of scientific discoveries",
//     "By serendipity, she found her dream job while on vacation",
//   ],
//   synonyms: ["chance", "fortune", "luck", "destiny", "fate"],
//   antonyms: ["misfortune", "design", "plan", "intention"],
//   collocations: ["pure serendipity", "happy serendipity", "serendipity effect"],
// };

export function SearchSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState<VocabData | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    setSaveError(null);
    setIsSaved(false);

    try {
      // First check if word exists in database
      const supabase = createClient();
      const { data: existingWord } = await supabase
        .from("vocabulary")
        .select("*")
        .eq("word", searchTerm.trim())
        .single();

      if (existingWord) {
        setSearchResults(existingWord);
        setShowResults(true);
        setIsSaved(true);
        return;
      }

      // If word doesn't exist, search via API
      const response = await fetch("/api/vocabulary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ word: searchTerm.trim() }),
      });

      const data = await response.json();

      if (!data.success) {
        return;
      }

      setSearchResults(data.data);
      setShowResults(true);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSave = async () => {
    if (!searchResults) return;

    setIsSaving(true);
    setSaveError(null);

    const supabase = createClient();
    try {
      const { error } = await supabase.from("vocabulary").insert([
        {
          word: searchResults.word,
          phonetic: searchResults.phonetic,
          definition: searchResults.definition,
          translation: searchResults.translation,
          forms: searchResults.forms,
          examples: searchResults.examples,
          synonyms: searchResults.synonyms,
          antonyms: searchResults.antonyms,
          collocations: searchResults.collocations,
          timestamp: new Date().toISOString(),
          status: "new",
        },
      ]);

      if (error) {
        if (error.code === "23505") {
          setSaveError("This word is already in your vocabulary");
          setIsSaved(true);
          return;
        }
        throw error;
      }

      setIsSaved(true);

      // Reset form after successful save
      setTimeout(() => {
        setSearchTerm("");
        setSearchResults(null);
        setShowResults(false);
      }, 1500);
    } catch (error) {
      console.error("Error saving word:", error);
      setSaveError("Failed to save word. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          type="text"
          placeholder="Enter a word to search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
          disabled={isSearching || isSaving}
        />
        <Button type="submit" disabled={isSearching || isSaving}>
          <Search className="h-4 w-4 mr-2" />
          {isSearching ? "Searching..." : "Search"}
        </Button>
      </form>

      {isSearching && (
        <div className="mt-8 text-center text-muted-foreground">
          <div className="animate-pulse">Searching...</div>
        </div>
      )}

      {showResults && !isSearching && searchResults && (
        <div className="mt-8">
          <VocabularyCard
            {...searchResults}
            onSave={handleSave}
            isSaving={isSaving}
            isSaved={isSaved}
            saveError={saveError}
          />
        </div>
      )}
    </div>
  );
}
