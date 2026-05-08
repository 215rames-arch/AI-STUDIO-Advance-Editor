export type MediaStatus = "idle" | "uploading" | "analyzing" | "editing" | "completed";

export interface MediaProject {
  id: string;
  name: string;
  type: "video" | "photo" | "audio";
  status: MediaStatus;
  originalUrl: string;
  editedUrl?: string;
  plan?: string;
  timestamp: string;
}

export interface EditingPlan {
  filters: string[];
  music: string;
  cuts: string[];
  voiceover?: string;
}
