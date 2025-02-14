import { OpenAI } from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

async function callOpenAI(prompt: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
  });
  return response.choices[0].message.content;
}

async function validateWord(word: string): Promise<boolean> {
  const prompt = `
    Determine if "${word}" is a valid English word.
    Return ONLY "yes" if it's a real English word, or "no" if it's not.
    Do not provide any explanation or additional text.
  `;
  const response = await callOpenAI(prompt);
  return response?.trim().toLowerCase() === "yes";
}

async function correctSpelling(word: string): Promise<string> {
  const prompt = `
    Check if "${word}" is spelled correctly. If it's misspelled, provide the correct spelling.
    Return ONLY the corrected word without any explanation or additional text.
    If the word is already correct, return it as is.
  `;
  return (await callOpenAI(prompt))?.trim() ?? word;
}

async function generateVocabWord(word: string): Promise<VocabData | null> {
  const prompt = `
    You are a vocabulary expert. Generate a detailed JSON object for the English word "${word}".
    Follow this EXACT format and ensure all fields are properly filled:
    {
      "word": "${word}",
      "phonetic": "IPA phonetic transcription",
      "definition": "clear and concise definition",
      "translation": "Thai translation",
      "forms": {
        "noun": "noun form of the word",
        "adjective": "adjective form of the word",
        "adverb": "adverb form of the word"
      },
      "examples": [
        "A natural example sentence using the word",
        "Another contextual example",
        "A third practical example"
      ],
      "synonyms": [
        "relevant synonym 1",
        "relevant synonym 2",
        "relevant synonym 3"
      ],
      "antonyms": [
        "relevant antonym 1",
        "relevant antonym 2",
        "relevant antonym 3"
      ],
      "collocations": [
        "common word combination 1",
        "common word combination 2",
        "common word combination 3"
      ]
    }
  `;

  try {
    const response = await callOpenAI(prompt);
    if (!response) return null;
    return JSON.parse(response) as VocabData;
  } catch (error) {
    console.error("Error generating vocabulary:", error);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const { word } = await request.json();
    if (!word) {
      return NextResponse.json(
        { success: false, error: "Word is required" },
        { status: 400 }
      );
    }

    const correctedWord = await correctSpelling(word);
    const isValid = await validateWord(correctedWord);

    if (!isValid) {
      console.log(`'${correctedWord}' is not a valid English word.`);
      return NextResponse.json(
        { success: false, message: "Invalid word" },
        { status: 200 }
      );
    }

    const result = await generateVocabWord(correctedWord);
    if (!result) {
      return NextResponse.json(
        { success: false, error: "Failed to generate vocabulary data" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function searchWord(word: string) {
  try {
    const response = await fetch("/api/vocabulary", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ word }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }

    return await response.json();
  } catch (error) {
    console.error("Error searching word:", error);
    throw error;
  }
}
