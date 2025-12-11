
export interface VocabularyItem {
  gujarati: string;
  english: string;
  pronunciation: string;
}

export interface Lesson {
  id: string;
  day: number;
  title: string;
  gujaratiTitle: string;
  icon: string;
  color: string;
  systemPrompt: string;
  locked: boolean;
  learningOutcomes: string[];
  vocabulary: VocabularyItem[];
}

export interface AudioState {
  isPlaying: boolean;
  volume: number;
}

export enum ConnectionState {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  ERROR = 'ERROR',
}

// --- LMS & Daily Adventure Types ---

export interface StudentProfile {
  id: string;
  name: string;
  avatar: string; // Emoji
  level: 'nursery' | 'class1';
  stars: number;
  streak: number;
  lastVisit: string;
  completedLessons: string[];
}

export interface FlashCard {
  word: string;
  gujarati: string;
  pronunciation: string;
  emoji: string;
}

export interface DailyStory {
  title: string;
  content: {
    english: string;
    gujarati: string;
  }[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export interface DailyAdventureContent {
  flashcards: FlashCard[];
  story: DailyStory;
  quiz: QuizQuestion[];
}
