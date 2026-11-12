import { Link } from "react-router";
import type { AISource } from "../../types/ai";
import { sourceRoute } from "../../utils/ai";
import { Icon } from "../common/Icon";

const labels = {
  article: "Published article",
  race_result: "Race result record",
  driver_standing: "Driver standings record",
  constructor_standing: "Constructor standings record",
};

export function MessageSources({
  sources,
  prefix,
  expanded,
  onToggle,
}: {
  sources: AISource[];
  prefix: string;
  expanded: boolean;
  onToggle: () => void;
}) {
  if (!sources.length) return null;
  return (
    <div className="analyst-sources">
      <button
        type="button"
        className="analyst-sources-toggle"
        onClick={onToggle}
        aria-expanded={expanded}
        aria-controls={`${prefix}-sources`}
      >
        <Icon name="newspaper" className="h-4 w-4" />
        {sources.length} {sources.length === 1 ? "source" : "sources"}
        <span aria-hidden="true">{expanded ? "−" : "+"}</span>
      </button>
      <ol
        id={`${prefix}-sources`}
        className="analyst-source-list"
        hidden={!expanded}
      >
        {sources.map((source, index) => {
          const route = sourceRoute(source);
          return (
            <li
              key={source.id}
              id={`${prefix}-source-${index + 1}`}
              tabIndex={-1}
              className="analyst-source-card"
            >
              <span className="analyst-source-number">{index + 1}</span>
              <div>
                <span className="analyst-source-kind">
                  {labels[source.type] ?? "Source"}
                </span>
                {route ? (
                  <Link to={route}>
                    {source.title}
                    <span className="sr-only">
                      {" "}
                      —{" "}
                      {source.type === "article"
                        ? "read article"
                        : "view standings"}
                    </span>
                  </Link>
                ) : (
                  <p>{source.title}</p>
                )}
              </div>
              {route && (
                <Icon name="arrow-right" className="h-3.5 w-3.5 shrink-0" />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
