import type { AIMetadata } from "../../types/ai";
import { isDemoMetadata } from "../../utils/ai";

export function DemoModeIndicator({
  metadata,
  compact = false,
}: {
  metadata?: AIMetadata;
  compact?: boolean;
}) {
  if (!isDemoMetadata(metadata)) return null;
  const badge = (
    <span className="analyst-demo-badge">
      <span aria-hidden="true" />
      Offline Demo
    </span>
  );
  return compact ? (
    badge
  ) : (
    <div className="analyst-demo-notice">
      {badge}
      <p>
        Scripted demonstration with synthetic F1 data and lexical demo vectors.
        This is not LLM reasoning or production semantic search. The 2030
        example demonstrates missing information.
      </p>
    </div>
  );
}
