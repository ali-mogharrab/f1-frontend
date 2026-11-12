export type AISource = {
  id: string;
  type: "article" | "race_result" | "driver_standing" | "constructor_standing";
  entity_id: string;
  title: string;
  api_url: string;
  url?: string;
  slug?: string;
  chunk_id?: string;
  published_at?: string;
};

export type AIMetadata = {
  mode?: string;
  demo?: boolean;
  data_provenance?: string;
  model?: string;
  insufficient_evidence?: boolean;
  citation_validation_failed?: boolean;
  tool_calls?: string[];
  input_tokens?: number;
  output_tokens?: number;
};

export type AIMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources: AISource[];
  metadata: AIMetadata;
  sequence: number;
  created_at: string;
};

export type Conversation = {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
};

export type ConversationDetail = Conversation & { messages: AIMessage[] };

export type ChatRequest = { message: string; conversation_id?: string };
export type ChatAnswer = {
  conversation_id: string;
  answer: string;
  sources: AISource[];
  metadata: AIMetadata;
};

export type FailedTurn = {
  text: string;
  conversationId: string | null;
  lastSequence: number;
  error: {
    message: string;
    uncertain: boolean;
    action: "retry" | "review" | "reload" | "new" | "signin";
  };
};
