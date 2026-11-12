import { useRef } from "react";
import { AI_MESSAGE_LIMIT } from "../../utils/ai";
import { Icon } from "../common/Icon";

type Props = {
  value: string;
  onChange: (text: string) => void;
  onSend: () => void;
  disabled: boolean;
  busy: boolean;
  reason?: string;
};

export function ChatInput({
  value,
  onChange,
  onSend,
  disabled,
  busy,
  reason,
}: Props) {
  const composition = useRef(false);
  return (
    <form
      className="analyst-composer"
      onSubmit={(event) => {
        event.preventDefault();
        if (!disabled && !busy && value.trim()) onSend();
      }}
    >
      <label htmlFor="analyst-message" className="sr-only">
        Your question
      </label>
      <div className="analyst-input-wrap">
        <textarea
          id="analyst-message"
          value={value}
          rows={2}
          maxLength={AI_MESSAGE_LIMIT}
          placeholder="Ask about F1 results or published articles…"
          disabled={disabled || busy}
          onChange={(event) => onChange(event.target.value)}
          onCompositionStart={() => {
            composition.current = true;
          }}
          onCompositionEnd={() => {
            composition.current = false;
          }}
          onKeyDown={(event) => {
            if (
              event.key === "Enter" &&
              !event.shiftKey &&
              !event.nativeEvent.isComposing &&
              !composition.current
            ) {
              event.preventDefault();
              if (!disabled && !busy && value.trim()) onSend();
            }
          }}
          aria-describedby="analyst-input-help analyst-input-count"
        />
        <button
          type="submit"
          className="action-button analyst-send"
          disabled={
            disabled || busy || !value.trim() || value.length > AI_MESSAGE_LIMIT
          }
          aria-label={busy ? "Waiting for answer" : "Send message"}
        >
          <Icon name="arrow-right" className="h-5 w-5" />
          <span className="hidden sm:inline">{busy ? "Waiting" : "Send"}</span>
        </button>
      </div>
      <div className="analyst-input-meta">
        <p id="analyst-input-help">
          {reason ?? "Enter to send · Shift + Enter for a new line"}
        </p>
        <span id="analyst-input-count">
          {value.length.toLocaleString()} / {AI_MESSAGE_LIMIT.toLocaleString()}
        </span>
      </div>
      <p className="analyst-help">
        Check the sources. Answers reflect stored data, not a live internet
        search.
      </p>
    </form>
  );
}
