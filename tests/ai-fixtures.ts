import type { Page, Route } from "@playwright/test";
import type {
  AIMetadata,
  AISource,
  ChatRequest,
  ConversationDetail,
} from "../src/types/ai";

export const id = "11111111-1111-4111-8111-111111111111";
export const question = "Compare Ferrari and McLaren's performance.";
export const articleQuestion = "What do the articles say about Ferrari?";
export const hybridQuestion =
  "Analyze McLaren's race results and related articles.";
export const metadata: AIMetadata = {
  demo: true,
  mode: "demo",
  data_provenance: "synthetic_demo",
  insufficient_evidence: false,
  tool_calls: ["get_constructor_standings"],
};
export const articleSource: AISource = {
  id: "article_chunk:aaaa",
  type: "article",
  entity_id: "article-uuid",
  chunk_id: "aaaa",
  title: "DEMO: Ferrari race pace notebook",
  slug: "demo-ferrari-race-pace",
  url: "/articles/demo-ferrari-race-pace",
  api_url: "/api/content/articles/article-uuid/",
};
export const standingSource: AISource = {
  id: "constructor_standing:bbbb",
  type: "constructor_standing",
  entity_id: "standing-uuid",
  title: "2026 Ferrari standings",
  api_url: "/api/standings/constructors/standing-uuid/",
};
export const raceSource: AISource = {
  id: "race_result:cccc",
  type: "race_result",
  entity_id: "result-uuid",
  title: "Casey Example — DEMO Grand Prix",
  api_url: "/api/racing/race-results/result-uuid/",
};

export const user = {
  id: "user-one",
  username: "analyst",
  full_name: "Analyst",
  is_staff: false,
  profile: {},
};
export function envelope<T>(data: T) {
  return { success: true, message: "Success.", data };
}
export function rejected(message: string) {
  return { success: false, message, errors: null };
}
export function conversation(conversationId = id): ConversationDetail {
  return {
    id: conversationId,
    title: question,
    created_at: "2026-11-09T12:00:00Z",
    updated_at: "2026-11-09T12:00:00Z",
    messages: [],
  };
}

export async function authenticate(page: Page) {
  await page.addInitScript(() => {
    localStorage.setItem("f1_access_token", "test-access");
    localStorage.setItem("f1_refresh_token", "test-refresh");
    localStorage.setItem("f1_theme", "dark");
  });
}

export async function mockAnalyst(
  page: Page,
  options: {
    answer?: string;
    sources?: AISource[];
    metadata?: AIMetadata;
    delay?: number;
    initial?: ConversationDetail[];
    chat?: (route: Route, state: State) => Promise<void>;
  } = {},
) {
  const state: State = { posts: [], conversations: options.initial ?? [] };
  await page.route(
    (url) => url.pathname.startsWith("/api/"),
    async (route) => {
      const url = new URL(route.request().url());
      const path = url.pathname;
      if (path === "/api/users/me/")
        return route.fulfill({ json: envelope(user) });
      if (path === "/api/ai/conversations/") {
        const pageNumber = Number(url.searchParams.get("page") ?? "1");
        const list = state.conversations.slice(
          (pageNumber - 1) * 20,
          pageNumber * 20,
        );
        return route.fulfill({
          json: {
            count: state.conversations.length,
            next:
              pageNumber * 20 < state.conversations.length
                ? "/api/ai/conversations/?page=2"
                : null,
            previous: null,
            results: list.map((item) => ({
              id: item.id,
              title: item.title,
              created_at: item.created_at,
              updated_at: item.updated_at,
            })),
          },
        });
      }
      if (path.startsWith("/api/ai/conversations/")) {
        const detail = state.conversations.find((item) =>
          path.endsWith(`/${item.id}/`),
        );
        return route.fulfill({
          status: detail ? 200 : 404,
          json: detail ? envelope(detail) : rejected("Not found."),
        });
      }
      if (path === "/api/ai/chat/") {
        state.posts.push(route.request().postDataJSON() as ChatRequest);
        if (options.chat) return options.chat(route, state);
        if (options.delay)
          await new Promise((resolve) => setTimeout(resolve, options.delay));
        return completeChat(route, state, options);
      }
      return route.fulfill({ status: 404, json: rejected("Not found.") });
    },
  );
  return state;
}

export type State = {
  posts: ChatRequest[];
  conversations: ConversationDetail[];
};

export async function completeChat(
  route: Route,
  state: State,
  options: {
    answer?: string;
    sources?: AISource[];
    metadata?: AIMetadata;
  } = {},
) {
  const payload = route.request().postDataJSON() as ChatRequest;
  const detail =
    state.conversations.find((item) => item.id === payload.conversation_id) ??
    conversation();
  if (!state.conversations.includes(detail)) {
    detail.title = payload.message.slice(0, 100);
    state.conversations.unshift(detail);
  }
  const sources = options.sources ?? [standingSource];
  const answer =
    options.answer ??
    `Synthetic fixture snapshot: Ferrari has 94.00 points [${standingSource.id}].`;
  const mode = options.metadata ?? metadata;
  const sequence = detail.messages.length;
  detail.messages.push(
    {
      id: `user-${sequence}`,
      role: "user",
      content: payload.message,
      sources: [],
      metadata: {},
      sequence,
      created_at: detail.created_at,
    },
    {
      id: `assistant-${sequence}`,
      role: "assistant",
      content: answer,
      sources,
      metadata: mode,
      sequence: sequence + 1,
      created_at: detail.created_at,
    },
  );
  await route.fulfill({
    json: envelope({
      conversation_id: detail.id,
      answer,
      sources,
      metadata: mode,
    }),
  });
}
