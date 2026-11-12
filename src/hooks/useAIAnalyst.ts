import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import {
  getAIConversation,
  getAIConversations,
  sendAIMessage,
} from "../api/aiApi";
import { useAuth } from "../context/AuthContext";
import type {
  AIMessage,
  ConversationDetail,
  FailedTurn,
} from "../types/ai";
import { AI_MESSAGE_LIMIT, aiRequestError } from "../utils/ai";

export function useAIAnalyst(userId: string) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [params, setParams] = useSearchParams();
  const conversationId = params.get("conversation");
  const [draft, setDraft] = useState("");
  const [pendingText, setPendingText] = useState<string | null>(null);
  const [pendingConversationId, setPendingConversationId] = useState<
    string | null
  >(null);
  const [failure, setFailure] = useState<FailedTurn | null>(null);
  const [reviewing, setReviewing] = useState(false);
  const inFlight = useRef(false);
  const mounted = useRef(true);
  const selectedConversation = useRef(conversationId);
  useEffect(() => {
    selectedConversation.current = conversationId;
  }, [conversationId]);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const listKey = ["ai", userId, "conversations"];
  const detailKey = (id: string | null) => ["ai", userId, "conversation", id];
  const history = useInfiniteQuery({
    queryKey: listKey,
    initialPageParam: 1,
    queryFn: ({ pageParam, signal }) => getAIConversations(pageParam, signal),
    getNextPageParam: (last, _pages, page) =>
      last.next ? page + 1 : undefined,
    retry: false,
    refetchOnWindowFocus: false,
  });
  const detail = useQuery({
    queryKey: detailKey(conversationId),
    queryFn: ({ signal }) => getAIConversation(conversationId!, signal),
    enabled: Boolean(conversationId),
    retry: false,
    refetchOnWindowFocus: false,
  });
  const mutation = useMutation({ mutationFn: sendAIMessage, retry: false });
  const messages = detail.data?.messages ?? [];
  const latestAssistant = messages.findLast(
    (message) => message.role === "assistant",
  );
  const metadata = latestAssistant?.metadata;
  const sessionExpired = [history.error, detail.error].some(
    (error) => error && aiRequestError(error).action === "signin",
  );

  useEffect(() => {
    if (sessionExpired) {
      logout("expired");
      queryClient.clear();
      navigate("/login", {
        replace: true,
        state: { from: "/ai-analyst", reason: "session-expired" },
      });
    }
  }, [sessionExpired, logout, navigate, queryClient, userId]);

  async function send(text = draft) {
    const trimmed = text.trim();
    if (
      inFlight.current ||
      (failure && failure.error.action !== "retry") ||
      messages.length >= 100 ||
      !trimmed ||
      text.length > AI_MESSAGE_LIMIT ||
      (conversationId && !detail.data)
    )
      return;
    inFlight.current = true;
    const previous = detail.data;
    const previousMessages = previous?.messages ?? [];
    const lastSequence = previousMessages.at(-1)?.sequence ?? -1;
    setPendingText(trimmed);
    setPendingConversationId(conversationId);
    setFailure(null);
    setDraft("");
    try {
      const answer = await mutation.mutateAsync({
        message: trimmed,
        ...(conversationId ? { conversation_id: conversationId } : {}),
      });
      if (!mounted.current) return;
      if (selectedConversation.current !== conversationId) {
        void queryClient.invalidateQueries({ queryKey: listKey });
        return;
      }
      const now = new Date().toISOString();
      const localMessages: AIMessage[] = [
        {
          id: `local-user-${lastSequence + 1}`,
          role: "user",
          content: trimmed,
          sources: [],
          metadata: {},
          sequence: lastSequence + 1,
          created_at: now,
        },
        {
          id: `local-assistant-${lastSequence + 2}`,
          role: "assistant",
          content: answer.answer,
          sources: answer.sources,
          metadata: answer.metadata,
          sequence: lastSequence + 2,
          created_at: now,
        },
      ];
      queryClient.setQueryData<ConversationDetail>(
        detailKey(answer.conversation_id),
        {
          id: answer.conversation_id,
          title: previous?.title ?? trimmed.slice(0, 100),
          created_at: previous?.created_at ?? now,
          updated_at: now,
          messages: [...previousMessages, ...localMessages],
        },
      );
      setParams({ conversation: answer.conversation_id }, { replace: true });
      // Canonical GET replaces the optimistic IDs; never append the same turn twice.
      void queryClient.invalidateQueries({
        queryKey: detailKey(answer.conversation_id),
      });
      void queryClient.invalidateQueries({ queryKey: listKey });
    } catch (error) {
      if (!mounted.current || selectedConversation.current !== conversationId)
        return;
      const parsed = aiRequestError(error);
      if (parsed.action === "signin") {
        logout("expired");
        queryClient.clear();
        navigate("/login", {
          replace: true,
          state: { from: "/ai-analyst", reason: "session-expired" },
        });
      } else {
        setFailure({
          text: trimmed,
          conversationId,
          lastSequence,
          error: parsed,
        });
        setDraft(trimmed);
      }
    } finally {
      inFlight.current = false;
      if (mounted.current) setPendingText(null);
    }
  }

  function selectConversation(id: string | null) {
    if (inFlight.current) return;
    setParams(id ? { conversation: id } : {});
    setDraft("");
    setFailure(null);
  }

  async function reviewSavedMessages() {
    setReviewing(true);
    try {
      await history.refetch();
      if (conversationId) {
        const saved = await queryClient.fetchQuery({
          queryKey: detailKey(conversationId),
          queryFn: ({ signal }) => getAIConversation(conversationId, signal),
          staleTime: 0,
        });
        if (!mounted.current || selectedConversation.current !== conversationId)
          return;
        const recovered =
          failure &&
          saved.messages.some(
            (message, index) =>
              message.role === "user" &&
              message.sequence > failure.lastSequence &&
              message.content === failure.text &&
              saved.messages[index + 1]?.role === "assistant",
          );
        if (recovered) {
          setFailure(null);
          setDraft("");
        } else if (failure && !failure.error.uncertain) setFailure(null);
      }
    } catch {
      // Query errors are displayed by the existing history/detail error panels.
    } finally {
      if (mounted.current) setReviewing(false);
    }
  }

  return {
    conversationId,
    draft,
    setDraft: (value: string) => {
      setDraft(value);
      if (failure?.error.action === "retry") setFailure(null);
    },
    messages,
    metadata,
    pendingText: pendingConversationId === conversationId ? pendingText : null,
    failure,
    history,
    detail,
    reviewing,
    send,
    selectConversation,
    reviewSavedMessages,
    busy: pendingText !== null,
    full: messages.length >= 100,
  };
}
