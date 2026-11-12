import { apiClient } from "./client";
import type { PaginatedResponse } from "../types/api";
import type { SuccessResponse } from "../types/auth";
import type {
  ChatAnswer,
  ChatRequest,
  Conversation,
  ConversationDetail,
} from "../types/ai";

export async function sendAIMessage(payload: ChatRequest) {
  const response = await apiClient.post<SuccessResponse<ChatAnswer>>(
    "/ai/chat/",
    payload,
    {
      // Above the default backend's 90-second budget. A timeout is uncertain delivery.
      timeout: 120_000,
    },
  );
  return response.data.data;
}

export async function getAIConversations(page = 1, signal?: AbortSignal) {
  const response = await apiClient.get<PaginatedResponse<Conversation>>(
    "/ai/conversations/",
    {
      params: { page, page_size: 20 },
      signal,
    },
  );
  return response.data;
}

export async function getAIConversation(id: string, signal?: AbortSignal) {
  const response = await apiClient.get<SuccessResponse<ConversationDetail>>(
    `/ai/conversations/${encodeURIComponent(id)}/`,
    { signal },
  );
  return response.data.data;
}
