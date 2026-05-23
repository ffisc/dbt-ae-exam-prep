import { Question } from "./types";

export const examQuestions: Question[] = [
  {
    id: 1,
    category: "Develop Models",
    difficulty: "Advanced",
    questionText: "An analytics engineer is setting up a dbt Mesh architecture. They want to expose a model named `fct_orders` in an upstream 'core' project so that other down-stream department projects can reference it. What is the minimum configuration required in the upstream project's schema file to allow cross-project dereference with '{{ ref() }}' and ensure that the downstream build does not fail during compilation?",
    codeSnippet: `models:
  - name: fct_orders
    config:
      # Which setting goes here?
      access: public`,
    codeLanguage: "yaml",
    options: [
      "No configuration is required; any model in a dbt project can be referenced across projects by default if imported as a package.",
      "Set `access: public` in the model's properties. By default, dbt models are `private`.",
      "Set `access: global` and declare `enforce_contract: true` on the model.",
      "Set `access: public` AND configure a `contract` on the model with `enforced: true`."
    ],
    correctAnswers: [3],
    explanation: "To allow a model to be referenced across projects in a dbt Mesh architecture (via cross-project ref), two conditions must be met: 1) The model's access must be configured as `public` (by default, models are `private`). 2) The model must have a contract enforced (`contract: { enforced: true }`). Both are mandatory to permit downstream projects to reference it safely, protecting against schema changes.",
    references: "https://docs.getdbt.com/docs/collaborate/governance/model-access",
    dbtVersionFocus: "v1.7+ (dbt Mesh)"
  },
  {
    id: 2,
    category: "Develop Models",
    difficulty: "Intermediate",
    questionText: "Which of the following describes the correct syntactical pattern for enforcing a model contract on a PostgreSQL SQL model inside its YAML definition file?",
    codeSnippet: `models:
  - name: dim_customers
    config:
      contract:
        enforced: true
    columns:
      - name: customer_id
        data_type: integer
        constraints:
          - type: not_null
      - name: signup_date
        data_type: date`,
    codeLanguage: "yaml",
    options: [
      "The contract must be defined with `contract: true` and column details can be completely omitted, letting dbt infer types at runtime.",
      "The contract configuration requires `contract: {enforced: true}` at the model level, and every single column in the model must have a declared `data_type` matching the database schema.",
      "The contract must specify `access: global` and you must declare database-specific constraints like `primary_key` exclusively inside the SQL code file.",
      "Contracts are declared inside the `dbt_project.yml` file under `models: contracts: enforced: true` which applies to all models automatically."
    ],
    correctAnswers: [1],
    explanation: "When you enforce a model contract using `contract: {enforced: true}`, dbt verifies that the model's actual query results match the declared columns exactly. Crucially, you must explicitly declare every column in the schema file, and each of those columns must have a `data_type` property configured.",
    references: "https://docs.getdbt.com/docs/collaborate/govern/model-contracts",
    dbtVersionFocus: "v1.5+ (Model Contracts)"
  },
  {
    id: 3,
    category: "Develop Models",
    difficulty: "Advanced",
    questionText: "An analytics team needs to introduce a breaking schema change to an established model named `dim_users` while keeping the old schema active for old downstream nodes. They decide to use model versioning. They designate file names as `dim_users_v1.sql` and `dim_users_v2.sql`. What is the correct YAML pattern in their model schema definition to complete this version configuration?",
    codeSnippet: `models:
  - name: dim_users
    latest_version: 1
    versions:
      - v: 1
      - v: 2
        columns:
          - name: phone_number
            data_type: varchar`,
    codeLanguage: "yaml",
    options: [
      "Register a separate model block for each version: one named `dim_users_v1` and one named `dim_users_v2` with direct references.",
      "Register a single model named `dim_users`, specify its `latest_version: 1`, and list its versions in the `versions:` array as sub-key declarations matching the file suffixes.",
      "Create a macro named `dim_users` that selects from the correct table depending on `env_var('DBT_VERSION')`, bypassing schema YAML definitions.",
      "Declare `version: 1` inside `dim_users_v1.sql` config block, and `version: 2` in `dim_users_v2.sql` config block; files must remain named `dim_users.sql`."
    ],
    correctAnswers: [1],
    explanation: "To implement versioning, you define a single model block in YAML (under the base name, e.g. `dim_users`), optionally specify `latest_version`, and define the list of versions in the `versions` block. The SQL files are named `<model_name>_v<version_number>.sql`, in this case `dim_users_v1.sql` and `dim_users_v2.sql`.",
    references: "https://docs.getdbt.com/docs/collaborate/govern/model-versions",
    dbtVersionFocus: "v1.6+ (Model Versioning)"
  },
  {
    id: 4,
    category: "Test and Document Models",
    difficulty: "Intermediate",
    questionText: "In dbt Core v1.8, unit testing was officially introduced to let analytics engineers validate SQL logic with mock data. Which block correctly declares a unit test for a model named `dim_customers` that queries a source named `raw_customers`?",
    codeSnippet: `unit_tests:
  - name: test_inactive_customers_are_filtered
    model: dim_customers
    given:
      - input: source('jaffle_shop', 'raw_customers')
        rows:
          - {id: 1, status: 'inactive'}
          - {id: 2, status: 'active'}
    expect:
      rows:
        - {id: 2, status: 'active'}`,
    codeLanguage: "yaml",
    options: [
      "Declarations must be placed under custom sql files inside the `tests/` directory and must represent a standard SELECT query returning error rows.",
      "The definition must be placed under `unit_tests:` in a `.yml` file. It must reference the target `model`, state the `given` inputs with mock `rows` (using Jinja references to sources/refs), and use the `expect` block to declare expected outputs.",
      "The test is configured directly inside the SQL model code file within a Jinja block: `{% unit_test active_expect={...} %}`.",
      "Unit testing is exclusively supported in dbt Cloud and cannot be configured in dbt Core YAML configurations."
    ],
    correctAnswers: [1],
    explanation: "By declaring `unit_tests:` in a schema file, you define mock inputs for model prerequisites (sourced tables or upstream refs) under `given`, supplying a list of dictionary rows, and state the exact output rows expected from compiling and executing the model SQL against that dummy mock data under the `expect` key.",
    references: "https://docs.getdbt.com/docs/build/unit-tests",
    dbtVersionFocus: "v1.8+ (Unit Testing)"
  },
  {
    id: 5,
    category: "Develop Models",
    difficulty: "Advanced",
    questionText: "You are implementing the dbt Semantic Layer. You need to configure a metric that computes the average order value (AOV). Crucially, the metric is calculated as order revenue divided by total orders. What is the correct object setup inside your schema YAML?",
    codeSnippet: `semantic_models:
  - name: orders
    model: ref('fct_orders')
    measures:
      - name: total_revenue
        agg: sum
      - name: distinct_orders
        agg: count_distinct
metrics:
  - name: average_order_value
    type: expression
    type_params:
      expr: total_revenue / distinct_orders`,
    codeLanguage: "yaml",
    options: [
      "The metric is defined inside the SQL model directly via custom SQL window average queries.",
      "Metrics must be defined under a `semantic_models` parent block as simple SQL fragments inside the main database schema, without individual measure declarations.",
      "You define measures in the model's `semantic_model` config block, then define a metric of type `expression` under the `metrics:` property. The `expr` parameter uses the measures to calculate the metric.",
      "Define type `calculation` directly inside standard dbt generic testing blocks, which aggregates and outputs average tables dynamically."
    ],
    correctAnswers: [2],
    explanation: "In the dbt Semantic Layer (powered by MetricFlow), metric definitions must rely on a modern specification. You define 'measures' representing aggregates (like sum or count_distinct) in a `semantic_model` block linked to a model, then define 'metrics' of type `expression` (or other types like `simple`, `ratio`, `cumulative`) pointing to those measures inside the top-level `metrics:` array.",
    references: "https://docs.getdbt.com/docs/build/about-metricflow",
    dbtVersionFocus: "v1.6+ (Semantic Layer / MetricFlow)"
  },
  {
    id: 6,
    category: "Deploy dbt Projects",
    difficulty: "Advanced",
    questionText: "An organization is deploying a Slim CI pipeline to prevent redundant warehouse runs. The pipeline compiles and runs only models that have changed. They also want downstream nodes that haven't changed to fetch state from the latest production run dynamically. What is the correct CLI invocation and environment configuration to accomplish this Slim CI run?",
    codeSnippet: `dbt build --select state:modified+ --defer --state path/to/prod/manifest`,
    codeLanguage: "bash",
    options: [
      "dbt run --select state:new+ --state prod --defer-all-models",
      "dbt build --select state:modified+ --defer --state path/to/prod/artifacts",
      "dbt test --select modified+ --from-manifest production.json",
      "No CLI command exists. dbt Cloud manages this automatically without allowing CLI config modifications."
    ],
    correctAnswers: [1],
    explanation: "Slim CI builds compile only modified nodes (`--select state:modified+`) alongside their downstream dependents (the `+` suffix). Using `--defer` redirects any unmodified upstream nodes to fetch data from the production environment, specified by pointing `--state` to a directory containing the production run's `manifest.json`.",
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
      "dbt automatically injects temporal filtering where-clauses for the 'event_time' column based on the active batch boundaries and lookback. Developers do not write manual Jinja is_incremental() blocks in their SQL code.",
      "The 'microbatch' strategy is only supported for ephemeral views and does not execute in serial database transactions.",
      "Configuring 'microbatch' requires defining separate schema contracts for each daily and hourly target partition."
    ],
    correctAnswers: [1],
    explanation: "Under the dbt Core v1.11 microbatch incremental strategy, dbt automatically handles the temporal logic. It injects dynamic WHERE clauses on the 'event_time' column (e.g. payment_date) using the active batch window and lookback parameter, meaning developers compile clean, standard SELECT queries without needing manual is_incremental() Jinja blocks or date calculation filters.",
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
    explanation: "In dbt Mesh, models possess a default access tier of `private`. `private` models can only be referenced inside the project where they are declared. `protected` models can only be referenced by models in the same package (or project groups). Setting `access: public` is a hard requirement to authorize cross-project calling.",
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
    explanation: "When modifying a model's materialization from a view to a table (or vice versa), some database engines reject replacing the existing database object of a different type seamlessly. Dropping the old layout occurs automatically if you perform a `dbt run --full-refresh` or manually run drop commands inside the warehouse.",
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
      "dbt does not support dynamic schema overrides outside target configurations inside profiles.yml.",
      "Remove the macro and configure database names directly in the model's metadata block."
    ],
    correctAnswers: [1],
    explanation: "Standard dynamic schema patterns in dbt involve customizing the default `generate_schema_name` macro. In the overridden code, inspecting the active `target.name` decides whether code goes to actual custom destination names (production targets) or fallbacks safely to individual development schemes (e.g. `dbt_jsmith`).",
    references: "https://docs.getdbt.com/docs/build/custom-schemas",
    dbtVersionFocus: "Core"
  },
  {
    id: 11,
    category: "Test and Document Models",
    difficulty: "Intermediate",
    questionText: "An analytics engineer has set up both generic column tests and the new dbt v1.8 unit tests on their models. They want to execute ONLY the unit tests across their entire project to keep build cycles rapid during development. Which command correctly performs this filtered execution?",
    codeSnippet: `dbt test --select "test_type:unit"`,
    codeLanguage: "bash",
    options: [
      "dbt run --unit-only",
      "dbt test --select \"test_type:generic\"",
      "dbt test --select \"test_type:unit\"",
      "dbt test --exclude column_tests"
    ],
    correctAnswers: [2],
    explanation: "In dbt Core v1.8+, you can select tests by their test type. Unit tests are targeted specifically by executing the dbt select criteria: `test_type:unit`. Generic tests (such as unique, non_null, relationships, accepted_values) can be selected via `test_type:generic`.",
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
      "Define standard filters inside packages.yml and trigger a full project-wide re-compilation with 'dbt deps'.",
      "Pass the date range using the CLI configurations '--event-time-start 2026-05-10' and '--event-time-end 2026-05-15'. dbt will process and run independent transactions for only the batch periods that fall in this interval.",
      "Set 'deprecated_at: 2026-05-10' in the model schema YAML and run with standard 'dbt run --full-refresh'.",
      "Configure variables via '--vars' to override the internal connection pool variables '_dbt_max_event_time' in the database drivers."
    ],
    correctAnswers: [1],
    explanation: "Under dbt Core v1.11, the microbatch strategy supports precise execution control using the '--event-time-start' and '--event-time-end' CLI configurations. This enables developers to execute backfills or targeted partition runs, forcing the microbatch scheduler to compile and serialise execution exclusively for the batches inside the declared time bounds, which dramatically reduces data scans.",
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
    explanation: "Source freshness evaluates database updates by measuring the difference between the maximum value in `loaded_at_field` against the current clock time. Freshness thresholds (`warn_after` / `error_after` counts and periods) are validated by running the command `dbt source freshness`.",
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
    explanation: "In dbt, you can deprecate older model versions by applying `deprecated_at` field inside the target version block. dbt will seamlessly raise clear warning messages when projects reference a deprecated version during a parse or build run if the system calendar crosses that threshold.",
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
    explanation: "dbt Explorer (the cloud metadata visualizer) supports cross-project lineage mapping. By analyzing manifests across multiple projects grouped in dbt Mesh, it presents an interactive full-lineage lineage view mapping out upstream public core dependencies and downstream marketing or product nodes.",
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
    explanation: "dbt establishes a strict order of variable priority. Values supplied on the command-line utilizing the `--vars` argument override any equivalent variables declared inside the `dbt_project.yml` files, profiles, or macro fallbacks.",
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
    explanation: "Models marked with `access: private` can only be referenced by other models defined inside the exact same dbt project. If the model is also assigned a `group`, standard dbt model access constraints dictate that only other models belonging to that identical group can compile references to it, securing private data fields.",
    references: "https://docs.getdbt.com/docs/collaborate/governance/model-access",
    dbtVersionFocus: "v1.7+ (dbt Mesh & Groups)"
  },
  {
    id: 18,
    category: "Test and Document Models",
    difficulty: "Associate",
    questionText: "What is the key difference between generic tests and singular tests in dbt test suites?",
    codeSnippet: "",
    options: [
      "Generic tests are defined inside SQL files under `tests/generic/`, while singular tests can only be run in dbt Cloud.",
      "Singular tests are written as standalone SQL SELECT queries inside the `tests/` directory (where a test fails if any rows are returned). Generic tests are parameterized tests declared in YAML (like unique, not_null) that apply to columns.",
      "Singular tests are defined in YAML schema files, whereas generic tests are written in pure YAML inside the profiles registry.",
      "Generic tests run during `dbt run`, while singular tests require invoking the command `dbt test --singular`."
    ],
    correctAnswers: [1],
    explanation: "Singular tests are custom SQL scripts located in the `tests/` directory; if the query returns 0 rows, the test passes. Generic tests are reusable parameterized macros defined under column properties inside YAML files, like the built-in `unique`, `not_null`, `relationships`, and `accepted_values` tests.",
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
    explanation: "The `ephemeral` materialization tells dbt not to create an object in the database. Instead, dbt compiles its query and injects it as an in-line Common Table Expression (CTE) directly into any referring downstream models, avoiding database storage and table creation steps completely.",
    references: "https://docs.getdbt.com/docs/build/materializations#ephemeral",
    dbtVersionFocus: "Core"
  },
  {
    id: 20,
    category: "Deploy dbt Projects",
    difficulty: "Associate",
    questionText: "You are setting up a dbt run inside standard scheduling software. You want your jobs to fetch external packages from Git registries, delete older local database compiling artifacts, and immediately build your downstream models. Which sequence of dbt commands is correct?",
    codeSnippet: "",
    options: [
      "dbt run -> dbt test -> dbt docs",
      "dbt clean -> dbt deps -> dbt build",
      "dbt deps -> dbt clean -> dbt seed",
      "dbt build --with-packages"
    ],
    correctAnswers: [1],
    explanation: "The recommended execution lifecycle inside scheduling servers starts with `dbt clean` (clearing older `dbt_packages/` and `target/` directories), immediately followed by `dbt deps` (loading packages listed in `packages.yml`), and concluding with `dbt build` (running and testing models, seeds, snapshots, and sources in optimized order).",
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
    explanation: "When model contracts are enforced (`enforced: true`), dbt forces a strict pre-flight schema comparison. If the names or data types of the columns retrieved by the SQL SELECT query do not perfectly match the ones declared in the model schema YAML properties, dbt immediately fails the build, preventing incompatible changes from reaching production.",
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
    explanation: "Conversion metrics are a dedicated metric type in the dbt Semantic Layer. Under `type: conversion`, the metric uses `type_params` containing a `conversion_type_params` block to specify the `base_measure` (the initial event, like signups) and `conversion_measure` (the target event, like purchase), along with an optional lookback `window` constraint.",
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
      "Specify the upstream project under the 'dependencies:' key within 'dbt_project.yml' (and load the remote manifest via dbt Cloud). This permits referencing public upstream models via 'ref('core_finance', 'fct_revenues')' without local code cloning.",
      "Add the upstream project name to the local 'packages.yml' file, forcing dbt to download and compile all upstream models as local nodes.",
      "Define custom database views manually in the downstream target database and reference them strictly as raw sources.",
      "Declare a global variable 'upstream_models' pointing to public schemas in profiles.yml."
    ],
    correctAnswers: [0],
    explanation: "In dbt Mesh, instead of treating an external project as an imported package (which compiles all upstream files locally), we define cross-project dependencies in the `dbt_project.yml` under `dependencies:`. Downstream models reference public models from that project seamlessly (e.g. `ref('project_name', 'model_name')`). To resolve compilation metadata without reading the raw code, dbt fetches the upstream manifest dynamically.",
    references: "https://docs.getdbt.com/docs/collaborator/mesh/cross-project-ref",
    dbtVersionFocus: "v1.10+ (dbt Mesh Dependencies)"
  },
  {
    id: 24,
    category: "Deploy dbt Projects",
    difficulty: "Advanced",
    questionText: "An analytics engineer is deploying models in an isolated Dev warehouse environment. They want to compile only their modified models while using dbt's model deferral feature. When deferral is active ('--defer --state state_dir'), how does dbt handle references to unmodified upstream models during compilation?",
    codeSnippet: `dbt build --select state:modified+ --defer --state path/to/prod/manifest`,
    codeLanguage: "bash",
    options: [
      "It compiles references using the user's Dev database schema prefix, but returns mock empty datasets.",
      "It redirects references to the production database and schema specified in the state's 'manifest.json' file, avoiding duplicating build runs in the Developer's isolated target.",
      "It compiles upstream dependencies as dynamic in-line CTEs directly into the developer's downstream query.",
      "It halts execution with database privilege mismatch exceptions if the prod schema is read-only."
    ],
    correctAnswers: [1],
    explanation: "Model deferral is designed to optimize development cycles. When `--defer` and `--state` are enabled, dbt matches unmatched upstream dependencies against the production manifest. If a model hasn't been built locally in the Dev target, dbt compiles its reference targeting the Production database and schema, allowing developers to query production data for upstream inputs instantly.",
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
      "Configure a separate model named 'my_incremental_model_mock.sql' in the tests directory.",
      "Specify 'input: this' (or the self-referencing model's name) inside the 'given:' array block and provide mock rows representing the existing database records.",
      "Unit tests cannot mock self-references; these tests must be run targeting live warehouse schemas.",
      "Inject SQL CTEs using custom override parameters in 'dbt_project.yml'."
    ],
    correctAnswers: [1],
    explanation: "To test self-referencing SQL logic (such as models matching against `{{ this }}`), dbt Core unit testing permits specifying `this` as an input within the `given` array block. Developers define a mock set of rows representing the existing data in the target table, allowing compilation of logic like date calculation limits over historical rows.",
    references: "https://docs.getdbt.com/docs/build/unit-tests#mocking-this",
    dbtVersionFocus: "v1.8+ (Unit Testing self-references)"
  },
  {
    id: 26,
    category: "Develop Models",
    difficulty: "Intermediate",
    questionText: "An analytics engineer is configuring a dbt snapshot to track slow-changing dimensions (SCD Type 2) on an orders table. When using the `timestamp` strategy, what does dbt expect as the minimum model properties, and what are the generated columns added by dbt in the snapshot target table?",
    options: [
      "Requires specifying a `unique_key` and `updated_at`. The snapshot table will contain the custom model columns along with the metadata columns `dbt_valid_from`, `dbt_valid_to`, `dbt_updated_at`, and `dbt_scanned_at`.",
      "Requires writing custom UPDATE triggers at the database layer. No additional tracking columns are appended.",
      "Only requires `unique_key` and adds `dbt_is_active` as a boolean column representing current state.",
      "Requires `check_cols` specifying all values to track. dbt adds `dbt_inserted_at` and `dbt_deleted_at`."
    ],
    correctAnswers: [0],
    explanation: "Under the snapshot `timestamp` strategy, dbt requires `unique_key` to identify records and `updated_at` to detect when they have changed. dbt creates and maintains Type II slowly changing dimension tables by appending system-level tracking columns: `dbt_valid_from` (start timestamp), `dbt_valid_to` (end timestamp, null for current), `dbt_updated_at`, and `dbt_scanned_at`.",
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
    explanation: "dbt seeds are csv listings located in the local `seeds/` workspace folder. They are suitable for static lookup mappings (e.g., state codes, marketing campaign metadata) that do not require continuous updates. Because dbt compiles these internal csv rows into a series of INSERT statements during `dbt seed`, loading large files causes dramatic execution delays.",
    references: "https://docs.getdbt.com/docs/build/seeds",
    dbtVersionFocus: "Core"
  },
  {
    id: 28,
    category: "Develop Models",
    difficulty: "Intermediate",
    questionText: "A dbt project needs to write tables to isolated warehouse databases based on the active target environment. By default, dbt appends a suffix, but the developer wants to override this behavior using the dynamic macro `generate_database_name`. What is the correct pattern to ensure custom databases are respected without standard suffix concatenation?",
    options: [
      "Pass a parameter in 'dbt_project.yml' reading: 'override_database: true'.",
      "Write a custom macro in the project named `generate_database_name(custom_database_name, node)`. Inside this macro, check the value of `custom_database_name` and the current `target.name`. If a custom database is defined, return it directly instead of appending the default target suffix.",
      "Database overrides must be defined by modifying the system drivers inside the container's '/root/.dbt/profiles.yml'.",
      "Use the 'generate_schema_name' macro to dynamically override both schemas and databases in a single string returned to the engine."
    ],
    correctAnswers: [1],
    explanation: "By default, dbt concatenates the target database name to custom configurations. To override this behavior, developers replace the default macro by authoring a custom macro named `generate_database_name(custom_database_name, node)`. If target rules match or `custom_database_name` is present, it returns the customized database name directly, skipping standard suffixing.",
    references: "https://docs.getdbt.com/docs/build/custom-databases",
    dbtVersionFocus: "Core"
  },
  {
    id: 29,
    category: "Debug Data Models",
    difficulty: "Intermediate",
    questionText: "An analytics developer runs 'dbt source freshness' and gets an active failure because the raw source table freshness check crossed the error threshold. However, they verify that fresh data was loaded 10 minutes ago. What is the most likely root cause of this mismatch?",
    options: [
      "The developer specified a static timezone in profiles.yml that mismatched the local system clock.",
      "The source configuration in YAML either specified an incorrect `loaded_at_field` column name (so dbt checked system update times, or used the wrong date column), or the database system clock has a synchronization/timezone deviation when compared against the current date evaluated by dbt.",
      "Sources do not support timestamp filtering and must rely on standard sequential primary keys.",
      "The database driver was configured with `enforce_contract: true` causing source validation checks to fail."
    ],
    correctAnswers: [1],
    explanation: "Source freshness measures the difference between of the maximum value of the designated `loaded_at_field` column and the clock of the machine executing dbt. If `loaded_at_field` points to a column that isn't updated (e.g., user_birthdate instead of record_inserted_at) or if timezone mismatches (UTC vs local) exist between the warehouse timestamps and the execution agent environment, dbt records false freshness errors.",
    references: "https://docs.getdbt.com/docs/build/sources#source-freshness",
    dbtVersionFocus: "Core"
  },
  {
    id: 30,
    category: "Test and Document Models",
    difficulty: "Advanced",
    questionText: "You want to create a custom generic test named `is_even` to assert that all column values in a database are divisible by 2. How should you structure this test inside your project?",
    options: [
      "Create a custom SQL test inside the `tests/` directory named 'dim_customers_is_even.sql' referencing specific column nodes.",
      "Create a macro file inside `macros/` (e.g., `is_even.sql`) defining a macro named `test_is_even(model, column_name)`. The macro must construct a SQL SELECT statement that returns rows where the modulo calculation evaluates to a non-zero value.",
      "Configure a custom generic test inside standard 'dbt_project.yml' using JSON schemas.",
      "Generic tests cannot be customized; you must use third-party plugins or singular tests exclusively."
    ],
    correctAnswers: [1],
    explanation: "In dbt, a custom generic test is declared as a reusable macro prefixed with `test_` (like `test_is_even`). It accepts parameters `model` and `column_name`. The compiled SELECT query must target the test rows that violate the constraint: returning any non-even rows. If any row is returned by the compiled query, the test fails during `dbt test`.",
    references: "https://docs.getdbt.com/docs/build/data-tests#generic-data-tests",
    dbtVersionFocus: "Core"
  },
  {
    id: 31,
    category: "Deploy dbt Projects",
    difficulty: "Intermediate",
    questionText: "An analytics engineer completes code changes for a single downstream model named `fct_user_retention`. They want to compile, run, and replace this model inside the database but skip compiling and executing any matching column assertions or source validation tests. Which command performs this isolated operation?",
    options: [
      "dbt build --select fct_user_retention --exclude-tests",
      "dbt run --select fct_user_retention",
      "dbt test --select fct_user_retention --skip-asserts",
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
      "Create a separate document under target/manifest.json manually using REST APIs."
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
    questionText: "A dbt run fails with a compiler error: 'Compilation Error: Found a cyclic dependency between dim_customers and fct_orders.' How does this error occur in dbt projects, and how should it be corrected?",
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
      "Change the database driver configurations inside profiles.yml to ignore all warning constraints.",
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
      "Configure standard SQL views to execute in series using macro call chains inside raw profiles.yml.",
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
  }
];
