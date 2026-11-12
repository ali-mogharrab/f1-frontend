import { Fragment, useId, useState } from "react";
import type { AIMessage } from "../../types/ai";
import { Icon } from "../common/Icon";
import { DemoModeIndicator } from "./DemoModeIndicator";
import { MessageSources } from "./MessageSources";

export function ChatMessage({
  message,
  pending = false,
}: {
  message: AIMessage;
  pending?: boolean;
}) {
  const prefix = useId().replaceAll(":", "");
  const [expanded, setExpanded] = useState(message.sources.length <= 3);
  const assistant = message.role === "assistant";
  function showSource(index: number) {
    setExpanded(true);
    requestAnimationFrame(() =>
      document.getElementById(`${prefix}-source-${index + 1}`)?.focus(),
    );
  }
  // Plain React text only: no HTML injection, Markdown URL interpretation, or
  // links derived from unverified inline IDs. Verified references become buttons.
  const parts = message.content.split(/(\[[a-z_]+:[^\]\s]+\])/g);
  return (
    <article
      className={`analyst-message ${assistant ? "analyst-message--assistant" : "analyst-message--user"}`}
      aria-label={assistant ? "Analyst message" : "Your message"}
    >
      <div className="analyst-avatar">
        <Icon name={assistant ? "analyst" : "user"} className="h-4 w-4" />
      </div>
      <div className="analyst-message-main">
        <div className="analyst-message-byline">
          <strong>{assistant ? "F1 Analyst" : "You"}</strong>
          {assistant && (
            <DemoModeIndicator metadata={message.metadata} compact />
          )}
          {pending && <span>Sending…</span>}
        </div>
        <div className="analyst-message-text">
          {parts.map((part, key) => {
            if (!assistant || !/^\[[a-z_]+:[^\]\s]+\]$/.test(part))
              return <Fragment key={key}>{part}</Fragment>;
            const index = message.sources.findIndex(
              (source) => source.id === part.slice(1, -1),
            );
            return index < 0 ? (
              <span key={key} className="analyst-missing-source">
                [source unavailable]
              </span>
            ) : (
              <button
                key={key}
                type="button"
                className="analyst-citation"
                onClick={() => showSource(index)}
                aria-label={`Show source ${index + 1}: ${message.sources[index].title}`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
        {assistant && message.metadata.insufficient_evidence && (
          <p className="analyst-evidence-note">
            Insufficient evidence · Missing records are unknown, not zero.
          </p>
        )}
        {assistant && (
          <MessageSources
            sources={message.sources}
            prefix={prefix}
            expanded={expanded}
            onToggle={() => setExpanded((value) => !value)}
          />
        )}
      </div>
    </article>
  );
}
