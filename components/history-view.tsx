"use client";

import { useState } from "react";
import { VocabularyCard } from "./vocabulary-card";
import { Input } from "./ui/input";
import { Search } from "lucide-react";

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
}

export function HistoryView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [vocabularyData, setVocabularyData] = useState<VocabEntry[]>(MOCK_DATA);

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

  const handleDelete = (id: string) => {
    setVocabularyData((prevData) =>
      prevData.filter((entry) => entry.id !== id)
    );
  };

  const handleEdit = (id: string) => {
    // Implement edit functionality
    console.log("Edit:", id);
  };

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
                  onEdit={() => handleEdit(entry.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
