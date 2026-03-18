export type MissionVision = {
  missionTitle: string;
  missionDescription: string;
  missionIcon: string;
  visionTitle: string;
  visionDescription: string;
  visionIcon: string;
  updatedAt: string;
};

export type WhoWeAre = {
  content: string;
  updatedAt: string;
};

export type CoreValue = {
  id: string;
  title: string;
  description: string;
  icon: string;
  sortOrder: number;
};

export type Stat = {
  id: string;
  label: string;
  value: number;
  suffix: string | null;
  sortOrder: number;
};

export type QualityPolicy = {
  id: string;
  lang: string;
  goals: string[];
  sortOrder: number;
};
