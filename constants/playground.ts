import { Preset, ModelType, Model } from "@/types/playground";

export const presets: Preset[] = [
  {
    id: "9cb0e66a-9937-465d-a188-2c4c4ae2401f",
    name: "Completion",
    prompt:
      "The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.",
  },
  {
    id: "48d34082-72f3-4a1b-a14d-f15aca4f57a0",
    name: "Embedding",
    prompt:
      "The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.",
  },
  {
    id: "dfd42fd5-0394-4810-92c6-cc907d3bfd1a",
    name: "Chat",
    prompt:
      "The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.",
  },
];

export const models: Model<ModelType>[] = [
  {
    id: "be638fb1-973b-4471-a49c-290325085802",
    name: "gpt-35-turbo",
    description:
      "GPT-3 を基に改善され、自然言語とコードを理解し、生成できるモデルのセット。最大4k(4096)トークン処理できる。",
    type: "GPT-3.5-turbo",
    strengths:
      "GPT-4, GPT-3.5-16kトークンよりコスト効率が高く、高速に補完やチャットができる",
  },
  {
    id: "b43c0ea9-5ad4-456a-ae29-26cd77b6d0fb",
    name: "gpt-3.5-turbo-16k",
    description:
      "GPT-3 を基に改善され、自然言語とコードを理解し、生成できるモデルのセット。最大16k(16,384)トークン処理できる。",
    type: "GPT-3.5-turbo",
    strengths:
      "Parsing text, simple classification, address correction, keywords",
  },
  {
    id: "bbd57291-4622-4a21-9eed-dd6bd786fdd1",
    name: "Embedding",
    description:
      "テキストを数値ベクトル形式に変換して、テキストの類似性を促進できるモデルのセット。",
    type: "Embedding",
    strengths:
      "人間の言語を理解し、コンピューターが理解できる形式に変換する。類似度の計算ができる。",
  },
];
