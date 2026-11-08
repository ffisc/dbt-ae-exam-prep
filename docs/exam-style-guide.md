# Question style guide

Rules for writing and reviewing the questions in `src/questions.ts` and `src/formatQuestions.ts`.

The questions target the dbt Analytics Engineering Certification exam for dbt Core 1.11, as described in the [dbt Labs study guide for that version](https://www.getdbt.com/dbt-assets/certifications/dbt-certificate-study-guide-version-1-11). Read the guide itself for the exam format, the topics outline and the sample questions. This file does not repeat them.

## Scope

Every question belongs to one of the seven topics in the guide's topics outline. `src/examTopics.ts` holds the topic names. A question that tests something outside the outline is out of scope and is not served, even when the guide mentions it as background. A question can still use an out-of-scope feature as its setting, for example a CI job, as long as what it tests is in the outline, for example state selection.

## Question formats

The app uses the formats the guide lists. This is how the app implements each one:

- **Multiple choice:** one stem, several options, one correct answer.
- **DOMC (discrete option multiple choice):** options appear one at a time, in random order, and the candidate answers yes or no to each, with no going back. The item ends when the correct option is accepted, the correct option is rejected, or a wrong option is accepted. See [Caveon's description of DOMC](https://caveon.com/innovations-in-testing/domc).
- **Hotspot:** the candidate clicks the part of a file or DAG that holds an error or shows a concept.
- **Build list:** the candidate puts items in order. The pool can hold items that do not belong.
- **Matching:** the candidate pairs related items, for example configs with what they do.
- **Fill in the blank:** the candidate supplies a missing term, such as a command, flag, config key or macro.

## Answer options

1. **One frame per question.** All options share a grammatical shape, so none stands out by form.
2. **Similar length.** Length must not hint at the answer. The correct option is not usually the longest.
3. **One length band per question.** Either every option is a single short claim, command or config, or every option is a two- or three-line scenario with a cause and a remedy.
4. **Plausible distractors.** Wrong options name real dbt features, flags, configs and commands applied to the wrong problem, or state a common misconception. At most one option per question may use syntax or a config key that looks right but does not exist, and it must be something a candidate could believe exists. No option is absurd or outside dbt.
5. **Plain wording.** No words that sell an option, such as "seamlessly", "dynamically" or "guarantees".
6. **No cross-references.** No "all of the above" and no reference to another option, because the app shuffles the order.
7. **Code in code font.** Commands, flags, config keys, macros, file names and column names go in backticks.

## Stems

A stem is a short scenario of one to three sentences, with an optional code block or log, followed by a direct question. It does not explain the concept being tested.

The stem states every piece of setup the answer depends on: the relevant config, the query shape, the command and its flags. When a setting could change the behaviour asked about, the stem shows that setting or says "by default". A stem is underspecified if a different, reasonable setup would make another option correct.

A code block shows the situation to reason about, such as the current code, an error or a log. It never shows the change, command or config the question asks for. In fill-in-the-blank and hotspot questions, the code around a blank or the clickable lines must not reveal the answer either: no comment naming the missing term, and no second copy of it elsewhere in the block.

## Explanations

An explanation says why the correct answer is right, then gives a one-line reason each other option is wrong. Wrong options are named by their content, never by letter or number, because the app shuffles the order.

## Evidence

Every served question has an entry in `src/evidence.ts`: a verbatim quote from the dbt docs with its page link, or the commands and observed output of a run on dbt Core 1.11. A question without evidence is not served.
