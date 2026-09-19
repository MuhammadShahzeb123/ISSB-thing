export interface ExtractedPhoto {
  fileName: string;
  sections: {
    id: string;
    kind: 'sentence-completion' | 'story' | 'wat' | 'lecture' | 'discussion' | 'planning' | 'biodata' | 'knowledge' | 'math' | 'guidance';
    title: string;
    language: 'en' | 'ur';
    sourcePage: string;
    seconds?: number;
    items: { prompt: string; answer?: string; detail?: string }[];
  }[];
  issues: string[];
}
