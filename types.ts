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
