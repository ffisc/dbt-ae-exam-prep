import { Question } from "./types";

export const examQuestions: Question[] = [
  {
    id: 1,
    category: "Develop Models",
    difficulty: "Advanced",
    questionText: "An analytics engineer is setting up a dbt Mesh architecture. A downstream project is attempting to reference `fct_orders` from an upstream 'core_project' as shown in the query below. What is the minimum configuration required in the upstream project's schema file to allow this cross-project reference and ensure downstream compilation succeeds?",
    codeSnippet: `-- In downstream marketing project (models/marts/fct_marketing.sql)
select * from {{ ref('core_project', 'fct_orders') }}`,
    codeLanguage: "sql",
    options: [
      "No configuration is required; any model in a dbt project can be referenced across projects by default if imported as a package.",
      "Set `access: public` in the model's properties. By default, dbt models are `private`.",
      "Set `access: global` and declare `enforce_contract: true` on the model.",
      "Set `access: public` AND configure a `contract` on the model with `enforced: true`."
    ],
    correctAnswers: [3],
    explanation: "CORRECT ACTION:\nTo allow a model to be referenced across projects in a dbt Mesh architecture (via cross-project ref), two conditions must be met: 1) The model's access must be configured as `public` (by default, models are `private`). 2) The model must have a contract enforced (`contract: { enforced: true }`). Both are mandatory to permit downstream projects to reference it safely, protecting against schema changes.\n\nINCORRECT COMPETING OPTIONS:\n- No configuration is required...: Any model across project boundaries requires explicit access permissions. In dbt Mesh, private models cannot be referred downstream by default.\n- Set access: public in target properties: Public access alone is rejected by the dbt Mesh compiler unless accompanied by a verified, enforced schema contract.\n- Set access: global and enforce_contract: Both properties are invalid or non-existent in dbt's configuration schema syntax.",
    references: "https://docs.getdbt.com/docs/collaborate/governance/model-access",
    dbtVersionFocus: "v1.7+ (dbt Mesh)"
  },
  {
    id: 2,
    category: "Develop Models",
    difficulty: "Intermediate",
    questionText: "Which of the following describes the correct syntactical pattern for enforcing a model contract on a PostgreSQL SQL model inside its YAML definition file?",
    options: [
      "The contract must be defined with `contract: true` and column details can be completely omitted, letting dbt infer types at runtime.",
      "The contract configuration requires `contract: {enforced: true}` at the model level, and every single column in the model must have a declared `data_type` matching the database schema.",
      "The contract must specify `access: global` and you must declare database-specific constraints like `primary_key` exclusively inside the SQL code file.",
      "Contracts are declared inside the `dbt_project.yml` file under `models: contracts: enforced: true` which applies to all models automatically."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nWhen you enforce a model contract using `contract: {enforced: true}`, dbt verifies that the model's actual query results match the declared columns exactly. Crucially, you must explicitly declare every column in the schema file, and each of those columns must have a `data_type` property configured.\n\nINCORRECT COMPETING OPTIONS:\n- contract: true with omitted columns: Non-compliant configuration. A model contract demands detailed, explicit data-type declarations for columns in schema YAML files and does not permit dynamic runtime type inference.\n- Set access: global and database constraints inside SQL code: Data type contracts must be defined in the schema YAML, and there is no 'access: global' configuration.\n- Declare inside `dbt_project.yml` globally: Contracts must be enabled and described model-by-model in schema configurations, not globally inside `dbt_project.yml`.",
    references: "https://docs.getdbt.com/docs/collaborate/govern/model-contracts",
    dbtVersionFocus: "v1.5+ (Model Contracts)"
  },
  {
    id: 3,
    category: "Develop Models",
    difficulty: "Advanced",
    questionText: "An analytics team needs to introduce a breaking schema change to an established model named `dim_users` while keeping the old schema active for old downstream nodes. They decide to use model versioning. They designate file names as `dim_users_v1.sql` and `dim_users_v2.sql`. What is the correct YAML pattern in their model schema definition to complete this version configuration?",
    options: [
      "Register a separate model block for each version: one named `dim_users_v1` and one named `dim_users_v2` with direct references.",
      "Register a single model named `dim_users`, specify its `latest_version: 1`, and list its versions in the `versions:` array as sub-key declarations matching the file suffixes.",
      "Create a macro named `dim_users` that selects from the correct table depending on `env_var('DBT_VERSION')`, bypassing schema YAML definitions.",
      "Declare `version: 1` inside `dim_users_v1.sql` config block, and `version: 2` in `dim_users_v2.sql` config block; files must remain named `dim_users.sql`."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nTo implement versioning, you define a single model block in YAML (under the base name, e.g. `dim_users`), optionally specify `latest_version`, and define the list of versions in the `versions` block. The SQL files are named `<model_name>_v<version_number>.sql`, in this case `dim_users_v1.sql` and `dim_users_v2.sql`.\n\nINCORRECT COMPETING OPTIONS:\n- Separate model block for each version: Violates dry principles and fails the versioning namespace check since dbt requires version definitions bundled in one catalog block.\n- Create a macro looking up env vars: Overcomplicates standard build steps and bypasses dbt's powerful native version scheduler controls.\n- Specify version config in sql files while files remain flat: Files must contain active version identifiers in their physical names so that dbt can map references cleanly.",
    references: "https://docs.getdbt.com/docs/collaborate/govern/model-versions",
    dbtVersionFocus: "v1.6+ (Model Versioning)"
  },
  {
    id: 4,
    category: "Test and Document Models",
    difficulty: "Intermediate",
    questionText: "In dbt Core v1.8+, unit testing allows analytics engineers to validate model SQL logic using static mock data. For the `dim_customers.sql` model shown below, which structure correctly declares this unit test in a schema `.yml` file?",
    codeSnippet: `-- models/marts/dim_customers.sql
with customers as (
    select * from {{ source('jaffle_shop', 'raw_customers') }}
)
select * from customers where status = 'active'`,
    codeLanguage: "sql",
    options: [
      "Declarations must be placed under custom sql files inside the `tests/` directory and must represent a standard SELECT query returning error rows.",
      "The definition must be placed under `unit_tests:` in a `.yml` file. It must reference the target `model`, state the `given` inputs with mock `rows` (using Jinja references to sources/refs), and use the `expect` block to declare expected outputs.",
      "The test is configured directly inside the SQL model code file within a Jinja block: `{% unit_test active_expect={...} %}`.",
      "Unit testing is exclusively supported in dbt Cloud and cannot be configured in dbt Core YAML configurations."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nBy declaring `unit_tests:` in a schema file, you define mock inputs for model prerequisites (sourced tables or upstream refs) under `given`, supplying a list of dictionary rows, and state the exact output rows expected from compiling and executing the model SQL against that dummy mock data under the `expect` key.\n\nINCORRECT COMPETING OPTIONS:\n- Standard SELECT queries inside tests/: Standard SQL files in `tests/` represent data tests (which validate live physical schemas) rather than mock-data unit tests which isolate SQL logic.\n- Jinja unit_tests blocks in SQL files: Inline code blocks cannot define complete tabular mock profiles under the official dbt compiler specifications.\n- Exclusive to dbt Cloud: Unit testing is fully supported, open-source, and configurable inside standard dbt Core environments (v1.8+).",
    references: "https://docs.getdbt.com/docs/build/unit-tests",
    dbtVersionFocus: "v1.8+ (Unit Testing)"
  },
  {
    id: 5,
    category: "Develop Models",
    difficulty: "Advanced",
    questionText: "Based on the semantic model configuration below, you need to configure a metric that computes the average order value (AOV) as total_revenue divided by distinct_orders. What is the correct YAML specification to define this derived metric under `metrics:` in your schema file?",
    codeSnippet: `semantic_models:
  - name: orders
    model: ref('fct_orders')
    measures:
      - name: total_revenue
        agg: sum
      - name: distinct_orders
        agg: count_distinct`,
    codeLanguage: "yaml",
    options: [
      "The metric is defined inside the SQL model directly via custom SQL window average queries.",
      "Metrics must be defined under a `semantic_models` parent block as simple SQL fragments inside the main database schema, without individual measure declarations.",
      "Define a metric of type `expression` under the `metrics:` property, with `type_params: { expr: total_revenue / distinct_orders }` referencing the defined measures.",
      "Define type `calculation` directly inside standard dbt generic testing blocks, which aggregates and outputs average tables dynamically."
    ],
    correctAnswers: [2],
    explanation: "CORRECT ACTION:\nIn the dbt Semantic Layer (powered by MetricFlow), metric definitions must rely on a modern specification. You define 'measures' representing aggregates (like sum or count_distinct) in a `semantic_model` block linked to a model, then define 'metrics' of type `expression` (or other types like `simple`, `ratio`, `cumulative`) pointing to those measures inside the top-level `metrics:` array.\n\nINCORRECT COMPETING OPTIONS:\n- Define directly in SQL model via window functions: Incompatible with MetricFlow frameworks, which require semantic structures to map metrics dynamic operations.\n- Define metrics under semantic_models block without measures: Metrics cannot compile unless they reference defined underlying measures.\n- Define type calculation in testing properties: Inaccurate. Standard data assertions do not construct dynamically queryable MetricFlow fields.",
    references: "https://docs.getdbt.com/docs/build/about-metricflow",
    dbtVersionFocus: "v1.6+ (Semantic Layer / MetricFlow)"
  },
  {
    id: 6,
    category: "Deploy dbt Projects",
    difficulty: "Advanced",
    questionText: "An organization is deploying a Slim CI pipeline to prevent redundant warehouse runs. The pipeline compiles and runs only models that have changed and their downstream dependents. They also want downstream nodes that haven't changed to fetch state from the latest production run dynamically. What is the correct CLI invocation and environment configuration to accomplish this Slim CI run?",
    options: [
      "dbt run `--select` state:new+ `--state` prod `--defer`-all-models",
      "dbt build `--select` state:modified+ `--defer` `--state` path/to/prod/artifacts",
      "dbt test `--select` modified+ --from-manifest production.json",
      "No CLI command exists. dbt Cloud manages this automatically without allowing CLI config modifications."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nSlim CI builds compile only modified nodes (`--select state:modified+`) alongside their downstream dependents (the `+` suffix). Using `--defer` redirects any unmodified upstream nodes to fetch data from the production environment, specified by pointing `--state` to a directory containing the production run's `manifest.json`.\n\nINCORRECT COMPETING OPTIONS:\n- state:new+: Incorrect selector syntaxes. The standard selector for altered projects is 'state:modified_plus' or 'state:modified+'.\n- test `--select` modified+: Runs tests without executing model builds first. It also uses incorrect '--from-manifest' keywords.\n- No CLI command exists / managed automatically: Fully incorrect; dbt Core's CLI is highly configurable, offering complete manual controls over deferrals.",
    references: "https://docs.getdbt.com/docs/deploy/slim-ci",
    dbtVersionFocus: "Core (All versions, updated in 1.7)"
  },
  {
    id: 7,
    category: "Develop Models",
    difficulty: "Advanced",
    questionText: "In dbt Core v1.11, the `microbatch` incremental strategy is added to efficiently process high-volume event tables batch-by-batch over a lookback window. Which of the following is correct regarding how the `microbatch` strategy filters source records and structures the compiled query?",
    codeSnippet: `{{ config(
    materialized='incremental',
    incremental_strategy='microbatch',
    event_time='payment_date',
    batch_period='day',
    lookback=3
) }}

select * from {{ ref('stg_payments') }}`,
    codeLanguage: "sql",
    options: [
      "The developer must still write a manual 'is_incremental()' filter block inside their SQL model; otherwise, dbt performs a full table scan for every batch execution.",
      "dbt automatically injects temporal filtering where-clauses for the 'event_time' column based on the active batch boundaries and lookback. Developers do not write manual Jinja `is_incremental()` blocks in their SQL code.",
      "The 'microbatch' strategy is only supported for ephemeral views and does not execute in serial database transactions.",
      "Configuring 'microbatch' requires defining separate schema contracts for each daily and hourly target partition."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nUnder the dbt Core v1.11 microbatch incremental strategy, dbt automatically handles the temporal logic. It injects dynamic WHERE clauses on the 'event_time' column (e.g. payment_date) using the active batch window and lookback parameter, meaning developers compile clean, standard SELECT queries without needing manual `is_incremental()` Jinja blocks or date calculation filters.\n\nINCORRECT COMPETING OPTIONS:\n- Needs manual `is_incremental()` filter blocks: One of the signature benefits of microbatch is eliminating manually written query date filters.\n- Only supported for ephemeral views: Ephemeral structures do not persist data inside database engines and therefore cannot be materialized incrementally.\n- Requires separate schema contracts per partition: Partitions are managed purely inline during runtime execution, requiring no extra YAML schemas.",
    references: "https://docs.getdbt.com/docs/build/incremental-strategy#microbatch",
    dbtVersionFocus: "v1.11+ (Microbatch Incremental Strategy)"
  },
  {
    id: 8,
    category: "Debug Data Models",
    difficulty: "Advanced",
    questionText: "In a multi-project dbt Mesh setup, a downstream marketing project attempts to reference a model in the upstream core finance project. The downstream run fails compilation with the error: 'Compilation Error: The model \"fct_earnings\" is not authorized for cross-project ref.' What is the most likely cause of this error?",
    codeSnippet: `In Core Finance project schema.yml:
models:
  - name: fct_earnings
    config:
      access: private  # Or missing access configuration`,
    codeLanguage: "yaml",
    options: [
      "The finance project has not been declared inside the downstream project's `packages.yml` file.",
      "The downstream project is trying to reference an upstream model configured with `access: private` or `access: protected`. Upstream models must be designated `access: public` to allow referencing from other projects.",
      "The core finance project is running dbt v1.0 which had no support for packages.",
      "Cross-project refs can only operate on incremental models; ephemeral or table views are disallowed."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nIn dbt Mesh, models possess a default access tier of `private`. `private` models can only be referenced inside the project where they are declared. `protected` models can only be referenced by models in the same package (or project groups). Setting `access: public` is a hard requirement to authorize cross-project calling.\n\nINCORRECT COMPETING OPTIONS:\n- Missing package declaration in `packages.yml`: `packages.yml` downloads raw source code libraries locally, whereas dbt Mesh relies on manifest declarations and compiled metadata.\n- Upstream core project using dbt v1.0: Inapplicable; packages has been natively supported in dbt since early beta variations.\n- Mesh restricted to incremental materializations: ephemerals, views, and tables are all valid provided proper contracts reside on top of them.",
    references: "https://docs.getdbt.com/docs/collaborate/governance/model-access",
    dbtVersionFocus: "v1.7+ (dbt Mesh)"
  },
  {
    id: 9,
    category: "Debug Data Models",
    difficulty: "Intermediate",
    questionText: "An analytics engineer executes 'dbt run' and receives a database execution failure stating: 'Relation \"analytics.dim_products\" already exists as view; cannot create TABLE.' What is the root cause of this conflict, and how can it be resolved?",
    codeSnippet: `Compilation/Execution Error in model dim_products (dim_products.sql)
Relation "analytics.dim_products" already exists as view; cannot create TABLE.`,
    codeLanguage: "text",
    options: [
      "The database requires a reboot to force refreshing of internal schemas.",
      "This happens in databases like Redshift/Snowflake when a model changes its materialization from view to table. The old view must be manually dropped first, or you must invoke `dbt run --full-refresh` to automatically handle Dropping.",
      "An duplicate view script is declared inside the `macros/` folder with the exact same name.",
      "You must delete the target database driver because it does not support incremental table updates."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nWhen modifying a model's materialization from a view to a table (or vice versa), some database engines reject replacing the existing database object of a different type seamlessly. Dropping the old layout occurs automatically if you perform a `dbt run --full-refresh` or manually run drop commands inside the warehouse.\n\nINCORRECT COMPETING OPTIONS:\n- Database reboot required: Physical system reboots do not impact schema namespace mappings or object types locked inside database registries.\n- Duplicate view in macros: Custom macro structures do not trigger physical view vs table collision errors in schema compile steps.\n- Delete target database driver: Drivers facilitate secure queries; they have no connection to schema materialization collisions.",
    references: "https://docs.getdbt.com/docs/build/materializations",
    dbtVersionFocus: "Core"
  },
  {
    id: 10,
    category: "Deploy dbt Projects",
    difficulty: "Advanced",
    questionText: "To keep development and production environments isolated, which implementation override for the macro `generate_schema_name` correctly appends the custom schema when running in production, while defaulting to the user's primary target schema name during dev development sprints?",
    codeSnippet: `{% macro generate_schema_name(custom_schema_name, node) -%}
    {%- if target.name == 'prod' -%}
        {{ custom_schema_name | trim }}
    {%- else -%}
        {{ target.schema }}
    {%- endif -%}
{%- endmacro %}`,
    codeLanguage: "sql",
    options: [
      "Place logic inside `dbt_project.yml` matching environments directly.",
      "Write a custom macro with name `generate_schema_name` in your macro directory, checking `target.name` (or `target.profile_name`). If target.name equates to 'prod', return the clean `custom_schema_name`, otherwise return `target.schema`.",
      "dbt does not support dynamic schema overrides outside target configurations inside `profiles.yml`.",
      "Remove the macro and configure database names directly in the model's metadata block."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nStandard dynamic schema patterns in dbt involve customizing the default `generate_schema_name` macro. In the overridden code, inspecting the active `target.name` decides whether code goes to actual custom destination names (production targets) or fallbacks safely to individual development schemes (e.g. `dbt_jsmith`).\n\nINCORRECT COMPETING OPTIONS:\n- Place logic inside `dbt_project.yml` directly: Schema dynamic concatenation overrides require active Jinja logic and cannot be parsed from basic flat key files.\n- dbt does not support dynamic schema overrides: Incorrect, customizing the default dynamic schema macro is fully supported and recommended.\n- Remove the macro and write in metadata blocks: dbt ignores model config metadata fields if they collide with primary schema generation macros.",
    references: "https://docs.getdbt.com/docs/build/custom-schemas",
    dbtVersionFocus: "Core"
  },
  {
    id: 11,
    category: "Test and Document Models",
    difficulty: "Intermediate",
    questionText: "An analytics engineer has set up both generic column tests and the new dbt v1.8 unit tests on their models. They want to execute ONLY the unit tests across their entire project to keep build cycles rapid during development. Which command correctly performs this filtered execution?",
    options: [
      "dbt run --unit-only",
      "dbt test `--select` \"test_type:generic\"",
      "dbt test `--select` \"test_type:unit\"",
      "dbt test --exclude column_tests"
    ],
    correctAnswers: [2],
    explanation: "CORRECT ACTION:\nIn dbt Core v1.8+, you can select tests by their test type. Unit tests are targeted specifically by executing the dbt select criteria: `test_type:unit`. Generic tests (such as unique, non_null, relationships, accepted_values) can be selected via `test_type:generic`.\n\nINCORRECT COMPETING OPTIONS:\n- `dbt run` --unit-only: Unrecognized modifier; `dbt run` compiles models, not tests.\n- `dbt test` `--select` test_type:generic: Runs only standard schema validation tests, explicitly omitting unit tests.\n- `dbt test` --exclude column_tests: Erroneous syntax; column-level schema asserts are identified as generic tests, not exclusive categories.",
    references: "https://docs.getdbt.com/docs/build/unit-tests#running-unit-tests",
    dbtVersionFocus: "v1.8+ (Unit Testing)"
  },
  {
    id: 12,
    category: "Develop Models",
    difficulty: "Advanced",
    questionText: "An analytics engineer is running a targeted historical backfill of a model configured with the dbt Core v1.11 `microbatch` incremental strategy. How can the developer restrict the backfill dynamically to a specific historical date range (e.g. May 10th to May 15th 2026) without editing the SQL model configuration?",
    codeSnippet: `dbt build --select my_microbatch_model ... (What flags go here?)`,
    codeLanguage: "bash",
    options: [
      "Define standard filters inside `packages.yml` and trigger a full project-wide re-compilation with 'dbt deps'.",
      "Pass the date range using the CLI configurations '--event-time-start 2026-05-10' and '--event-time-end 2026-05-15'. dbt will process and run independent transactions for only the batch periods that fall in this interval.",
      "Set 'deprecated_at: 2026-05-10' in the model schema YAML and run with standard 'dbt run --full-refresh'.",
      "Configure variables via '--vars' to override the internal connection pool variables '_dbt_max_event_time' in the database drivers."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nUnder dbt Core v1.11, the microbatch strategy supports precise execution control using the '--event-time-start' and '--event-time-end' CLI configurations. This enables developers to execute backfills or targeted partition runs, forcing the microbatch scheduler to compile and serialise execution exclusively for the batches inside the declared time bounds, which dramatically reduces data scans.\n\nINCORRECT COMPETING OPTIONS:\n- Define filters in `packages.yml`: Packages.yml manages external software package sources, not date filters.\n- Set deprecated_at and run full-refresh: Deprecating model versions marks old builds as deprecated but cannot guide incremental date ranges.\n- Set vars to override max_event_time: dbt microbatch scheduling is built into the engine directly and is not driven by custom connection pool variables.",
    references: "https://docs.getdbt.com/docs/build/incremental-strategy#microbatch",
    dbtVersionFocus: "v1.11+ (Microbatch Incremental Strategy)"
  },
  {
    id: 13,
    category: "Test and Document Models",
    difficulty: "Associate",
    questionText: "To monitor raw data feeds arriving from an external pipeline, you want dbt to alert you if a table has not been updated in the last 24 hours. Where and how should this be configured?",
    codeSnippet: `sources:
  - name: internal_sales
    database: raw
    schema: sales
    tables:
      - name: orders
        freshness:
          warn_after: {count: 12, period: hour}
          error_after: {count: 24, period: hour}
        loaded_at_field: created_at`,
    codeLanguage: "yaml",
    options: [
      "Configure standard metrics calculations inside a semantic model pointing to custom tables.",
      "Declare the criteria inside a source's table configurations in a YAML file. Provide a `loaded_at_field` pointing to the timestamp column, and configure `freshness` with `error_after` and `warn_after` limits.",
      "Add a generic test named `freshness_24h` on the model columns.",
      "Write a macro checking database timestamps and throw compilation errors using the `exceptions` handler."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nSource freshness evaluates database updates by measuring the difference between the maximum value in `loaded_at_field` against the current clock time. Freshness thresholds (`warn_after` / `error_after` counts and periods) are validated by running the command `dbt source freshness`.\n\nINCORRECT COMPETING OPTIONS:\n- Configure standard metrics: Metrics monitor compiled downstream dimensions, not source table data feed arrivals.\n- Add generic test freshness_24h: Traditional generic data tests are run inside run pipelines, whereas freshness relies on dedicated metadata inspections.\n- Custom exception macro: Overcomplicates is_incremental setups and does not hook into standard dbt alert handlers.",
    references: "https://docs.getdbt.com/docs/build/sources#source-freshness",
    dbtVersionFocus: "Core"
  },
  {
    id: 14,
    category: "Develop Models",
    difficulty: "Advanced",
    questionText: "An analytics engineer has configured a model using versioning. To help clean up deprecation lifecycles, they want to send warnings to downstream developers trying to reference the older version `v1` of the model `dim_vendor`. Which YAML configuration completes this deprecation pattern?",
    codeSnippet: `models:
  - name: dim_vendor
    latest_version: 2
    versions:
      - v: 1
        deprecated_at: 2026-06-01
      - v: 2`,
    codeLanguage: "yaml",
    options: [
      "Configure `deprecated_at: 2026-06-01` inside the old model version's YAML declaration block. If a downstream compile occurs after this date, dbt outputs warnings.",
      "Add `version_v1: deprecated` parameter to standard model headers.",
      "Model deprecation requires writing custom SQL blocks using warning macros that query system schemas.",
      "Configuring deprecation is only possible by deleting the model folders."
    ],
    correctAnswers: [0],
    explanation: "CORRECT ACTION:\nIn dbt, you can deprecate older model versions by applying `deprecated_at` field inside the target version block. dbt will seamlessly raise clear warning messages when projects reference a deprecated version during a parse or build run if the system calendar crosses that threshold.\n\nINCORRECT COMPETING OPTIONS:\n- Add version_v1: deprecated to headers: Invalid syntax; deprecation rules must be specified under schema YAML version parameters.\n- Write custom warning SQL queries: Overcomplicates standard deprecation actions; dbt provides built-in, out-of-the-box support for warning outputs.\n- Delete model folders: Dropping model folders breaks legacy nodes completely instead of offering a graceful deprecation warning.",
    references: "https://docs.getdbt.com/docs/collaborate/govern/model-versions#deprecating-a-version",
    dbtVersionFocus: "v1.6+ (Model Versioning)"
  },
  {
    id: 15,
    category: "Deploy dbt Projects",
    difficulty: "Advanced",
    questionText: "Under the May 20th 2026 exam updates (highlighting modern features like dbt Explorer and dbt Mesh), which statement correct describes how dbt Explorer visualizes downstream cross-project relationships?",
    codeSnippet: "",
    options: [
      "dbt Explorer operates exclusively inside private databases, requiring custom Python scripts to link dashboards.",
      "dbt Explorer utilizes uploaded project manifests metadata to construct interactive multi-project telemetry lineage. Downstream nodes from different projects referencing the public source models appear seamlessly in the overall dependency graph.",
      "Lineage is completely restricted to local SQL file trees and does not show outside targets.",
      "Explorer requires using Docker containers and will not visualize schemas across profiles."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\ndbt Explorer (the cloud metadata visualizer) supports cross-project lineage mapping. By analyzing manifests across multiple projects grouped in dbt Mesh, it presents an interactive full-lineage lineage view mapping out upstream public core dependencies and downstream marketing or product nodes.\n\nINCORRECT COMPETING OPTIONS:\n- Operate inside private databases only: Explorer is a SaaS visualizer reading project manifests to build graphs, not a database administration system.\n- Restricted to local file trees: Explorer acts across projects in the Mesh namespace, bypassing path barriers.\n- Requires using Docker: Fully incorrect. Explorer is cloud-hosted and parses metadata cleanly via secure manifest uploads.",
    references: "https://docs.getdbt.com/docs/collaborate/explore-projects",
    dbtVersionFocus: "dbt Cloud & Explorer (2026 Updates)"
  },
  {
    id: 16,
    category: "Deploy dbt Projects",
    difficulty: "Intermediate",
    questionText: "In dbt project setups, variable precedence controls how parameters are loaded. Which configuration takes priority if a variable named `source_database` is declared both inside `dbt_project.yml` and specified as a command-line argument?",
    codeSnippet: `In dbt_project.yml:
vars:
  source_database: "raw_sales_prod"

CLI Call:
dbt run --vars '{"source_database": "raw_sales_dev"}'`,
    codeLanguage: "bash",
    options: [
      "dbt throws a compilation error due to duplicate variable registration.",
      "The value declared inside `dbt_project.yml` overrides arguments because it is closer to the file system.",
      "The command-line `--vars` flag always takes absolute precedence and will override variables declared in the `dbt_project.yml` configuration.",
      "Both are merged, generating database-specific exceptions at run execution."
    ],
    correctAnswers: [2],
    explanation: "CORRECT ACTION:\ndbt establishes a strict order of variable priority. Values supplied on the command-line utilizing the `--vars` argument override any equivalent variables declared inside the `dbt_project.yml` files, profiles, or macro fallbacks.\n\nINCORRECT COMPETING OPTIONS:\n- dbt throws a compilation error: It is completely valid to pass identical vars on CLI; dbt manages this via sequential overriding rather than crashing.\n- The value inside `dbt_project.yml` overrides CLI: Totally incorrect because local configurations are designed as defaults to be overwritten by production schedules or developers via CLI flags.\n- Both are merged: No merging of duplicate keys takes place; the CLI value completely replaces the local value in namespace checks.",
    references: "https://docs.getdbt.com/docs/build/project-variables",
    dbtVersionFocus: "Core"
  },
  {
    id: 17,
    category: "Develop Models",
    difficulty: "Advanced",
    questionText: "Your organization uses dbt groups to restrict visibility. You have a finance model block named `fct_salary` classified with an access scope and restricted to a group named `internal_finance`. Which model can successfully reference `fct_salary` via Jinja's `{{ ref() }}`?",
    codeSnippet: `models:
  - name: fct_salary
    config:
      group: internal_finance
      access: private # What can call this model?`,
    codeLanguage: "yaml",
    options: [
      "Any model in the entire dbt project can reference private models.",
      "Only models explicitly configured under the identical group (internal_finance) inside the same project may compile a reference to it.",
      "Only models in other downstream dbt Mesh databases can call private models.",
      "Even sibling models inside the finance folder are restricted if they don't have separate contracts enforced."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nModels marked with `access: private` can only be referenced by other models defined inside the exact same dbt project. If the model is also assigned a `group`, standard dbt model access constraints dictate that only other models belonging to that identical group can compile references to it, securing private data fields.\n\nINCORRECT COMPETING OPTIONS:\n- Any model in entire project can reference it: Fails because `access: private` restricted with 'group: internal_finance' means sibling models in other groups of the same project will violate access constraints.\n- Downstream dbt Mesh projects can reference it: dbt Mesh models must have `access: public` configured to enable cross-project referencing.\n- Restricted even to identical group unless contract enforced: Group permissions act as the primary logical gate; contracts ensure type-safety but don't govern internal grouping access.",
    references: "https://docs.getdbt.com/docs/collaborate/governance/model-access",
    dbtVersionFocus: "v1.7+ (dbt Mesh & Groups)"
  },
  {
    id: 18,
    category: "Test and Document Models",
    difficulty: "Associate",
    questionText: "What is the key difference between generic tests and singular tests in `dbt test` suites?",
    codeSnippet: "",
    options: [
      "Generic tests are defined inside SQL files under `tests/generic/`, while singular tests can only be run in dbt Cloud.",
      "Singular tests are written as standalone SQL SELECT queries inside the `tests/` directory (where a test fails if any rows are returned). Generic tests are parameterized tests declared in YAML (like unique, not_null) that apply to columns.",
      "Singular tests are defined in YAML schema files, whereas generic tests are written in pure YAML inside the profiles registry.",
      "Generic tests run during `dbt run`, while singular tests require invoking the command `dbt test --singular`."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nSingular tests are custom SQL scripts located in the `tests/` directory; if the query returns 0 rows, the test passes. Generic tests are reusable parameterized macros defined under column properties inside YAML files, like the built-in `unique`, `not_null`, `relationships`, and `accepted_values` tests.\n\nINCORRECT COMPETING OPTIONS:\n- Generic tests under tests/generic/ and singular in Cloud only: Incorrect. Both generic and singular tests run perfectly in open-source CLI dbt Core.\n- Singular tests defined in YAML: Singular tests are written in pure SQL files, not YAML schema configurations.\n- Generic runs during run and singular under --singular: Custom and standard tests run under the `dbt test` or `dbt build` command, not during basic run schedules.",
    references: "https://docs.getdbt.com/docs/build/data-tests",
    dbtVersionFocus: "Core (Slight terminology updates in v1.8, calling them 'data tests')"
  },
  {
    id: 19,
    category: "Debug Data Models",
    difficulty: "Intermediate",
    questionText: "An analytics engineer sets up a model materialized as 'ephemeral'. A downstream model references this ephemeral node twice. During database operation execution, how does dbt translate this interaction under compilation?",
    codeSnippet: `{{ config(materialized='ephemeral') }}
select * from {{ ref('raw_source') }}`,
    codeLanguage: "sql",
    options: [
      "dbt compiles the code as a database table before run execution, then deletes it on completion.",
      "dbt interpolates the ephemeral model's SQL directly as a Common Table Expression (CTE) or subquery inside the referencing model's SQL script. If referenced twice, the CTE is repeated or nested accordingly inside the generated query.",
      "The query will fail compilation with error 'No views allowed under ephemeral materializations.'",
      "dbt compiles this to standard storage temporary tables."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nThe `ephemeral` materialization tells dbt not to create an object in the database. Instead, dbt compiles its query and injects it as an in-line Common Table Expression (CTE) directly into any referring downstream models, avoiding database storage and table creation steps completely. If referenced twice, the CTE is repeated or nested accordingly.\n\nINCORRECT COMPETING OPTIONS:\n- Table model deleted at run conclusion: Temporary schemas or transient structures can be deleted, but ephemeral models never hit physical warehouse storage tables.\n- Fails compilation stating view conflicts: Ephemeral structures can reference views and tables cleanly without breaking compiler guidelines.\n- Runs as standard storage temporary tables: Temporary tables represent temporary physical objects; ephemerals are purely logical compiler-level inline CTE transformations.",
    references: "https://docs.getdbt.com/docs/build/materializations#ephemeral",
    dbtVersionFocus: "Core"
  },
  {
    id: 20,
    category: "Deploy dbt Projects",
    difficulty: "Associate",
    questionText: "You are setting up a `dbt run` inside standard scheduling software. You want your jobs to fetch external packages from Git registries, delete older local database compiling artifacts, and immediately build your downstream models. Which sequence of dbt commands is correct?",
    codeSnippet: "",
    options: [
      "dbt run -> `dbt test` -> dbt docs",
      "dbt clean -> `dbt deps` -> dbt build",
      "dbt deps -> `dbt clean` -> dbt seed",
      "dbt build --with-packages"
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nThe recommended execution lifecycle inside scheduling servers starts with `dbt clean` (clearing older `dbt_packages/` and `target/` directories), immediately followed by `dbt deps` (loading packages listed in `packages.yml`), and concluding with `dbt build` (running and testing models, seeds, snapshots, and sources in optimized order).\n\nINCORRECT COMPETING OPTIONS:\n- run -> test -> docs: Fails to load external packages beforehand, and misses compiling dependencies.\n- deps -> clean -> seed: Running clean AFTER loading dependencies wipes out the freshly downloaded external package packages folders.\n- build --with-packages: Incorrect, there is no generic CLI flag called '--with-packages'. Packages must be downloaded first via 'dbt deps'.",
    references: "https://docs.getdbt.com/reference/commands-glossary",
    dbtVersionFocus: "Core"
  },
  {
    id: 21,
    category: "Develop Models",
    difficulty: "Advanced",
    questionText: "When an analytics engineer enforces a model contract with 'contract: { enforced: true }', how does dbt handle situations where the SQL SELECT query's returned columns do not align exactly with the declared columns and data types inside the schema YAML file?",
    codeSnippet: `models:
  - name: dim_payments
    config:
      contract: { enforced: true }
    columns:
      - name: payment_id
        data_type: integer
      - name: amount
        data_type: decimal`,
    codeLanguage: "yaml",
    options: [
      "dbt completes the build successfully but prints a warning, inserting NULLs into missing target columns.",
      "dbt raises a compilation or database-level validation error during the pre-flight check, halting compilation immediately before any SQL executes.",
      "dbt dynamically modifies the target table schema in the database to align with the SQL output.",
      "dbt excludes non-matching columns under the hood, requesting only matching column nodes."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nWhen model contracts are enforced (`enforced: true`), dbt forces a strict pre-flight schema comparison. If the names or data types of the columns retrieved by the SQL SELECT query do not perfectly match the ones declared in the model schema YAML properties, dbt immediately fails the build, preventing incompatible changes from reaching production.\n\nINCORRECT COMPETING OPTIONS:\n- Prints warning and inserts NULLs: Overriding validation with warning flags is disallowed when a contract is explicitly enforced.\n- Dynamically modifies database schema on the fly: dbt is an analytics transform compiler; it does not dynamically alter live table column layouts without clean rebuild actions.\n- Excludes non-matching columns under the hood: SQL compilation will throw a warehouse error if the mismatch is unresolved since dbt executes exact columns.",
    references: "https://docs.getdbt.com/docs/collaborate/govern/model-contracts",
    dbtVersionFocus: "v1.10+ (Model Contracts)"
  },
  {
    id: 22,
    category: "Develop Models",
    difficulty: "Advanced",
    questionText: "In dbt Core v1.11, the Semantic Layer and MetricFlow officially support conversion metrics to measure when a user performs a conversion event after an initial base event. Which YAML structure represents the correct definition for a conversion metric?",
    codeSnippet: `metrics:
  - name: user_signup_to_purchase_conversion
    type: conversion
    type_params:
      conversion_type_params:
        base_measure: user_signups
        conversion_measure: user_purchases
        window: 7 days`,
    codeLanguage: "yaml",
    options: [
      "Define a metric of type 'ratio' and carry out custom aggregate divisions inline inside macros.",
      "Define a metric of type 'conversion' and specify 'base_measure', 'conversion_measure', and an optional temporal lookup 'window' inside the metric's 'type_params.conversion_type_params' block.",
      "Conversion metrics are declared inside standard dbt source tables using 'loaded_at_field' and 'freshness' configurations.",
      "Create a custom csv file mapping conversion boundaries."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nConversion metrics are a dedicated metric type in the dbt Semantic Layer. Under `type: conversion`, the metric uses `type_params` containing a `conversion_type_params` block to specify the `base_measure` (the initial event, like signups) and `conversion_measure` (the target event, like purchase), along with an optional lookback `window` constraint.\n\nINCORRECT COMPETING OPTIONS:\n- Use ratio and divide inside custom macros: Custom macro-divisions are how metrics were developed in legacy configurations; MetricFlow v1.6+ deprecated this in favor of explicit conversion types.\n- Declared under source freshness settings: Source freshness monitors tables, not downstream multi-event aggregations.\n- Custom csv map file: Seeds or CSV loads cannot represent metric configurations or join rules.",
    references: "https://docs.getdbt.com/docs/build/conversion-metrics",
    dbtVersionFocus: "v1.11+ (Semantic Layer Conversion Metrics)"
  },
  {
    id: 23,
    category: "Deploy dbt Projects",
    difficulty: "Advanced",
    questionText: "Under the modern dbt Mesh model, how does a downstream dbt project declare its reliance on an upstream project's public models without duplicating the upstream code compile-time inside its local package tree?",
    codeSnippet: `# In downstream project's dbt_project.yml
dependencies:
  - project: core_finance`,
    codeLanguage: "yaml",
    options: [
      "Specify the upstream project under the `dependencies:` key within `dbt_project.yml` (and load the remote manifest via dbt Cloud). This permits referencing public upstream models via `ref('core_finance', 'fct_revenues')` without local code cloning.",
      "Add the upstream project name to the local `packages.yml` file, forcing dbt to download and compile all upstream models as local nodes.",
      "Define custom database views manually in the downstream target database and reference them strictly as raw sources.",
      "Declare a global variable 'upstream_models' pointing to public schemas in `profiles.yml`."
    ],
    correctAnswers: [0],
    explanation: "CORRECT ACTION:\nIn dbt Mesh, instead of treating an external project as an imported package (which compiles all upstream files locally), we define cross-project dependencies in the `dbt_project.yml` under `dependencies:`. Downstream models reference public models from that project seamlessly (e.g. `ref('project_name', 'model_name')`). To resolve compilation metadata without reading the raw code, dbt fetches the upstream manifest dynamically.\n\nINCORRECT COMPETING OPTIONS:\n- Add project to `packages.yml`: Downloading local copies is packages behavior; it compiles duplicate items locally which goes against Mesh architecture.\n- Define views manually in target warehouse: Restricts compiler power and loses deep validation DAG linkages.\n- Declare variables in `profiles.yml`: Profiles files establish connectivity credentials, not schema and compiler model mappings.",
    references: "https://docs.getdbt.com/docs/collaborator/mesh/cross-project-ref",
    dbtVersionFocus: "v1.10+ (dbt Mesh Dependencies)"
  },
  {
    id: 24,
    category: "Deploy dbt Projects",
    difficulty: "Advanced",
    questionText: "An analytics engineer is deploying models in an isolated Dev warehouse environment. They want to compile only their modified models while using dbt's model deferral feature. When deferral is active ('--defer `--state` state_dir'), how does dbt handle references to unmodified upstream models during compilation?",
    options: [
      "It compiles references using the user's Dev database schema prefix, but returns mock empty datasets.",
      "It redirects references to the production database and schema specified in the state's `manifest.json` file, avoiding duplicating build runs in the Developer's isolated target.",
      "It compiles upstream dependencies as dynamic in-line CTEs directly into the developer's downstream query.",
      "It halts execution with database privilege mismatch exceptions if the prod schema is read-only."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nModel deferral is designed to optimize development cycles. When `--defer` and `--state` are enabled, dbt matches unmatched upstream dependencies against the production manifest. If a model hasn't been built locally in the Dev target, dbt compiles its reference targeting the Production database and schema, allowing developers to query production data for upstream inputs instantly.\n\nINCORRECT COMPETING OPTIONS:\n- Returns mock empty datasets: Unhelpful for debugging because downstream calculations depend heavily on live upstream data contents.\n- Upstreams compiled as inline CTEs: CTE conversion is unique to 'ephemeral' materializations, whereas deferred nodes can be tables or views.\n- Halts with database privilege mismatches: While possible, dbt has optimizations built to support read-only query lookups in production schemas seamlessly.",
    references: "https://docs.getdbt.com/reference/node-selection/defer",
    dbtVersionFocus: "v1.11+ (Deferral optimization)"
  },
  {
    id: 25,
    category: "Test and Document Models",
    difficulty: "Advanced",
    questionText: "When writing dbt Unit Tests inside YAML properties, a developer tests an incremental model that references itself recursively via the Jinja 'this' block. What is the correct way to construct mock input rows representing the prior self-referred state of the table?",
    codeSnippet: `unit_tests:
  - name: test_recursive_incremental
    model: my_incremental_model
    given:
      - input: this
        rows:
          - {event_id: 100, processed_at: '2026-05-15'}`,
    codeLanguage: "yaml",
    options: [
      "Configure a separate model named `my_incremental_model_mock.sql` in the tests directory.",
      "Specify 'input: this' (or the self-referencing model's name) inside the 'given:' array block and provide mock rows representing the existing database records.",
      "Unit tests cannot mock self-references; these tests must be run targeting live warehouse schemas.",
      "Inject SQL CTEs using custom override parameters in `dbt_project.yml`."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nTo test self-referencing SQL logic (such as models matching against `{{ this }}`), dbt Core unit testing permits specifying `this` as an input within the `given` array block. Developers define a mock set of rows representing the existing data in the target table, allowing compilation of logic like date calculation limits over historical rows.\n\nINCORRECT COMPETING OPTIONS:\n- Separate mock SQL model in tests/: Standalone files cannot easily model recursive dbt logic without complex setup, whereas `given: - input: this` makes it incredibly elegant.\n- Unit tests cannot mock self-references: Incorrect. dbt has made extensive updates to support `this` as a mock input explicitly.\n- Inject SQL CTEs inside `dbt_project.yml`: General project level YAML files are invalid spaces to inject temporary SQL CTE code blocks.",
    references: "https://docs.getdbt.com/docs/build/unit-tests#mocking-this",
    dbtVersionFocus: "v1.8+ (Unit Testing self-references)"
  },
  {
    id: 26,
    category: "Develop Models",
    difficulty: "Intermediate",
    questionText: "An analytics engineer is configuring a `dbt snapshot` to track slow-changing dimensions (SCD Type 2) on an orders table. When using the `timestamp` strategy, what does dbt expect as the minimum model properties, and what are the generated columns added by dbt in the snapshot target table?",
    options: [
      "Requires specifying a `unique_key` and `updated_at`. The snapshot table will contain the custom model columns along with the metadata columns `dbt_valid_from`, `dbt_valid_to`, `dbt_updated_at`, and `dbt_scanned_at`.",
      "Requires writing custom UPDATE triggers at the database layer. No additional tracking columns are appended.",
      "Only requires `unique_key` and adds `dbt_is_active` as a boolean column representing current state.",
      "Requires `check_cols` specifying all values to track. dbt adds `dbt_inserted_at` and `dbt_deleted_at`."
    ],
    correctAnswers: [0],
    explanation: "CORRECT ACTION:\nUnder the snapshot `timestamp` strategy, dbt requires `unique_key` to identify records and `updated_at` to detect when they have changed. dbt creates and maintains Type II slowly changing dimension tables by appending system-level tracking columns: `dbt_valid_from` (start timestamp), `dbt_valid_to` (end timestamp, null for current), `dbt_updated_at`, and `dbt_scanned_at`.\n\nINCORRECT COMPETING OPTIONS:\n- Custom database triggers required: Incorrect; dbt manages snapshot rows purely inside its analytical execution layer and does not utilize native database trigger files.\n- Adds dbt_is_active boolean: dbt utilizes start/end time markers (`dbt_valid_from`/`dbt_valid_to`) rather than boolean flags to track timelines in SCD Type II tables.\n- Requires `check_cols` and adds inserted_at/deleted_at: `check_cols` is used in the `check` strategy rather than `timestamp` strategy, and dbt append schema columns are standardized to `dbt_valid_from`/`dbt_valid_to`.",
    references: "https://docs.getdbt.com/docs/build/snapshots",
    dbtVersionFocus: "Core"
  },
  {
    id: 27,
    category: "Develop Models",
    difficulty: "Associate",
    questionText: "Under what conditions is it appropriate to configure and load data using a dbt Seed rather than compiling database models, and what size limitation does dbt strongly recommend for seed files?",
    options: [
      "Seeds are for raw transactional databases exceeding 1,000,000 rows, compiled directly from live streams.",
      "Seeds are ideal for static lookup CSV data that rarely changes (such as country code lookups or employee department maps). dbt strongly recommends that seeds are kept small (preferably under 10,000 to 50,000 rows) as they are loaded via full git tree uploads and insert statement blocks.",
      "Seeds are used exclusively to mock incremental strategy partitions and have an absolute hard limit of 100 rows.",
      "Seeds are dynamic database views loaded from API endpoints that are updated on every 'dbt test'."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\ndbt seeds are csv listings located in the local `seeds/` workspace folder. They are suitable for static lookup mappings (e.g., state codes, marketing campaign metadata) that do not require continuous updates. Because dbt compiles these internal csv rows into a series of INSERT statements during `dbt seed`, loading large files causes dramatic execution delays. Therefore, dbt recommends keeping seeds under 10k-50k rows.\n\nINCORRECT COMPETING OPTIONS:\n- Seeds are for raw streaming transactional tables exceeding 1M rows: Dynamic streaming tables must be loaded via extract-load pipelines as sources, never uploaded as CSVs into a git tree.\n- Seeds have an absolute hard limit of 100 rows: There is no strict hard limits count enforced by the compiler, but exceeding 50,000 rows causes immense latency.\n- Seeds are dynamic database views: Seeds are static data files; they can never be rendered as live relational database views.",
    references: "https://docs.getdbt.com/docs/build/seeds",
    dbtVersionFocus: "Core"
  },
  {
    id: 28,
    category: "Develop Models",
    difficulty: "Intermediate",
    questionText: "A dbt project needs to write tables to isolated warehouse databases based on the active target environment. By default, dbt appends a suffix, but the developer wants to override this behavior using the dynamic macro `generate_database_name`. What is the correct pattern to ensure custom databases are respected without standard suffix concatenation?",
    options: [
      "Pass a parameter in `dbt_project.yml` reading: `override_database: true`.",
      "Write a custom macro in the project named `generate_database_name(custom_database_name, node)`. Inside this macro, check the value of `custom_database_name` and the current `target.name`. If a custom database is defined, return it directly instead of appending the default target suffix.",
      "Database overrides must be defined by modifying the system drivers inside the container's `/root/.dbt/profiles.yml`.",
      "Use the 'generate_schema_name' macro to dynamically override both schemas and databases in a single string returned to the engine."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nBy default, dbt concatenates the target database name to custom configurations. To override this behavior, developers replace the default macro by authoring a custom macro named `generate_database_name(custom_database_name, node)`. If target rules match or `custom_database_name` is present, it returns the customized database name directly, skipping standard suffixing.\n\nINCORRECT COMPETING OPTIONS:\n- Pass override_database inside `dbt_project.yml`: Invalid configuration key; database resolution is managed by profiles and dynamic engine macros.\n- Modify container `profiles.yml` directly: Modifying global user profiles directly prevents dynamic, programmatic, environment-based naming overrides inside model code.\n- Return combined databases from `generate_schema_name`: The schema generation macro lacks permission to override catalog database descriptors directly.",
    references: "https://docs.getdbt.com/docs/build/custom-databases",
    dbtVersionFocus: "Core"
  },
  {
    id: 29,
    category: "Debug Data Models",
    difficulty: "Intermediate",
    questionText: "An analytics developer runs 'dbt source freshness' and gets an active failure because the raw source table freshness check crossed the error threshold. However, they verify that fresh data was loaded 10 minutes ago. What is the most likely root cause of this mismatch?",
    options: [
      "The developer specified a static timezone in `profiles.yml` that mismatched the local system clock.",
      "The source configuration in YAML either specified an incorrect `loaded_at_field` column name (so dbt checked system update times, or used the wrong date column), or the database system clock has a synchronization/timezone deviation when compared against the current date evaluated by dbt.",
      "Sources do not support timestamp filtering and must rely on standard sequential primary keys.",
      "The database driver was configured with `enforce_contract: true` causing source validation checks to fail."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nSource freshness measures the difference between of the maximum value of the designated `loaded_at_field` column and the clock of the machine executing dbt. If `loaded_at_field` points to a column that isn't updated (e.g., user_birthdate instead of record_inserted_at) or if timezone mismatches (UTC vs local) exist between the warehouse timestamps and the execution agent environment, dbt records false freshness errors.\n\nINCORRECT COMPETING OPTIONS:\n- System timezone in `profiles.yml` mismatch: Connection profiles do not support static timezone constraints as separate settings affecting freshness math.\n- Sources do not support timestamp filtering: Sources do natively support timestamp tracking using `loaded_at_field` properties.\n- Driver configured with enforce_contract: Datastore contracts are for verifying model schemas, not checking feed pipeline ingestion intervals.",
    references: "https://docs.getdbt.com/docs/build/sources#source-freshness",
    dbtVersionFocus: "Core"
  },
  {
    id: 30,
    category: "Test and Document Models",
    difficulty: "Advanced",
    questionText: "You want to create a custom generic test named `is_even` to assert that all column values in a database are divisible by 2. How should you structure this test inside your project?",
    options: [
      "Create a custom SQL test inside the `tests/` directory named `dim_customers_is_even.sql` referencing specific column nodes.",
      "Create a macro file inside `macros/` (e.g., `is_even.sql`) defining a macro named `test_is_even(model, column_name)`. The macro must construct a SQL SELECT statement that returns rows where the modulo calculation evaluates to a non-zero value.",
      "Configure a custom generic test inside standard `dbt_project.yml` using JSON schemas.",
      "Generic tests cannot be customized; you must use third-party plugins or singular tests exclusively."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nIn dbt, a custom generic test is declared as a reusable macro prefixed with `test_` (like `test_is_even`). It accepts parameters `model` and `column_name`. The compiled SELECT query must target the test rows that violate the constraint: returning any non-even rows. If any row is returned by the compiled query, the test fails during `dbt test`.\n\nINCORRECT COMPETING OPTIONS:\n- Custom sql test inside tests/ name dim_customers_is_even.sql: Standalone sql files represent singular tests which apply to specific tables/columns and are not reusable across other models.\n- Configure JSON schemas in `dbt_project.yml`: Unrecognized pattern; generic validation logic must be written as macros.\n- Generic tests cannot be customized: Generic tests are highly customizable and can be introduced via custom macros perfectly.",
    references: "https://docs.getdbt.com/docs/build/data-tests#generic-data-tests",
    dbtVersionFocus: "Core"
  },
  {
    id: 31,
    category: "Deploy dbt Projects",
    difficulty: "Intermediate",
    questionText: "An analytics engineer completes code changes for a single downstream model named `fct_user_retention`. They want to compile, run, and replace this model inside the database but skip compiling and executing any matching column assertions or source validation tests. Which command performs this isolated operation?",
    options: [
      "dbt build `--select` fct_user_retention --exclude-tests",
      "dbt run `--select` fct_user_retention",
      "dbt test `--select` fct_user_retention --skip-asserts",
      "dbt run --model fct_user_retention+ --no-tests"
    ],
    correctAnswers: [1],
    explanation: "To perform model execution exclusive of testing, the command `dbt run` must be invoked. The selector `--select fct_user_retention` directs dbt to target only that model. If the developer calls `dbt build`, dbt executes and validates tests concurrently, whereas `dbt run` bypasses test node compilation entirely.",
    references: "https://docs.getdbt.com/reference/commands-glossary#dbt-run",
    dbtVersionFocus: "Core"
  },
  {
    id: 32,
    category: "Test and Document Models",
    difficulty: "Associate",
    questionText: "To avoid cluttering schema YAML files with very long, multi-line paragraph descriptions of dbt models or columns, which feature should you use to separate descriptions into clean dedicated markdown files?",
    options: [
      "Move the descriptions directly into separate inline comments using SQL '--' markers in the model code files.",
      "Use dbt doc blocks. You create a `.md` developer file in your project containing description fragments enclosed within `{% docs block_name %}` and `{% enddocs %}` tags, then reference them in your schema YAML using the Jinja function `{{ doc('block_name') }}`.",
      "Define and import static json tables using seed files configured in target paths.",
      "Create a separate document under `target/`manifest.json manually using REST APIs."
    ],
    correctAnswers: [1],
    explanation: "dbt doc blocks allow cleanly moving verbose database descriptions out of schema YAML files. By placing descriptions inside `.md` files wrapped in `{% docs block_name %}` wrappers, developers keep properties tidy and reference them simply with `{{ doc('block_name') }}` within YAML schema fields.",
    references: "https://docs.getdbt.com/docs/build/documentation",
    dbtVersionFocus: "Core"
  },
  {
    id: 33,
    category: "Debug Data Models",
    difficulty: "Intermediate",
    questionText: "A `dbt run` fails with a compiler error: 'Compilation Error: Found a cyclic dependency between dim_customers and fct_orders.' How does this error occur in dbt projects, and how should it be corrected?",
    options: [
      "It occurs because both models are configured with identical database target table schemas.",
      "It occurs because model `dim_customers` references `fct_orders` via a `{{ ref() }}` function, while `fct_orders` simultaneously references `dim_customers` via `{{ ref() }}`. To resolve this, the circular reference must be broken, typically by extracting shared logic into a common upstream staging or lookup model.",
      "Cyclic dependencies are resolved automatically if the models are materialized as view schemas instead of tables.",
      "Run 'dbt compile --force-resolve' to allow recursive execution paths."
    ],
    correctAnswers: [1],
    explanation: "dbt creates a Directed Acyclic Graph (DAG) using `ref()` declarations. If two models refer to each other directly or indirectly, a cycle is created, preventing dbt from resolving execution order. This must be corrected by refactoring the dependency chain, often by moving circular lookups into intermediate tables.",
    references: "https://docs.getdbt.com/concepts/about-the-dag",
    dbtVersionFocus: "Core"
  },
  {
    id: 34,
    category: "Develop Models",
    difficulty: "Advanced",
    questionText: "When setting up Type II slowly changing dimensions in dbt using a snapshot `check` strategy, how does dbt evaluate changes if `check_cols` is configured with a list of values, and what is the behavior if any value changes to null?",
    options: [
      "dbt computes a hash of the designated columns on each execution. If the hash differs or if a column transitions between null and populated values, a new row is appended to the snapshot.",
      "dbt performs a full string comparison. If a column transitions to null, dbt ignores it because null has no value.",
      "The snapshot strategy will error during compiling because `check_cols` does not support nullable data fields.",
      "dbt replaces the historical record in-place instead of creating a newer segment block."
    ],
    correctAnswers: [0],
    explanation: "With the `check` strategy, dbt monitors a specified array of columns (`check_cols: ['email', 'status']`). It tracks updates by asserting whether column hashes have changed. If a column value matches a different value, or goes from populated to null or from null to populated, dbt correctly captures the change and starts a new Type II snapshot row.",
    references: "https://docs.getdbt.com/docs/build/snapshots#the-check-strategy",
    dbtVersionFocus: "Core"
  },
  {
    id: 35,
    category: "Develop Models",
    difficulty: "Intermediate",
    questionText: "In writing highly dynamic dbt configurations, what is the core behavioral and compilation difference between utilizing the Jinja functions `{{ var() }}` and `{{ env_var() }}`?",
    options: [
      "There is no difference; they are direct aliases referencing identical connection profiles.",
      "`var` references variables declared in files like `dbt_project.yml` or specified on the CLI; these variables compile at dbt parser time. `env_var` calls environment-level parameters present on the executing OS host, which dbt parses dynamically.",
      "`env_var` can only be queried inside standard test configurations, while `var` works exclusively under model code.",
      "`var` variables are encrypted and stored in databases, whereas `env_var` is written to public target logs."
    ],
    correctAnswers: [1],
    explanation: "`var()` is used for dbt-specific project configurations, which can be defined in YAML files or passed with `--vars`. `env_var()` queries environment variables directly from the host operating system's shell environment. This is highly useful for passing secrets, tokens, or dynamic runtime targets during scheduled system runs.",
    references: "https://docs.getdbt.com/reference/dbt-jinja-functions/env_var",
    dbtVersionFocus: "Core"
  },
  {
    id: 36,
    category: "Deploy dbt Projects",
    difficulty: "Intermediate",
    questionText: "Where is the `profiles.yml` file normally stored, and how does configuring the `threads` option inside a profile connection block affect execution performance during 'dbt run'?",
    options: [
      "Profiles are stored in the `target/` directory and `threads` controls the CPU core count on the developer's laptop.",
      "Profiles are usually stored in `~/.dbt/` on local systems. The `threads` setup indicates the maximum number of concurrent database execution connections dbt establishes, allowing independent models to compile and execute in parallel up to that limit.",
      "Profiles must be defined inside Git repositories and `threads` manages parallel background web sockets.",
      "The profiles file stores the git checkout credentials, and `threads` specifies model partition indices."
    ],
    correctAnswers: [1],
    explanation: "By default, `profiles.yml` resides in the standard user fallback directory (`~/.dbt/`). The `threads` setting defines the degree of database parallelism. dbt will run isolated or sibling nodes in parallel up to the declared thread count, improving overall build speed on databases that support concurrent queries.",
    references: "https://docs.getdbt.com/docs/core/connect-data-platform/profiles.yml",
    dbtVersionFocus: "Core"
  },
  {
    id: 37,
    category: "Test and Document Models",
    difficulty: "Intermediate",
    questionText: "By default, if a generic column test fails, dbt halts build runs and reports a severe error. How can a developer customize a test inside schema YAML properties so meeting failure counts does not immediately crash dbt, but instead raises a harmless warning unless failures cross a specific threshold?",
    options: [
      "Add 'continue_on_fail: true' directly to target model properties.",
      "Assign detailed properties under the test definition in schema YAML, adding `severity: warn` or configuring threshold counts using `error_if` and `warn_if` parameters.",
      "Change the database driver configurations inside `profiles.yml` to ignore all warning constraints.",
      "Warning configurations are only possible inside custom singular generic SQL test files."
    ],
    correctAnswers: [1],
    explanation: "To customize test alerting, you define detailed configuration blocks. Specifying `severity: warn` sets dbt to report warnings instead of errors. You can also specify fine-grained rules, such as `warn_if: '>5'` or `error_if: '>50'`, allowing tests to pass with warning statuses up to a defined failure tolerance limit.",
    references: "https://docs.getdbt.com/reference/resource-config-properties/severity",
    dbtVersionFocus: "Core"
  },
  {
    id: 38,
    category: "Debug Data Models",
    difficulty: "Advanced",
    questionText: "An analytics engineer is optimizing a dbt model on Snowflake that queries an extremely large table. They want to configure a clustering key to speed up query performance. What is the correct configuration format in the model's configuration block?",
    options: [
      "Use the generic 'cluster_by' column test in schema properties under column keys.",
      "Specify `cluster_by` inside the model's `config()` block (as a string or list of column names, e.g., `cluster_by=['customer_id', 'order_date']`), which directs the Snowflake dbt adapter to compile alter and create statements assigning the clustering keys.",
      "Database-specific performance configurations must be applied as custom post-hooks on every model.",
      "Clustering configurations are defined inside the target database's global tables and cannot be configured in dbt."
    ],
    correctAnswers: [1],
    explanation: "The Snowflake dbt adapter natively supports the `cluster_by` model config option. Setting `cluster_by` to list or string key columns (e.g., `cluster_by=['event_date', 'event_type']`) causes dbt to issue appropriate table properties creation parameters, improving physical micro-partitioning behavior for Snowflake datasets.",
    references: "https://docs.getdbt.com/reference/resource-configs/snowflake-configs#clustering-keys",
    dbtVersionFocus: "Core Snowflake Adapter"
  },
  {
    id: 39,
    category: "Develop Models",
    difficulty: "Intermediate",
    questionText: "To implement access audit logging or clean up auxiliary staging tables, a developer wants to run a raw SQL command immediately before or after a model is built. What is the correct way to declare this behavior inside dbt models?",
    options: [
      "Configure standard SQL views to execute in series using macro call chains inside raw `profiles.yml`.",
      "Use pre-hooks and post-hooks. They can be defined inside the model `config()` block or inside `dbt_project.yml` using `pre_hook` and `post_hook` parameters, passing direct raw SQL statements or macro builders to execute.",
      "Modify the database schema manually by adding database trigger functions on compile targets.",
      "Pre-hooks and post-hooks are deprecated; developers must use ephemeral staging tables instead."
    ],
    correctAnswers: [1],
    explanation: "dbt provides hooks (`pre-hook` and `post-hook`) to run custom database SQL commands at specific stages of model execution. They are highly useful for managing security attributes (such as granting SELECT privileges post-build) or cleaning up dependencies, and can be declared at the project or model configuration level.",
    references: "https://docs.getdbt.com/reference/resource-configs/pre-hook-post-hook",
    dbtVersionFocus: "Core"
  },
  {
    id: 40,
    category: "Deploy dbt Projects",
    difficulty: "Advanced",
    questionText: "Under dbt Mesh architectures, you have published a public model `dim_products` inside a core catalog project. You want to add a new column to it while maintaining backward compatibility for downstream consumer projects who reference it under tight schema contracts. What is the recommended strategy?",
    options: [
      "Delete the model schema definition YAML files temporarily to bypass downstream pre-flight dependency comparisons and force compiling.",
      "Utilize model versioning. Increment the version of `dim_products` from `v1` to `v2` inside the YAML block, keeping `v1` active as the latest_version (or vice-versa with appropriate deprecation targets) to allow downstream consumer projects to migrate at their own pace.",
      "Downstream projects must immediately duplicate the core project's codebase to resolve import errors.",
      "Cross-project models cannot be changed. Any schema changes will result in complete data failure."
    ],
    correctAnswers: [1],
    explanation: "To introduce changes to public dbt models in a mesh setup without breaking downstream consumer nodes, developers configure model versioning. By maintaining `v1` (with the old columns and active enforced contract) and introducing a new version `v2`, downstream teams can reference the legacy version until they are ready to adopt the newer version, providing smooth migration paths.",
    references: "https://docs.getdbt.com/docs/collaborate/govern/model-versions",
    dbtVersionFocus: "v1.6+ (Model Versioning & Mesh Coordination)"
  },
  {
    id: 41,
    category: "Develop Models",
    difficulty: "Advanced",
    questionText: "A developer is writing a multi-platform dbt macro that needs to implement separate logic depending on whether dbt is executing on Snowflake or BigQuery. Which Jinja syntax should they use to write this conditional block, and which properties are checked?",
    codeSnippet: `{% if target.type == 'snowflake' %}
    select date_trunc('month', created_at)
{% elif target.type == 'bigquery' %}
    select date_trunc(created_at, month)
{% endif %}`,
    codeLanguage: "jinja",
    options: [
      "Use '{{ env_var('DBT_WAREHOUSE') }}' to detect Snowflake vs BigQuery and execute custom string matches.",
      "Use the 'target.type' variable in a standard Jinja control flow block. It evaluates to the active connection's adapter type defined in the target profile.",
      "Use 'target.name' since it holds database driver labels (like 'snowflake' or 'bigquery') by default across all files.",
      "Macros cannot dynamically alternate schema execution based on platforms; separate SQL files must be authored instead."
    ],
    correctAnswers: [1],
    explanation: "The `target` context dictionary is populated by dbt from the connection properties defined in `profiles.yml`. While `target.name` contains the client-defined target identifier (like 'dev' or 'prod'), `target.type` contains the platform adapter engine type (like 'snowflake', 'bigquery', 'redshift', or 'postgres'), enabling custom cross-database SQL macros.",
    references: "https://docs.getdbt.com/reference/dbt-jinja-functions/target",
    dbtVersionFocus: "Core"
  },
  {
    id: 42,
    category: "Develop Models",
    difficulty: "Advanced",
    questionText: "An analytics engineer materializes a staging model as 'ephemeral'. In a downstream data model, they reference this ephemeral model three times inside distinct JOIN subqueries. How does `dbt compile` this logic, and what are the performance and cost implications?",
    options: [
      "dbt creates a temporary database view for the ephemeral model, which is dropped automatically after the downstream model finishes compiling.",
      "dbt compiles the ephemeral model as a single Common Table Expression (CTE) at the top of the SQL file, then references it three times natively, optimizing compute charges.",
      "dbt compiles and duplicates the full SQL statement of the ephemeral model inline as three separate, independent CTEs at each joint location. This can lead to redundant compute operations if the query is extremely complex.",
      "dbt raises a compilation circular dependency error because ephemeral models cannot be referenced multiple times under joint clauses."
    ],
    correctAnswers: [2],
    explanation: "Ephemeral materialization interpolates the source code of the referenced model directly into the downstream model’s compiled SQL during run time. When referenced multiple times, dbt creates a separate Common Table Expression (CTE) with generated aliases (e.g., `__dbt__cte__model_name`) for each call, leading to duplication in compile results that can hurt database engine execution performance.",
    references: "https://docs.getdbt.com/docs/build/materializations#ephemeral",
    dbtVersionFocus: "Core (Ephemeral Compilation)"
  },
  {
    id: 43,
    category: "Develop Models",
    difficulty: "Associate",
    questionText: "Which statement accurately describes the compilation and lineage difference between referencing a raw table using the standard `source('source_name', 'table_name')` Jinja function versus referencing a model using the `ref('model_name')` function in dbt?",
    options: [
      "The 'source' function tells dbt that the resource is an externally loaded table not created by dbt, creating an entry point for lineage. The 'ref' function references a dbt-governed model and dynamically establishes execution sequence dependencies in the DAG.",
      "The 'ref' function is only valid for tables vectorized as views, while 'source' applies exclusively to tables materialized incrementally.",
      "The 'source' function runs dynamic database update checks before compiling models, whereas 'ref' queries stored cached tables.",
      "Both functions compile down to the exact same relative database path string and share identical syntax rules under YAML profiles."
    ],
    correctAnswers: [0],
    explanation: "In dbt, staging inputs are clearly split. `source` tells dbt that a table sits outside the project's compilation scope (externally populated by ingestion tools), while `ref` references another model compiled *by* the dbt project. `ref` creates the execution dependencies that allow dbt to build the Directed Acyclic Graph (DAG) and run upstream models in chronological sequence.",
    references: "https://docs.getdbt.com/reference/dbt-jinja-functions/source",
    dbtVersionFocus: "Core"
  },
  {
    id: 44,
    category: "Develop Models",
    difficulty: "Advanced",
    questionText: "By default, when you configure a custom schema on a dbt model (e.g., 'schema: marketing') and run the model in development under target schema 'dev_john', how does dbt determine the final target schema name in the database?",
    options: [
      "It completely replaces 'dev_john' and writes the model directly to the schema named 'marketing'.",
      "It concatenates the active target schema name with the custom schema, resulting in the database schema 'dev_john_marketing'.",
      "It creates an isolated schema named 'marketing_dev_john' to keep developer schemas isolated.",
      "It ignores the custom schema name during development and builds the table in 'dev_john' anyway."
    ],
    correctAnswers: [1],
    explanation: "By default, dbt appends custom schema names to the target schema to keep isolated environments tidy. For example, if your target schema is `dev_john` and you assign `schema: marketing` to a model, the default macro `generate_schema_name` produces `dev_john_marketing`. To change this behavior, you must create a custom macro of the helper interface `generate_schema_name`.",
    references: "https://docs.getdbt.com/docs/build/custom-schemas",
    dbtVersionFocus: "Core (Custom Schema Resolution)"
  },
  {
    id: 45,
    category: "Develop Models",
    difficulty: "Intermediate",
    questionText: "An analytics engineer creates two separate SQL files in their project: one at `models/staging/marketing/stg_customers.sql` and another at `models/staging/sales/stg_customers.sql`. How does dbt handle this configuration when they run 'dbt compile'?",
    options: [
      "dbt compiles both successfully because they reside in isolated directories, and resolves references using relative directories.",
      "dbt raises a compilation error because all compiled model names inside a dbt project must be globally unique, regardless of their subdirectory path configuration.",
      "dbt compiles them into a single database relation under a merged schema, grouping their records into a unified table.",
      "dbt ignores the file in the sales directory and processes only the first file encountered in dictionary order."
    ],
    correctAnswers: [1],
    explanation: "Unlike classical filesystems, dbt enforces global uniqueness of model names. When you run `ref('stg_customers')`, dbt must be able to resolve to a single model. If there are duplicates (even in different paths), dbt raises a compilation conflict error stating: 'Found 2 models with the name stg_customers'. This must be resolved by choosing unique filenames.",
    references: "https://docs.getdbt.com/reference/dbt-jinja-functions/ref#resolving-relations",
    dbtVersionFocus: "Core Namespace Rules"
  },
  {
    id: 46,
    category: "Develop Models",
    difficulty: "Intermediate",
    questionText: "A data pipeline needs to run targeting dynamic historical dates. A variable list is declared in `dbt_project.yml` under 'vars'. However, the developer runs dbt with a CLI override command. How does dbt resolve the variable priority?",
    codeSnippet: `dbt run --vars '{"cutoff_date": "2026-01-01"}'`,
    options: [
      "dbt merges both parameters, with variables defined in files taking absolute precedence.",
      "dbt overrides any file-level definition and executes with the CLI value ('2026-01-01') exclusively.",
      "dbt raises a validation error, forcing the developer to remove the variable declaration from `dbt_project.yml` before launching overrides.",
      "dbt appends the values together as a nested query list."
    ],
    correctAnswers: [1],
    explanation: "Variables defined on the command line via `--vars` always take absolute precedence over default variables defined in the `dbt_project.yml` file. This is useful for passing dynamic parameters (like partition bounds or pipeline execution dates) during scheduled execution loops.",
    references: "https://docs.getdbt.com/docs/build/project-variables",
    dbtVersionFocus: "Core"
  },
  {
    id: 47,
    category: "Develop Models",
    difficulty: "Advanced",
    questionText: "You are designing an incremental model and configure 'on_schema_change: sync_all_columns'. During a source deployment, we drop three legacy columns and add two new columns to the SQL model file. How does dbt handle the target database table on the next incremental execution run?",
    options: [
      "dbt halts the build with an exception because incremental schemas are structurally read-only.",
      "dbt appends the two new columns, but ignores the three dropped columns to preserve historical database values.",
      "dbt dynamically alters the database table: appending the two new columns, and physically dropping the three deleted columns to matches the current SQL properties alignment.",
      "dbt drops the existing table and performs a full rebuild from scratch on any schema modified."
    ],
    correctAnswers: [2],
    explanation: "Under the `sync_all_columns` configuration, dbt aligns the physical target database table with the source query. On the next incremental run, dbt will execute appropriate ALTER TABLE statements to add any new columns and physically drop columns that are no longer present in the query definition.",
    references: "https://docs.getdbt.com/reference/resource-configs/on_schema_change",
    dbtVersionFocus: "Core (on_schema_change)"
  },
  {
    id: 48,
    category: "Develop Models",
    difficulty: "Intermediate",
    questionText: "When writing highly modular models, what three conditions must evaluate to true for the dbt Jinja conditional block 'is_incremental()' to return true during pipeline execution?",
    codeSnippet: `{% if is_incremental() %}
    where event_timestamp >= (select max(event_timestamp) from {{ this }})
{% endif %}`,
    options: [
      "1) The model materialization is set to 'incremental', 2) the destination table already exists in the target database, and 3) the '--full-refresh' flag is NOT present in the active command line parameters.",
      "1) The active target is 'prod', 2) the table contains at least one primary key, and 3) it has been compiled at least once using 'dbt compile'.",
      "1) The database table contains partitioning keys, 2) the developer is using Redshift, and 3) the model is annotated with global model contracts.",
      "1) The model utilizes 'unique_key' configuration, 2) there are no active validation failures, and 3) 'dbt test' has run successfully."
    ],
    correctAnswers: [0],
    explanation: "For the helper function `is_incremental()` to return `true` at execution time, three conditions MUST be met: first, the model's materialization block config is configured as `materialized='incremental'`; second, the target table must already exist physically in the database; and third, the user must NOT be carrying out a full refresh run (i.e. `--full-refresh` is absent). If any of these are false, dbt compiles standard select sequences and ignores incremental blocks.",
    references: "https://docs.getdbt.com/reference/dbt-jinja-functions/is_incremental",
    dbtVersionFocus: "Core Incremental logic"
  },
  {
    id: 49,
    category: "Debug Data Models",
    difficulty: "Intermediate",
    questionText: "An analytics engineer shifts a model's materialization from 'view' to 'table' in the SQL configuration block. However, running 'dbt run' fails on some databases due to a class/relation path type mismatch. What is the root cause of this failure, and how does dbt normally mitigate this across modern adapters?",
    options: [
      "Database systems allow altering views directly to tables. The error is caused by connection timeouts.",
      "Many databases prevent replacing an existing VIEW with a TABLE (or vice-versa) using standard create statements. dbt mitigates this by running pre-flight lookups; on detection of a relation type changes, dbt automatically issues 'DROP VIEW' or 'DROP TABLE' statements before compiling the new structure.",
      "Adapters require the database to be completely restarted to flush the metadata cache.",
      "The engineer must manually configure 'materialization_change: true' inside `profiles.yml`."
    ],
    correctAnswers: [1],
    explanation: "In SQL databases, you cannot execute `CREATE TABLE` over an object that is currently a `VIEW` without dropping it first. dbt handles this by checking the catalog before building. If dbt detects a type conflict (e.g., trying to write a table over a legacy view), it automatically issues appropriate drop statements to clear the destination namespace prior to creation.",
    references: "https://docs.getdbt.com/docs/build/materializations#materializations",
    dbtVersionFocus: "Core State Management"
  },
  {
    id: 50,
    category: "Debug Data Models",
    difficulty: "Advanced",
    questionText: "During Slim CI diagnostic checks, a developer wants to inspect the exact, fully compiled SQL query of a failing model named 'stg_payments' before it gets executed. Where should they look inside the project filesystem to inspect this output?",
    options: [
      "In the root directory under the 'logs/dbt.log' file exclusively.",
      "Inside the `target/compiled/staging/stg_payments.sql` file, which records the fully-resolved Jinja statements.",
      "Within `target/run/staging/stg_payments.sql`, which records raw SQL wrapping transaction wrappers.",
      "Inside `sources.json` generated in the root configuration directories."
    ],
    correctAnswers: [1],
    explanation: "dbt writes all compile artifacts to the `target/` directory. The file path `target/compiled/...` holds the pure compiled SQL with all Jinja references and logic resolved (e.g., sources/refs converted to raw database paths). This is ideal for copying and pasting directly into database query consoles to troubleshoot compilation issues.",
    references: "https://docs.getdbt.com/reference/commands-glossary#dbt-compile",
    dbtVersionFocus: "Core"
  },
  {
    id: 51,
    category: "Debug Data Models",
    difficulty: "Associate",
    questionText: "When onboarding a new analytics developer, they run 'dbt debug'. What is the primary purpose of this command compared to 'dbt compile' or 'dbt run'?",
    options: [
      "It compiles and validates all custom Jinja macros to check for circular imports.",
      "It performs a full-scale test of the pipeline database driver connection, checking the presence and syntax validity of `profiles.yml`, operating system environment variables, database credential handshakes, and diagnostic logs.",
      "It boots an interactive local debugging user terminal where developers can query operational database rows directly.",
      "It drops all dev schemas and recreates them to ensure clean environments."
    ],
    correctAnswers: [1],
    explanation: "`dbt debug` does not parse or run models. Instead, it tests the dev environment configuration: validating CLI parameters, confirming the `profiles.yml` file is structured correctly and exists, verifying database connection logins (host, username, password handshakes), and checking python/git dependencies.",
    references: "https://docs.getdbt.com/reference/commands/debug",
    dbtVersionFocus: "Core Setup Guides"
  },
  {
    id: 52,
    category: "Debug Data Models",
    difficulty: "Intermediate",
    questionText: "An analytics run crashes with a database error: 'Transaction aborted due to lock wait timeout'. You check the profile and see 'threads: 16'. How does threads setting relate to this error, and how should it be handled for diagnostic troubleshooting?",
    options: [
      "The 'threads' number exceeded the database CPU count, forcing the operating system to shut down connections.",
      "The 'threads' setting specifies how many models dbt executes in parallel. High numbers improve speed but can cause transaction locking conflicts if independent models update the same tables concurrently. For diagnostics, reducing threads to 1 isolates sequential models to identify locks.",
      "Threads control the number of files dbt compiles at a time, which is handled locally on the laptop with zero database impact.",
      "Remove the 'threads' config altogether; dbt requires a static thread count of 100 for proper execution."
    ],
    correctAnswers: [1],
    explanation: "The `threads` setting defines the maximum number of concurrent warehouse connections. While higher thread settings can speed up execution, they can cause transaction deadlock errors if parallel models try to write or lock overlapping resources. Temporarily setting `threads: 1` in `profiles.yml` helps you locate exactly which models are competing for identical resources.",
    references: "https://docs.getdbt.com/docs/core/connect-data-platform/profiles.yml#understanding-threads",
    dbtVersionFocus: "Core Connection Profiles"
  },
  {
    id: 53,
    category: "Debug Data Models",
    difficulty: "Intermediate",
    questionText: "A developer executes 'dbt run' on a large analytics sequence, resulting in: 'Compilation Error: Cyclic dependency detected'. Which of the following is the most direct approach to identify and resolve this error compiling the DAG?",
    options: [
      "Run 'dbt run --full-refresh' to bypass database schema checks on legacy structures.",
      "Analyze the compiler output log or standard error block to locate the loop variables (e.g. Model A -> Model B -> Model A). Resolve this by extracting the circular queries into a static seed file, or by breaking the chain using staging models.",
      "Configure multiple profile targets inside `profiles.yml` and isolate the compilation runs.",
      "Convert the tables to ephemeral materialization which natively supports circular references."
    ],
    correctAnswers: [1],
    explanation: "Cyclic dependencies represent circular reasoning inside the dbt DAG (Directed Acyclic Graph). This happens if Model A references Model B, while Model B references Model A via `ref()`. Because dbt cannot determine which model to execute first, compilation fails. It must be resolved by restructuring the queries and moving the shared dependencies upstream.",
    references: "https://docs.getdbt.com/concepts/about-the-dag",
    dbtVersionFocus: "Core"
  },
  {
    id: 54,
    category: "Debug Data Models",
    difficulty: "Advanced",
    questionText: "If an analytics engineer defines a model as 'ephemeral', which of the following is a key functional and debugging constraint compared to 'table' or 'view' materializations?",
    options: [
      "Ephemeral models cannot be tested with standard primary key column assertions.",
      "An ephemeral model does not exist as a physical relation in the database schema. Therefore, you cannot query it directly using interactive database consoles outside of dbt's compile environment, complicating direct data query audits.",
      "Ephemeral models are only compiled when running under develop targets.",
      "Ephemeral models cannot be grouped into dbt packages."
    ],
    correctAnswers: [1],
    explanation: "`ephemeral` models are compiled as common table expressions (CTEs) inside consumer models. Because no physical database table or view is ever created, they are invisible inside database query platforms. To debug their values, you must inspect the downstream model's compiled SQL code inside the `target/compiled/` directory.",
    references: "https://docs.getdbt.com/docs/build/materializations#ephemeral",
    dbtVersionFocus: "Debugging constraints"
  },
  {
    id: 55,
    category: "Debug Data Models",
    difficulty: "Intermediate",
    questionText: "An analytics engineer running complex continuous integration checks wants to accelerate pre-flight validation by compiling project manifest dependencies locally. What does 'dbt parse' do, and what output is cached?",
    options: [
      "It executes tests against raw schemas without modifying underlying indexes.",
      "It parses the entire dbt project structure (Jinja code, macros, sources, specs) to generate and cache the `manifest.json` file, verifying file properties without executing any queries against the destination warehouse.",
      "It compiles model views but skips processing columns with active model contracts.",
      "It compares production and staging schemas, physically dropping tables if they deviate."
    ],
    correctAnswers: [1],
    explanation: "The `dbt parse` command parses all SQL, YAML, and configuration files in the project. It builds the system DAG internally and writes the complete `manifest.json` metadata model to the `target/` directory, checking that the project compiles with no Jinja or YAML syntax errors without ever connecting to the database.",
    references: "https://docs.getdbt.com/reference/commands/parse",
    dbtVersionFocus: "v1.5+ (Compilation performance)"
  },
  {
    id: 56,
    category: "Debug Data Models",
    difficulty: "Intermediate",
    questionText: "When using third-party dbt packages (like dbt-utils), a developer wants to customize a variables setting declared inside the imported package. How is the variable value resolution completed under dbt Core architecture?",
    options: [
      "The package variables must be redefined by editing the packages files directly inside the 'dbt_packages/' folder.",
      "The developer redefines the package variable in their own local `dbt_project.yml` file under the 'vars' block. Local project declarations natively override any default values specified in package layers.",
      "Packages cannot be customized; the variables must be registered as database profiles.",
      "Create a singular seed file matching the variables structure and register it under the seed configurations."
    ],
    correctAnswers: [1],
    explanation: "You must never modify files inside the dependency directory `dbt_packages/` because they will be overwritten on the next execution of `dbt deps`. To override default package variables, declare them in your home `dbt_project.yml` under the `vars:` block. The local project settings automatically override import defaults.",
    references: "https://docs.getdbt.com/docs/build/packages#overriding-package-variables",
    dbtVersionFocus: "Core"
  },
  {
    id: 57,
    category: "Test and Document Models",
    difficulty: "Intermediate",
    questionText: "What is the primary operational difference in dbt between a 'singular' data test and a 'generic' data test?",
    options: [
      "Singular tests check for formatting configurations, while generic tests validate primary key alignments.",
      "Singular tests are written as unique SQL select queries inside the 'tests/' folder that return invalid records containing error values. Generic tests are reusable macros (like 'unique' or 'not_null') configured via property YAML blocks.",
      "Singular tests cannot fail a build, whereas generic tests instantly stop compiling.",
      "Generic tests run during development, while singular tests run only inside production environments."
    ],
    correctAnswers: [1],
    explanation: "dbt categorizes tests into: 1) Singular tests, which are custom, one-off SQL queries stored inside the `tests/` folder. If a singular test query returns any rows, it is flagged as a failure. 2) Generic tests, which are reusable macros called directly within YAML files (e.g., dbt's out-of-the-box `unique` or `not_null` assertions).",
    references: "https://docs.getdbt.com/docs/build/data-tests#singular-data-tests",
    dbtVersionFocus: "Core"
  },
  {
    id: 58,
    category: "Test and Document Models",
    difficulty: "Advanced",
    questionText: "An analytics engineer applies an 'accepted_values' test on a column that contains nullable records. If some schema rows contain null values, how does dbt evaluate this assertion, and does it fail the test?",
    options: [
      "dbt fails the test instantly because NULL is not an explicitly accepted value in the YAML listing.",
      "The test passes. By default, dbt's compiled 'accepted_values' logic includes a filter to ignore NULL records ('column IS NOT NULL'), meaning null values are allowed unless you also explicitly apply a 'not_null' test.",
      "dbt automatically converts all NULL values to the first accepted value string prior to running SQL compile operations.",
      "dbt halts compilation with a database driver exception because testing nullable columns is unsupported."
    ],
    correctAnswers: [1],
    explanation: "Because SQL operations look for violations, dbt's under-the-hood compiled generic SQL query for `accepted_values` asserts if any non-null record deviates from the listing. The test query executes code like: `where column not in (...) and column is not null`. Thus, NULLs are ignored. To guarantee no null values exist, you should always pair it with a `not_null` assertion.",
    references: "https://docs.getdbt.com/reference/resource-properties/tests#accepted-values",
    dbtVersionFocus: "Core Assertions"
  },
  {
    id: 59,
    category: "Test and Document Models",
    difficulty: "Intermediate",
    questionText: "To support rich documentation catalog generation, a dbt developer wants to reference descriptions written inside a separate markdown (.md) file using the Jinja 'doc()' function. What is the correct criteria for this markdown file?",
    options: [
      "The markdown file must be named 'descriptions.md' and reside in the system target directory.",
      "The description must be wrapped in a named docs block using '{% docs block_name %}' and '{% enddocs %}' tags. The file can be located anywhere in the paths defined in 'model-paths' or 'docs-paths' (inside `dbt_project.yml`).",
      "The markdown wrapper can only contain plain text with zero custom markdown layouts.",
      "Doc files must be checked into `profiles.yml` connection settings to enable compilation."
    ],
    correctAnswers: [1],
    explanation: "dbt retrieves markdown descriptions using docs blocks. To register a description, place it inside a `.md` file in the configured dbt model or document paths wrapped in a unique block identifier: `{% docs custom_desc_key %}`. Then, reference it in your schema YAML using `{{ doc('custom_desc_key') }}`.",
    references: "https://docs.getdbt.com/docs/build/documentation#using-docs-blocks",
    dbtVersionFocus: "Core documentation integration"
  },
  {
    id: 60,
    category: "Test and Document Models",
    difficulty: "Advanced",
    questionText: "By default, if a generic test fails with even a single row, the entire 'dbt test' execution registers as an error. How can a developer customize a test so it returns a warning instead of halting execution on low failure thresholds?",
    codeSnippet: `columns:
  - name: user_id
    data_tests:
      - unique:
          config:
            # Set severity behavior here`,
    options: [
      "Add a 'continue: true' configuration inline with the column name.",
      "Add a 'config:' property block inside the test configuration, specifying 'severity: warn' or setting failure tolerances using the 'warn_if' and 'error_if' properties.",
      "Configure global test severity limits exclusively inside `profiles.yml` target parameters.",
      "Tests cannot be configured to warn; failures must always return complete system compile exceptions."
    ],
    correctAnswers: [1],
    explanation: "Test alerts can be managed using the test severity configuration. By applying the `config:` property block to a test declaration in the YAML schema files, developers can override default behavior: specifying `severity: warn` or using rules like `warn_if: '>5'` and `error_if: '>20'` to tolerate a small volume of pipeline noise without crashing dbt builds.",
    references: "https://docs.getdbt.com/reference/resource-config-properties/severity",
    dbtVersionFocus: "v1.3+ (Test configuration updates)"
  },
  {
    id: 61,
    category: "Test and Document Models",
    difficulty: "Intermediate",
    questionText: "An analytics team is running 'dbt source freshness' and gets active failures. The team verifies that the data is arriving on time but notices that timezone offsets are causing freshness deviations. How is freshness computed by dbt?",
    options: [
      "dbt queries the database creation timestamps of the physical files on the disk system.",
      "dbt calculates the difference between the maximum timestamp retrieved from the schema's 'loaded_at_field' column and the system clock of the environment executing the dbt commands.",
      "dbt measures warehouse server query execution speeds across standard intervals.",
      "Freshness is determined exclusively by the git commit history of the yaml specs."
    ],
    correctAnswers: [1],
    explanation: "Source freshness checks if data pipeline feeds are lagging. When executing `dbt source freshness`, dbt captures the maximum value of the designated `loaded_at_field` column directly from the source table. It compares this value against the current system time of the runner/machine executing the dbt process, meaning system clock or timezone (UTC vs local) differences can trigger false warnings.",
    references: "https://docs.getdbt.com/docs/build/sources#source-freshness",
    dbtVersionFocus: "Core Freshness Rules"
  },
  {
    id: 62,
    category: "Test and Document Models",
    difficulty: "Advanced",
    questionText: "In dbt Core v1.8+, how does an engineer run ONLY the unit tests defined in their project while completely bypassing any generic tests or custom singular SQL assertions?",
    options: [
      "dbt run --tests-only",
      "dbt test `--select` \"test_type:unit\"",
      "dbt test --exclude \"test_scope:singular\"",
      "dbt build `--select` unit:*"
    ],
    correctAnswers: [1],
    explanation: "To selectively run dbt unit tests (which execute mock data assertions entirely in memory) and exclude schema generic tests (which hit the live database), developers use the specific test selector: `dbt test `--select` \"test_type:unit\"`. This isolates the unit testing phase from regular data quality tests.",
    references: "https://docs.getdbt.com/docs/build/unit-tests#running-unit-tests",
    dbtVersionFocus: "v1.8+ (Unit Testing Selector)"
  },
  {
    id: 63,
    category: "Deploy dbt Projects",
    difficulty: "Advanced",
    questionText: "In modern dbt Slim CI configurations, you run dbt with both '--defer' and '--state' flags. What is the fundamental behavior of this setup when executing modified models locally, and does it copy production records?",
    options: [
      "dbt copies all production tables matching the modified model dependencies locally to avoid permissions errors.",
      "dbt runs only the modified models in your dev dataset. For unmodified model dependencies, instead of requiring you to run or clone them locally, dbt redirects references to compile targeting the production tables in your prod database, utilizing the metadata manifest from the production environment.",
      "dbt compiles the upstream models as dynamic nested CTEs directly inline inside consumer models, completely bypassing database references.",
      "dbt drops dev schemas entirely and deploys code modifications straight to the production catalog."
    ],
    correctAnswers: [1],
    explanation: "When you use `--defer` and `--state`, dbt points to a previous production directory state's `manifest.json`. During compilation of any modified downstream models, if an unmodified upstream table does not exist in your development environment, dbt redirects the compiled code to read from the production database tables, saving time and compute resources.",
    references: "https://docs.getdbt.com/reference/node-selection/defer",
    dbtVersionFocus: "v1.5+ (Slim CI Integration)"
  },
  {
    id: 64,
    category: "Deploy dbt Projects",
    difficulty: "Intermediate",
    questionText: "When assessing multi-project lineage and structural layouts, a developer opens dbt Explorer. What metadata files must be generated to feed compiled info to dbt Explorer (or generate core lineage panels)?",
    options: [
      "Both `manifest.json` and `catalog.json` generated under the `target/` directory must be provided.",
      "Only the `profiles.yml` file with decrypted password sequences should be supplied.",
      "Explorer reads live SQL code repositories and does not parse static files.",
      "Only `sources.json` and `run_results.json` are consumed."
    ],
    correctAnswers: [0],
    explanation: "CORRECT ACTION:\ndbt Explorer (and standard documentation commands) are powered by compiling metadata from two critical files: `manifest.json` (which captures model configurations, dependencies, descriptions, and the system DAG structure) and `catalog.json` (which captures actual physical schema data types, table sizes, and row counts from the warehouse).\n\nINCORRECT COMPETING OPTIONS:\n- Only profiles.yml with decrypted passwords: Credential profiles contain network authentication secrets and are never read or stored by dbt Explorer for catalog lineage parsing.\n- Explorer reads live SQL repositories: Explorer operates on compiled JSON build artifacts rather than scanning raw git repositories directly.\n- Only sources.json and run_results.json: While `run_results.json` records invocation metrics, `manifest.json` and `catalog.json` are the foundational requirements for rendering data documentation and lineage graphs.",
    references: "https://docs.getdbt.com/docs/collaborate/explore-projects",
    dbtVersionFocus: "v1.10+ (dbt Explorer metadata)"
  },
  {
    id: 65,
    category: "Deploy dbt Projects",
    difficulty: "Intermediate",
    questionText: "How can an analytics engineer safely handle production warehouse credentials without committing raw secrets (like passwords or tokens) into git repositories?",
    options: [
      "Passwords can be hardcoded because `profiles.yml` is automatically encrypted compile-time.",
      "Use the Jinja `env_var()` function in the `profiles.yml` file to dynamically load secret tokens or passwords from the environment at runtime, keeping secrets out of git repositories.",
      "Store credentials in a public seed file and register it under the model parameters.",
      "dbt does not require passwords in production targets if running on Cloud runners."
    ],
    correctAnswers: [1],
    explanation: "To follow devops best practices, you should never commit credentials in plain text. By configuring `profiles.yml` with the environment variable helper `{{ env_var('DBT_PROD_PASSWORD') }}`, dbt dynamically reads credentials from host variables (such as those in Docker, Kubernetes, or dbt Cloud) on run execution.",
    references: "https://docs.getdbt.com/reference/dbt-jinja-functions/env_var",
    dbtVersionFocus: "Core Security"
  },
  {
    id: 66,
    category: "Develop Models",
    difficulty: "Advanced",
    questionText: "When configuring a `dbt snapshot` using the check strategy, how does dbt detect row modifications when one or more of the monitored columns contain null values, and what is the recommended workaround?",
    options: [
      "dbt automatically treats null values as empty strings and checks them correctly using standard equality checks.",
      "dbt uses standard SQL equality operators (=) inside snapshots. Since comparing null values in SQL evaluates to unknown (null = null is unknown), any null values in check columns may cause dbt to fail to detect changes. To prevent this, developers should use strategy: timestamp, or employs a coalesced SQL expression in a custom snapshot view.",
      "dbt raises a validation error during compile time if any check columns are identified as nullable.",
      "The check strategy does not support comparing previous states; it always queries target metadata directly to verify dates."
    ],
    correctAnswers: [1],
    explanation: "Because SQL equality operators fail when null values are involved (e.g., `value_a = value_b` is neither true nor false if either is null), the check strategy cannot reliably detect updates on nullable columns if they transition to or from a null state. The standard workaround is to construct a non-nullable expression using coalesce or to use the timestamp snapshot strategy.",
    references: "https://docs.getdbt.com/docs/build/snapshots#check-strategy",
    dbtVersionFocus: "Core Snapshots"
  },
  {
    id: 67,
    category: "Deploy dbt Projects",
    difficulty: "Advanced",
    questionText: "An analytics engineer creates a custom `generate_schema_name` macro. Why is it standard practice to retain a check for target.name or target.profile inside this macro, and what is the potential risk if we simply return custom_schema_name directly?",
    options: [
      "Without target condition checking, dbt would fail to compile because custom schema macros require database-specific configurations.",
      "If you return the custom schema name directly without checking the target, dbt will use the exact custom schema name in both development and production. This causes development run executions to write directly to production schemas, violating developer sandbox boundaries.",
      "Removing the check prevents dbt from creating corresponding `catalog.json` files.",
      "The compiler restricts custom macro overrides unless they possess a recursive conditional check."
    ],
    correctAnswers: [1],
    explanation: "By default, dbt appends custom schemas to the active target schema in development (e.g., resulting in `dev_john_marketing`). If you completely override `generate_schema_name` to return only the `custom_schema_name`, developers running `dbt run` locally will write tables directly into the final `marketing` schema, potentially overwriting production tables. Checking if `target.name == 'prod'` prevents this.",
    references: "https://docs.getdbt.com/docs/build/custom-schemas#how-does-dbt-use-custom-schemas",
    dbtVersionFocus: "Environments & Sandboxes"
  },
  {
    id: 68,
    category: "Develop Models",
    difficulty: "Advanced",
    questionText: "An incremental model is configured with a `unique_key` constraint. During execution, some records returned by the source model query contain null values in the unique key column. How do common database adapters (such as Snowflake or BigQuery) handle these records, and what is the resulting side-effect?",
    options: [
      "The adapter automatically drops records containing null unique keys to safeguard database integrity.",
      "The adapter halts execution and aborts the active transaction with a primary key constraint error.",
      "Because SQL MERGE or JOIN operations compare target and source records using an equality join (where null = null evaluates to unknown), the key fails to match existing rows. dbt is unable to replace the old row, resulting in duplicate records inside the target incremental table.",
      "dbt generates a unique random UUID for the null keys at compilation time to avoid conflicts."
    ],
    correctAnswers: [2],
    explanation: "In SQL, comparing two null values using `=` always results in `unknown` rather than `true`. Consequently, during dbt's incremental table update step (which uses MERGE or JOIN statements based on the `unique_key`), records with null keys will never match existing target rows. This causes them to bypass update logic and compile as duplicate rows on successive executions.",
    references: "https://docs.getdbt.com/reference/resource-configs/unique_key",
    dbtVersionFocus: "Core Incremental Gotchas"
  },
  {
    id: 69,
    category: "Debug Data Models",
    difficulty: "Advanced",
    questionText: "When writing a custom dbt macro that queries the database catalog (utilizing helpers like run_query), the compilation fails during `dbt compile`, yet executes successfully during `dbt run`. What dbt architecture concept explains this discrepancy, and what is the correct syntax fix?",
    options: [
      "dbt compile runs locally and lacks network access to the target database.",
      "During dbt's initial 'parsing' phase, dbt compiles Jinja expressions to build the DAG manifest without executing queries. Statements like run_query return empty or virtual objects during this phase, causing subsequent code processing to fail. Wrapping the macro's database execution blocks in '{% if execute %}' ensures SQL only executes when a command is active.",
      "Custom macros must be registered inside `profiles.yml` to enable access during compiling runs.",
      "All macros that query catalogs must run as pre-hooks instead of being referenced in standard models."
    ],
    correctAnswers: [1],
    explanation: "dbt compiles project resources in two passes: parsing and execution. During parsing (which runs even on `dbt compile` or `dbt parse`), dbt evaluates Jinja to identify the DAG dependencies but doesn't run queries. Wrapping SQL-executing macros in `{% if execute %}` forces dbt to bypass catalog lookups during the parsing pass, preventing compilation failures.",
    references: "https://docs.getdbt.com/reference/dbt-jinja-functions/execute",
    dbtVersionFocus: "Parsing vs Execution Phases"
  },
  {
    id: 70,
    category: "Develop Models",
    difficulty: "Intermediate",
    questionText: "In the dbt Semantic Layer, what is the fundamental structural relationship and difference between a 'Semantic Model' and a 'Metric'?",
    options: [
      "A Semantic Model maps physical source schemas to virtual columns, whereas a Metric registers those schemas directly to the production tables.",
      "A Semantic Model connects a physical table or view to dbt semantic concepts by declaring dimensions, entities, and measures (aggregations). A Metric is a specific semantic calculation (like a ratio, sum, or cumulative calculation) defined over the measures of one or more Semantic Models.",
      "Metrics represent raw seed entries while Semantic Models represent compiled source files.",
      "There is no difference; they are synonymous names for model property yaml specifications."
    ],
    correctAnswers: [1],
    explanation: "Semantic Models are the foundations of the Semantic Layer mapping database relations into structured components: entities (join keys), dimensions (attributes), and measures (numeric columns with aggregation rules). Metrics are the mathematical calculations (e.g. conversions, click-through rates, rolling averages) constructed on top of those measures.",
    references: "https://docs.getdbt.com/docs/build/semantic-models",
    dbtVersionFocus: "v1.6+ (Semantic Layer)"
  },
  {
    id: 71,
    category: "Develop Models",
    difficulty: "Associate",
    questionText: "When auditing a historical snapshot table, which automatically generated column evaluates to NULL for rows reflecting the current, active state of a record?",
    options: [
      "dbt_valid_from",
      "dbt_valid_to",
      "dbt_is_active",
      "dbt_updated_at"
    ],
    correctAnswers: [1],
    explanation: "Snapshots track changes over time by managing active and inactive rows. For active rows representing the current state, `dbt_valid_to` evaluates to `NULL`. When a row change is detected in subsequent snapshots, that existing record is deactivated by setting its `dbt_valid_to` to the snapshot execution timestamp, and a new row is appended with a `dbt_valid_to` of `NULL`.",
    references: "https://docs.getdbt.com/docs/build/snapshots",
    dbtVersionFocus: "Core Snapshots"
  },
  {
    id: 72,
    category: "Debug Data Models",
    difficulty: "Intermediate",
    questionText: "If a model's materialization statement encounters a syntax error or execution failure during `dbt run`, does dbt execute the post-hook defined for that model?",
    options: [
      "Yes, dbt runs post-hooks as rollback instructions in a separate transaction block.",
      "No, post-hooks only run if the model builds and materializes successfully in the target warehouse. If the model query fails, dbt aborts downstream processes and skips the post-hook.",
      "Yes, dbt post-hooks execute asynchronously after the run command finishes, regardless of success.",
      "No, post-hooks are converted to pre-hooks in the event of an execution crash."
    ],
    correctAnswers: [1],
    explanation: "dbt executes pre-hooks before building models, and post-hooks after models have successfully been compiled and written to the database. If the materialization SQL query fails (e.g., table creation fails due to incorrect datatypes or connection limits), dbt skips the post-hook entirely.",
    references: "https://docs.getdbt.com/reference/resource-configs/pre-hook-post-hook",
    dbtVersionFocus: "Hooks Execution Order"
  },
  {
    id: 73,
    category: "Deploy dbt Projects",
    difficulty: "Intermediate",
    questionText: "When adopting a distributed team project setup with dbt Mesh, a developer in a downstream 'finance' project needs to reference a public model named 'stg_customers' owned by an upstream project named 'core_platform'. What is the correct syntax for the ref() function?",
    options: [
      "{{ ref('core_platform.stg_customers') }}",
      "{{ ref('core_platform', 'stg_customers') }}",
      "{{ ref(source='core_platform', model='stg_customers') }}",
      "Cross-project models cannot be referenced with ref(); they must be imported as a packages.",
      "Both option 1 and 2 are equal and natively supported by the parser."
    ],
    correctAnswers: [1],
    explanation: "dbt Mesh (introduced in v1.6) enables multi-project collaborative architectures. To reference a public model from an external, governed project, you use the dual-argument `ref` syntax: the first argument defines the upstream project name (as defined in its `dbt_project.yml`), and the second specifies the target model name.",
    references: "https://docs.getdbt.com/reference/dbt-jinja-functions/ref#cross-project-ref",
    dbtVersionFocus: "v1.6+ (dbt Mesh)"
  },
  {
    id: 74,
    category: "Test and Document Models",
    difficulty: "Associate",
    questionText: "When planning a dbt transformation strategy, why is storing large, frequently updated transactional tables as dbt seeds considered a major anti-pattern?",
    options: [
      "dbt seeds are converted to views, causing expensive downstream scans.",
      "Seeds are designed for small, static data values (like country lookup codes or mapping ids). Since they are tracked in version control, committing large CSV files bloats the Git history, degrades `dbt parse` performance, and bypasses standard data loading/orchestration pathways.",
      "Creating seeds requires administrator privileges inside `profiles.yml` settings.",
      "Seeds cannot be integrated into lineage DAG views inside the dbt documentation parser."
    ],
    correctAnswers: [1],
    explanation: "dbt seeds load CSV data directly into the database. Since these CSVs must be checked into the project Git repository, storing transactional tables in the `seeds/` folder bloats repository sizes, creates Git merge bottlenecks, slowing down local compilation. Best practices restrict seeds to small lookup tables (<1MB).",
    references: "https://docs.getdbt.com/docs/build/seeds",
    dbtVersionFocus: "Core"
  },
  {
    id: 75,
    category: "Test and Document Models",
    difficulty: "Advanced",
    questionText: "If you configure `dbt source freshness` checks, what happens if a source table does not physically exist in the target database when `dbt source freshness` is executed, and how can the team prevent CI breaks?",
    options: [
      "dbt ignores the discrepancy and continues checks against remaining tables.",
      "dbt evaluates freshness using git history times and skips connection requests.",
      "dbt throws a database query exception and exits with an error status. To handle this without breaking the CI pipeline, developers can set 'ignore_missing: true' inside the source properties configuration.",
      "The command terminates with a successful warning indicating zero rows."
    ],
    correctAnswers: [2],
    explanation: "If dbt queries metadata for a raw source table that isn't physically created (e.g. before an ingestion tool loads it for the first time), `dbt source freshness` will throw a missing database relation error. Setting `ignore_missing: true` on the source instructs dbt to output a warning instead of a fatal, CI-breaking crash.",
    references: "https://docs.getdbt.com/reference/resource-properties/freshness#ignore_missing",
    dbtVersionFocus: "v1.7+ (Source Freshness)"
  },
  {
    id: 76,
    category: "Deploy dbt Projects",
    difficulty: "Intermediate",
    questionText: "After a dbt execution finishes, a `run_results.json` file is generated inside the `target/` directory. What telemetry metadata does this file primarily capture, and what is its main use case?",
    options: [
      "It captures the actual column values for every row calculated inside the current run.",
      "It logs the execution outcomes, compilation and runtime durations, success/failure statuses, and adapter-native database responses for every single node in the DAG, allowing orchestration and monitoring tools to parse pipeline metadata.",
      "It records the active profile credentials and database keys for cloud backups.",
      "It caches compiled SQL queries to optimize subsequent pipeline runs."
    ],
    correctAnswers: [1],
    explanation: "`run_results.json` is a dbt-generated artifact containing performance and outcome logs: tracking each model or test executed during a command, their specific status (e.g., success, fail, skip, error), the runtime in seconds, and responses (such as rows affected). This allows users to build dashboards of run histories.",
    references: "https://docs.getdbt.com/reference/artifacts/run-results-json",
    dbtVersionFocus: "Core Artifacts"
  },
  {
    id: 77,
    category: "Develop Models",
    difficulty: "Intermediate",
    questionText: "A developer writes a custom SQL script containing standard references and places it in the analyses/ folder. What is the compiling behavior when they execute `dbt run`?",
    options: [
      "dbt compiles the script and materializes it in the target database as a table.",
      "dbt completely ignores files in the analyses folder unless `dbt compile` is explicitly executed.",
      "dbt parses the file, resolves the Jinja expressions (such as ref() and source()), and compiles it down to pure SQL in the `target/`compiled/ directory, but never materializes it in the database. This is used for one-off diagnostic or research queries.",
      "dbt raises a compilation loop error because analyses cannot contain refs."
    ],
    correctAnswers: [2],
    explanation: "The `analyses/` directory is reserved for queries that need to leverage dbt's compilation layer (using macros, refs, and environment variables) but do not need to be written back to the warehouse as tables or views (e.g. ad-hoc queries, audits). They are generated as clean SQL inside `target/` but never executed.",
    references: "https://docs.getdbt.com/docs/build/analyses",
    dbtVersionFocus: "Core"
  },
  {
    id: 78,
    category: "Test and Document Models",
    difficulty: "Intermediate",
    questionText: "An analytics engineer is writing a custom generic test named 'is_even' to reuse in validation schemas. How must they declare and structure this test to ensure dbt registers it as an applicable data test?",
    options: [
      "They must name the file is_even.sql and place a singular assert block inside the tests/ directory.",
      "The macro must be defined with the name 'test_is_even' inside the macros/ directory, and accept the arguments 'model' and 'column_name'. It must return a query selecting rows that represent failures.",
      "They must write a Python function inside and register it under the custom-runners block.",
      "They must create a macro file named generic_even.sql returning true on success."
    ],
    correctAnswers: [1],
    explanation: "In dbt, a generic test is a macro. To register it as an assertion block, the macro name must be prefixed with `test_` (e.g. `test_is_even`). The macro is configured to accept `model` and `column_name` parameters, and its compiled query must return the records violating the rule (e.g. selecting rows that are NOT even).",
    references: "https://docs.getdbt.com/docs/build/data-tests#generic-data-tests",
    dbtVersionFocus: "Core Custom Tests"
  },
  {
    id: 79,
    category: "Develop Models",
    difficulty: "Intermediate",
    questionText: "A developer defines a model's materialization in three separate locations: `dbt_project.yml` sets it as 'view' for the directory, schema.yml sets it as 'ephemeral', and the model's inline SQL config() block sets it as 'table'. How will the compiling engine materialize this model?",
    options: [
      "It materializes as a view because the global project file has the highest priority.",
      "It materializes as ephemeral because yml files are parsed after sql configurations.",
      "It materializes as a table. Configuration precedence follows a strict hierarchy: the inline SQL config() function takes absolute priority, followed by schema.yml configs, followed by `dbt_project.yml` defaults.",
      "dbt terminates compilation and displays a config conflict check exception."
    ],
    correctAnswers: [2],
    explanation: "dbt configurations resolve from most-specific to least-specific: 1. Inline SQL `config()` settings (highest priority, model-specific) 2. Property `.yml` declarations 3. Project `dbt_project.yml` declarations (lowest priority, directory-level). Thus, the inline setting wins.",
    references: "https://docs.getdbt.com/reference/configs-and-properties",
    dbtVersionFocus: "Configuration Precedence"
  },
  {
    id: 80,
    category: "Develop Models",
    difficulty: "Advanced",
    questionText: "Under incremental materialization on Snowflake or BigQuery, how can a developer configure dbt to only modify a specific subset of columns (e.g., `updated_at`, status) upon matching unique keys, instead of overriding all columns?",
    options: [
      "Set the configuration on_schema_change: ignore in the project level configs.",
      "Use the merge_update_columns configuration in the model config() block, passing a list of specific columns. On a unique key match during a MERGE operation, only these listed columns will be updated.",
      "Use post-hooks to alter the table back to previous states using metadata caches.",
      "This is not supported; database MERGE statements are forced to overwrite all columns in target models."
    ],
    correctAnswers: [1],
    explanation: "When utilizing `materialized='incremental'` on platforms that support transactional MERGE actions, you can specify `merge_update_columns`. This ensures that instead of overwriting the entire row on match, dbt's compiled SQL target only updates the columns listed in the array, protecting non-listed properties like `created_at`.",
    references: "https://docs.getdbt.com/reference/resource-configs/merge_update_columns",
    dbtVersionFocus: "Core Incremental Customizations"
  },
  {
    id: 81,
    category: "Develop Models",
    difficulty: "Advanced",
    questionText: "An analytics agency configures dbt model contracts (contract: {enforced: true}) for multiple key warehouse staging relations. During a routine run, dbt compiles the staging SQL file. If the query output contains a different column datatype than specified in the schema YAML (e.g., FLOAT instead of INT), what will happen, and how is it processed?",
    codeSnippet: `models:
  - name: stg_orders
    config:
      contract:
        enforced: true
    columns:
      - name: order_id
        data_type: integer`,
    codeLanguage: "yaml",
    options: [
      "dbt builds the table, populates rows, and applies a post-run model test that throws a warning if values differ.",
      "dbt completely bypasses database execution and raises an internal compilation error immediately upon parsing because datatypes must match exactly before compilation.",
      "dbt generates and runs explicit database DDL (such as CREATE TABLE) reflecting the schema YAML data_type properties. If the SQL query attempts to load a FLOAT into an INT column, the database-level query execution will fail during the initial relation creation step.",
      "dbt silent-coerces columns inside its JINJA execution scope prior to loading data tables."
    ],
    correctAnswers: [2],
    explanation: "Explicit model contracts (introduced in v1.5) force dbt to generate strict database DDL mapping exact column types defined in the schema property files. If the physical SQL compilation results yield mismatched data types, the execution crashes directly inside the target data warehouse during DDL schema application (e.g., CREATE TABLE AS or INSERT statement execution).",
    references: "https://docs.getdbt.com/docs/collaborate/govern/model-contracts",
    dbtVersionFocus: "v1.5+ (Model Contracts)"
  },
  {
    id: 82,
    category: "Develop Models",
    difficulty: "Intermediate",
    questionText: "In multi-project dbt Mesh structures, an engineer is assigning boundaries to protect internal models. What is the fundamental behavioral difference between assigning a model `access: private` versus `access: protected`?",
    codeSnippet: `models:
  - name: int_sales_calculations
    config:
      access: private`,
    codeLanguage: "yaml",
    options: [
      "Private models are invisible to tests; protected models allow generic assertions only.",
      "Private models can only be referenced by other models residing in the exact same dbt project package. Protected models allow access across all external consumer projects, but require an approved contract.",
      "Private models can only be referenced by models in the same dbt project and directory. Protected models can be referenced by any model in the same dbt project, but are forbidden from being resolved (via cross-project ref) in external, downstream dbt projects. Only public models can be accessed externally.",
      "Private models cannot be materialized as tables or incremental models; they must always be configured as ephemeral."
    ],
    correctAnswers: [2],
    explanation: "dbt Mesh enforces three levels of model access visibility: 1) `private` limits references strictly to models within the same project/subdirectory namespace, 2) `protected` allows open references across any model in the same home project, and 3) `public` publishes the model as an approved integration boundary node that can be safely referenced across separate downstream projects utilizing cross-project refs.",
    references: "https://docs.getdbt.com/docs/collaborate/govern/model-access",
    dbtVersionFocus: "v1.6+ (Model Access Controls)"
  },
  {
    id: 83,
    category: "Deploy dbt Projects",
    difficulty: "Advanced",
    questionText: "When writing `profiles.yml` target connection logic, what is the best practice for handling sensitive database tokens using environment variables, and how has env_var defaults handling evolved in modern dbt Core?",
    codeSnippet: `prod:
  outputs:
    prod_target:
      type: bigquery
      token: "{{ env_var('DBT_ACCESS_TOKEN', 'fallback_token_value') }}"`,
    codeLanguage: "yaml",
    options: [
      "Environment variables always require separate python config files.",
      "In modern dbt Core (v1.5+), the env_var function natively accepts an optional second argument representing the default fallback value if the environment variable is missing from the system. This handles missing local terminal variables gracefully without crashing local development compilation.",
      "The env_var function cannot be combined with string values; it must evaluate to boolean targets.",
      "Default fallbacks must be registered inside target.yml, as the system skips profiles metadata evaluations."
    ],
    correctAnswers: [1],
    explanation: "In modern version of dbt Core, the native Jinja function `{{ env_var('SECRET_NAME', 'fallback_value') }}` permits defining an inline default parameter. This eliminates the vulnerability of compilation crashes when running ad-hoc local tests where environment profiles (such as those populated on Docker or CI runners) are undefined.",
    references: "https://docs.getdbt.com/reference/dbt-jinja-functions/env_var",
    dbtVersionFocus: "v1.5+ (Env Var Fallbacks)"
  },
  {
    id: 84,
    category: "Develop Models",
    difficulty: "Advanced",
    questionText: "An analytics developer wants to override the default behavior of a macro named 'generate_candidate_key' imported from an external package called 'dbt_utils'. What is the correct way to configure this lookup override under the dbt Core resolution system?",
    codeSnippet: `dispatch:
  - macro_namespace: dbt_utils
    search_order: ['my_project', 'dbt_utils']`,
    codeLanguage: "yaml",
    options: [
      "We edit the code files physically inside dbt_packages/dbt_utils/macros/ to match local rules.",
      "We configure a dispatch block in our local `dbt_project.yml` defining a custom search_order. Placing our home project namespace ('my_project') ahead of the 'dbt_utils' package namespace forces dbt's compiler to execute our local macro instead when dbt_utils calls 'generate_candidate_key' internally.",
      "We rename our local macro to 'dbt_utils__generate_candidate_key' to shadow the global namespace.",
      "Macros imported from secondary packages cannot be shadowed or overwritten; they reside in a sealed dependency layer."
    ],
    correctAnswers: [1],
    explanation: "dbt resolves macro calls through search namespaces. By configuring the `dispatch` block in `dbt_project.yml` with a customized `search_order`, you can instruct the dbt engine to search your home project namespace ahead of the external package's namespace, dynamically substituting local custom macros for package defaults.",
    references: "https://docs.getdbt.com/reference/project-configs/dispatch",
    dbtVersionFocus: "Core (Macro Dispatch Architecture)"
  },
  {
    id: 85,
    category: "Deploy dbt Projects",
    difficulty: "Intermediate",
    questionText: "A security engineer enforces strict database privilege boundaries on schemas built by dbt. When a model's properties config declares a 'grants:' block, when does the dbt engine apply these permissions, and matching what transaction behaviors?",
    codeSnippet: `models:
  - name: dim_customers
    config:
      grants:
        select: ['reporter_role']`,
    codeLanguage: "yaml",
    options: [
      "The grants are executed locally inside Git during project compilation.",
      "dbt executes appropriate GRANT statements immediately after the model runs and is successfully written to the database. For tables or views (which may undergo a blue-green DROP/RENAME cycle), this guarantees client roles never experience database permissions downtime on model rebuilds.",
      "grants blocks are evaluated once when deploying packages during 'dbt deps'.",
      "grants blocks can only be executed by administrators running standard pre-hook scripts."
    ],
    correctAnswers: [1],
    explanation: "dbt applies grants at the end of a model run sequence execution. For relations materialized as tables or views, dbt ensures permissions are executed post-build (and during the rename process on supporting warehouses), preventing common issues as tables are dropped and recreated under new relation IDs.",
    references: "https://docs.getdbt.com/reference/resource-configs/grants",
    dbtVersionFocus: "Core Grants"
  },
  {
    id: 86,
    category: "Debug Data Models",
    difficulty: "Intermediate",
    questionText: "An engineer is writing a dynamic database helper macro that executes checks against existing tables. If we call the adapter helper 'adapter.get_relation(database, schema, identifier)' and the target table does not exist physically in the database, how does dbt handle the response?",
    codeSnippet: `{% set existing_relation = adapter.get_relation(
    database=target.database,
    schema=target.schema,
    identifier='my_table'
) %}
{% if existing_relation is not none %}
    -- SQL code here
{% endif %}`,
    codeLanguage: "jinja",
    options: [
      "It throws a compilation exception immediately and crashes the `dbt build`.",
      "It returns a specialized string representing 'relation_not_found_exception'.",
      "It returns evaluated compilation properties as None (rather than crashing). Because of this, developers must always use a conditional check (such as 'is not none') before attempting to access methods or fields on the returned relation.",
      "It constructs a virtual ephemeral table in local memory containing zero schema types."
    ],
    correctAnswers: [2],
    explanation: "The database adapter function `adapter.get_relation` performs a cached catalog look-up for a target relation. If missing from the catalog, it returns a Jinja `none` object instead of throwing an error. Failing to guard code blocks with `is not none` before traversing properties (like `existing_relation.name`) causes compilation crashes on pre-flight checks.",
    references: "https://docs.getdbt.com/reference/dbt-jinja-functions/adapter#get_relation",
    dbtVersionFocus: "Core Adapter APIs"
  },
  {
    id: 87,
    category: "Develop Models",
    difficulty: "Advanced",
    questionText: "A data team has been maintaining a `dbt snapshot` table tracking customer memberships for months. During an upstream system migration, a new column called 'loyalty_tier' is added to the source. How does dbt handle the existing snapshot database table on the next execution run?",
    options: [
      "dbt completely reconstructs the snapshot table from scratch, wiping historical changelogs.",
      "dbt automatically detects the new column and issues an ALTER TABLE statement to append the nullable column to the target database snapshot table. However, existing log rows already tracked in the snapshot will contain NULL values for this column, and dbt does not retrospectively backfill them.",
      "dbt halts the execution run and refuses to update the snapshot until a manual schema migration script is executed in the target database.",
      "dbt ignores the source column and filters it out of the snapshot merge execution query."
    ],
    correctAnswers: [1],
    explanation: "dbt supports basic schema evolution in snapshots. On detecting a new column in the source query, dbt executes an ALTER statement to add it to the snapshot target table. For existing records already stored historically, this new field remains NULL. The column value will only populate going forward for new snapshots.",
    references: "https://docs.getdbt.com/docs/build/snapshots#schema-evolution-for-snapshots",
    dbtVersionFocus: "Core Snapshot Behaviours"
  },
  {
    id: 88,
    category: "Deploy dbt Projects",
    difficulty: "Intermediate",
    questionText: "An analytics engineer wants to run a specific group of models during a scheduled staging run. What is the correct dbt selection syntax and meaning difference between separating filters with a comma (,) versus separating them with a space ( )?",
    codeSnippet: `dbt run --select "tag:hourly,path:models/staging"
dbt run --select "tag:hourly path:models/staging"`,
    codeLanguage: "bash",
    options: [
      "There is no difference; dbt evaluates both syntaxes as an OR condition.",
      "The comma (,) represents an intersection (AND) operator, running only models that possess the hourly tag AND reside in the staging path. The space ( ) represents a union (OR) operator, running any models that possess the hourly tag OR reside in the staging path.",
      "The comma (,) tells dbt to execute models sequentially, while the space ( ) executes them in parallel.",
      "A space is considered syntactically invalid and causes dbt to abort line evaluations."
    ],
    correctAnswers: [1],
    explanation: "Command-line selection operators manage complex DAG targeting. A comma-separated selector (`tag:hourly,path:models/staging`) represents a logical intersection (AND), compiling models matching BOTH definitions. A space-separated selector treats parameters as a logical union (OR), creating a cumulative selection list.",
    references: "https://docs.getdbt.com/reference/node-selection/syntax",
    dbtVersionFocus: "Core Selectors"
  },
  {
    id: 89,
    category: "Deploy dbt Projects",
    difficulty: "Intermediate",
    questionText: "When executing 'dbt deps', a development environment fails with a version conflict error because two different imported packages (e.g., fivetran_log and dbt_utils) are requesting mutually incompatible versions of a shared transitive helper package. How must this conflict be resolved?",
    options: [
      "dbt's compiler automatically chooses the newest version and overrides conflict prompts.",
      "Packages must be edited by checking the source repositories and modifying `packages.yml` inside the local dbt_packages/ directory.",
      "dbt's package manager does not automatically resolve mutual version conflicts. To resolve this, developers can explicitly declare and pin a specific compatible version of the conflicting package in their main project's `packages.yml` file, overriding downstream dependencies.",
      "The developer must delete the `packages.yml` file altogether and rely on system-wide python libraries."
    ],
    correctAnswers: [2],
    explanation: "dbt's dependency solver throws conflicts when nested packages require overlapping, incompatible version constraints. Because the main project's configurations override package-level imports, declaring the package configuration directly in your root `packages.yml` defines a master constraint that dbt uses to resolve matches during installation.",
    references: "https://docs.getdbt.com/docs/build/packages#package-version-conflicts",
    dbtVersionFocus: "Dependency Management"
  },
  {
    id: 90,
    category: "Test and Document Models",
    difficulty: "Intermediate",
    questionText: "In dbt Core v1.8+, how does an analytics engineer provide static mock data inputs to execute a component level unit test on a transformation model, and where in the filesystem is this declared?",
    codeSnippet: `unit_tests:
  - name: test_order_totals
    model: dim_orders
    given:
      - input: ref('stg_orders')
        rows:
          - {order_id: 1, amount: 100}
          - {order_id: 2, amount: 200}`,
    codeLanguage: "yaml",
    options: [
      "Mock inputs must be stored inside raw CSV files checked into the seeds/ directory.",
      "Mock rows are declared in-line as YAML dictionary structures under the 'given' and 'rows' fields inside a schema properties .yml file (normally placed matching the target model's directory). dbt compiles these mocked records to validate logic sans physical database scans.",
      "Unit tests mock data must be registered as database views inside target profiles structures.",
      "Mock data formats are configured entirely in the project's `dbt_project.yml` file under global mock parameters."
    ],
    correctAnswers: [1],
    explanation: "Under the modern unit testing framework (v1.8+), tests are declared directly in schema properties `.yml` files. Instead of using real warehouse tables, developers declare virtual input records of mocked states inside the `given` configuration schema, enabling robust unit validation for complex SQL business rules during Slim CI iterations.",
    references: "https://docs.getdbt.com/docs/build/unit-tests",
    dbtVersionFocus: "v1.8+ (Unit Testing Framework)"
  },
  {
    id: 91,
    category: "Test and Document Models",
    difficulty: "Advanced",
    questionText: "When configuring `dbt source freshness` checks on a massive, several-terabyte database table on BigQuery or Snowflake, what is a major performance and financial gotcha, and how is it resolved in source properties?",
    codeSnippet: `sources:
  - name: heavy_clicks
    tables:
      - name:raw_events
        freshness:
          warn_after: {count: 6, period: hour}
        filter: "loaded_at >= timestamp_sub(current_timestamp(), interval 1 day)"`,
    codeLanguage: "yaml",
    options: [
      "Freshness is computed inside local computer memories, meaning large tables cause local memory failures.",
      "By default, dbt executes full-table scans to calculate MAX(`loaded_at_field`). On large warehouses, this triggers massive compute bills and can hit execution query limits. To resolve this, developers can add a 'filter' configuration in the source properties, which limits the SQL scan slice (e.g. partition limits) mapped during query compile states.",
      "The freshness command fails instantly on partitioned schemas; tables must be converted to non-partitioned indices.",
      "freshness queries must be stored inside pre-hook tables to bypass catalog limits."
    ],
    correctAnswers: [1],
    explanation: "dbt's source freshness query performs a MAX operation over the designated loaded date field. To prevent full-table scans over large tables, dbt supports a `filter` variable on the table spec. By restriction (e.g. `loaded_at >= date_add(current_date(), interval -2 day)`), the under-the-hood engine prunes partitions, saving considerable execution cost.",
    references: "https://docs.getdbt.com/reference/resource-properties/freshness#filter",
    dbtVersionFocus: "Core Performance Customization"
  },
  {
    id: 92,
    category: "Develop Models",
    difficulty: "Advanced",
    questionText: "You are deploying a dbt model materialized as an incremental table targeting BigQuery. The table is partitioned by date, and configured with BigQuery's strict 'require_partition_filter: true'. During subsequent incremental builds, why might dbt fail, and how do you protect against this?",
    codeSnippet: `{{ config(
    materialized='incremental',
    partition_by={
      "field": "event_date",
      "data_type": "date",
      "granularity": "day"
    },
    require_partition_filter=true
) }}`,
    codeLanguage: "jinja",
    options: [
      "require_partition_filter is unsupported on dates; it only applies to integer range clusters.",
      "If partitioning conditions are not evaluated in dbt's MERGE or update clauses, BigQuery aborts the run because a partition bounding filter is missing. To prevent this, developers design appropriate partition filters or incremental variables (like `is_incremental()`) that force dates checks inside compile clauses.",
      "BigQuery requires incremental tables to possess unique primary keys mapped inside git.",
      "dbt automatically reads target date schemas and converts select strings into partition parameters."
    ],
    correctAnswers: [1],
    explanation: "When BigQuery enforces partition filters, any DML query (such as dbt's under-the-hood MERGE step on incremental models) must evaluate partition keys in its filters. Ensuring your incremental code blocks (like `where event_date >= (select max(event_date) from {{ this }})`) filter on the partitioned field satisfies BigQuery's requirements, preventing execution failures.",
    references: "https://docs.getdbt.com/reference/resource-configs/bigquery-configs#require_partition_filter",
    dbtVersionFocus: "BigQuery Adaption Specs"
  },
  {
    id: 93,
    category: "Test and Document Models",
    difficulty: "Associate",
    questionText: "When designing data testing strategies, a developer adds a custom SQL script containing assertions directly into the tests/ directory. How does dbt evaluate success or failure for these singular tests?",
    options: [
      "The SQL script must construct a boolean flag that outputs EXACTLY 'true' on success.",
      "The query is designed to identify records violating our data standards. If the test query returns ZERO rows during execution, the test passes. If it returns ONE or more rows, dbt flags the test as a failure.",
      "The query must return a list of error codes registered under a system backup index.",
      "Singular tests must terminate with a successful drop statement to clear tables."
    ],
    correctAnswers: [1],
    explanation: "dbt's testing methodology relies on finding anomalies. A singular test is a select query in the `tests/` folder. If that query yields any rows (the violations), dbt treats it as a failed test. A successful test returns zero rows, verifying no violations exist.",
    references: "https://docs.getdbt.com/docs/build/data-tests#singular-data-tests",
    dbtVersionFocus: "Core Schema Testing"
  },
  {
    id: 94,
    category: "Develop Models",
    difficulty: "Advanced",
    questionText: "When choosing incremental model strategies inside profiles, what determines the standard adoption of a 'delete+insert' strategy over a 'merge' strategy, and on what platform is 'delete+insert' typically of greater importance?",
    options: [
      "The delete+insert strategy is only available on Postgres databases; modern warehouses reject it.",
      "The merge strategy utilizes Snowflake and BigQuery-native SQL MERGE operations to process updates and inserts in a single operation. For platforms like Redshift or Spark that do not natively execute MERGE statements optimally, dbt's delete+insert strategy deletes matching existing keys in a staging workspace before running standard inserts, ensuring correct state synchronization.",
      "Both strategies are identical down to performance; delete+insert is simply a legacy nomenclature.",
      "delete+insert is required to drop legacy partitions during incremental full-refreshes."
    ],
    correctAnswers: [1],
    explanation: "While modern cloud warehouses like BigQuery or Snowflake natively support robust MERGE operations, Redshift lacks the same performance profile. Consequently, on Redshift environments, dbt performs a multi-step `delete+insert` strategy to clear matching rows before committing new runs.",
    references: "https://docs.getdbt.com/reference/resource-configs/redshift-configs#incremental-strategies",
    dbtVersionFocus: "Core Incremental Strategies"
  },
  {
    id: 95,
    category: "Debug Data Models",
    difficulty: "Intermediate",
    questionText: "Inside an advanced dbt Jinja macro, you execute a database call using the run_query function. What data type is returned by run_query, and how should a developer extract a specific cell value?",
    codeSnippet: `{% set results = run_query('select count(*) as count from ' ~ this) %}
{% if execute %}
    {% set total_records = results.rows[0][0] %}
{% endif %}`,
    codeLanguage: "jinja",
    options: [
      "run_query returns a raw python dictionary; cells are accessed via standard key lookup results['count'].",
      "run_query returns an Agate Table data frame object. Cell values are gathered dynamically using row and column coordinates, such as retrieving the first row with results.rows[0][0] or results.columns['column_name'].values() wrapper sets.",
      "The function returns a database driver cursor; values must be gathered using post-hook actions.",
      "run_query returns a compiled SQL string; developers use regex pattern matches to extract cell numbers."
    ],
    correctAnswers: [1],
    explanation: "The `run_query` function returns a table of records represented as an Agate Table object. To access values safely within Jinja script execution, you use Agate's native indices (rows and columns), such as checking if `execute` evaluates to true, and querying the zero-based cell arrays: `results.rows[0][0]`.",
    references: "https://docs.getdbt.com/reference/dbt-jinja-functions/run_query",
    dbtVersionFocus: "Advanced Macro Jinja API"
  },
  {
    id: 96,
    category: "Debug Data Models",
    difficulty: "Intermediate",
    questionText: "A developer attempts to build circular references involving ephemeral models (e.g., Ephemeral Model A references Model B, which references Ephemeral Model A). How does dbt handle this configuration, and where is the exception thrown?",
    options: [
      "dbt compiles the cyclic schemas successfully because ephemeral models are inlined as CTEs, which the database engine resolves during runtime.",
      "The dbt package execution detects the loop during its initial parsing pass and raises a 'Cyclic dependency' compilation error before creating any database connections or evaluating SQL files.",
      "The compilation completes, but when the downstream models run, they enter an infinite execution loop.",
      "The cyclic dependencies is automatically broken by dbt converting the ephemeral models to views."
    ],
    correctAnswers: [1],
    explanation: "Even though ephemeral models are not physically materialized (they are compiled as CTEs), dbt resolves the dependency DAG during parsing. Because circular logic is mathematically impossible to schedule dynamically in a Directed Acyclic Graph (DAG), dbt parses the cyclic dependencies and halts compilation with a fatal error prior to any database execution.",
    references: "https://docs.getdbt.com/concepts/about-the-dag",
    dbtVersionFocus: "Core DAG rules"
  },
  {
    id: 97,
    category: "Deploy dbt Projects",
    difficulty: "Intermediate",
    questionText: "An analytics engineer is running a slim deployment task in their continuous integration pipeline. They execute: `dbt run` `--select` 'models/staging/*' --exclude 'stg_customers+'. What is the final targeted model selection outcome?",
    options: [
      "All models in the staging directory are executed, except for stg_customers. Stg_customers is deleted from the target catalog.",
      "All staging directory models compile and execute, with the exception of 'stg_customers' and any downstream dependent consumer models in the pipeline's DAG that rely on 'stg_customers'. The '+' suffix represents the downstream dependency graph traversal.",
      "All models are skipped because staging dependencies override exclude qualifiers.",
      "The execution terminates with a select exception since paths and exclusion paths cannot overlap."
    ],
    correctAnswers: [1],
    explanation: "The command-line selection operator `+` governs lineage. For `-exclude stg_customers+`, dbt identifies the node `stg_customers` and excludes both that node and all of its downstream direct and indirect descendents in the DAG, shielding downstream nodes from broken changes during a partial CI run.",
    references: "https://docs.getdbt.com/reference/node-selection/exclude",
    dbtVersionFocus: "Core Lineage Selectors"
  },
  {
    id: 98,
    category: "Deploy dbt Projects",
    difficulty: "Intermediate",
    questionText: "When using the 'dbt clean' command, what configuration in `dbt_project.yml` controls which files and directories are deleted from the disk filesystem, and what is a destructive gotcha to protect against?",
    options: [
      "The target profiles are cleaned inside the warehouse schemas mapped on profiles.",
      "The clean-targets parameter in `dbt_project.yml` defines an array of relative directories that will be permanently deleted from the disk. A dangerous gotcha occurs if a developer adds active folders (such as 'models/') to this list; 'dbt clean' will proceed to delete all model files without prompt.",
      "dbt clean removes credentials from git files and must be run prior to committing code.",
      "The clean command removes compilation logs only, and ignores files inside dbt_project."
    ],
    correctAnswers: [1],
    explanation: "The `dbt clean` command removes directories specified in the `clean-targets` section of `dbt_project.yml` (typically `target/` and sometimes `dbt_packages/`). Because it executes a destructive filesystem wipe of the targets listed, developers must make sure they never include active source folders like `models/` or `seeds/` in the list.",
    references: "https://docs.getdbt.com/reference/commands/clean",
    dbtVersionFocus: "Core CLI commands"
  },
  {
    id: 99,
    category: "Deploy dbt Projects",
    difficulty: "Advanced",
    questionText: "To support coordinated project division under dbt Mesh, you cluster models into distinct 'groups'. What is the security behavior of setting 'group: finance' on a set of models, and how are private model access boundaries checked?",
    codeSnippet: `groups:
  - name: finance
    owner:
      email: finance-team@company.com

models:
  - name: int_sensitive_revenues
    config:
      group: finance
      access: private`,
    codeLanguage: "yaml",
    options: [
      "Finance group models are encrypted at rest using custom dbt security credentials.",
      "Grouping models defines collaboration groups. If a model is defined inside a group and labeled as `access: private`, ONLY other models mapped within that EXACT same defined group can reference it via the ref() function inside our dbt compiler. Downstream models in other groups will fail to compile if they try to call it.",
      "Grouping models requires a dedicated user profile setup inside `profiles.yml` targeting the schema.",
      "Groups can only be accessed across external projects by declaring them as a source."
    ],
    correctAnswers: [1],
    explanation: "dbt Core (v1.6+) governance rules introduce model grouping. A model assigned to a group with `access: private` can only be referenced by other models belonging to that same group. Downstream relations belonging to other teams or groups cannot reference it, keeping internal transformation details isolated.",
    references: "https://docs.getdbt.com/docs/collaborates/govern/model-groups",
    dbtVersionFocus: "v1.6+ (Model Governance & Groups)"
  },
  {
    id: 100,
    category: "Develop Models",
    difficulty: "Advanced",
    questionText: "When generating unique candidate/surrogate keys on composite natural columns, what is a key pitfall of utilizing simple string concatenation (like: col_a || col_b) in SQL databases, and how do dbt macros safely handle this?",
    codeSnippet: `select {{ dbt_utils.generate_surrogate_key(['customer_id', 'order_id']) }}`,
    codeLanguage: "jinja",
    options: [
      "Natural column variables are hashed inside the warehouse cache directly without compiler intervention.",
      "If any natural columns evaluate to NULL, standard SQL string concatenation can cause the entire composite string to evaluate to NULL, resulting in missing unique keys. Modern surrogate key macros (like 'dbt_utils.generate_surrogate_key' or dbt's native hash equivalents) automatically coalesce null variables with stable strings before execution, ensuring reliable, non-null values.",
      "dbt only allows generating surrogate keys on tables consisting of fewer than 10 columns.",
      "Hashing functions cannot run on string columns and require type conversions inside preprocessing scripts."
    ],
    correctAnswers: [1],
    explanation: "Simple string concatenation in relational databases fails if any component is nullable, as standard concatenation typically yields `NULL` if one element is `NULL` (e.g. `123 || NULL` evaluates to `NULL` on many systems), and can also cause key collision hazards (e.g., values '1', '23' vs '12', '3' both yield '123'). dbt-utils surrogate key macros resolve this by introducing delimiter spacing and null coalescing before hashing.",
    references: "https://github.com/dbt-labs/dbt-utils#generate_surrogate_key-source",
    dbtVersionFocus: "Core Surrogate Key Patterns"
  },
  {
    id: 101,
    category: "Test and Document Models",
    difficulty: "Intermediate",
    questionText: "An analytics engineering manager configures source freshness checks on a high-velocity webhook interface dataset. What is the correct syntax for declaring freshness parameters inside source schemas, and does it support string plurals?",
    codeSnippet: `sources:
  - name: marketing_feeds
    tables:
      - name: leads
        freshness:
          warn_after:
            count: 24
            period: hour`,
    codeLanguage: "yaml",
    options: [
      "Freshness parameters require manual timestamps written on profiles configurations.",
      "The configuration requires the exact properties of 'count' (integer) and 'period' (string). The value for period must be a singular string matches dbt identifiers, such as 'hour', 'day', or 'minute'. Passing a plural (like 'hours' or 'days') will cause dbt's YAML schema compilation check to fail.",
      "freshness limits must be set as global properties inside the main `dbt_project.yml` file.",
      "The period configuration only supports date offsets registered on the operating system clock."
    ],
    correctAnswers: [1],
    explanation: "The properties block for dbt's source freshness calculations requires a dictionary definition defining `count` and `period`. The `period` parameter only supports specific, singular keywords (such as `minute`, `hour`, `day`). Using plurals like `hours` evaluates as an invalid config value and crashes dbt compilation during parsing.",
    references: "https://docs.getdbt.com/reference/resource-properties/freshness",
    dbtVersionFocus: "Core Freshness Schemas"
  },
  {
    id: 102,
    category: "Debug Data Models",
    difficulty: "Advanced",
    questionText: "In a dynamic database schema model, a developer wants to write custom SQL conditionals matching the current model identifier. If they interpolate '{{ this }}' inside a comparison, what datatype is compiled, and how does it affect query execution?",
    codeSnippet: `where table_name = '{{ this.identifier }}'`,
    codeLanguage: "jinja",
    options: [
      "this compiles directly into a database-native integer representing the relation ID.",
      "this compiles into a Relation object containing database, schema, and identifier properties. Simply comparing 'this' as a raw string evaluates to its fully qualified, quoted relation name (e.g. '`prod`.`analytics`.`my_model`'). If you only need to match the unquoted table name, you must explicitly query its properties like 'this.identifier'.",
      "this is an invalid expression inside SQL loops and must be stored inside target structures.",
      "The compiler converts this into a static pointer address representing the system thread count."
    ],
    correctAnswers: [1],
    explanation: "The `{{ this }}` Jinja context variable is a `Relation` object rather than a simple string. When compiled directly, its generic string representation outputs a fully qualified, quoted, database-specific query identifier (e.g. `\"my_db\".\"my_schema\".\"my_model\"`). If matching against unquoted dataset metadata columns in a query, the developer must call `{{ this.identifier }}` to get the table name alone.",
    references: "https://docs.getdbt.com/reference/dbt-jinja-functions/this",
    dbtVersionFocus: "Core metadata Context"
  },
  {
    id: 103,
    category: "Deploy dbt Projects",
    difficulty: "Associate",
    questionText: "A developer checks in multiple profile target connections inside their local `profiles.yml` configuration file under an active project named 'ecommerce'. If they execute 'dbt run' from their local terminal, how does dbt know which target connection (e.g., 'dev' vs 'prod') to connect with?",
    codeSnippet: `ecommerce:
  target: dev_john
  outputs:
    dev_john:
      type: postgres
      ...
    prod:
      type: postgres`,
    codeLanguage: "yaml",
    options: [
      "dbt always defaults to the first output target specified alphabetically in the outputs block.",
      "dbt defaults to the target connection specified in the 'target' parameter string declared at the root of that active profile block in `profiles.yml`. This default can be overridden in the CLI using the `--target` or -t flags.",
      "dbt runs connection tests against all listed targets and uses whichever database responds fastest.",
      "The connection target is configured inside Git repository secrets and cannot be resolved locally."
    ],
    correctAnswers: [1],
    explanation: "Within a specific profile defined in `profiles.yml`, the `target:` property is a string that specifies which target output config inside the `outputs:` block dbt will use by default. This makes sure that commands run in the terminal connect to local development environments unless explicitly instructed to target production via CLI overrides.",
    references: "https://docs.getdbt.com/docs/core/connect-data-platform/profiles.yml#understanding-profilesyml",
    dbtVersionFocus: "Core Connection Profiles"
  },
  {
    id: 104,
    category: "Develop Models",
    difficulty: "Advanced",
    questionText: "An analytics team configures an incremental model tracking event histories with 'on_schema_change: fail'. During a staging schema update, the source model adds two new columns. What is the behavior of dbt on the subsequent incremental execution run?",
    options: [
      "dbt automatically builds a matching view and alters the destination table asynchronously without failure.",
      "dbt identifies that the source query results contain columns absent from the target database table, and immediately throws a fatal exception to halt execution before executing data merge or load operations. This forces developers to perform a manual full-refresh run or update schema YAMLs.",
      "dbt continues executing, silent-dropping any rows inside the new columns to prevent data errors.",
      "dbt deletes the physical table and initiates a rebuild of all models referencing the schema."
    ],
    correctAnswers: [1],
    explanation: "When `on_schema_change` is set to `fail`, dbt compares the schema of the source query with the schema of the existing database target table. If there are any differences (such as new columns introduced), dbt raises a compilation/runtime exception to abort the run before loading any rows, protecting database relational structures from silent schema drift.",
    references: "https://docs.getdbt.com/reference/resource-configs/on_schema_change#on_schema_change-fail",
    dbtVersionFocus: "Core Incremental Schemas"
  },
  {
    id: 105,
    category: "Test and Document Models",
    difficulty: "Intermediate",
    questionText: "From both a testing efficiency and financial compute cost perspective, how do modern dbt unit tests (v1.8+) differ fundamentally from traditional data tests (such as unique or singular SQL audits), and what is their primary use case?",
    options: [
      "Traditional data tests validate compiling configurations, while unit tests enforce git commits.",
      "Traditional data tests query physical datasets in the destination warehouse (making them slower and potentially expensive for large tables). Modern unit tests validate model SQL transformations against small, mock datasets evaluated entirely in virtual/sandbox memory without scanning physical warehouse tables, making them extremely fast and cost-efficient.",
      "Unit tests are used only during production runs, while traditional data tests only run locally.",
      "There is no difference in efficiency; they utilize the same underlying compiler queries."
    ],
    correctAnswers: [1],
    explanation: "Traditional data tests (which query physical, live tables) can incur significant warehouse compute charges and are slow. Modern unit tests (v1.8+) enable developers to isolate and validate critical logic (like deep branching CASE statements) using mock input blocks, which execute quickly under virtual runtime scopes and use minimal database processing power.",
    references: "https://docs.getdbt.com/docs/build/unit-tests#how-does-unit-testing-differ-from-data-testing",
    dbtVersionFocus: "v1.8+ (Testing Paradigms)"
  },
  {
    id: 106,
    category: "Debug Data Models",
    difficulty: "Advanced",
    questionText: "Under dbt Core v1.11, when executing source freshness checks on a source that may not be deployed in the local development warehouse space, what is the impact of configuring the 'ignore_missing: true' flag under the freshness property block?",
    codeSnippet: `sources:
  - name: internal_clicks
    ignore_missing: true
    tables:
      - name: session_events
        freshness:
          warn_after: {count: 6, period: hour}`,
    codeLanguage: "yaml",
    options: [
      "It instructs the compiler to generate dummy tables in the raw database on the fly.",
      "If the target table does not exist in the warehouse during freshness checking, dbt normally throws a compilation or connection exception. Configuring 'ignore_missing: true' overrides this behavior; it gracefully skips checks on non-existent sources, allowing clean test pipelines.",
      "It causes dbt freshness checking to run entirely offline, checking YAML structure only.",
      "It forces dbt to bypass the metadata log and read raw schema catalogs instead."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nThe 'ignore_missing' flag was introduced in dbt Core version 1.11 to make dynamic dev environments cleaner. If set to true, dbt will skip the table gracefully if it is missing from the database, rather than terminating with a database compilation exception.\n\nINCORRECT COMPETING OPTIONS:\n- Opt 1 (generate dummy tables): dbt Core does not have the ability to create mock target schemas or input mock records inside raw ingestion sources on the fly; it only reads metadata.\n- Opt 3 (run entirely offline): Freshness checking by definition requires database engine connections to query metadata (like maximum `updated_at` fields) or catalog records; check parsing only validates syntax.\n- Opt 4 (bypass metadata log): This option is incorrect because 'ignore_missing' specifically handles table existence in the database catalog, not the query caching paths.",
    references: "https://docs.getdbt.com/reference/resource-properties/ignore_missing",
    dbtVersionFocus: "v1.11 (Source Freshness)"
  },
  {
    id: 107,
    category: "Deploy dbt Projects",
    difficulty: "Advanced",
    questionText: "An engineering team is running a production deploy script in their Snowflake environment. To optimize rebuild durations and storage fees under Slim CI, they execute 'dbt clone `--state` prod_artifacts'. What is the functional mechanism of the 'dbt clone' command?",
    codeSnippet: `dbt clone --state prod_artifacts --select tag:daily`,
    codeLanguage: "bash",
    options: [
      "It duplicates physical source tables in Cloud storage folders to prevent write conflicts.",
      "It reads the production run state artifacts and executes Zero-Copy Clones (e.g., using native Snowflake metadata copies) of the target tables in the developer's schema, skipping compute-heavy table rebuilds while ensuring real data is immediately accessible.",
      "It converts existing downstream tables back into static CSV feeds.",
      "It copies git repository tags onto production branches without interacting with the warehouse."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nThe 'dbt clone' command (available in modern dbt Core) allows developers to clone models directly from a production state into their development schema using zero-copy metadata clone triggers native to the warehouse (such as Snowflake's CLONE or BigQuery's copy command). This guarantees instantly populated, isolated dev schemas without run computation or data reproduction costs.\n\nINCORRECT COMPETING OPTIONS:\n- Opt 1 (duplicates physical storage folders): 'dbt clone' operates through SQL commands targeting the warehouse metadata catalog layer, rather than executing cloud storage replication scripts.\n- Opt 3 (converts downstream tables to static CSVs): Cloned nodes maintain their existing compilation strategy and format; they are not turned into static CSVs or seeds.\n- Opt 4 (copies git repository tags): dbt CLI has no write permissions to modify GitHub repository status lines or tag release files; it is an analytical build system.",
    references: "https://docs.getdbt.com/reference/commands/clone",
    dbtVersionFocus: "v1.8+ / v1.11+ Slim CI Optimization"
  },
  {
    id: 108,
    category: "Develop Models",
    difficulty: "Advanced",
    questionText: "You are implementing the newly introduced 'microbatch' incremental strategy in dbt Core v1.11 to process clickstream event volumes in batches. Which configuration parameters are legally mandatory for a model utilizing this strategy?",
    codeSnippet: `models:
  - name: fct_web_logs
    config:
      materialized: incremental
      incremental_strategy: microbatch
      # Which mandatory microbatch properties must be declared here?`,
    codeLanguage: "yaml",
    options: [
      "Only materialized and `unique_key` parameters are required; microbatch handles date splits automatically.",
      "A model using the 'microbatch' strategy must define: 1) materialized: incremental; 2) incremental_strategy: microbatch; 3) an active 'event_time' pointing to a database column containing timestamps; 4) a static start string defined as 'begin'; and 5) a supported interval string designated as 'batch_size'. Failing to provide any of these causes a parser configuration error.",
      "Microbatch options only require setting partition filters inside `profiles.yml` configuration logs.",
      "Only the model file name need be specified, as long as the underlying table has an index."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nUnder dbt v1.11+, a microbatch incremental build splits history into dynamic datetime windows and executes them as separate cycles. The microbatch strategy is strict: it requires setting the materialized type to incremental, the strategy to microbatch, defining 'event_time' (the datetime field), 'begin' (the starting threshold), and 'batch_size' (the granularity of slices).\n\nINCORRECT COMPETING OPTIONS:\n- Opt 1 (only materialized and `unique_key`): The `unique_key` cannot replace microbatch parameters, and event_time, begin, and batch_size are mandatory configurations under the dbt YAML schema compiler.\n- Opt 3 (configured inside `profiles.yml`): `profiles.yml` only handles database connection attributes (host, credentials, threads, schema). It does not configure model-level incremental mechanics.\n- Opt 4 (only needs an indexed table): dbt is database-agnostic and does not infer structural constraints from raw indexes; explicit metadata parameters must be supplied in standard YAML blocks.",
    references: "https://docs.getdbt.com/docs/build/microbatch",
    dbtVersionFocus: "v1.11 (Microbatch Incremental)"
  },
  {
    id: 109,
    category: "Develop Models",
    difficulty: "Advanced",
    questionText: "An analytics team installs an external utility package, but they want to override the behavior of a specific default macro from that package. How can they configure macro resolution order using the 'dispatch' config block inside `dbt_project.yml`?",
    codeSnippet: `dispatch:
  - macro_namespace: dbt_utils
    search_order: ['my_project', 'dbt_utils']`,
    codeLanguage: "yaml",
    options: [
      "The dispatch block modifies warehouse queries dynamically at runtime inside connection parameters.",
      "The 'dispatch' config block allows users to specify macro namespace lookup priority. By defining 'search_order', you instruct the compiler to search 'my_project' first when compiling a macro called in the 'dbt_utils' namespace, enabling clean local overwrites without editing package code.",
      "The dispatch list triggers package installations over secure API endpoints.",
      "It instructs the dbt compiler to move macro compiled files into separate physical storage volumes."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nThe 'dispatch' parameter governs macro lookup priority. In dbt, if a package calls `dbt_utils.some_macro`, installing a local version with the same name doesn't work by default unless you declare a dispatch order in `dbt_project.yml`. Here, the compiler is forced to check your local project for overrides first.\n\nINCORRECT COMPETING OPTIONS:\n- Opt 1 (modifies warehouse queries at runtime): Dispatch configuration only impacts compile-time macro resolution within the dbt Python parser, rather than modifying connection configurations.\n- Opt 3 (triggers package installations): Package downloads and folder provisioning are managed solely by editing `packages.yml` and executing `dbt deps`.\n- Opt 4 (moves compiled files): Compiled SQL remains safely organized as a flat tree structure inside the relative `target/compiled/` folder on local disk blocks, regardless of lookup resolution.",
    references: "https://docs.getdbt.com/reference/project-configs/dispatch",
    dbtVersionFocus: "Core Macro Resolution & Governance"
  },
  {
    id: 110,
    category: "Deploy dbt Projects",
    difficulty: "Advanced",
    questionText: "Your continuous integration (Slim CI) flow runs the command: `dbt run` `--select` state:modified+ `--defer` `--state` prod_state. If an untouched downstream model 'fct_revenue' depends on a modified staging model, how does dbt resolve the reference for fct_revenue?",
    options: [
      "The execution fails because fct_revenue is excluded from execution paths.",
      "dbt compiles fct_revenue to query the production database namespace (e.g. 'prod_database.prod_schema.fct_revenue') as defined in the prod_state manifest, deferring to valid production tables instead of rebuilding them in the dev schema.",
      "dbt builds a duplicate physical copy of fct_revenue inside the developer's schema on the fly.",
      "dbt compiles fct_revenue using mock empty views to lower costs."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nThe combination of '--defer' and '--state' translates to smart references. During a pull-request run, you only rebuild the modified nodes (e.g., staging). Any direct downstream models that depend on them will be directed to look in the target production environment for existing structures to avoid building the rest of the DAG.\n\nINCORRECT COMPETING OPTIONS:\n- Opt 1 (fails extraction): This is incorrect because the build finishes successfully; deferral is designed to handle this exact relationship without compilation failure.\n- Opt 3 (builds duplicate copies): Cloned or deferred tables are read from their production targets; dbt saves cycles by avoiding duplicating or modifying unchanged tables in the dev workspace.\n- Opt 4 (uses mock schemas): Deferral queries actual computed production structures, preserving complete dataset access and integrity tests during verification.",
    references: "https://docs.getdbt.com/reference/node-selection/defer",
    dbtVersionFocus: "Slim CI & Deferral"
  },
  {
    id: 111,
    category: "Develop Models",
    difficulty: "Advanced",
    questionText: "An analytics engineer designs a custom 'generate_schema_name' macro. By default, how does dbt Core behave when compiling custom schema configurations in development versus production environments?",
    codeSnippet: `{% macro generate_schema_name(custom_schema_name, node) -%}
    {# Custom logic #}
{%- endmacro %}`,
    codeLanguage: "jinja",
    options: [
      "dbt ignores custom schema names altogether when compiling inside developer systems.",
      "By default, if a custom schema is specified in dev, dbt appends the custom schema name to the target schema defined in `profiles.yml` (yields target_schema_custom_schema). In production, dbt uses the custom schema as-is (discarding the target profile prefix) to keep physical separation rules.",
      "An exception is raised if custom schemas overlap with warehouse cluster specifications.",
      "Custom schemas must match the profile connection target name exactly."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nThis is a standard dbt macro behavior gotcha. To prevent multiple developers from colliding or overwriting each other's custom schemas, dbt's default behavior for custom schemas combines the user's default schema from `profiles.yml` with the model's custom schema (e.g. `analytics_dev_mart`). In production, it drops the prefix, building directly in the custom schema (e.g. `mart`).\n\nINCORRECT COMPETING OPTIONS:\n- Opt 1 (ignores custom schemas): dbt actively parses and compiles custom schemas in dev, though it applies prefixing to avoid multi-user conflicts.\n- Opt 3 (exception on overlap): dbt compiles custom schemas dynamically without raising conflicts, regardless of database or warehouse configurations.\n- Opt 4 (must match target connection name): The schema name is isolated and does not need to align with connection configurations or targets.",
    references: "https://docs.getdbt.com/docs/build/custom-schemas",
    dbtVersionFocus: "Core Schema Macro Customization"
  },
  {
    id: 112,
    category: "Test and Document Models",
    difficulty: "Advanced",
    questionText: "When planning snapshot rules for historical capture, what is a crucial performance and cost trade-off between the 'check' strategy and the 'timestamp' strategy?",
    codeSnippet: `snapshot_config:
  strategy: 'check'
  check_cols: 'all'`,
    codeLanguage: "yaml",
    options: [
      "The check strategy yields faster executions because it ignores warehouse indexes.",
      "The 'timestamp' strategy is highly efficient as it checks a single column (e.g., `updated_at`) to discover modified records. The 'check' strategy (especially with 'check_cols: all') compares every listed column across millions of rows, requiring expensive database hash computations and slow runtimes.",
      "The timestamp strategy is destructive and deletes records from the snapshot metadata table.",
      "The check strategy is limited to processing less than three source rows per transaction."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nSnapshot strategies dictate change detection logic. The `timestamp` strategy is preferred because it relies on a single column update to detect changes. The `check` strategy is a fallback: it executes expensive column comparisons (typically using SHA256 hashing) across all specified columns, which scales poorly for wide tables.\n\nINCORRECT COMPETING OPTIONS:\n- Opt 1 (check is faster): The 'check' strategy is significantly slower and computationally more demanding, not faster.\n- Opt 3 (timestamp strategy is destructive): Non-destructive historical record keeping is the core purpose of both snapshot strategies; neither deletes data rows.\n- Opt 4 (limited to less than three rows): Snapshots can handle huge datasets containing millions of rows, but scale efficiency is heavily impacted by the strategy selected.",
    references: "https://docs.getdbt.com/docs/build/snapshots",
    dbtVersionFocus: "Core Snapshot Strategies"
  },
  {
    id: 113,
    category: "Develop Models",
    difficulty: "Advanced",
    questionText: "Under the dbt Semantic Layer (MetricFlow standards), you have two pre-existing simple metrics declared below. You want to define a new derived metric `average_revenue_per_user` that divides `revenue` by `active_users`. Which configuration structure inside your schema YAML correctly defines this derived metric?",
    codeSnippet: `metrics:
  - name: revenue
    type: simple
    type_params:
      measure: total_revenue
  - name: active_users
    type: simple
    type_params:
      measure: user_count`,
    codeLanguage: "yaml",
    options: [
      "You must specify 'type: raw' and write standard PostgreSQL subqueries in the configuration profile.",
      "The metric must be configured with 'type: expression', and its 'type_params' config must contain an 'expression' string referencing the identifiers of other valid metric nodes (e.g., 'type_params: { expression: \"revenue_metric / user_metric\" }'). MetricFlow handles compilation dynamically.",
      "Dynamic metric references are forbidden; metrics are isolated objects and cannot depend on each other.",
      "You must define the secondary metrics inside the raw source properties instead of semantic profiles."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nMetricFlow allows building a metric hierarchy. To compute ratios or derived dimensions across metrics, you use a 'type: expression' metric. Within its 'type_params' parameters, you write a standard algebraic expression using the names of pre-existing metrics inside the DAG.\n\nINCORRECT COMPETING OPTIONS:\n- Opt 1 (type: raw and standard SQL subqueries): MetricFlow generates the appropriate SQL queries under the hood; raw SQL subqueries are invalid configurations.\n- Opt 3 (metric references are forbidden): Deriving expression metrics from basic measures is one of the primary design features of the dbt Semantic Layer.\n- Opt 4 (define inside raw source properties): Sources only define structural database endpoints, not semantic layer objects which are developed later in the pipeline.",
    references: "https://docs.getdbt.com/docs/build/about-metricflow",
    dbtVersionFocus: "Semantic Layer (MetricFlow)"
  },
  {
    id: 114,
    category: "Test and Document Models",
    difficulty: "Advanced",
    questionText: "An analytics engineer is writing an active unit test under dbt Core v1.8+ for a model that processes a nested JSON/structure field. How do they mock values for complex dictionary or array elements inside the input rows block of schema.yml?",
    codeSnippet: `unit_tests:
  - name: test_nested_format
    model: my_nested_parser
    given:
      - input: ref('stg_json_source')
        rows:
          - {event_id: 1, properties: '{"user_tier": "premium", "segment": "enterprise"}'}`,
    codeLanguage: "yaml",
    options: [
      "Nested JSON structures cannot be tested and must be removed prior to code parsing.",
      "Array or dictionary inputs must be specified as JSON-escaped string blocks (e.g. '{\"key\": \"value\"}') inside the mock row mapping. The model compiles the mock data string into a standard query, running the target SQL parser safely.",
      "Unit tests only support flat string structures; complex columns are evaluated as null values.",
      "Mock inputs are declared inside separate CSV seeds, rather than in the schema.yml file."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\ndbt unit tests support mocking any column data type supported by the database engine. For semi-structured columns (such as Snowflake JSON or Postgres JSONB), mock rows can pass raw string representations of JSON/arrays in the YAML configurations, which are then compiled correctly by the model parser.\n\nINCORRECT COMPETING OPTIONS:\n- Opt 1 (JSON must be removed): This is false; semi-structured queries and nested objects are actively supported by modern dbt unit testing loops.\n- Opt 3 (complex columns evaluated as null): Standard SQL engine casting allows JSON-escaped strings to compile into JSON types; they are not limited to null values.\n- Opt 4 (declared inside CSV seeds): While seed data can be processed by other commands, unit testing mock data is declared inline under `rows:` blocks inside `schema.yml` for clean isolation.",
    references: "https://docs.getdbt.com/docs/build/unit-tests",
    dbtVersionFocus: "v1.8+ (Model Unit Testing)"
  },
  {
    id: 115,
    category: "Develop Models",
    difficulty: "Advanced",
    questionText: "When enforcing a Model Contract (contract: {enforced: true}) on an incremental table inside a raw Postgres warehouse, how does dbt Core regulate physical database updates during subsequent model executions?",
    options: [
      "The contract is checked only on the first run, and ignored on subsequent runs to increase speed.",
      "During every execution (including incremental run states), the dbt compiler verifies the target table schema against the contract catalog properties. If either datatype definitions skew or specified columns are missing, compilation fails before any record mutations are written to the database.",
      "dbt dynamically alters the destination table, changing Postgres system datatypes automatically without safety checks.",
      "Enforcing model contract parameters removes all indices on the target tables automatically."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nModel contracts are checked at compile time during every single executable state, including run or build steps. dbt queries table structures to verify that columns match the datatypes, null constraints, and keys declared in `schema.yml`, raising an immediate exception if a change threatens downstream users.\n\nINCORRECT COMPETING OPTIONS:\n- Opt 1 (ignored on subsequent runs): Contracts must be enforced on every execution state to defend targets against column/schema drift over time.\n- Opt 3 (dynamically alters datatypes): dbt does not automatically override database engine system types; it forces a compilation block if skews arise.\n- Opt 4 (removes indices): contracts protect data models without deleting warehouse physical structures or modifying indices.",
    references: "https://docs.getdbt.com/docs/collaborates/govern/model-contracts",
    dbtVersionFocus: "Core Model Contracts"
  },
  {
    id: 116,
    category: "Debug Data Models",
    difficulty: "Advanced",
    questionText: "You configure 'query-comment' properties inside `dbt_project.yml` to identify expensive warehouse run origins. What context information is available to the query-comment Jinja compiler, and what is a performance pitfall to avoid?",
    codeSnippet: `query-comment:
  comment: "Compiled by user: {{ target.user }} | model: {{ model.name }}"
  append: true`,
    codeLanguage: "yaml",
    options: [
      "Query comments only support static strings; Jinja parsing is forbidden inside comment strings.",
      "Query comments can reference 'target', 'model', 'run_started_at', and other metadata context. A significant performance gotcha is using highly dynamic timestamp stamps with 'append: true' on platforms (e.g. Snowflake) with caching loops. If each query string differs by a timestamp, the engine cannot cache the compile statement, leading to higher compute cost.",
      "Query comments disable the visual dbt lineage graphs internally.",
      "Adding a query comment blocks execution of transactional hooks."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nQuery commenting parses custom Jinja templates, injecting metadata into SQL statements. This makes tracking compute costs simple. However, adding highly volatile tags (like start times) defeats warehouse query caching mechanics, since identical queries compile as separate entries.\n\nINCORRECT COMPETING OPTIONS:\n- Opt 1 (only supports static strings): Jinja parser blocks are fully supported in query-comment parameters to pull user or run details.\n- Opt 3 (disables visual lineage graphs): Query commenting enhances cloud and system tracking metrics without affecting compiler graph outputs.\n- Opt 4 (blocks hooks): Comments are treated as simple header headers or footer lines and do not hinder trigger execution routines.",
    references: "https://docs.getdbt.com/reference/project-configs/query-comment",
    dbtVersionFocus: "Core Query Comments & Debugging"
  },
  {
    id: 117,
    category: "Deploy dbt Projects",
    difficulty: "Intermediate",
    questionText: "To defend `profiles.yml` against committing hardcoded passwords or database tokens into security repositories, what is the best practice for establishing safe credential management, and how is it parsed?",
    codeSnippet: `outputs:
  dev:
    type: postgres
    user: analyst
    password: # How should sensitive credentials be securely supplied here?`,
    codeLanguage: "yaml",
    options: [
      "Passwords can only be stored as plain-text inside `profiles.yml`; dbt cannot parse environmental parameters.",
      "The env_var() Jinja function allows credential rotation. DBT queries system environment values directly at compilation, ensuring security profiles contain no raw values and can be safely committed to source control systems.",
      "All credentials must be stored within `dbt_project.yml` configuration schemas.",
      "The env_var function creates static configuration files that must be deleted after each compile task."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nThe `env_var()` compiler function allows accessing environment variables inside configurations like `profiles.yml`. This pattern defends against raw credentials checking, making continuous integration credential pipelines highly secure and simple.\n\nINCORRECT COMPETING OPTIONS:\n- Opt 1 (only stored as plain-text): dbt native Jinja engines explicitly support loading env variables inside configuration files like `profiles.yml`.\n- Opt 3 (stored within `dbt_project.yml`): Coordinates and secrets belong exclusively in system files like `profiles.yml`, not in models configurations or project files.\n- Opt 4 (creates static config files): values are processed dynamically on the fly within server or shell environments, and no temp physical files are created or deleted.",
    references: "https://docs.getdbt.com/reference/dbt-jinja-functions/env_var",
    dbtVersionFocus: "Core Profiles & Variables Security"
  },
  {
    id: 118,
    category: "Develop Models",
    difficulty: "Advanced",
    questionText: "An analytics engineering manager sets the incremental strategy 'on_schema_change: sync_all_columns' on a transactional database model. What is the explicit operational behavior when a column is deleted from the source query?",
    options: [
      "The entire model fails immediately and requests a full-refresh run.",
      "For databases that support column dropping, 'sync_all_columns' removes the column from the target table on the fly. For databases that do not support dynamic column dropping (e.g. BigQuery), the deleted column is kept in the catalog but filled with NULLs during future incremental loads.",
      "dbt recreates the entire table from scratch as an ordinary view.",
      "dbt throws a compilation error because columns cannot be altered inside incremental pipelines."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nThe 'sync_all_columns' schema configuration offers maximum sync flexibility. On engines supporting DROP COLUMN, it performs an direct DROP command. On warehouses lacking dropped columns structures, dbt handles deletions by backfilling future insertions with NULL values for safety.\n\nINCORRECT COMPETING OPTIONS:\n- Opt 1 (model fails): This describes the behavior of 'on_schema_change: fail', not 'sync_all_columns'.\n- Opt 3 (recreates as ordinary view): Incremental targets are preserved and mutated; dbt avoids dropping tables or changing target materialize views to standard views.\n- Opt 4 (compilation error raised): 'sync_all_columns' is purposely built to allow and resolve schema changes without failing builds.",
    references: "https://docs.getdbt.com/reference/resource-configs/on_schema_change#on_schema_change-sync_all_columns",
    dbtVersionFocus: "Incremental Model Columns"
  },
  {
    id: 119,
    category: "Debug Data Models",
    difficulty: "Intermediate",
    questionText: "You are attempting to speed up compilation and execution by running 'dbt run --threads 16'. What controls thread allocations, and what is a primary debug gotcha of configuring excessively high thread counts?",
    options: [
      "Threads are restricted purely by Snowflake physical credit limits.",
      "The '--threads' flag dictates concurrently processed DAG nodes. If set higher than the number of parallel connections supported by the database engine (or higher than local machine capacity), queries queue in the warehouse, adding connection overhead and making execution slower.",
      "High thread counts can corrupt underlying compiled SQL logic.",
      "Thread configuration is static and can only be set inside `dbt_project.yml`."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nThe thread parameter regulates horizontal DAG compilation. While processing multiple independent nodes concurrently speeds up runs, setting high thread counts beyond database queue limits or thread pool parameters results in thread lock delays, metadata waiting times, and slower overall runs.\n\nINCORRECT COMPETING OPTIONS:\n- Opt 1 (restricted by Snowflake limits): Thread limits are managed by dbt's Python execution engine and connection pool configurations, not backend compute models.\n- Opt 3 (corrupts SQL logic): Concurrent compilation writes standard target SQL scripts cleanly and is functionally thread-safe; concurrency does not affect logic.\n- Opt 4 (thread config is static): Threads can be modified dynamically on the command line utilizing the `--threads` or `-t` options.",
    references: "https://docs.getdbt.com/docs/core/connect-data-platform/connection-profiles#configuring-threads",
    dbtVersionFocus: "Core Concurrency & Performance Tuning"
  },
  {
    id: 120,
    category: "Test and Document Models",
    difficulty: "Advanced",
    questionText: "To keep deployment alerts clean, you configure failure threshold boundaries using 'warn_if' and 'error_if' on a key metrics test. How do these properties evaluate test outcomes?",
    codeSnippet: `tests:
  - my_custom_test:
      warn_if: "> 5"
      error_if: "> 10"`,
    codeLanguage: "yaml",
    options: [
      "The conditions evaluate raw warehouse column averages rather than row failure counts.",
      "The expressions evaluate against the COUNT of failing rows returned by the test query. If failing rows exceed 5 but remain under 11, dbt emits a warning status. If failing rows exceed 10, dbt raises an error block and halts downstream CI dependent tasks.",
      "Under dbt, error_if and warn_if values are only supported in singular SQL files.",
      "The test executes twice: once to check warn_if, and then again to evaluate the database size."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nData tests evaluate validation metrics by counting the number of records returned by the test query. Using `warn_if` and `error_if` allows analytics engineers to specify conditions on that count, converting standard pass/fail validations into threshold-based notifications.\n\nINCORRECT COMPETING OPTIONS:\n- Opt 1 (evaluates column averages): These configurations evaluate the total volume (count) of failing records returned by the test query, not averages.\n- Opt 3 (only supported in singular files): They are fully supported across both generic schema YAML tests and singular custom SQL test definitions.\n- Opt 4 (executes twice): The compiler evaluates both conditions against a single query execution count, saving computation costs.",
    references: "https://docs.getdbt.com/reference/resource-properties/tests#error_if-and-warn_if",
    dbtVersionFocus: "Advanced Testing Customization"
  }
];



