export type GptLabel = "一軍" | "二軍" | "保管";
export type PromptStatus = "一軍" | "未検証" | "要アレンジ" | "二軍" | "保管";

export interface GptItem {
  id: string;
  name: string;
  category: string;
  useCase: string;
  starter: string;
  relatedPrompts: string[];
  label: GptLabel;
  favorite: boolean;
  url: string;
  addedAt: string;
  sortOrder?: number;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface PromptItem {
  id: string;
  name: string;
  category: string;
  useCase: string;
  body: string;
  status: PromptStatus;
  source: string;
  relatedGpt: string;
  favorite: boolean;
  addedAt: string;
  sortOrder?: number;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface ResourceLink {
  id: string;
  name: string;
  url: string;
  category: string;
  description: string;
  tags: string[];
  favorite: boolean;
  addedAt: string;
  sortOrder?: number;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface CategoryItem { id: string; kind: "gpt" | "prompt"; name: string; sortOrder: number; }
export interface SiteSettings { siteName: string; subcopy: string; }
export interface AuditLog { id: number; tableName: string; recordId: string; action: string; changedBy: string; createdAt: string; }
