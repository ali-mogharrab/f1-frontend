import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import type { AIMessage } from "../../types/ai";
import { Icon } from "../common/Icon";
import { ChatMessage } from "./ChatMessage";

export function ChatTimeline({
  messages,
  pendingText,
  children,
}: {
  messages: AIMessage[];
  pendingText: string | null;
  children?: ReactNode;
}) {
  const viewport = useRef<HTMLDivElement>(null);
  const following = useRef(true);
  const [atBottom, setAtBottom] = useState(true);
  useLayoutEffect(() => {
    if (
      viewport.current &&
      following.current &&
      (messages.length > 0 || pendingText !== null)
    )
      viewport.current.scrollTop = viewport.current.scrollHeight;
  }, [messages.length, pendingText]);
  return (
    <div className="analyst-timeline-wrap">
      <div
        className="analyst-timeline"
        id="analyst-messages"
        ref={viewport}
        role="region"
        aria-label="Conversation messages"
        tabIndex={0}
        onScroll={(event) => {
          const element = event.currentTarget;
          following.current =
            element.scrollHeight - element.scrollTop - element.clientHeight <
            80;
          setAtBottom(following.current);
        }}
      >
        {children}
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {pendingText !== null && (
          <>
            <ChatMessage
              pending
              message={{
                id: "pending",
                role: "user",
                content: pendingText,
                sources: [],
                metadata: {},
                sequence: -1,
                created_at: "",
              }}
            />
            <div className="analyst-waiting" role="status">
              <Icon name="analyst" className="h-5 w-5" />
              <span>Preparing an answer from available evidence…</span>
              <span className="analyst-loading-dot" aria-hidden="true" />
            </div>
          </>
        )}
      </div>
      {!atBottom && (
        <button
          type="button"
          className="analyst-jump"
          onClick={() => {
            following.current = true;
            setAtBottom(true);
            if (viewport.current)
              viewport.current.scrollTop = viewport.current.scrollHeight;
          }}
        >
          Latest messages ↓
        </button>
      )}
    </div>
  );
}
