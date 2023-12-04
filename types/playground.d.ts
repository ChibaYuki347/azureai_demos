export interface Preset {
  id: string;
  name: string;
  prompt?: string;
}

export const types = ["GPT-3.5-turbo", "Embedding"] as const;

export type ModelType = (typeof types)[number];

export interface Model<Type = string> {
  id: string;
  name: string;
  description: string;
  strengths?: string;
  type: Type;
}
