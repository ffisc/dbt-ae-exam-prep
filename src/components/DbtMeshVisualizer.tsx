import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Network, 
  Database, 
  Lock, 
  Unlock, 
  CheckCircle, 
  XCircle, 
  FileCode, 
  Info, 
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Play,
  RotateCcw
} from "lucide-react";

interface Node {
  id: string;
  name: string;
  project: "core_platform" | "finance_analytics";
  type: "source" | "staging" | "public_model" | "private_downstream";
  access: "none" | "private" | "protected" | "public";
  description: string;
  syntax: string;
  yamlConfig: string;
  gotcha: string;
  x: number; // visual percentage offset
  y: number; // visual percentage offset
}

export default function DbtMeshVisualizer() {
  const [selectedNodeId, setSelectedNodeId] = useState<string>("dim_customers");
  const [compilerSource, setCompilerSource] = useState<string>("dim_customers");
  const [compilerTargetProject, setCompilerTargetProject] = useState<string>("finance_analytics");
  const [compilerStatus, setCompilerStatus] = useState<"idle" | "compiling" | "success" | "error">("idle");
  const [compilerLogs, setCompilerLogs] = useState<string>("");

  const nodes: Node[] = [
    {
      id: "raw_orders",
      name: "raw_orders",
      project: "core_platform",
      type: "source",
      access: "none",
      description: "Raw transactional source ingested from database billing records. Represents uncleaned ingress tables.",
      syntax: "{{ source('billing', 'raw_orders') }}",
      yamlConfig: `sources:
  - name: billing
    tables:
      - name: raw_orders
        freshness:
          warn_after: {count: 12, period: hour}
          error_after: {count: 24, period: hour}`,
      gotcha: "Source Freshness checks on BigQuery or Snowflake require careful filtering (e.g. partition boundaries) to prevent expensive full-table scans when executing dbt source freshness.",
      x: 10,
      y: 35
    },
    {
      id: "stg_orders",
      name: "stg_orders",
      project: "core_platform",
      type: "staging",
      access: "protected",
      description: "Staging model cleaning billing values. Configured as protected within the core platform repository.",
      syntax: "{{ ref('stg_orders') }}",
      yamlConfig: `models:
  - name: stg_orders
    config:
      materialized: view
      access: protected # Accessible only within core_platform`,
      gotcha: "If a downstream project attempts to ref('core_platform', 'stg_orders'), the dbt compiler throws a fatal access-violation. Protected models cannot bridge project namespaces.",
      x: 40,
      y: 20
    },
    {
      id: "dim_customers",
      name: "dim_customers",
      project: "core_platform",
      type: "public_model",
      access: "public",
      description: "A highly-reviewed, structured customer dimension table. It uses model contract boundaries to maintain a stable schema for external consumers.",
      syntax: "{{ ref('core_platform', 'dim_customers') }}",
      yamlConfig: `models:
  - name: dim_customers
    config:
      access: public # Open for Cross-Project Refs!
      contract:
        enforced: true # Model contract strictly enforced
    columns:
      - name: customer_id
        data_type: integer
        constraints:
          - type: not_null`,
      gotcha: "Because access is 'public', downstream projects can use dual-argument ref syntax. Enabling 'contract: {enforced: true}' ensures any columns/datatypes modifications locally that violate the contract immediately fail compile build steps, shielding downstream consumers from broken pipelines.",
      x: 70,
      y: 35
    },
    {
      id: "fct_revenue",
      name: "fct_revenue",
      project: "finance_analytics",
      type: "private_downstream",
      access: "private",
      description: "Private Fact table in the Finance project. It aggregates revenue details by dynamically linking to dim_customers from core_platform via dbt Mesh.",
      syntax: "{{ ref('core_platform', 'dim_customers') }}",
      yamlConfig: `models:
  - name: fct_revenue
    config:
      materialized: incremental
      incremental_strategy: delete+insert`,
      gotcha: "dbt Mesh allows decoupled micro-projects. Instead of importing core platform packages as standard libraries (which duplicates compilation structures), finance reads physical schema nodes directly using state paths.",
      x: 90,
      y: 70
    }
  ];

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[2];

  const handleRunCompiler = () => {
    setCompilerStatus("compiling");
    setCompilerLogs("Initiating cross-project reference check...\nParsing DAG manifest.json...\n");
    
    setTimeout(() => {
      const srcNode = nodes.find(n => n.id === compilerSource);
      if (!srcNode) return;

      if (compilerTargetProject === "finance_analytics") {
        if (srcNode.project === "finance_analytics") {
          // Internal refernce
          setCompilerStatus("success");
          setCompilerLogs(prev => prev + `✔ Resolving internal relation ref('${srcNode.name}')\n✔ Compilation Successful!\nCompiled SQL:\nSELECT * FROM "finance_db"."finance_schema"."${srcNode.name}"`);
        } else {
          // Cross-project reference
          if (srcNode.access === "public") {
            setCompilerStatus("success");
            setCompilerLogs(prev => prev + `✔ Resolving cross-project reference: ref('${srcNode.project}', '${srcNode.name}')\n✔ Found authorized public boundary model in ${srcNode.project}\n✔ Compilation Successful!\nCompiled SQL:\nSELECT * FROM "core_db"."core_schema_prod"."${srcNode.name}"`);
          } else {
            setCompilerStatus("error");
            setCompilerLogs(prev => prev + `❌ Compilation Error!\nRelation '${srcNode.name}' in project '${srcNode.project}' is configured with access: ${srcNode.access}.\nDownstream project '${compilerTargetProject}' is unauthorized to reference non-public models across project boundaries.\nTo fix, modify the configuration block of '${srcNode.name}' to 'access: public'.`);
          }
        }
      } else {
        // Target project is core_platform
        if (srcNode.project === "core_platform") {
          setCompilerStatus("success");
          setCompilerLogs(prev => prev + `✔ Resolving internal ref('${srcNode.name}') inside ${compilerTargetProject}\n✔ Compilation Successful!\nCompiled SQL:\nSELECT * FROM "core_db"."core_schema_dev"."${srcNode.name}"`);
        } else {
          // core_platform trying to call finance_analytics model
          if (srcNode.access === "public") {
            setCompilerStatus("success");
            setCompilerLogs(prev => prev + `✔ Resolving cross-project ref('${srcNode.project}', '${srcNode.name}')\n✔ Compilation Successful!`);
          } else {
            setCompilerStatus("error");
            setCompilerLogs(prev => prev + `❌ Compilation Error!\nRelation '${srcNode.name}' has access: ${srcNode.access}. Only public models are accessible outside their home project space.`);
          }
        }
      }
    }, 1200);
  };

  return (
    <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 md:p-6 mt-4">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-2 pb-4 mb-4 border-b border-slate-200">
        <div>
          <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 text-[9px] font-bold uppercase rounded tracking-wider">
            Interactive Lineage
          </span>
          <h4 className="text-sm font-bold text-slate-900 mt-1">Multi-Project dbt Mesh Visualizer</h4>
          <p className="text-[11px] text-slate-500">
            Click on nodes below to verify model contract definitions and cross-project ref compile regulations.
          </p>
        </div>
        <div className="flex gap-4 text-[11px] text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></span>
            <span>Public (Ref-able)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-amber-500 rounded-full"></span>
            <span>Protected / Private</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Graph Lineage Area */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-4 relative min-h-[320px] overflow-hidden flex flex-col justify-between shadow-inner">
          
          {/* Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] opacity-70 pointer-events-none"></div>

          {/* Project Boundaries Visual Labels */}
          <div className="absolute top-2 left-2 px-2 py-1 bg-indigo-50 border border-indigo-100 rounded text-[9px] text-indigo-800 font-bold tracking-tight">
            PROJECT A: core_platform
          </div>
          <div className="absolute bottom-2 right-2 px-2 py-1 bg-amber-50 border border-amber-100 rounded text-[9px] text-amber-800 font-bold tracking-tight">
            PROJECT B: finance_analytics (downstream)
          </div>

          {/* SVG Connector Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {/* Source to Staging */}
            <line 
              x1="10%" y1="35%" x2="40%" y2="20%" 
              className="stroke-slate-300 stroke-[2] stroke-dasharray-[4]" 
              strokeDasharray="4"
            />
            {/* Staging to Dim Customers */}
            <line 
              x1="40%" y1="20%" x2="70%" y2="35%" 
              className="stroke-slate-300 stroke-[2]" 
            />
            {/* Public dim_customers to Downstream fct_revenue (Cross-Project Ref) */}
            <line 
              x1="70%" y1="35%" x2="90%" y2="70%" 
              className={`stroke-[2.5] transition-all duration-300 ${
                selectedNodeId === "dim_customers" || selectedNodeId === "fct_revenue"
                  ? "stroke-indigo-500 stroke-dasharray-[0]" 
                  : "stroke-slate-400 stroke-dasharray-[5]"
              }`}
              strokeDasharray={selectedNodeId !== "dim_customers" && selectedNodeId !== "fct_revenue" ? "4" : undefined}
            />
          </svg>

          {/* Node Elements */}
          <div className="relative w-full h-full min-h-[220px] z-10 mt-6">
            {nodes.map((node) => {
              const isActive = selectedNodeId === node.id;
              let badgeColor = "bg-slate-100 text-slate-800 border-slate-200";
              let statusDot = "bg-slate-400";
              
              if (node.access === "public") {
                badgeColor = "bg-emerald-50 text-emerald-800 border-emerald-200";
                statusDot = "bg-emerald-500";
              } else if (node.access === "protected" || node.access === "private") {
                badgeColor = "bg-amber-50 text-amber-800 border-amber-200";
                statusDot = "bg-amber-500";
              }

              return (
                <button
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 p-3 rounded-xl border text-left transition-all max-w-[170px] ${
                    isActive 
                      ? "ring-2 ring-indigo-500 border-indigo-500 bg-slate-50 shadow-md scale-105" 
                      : "bg-white border-slate-200 hover:border-slate-400 shadow-sm hover:scale-103"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1.5 mb-1.5">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                      {node.type}
                    </span>
                    <span className={`w-2 h-2 rounded-full ${statusDot}`}></span>
                  </div>
                  <div className="font-mono text-xs font-bold text-slate-900 truncate">
                    {node.name}
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[9px]">
                    <span className={`px-1 rounded border ${badgeColor}`}>
                      {node.access === "none" ? "source" : node.access}
                    </span>
                    {node.access === "public" && <Unlock className="w-2.5 h-2.5 text-emerald-600" />}
                    {(node.access === "private" || node.access === "protected") && <Lock className="w-2.5 h-2.5 text-amber-600" />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="bg-slate-100 p-2.5 rounded-lg border border-slate-200 z-10 text-[10px] mt-2 text-slate-600 flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span>
              The line between <strong>dim_customers</strong> and <strong>fct_revenue</strong> represents a cross-project mesh ref.
            </span>
          </div>

        </div>

        {/* Detailed Explanation Sidebar */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-4">
          <div className="bg-slate-900 text-slate-100 rounded-xl p-4 shadow-md font-mono text-xs">
            <div className="flex items-center justify-between text-[10px] border-b border-slate-800 pb-2 mb-2 text-indigo-400">
              <span className="flex items-center gap-1">
                <FileCode className="w-3.5 h-3.5" />
                CONFIG PROFILE
              </span>
              <span>{selectedNode.project}.yml</span>
            </div>
            
            <p className="text-slate-300 font-sans text-xs mb-3 font-normal leading-relaxed">
              {selectedNode.description}
            </p>

            <div className="bg-slate-950 p-2.5 rounded border border-slate-800 mb-3 overflow-x-auto text-[10px] leading-relaxed select-all">
              <span className="text-slate-500"># Model Jinja Call:</span><br/>
              <span className="text-amber-400">{selectedNode.syntax}</span>
            </div>

            <pre className="text-[10px] text-emerald-400 overflow-x-auto max-h-32 bg-slate-950 p-2.5 rounded border border-slate-800">
              <code>{selectedNode.yamlConfig}</code>
            </pre>
          </div>

          <div className="bg-amber-50 text-amber-950 border border-amber-200 rounded-xl p-3.5 text-xs leading-relaxed flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-900 text-[11px] uppercase tracking-wide">Exam Gotcha Checklist</p>
              <p className="text-[11px] text-amber-800 mt-1">
                {selectedNode.gotcha}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Compiler Simulator Interactive Playground */}
      <div className="mt-6 bg-white p-4 rounded-xl border border-slate-200">
        <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Network className="w-4 h-4 text-indigo-600" />
          dbt Core Parser & Compiler Simulator (Ref Sandbox)
        </h5>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          
          <div className="md:col-span-4 space-y-2">
            <label className="block text-[10px] text-slate-500 font-bold uppercase">Compile-Time Call Source Model</label>
            <select 
              value={compilerSource} 
              onChange={(e) => {
                setCompilerSource(e.target.value);
                setCompilerStatus("idle");
              }}
              className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-slate-50 font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="raw_orders">raw_orders (Source)</option>
              <option value="stg_orders">stg_orders (Protected Staging)</option>
              <option value="dim_customers">dim_customers (Public Contracted Model)</option>
              <option value="fct_revenue">fct_revenue (Private Finance Fact)</option>
            </select>
          </div>

          <div className="md:col-span-1 flex justify-center text-slate-400">
            <ArrowRight className="w-5 h-5 hidden md:block" />
            <span className="md:hidden text-xs py-1">referenced in</span>
          </div>

          <div className="md:col-span-4 space-y-2">
            <label className="block text-[10px] text-slate-500 font-bold uppercase">Executing target Consumer Project</label>
            <select 
              value={compilerTargetProject} 
              onChange={(e) => {
                setCompilerTargetProject(e.target.value);
                setCompilerStatus("idle");
              }}
              className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-slate-50 font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="finance_analytics">finance_analytics project</option>
              <option value="core_platform">core_platform project</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <button
              onClick={handleRunCompiler}
              disabled={compilerStatus === "compiling"}
              className="w-full py-2 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              {compilerStatus === "compiling" ? (
                <>
                  <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  <span>Compiling...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Execute ref() Test</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Compiler Logs output terminal */}
        <AnimatePresence>
          {compilerStatus !== "idle" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 border border-slate-200 rounded-lg overflow-hidden"
            >
              <div className="bg-slate-900 p-2.5 flex items-center justify-between text-[10px] uppercase font-mono font-bold text-slate-400">
                <span>parser-terminal.log</span>
                <button 
                  onClick={() => setCompilerStatus("idle")}
                  className="hover:text-slate-100 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Clear
                </button>
              </div>
              <div className="bg-slate-950 p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap">
                {compilerLogs.split("\n").map((line, i) => {
                  let colorClass = "text-slate-300";
                  if (line.startsWith("❌")) colorClass = "text-rose-400 font-bold";
                  if (line.startsWith("✔")) colorClass = "text-emerald-400 font-bold";
                  if (line.includes("Compiled SQL:")) colorClass = "text-indigo-400 font-bold mt-2";
                  return (
                    <div key={i} className={colorClass}>
                      {line}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
