import { useState } from "react";
import { useSearchParams } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useAIAnalyst } from "../hooks/useAIAnalyst";
import { AI_MESSAGE_LIMIT, isDemoMetadata } from "../utils/ai";
import { getApiErrorMessage } from "../utils/apiError";
import { Icon } from "../components/common/Icon";
import { PageHeader } from "../components/common/PageHeader";
import { ChatInput } from "../components/ai/ChatInput";
import { ChatTimeline } from "../components/ai/ChatTimeline";
import { ConversationSidebar } from "../components/ai/ConversationSidebar";
import { DemoModeIndicator } from "../components/ai/DemoModeIndicator";
import { SuggestedQuestions } from "../components/ai/SuggestedQuestions";
import "../components/ai/analyst.css";

export function AIAnalystPage() {
  const { user } = useAuth();
  const [params] = useSearchParams();
  return user ? <AnalystWorkspace key={`${user.id}:${params.get("conversation") ?? "new"}`} userId={user.id} /> : null;
}

function AnalystWorkspace({ userId }: { userId: string }) {
  const ai = useAIAnalyst(userId);
  const [historyOpen, setHistoryOpen] = useState(false);
  const conversations = [
    ...new Map(
      (ai.history.data?.pages.flatMap((page) => page.results) ?? []).map(
        (item) => [item.id, item],
      ),
    ).values(),
  ];
  const demo = isDemoMetadata(ai.metadata);
  const loadingDetail = Boolean(ai.conversationId) && ai.detail.isPending;
  const unavailable =
    Boolean(ai.conversationId) && ai.detail.isError && !ai.detail.data;
  const disabled =
    loadingDetail ||
    unavailable ||
    ai.full ||
    Boolean(ai.failure && ai.failure.error.action !== "retry");
  const status = ai.busy
    ? "Preparing an answer…"
    : loadingDetail
      ? "Loading conversation…"
      : ai.failure
        ? "Your attention is needed"
        : ai.full
          ? "Conversation complete"
          : "Ready for your question";

  function chooseQuestion(text: string) {
    ai.setDraft(text);
    document.getElementById("analyst-message")?.focus();
  }

  return (
    <section aria-label="F1 AI Analyst" className="analyst-page">
      <div className="analyst-page-heading">
        <PageHeader
          eyebrow="The analysis desk"
          title="F1 AI Analyst"
          description="Go beyond the classification. Explore race results, compare performance, and connect the numbers with published reporting."
        />
        <span className="analyst-heading-mark" aria-hidden="true">
          <Icon name="analyst" className="h-8 w-8" />
        </span>
      </div>
      <DemoModeIndicator metadata={ai.metadata} />
      <div className="analyst-workspace surface-panel">
        <div className="analyst-workspace-bar">
          <div className="analyst-workspace-title">
            <span className="analyst-status-dot" aria-hidden="true" />
            <span>{ai.detail.data?.title ?? "New conversation"}</span>
          </div>
          <div className="analyst-workspace-actions">
            <button
              type="button"
              className="analyst-mobile-history analyst-secondary-button"
              onClick={() => setHistoryOpen((value) => !value)}
              aria-controls="analyst-history"
              aria-expanded={historyOpen}
            >
              <Icon name="chat" className="h-4 w-4" />
              History
            </button>
            <button
              type="button"
              className="analyst-secondary-button"
              onClick={() => {
                ai.selectConversation(null);
                setHistoryOpen(false);
                requestAnimationFrame(() =>
                  document.getElementById("analyst-message")?.focus(),
                );
              }}
              disabled={ai.busy}
            >
              <span aria-hidden="true">
                <Icon name="plus" className="h-4 w-4" />
              </span>
              New conversation
            </button>
          </div>
        </div>
        <div className="analyst-workspace-body">
          <ConversationSidebar
            conversations={conversations}
            selected={ai.conversationId}
            count={ai.history.data?.pages[0]?.count ?? 0}
            loading={ai.history.isPending}
            error={
              ai.history.error ? getApiErrorMessage(ai.history.error) : null
            }
            hasMore={ai.history.hasNextPage}
            loadingMore={ai.history.isFetchingNextPage}
            disabled={ai.busy}
            mobileOpen={historyOpen}
            onSelect={(id) => {
              ai.selectConversation(id);
              setHistoryOpen(false);
              requestAnimationFrame(() =>
                document
                  .getElementById("analyst-messages")
                  ?.focus({ preventScroll: true }),
              );
            }}
            onRefresh={() => {
              void ai.history.refetch();
            }}
            onLoadMore={() => {
              void ai.history.fetchNextPage();
            }}
          />
          <div className="analyst-room" data-history-open={historyOpen}>
            <ChatTimeline
              key={ai.conversationId ?? "new"}
              messages={ai.messages}
              pendingText={ai.pendingText}
            >
              {loadingDetail && (
                <p className="analyst-read-state" role="status">
                  Loading your saved messages…
                </p>
              )}
              {ai.detail.isError && (
                <div
                  className="analyst-read-state analyst-inline-error"
                  role="alert"
                >
                  <p>
                    {unavailable
                      ? "This conversation could not be loaded. It may be unavailable or the connection may have failed."
                      : "Saved history could not be refreshed. The answer below was confirmed by the server."}
                  </p>
                  <button
                    type="button"
                    className="analyst-text-button"
                    onClick={() => {
                      void ai.detail.refetch();
                    }}
                  >
                    Retry loading conversation
                  </button>
                </div>
              )}
              {!ai.conversationId && ai.messages.length === 0 && !ai.busy && (
                <div className="analyst-welcome">
                  <div className="analyst-welcome-icon">
                    <Icon name="analyst" className="h-8 w-8" />
                  </div>
                  <p className="analyst-label">A closer look at the grid</p>
                  <h2>
                    Every result has a story.
                    <br />
                    <span>Start with a question.</span>
                  </h2>
                  <p>
                    Ask about the data on this site. Answers include the records
                    and articles used, so you can explore the evidence yourself.
                  </p>
                  <SuggestedQuestions
                    onSelect={chooseQuestion}
                    disabled={disabled}
                    demo={demo}
                  />
                </div>
              )}
            </ChatTimeline>
            {ai.failure && (
              <div className="analyst-failure" role="alert">
                <strong>
                  {ai.failure.error.uncertain
                    ? "Delivery not confirmed"
                    : "Message not sent"}
                </strong>
                <p>{ai.failure.error.message}</p>
                <div>
                  {ai.failure.error.action === "retry" && (
                    <button
                      type="button"
                      className="analyst-text-button"
                      onClick={() => {
                        void ai.send(ai.failure!.text);
                      }}
                      disabled={ai.busy}
                    >
                      Try again
                    </button>
                  )}
                  {(ai.failure.error.action === "review" ||
                    ai.failure.error.action === "reload") && (
                    <button
                      type="button"
                      className="analyst-text-button"
                      onClick={() => {
                        setHistoryOpen(true);
                        void ai.reviewSavedMessages();
                      }}
                      disabled={ai.reviewing}
                    >
                      {ai.reviewing
                        ? "Checking saved messages…"
                        : "Check saved messages"}
                    </button>
                  )}
                </div>
              </div>
            )}
            <ChatInput
              value={ai.draft}
              onChange={ai.setDraft}
              onSend={() => {
                void ai.send();
              }}
              disabled={disabled}
              busy={ai.busy}
              reason={
                ai.full
                  ? "This conversation reached its 100-message limit. Start a new conversation."
                  : ai.failure?.error.uncertain
                    ? "Sending is paused. Check saved messages before starting another turn."
                    : unavailable
                      ? "Reopen a saved conversation or start a new one."
                      : undefined
              }
            />
          </div>
        </div>
      </div>
      <div className="analyst-page-footer">
        <span role="status" aria-live="polite">
          {status}
        </span>
        <span>
          Read-only analysis<span aria-hidden="true"> · </span>
          {AI_MESSAGE_LIMIT.toLocaleString()} characters per question
        </span>
      </div>
      {ai.conversationId && demo && (
        <details className="analyst-followups">
          <summary>Explore supported demo questions</summary>
          <SuggestedQuestions
            onSelect={chooseQuestion}
            disabled={disabled || ai.busy}
            demo
          />
        </details>
      )}
    </section>
  );
}
