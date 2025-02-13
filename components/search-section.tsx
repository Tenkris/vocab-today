"use client";

import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search } from "lucide-react";
import { VocabularyCard } from "./vocabulary-card";

// Mock search result
const MOCK_SEARCH_RESULT = {
  word: "serendipity",
  phonetic: "/ˌserənˈdɪpɪti/",
  definition: "The occurrence of finding pleasant things by chance",
  translation: "เหตุบังเอิญที่ดี",
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
  collocations: ["pure serendipity", "happy serendipity", "serendipity effect"],
};

export function SearchSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    // Simulate API call
    setTimeout(() => {
      setIsSearching(false);
      setShowResults(true);
    }, 1000);
  };

  const handleSave = () => {
    // Implement save functionality
    console.log("Saving word:", searchTerm);
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
        />
        <Button type="submit" disabled={isSearching}>
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </form>

      {isSearching && (
        <div className="mt-8 text-center text-muted-foreground">
          Searching...
        </div>
      )}

      {showResults && !isSearching && searchTerm && (
        <div className="mt-8">
          <VocabularyCard {...MOCK_SEARCH_RESULT} onSave={handleSave} />
        </div>
      )}
    </div>
  );
}
