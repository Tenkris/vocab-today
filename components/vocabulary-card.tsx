'use client';

import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from './ui/button';
import { Trash2, Edit2, BookmarkPlus, Check } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface VocabularyCardProps {
  word: string;
  phonetic: string;
  definition: string;
  translation: string;
  forms: {
    [key: string]: string;
  };
  examples: string[];
  synonyms: string[];
  antonyms: string[];
  collocations: string[];
  timestamp?: number;
  status?: 'new' | 'learning' | 'mastered';
  isSaved?: boolean;
  onSave?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
}

const STATUS_COLORS = {
  new: 'default',
  learning: 'secondary',
  mastered: 'outline',
} as const;

export function VocabularyCard({
  word,
  phonetic,
  definition,
  translation,
  forms,
  examples,
  synonyms,
  antonyms,
  collocations,
  timestamp,
  status,
  isSaved,
  onSave,
  onDelete,
  onEdit
}: VocabularyCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-baseline gap-4">
              <CardTitle className="text-2xl">{word}</CardTitle>
              <CardDescription>{phonetic}</CardDescription>
            </div>
            <CardDescription className="text-lg">
              {translation}
              {timestamp && ` · ${format(timestamp, 'p')}`}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {status && (
              <Badge variant={STATUS_COLORS[status]}>
                {status}
              </Badge>
            )}
            {onSave && (
              <Button
                onClick={onSave}
                disabled={isSaved}
                variant={isSaved ? "secondary" : "default"}
                size="sm"
                className="whitespace-nowrap"
              >
                {isSaved ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Saved
                  </>
                ) : (
                  <>
                    <BookmarkPlus className="h-4 w-4 mr-2" />
                    Save Word
                  </>
                )}
              </Button>
            )}
            {onEdit && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onEdit}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Word</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{word}"?
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={onDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-lg mb-4">{definition}</p>
        
        <Tabs defaultValue="forms" className="w-full">
          <ScrollArea className="w-full whitespace-nowrap rounded-md">
            <TabsList className="inline-flex w-full md:w-auto h-9 items-center justify-start rounded-lg bg-muted p-1 text-muted-foreground">
              <TabsTrigger value="forms">Word Forms</TabsTrigger>
              <TabsTrigger value="examples">Examples</TabsTrigger>
              <TabsTrigger value="synonyms">Synonyms</TabsTrigger>
              <TabsTrigger value="collocations">Collocations</TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" className="invisible" />
          </ScrollArea>
          
          <TabsContent value="forms" className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(forms).map(([type, word]) => (
                <div key={type} className="flex items-center gap-2">
                  <Badge variant="outline" className="w-20">
                    {type}
                  </Badge>
                  <span>{word}</span>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="examples" className="mt-4">
            <ul className="space-y-2">
              {examples.map((example, index) => (
                <li key={index} className="list-disc ml-4">
                  {example}
                </li>
              ))}
            </ul>
          </TabsContent>

          <TabsContent value="synonyms" className="mt-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Synonyms:</h4>
                <ScrollArea className="w-full whitespace-nowrap rounded-md">
                  <div className="flex gap-2 pb-4">
                    {synonyms.map((synonym) => (
                      <Badge key={synonym} variant="secondary" className="shrink-0">
                        {synonym}
                      </Badge>
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Antonyms:</h4>
                <ScrollArea className="w-full whitespace-nowrap rounded-md">
                  <div className="flex gap-2 pb-4">
                    {antonyms.map((antonym) => (
                      <Badge key={antonym} variant="outline" className="shrink-0">
                        {antonym}
                      </Badge>
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="collocations" className="mt-4">
            <ScrollArea className="w-full whitespace-nowrap rounded-md">
              <div className="flex gap-2 pb-4">
                {collocations.map((collocation) => (
                  <Badge key={collocation} variant="secondary" className="shrink-0">
                    {collocation}
                  </Badge>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
