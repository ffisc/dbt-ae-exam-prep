import type { ReactNode } from "react";
import { isMultipleChoice } from "../../grading";
import { Answer, Presentation, Question } from "../../types";
import BuildList from "./BuildList";
import CodeBlock from "./CodeBlock";
import Domc from "./Domc";
import FillBlank from "./FillBlank";
import Hotspot from "./Hotspot";
import Matching from "./Matching";
import MultipleChoice from "./MultipleChoice";

interface Props {
  question: Question;
  presentation: Presentation;
  answer: Answer | undefined;
  onAnswer: (answer: Answer) => void;
  revealed: boolean;
  readOnly?: boolean;
  /** DOMC reveal order, for questions presented as DOMC. */
  domcOrder?: number[];
  /** Display order for build-list pools and matching choices. */
  displayOrder?: number[];
}

const identity = (n: number) => Array.from({ length: n }, (_, i) => i);

/** Renders a question's code snippet (unless the format renders it itself) and its answer area. */
export default function QuestionBody({ question, presentation, answer, onAnswer, revealed, readOnly = false, domcOrder, displayOrder }: Props) {
  const codeRenderedByFormat = question.format === "hotspot" && question.target.kind === "code_lines";
  const common = { answer, onAnswer, revealed, readOnly };

  let body: ReactNode;
  if (isMultipleChoice(question)) {
    body =
      presentation === "domc" ? (
        <Domc question={question} order={domcOrder ?? identity(question.options.length)} {...common} />
      ) : (
        <MultipleChoice question={question} {...common} />
      );
  } else if (question.format === "fill_blank") {
    body = <FillBlank question={question} {...common} />;
  } else if (question.format === "matching") {
    body = <Matching question={question} choiceOrder={displayOrder ?? identity(question.choices.length)} {...common} />;
  } else if (question.format === "build_list") {
    const size = question.items.length + (question.distractors?.length ?? 0);
    body = <BuildList question={question} poolOrder={displayOrder ?? identity(size)} {...common} />;
  } else {
    body = <Hotspot question={question} {...common} />;
  }

  return (
    <>
      {question.codeSnippet && !codeRenderedByFormat && <CodeBlock code={question.codeSnippet} language={question.codeLanguage} />}
      {body}
    </>
  );
}
