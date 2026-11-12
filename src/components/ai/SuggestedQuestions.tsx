import { DEMO_QUESTIONS } from "../../utils/ai";
import { Icon } from "../common/Icon";

export function SuggestedQuestions({
  onSelect,
  disabled,
  demo,
}: {
  onSelect: (text: string) => void;
  disabled: boolean;
  demo: boolean;
}) {
  return (
    <div className="analyst-suggestions">
      <p className="analyst-label">
        {demo ? "Supported demo questions" : "Try a starting question"}
      </p>
      <div className="analyst-question-grid">
        {DEMO_QUESTIONS.map((question) => (
          <button
            type="button"
            key={question.text}
            disabled={disabled}
            onClick={() => onSelect(question.text)}
            className="analyst-question"
          >
            <span className="analyst-question-kind">
              <Icon name={question.icon} className="h-4 w-4" />
              {question.kind}
            </span>
            <span>{question.text}</span>
            <Icon name="arrow-right" className="h-4 w-4 shrink-0" />
          </button>
        ))}
      </div>
      <p className="analyst-help">
        {demo
          ? "Use these exact questions in the scripted demo. The 2030 example should report unavailable evidence."
          : "These examples also work with the optional offline demo. The response will identify its mode; data may be incomplete."}
      </p>
    </div>
  );
}
