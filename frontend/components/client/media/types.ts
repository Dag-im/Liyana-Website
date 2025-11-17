export interface MediaItem {
  id: string;
  title: string;
  type: 'image' | 'video';
  url: string; // direct link to the file
  thumbnail?: string; // optional small preview (used for videos / docs)
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
