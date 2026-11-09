/**
 * The seven topics of the dbt Analytics Engineering Certification exam for dbt Core 1.11, named as in the
 * dbt Labs study guide: https://www.getdbt.com/dbt-assets/certifications/dbt-certificate-study-guide-version-1-11
 *
 * `subtopicCount` is the number of sub-topics the guide lists under each topic. dbt Labs publishes no topic
 * weights, so the mock exam weights each topic by this count. See the guide for the sub-topics themselves.
 */
export const EXAM_TOPICS = [
  { name: "Developing and optimizing dbt models", short: "Develop", color: "bg-teal-50 text-teal-800 border-teal-200", subtopicCount: 14 },
  { name: "Managing dbt models governance", short: "Governance", color: "bg-indigo-50 text-indigo-800 border-indigo-200", subtopicCount: 3 },
  { name: "Debugging data modeling errors", short: "Debug", color: "bg-amber-50 text-amber-800 border-amber-200", subtopicCount: 5 },
  { name: "Troubleshooting and optimizing dbt pipelines", short: "Pipelines", color: "bg-rose-50 text-rose-800 border-rose-200", subtopicCount: 2 },
  { name: "Implementing dbt tests", short: "Tests", color: "bg-purple-50 text-purple-800 border-purple-200", subtopicCount: 3 },
  { name: "Implementing and maintaining external dependencies", short: "External deps", color: "bg-cyan-50 text-cyan-800 border-cyan-200", subtopicCount: 2 },
  { name: "Leveraging the dbt state", short: "State", color: "bg-blue-50 text-blue-800 border-blue-200", subtopicCount: 2 },
] as const;

export type Category = (typeof EXAM_TOPICS)[number]["name"];

export const CATEGORIES: Category[] = EXAM_TOPICS.map((t) => t.name);

/** Mock-exam share per topic, proportional to `subtopicCount`. */
export const TOPIC_WEIGHTS: Record<Category, number> = (() => {
  const total = EXAM_TOPICS.reduce((sum, t) => sum + t.subtopicCount, 0);
  return Object.fromEntries(EXAM_TOPICS.map((t) => [t.name, t.subtopicCount / total])) as Record<Category, number>;
})();

export const topicOf = (category: string) => EXAM_TOPICS.find((t) => t.name === category);
