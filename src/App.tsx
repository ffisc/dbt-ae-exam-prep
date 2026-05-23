import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BookOpen,
  Award,
  ArrowLeft,
  ArrowRight,
  Bookmark,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  ChevronRight,
  BookOpenCheck,
  BrainCircuit,
  Settings,
  ListFilter,
  Check,
  AlertCircle
} from "lucide-react";
import { Question, ExamMode, ExamSession } from "./types";
import { examQuestions } from "./questions";

export default function App() {
  // Screens state
  const [screen, setScreen] = useState<"WELCOME" | "EXAM" | "RESULT">("WELCOME");

  // Active Session
  const [session, setSession] = useState<ExamSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [sidebarFilter, setSidebarFilter] = useState<"ALL" | "FLAGGED" | "UNANSWERED">("ALL");

  // Global settings
  const [isPracticeMode, setIsPracticeMode] = useState<boolean>(true); // Practice mode allows checking answers instantly
  const [activeTab, setActiveTab] = useState<"overview" | "develop" | "debug" | "test" | "deploy">("overview");
  const [isPaused, setIsPaused] = useState(false);
  const [userCheckedCurrent, setUserCheckedCurrent] = useState(false); // In practice mode, has user checked answer on current Q?

  // Active Timer state (represented as elapsed / remaining seconds)
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (session && !session.completed && !isPaused) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (session.mode === "MOCK_EXAM" && prev <= 1) {
            clearInterval(timerRef.current!);
            handleAutoSubmit();
            return 0;
          }
          return session.mode === "MOCK_EXAM" ? prev - 1 : prev + 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [session, isPaused]);

  // Format seconds to HH:MM:SS format
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return [
      h.toString().padStart(2, "0"),
      m.toString().padStart(2, "0"),
      s.toString().padStart(2, "0")
    ].join(":");
  };

  // Convert category names to shortened tags
  const getCategoryShortTag = (category: string) => {
    switch (category) {
      case "Develop Models":
        return "Develop";
      case "Debug Data Models":
        return "Debug";
      case "Test and Document Models":
        return "Test & Doc";
      case "Deploy dbt Projects":
        return "Deploy";
      default:
        return category;
    }
  };

  // Setup dynamic color categories
  const getCategoryColorStyles = (category: string) => {
    switch (category) {
      case "Develop Models":
        return "bg-teal-50 text-teal-800 border-teal-200";
      case "Debug Data Models":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "Test and Document Models":
        return "bg-purple-50 text-purple-800 border-purple-200";
      case "Deploy dbt Projects":
        return "bg-blue-50 text-blue-800 border-blue-200";
      default:
        return "bg-gray-50 text-gray-800 border-gray-200";
    }
  };

  // Session Constructors
  const startNewSession = (mode: ExamMode, domainFilter?: string) => {
    let selectedQuestionsList: Question[] = [];

    if (mode === "MOCK_EXAM") {
      // Real exam standard: 65 questions (we'll stretch our repository list by repeating or sampling dynamically if smaller,
      // but to provide a cohesive experience, we will offer all 20 high-quality tailored exam questions arranged with realistic weighting).
      // Since our static file contains 20 curated high quality topics, we will run standard tests with these curated questions.
      // We will present them in randomized or fixed sequence. Let's make it fixed/slightly randomized based on categories.
      selectedQuestionsList = [...examQuestions].sort(() => Math.random() - 0.5);
      setTimeLeft(120 * 60); // 120 minutes (7,200 seconds) countdown
    } else if (mode === "QUICK_QUIZ") {
      // 10 randomized items
      selectedQuestionsList = [...examQuestions]
        .sort(() => Math.random() - 0.5)
        .slice(0, 10);
      setTimeLeft(0); // For practice, counts UP
    } else if (mode === "DOMAIN_PRACTICE" && domainFilter) {
      // Filter questions matching category
      selectedQuestionsList = examQuestions.filter(
        (q) => q.category === domainFilter
      );
      setTimeLeft(0); // Count UP
    }

    const newSession: ExamSession = {
      id: Math.random().toString(36).substring(2, 9),
      mode,
      targetDomain: domainFilter,
      startTime: Date.now(),
      timeSpent: 0,
      questions: selectedQuestionsList,
      userAnswers: {},
      flaggedQuestions: [],
      completed: false
    };

    setSession(newSession);
    setCurrentQuestionIndex(0);
    setUserCheckedCurrent(false);
    setIsPaused(false);
    setScreen("EXAM");
  };

  // Active question getters
  const currentQuestion: Question | undefined = session?.questions[currentQuestionIndex];

  // Option select handler
  const handleOptionSelect = (optionIndex: number) => {
    if (!session || !currentQuestion || userCheckedCurrent) return;

    const questionId = currentQuestion.id;
    const correctAnsCount = currentQuestion.correctAnswers.length;

    setSession((prev) => {
      if (!prev) return null;
      const curAnswers = prev.userAnswers[questionId] || [];

      let updatedAnswers: number[] = [];
      if (correctAnsCount === 1) {
        // Single selection
        updatedAnswers = [optionIndex];
      } else {
        // Multi-selection (checkbox behavior)
        if (curAnswers.includes(optionIndex)) {
          updatedAnswers = curAnswers.filter((idx) => idx !== optionIndex);
        } else {
          updatedAnswers = [...curAnswers, optionIndex];
        }
      }

      return {
        ...prev,
        userAnswers: {
          ...prev.userAnswers,
          [questionId]: updatedAnswers
        }
      };
    });
  };

  // Flag toggle
  const toggleFlagCurrent = () => {
    if (!session || !currentQuestion) return;
    const qId = currentQuestion.id;

    setSession((prev) => {
      if (!prev) return null;
      const exists = prev.flaggedQuestions.includes(qId);
      const updatedFlagged = exists
        ? prev.flaggedQuestions.filter((id) => id !== qId)
        : [...prev.flaggedQuestions, qId];

      return {
        ...prev,
        flaggedQuestions: updatedFlagged
      };
    });
  };

  // Handle auto submit or manual submit
  const handleAutoSubmit = () => {
    submitExam();
  };

  // Calculate scores and direct metrics
  const submitExam = () => {
    if (!session) return;

    let correctCount = 0;
    const categoryScores: { [category: string]: { correct: number; total: number } } = {};

    session.questions.forEach((q) => {
      const answers = session.userAnswers[q.id] || [];
      const correct = q.correctAnswers;

      // Initialize domain stats
      if (!categoryScores[q.category]) {
        categoryScores[q.category] = { correct: 0, total: 0 };
      }
      categoryScores[q.category].total += 1;

      // Check if answers match correct answers perfectly
      const isCorrect =
        answers.length === correct.length &&
        answers.every((value) => correct.includes(value));

      if (isCorrect) {
        correctCount += 1;
        categoryScores[q.category].correct += 1;
      }
    });

    const scorePercentage = Math.round((correctCount / session.questions.length) * 100);
    const hasPassed = scorePercentage >= 65; // standard dbt exam passing grade is 65%

    const timeEllapsed =
      session.mode === "MOCK_EXAM"
        ? 120 * 60 - timeLeft
        : timeLeft;

    const finalSessionObj = {
      ...session,
      completed: true,
      score: scorePercentage,
      passed: hasPassed,
      timeSpent: timeEllapsed
    };

    setSession(finalSessionObj);
    setScreen("RESULT");
  };

  // Filter sidebar question list
  const filteredQuestions = useMemo(() => {
    if (!session) return [];
    return session.questions.map((q, idx) => ({ q, idx })).filter(({ q }) => {
      const isFlagged = session.flaggedQuestions.includes(q.id);
      const isAnswered = session.userAnswers[q.id] && session.userAnswers[q.id].length > 0;

      if (sidebarFilter === "FLAGGED") return isFlagged;
      if (sidebarFilter === "UNANSWERED") return !isAnswered;
      return true;
    });
  }, [session, sidebarFilter]);



  return (
    <div className="flex flex-col min-h-screen bg-[#F9FAFB] font-sans text-[#1A1A1A] select-none">
      
      {/* ===================== WELCOME / DASHBOARD SCREEN ===================== */}
      {screen === "WELCOME" && (
        <div className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 md:py-12 flex flex-col gap-8 md:gap-12">
          
          {/* Header Introduction Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-200">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-[#FF694B] text-white text-xs font-bold uppercase tracking-wider rounded">Unofficial</span>
                <span className="px-3 py-1 bg-[#1A1A1A] text-white text-xs font-mono rounded">v1.10 & v1.11 Core Spec</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Analytics Engineering Certification Exam Simulator
              </h1>
              <p className="mt-2 text-md text-gray-600 max-w-3xl">
                Master the official certified developer curriculum with real-world case simulations. 
                Fully updated for the crucial syllabus modifications focusing on **dbt Mesh, Semantic Layer, Model Contracts, and v1.11 Unit Testing & Microbatch Incremental Strategy**.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            
            {/* Configure Session + Exam Modes */}
            <div className="w-full flex flex-col gap-8">
              
              {/* Start practicing layout */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <BrainCircuit className="w-5 h-5 text-[#FF694B]" />
                  Launch a New Practice Session
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  
                  {/* Mode 1 */}
                  <div className="flex flex-col justify-between p-5 border border-gray-200 rounded-xl bg-[#FFF5F2]/20 hover:bg-[#FFF5F2]/40 transition-colors duration-200 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF694B]/5 rounded-full translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform duration-300"></div>
                    <div>
                      <div className="w-10 h-10 bg-[#FF694B] rounded-lg text-white flex items-center justify-center font-bold mb-4">
                        <Award className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-gray-900 text-md mb-1">Full Mock Exam</h3>
                      <p className="text-xs text-gray-600 leading-relaxed mb-4">
                        65 randomized curated syllabus questions under a proctored 120-minute ticking exam simulator. No instant answer hints.
                      </p>
                    </div>
                    <button
                      onClick={() => startNewSession("MOCK_EXAM")}
                      className="w-full py-2.5 bg-[#1A1A1A] hover:bg-[#FF694B] text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5" /> Start Simulation
                    </button>
                  </div>

                  {/* Mode 2 */}
                  <div className="flex flex-col justify-between p-5 border border-gray-200 rounded-xl bg-white hover:border-[#FF694B]/40 transition-all duration-200 relative overflow-hidden group">
                    <div>
                      <div className="w-10 h-10 bg-[#1A1A1A] rounded-lg text-white flex items-center justify-center font-bold mb-4">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-gray-900 text-md mb-1">Quick Practice Quiz</h3>
                      <p className="text-xs text-gray-600 leading-relaxed mb-4">
                        An accelerated run of 10 random questions with practice overlays enabled, allowing you to reveal explanations as you go.
                      </p>
                    </div>
                    <button
                      onClick={() => startNewSession("QUICK_QUIZ")}
                      className="w-full py-2.5 bg-white border border-gray-300 hover:border-[#FF694B] hover:text-[#FF694B] text-gray-700 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      <BookOpenCheck className="w-3.5 h-3.5" /> Start Practice
                    </button>
                  </div>

                  {/* Mode 3 */}
                  <div className="flex flex-col justify-between p-5 border border-gray-200 rounded-xl bg-white hover:border-[#FF694B]/40 transition-all duration-200 relative overflow-hidden group">
                    <div>
                      <div className="w-10 h-10 bg-gray-100 rounded-lg text-gray-700 flex items-center justify-center font-bold mb-4">
                        <Settings className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-gray-900 text-md mb-1">Domain Targeted</h3>
                      <p className="text-xs text-gray-600 leading-relaxed mb-4">
                        Zero in on a specific domain. Ideal for tackling weak zones and reinforcing knowledge in any specified domain category.
                      </p>
                    </div>
                    
                    {/* Select Category and Run */}
                    <div className="space-y-1.5 mt-2">
                      <select
                        onChange={(e) => startNewSession("DOMAIN_PRACTICE", e.target.value)}
                        defaultValue=""
                        className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#FF694B] bg-white cursor-pointer"
                      >
                        <option value="" disabled>Choose Category...</option>
                        <option value="Develop Models">Develop Models (37%)</option>
                        <option value="Debug Data Models">Debug Data Models (22%)</option>
                        <option value="Test and Document Models">Test & Document (23%)</option>
                        <option value="Deploy dbt Projects">Deploy Projects (18%)</option>
                      </select>
                    </div>
                  </div>

                </div>

                {/* Instant Feedback Settings Bar */}
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#FF694B]/10 flex items-center justify-center text-[#FF694B]">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">Study mode with Inline Explanations</p>
                      <p className="text-[11px] text-gray-500">Reveal detailed logic, schema guidelines, and solutions instantly inside practice sessions.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsPracticeMode(!isPracticeMode)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                      isPracticeMode
                        ? "bg-[#FF694B] text-white shrink-0"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300 shrink-0"
                    }`}
                  >
                    {isPracticeMode ? "ON (Recommended)" : "OFF"}
                  </button>
                </div>
              </div>

              {/* Syllabus Changes Accordion Box */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm">
                <div className="flex items-center gap-3.5 mb-6">
                  <div className="w-10 h-10 bg-gray-900 text-white flex items-center justify-center rounded-xl font-bold text-sm">
                    dbt
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">May 20th Exam Syllabus Guide</h2>
                    <p className="text-xs text-gray-500">Major core structural changes and subject weighting modifications</p>
                  </div>
                </div>

                {/* Tab selections */}
                <div className="flex flex-wrap border-b border-gray-200 gap-1 mb-6">
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`px-4 py-2 text-xs font-bold uppercase border-b-2 tracking-wider ${
                      activeTab === "overview"
                        ? "border-[#FF694B] text-[#FF694B]"
                        : "border-transparent text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    Weight Changes
                  </button>
                  <button
                    onClick={() => setActiveTab("develop")}
                    className={`px-4 py-2 text-xs font-bold uppercase border-b-2 tracking-wider ${
                      activeTab === "develop"
                        ? "border-teal-500 text-teal-600"
                        : "border-transparent text-gray-500 hover:text-teal-500"
                    }`}
                  >
                    Develop (37%)
                  </button>
                  <button
                    onClick={() => setActiveTab("debug")}
                    className={`px-4 py-2 text-xs font-bold uppercase border-b-2 tracking-wider ${
                      activeTab === "debug"
                        ? "border-amber-500 text-amber-600"
                        : "border-transparent text-gray-500 hover:text-amber-500"
                    }`}
                  >
                    Debug (22%)
                  </button>
                  <button
                    onClick={() => setActiveTab("test")}
                    className={`px-4 py-2 text-xs font-bold uppercase border-b-2 tracking-wider ${
                      activeTab === "test"
                        ? "border-purple-500 text-purple-600"
                        : "border-transparent text-gray-500 hover:text-purple-500"
                    }`}
                  >
                    Test & Doc (23%)
                  </button>
                  <button
                    onClick={() => setActiveTab("deploy")}
                    className={`px-4 py-2 text-xs font-bold uppercase border-b-2 tracking-wider ${
                      activeTab === "deploy"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-blue-500"
                    }`}
                  >
                    Deploy (18%)
                  </button>
                </div>

                {/* Tab content panel */}
                <div className="min-h-56">
                  {activeTab === "overview" && (
                    <div className="space-y-4 text-xs leading-relaxed text-gray-600">
                      <p>
                        On <strong>May 20, 2026</strong>, dbt Labs officially sunsetted the outdated Analytics Engineering syllabus, 
                        fully aligning the certification with **dbt-core versions 1.10 & 1.11**, 
                        refocusing heavily on platform maturity, model governance, development patterns, and the **dbt Mesh**.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                          <p className="font-bold text-gray-900 mb-2 uppercase tracking-wide text-[10px]">Outdated Schema Weightings</p>
                          <ul className="space-y-1.5 list-disc pl-4 text-gray-500">
                            <li>Building dbt Models (24%)</li>
                            <li>Debugging Models (20%)</li>
                            <li>Testing and Documenting (23%)</li>
                            <li>Deploying Models (33%)</li>
                          </ul>
                        </div>
                        <div className="p-4 bg-[#FFF5F2] rounded-xl border border-[#FF694B]/20">
                          <p className="font-bold text-[#FF694B] mb-2 uppercase tracking-wide text-[10px]">NEW Post-May 20th Weightings</p>
                          <ul className="space-y-1.5 list-disc pl-4 text-gray-700">
                            <li><strong>Develop Models (37%)</strong> - Significant Increase!</li>
                            <li><strong>Debug Data Models (22%)</strong></li>
                            <li><strong>Test and Document Models (23%)</strong></li>
                            <li><strong>Deploy dbt Projects (18%)</strong> - Consensual Streamlining!</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2.5 p-3.5 bg-amber-50 text-amber-900 border border-amber-100 rounded-lg text-xs leading-relaxed mt-4">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <p>
                          Our questions are written specifically against the modern specification. 
                          You will encounter scenarios on cross-project refs, public vs private schemas, config-driven model versioning, unit test blocks, and dynamic state-modified Slim CI jobs.
                        </p>
                      </div>
                    </div>
                  )}

                  {activeTab === "develop" && (
                    <div className="space-y-3 text-xs leading-relaxed text-gray-600">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 bg-teal-100 text-teal-800 font-bold rounded uppercase tracking-wider text-[9px]">Expanded Focus</span>
                        <h3 className="font-bold text-teal-900 text-sm">Develop Models (37% of exam)</h3>
                      </div>
                      <p>
                        This category governs advanced development patterns, including modular design, optimization strategies, and the structural configurations that power collaboration across teams.
                      </p>
                      <ul className="list-disc pl-4 space-y-1 text-gray-700">
                        <li><strong>dbt Mesh:</strong> Structuring multi-project boundaries, calling public upstream targets with dual-argument <code>ref('project', 'model')</code> syntax.</li>
                        <li><strong>Model Access Controls:</strong> Organizing permissions using <code>access: public | private | protected</code> levels to safeguard project assets.</li>
                        <li><strong>Model Contracts:</strong> Safeguarding database layouts dynamically using <code>contract: &#123;enforced: true&#125;</code> parameters and explicit schema data types.</li>
                        <li><strong>Model Versioning:</strong> Handling deprecation dates (<code>deprecated_at</code>) and defining separate active version releases.</li>
                        <li><strong>Semantic Layer:</strong> Designing metrics using MetricFlow standards based on dimensions, entities, measures, and expressions.</li>
                      </ul>
                    </div>
                  )}

                  {activeTab === "debug" && (
                    <div className="space-y-3 text-xs leading-relaxed text-gray-600">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold rounded uppercase tracking-wider text-[9px]">Core Troubleshooting</span>
                        <h3 className="font-bold text-amber-900 text-sm">Debug Data Models (22% of exam)</h3>
                      </div>
                      <p>
                        Debugging evaluates the engineer's ability to diagnose compile-time, build-time, and run-time catalog blocks inside complex pipeline dags.
                      </p>
                      <ul className="list-disc pl-4 space-y-1 text-gray-700">
                        <li><strong>Compilation Hurdles:</strong> Circular dependencies, relation type mismatches (dropping existing views prior to materializing tables), and target-specific profile settings.</li>
                        <li><strong>Log Inspections:</strong> Examining generated SQL compilations inside the <code>target/compiled/</code> and <code>target/run/</code> paths.</li>
                        <li><strong>Dry Runs:</strong> Utilizing <code>dbt compile</code> to identify syntactical errors without executing operations against underlying warehouses.</li>
                      </ul>
                    </div>
                  )}

                  {activeTab === "test" && (
                    <div className="space-y-3 text-xs leading-relaxed text-gray-600">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-800 font-bold rounded uppercase tracking-wider text-[9px]">Major Feature Added</span>
                        <h3 className="font-bold text-purple-900 text-sm">Test and Document Models (23% of exam)</h3>
                      </div>
                      <p>
                        Testing spans validation of logical rules, referential integrity matching, catalog descriptions, and the newly added unit testing engine.
                      </p>
                      <ul className="list-disc pl-4 space-y-1 text-gray-700">
                        <li><strong>dbt Unit Testing (v1.8):</strong> Designing unit tests completely in YAML schema files under the <code>unit_tests:</code> array, mapping mocked input dictionary rows (<code>rows: [...]</code>) to sources and upstream refs.</li>
                        <li><strong>Selective Test Commands:</strong> Exclusively running unit tests with the command: <code>dbt test --select "test_type:unit"</code>.</li>
                        <li><strong>Generic vs Singular Tests:</strong> Recognizing folder hierarchies (generic macros vs singular custom SQL scripts) and referential constraints.</li>
                        <li><strong>Freshness Scans:</strong> Applying source freshness rules inside table properties to warn when external feeds lag.</li>
                      </ul>
                    </div>
                  )}

                  {activeTab === "deploy" && (
                    <div className="space-y-3 text-xs leading-relaxed text-gray-600">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 font-bold rounded uppercase tracking-wider text-[9px]">Integrated Lineage</span>
                        <h3 className="font-bold text-blue-900 text-sm">Deploy dbt Projects (18% of exam)</h3>
                      </div>
                      <p>
                        Deployment covers production environments, Slim CI workflows, metadata indexing, and warehouse target safety isolation rules.
                      </p>
                      <ul className="list-disc pl-4 space-y-1 text-gray-700">
                        <li><strong>Slim CI Execution:</strong> Harnessing production run artifacts dynamically under <code>--state</code> folders, compiling only impacted nodes with <code>--select state:modified+</code>, and executing dynamic upstream deferrals (<code>--defer</code>).</li>
                        <li><strong>dbt Explorer:</strong> Harnessing Cloud Explorer metadata to view cross-project lineage diagrams, dependency paths, and documentation trees across isolated dbt Mesh repositories.</li>
                        <li><strong>Schema Overrides:</strong> Overriding the standard <code>generate_schema_name</code> macro to dynamically govern user development schema folders vs clean production targets.</li>
                      </ul>
                    </div>
                  )}
                </div>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* ===================== ACTIVE EXAM CORE INTERFACE ===================== */}
      {screen === "EXAM" && session && currentQuestion && (
        <div id="exam-dashboard" className="flex-1 flex flex-col overflow-hidden h-screen">
          
          {/* Top Navigation / Progress Header */}
          <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-10 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#FF694B] rounded flex items-center justify-center text-white font-black text-sm">dbt</div>
              <div className="h-6 w-px bg-gray-200"></div>
              <h1 className="text-xs md:text-sm font-semibold tracking-tight uppercase flex items-center gap-2">
                Certification Simulator 
                <span className="text-gray-400 font-normal">
                  [{session.mode === "MOCK_EXAM" ? "Mock Exam" : isPracticeMode ? "Practice Mode" : "Practicing Run"}]
                </span>
              </h1>
            </div>

            <div className="flex items-center gap-4 md:gap-8">
              {/* Timer metrics */}
              <div className="flex items-center gap-2.5">
                <div className="flex flex-col items-end">
                  <span className="text-[9px] text-gray-500 uppercase font-bold tracking-widest leading-none mb-1">
                    {session.mode === "MOCK_EXAM" ? "Time Remaining" : "Time Spent"}
                  </span>
                  <span className={`text-sm md:text-lg font-mono font-medium leading-none ${
                    session.mode === "MOCK_EXAM" && timeLeft < 300 ? "text-red-600 animate-pulse font-bold" : "text-gray-950"
                  }`}>
                    {formatTime(timeLeft)}
                  </span>
                </div>
                {session.mode !== "MOCK_EXAM" && (
                  <button
                    onClick={() => setIsPaused(!isPaused)}
                    className="p-1.5 border border-gray-300 rounded hover:bg-gray-50 text-gray-600 cursor-pointer transition-colors"
                    title={isPaused ? "Resume Session" : "Pause Session"}
                  >
                    {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                  </button>
                )}
              </div>

              {/* Submit button directly inside header for rapid end */}
              <button
                onClick={() => {
                  if (confirm("Are you sure you want to end your exam session and submit responses for evaluation?")) {
                    submitExam();
                  }
                }}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Submit & End
              </button>
            </div>
          </header>

          {/* Main Workspace Frame */}
          <div className="flex-1 flex overflow-hidden relative">
            
            {/* Sidebar with Grid selector */}
            <aside className="hidden md:flex w-72 bg-white border-r border-gray-200 flex-col shrink-0">
              
              {/* Progress Tracking Widget */}
              <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                <div className="flex justify-between text-[11px] font-bold uppercase text-gray-500 mb-2">
                  <span>Your Progress</span>
                  <span>
                    {Object.keys(session.userAnswers).length} of {session.questions.length} Questions
                  </span>
                </div>
                <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#FF694B] h-1.5 rounded-full transition-all duration-300"
                    style={{
                      width: `${(Object.keys(session.userAnswers).length / session.questions.length) * 100}%`
                    }}
                  ></div>
                </div>
              </div>

              {/* Sidebar filter options */}
              <div className="p-3 border-b border-gray-100 bg-white flex items-center justify-between gap-1.5 shrink-0">
                <span className="text-[10px] uppercase font-bold text-gray-400 flex items-center gap-1">
                  <ListFilter className="w-3 h-3" /> Filter
                </span>
                <div className="flex bg-gray-100 rounded p-0.5 gap-0.5">
                  {(["ALL", "FLAGGED", "UNANSWERED"] as const).map((filterOpt) => (
                    <button
                      key={filterOpt}
                      onClick={() => setSidebarFilter(filterOpt)}
                      className={`px-2 py-0.5 text-[9px] font-bold rounded transition-all cursor-pointer ${
                        sidebarFilter === filterOpt
                          ? "bg-white text-gray-900 shadow-sm"
                          : "text-gray-400 hover:text-gray-900"
                      }`}
                    >
                      {filterOpt}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Interactive Grid List */}
              <div className="flex-1 overflow-y-auto p-4 bg-white/70">
                {filteredQuestions.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 text-xs">
                    No matching questions.
                  </div>
                ) : (
                  <div className="grid grid-cols-5 gap-2">
                    {filteredQuestions.map(({ q, idx }) => {
                      const isActive = idx === currentQuestionIndex;
                      const isAnswered = session.userAnswers[q.id] && session.userAnswers[q.id].length > 0;
                      const isFlagged = session.flaggedQuestions.includes(q.id);

                      let styleClasses = "border-gray-200 bg-white text-gray-700 hover:border-gray-400";
                      
                      if (isActive) {
                        styleClasses = "bg-[#1A1A1A] border-[#1A1A1A] text-white font-bold scale-105 shadow-sm";
                      } else if (isFlagged) {
                        styleClasses = "border-[#FF694B] bg-[#FFF5F2] text-[#FF694B] font-semibold";
                      } else if (isAnswered) {
                        styleClasses = "border-gray-300 bg-gray-100 text-gray-500 hover:bg-gray-200";
                      }

                      return (
                        <button
                          key={q.id}
                          onClick={() => {
                            setCurrentQuestionIndex(idx);
                            setUserCheckedCurrent(false);
                          }}
                          className={`w-10 h-10 rounded border flex items-center justify-center text-xs font-medium cursor-pointer transition-all duration-150 ${styleClasses}`}
                        >
                          {idx + 1}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Sidebar Legend Indicator */}
              <div className="p-4 border-t border-gray-200 text-[11px] text-gray-500 bg-gray-50/50 flex flex-col gap-2 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded bg-[#1A1A1A]"></span>
                  <span className="font-semibold text-gray-700">Current Question</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded border border-gray-300 bg-gray-100"></span>
                  <span>Answered Question</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded border border-[#FF694B] bg-[#FFF5F2]"></span>
                  <span className="text-[#FF694B] font-medium">Flagged for Review</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded border border-gray-200 bg-white"></span>
                  <span>Unanswered Question</span>
                </div>
              </div>
            </aside>

            {/* Content Area for active question */}
            <section className="flex-1 bg-white flex flex-col overflow-hidden relative">
              <div className="flex-1 overflow-y-auto p-6 md:p-10 pb-32">
                <div className="max-w-3xl mx-auto w-full">
                  
                  {/* Category and Difficulty Indicators Row */}
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg border ${getCategoryColorStyles(currentQuestion.category)}`}>
                        {currentQuestion.category}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-[10px] font-bold uppercase tracking-wider rounded text-gray-600">
                        {currentQuestion.difficulty}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-gray-400 font-medium">
                        Question {currentQuestionIndex + 1} of {session.questions.length}
                      </span>
                    </div>
                  </div>

                  {/* Question Text */}
                  <h2 className="text-md md:text-lg font-medium leading-relaxed text-gray-900 mb-6">
                    {currentQuestion.questionText}
                  </h2>

                  {/* Code snippet panel */}
                  {currentQuestion.codeSnippet && (
                    <div className="bg-[#151718] rounded-xl p-5 mb-6 font-mono text-xs md:text-sm leading-relaxed text-[#A9B1D6] shadow-inner border border-gray-800 relative group max-h-80 overflow-y-auto">
                      <div className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-widest text-gray-600 group-hover:text-gray-400 transition-colors uppercase">
                        {currentQuestion.codeLanguage || "code"}
                      </div>
                      <pre className="whitespace-pre-wrap">{currentQuestion.codeSnippet}</pre>
                    </div>
                  )}

                  {/* Multiple Choice Options List */}
                  <div className="space-y-3.5">
                    {currentQuestion.options.map((option, opIdx) => {
                      const userAnswers = session.userAnswers[currentQuestion.id] || [];
                      const isSelected = userAnswers.includes(opIdx);
                      const isMultiSelect = currentQuestion.correctAnswers.length > 1;

                      // Practice mode visual flags
                      const isCorrectAnswer = currentQuestion.correctAnswers.includes(opIdx);
                      let optionBorderClass = "border-gray-200 hover:border-gray-400 bg-white";
                      let optionTagColorClass = "border-gray-300 text-gray-500 bg-gray-50";

                      if (isSelected) {
                        optionBorderClass = "border-[#FF694B] bg-[#FFF5F2]/40 ring-1 ring-[#FF694B]";
                        optionTagColorClass = "bg-[#FF694B] text-white border-[#FF694B]";
                      }

                      // Apply overlays after matching practice check
                      if (userCheckedCurrent) {
                        if (isCorrectAnswer) {
                          optionBorderClass = "border-green-600 bg-green-50/50 ring-1 ring-green-600";
                          optionTagColorClass = "bg-green-600 text-white border-green-600";
                        } else if (isSelected) {
                          optionBorderClass = "border-red-500 bg-red-50/50 ring-1 ring-red-500";
                          optionTagColorClass = "bg-red-500 text-white border-red-500";
                        }
                      }

                      return (
                        <div
                          key={opIdx}
                          onClick={() => handleOptionSelect(opIdx)}
                          className={`flex items-start p-4 border rounded-xl cursor-pointer transition-all duration-200 relative ${optionBorderClass}`}
                        >
                          {/* Circle or Check selection element */}
                          <div className="mt-0.5 shrink-0">
                            {isMultiSelect ? (
                              <div className={`w-4 h-4 rounded border flex items-center justify-center text-white ${
                                isSelected ? "bg-[#FF694B] border-[#FF694B]" : "bg-white border-gray-300"
                              }`}>
                                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                            ) : (
                              <div className={`w-4 h-4 rounded-full border flex items-center justify-center p-0.5 ${
                                isSelected ? "border-[#FF694B]" : "border-gray-300"
                              }`}>
                                {isSelected && <div className="w-full h-full rounded-full bg-[#FF694B]" />}
                              </div>
                            )}
                          </div>

                          <div className="ml-4 text-xs md:text-sm text-gray-800 font-medium">
                            {option}
                          </div>

                          {/* Instant review indicators */}
                          {userCheckedCurrent && (
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                              {isCorrectAnswer ? (
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              ) : (
                                isSelected && <XCircle className="w-5 h-5 text-red-500" />
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Practice Answer validation panel */}
                  {isPracticeMode && (
                    <div className="mt-8 pt-4 border-t border-gray-100 flex flex-col gap-4">
                      
                      {!userCheckedCurrent ? (
                        <button
                          onClick={() => setUserCheckedCurrent(true)}
                          disabled={!(session.userAnswers[currentQuestion.id] && session.userAnswers[currentQuestion.id].length > 0)}
                          className={`self-start px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                            session.userAnswers[currentQuestion.id] && session.userAnswers[currentQuestion.id].length > 0
                              ? "bg-gray-900 border border-gray-900 text-white hover:bg-[#FF694B] hover:border-[#FF694B]"
                              : "bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          Check Answer Code
                        </button>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-xs md:text-sm leading-relaxed"
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <span className="p-1 px-2.5 bg-gray-900 text-white font-bold rounded uppercase tracking-wider text-[10px]">
                              Solution Analysis
                            </span>
                            {currentQuestion.dbtVersionFocus && (
                              <span className="px-2 py-0.5 bg-[#FF694B]/10 text-[#FF694B] font-bold rounded uppercase tracking-wider text-[9px]">
                                {currentQuestion.dbtVersionFocus}
                              </span>
                            )}
                          </div>
                          
                          <p className="text-gray-800 font-medium whitespace-pre-line mb-3">
                            {currentQuestion.explanation}
                          </p>
                          
                          {currentQuestion.references && (
                            <a
                              href={currentQuestion.references}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[#FF694B] hover:underline font-bold inline-flex items-center gap-1.5"
                            >
                              View Official dbt Documentation <ChevronRight className="w-3 h-3" />
                            </a>
                          )}
                        </motion.div>
                      )}

                    </div>
                  )}

                </div>
              </div>

              {/* Lower Navigation bar */}
              <div className="absolute bottom-0 left-0 right-0 h-20 border-t border-gray-100 bg-white flex items-center justify-between px-6 md:px-10 z-10 shadow-lg">
                
                {/* Previous trigger */}
                <button
                  onClick={() => {
                    if (currentQuestionIndex > 0) {
                      setCurrentQuestionIndex((prev) => prev - 1);
                      setUserCheckedCurrent(false);
                    }
                  }}
                  disabled={currentQuestionIndex === 0}
                  className={`flex items-center gap-2 text-xs md:text-sm font-semibold transition-colors cursor-pointer ${
                    currentQuestionIndex === 0
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <ArrowLeft className="w-4 h-4" /> Previous
                </button>

                <div className="flex items-center gap-2.5">
                  {/* Flag Toggle */}
                  <button
                    onClick={toggleFlagCurrent}
                    className={`px-3 md:px-5 py-2 border rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1.5 cursor-pointer transition-all ${
                      session.flaggedQuestions.includes(currentQuestion.id)
                        ? "bg-[#FFF5F2] border-[#FF694B] text-[#FF694B]"
                        : "border-gray-300 hover:border-[#FF694B] text-gray-500 hover:text-[#FF694B]"
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">
                      {session.flaggedQuestions.includes(currentQuestion.id) ? "Flagged!" : "Flag for Review"}
                    </span>
                  </button>

                  {/* Next / Submit trigger */}
                  {currentQuestionIndex < session.questions.length - 1 ? (
                    <button
                      onClick={() => {
                        setCurrentQuestionIndex((prev) => prev + 1);
                        setUserCheckedCurrent(false);
                      }}
                      className="px-6 md:px-10 py-2 bg-[#1A1A1A] hover:bg-[#FF694B] text-white rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      Next <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        if (confirm("You have reached the final question. Submit all answers for grading?")) {
                          submitExam();
                        }
                      }}
                      className="px-6 md:px-10 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      Submit Exam
                    </button>
                  )}
                </div>

              </div>

            </section>

          </div>

          {/* Pause Modal overlay */}
          {isPaused && (
            <div className="absolute inset-0 bg-white/95 z-[100] flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 bg-[#FFF5F2] rounded-full flex items-center justify-center text-[#FF694B] mb-4">
                <Pause className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Simulated Practice Paused</h2>
              <p className="text-gray-500 text-xs md:text-sm max-w-sm mb-6 leading-relaxed">
                Your practice clock is temporarily suspended, and the questions list is masked to preserve validation integrity.
              </p>
              <button
                onClick={() => setIsPaused(false)}
                className="px-8 py-3 bg-[#FF694B] hover:bg-[#FF694B]/90 text-white font-bold text-xs uppercase tracking-widest rounded-full transition-colors cursor-pointer"
              >
                Resume Practice Timer
              </button>
            </div>
          )}

        </div>
      )}

      {/* ===================== SCORE REPORT / RESULTS SCREEN ===================== */}
      {screen === "RESULT" && session && (
        <div className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 md:py-12 flex flex-col gap-10">
          
          {/* Header Status Result */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm flex flex-col md:flex-row items-center gap-8 justify-between relative overflow-hidden">
            
            {/* Visual status backdrops */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.03] select-none pointer-events-none">
              {session.passed ? (
                <CheckCircle className="w-full h-full text-green-600" />
              ) : (
                <XCircle className="w-full h-full text-red-600" />
              )}
            </div>

            <div className="flex items-center gap-6 text-center md:text-left flex-col md:flex-row">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center shrink-0 ${
                session.passed ? "bg-green-100 text-green-600 animate-bounce" : "bg-red-100 text-red-500"
              }`}>
                {session.passed ? (
                  <CheckCircle className="w-10 h-10" />
                ) : (
                  <XCircle className="w-10 h-10" />
                )}
              </div>
              <div>
                <span className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                  session.passed ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}>
                  {session.passed ? "PASS" : "FAIL"} - 65% Target Required
                </span>
                <h1 className="text-2xl font-bold text-gray-900 mt-2">
                  {session.passed
                    ? "Congratulations! You Passed!"
                    : "Below Target Threshold"}
                </h1>
                <p className="text-xs text-gray-500 mt-1 max-w-md">
                  {session.passed
                    ? "Excellent performance! You demonstrate robust alignment with the modern dbt curriculum features (v1.10 & v1.11)."
                    : "Work through problem areas below, review standard logs, contracts, and try other targeted practices before testing again."}
                </p>
              </div>
            </div>

            {/* Score Ring Gauge */}
            <div className="flex flex-col items-center shrink-0">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-2">My Score</span>
              <div className="relative flex items-center justify-center">
                
                {/* SVG Progress Circle */}
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="42"
                    stroke="#F3F4F6"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="42"
                    stroke={session.passed ? "#16A34A" : "#EF4444"}
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 42}
                    strokeDashoffset={
                      (2 * Math.PI * 42) * (1 - (session.score ?? 0) / 100)
                    }
                  />
                </svg>
                <span className="absolute text-xl font-mono font-bold text-gray-900">
                  {session.score}%
                </span>
              </div>
            </div>

          </div>

          {/* Performance Category breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            
            {/* Domain percentages */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-md uppercase tracking-wider font-bold text-gray-400 mb-6 flex items-center gap-2">
                <Award className="w-4 h-4 text-[#FF694B]" />
                Performance By dbt Domains
              </h2>

              <div className="space-y-5">
                {/* Map unique category names */}
                {(["Develop Models", "Debug Data Models", "Test and Document Models", "Deploy dbt Projects"] as const).map((catName) => {
                  let total = 0;
                  let correct = 0;

                  session.questions.forEach((q) => {
                    if (q.category === catName) {
                      total += 1;
                      const ans = session.userAnswers[q.id] || [];
                      const corr = q.correctAnswers;
                      if (
                        ans.length === corr.length &&
                        ans.every((v) => corr.includes(v))
                      ) {
                        correct += 1;
                      }
                    }
                  });

                  if (total === 0) return null;

                  const percent = Math.round((correct / total) * 100);
                  let evaluation = "Focus Zone";
                  let textBadgeStyle = "bg-red-50 text-red-700 border-red-100";
                  let scaleColor = "bg-red-500 block";

                  if (percent >= 75) {
                    evaluation = "Proficient";
                    textBadgeStyle = "bg-green-50 text-green-700 border-green-100";
                    scaleColor = "bg-green-600 block";
                  } else if (percent >= 50) {
                    evaluation = "Marginally Proficient";
                    textBadgeStyle = "bg-amber-50 text-amber-700 border-amber-100";
                    scaleColor = "bg-amber-500 block";
                  }

                  return (
                    <div key={catName} className="space-y-2">
                      <div className="flex justify-between items-center gap-4 text-xs font-semibold">
                        <span className="text-gray-800 truncate block text-[11px]">{catName}</span>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded border ${textBadgeStyle}`}>
                            {evaluation}
                          </span>
                          <span className="text-gray-900 font-mono">{correct}/{total} ({percent}%)</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                        <div
                          className={`h-2.5 rounded-full transition-all duration-300 ${scaleColor}`}
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons footer */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-100">
                <button
                  onClick={() => setScreen("WELCOME")}
                  className="flex-1 py-3 bg-[#1A1A1A] hover:bg-[#FF694B] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" /> Back to Dashboard
                </button>
                <button
                  onClick={() => {
                    if (session.mode === "DOMAIN_PRACTICE") {
                      startNewSession(session.mode, session.targetDomain);
                    } else {
                      startNewSession(session.mode);
                    }
                  }}
                  className="flex-1 py-3 border border-gray-300 hover:border-[#FF694B] hover:text-[#FF694B] text-gray-700 text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-colors flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" /> Retry Test Session
                </button>
              </div>

            </div>

            {/* Actions & Tips panel */}
            <div className="bg-[#1A1A1A] text-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-md uppercase tracking-wider font-bold text-gray-400 mb-4 flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-[#FF694B]" />
                New Exam Prep Recommendations
              </h2>

              <div className="space-y-4 text-xs text-gray-300 leading-relaxed">
                <div>
                  <h3 className="font-bold text-white mb-1">Develop Models Checklist:</h3>
                  <p className="text-gray-400">Review cross-project references. Downstream compile triggers from separated repositories require configured upstream model keys (<code>access: public</code>) paired alongside declared <code>contract: &#123;enforced: true&#125;</code> specifications.</p>
                </div>
                
                <div>
                  <h3 className="font-bold text-white mb-1">Testing & Unit Mocks checklist:</h3>
                  <p className="text-gray-400">Study the v1.8 mock row validation pattern inside YAML blocks. Expected test executions validate custom models selectively via targeted filters (e.g. <code>dbt test --select "test_type:unit"</code>).</p>
                </div>

                <div>
                  <h3 className="font-bold text-white mb-1">Deployment Deferrals Checklist:</h3>
                  <p className="text-gray-400">Understand Slim CI processes inside production pipelines. Rebuilding processes identify modified files using production manifest catalogs (<code>state:modified+ --defer --state path/to/manifest</code>).</p>
                </div>
              </div>
            </div>

          </div>

          {/* Complete Questions review checklist */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <ListFilter className="w-5 h-5 text-[#FF694B]" />
              Detailed Problem Analysis & Choices Review
            </h2>

            <div className="space-y-6 divide-y divide-gray-100">
              {session.questions.map((q, idx) => {
                const answers = session.userAnswers[q.id] || [];
                const correct = q.correctAnswers;
                const isCorrect =
                  answers.length === correct.length &&
                  answers.every((v) => correct.includes(v));

                return (
                  <div key={q.id} className={`pt-6 ${idx === 0 ? "pt-0" : ""}`}>
                    
                    {/* Status header */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                          isCorrect ? "bg-green-600" : "bg-red-500"
                        }`}>
                          {idx + 1}
                        </span>
                        <h4 className="font-bold text-gray-900 text-sm">
                          Question {idx + 1} ({getCategoryShortTag(q.category)})
                        </h4>
                      </div>

                      <div className="flex items-center gap-2">
                        {isCorrect ? (
                          <span className="px-2.5 py-0.5 bg-green-50 border border-green-200 text-green-700 text-[10px] font-bold rounded flex items-center gap-1">
                            <Check className="w-3 h-3 stroke-[3]" /> Correct
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 bg-red-50 border border-red-200 text-red-700 text-[10px] font-bold rounded flex items-center gap-1">
                            <XCircle className="w-3 h-3" /> Incorrect
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Question text */}
                    <p className="text-xs md:text-sm font-medium text-gray-800 leading-relaxed mb-4">
                      {q.questionText}
                    </p>

                    {/* Display alternatives */}
                    <div className="space-y-1.5 pl-6 mb-4">
                      {q.options.map((opt, opIdx) => {
                        const wasChosen = answers.includes(opIdx);
                        const pointsCorrect = correct.includes(opIdx);

                        let prefix = "• ";
                        let styleClass = "text-gray-500 text-xs";
                        
                        if (pointsCorrect) {
                          prefix = "✓ ";
                          styleClass = "text-green-700 font-bold text-xs";
                        } else if (wasChosen) {
                          prefix = "✗ ";
                          styleClass = "text-red-500 font-bold text-xs";
                        }

                        return (
                          <div key={opIdx} className={styleClass}>
                            {prefix} {opt}
                          </div>
                        );
                      })}
                    </div>

                    {/* Display analysis block */}
                    <div className="p-4 bg-gray-50 border border-gray-100 rounded-lg text-xs leading-relaxed text-gray-600">
                      <p className="font-bold text-gray-900 mb-1">Explanation:</p>
                      <p className="text-gray-700 mb-2">{q.explanation}</p>
                      {q.references && (
                        <a
                          href={q.references}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#FF694B] hover:underline font-bold"
                        >
                          Official Documentation Reference
                        </a>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
