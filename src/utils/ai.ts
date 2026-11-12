import axios from "axios";
import type { AIMetadata, AISource, FailedTurn } from "../types/ai";
import { getApiErrorMessage } from "./apiError";

export const AI_MESSAGE_LIMIT = 4000;
export const DEMO_QUESTIONS = [
  {
    kind: "Compare teams",
    text: "Compare Ferrari and McLaren's performance.",
    icon: "trophy",
  },
  {
    kind: "Ferrari reporting",
    text: "What do the articles say about Ferrari?",
    icon: "newspaper",
  },
  {
    kind: "McLaren reporting",
    text: "What do the articles say about McLaren?",
    icon: "newspaper",
  },
  {
    kind: "Results + reporting",
    text: "Analyze McLaren's race results and related articles.",
    icon: "flag",
  },
  {
    kind: "Explore missing data",
    text: "Who won the 2030 championship?",
    icon: "search",
  },
] as const;

export function isDemoMetadata(metadata?: AIMetadata): boolean {
  return metadata?.demo === true || metadata?.mode === "demo";
}

export function sourceRoute(source: AISource): string | null {
  // Race-result UUIDs identify results, not races. Never build a race URL from one.
  if (
    source.type === "article" &&
    source.slug &&
    /^[a-zA-Z0-9_-]+$/.test(source.slug)
  ) {
    return `/articles/${encodeURIComponent(source.slug)}`;
  }
  if (
    source.type === "driver_standing" ||
    source.type === "constructor_standing"
  ) {
    return "/standings";
  }
  return null;
}

export function aiRequestError(error: unknown): FailedTurn["error"] {
  if (!axios.isAxiosError(error)) {
    return {
      message:
        "Delivery could not be confirmed. Your message may already be saved. Review your history before sending another message.",
      uncertain: true,
      action: "review",
    };
  }
  const status = error.response?.status;
  if (status === 401)
    return {
      message: "Your session expired. Please sign in again.",
      uncertain: false,
      action: "signin",
    };
  if (status === 400)
    return {
      message: getApiErrorMessage(error),
      uncertain: false,
      action: "retry",
    };
  if (status === 404)
    return {
      message:
        "This conversation is unavailable. Start a new conversation to continue.",
      uncertain: false,
      action: "new",
    };
  if (status === 409)
    return {
      message:
        "This conversation changed or reached its message limit. Reload its history, or start a new conversation.",
      uncertain: false,
      action: "reload",
    };
  if (status === 429) {
    const wait = Number(error.response?.headers["retry-after"]);
    return {
      message: `You have reached the request limit.${Number.isFinite(wait) && wait > 0 ? ` Wait about ${Math.ceil(wait / 60)} minute(s) before trying again.` : " Please wait before trying again."}`,
      uncertain: false,
      action: "retry",
    };
  }
  // A gateway timeout can occur after a request commits. Only the documented
  // Django error envelope confirms a provider failure before message persistence.
  const data = error.response?.data;
  const rejectedByBackend =
    data &&
    typeof data === "object" &&
    data.success === false &&
    "errors" in data;
  if ((status === 503 || status === 504) && rejectedByBackend) {
    return {
      message:
        status === 503
          ? "The analyst is unavailable right now. Your message was not saved. Please try again later."
          : "The analyst timed out before saving an answer. You can try again.",
      uncertain: false,
      action: "retry",
    };
  }
  return {
    message:
      "Connection lost or delivery timed out. Your message may already be saved. Review your conversation history; this request will not be sent again automatically.",
    uncertain: true,
    action: "review",
  };
}
