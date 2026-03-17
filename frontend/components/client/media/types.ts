export interface MediaItem {
  id: string;
  title: string;
  type: 'image' | 'video';
  url: string; // Direct link or YouTube URL
  thumbnail?: string; // Preview image
}

export interface Folder {
  id: string;
  name: string;
  tag: string;
  mediaCount: number;
  lastUpdated: string;
  coverImage: string;
  /** NEW – the actual files inside the folder */
  media?: MediaItem[];
}
