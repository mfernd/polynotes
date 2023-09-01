export type Time = {
  uuid?: string;
  project: string;
  description: string;
  startingTime: number; // in seconds
  duration: number; // same
}

export type ProjectStat = {
  project: string;
  count: number;
  duration: number; // in seconds
};

export type StatsSanitized = {
  counts: [string, number][];
  durations: [string, number][];
};
