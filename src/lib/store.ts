import { useState, useEffect } from 'react';

export interface JournalEntry {
  date: string;
  moodColor: string;
  text: string;
}

const STORAGE_KEY = 'mental_dump_journal_entries';

export function useJournal() {
  const [entries, setEntries] = useState<Record<string, JournalEntry>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load entries", e);
      }
    }
    setIsLoaded(true);
  }, []);

  const saveEntry = (entry: JournalEntry) => {
    const newEntries = { ...entries, [entry.date]: entry };
    setEntries(newEntries);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newEntries));
  };

  const burnNote = (date: string) => {
    const newEntries = { ...entries };
    if (newEntries[date]) {
        // Keep the mood color for the calendar history, but erase the text to symbolize letting go
        newEntries[date] = { ...newEntries[date], text: '' };
        setEntries(newEntries);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newEntries));
    }
  };

  return { entries, saveEntry, burnNote, isLoaded };
}
