import type { Conversation } from "../../types/ai";
import { Icon } from "../common/Icon";

type Props = {
  conversations: Conversation[];
  selected: string | null;
  count: number;
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadingMore: boolean;
  disabled: boolean;
  onSelect: (id: string) => void;
  onRefresh: () => void;
  onLoadMore: () => void;
  mobileOpen: boolean;
};

export function ConversationSidebar(props: Props) {
  return (
    <aside
      id="analyst-history"
      className="analyst-history"
      data-open={props.mobileOpen}
      aria-label="Conversation history"
    >
      <div className="analyst-history-heading">
        <div>
          <p className="analyst-label">Your workspace</p>
          <h2>
            Conversations <span>{props.count}</span>
          </h2>
        </div>
        <button
          type="button"
          className="analyst-small-button"
          onClick={props.onRefresh}
          disabled={props.disabled || props.loading}
          aria-label="Refresh conversation history"
        >
          <Icon name="refresh" className="h-4 w-4" />
        </button>
      </div>
      {props.loading && (
        <p className="analyst-help" role="status">
          Loading conversations…
        </p>
      )}
      {props.error && (
        <div role="alert" className="analyst-inline-error">
          <p>{props.error}</p>
          <button
            type="button"
            onClick={props.onRefresh}
            className="analyst-text-button"
          >
            Retry loading history
          </button>
        </div>
      )}
      {!props.loading && !props.error && !props.conversations.length && (
        <div className="analyst-history-empty">
          <Icon name="chat" className="h-6 w-6" />
          <p>No conversations yet.</p>
          <span>
            Your saved analysis will appear here after your first answer.
          </span>
        </div>
      )}
      <nav aria-label="Saved conversations" className="analyst-history-list">
        {props.conversations.map((conversation) => (
          <button
            type="button"
            key={conversation.id}
            onClick={() => props.onSelect(conversation.id)}
            disabled={props.disabled}
            aria-current={
              props.selected === conversation.id ? "true" : undefined
            }
            className="analyst-history-item"
          >
            <Icon name="chat" className="h-4 w-4 shrink-0" />
            <span>
              <strong>{conversation.title}</strong>
              <time dateTime={conversation.updated_at}>
                {new Date(conversation.updated_at).toLocaleDateString(
                  undefined,
                  { month: "short", day: "numeric" },
                )}
              </time>
            </span>
          </button>
        ))}
      </nav>
      {props.hasMore && (
        <button
          type="button"
          className="analyst-text-button analyst-load-more"
          onClick={props.onLoadMore}
          disabled={props.disabled || props.loadingMore}
        >
          {props.loadingMore ? "Loading…" : "Load more conversations"}
        </button>
      )}
      <p className="analyst-history-privacy">
        <Icon name="lock" className="h-3.5 w-3.5 shrink-0" />
        Conversations belong to your account.
      </p>
    </aside>
  );
}
