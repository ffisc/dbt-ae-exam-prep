import { Question } from "./types";

export const examQuestions: Question[] = [
  {
    id: 1,
    category: "Managing dbt models governance",
    difficulty: "Advanced",
    questionText: "An analytics engineer is setting up a dbt Mesh architecture. A downstream project is attempting to reference `fct_orders` from an upstream `core_project` as shown in the query below. What is the minimum configuration required in the upstream project's schema file to allow this cross-project reference and ensure downstream compilation succeeds?",
    codeSnippet: `-- In downstream marketing project (models/marts/fct_marketing.sql)
select * from {{ ref('core_project', 'fct_orders') }}`,
    codeLanguage: "sql",
    options: [
      "Set `access: protected` on the model.",
      "Set `access: public` on the model.",
      "Set `access: global` on the model.",
      "Set `access: private` on the model."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nA model referenced from another project must have `access: public`. That is the only model-level setting needed; contracts are recommended for public models but not required.\n\nINCORRECT COMPETING OPTIONS:\n- `access: protected`: protected models can only be referenced from the same project.\n- `access: global`: `global` is not a valid value for `access`; the valid values are `private`, `protected` and `public`.\n- `access: private`: private models can only be referenced from the same group.",
    references: "https://docs.getdbt.com/docs/mesh/govern/model-access",
    dbtVersionFocus: "v1.7+ (dbt Mesh)"
  },
  {
    id: 2,
    category: "Managing dbt models governance",
    difficulty: "Intermediate",
    questionText: "Which of the following describes the correct syntactical pattern for enforcing a model contract on a PostgreSQL SQL model inside its YAML definition file?",
    options: [
      "Set `contract: true` on the model, and let dbt infer the column data types.",
      "Set `contract: {enforced: true}` and declare a `data_type` for each column.",
      "Declare `constraints` only in the model's SQL file, because contracts ignore YAML.",
      "Set `contracts: enforced: true` under `models:` in `dbt_project.yml` and omit the column definitions."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nA contract is enabled with `contract: {enforced: true}` in the model's YAML configuration. dbt then compares the columns and data types the query returns with the YAML, so every column must be listed with a `data_type`.\n\nINCORRECT COMPETING OPTIONS:\n- `contract: true`: `contract` takes a dictionary with an `enforced` key, and the column definitions cannot be omitted when the contract is enforced.\n- Constraints only in the SQL file: constraints and data types are declared in the YAML properties, not in the SQL file.\n- `contracts: enforced: true` in `dbt_project.yml`: there is no `contracts` key, and an enforced contract still needs a `data_type` for each column.",
    references: "https://docs.getdbt.com/docs/collaborate/govern/model-contracts",
    dbtVersionFocus: "v1.5+ (Model Contracts)"
  },
  {
    id: 3,
    category: "Managing dbt models governance",
    difficulty: "Advanced",
    questionText: "An analytics team needs to introduce a breaking schema change to an established model named `dim_users` while keeping the old schema active for old downstream nodes. They decide to use model versioning. They designate file names as `dim_users_v1.sql` and `dim_users_v2.sql`. What is the correct YAML pattern in their model schema definition to complete this version configuration?",
    options: [
      "Define one model entry for each file, named `dim_users_v1` and `dim_users_v2`.",
      "Define one `dim_users` model with `latest_version` and `versions` for `v: 1` and `v: 2`.",
      "Set `version: 1` and `version: 2` in the config of two files that are both named `dim_users.sql`.",
      "Define one `dim_users` model with `latest_version` only and let dbt detect the `_v` file suffixes."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nVersions are declared under a single model entry named `dim_users`. The `versions` list holds one item per version (`v: 1`, `v: 2`), `latest_version` sets which one an unversioned `ref` resolves to, and by default each version reads from `dim_users_v<version>.sql`.\n\nINCORRECT COMPETING OPTIONS:\n- One model entry per file: this creates two unrelated models instead of two versions of `dim_users`, so `ref('dim_users', v=1)` has nothing to resolve.\n- `version` in the config of two `dim_users.sql` files: two files in a project cannot share a model name, and versions are declared in YAML, not in the SQL config.\n- `latest_version` without `versions`: dbt only knows which versions exist from the `versions` list, so the file suffixes alone declare nothing.",
    references: "https://docs.getdbt.com/docs/collaborate/govern/model-versions",
    dbtVersionFocus: "v1.6+ (Model Versioning)"
  },
  {
    id: 4,
    category: "Implementing dbt tests",
    difficulty: "Intermediate",
    questionText: "In dbt Core v1.8+, unit testing allows analytics engineers to validate model SQL logic using static mock data. For the `dim_customers.sql` model shown below, which structure correctly declares this unit test in a schema `.yml` file?",
    codeSnippet: `-- models/marts/dim_customers.sql
with customers as (
    select * from {{ source('jaffle_shop', 'raw_customers') }}
)
select * from customers where status = 'active'`,
    codeLanguage: "sql",
    options: [
      "A SQL file in `tests/` that selects the rows expected to fail.",
      "A `unit_tests:` entry with the `model`, `given` inputs and `expect` rows.",
      "A `{% unit_test %}` Jinja block inside the model's SQL file.",
      "A `tests:` entry on the model that sets the `given` inputs and the `expect` rows."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nUnit tests are declared under the `unit_tests:` key in a YAML file. Each one names the `model` under test, supplies mock rows for its inputs under `given` (using `source()` or `ref()`), and lists the rows the model should return under `expect`.\n\nINCORRECT COMPETING OPTIONS:\n- SQL file in `tests/`: that is a singular data test, which runs against real warehouse data and does not use mock inputs.\n- `{% unit_test %}` Jinja block: dbt has no such block; unit tests are not defined inside the model's SQL file.\n- `tests:` entry with `given` and `expect`: `given` and `expect` are only valid inside a `unit_tests:` entry, not in a generic data test definition.",
    references: "https://docs.getdbt.com/docs/build/unit-tests",
    dbtVersionFocus: "v1.8+ (Unit Testing)"
  },
  {
    id: 5,
    category: "Developing and optimizing dbt models",
    difficulty: "Advanced",
    questionText: "Based on the semantic model configuration below, you need to configure a metric that computes the average order value (AOV) as `total_revenue` divided by `distinct_orders`. Which approach defines this metric in your schema file?",
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
      "Define one `simple` metric with `measure: total_revenue / distinct_orders`.",
      "Define a `ratio` metric with `numerator` and `denominator` set to simple metrics on each measure.",
      "Define a `cumulative` metric with `total_revenue` as the measure and `distinct_orders` as the `window`.",
      "Define a `conversion` metric with `total_revenue` as the `base_measure` and `distinct_orders` as the `conversion_measure`."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nMetrics are declared under the top-level `metrics:` key. Each measure is exposed through a `simple` metric, and a `ratio` metric then divides one metric by another through `numerator` and `denominator`.\n\nINCORRECT COMPETING OPTIONS:\n- One `simple` metric with a division in `measure`: a `simple` metric points to a single measure and cannot hold an expression.\n- `cumulative` metric with `window`: it accumulates one measure over time, and `window` takes a time span, not a measure.\n- `conversion` metric: it measures how often a base event leads to a conversion event, which is not a division of two measures.",
    references: "https://docs.getdbt.com/docs/build/about-metricflow",
    dbtVersionFocus: "v1.6+ (Semantic Layer / MetricFlow)"
  },
  {
    id: 6,
    category: "Leveraging the dbt state",
    difficulty: "Advanced",
    questionText: "An organization is deploying a Slim CI pipeline to prevent redundant warehouse runs. The pipeline compiles and runs only models that have changed and their downstream dependents. They also want unchanged upstream nodes to be resolved from the latest production run. Which CLI invocation accomplishes this Slim CI run?",
    options: [
      "`dbt run --select state:new+ --defer --state path/to/prod/artifacts`",
      "`dbt build --select state:modified+ --defer --state path/to/prod/artifacts`",
      "`dbt build --select state:modified+ --state path/to/prod/artifacts`",
      "`dbt run --select state:modified --defer --state path/to/prod/artifacts`"
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\n`state:modified+` selects the changed nodes and everything downstream of them, and `--state` points to the production artifacts that dbt compares against. `--defer` makes dbt resolve unchanged upstream nodes to the production relations instead of building them.\n\nINCORRECT COMPETING OPTIONS:\n- `state:new+`: `state:new` selects only nodes that did not exist in the production manifest, so modified models are left out.\n- Omitting `--defer`: without it, references to unbuilt upstream nodes point to the development schema, where those relations do not exist.\n- `state:modified` without `+`: it selects only the changed nodes and leaves their downstream dependents out of the run.",
    references: "https://docs.getdbt.com/docs/deploy/continuous-integration",
    dbtVersionFocus: "Core (All versions, updated in 1.7)"
  },
  {
    id: 7,
    category: "Developing and optimizing dbt models",
    difficulty: "Advanced",
    questionText: "The `microbatch` incremental strategy in dbt Core processes high-volume event tables batch by batch. Which statement is correct about how it filters source records and structures the compiled query?",
    codeSnippet: `{{ config(
    materialized='incremental',
    incremental_strategy='microbatch',
    event_time='payment_date',
    batch_size='day',
    begin='2024-01-01',
    lookback=3
) }}

select * from {{ ref('stg_payments') }}`,
    codeLanguage: "sql",
    options: [
      "The model must include an `is_incremental()` filter, or each batch scans the full source table.",
      "dbt filters each batch on the inputs that set `event_time`, so no `is_incremental()` filter is needed.",
      "dbt runs one query for the whole lookback window and the model must filter `payment_date` itself.",
      "dbt applies the batch filter only to `source()` inputs, so a `ref()` input is always read in full."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nWith `microbatch`, dbt runs one query per batch and adds the time filter on `event_time` to the inputs that have an `event_time` configured. The model SQL stays a plain `select`, with no `is_incremental()` block or manual date filter.\n\nINCORRECT COMPETING OPTIONS:\n- Required `is_incremental()` filter: `microbatch` does not use `is_incremental()`, because dbt applies the batch boundaries itself.\n- One query for the whole lookback window: dbt runs a separate query for each batch in the window, not a single query.\n- Filter only on `source()` inputs: dbt filters `ref()` inputs as well, as long as the referenced model has an `event_time` configured.",
    references: "https://docs.getdbt.com/docs/build/incremental-strategy#microbatch",
    dbtVersionFocus: "v1.9+ (Microbatch Incremental Strategy)"
  },
  {
    id: 8,
    category: "Debugging data modeling errors",
    difficulty: "Advanced",
    questionText: "In a multi-project dbt Mesh setup, a downstream marketing project references `fct_earnings` from the upstream core finance project, and compilation fails because the model cannot be referenced across projects. The model's properties in the upstream project are shown below. What is the most likely cause?",
    codeSnippet: `# core_finance project: models/marts/_marts.yml
models:
  - name: fct_earnings
    description: "Recognized earnings per account and month"
    config:
      materialized: view
    columns:
      - name: account_id
      - name: earnings_month
      - name: earnings_amount`,
    codeLanguage: "yaml",
    options: [
      "`fct_earnings` is materialized as a view, and cross-project refs require tables.",
      "`fct_earnings` does not have `access: public` in the upstream project.",
      "`fct_earnings` has no `group` assigned in the upstream project.",
      "The downstream project does not set `access: public` in its own `dbt_project.yml`."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nOnly models with `access: public` can be referenced from another project. `fct_earnings` sets no `access`, so it gets the default, `protected`, which limits references to its own project. Setting `access: public` on the model in the upstream project allows the cross-project reference.\n\nINCORRECT COMPETING OPTIONS:\n- View materialization: a public model can be materialized as a view, and the failure is about access, not materialization.\n- Missing `group`: a `group` is not required for a model to be public.\n- `access: public` in the downstream project: `access` is set on the model being referenced, so the downstream project's own configuration does not change it.",
    references: "https://docs.getdbt.com/docs/mesh/govern/model-access",
    dbtVersionFocus: "v1.7+ (dbt Mesh)"
  },
  {
    id: 9,
    category: "Debugging data modeling errors",
    difficulty: "Intermediate",
    questionText: "An analytics engineer runs `dbt run` and it fails with the error below. Which change resolves it?",
    codeSnippet: `Compilation Error
  dbt found two resources with the database representation "analytics.dim_products".
  dbt cannot create two resources with identical database representations. To fix this,
  change the configuration of one of these resources:
  - model.shop.dim_products (models/marts/dim_products.sql)
  - model.shop.dim_products_legacy (models/legacy/dim_products_legacy.sql)`,
    codeLanguage: "text",
    options: [
      "Set a different `alias` on one of the two models.",
      "Set `full_refresh: true` on one of the two models.",
      "Set `materialized: view` on one of the two models.",
      "Set `on_schema_change: sync_all_columns` on one of the two models."
    ],
    correctAnswers: [0],
    explanation: "CORRECT ACTION:\nThe error means two dbt resources resolve to the same database, schema and identifier. A model's identifier comes from its `alias`, so giving one of the two models a different `alias` (or schema) makes the relations distinct.\n\nINCORRECT COMPETING OPTIONS:\n- `full_refresh: true`: this controls whether dbt rebuilds the model from scratch, and both models still resolve to the same relation.\n- `materialized: view`: the materialization does not change the relation name, so both models still resolve to `analytics.dim_products`.\n- `on_schema_change: sync_all_columns`: this setting handles column changes in incremental models, not two resources sharing one relation name.",
    references: "https://docs.getdbt.com/docs/build/materializations",
    dbtVersionFocus: "Core"
  },
  {
    id: 10,
    category: "Developing and optimizing dbt models",
    difficulty: "Advanced",
    questionText: "Models in `models/marketing/` set `+schema: marketing`, and the project uses the built-in `generate_schema_name`. They currently build in the schemas shown below. You want them built in `marketing` in production and in the developer's own target schema, such as `dbt_alice`, in development. Which approach achieves this?",
    codeSnippet: `# dbt_project.yml
models:
  shop:
    marketing:
      +schema: marketing

# Schemas built today
# target   target.schema   models/marketing builds in
# dev      dbt_alice       dbt_alice_marketing
# prod     analytics       analytics_marketing`,
    codeLanguage: "yaml",
    options: [
      "Set a different `schema` for each target in `profiles.yml`, because `generate_schema_name` cannot be overridden.",
      "Override `generate_schema_name` to return `custom_schema_name` when `target.name` is `prod` and `target.schema` otherwise.",
      "Override `generate_database_name` to return `custom_schema_name` when `target.name` is `prod` and `target.schema` otherwise.",
      "Keep the default `generate_schema_name` and set `+schema` in `dbt_project.yml`, which uses `custom_schema_name` alone in prod."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nThe `generate_schema_name` macro controls the schema of each model, and a macro with that name in the project overrides the built-in one. Checking `target.name` lets it return `custom_schema_name` in production and `target.schema` in every other target.\n\nINCORRECT COMPETING OPTIONS:\n- Per-target `schema` in `profiles.yml`: this only sets the default schema of a target, and `generate_schema_name` can be overridden in a project macro.\n- Overriding `generate_database_name`: that macro controls the database a model is built in, not its schema.\n- Default macro with `+schema`: the default macro appends `custom_schema_name` to `target.schema` in every environment, including production.",
    references: "https://docs.getdbt.com/docs/build/custom-schemas",
    dbtVersionFocus: "Core"
  },
  {
    id: 11,
    category: "Implementing dbt tests",
    difficulty: "Intermediate",
    questionText: "An analytics engineer has set up both generic column tests and the new dbt v1.8 unit tests on their models. They want to execute ONLY the unit tests across their entire project to keep build cycles rapid during development. Which command correctly performs this filtered execution?",
    options: [
      "`dbt test --select \"test_name:unit\"`",
      "`dbt test --select \"tag:unit\"`",
      "`dbt test --select \"test_type:unit\"`",
      "`dbt test --select \"resource_type:unit\"`"
    ],
    correctAnswers: [2],
    explanation: "CORRECT ACTION:\nThe `test_type` method selects tests by their type: `unit` for unit tests, and `data`, `generic` or `singular` for data tests. `dbt test --select \"test_type:unit\"` runs the unit tests and nothing else.\n\nINCORRECT COMPETING OPTIONS:\n- `test_name:unit`: `test_name` selects data tests by the name of the generic test that defines them, such as `unique` or `not_null`, so it does not select unit tests.\n- `tag:unit`: this selects only resources that have the tag `unit`, whatever kind of test or model they are.\n- `resource_type:unit`: `unit` is not a resource type; the resource type of a unit test is `unit_test`.",
    references: "https://docs.getdbt.com/docs/build/unit-tests#running-unit-tests",
    dbtVersionFocus: "v1.8+ (Unit Testing)"
  },
  {
    id: 12,
    category: "Developing and optimizing dbt models",
    difficulty: "Advanced",
    questionText: "An analytics engineer is running a targeted historical backfill of a model configured with the dbt Core v1.11 `microbatch` incremental strategy. How can the developer restrict the backfill to a specific historical date range (e.g. May 10th to May 15th 2026) without editing the SQL model configuration?",
    codeSnippet: `dbt build --select my_microbatch_model ... (What flags go here?)`,
    codeLanguage: "bash",
    options: [
      "Pass `--vars` with a start and end date and filter on them with `var()` in the model.",
      "Pass `--event-time-start 2026-05-10 --event-time-end 2026-05-15` to the command.",
      "Pass `--batch-start 2026-05-10` and `--batch-end 2026-05-15` to the command.",
      "Pass `--full-refresh` with `--lookback 5` to rebuild the last five batches."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\n`--event-time-start` and `--event-time-end` set the time range of a `microbatch` run on the command line. dbt then runs only the batches that fall inside that range, so no change to the model is needed.\n\nINCORRECT COMPETING OPTIONS:\n- `--vars` with `var()`: this needs a manual date filter written into the model, and `microbatch` does not read these variables to pick batches.\n- `--batch-start` and `--batch-end`: these flags do not exist in dbt.\n- `--full-refresh` with `--lookback`: `lookback` is a model configuration, not a command-line flag, and `--full-refresh` rebuilds every batch.",
    references: "https://docs.getdbt.com/docs/build/incremental-strategy#microbatch",
    dbtVersionFocus: "v1.9+ (Microbatch Incremental Strategy)"
  },
  {
    id: 13,
    category: "Implementing and maintaining external dependencies",
    difficulty: "Basic",
    questionText: "To monitor raw data feeds arriving from an external pipeline, you want dbt to alert you if a table has not been updated in the last 24 hours. Where and how should this be configured?",
    options: [
      "Add `freshness` with `error_after` of 24 hours to the source table and run `dbt run`.",
      "Add `freshness` and a `loaded_at_field` to the source table and run `dbt source freshness`.",
      "Set `error_after` of 24 hours for the source in `dbt_project.yml` and run `dbt test`.",
      "Set `loaded_at_field` on the source table, which makes `dbt run` fail on data older than 24 hours."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nFreshness is configured on the source table with `freshness` thresholds and a `loaded_at_field`. The command `dbt source freshness` compares the latest `loaded_at_field` value with the current time and warns or errors when a threshold is exceeded.\n\nINCORRECT COMPETING OPTIONS:\n- `freshness` checked by `dbt run`: `dbt run` builds models and does not evaluate source freshness.\n- Threshold in `dbt_project.yml` checked by `dbt test`: `dbt test` runs data and unit tests, and freshness is only evaluated by `dbt source freshness`.\n- `loaded_at_field` alone: this field only names the timestamp column, and without `freshness` thresholds and `dbt source freshness` nothing is checked or failed.",
    references: "https://docs.getdbt.com/docs/build/sources#source-freshness",
    dbtVersionFocus: "Core"
  },
  {
    id: 14,
    category: "Managing dbt models governance",
    difficulty: "Advanced",
    questionText: "An analytics engineer has configured a model using versioning. To help clean up deprecation lifecycles, they want to send warnings to downstream developers trying to reference the older version `v1` of the model `dim_vendor`. Which YAML configuration completes this deprecation pattern?",
    codeSnippet: `models:
  - name: dim_vendor
    latest_version: 2
    versions:
      - v: 1
      - v: 2`,
    codeLanguage: "yaml",
    options: [
      "Set `deprecation_date: 2026-06-01` on the `v: 1` entry in `versions`.",
      "Set `deprecated: true` on the `v: 1` entry in `versions`.",
      "Set `enabled: false` on the `v: 1` entry in `versions`.",
      "Set `latest_version: 2`, which makes dbt warn on any reference to `v: 1`."
    ],
    correctAnswers: [0],
    explanation: "CORRECT ACTION:\nThe `deprecation_date` property on a version entry sets the date after which that version counts as deprecated, and dbt notifies consumers that the version is slated for deprecation.\n\nINCORRECT COMPETING OPTIONS:\n- `deprecated: true`: `deprecated` is not a property of a version entry.\n- `enabled: false`: this disables the version, so references to it fail instead of producing a warning.\n- `latest_version: 2`: this only sets which version an unversioned `ref` resolves to, and it does not warn on references to `v: 1`.",
    references: "https://docs.getdbt.com/docs/collaborate/govern/model-versions#deprecating-a-version",
    dbtVersionFocus: "v1.6+ (Model Versioning)"
  },
  {
    id: 15,
    category: "Leveraging the dbt state",
    difficulty: "Advanced",
    questionText: "In a dbt Mesh setup, which statement correctly describes how dbt Catalog visualizes downstream cross-project relationships?",
    options: [
      "dbt Catalog shows lineage for one project at a time and never displays another project's models.",
      "dbt Catalog shows downstream projects that reference an upstream project's public models in the lineage.",
      "dbt Catalog shows cross-project lineage only for upstream models that use `access: private`.",
      "dbt Catalog shows cross-project lineage only when downstream projects declare the upstream models as `sources`."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\ndbt Catalog builds lineage from the metadata of each project's runs. Because cross-project `ref` is only allowed on public models, Catalog can show the downstream projects that reference an upstream project's public models in the same lineage graph.\n\nINCORRECT COMPETING OPTIONS:\n- One project at a time: Catalog supports cross-project lineage for projects connected through dbt Mesh.\n- Only `access: private` models: private models cannot be referenced from other projects, so there is no cross-project lineage for them.\n- Only when declared as `sources`: cross-project lineage comes from `ref` to public models, not from source declarations.",
    references: "https://docs.getdbt.com/docs/collaborate/explore-projects",
    dbtVersionFocus: "dbt Cloud & Explorer (2026 Updates)"
  },
  {
    id: 16,
    category: "Developing and optimizing dbt models",
    difficulty: "Intermediate",
    questionText: "In dbt project setups, variable precedence controls how parameters are loaded. Which configuration takes priority if a variable named `source_database` is declared both inside `dbt_project.yml` and specified as a command-line argument?",
    codeSnippet: `In dbt_project.yml:
vars:
  source_database: "raw_sales_prod"

CLI Call:
dbt run --vars '{"source_database": "raw_sales_dev"}'`,
    codeLanguage: "bash",
    options: [
      "The `dbt_project.yml` value is used, because project-level `vars` override command-line values.",
      "dbt raises a compilation error, because `source_database` is defined in two places.",
      "The `--vars` value is used, and it overrides the `dbt_project.yml` value.",
      "The `--vars` value is used only for `dbt compile`, and `dbt run` reads `dbt_project.yml`."
    ],
    correctAnswers: [2],
    explanation: "CORRECT ACTION:\nVariables passed with `--vars` on the command line take precedence over variables set in `dbt_project.yml`. The value in `dbt_project.yml` acts as a default that the command line can replace.\n\nINCORRECT COMPETING OPTIONS:\n- `dbt_project.yml` value wins: it is the other way round, the command-line value overrides the project default.\n- Compilation error: defining a variable in both places is valid, and dbt resolves it by precedence.\n- `--vars` only for `dbt compile`: `--vars` applies to every command that renders Jinja, including `dbt run`.",
    references: "https://docs.getdbt.com/docs/build/project-variables",
    dbtVersionFocus: "Core"
  },
  {
    id: 17,
    category: "Managing dbt models governance",
    difficulty: "Advanced",
    questionText: "Your organization uses dbt groups and model access. The finance model `fct_salary` is configured as shown below. Which models can reference `fct_salary` with `{{ ref() }}`?",
    codeSnippet: `models:
  - name: fct_salary
    config:
      group: internal_finance
      access: private`,
    codeLanguage: "yaml",
    options: [
      "Any model in the same project can reference it, whatever its group.",
      "Only models in the same group as `fct_salary` can reference it.",
      "Only models in the same folder as `fct_salary` can reference it.",
      "Only models in downstream projects can reference it through `ref`."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nA `private` model can only be referenced by models in the same group. Since `fct_salary` belongs to `internal_finance`, only models in that group can use `ref('fct_salary')`.\n\nINCORRECT COMPETING OPTIONS:\n- Any model in the same project: this is how `protected` works, while `private` narrows access to the group.\n- Models in the same folder: access is controlled by group membership, and folder location has no effect.\n- Models in other projects: a group belongs to one project, and cross-project references require `access: public`.",
    references: "https://docs.getdbt.com/docs/mesh/govern/model-access",
    dbtVersionFocus: "v1.7+ (dbt Mesh & Groups)"
  },
  {
    id: 18,
    category: "Implementing dbt tests",
    difficulty: "Basic",
    questionText: "What is the key difference between generic tests and singular tests in `dbt test` suites?",
    options: [
      "Generic tests are SQL files in `tests/` that return failing rows, while singular tests are declared in YAML.",
      "Singular tests are SQL files in `tests/`, while generic tests are parameterized tests applied in YAML.",
      "Generic tests run with `dbt test`, while singular tests run only with `dbt build`.",
      "Singular tests run only in dbt Cloud, while generic tests run in dbt Core and dbt Cloud."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nA singular test is a standalone SQL file in the `tests/` directory that fails when its query returns rows. A generic test is a reusable, parameterized test, such as `unique` or `not_null`, that is applied to models and columns in YAML.\n\nINCORRECT COMPETING OPTIONS:\n- Roles swapped: the description of a singular test is assigned to generic tests, and generic tests are not stored in `tests/` as standalone queries.\n- Singular tests only with `dbt build`: `dbt test` runs both generic and singular tests.\n- Singular tests only in dbt Cloud: singular tests run in dbt Core as well.",
    references: "https://docs.getdbt.com/docs/build/data-tests",
    dbtVersionFocus: "Core (Slight terminology updates in v1.8, calling them 'data tests')"
  },
  {
    id: 19,
    category: "Developing and optimizing dbt models",
    difficulty: "Intermediate",
    questionText: "An analytics engineer sets up a model materialized as `ephemeral`. A downstream model references this ephemeral node twice. During database operation execution, how does dbt translate this interaction under compilation?",
    codeSnippet: `{{ config(materialized='ephemeral') }}
select * from {{ ref('raw_source') }}`,
    codeLanguage: "sql",
    options: [
      "dbt creates a temporary table for the model and drops it after the run.",
      "dbt inlines the model's SQL as a CTE in the referencing model's query.",
      "dbt creates a view for the model and reuses it for both references.",
      "dbt fails compilation, because an ephemeral model cannot be referenced twice."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nAn `ephemeral` model is not built in the warehouse. dbt interpolates its SQL as a common table expression in the compiled query of the model that references it, and that one CTE serves both references.\n\nINCORRECT COMPETING OPTIONS:\n- Temporary table: ephemeral models create no objects in the warehouse, temporary or otherwise.\n- View reused by both references: no view is created, and the SQL is inlined instead.\n- Compilation failure on a double reference: an ephemeral model can be referenced any number of times.",
    references: "https://docs.getdbt.com/docs/build/materializations#ephemeral",
    dbtVersionFocus: "Core"
  },
  {
    id: 20,
    category: "Developing and optimizing dbt models",
    difficulty: "Basic",
    questionText: "A scheduled job must run `dbt build`, `dbt clean` and `dbt deps` so that each run starts without stale artifacts and builds with the packages listed in `packages.yml`. The project's `dbt_project.yml` sets `clean-targets: [target, dbt_packages]`. In which order should the job run the three commands?",
    options: [
      "`dbt clean` -> `dbt build` -> `dbt deps`",
      "`dbt clean` -> `dbt deps` -> `dbt build`",
      "`dbt deps` -> `dbt clean` -> `dbt build`",
      "`dbt build` -> `dbt deps` -> `dbt clean`"
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\n`dbt clean` deletes the folders listed in `clean-targets`, here `target/` and `dbt_packages/`. `dbt deps` then installs the packages from `packages.yml`, and `dbt build` runs the models, tests, seeds and snapshots with those packages available.\n\nINCORRECT COMPETING OPTIONS:\n- `dbt build` right after `dbt clean`: `dbt clean` has just deleted `dbt_packages/`, so the build fails if the project uses any package.\n- `dbt deps` before `dbt clean`: with `dbt_packages` in `clean-targets`, `dbt clean` removes the packages that were just installed.\n- `dbt build` before `dbt deps`: the build runs before the packages are installed, so it fails if the project uses any package.",
    references: "https://docs.getdbt.com/reference/dbt-commands",
    dbtVersionFocus: "Core"
  },
  {
    id: 21,
    category: "Managing dbt models governance",
    difficulty: "Advanced",
    questionText: "When an analytics engineer enforces a model contract with `contract: { enforced: true }`, how does dbt handle situations where the SQL SELECT query's returned columns do not align exactly with the declared columns and data types inside the schema YAML file?",
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
      "dbt completes the build and prints a warning for the mismatched columns.",
      "dbt fails the run with an error before the model is built in the warehouse.",
      "dbt alters the target table so that it matches the columns the query returns.",
      "dbt builds the model with only the columns that match the declared contract."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nWith an enforced contract, dbt compares the column names and data types returned by the model's query against the ones declared in the YAML. If they do not match, dbt raises an error and the model is not built, so a breaking change never reaches the warehouse.\n\nINCORRECT COMPETING OPTIONS:\n- Warning and a completed build: an enforced contract turns a mismatch into an error, not a warning.\n- Altering the target table to match the query: dbt does not rewrite the table to follow the query output; the declared contract is what the query must follow.\n- Building only the matching columns: dbt does not drop columns from the query to fit the contract.",
    references: "https://docs.getdbt.com/docs/collaborate/govern/model-contracts",
    dbtVersionFocus: "v1.5+ (Model Contracts)"
  },
  {
    id: 22,
    category: "Developing and optimizing dbt models",
    difficulty: "Advanced",
    questionText: "You want a Semantic Layer metric that measures how many users who sign up go on to make a purchase within seven days of signing up. Which YAML structure defines this metric?",
    options: [
      "Set `type: ratio` and define `numerator` and `denominator` measures with a `window` of 7 days.",
      "Set `type: conversion` with `entity`, `base_measure` and `conversion_measure` in `conversion_type_params`.",
      "Set `type: cumulative` and define a `measure` with a `window` under `cumulative_type_params`.",
      "Set `type: simple` and define `base_measure` and `conversion_measure` directly under `type_params`."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nA conversion metric uses `type: conversion`. Its `type_params` hold a `conversion_type_params` block with the `base_measure` (the initial event), the `conversion_measure` (the event to count as a conversion) and an optional `window` limiting how long after the base event a conversion counts.\n\nINCORRECT COMPETING OPTIONS:\n- Ratio metric with numerator and denominator: a `ratio` metric divides one measure by another and does not link a base event to a later conversion event.\n- Cumulative metric with a window: a `cumulative` metric accumulates one measure over a period and has no base and conversion events.\n- Simple metric with conversion measures: a `simple` metric references a single measure, and `base_measure` and `conversion_measure` are only valid inside `conversion_type_params`.",
    references: "https://docs.getdbt.com/docs/build/conversion",
    dbtVersionFocus: "v1.11+ (Semantic Layer Conversion Metrics)"
  },
  {
    id: 23,
    category: "Managing dbt models governance",
    difficulty: "Advanced",
    questionText: "How does a downstream dbt project declare its reliance on an upstream project's public models instead of installing the upstream code as a package?",
    options: [
      "Declare the upstream project in `dependencies.yml` and use `ref('core_finance', 'fct_revenues')`.",
      "Add the upstream project to `packages.yml` and call `ref('fct_revenues')` in the downstream model.",
      "Define the upstream models in `sources.yml` and call `source('core_finance', 'fct_revenues')`.",
      "Set the upstream project name under `vars` in `dbt_project.yml` and call `var('core_finance')`."
    ],
    correctAnswers: [0],
    explanation: "CORRECT ACTION:\nIn dbt Mesh, a downstream project lists the upstream project as a project dependency instead of importing its code. It can then reference the upstream project's public models with the two-argument form `ref('core_finance', 'fct_revenues')`, using the upstream metadata rather than a local copy of its code.\n\nINCORRECT COMPETING OPTIONS:\n- Adding the project to `packages.yml`: a package downloads the upstream code and compiles its models inside the downstream project, which is the duplication Mesh avoids.\n- Defining the models in `sources.yml`: sources describe raw tables and give no cross-project lineage or governance for models.\n- Setting a variable under `vars`: variables hold values for Jinja, they do not declare project dependencies or make models referenceable.",
    references: "https://docs.getdbt.com/docs/mesh/govern/project-dependencies",
    dbtVersionFocus: "v1.6+ (dbt Mesh Project Dependencies)"
  },
  {
    id: 24,
    category: "Leveraging the dbt state",
    difficulty: "Advanced",
    questionText: "An analytics engineer is deploying models in an isolated Dev warehouse environment. They want to compile only their modified models while using dbt's model deferral feature. None of the unmodified upstream models has been built in the Dev schema. When deferral is active (`--defer --state state_dir`), how does dbt handle references to unmodified upstream models during compilation?",
    options: [
      "It builds the unmodified upstream models in the Dev schema before compiling the modified models.",
      "It resolves them to the relations in the state `manifest.json`, typically in production.",
      "It compiles the unmodified upstream models as ephemeral CTEs inside the downstream query.",
      "It raises an error unless the upstream models already exist in the Dev schema."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nWhen `--defer` is used with `--state`, dbt looks up the unselected upstream models in the state `manifest.json`. A model that does not exist in the current target is resolved to the relation recorded in that manifest, typically the production table, so the developer does not rebuild the whole upstream DAG.\n\nINCORRECT COMPETING OPTIONS:\n- Building the upstream models in Dev first: deferral exists to avoid building them, and dbt only builds the nodes that were selected.\n- Compiling upstream models as ephemeral CTEs: only models materialized as `ephemeral` are inlined as CTEs, and deferral does not change a model's materialization.\n- Erroring unless the upstream models exist in Dev: the missing upstream relations are exactly what deferral replaces with the state relations.",
    references: "https://docs.getdbt.com/reference/node-selection/defer",
    dbtVersionFocus: "v1.11+ (Deferral optimization)"
  },
  {
    id: 25,
    category: "Implementing dbt tests",
    difficulty: "Advanced",
    questionText: "A developer writes a dbt unit test for the incremental branch of the model below. What is the correct way to supply mock rows for the rows already in the table?",
    codeSnippet: `-- models/my_incremental_model.sql
{{ config(materialized='incremental', unique_key='event_id') }}

select * from {{ ref('stg_events') }}
{% if is_incremental() %}
where event_at > (select max(event_at) from {{ this }})
{% endif %}`,
    codeLanguage: "sql",
    options: [
      "Add a `given` input of `ref('my_incremental_model')` with rows for the existing table.",
      "Add a `given` input named `this` with rows representing the existing table.",
      "Add an `expect` block with rows representing the existing table.",
      "Add `is_incremental: false` under `overrides.macros` so the model does not read `this`."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nA unit test mocks the current state of an incremental model by adding a `given` input named `this` and listing the rows that already exist in the table. To exercise the incremental branch, the test also sets the `is_incremental` macro override to `true`.\n\nINCORRECT COMPETING OPTIONS:\n- `ref` to the model itself as an input: a model cannot `ref` itself, so a self-reference is mocked with `this`.\n- Rows in an `expect` block: `expect` holds the output the test asserts, not the existing data the model reads.\n- Overriding `is_incremental` to false: this removes the incremental filter, so the test never uses the prior table state it is meant to mock.",
    references: "https://docs.getdbt.com/docs/build/unit-tests#mocking-this",
    dbtVersionFocus: "v1.8+ (Unit Testing self-references)"
  },
  {
    id: 26,
    category: "Developing and optimizing dbt models",
    difficulty: "Intermediate",
    questionText: "An analytics engineer is configuring a `dbt snapshot` to track slow-changing dimensions (SCD Type 2) on an orders table. When using the `timestamp` strategy, what does dbt expect as the minimum model properties, and what are the generated columns added by dbt in the snapshot target table?",
    options: [
      "Requires `unique_key` and `updated_at`; dbt adds `dbt_scd_id`, `dbt_updated_at`, `dbt_valid_from` and `dbt_valid_to`.",
      "Requires `unique_key` and `check_cols`; dbt adds `dbt_scd_id`, `dbt_updated_at`, `dbt_valid_from` and `dbt_valid_to`.",
      "Requires only `unique_key`; dbt adds `dbt_scd_id`, `dbt_updated_at`, `dbt_valid_from` and `dbt_valid_to`.",
      "Requires only `updated_at`; dbt adds `dbt_scd_id`, `dbt_updated_at`, `dbt_valid_from` and `dbt_valid_to`."
    ],
    correctAnswers: [0],
    explanation: "CORRECT ACTION:\nThe `timestamp` strategy needs a `unique_key` to identify each record and an `updated_at` column to detect changes. dbt adds the metadata columns `dbt_scd_id`, `dbt_updated_at`, `dbt_valid_from` and `dbt_valid_to`, where `dbt_valid_to` is null for the current row.\n\nINCORRECT COMPETING OPTIONS:\n- `unique_key` with `check_cols`: `check_cols` belongs to the `check` strategy, and the timestamp strategy relies on `updated_at`.\n- Only `unique_key`: the timestamp strategy also needs `updated_at` to detect changes.\n- Only `updated_at`: a `unique_key` is required to identify each record.",
    references: "https://docs.getdbt.com/docs/build/snapshots",
    dbtVersionFocus: "Core"
  },
  {
    id: 27,
    category: "Developing and optimizing dbt models",
    difficulty: "Basic",
    questionText: "Under what conditions is it appropriate to configure and load data using a dbt seed rather than building a model?",
    options: [
      "Seeds suit large raw data exports, since `dbt seed` loads files of any size efficiently.",
      "Seeds suit small, static CSV files such as country codes, since they are version-controlled.",
      "Seeds suit data that changes constantly, since `dbt seed` loads only the new rows each run.",
      "Seeds suit raw transactional tables, since `dbt seed` refreshes them from the source system."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nSeeds are CSV files stored in the dbt project and loaded with `dbt seed`. They fit small, static reference data such as country codes or department mappings. They are not meant for large or frequently changing data, which belongs in a source loaded by an extract and load tool.\n\nINCORRECT COMPETING OPTIONS:\n- Large raw data exports: `dbt seed` is not designed for large files, so those belong in sources.\n- Data that changes constantly: `dbt seed` reloads the whole CSV file rather than only the new rows, and frequently changing data does not suit a file in the repository.\n- Raw transactional tables: seeds read a CSV from the project and never connect to a source system.",
    references: "https://docs.getdbt.com/docs/build/seeds",
    dbtVersionFocus: "Core"
  },
  {
    id: 28,
    category: "Developing and optimizing dbt models",
    difficulty: "Intermediate",
    questionText: "A dbt project needs to write tables to different warehouse databases depending on the active target environment. Which approach customizes how dbt chooses the database for a model?",
    options: [
      "Override `generate_schema_name` in the project so that it also returns the database name.",
      "Override `generate_database_name` in the project to return `custom_database_name` when it is set.",
      "Override `generate_alias_name` in the project so that it returns the custom database name.",
      "Set `database` in each output in `profiles.yml`, since dbt then ignores any `+database` config."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\ndbt picks the database of a model with the `generate_database_name` macro. Defining a macro with that name in the project overrides the built-in one, so it can return `custom_database_name` directly when it is set, and apply any other rule based on `target.name`.\n\nINCORRECT COMPETING OPTIONS:\n- Overriding `generate_schema_name`: that macro only builds the schema name and cannot set the database.\n- Overriding `generate_alias_name`: that macro builds the relation's identifier, not its database.\n- Setting `database` in `profiles.yml`: it only sets the default database for the target, and dbt still applies a custom `+database` config on top of it.",
    references: "https://docs.getdbt.com/docs/build/custom-databases",
    dbtVersionFocus: "Core"
  },
  {
    id: 29,
    category: "Implementing and maintaining external dependencies",
    difficulty: "Intermediate",
    questionText: "An analytics developer runs `dbt source freshness` and gets an active failure because the raw source table freshness check crossed the error threshold. However, they verify that fresh data was loaded 10 minutes ago. What is the most likely root cause of this mismatch?",
    options: [
      "The command reads freshness from the `run_results.json` of the last `dbt run`.",
      "The `loaded_at_field` points to a column that the latest load did not update.",
      "The command checks the freshness of the downstream models instead of the sources.",
      "The source freshness uses the latest `dbt_updated_at` of the models built from the source."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\n`dbt source freshness` queries the maximum value of the `loaded_at_field` column and compares it with the current time. If that column is not updated by the latest load, the maximum value stays old and the source is reported as stale even though new rows arrived.\n\nINCORRECT COMPETING OPTIONS:\n- Reading `run_results.json` from the last run: the command queries the warehouse each time it runs and does not reuse earlier artifacts.\n- Checking downstream models: freshness is defined on sources and is evaluated against the source tables.\n- Using `dbt_updated_at` of downstream models: that column belongs to snapshots and plays no role in source freshness.",
    references: "https://docs.getdbt.com/docs/build/sources#source-freshness",
    dbtVersionFocus: "Core"
  },
  {
    id: 30,
    category: "Implementing dbt tests",
    difficulty: "Advanced",
    questionText: "You want to create a custom generic test named `is_even` to assert that all column values in a database are divisible by 2. How should you structure this test inside your project?",
    options: [
      "Create `is_even.sql` in `tests/` that selects the failing rows, and call it under `data_tests` in YAML.",
      "Write a `{% test is_even(model, column_name) %}` block that returns the rows where the value is odd.",
      "Write a `{% macro is_even(model, column_name) %}` that returns `true` when all values are even.",
      "Write a `{% test is_even(model, column_name) %}` block that returns the rows where the value is even."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nA custom generic test is defined with a `{% test is_even(model, column_name) %}` block in a SQL file, usually under `tests/generic` or `macros`. The query must return the rows that break the rule, here the odd values. The test fails when any row is returned.\n\nINCORRECT COMPETING OPTIONS:\n- A SQL file in `tests/` called from YAML: a SQL file in `tests/` is a singular test, which runs on its own and cannot be applied to columns in YAML.\n- A macro returning `true`: a generic test passes or fails by the number of rows its query returns, not by a boolean value.\n- A test block that returns the even rows: the test would fail for every correct value, because returned rows count as failures.",
    references: "https://docs.getdbt.com/docs/build/data-tests#generic-data-tests",
    dbtVersionFocus: "Core"
  },
  {
    id: 31,
    category: "Developing and optimizing dbt models",
    difficulty: "Intermediate",
    questionText: "An analytics engineer completes code changes for a single downstream model named `fct_user_retention`. They want to compile, run, and replace this model inside the database but skip compiling and executing any matching column assertions or source validation tests. Which command performs this isolated operation?",
    options: [
      "`dbt build --select fct_user_retention`",
      "`dbt run --select fct_user_retention`",
      "`dbt test --select fct_user_retention`",
      "`dbt compile --select fct_user_retention`"
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\n`dbt run` builds the selected models in the warehouse and does not execute tests. With `--select fct_user_retention`, only that model is built, and no tests run.\n\nINCORRECT COMPETING OPTIONS:\n- `dbt build`: it runs the selected model and also runs its tests.\n- `dbt test`: it only runs tests and does not build the model.\n- `dbt compile`: it renders the SQL without creating or replacing the model in the warehouse.",
    references: "https://docs.getdbt.com/reference/dbt-commands",
    dbtVersionFocus: "Core"
  },
  {
    id: 32,
    category: "Developing and optimizing dbt models",
    difficulty: "Basic",
    questionText: "To avoid cluttering schema YAML files with very long, multi-line paragraph descriptions of dbt models or columns, which feature should you use to separate descriptions into clean dedicated markdown files?",
    options: [
      "Use YAML anchors to reuse the description text across the properties files.",
      "Use doc blocks written in `.md` files and reference them with the `doc()` function in YAML.",
      "Use the `docs` config in `dbt_project.yml` to point each model at a `.md` file.",
      "Use `persist_docs` to read the descriptions from `.md` files in the `models` directory."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nA doc block is written in a `.md` file between `{% docs name %}` and `{% enddocs %}`. The YAML description then calls it with `{{ doc('name') }}`, so the long text lives in a separate markdown file.\n\nINCORRECT COMPETING OPTIONS:\n- YAML anchors: they reuse text inside YAML files and keep the descriptions in YAML instead of moving them to markdown files.\n- The `docs` config in `dbt_project.yml`: it controls display settings such as `show` and `node_color` and does not load descriptions from files.\n- `persist_docs`: it writes existing descriptions to the warehouse as comments and does not read them from markdown files.",
    references: "https://docs.getdbt.com/docs/build/documentation",
    dbtVersionFocus: "Core"
  },
  {
    id: 33,
    category: "Debugging data modeling errors",
    difficulty: "Intermediate",
    questionText: "A `dbt run` fails with the error below. How does this error occur in dbt projects, and how should it be corrected?",
    codeSnippet: `Found a cycle: model.shop.dim_customers --> model.shop.fct_orders`,
    codeLanguage: "text",
    options: [
      "Both models write to the same schema; set a different `schema` config on each model.",
      "Each model uses `ref` to the other; move the shared logic into a third upstream model.",
      "Both models are materialized as views; materialize one of them as a table.",
      "One model uses `source()` instead of `ref()`; replace the `source()` call with `ref()`."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\ndbt builds a directed acyclic graph from the `ref` calls. When `dim_customers` refs `fct_orders` and `fct_orders` refs `dim_customers`, there is no valid build order. The cycle has to be removed, usually by moving the shared logic into a third model that both depend on.\n\nINCORRECT COMPETING OPTIONS:\n- Models in the same schema: the schema does not affect the dependency graph, and models can share a schema.\n- Both models as views: the materialization does not change the dependencies between the models.\n- Replacing `source()` with `ref()`: a `source()` call is not a model dependency, so it cannot form a cycle, and changing it would not remove one.",
    references: "https://docs.getdbt.com/reference/dbt-jinja-functions/ref",
    dbtVersionFocus: "Core"
  },
  {
    id: 34,
    category: "Developing and optimizing dbt models",
    difficulty: "Advanced",
    questionText: "When setting up Type II slowly changing dimensions in dbt using a snapshot `check` strategy, how does dbt evaluate changes if `check_cols` is configured with a list of values, and what is the behavior if any value changes to null?",
    options: [
      "dbt compares each column in `check_cols` and inserts a new row when any value changes, nulls included.",
      "dbt compares each column in `check_cols` and ignores any value that changes to or from null.",
      "dbt compares only the first column in `check_cols` and inserts a new row when it changes.",
      "dbt compares each column in `check_cols` and overwrites the existing row when any value changes."
    ],
    correctAnswers: [0],
    explanation: "CORRECT ACTION:\nWith the `check` strategy, dbt compares the current values of every column listed in `check_cols` with the last snapshot row. When any of them changes, including a change to or from null, dbt closes the old row by setting `dbt_valid_to` and inserts a new row.\n\nINCORRECT COMPETING OPTIONS:\n- Ignoring changes to or from null: a change to or from null is a change like any other and creates a new row.\n- Comparing only the first column: every column in `check_cols` is compared, not just the first.\n- Overwriting the existing row: snapshots keep history by inserting a new row, which is the behavior of Type II tables.",
    references: "https://docs.getdbt.com/docs/build/snapshots#the-check-strategy",
    dbtVersionFocus: "Core"
  },
  {
    id: 35,
    category: "Developing and optimizing dbt models",
    difficulty: "Intermediate",
    questionText: "In writing highly dynamic dbt configurations, what is the core behavioral and compilation difference between utilizing the Jinja functions `{{ var() }}` and `{{ env_var() }}`?",
    options: [
      "`var()` reads environment variables, while `env_var()` reads values from `dbt_project.yml`.",
      "`var()` reads project variables or `--vars`, while `env_var()` reads environment variables.",
      "`var()` can be used only in models, while `env_var()` can be used only in `profiles.yml`.",
      "`var()` values must be passed with `--vars`, while `env_var()` values must be set in `dbt_project.yml`."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\n`var()` returns a project variable, which is defined under `vars` in `dbt_project.yml` or passed on the command line with `--vars`. `env_var()` returns the value of an environment variable from the process that runs dbt, which is how secrets and per-environment values are usually supplied.\n\nINCORRECT COMPETING OPTIONS:\n- Swapped sources: the functions are reversed, since `var()` does not read environment variables.\n- `var()` only in models and `env_var()` only in `profiles.yml`: both functions can be used in several places, including model SQL and `dbt_project.yml`.\n- `--vars` required and `dbt_project.yml` for environment values: `var()` can take its value from `dbt_project.yml`, and `env_var()` values come from the environment.",
    references: "https://docs.getdbt.com/reference/dbt-jinja-functions/env_var",
    dbtVersionFocus: "Core"
  },
  {
    id: 36,
    category: "Developing and optimizing dbt models",
    difficulty: "Intermediate",
    questionText: "Where is the `profiles.yml` file normally stored, and how does configuring the `threads` option inside a profile connection block affect execution performance during `dbt run`?",
    options: [
      "It is stored in the `target/` directory; `threads` sets how many models dbt runs in parallel.",
      "It is stored in `~/.dbt/` by default; `threads` sets how many models dbt runs in parallel.",
      "It is stored in `~/.dbt/` by default; `threads` sets how many times dbt retries a failed model.",
      "It is stored in the `logs/` directory; `threads` sets how many CPU cores dbt uses to compile."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nThe recommended location of `profiles.yml` is the `~/.dbt/` directory. The `threads` setting is the maximum number of models dbt builds in parallel, so models that do not depend on each other can run at the same time.\n\nINCORRECT COMPETING OPTIONS:\n- Stored in `target/`: that directory holds compiled code and artifacts, not connection profiles.\n- `threads` as retries: `threads` controls how many models run in parallel, not how often a failed model is retried.\n- Stored in `logs/` with `threads` as CPU cores: `logs/` holds log files, and `threads` sets concurrent warehouse connections, not CPU cores.",
    references: "https://docs.getdbt.com/docs/core/connect-data-platform/profiles.yml",
    dbtVersionFocus: "Core"
  },
  {
    id: 37,
    category: "Implementing dbt tests",
    difficulty: "Intermediate",
    questionText: "By default, a failing generic test returns an error, and in `dbt build` the nodes downstream of it are skipped. How can a developer configure the test in its YAML properties so that a few failures raise only a warning, and an error is raised only when the failures cross a set threshold?",
    options: [
      "Use `store_failures: true` so that failing rows are saved and the test no longer returns an error.",
      "Set `warn_if` and `error_if` thresholds in the test `config`.",
      "Use `limit` in the test `config` so that only failure counts above the limit raise an error.",
      "Use `--fail-fast` on `dbt test` so that test failures are reported as warnings."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nThe test `config` accepts `warn_if` and `error_if` thresholds. With the default `severity: error`, failures below the `warn_if` threshold pass, failures that meet `warn_if` but not `error_if` raise a warning, and failures that meet `error_if` raise an error, so small failure counts do not stop the run.\n\nINCORRECT COMPETING OPTIONS:\n- `store_failures: true`: it saves the failing rows in the warehouse and does not change whether the test errors.\n- `limit`: it caps the number of failing rows returned by the test query and does not set an error threshold.\n- `--fail-fast`: it stops the run at the first failure and does not downgrade errors to warnings.",
    references: "https://docs.getdbt.com/reference/resource-configs/severity",
    dbtVersionFocus: "Core"
  },
  {
    id: 38,
    category: "Developing and optimizing dbt models",
    difficulty: "Advanced",
    questionText: "An analytics engineer is optimizing a dbt model on Snowflake that queries an extremely large table. They want to configure a clustering key to speed up query performance. What is the correct configuration format in the model's configuration block?",
    options: [
      "Add `cluster_by` to the `data_tests` of the key column in the properties YAML file.",
      "Set `cluster_by` in the model `config()` as a column name or a list of column names.",
      "Set `partition_by` in the model `config()` with a column name or a list of column names.",
      "Set `sort` in the model `config()` with a column name or a list of column names."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nThe dbt Snowflake adapter supports the `cluster_by` model config. It accepts a column name or a list of column names, and dbt uses it to add the clustering keys when it creates the table.\n\nINCORRECT COMPETING OPTIONS:\n- `cluster_by` as a column test: tests check data and do not change how a table is created.\n- `partition_by`: this config is used on other adapters such as BigQuery and Spark, not for Snowflake clustering.\n- `sort`: this config is used on Redshift to define sort keys, not on Snowflake.",
    references: "https://docs.getdbt.com/reference/resource-configs/snowflake-configs#clustering-keys",
    dbtVersionFocus: "Core Snowflake Adapter"
  },
  {
    id: 39,
    category: "Developing and optimizing dbt models",
    difficulty: "Intermediate",
    questionText: "To implement access audit logging or clean up auxiliary staging tables, a developer wants to run a raw SQL command immediately before or after a model is built. What is the correct way to declare this behavior inside dbt models?",
    options: [
      "Use `on-run-start` and `on-run-end` hooks in `dbt_project.yml` for the SQL commands.",
      "Use `pre_hook` and `post_hook` in the model `config()` for the SQL commands.",
      "Use `dbt run-operation` in a separate step after `dbt run` completes.",
      "Use a singular test in `tests/` that runs the SQL after the model is built."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nA `pre_hook` runs a SQL statement before a model is built and a `post_hook` runs one after it is built. Both are set in the model `config()` (as `+pre-hook` and `+post-hook` in `dbt_project.yml`), and they can contain SQL or a macro call.\n\nINCORRECT COMPETING OPTIONS:\n- `on-run-start` and `on-run-end`: these run once per dbt invocation, not before and after each model.\n- `dbt run-operation` after `dbt run`: it runs a macro as a separate command and is not tied to the build of a model.\n- A singular test: a test only selects rows to check for failures and is not meant to run statements around a model build.",
    references: "https://docs.getdbt.com/reference/resource-configs/pre-hook-post-hook",
    dbtVersionFocus: "Core"
  },
  {
    id: 40,
    category: "Managing dbt models governance",
    difficulty: "Advanced",
    questionText: "Under dbt Mesh architectures, you have published a public model `dim_products` inside a core catalog project. You want to remove an existing column from it while maintaining backward compatibility for downstream consumer projects that reference it under tight schema contracts. What is the recommended strategy?",
    options: [
      "Remove the `contract` config from `dim_products` before removing the column.",
      "Add a new version of `dim_products` under `versions` and deprecate the old version.",
      "Change the `access` of `dim_products` to `protected` while removing the column.",
      "Remove the column and set `on_schema_change: sync_all_columns` on `dim_products`."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nRemoving a column is a breaking change. Model versions let the owner of a public model release the changed definition as a new version while the old version stays available. Setting a `deprecation_date` on the old version gives downstream projects time to move to the new one.\n\nINCORRECT COMPETING OPTIONS:\n- Removing the `contract` config: this drops the guarantee that consumers rely on instead of protecting them.\n- Changing `access` to `protected`: a protected model can be referenced only inside its own project, so the downstream projects would lose access.\n- `on_schema_change: sync_all_columns`: this setting only controls how incremental models handle schema changes and does nothing for consumers of a public model.",
    references: "https://docs.getdbt.com/docs/collaborate/govern/model-versions",
    dbtVersionFocus: "v1.6+ (Model Versioning & Mesh Coordination)"
  },
  {
    id: 41,
    category: "Developing and optimizing dbt models",
    difficulty: "Advanced",
    questionText: "A developer is writing a cross-database macro. It must return the first expression below when dbt runs on Snowflake and the second when it runs on BigQuery. Which property should the macro check to choose between them?",
    codeSnippet: `-- Snowflake
date_trunc('month', created_at)

-- BigQuery
date_trunc(created_at, month)`,
    codeLanguage: "sql",
    options: [
      "Use `env_var('DBT_WAREHOUSE')` to read the adapter type from the environment.",
      "Use `target.type` to read the active adapter type.",
      "Use `target.name` to read the adapter type of the active target.",
      "Use `var('adapter_type')`, which dbt sets to the adapter type automatically."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nThe `target` dictionary is populated from the connection settings in `profiles.yml`. `target.type` holds the adapter type, such as `snowflake` or `bigquery`, so it can drive an `if` / `elif` block in a cross-database macro.\n\nINCORRECT COMPETING OPTIONS:\n- Using `env_var('DBT_WAREHOUSE')`: this reads an environment variable that dbt does not set, so it does not reveal the adapter type.\n- Using `target.name`: this holds the name of the target, such as `dev` or `prod`, not the adapter type.\n- Using `var('adapter_type')`: dbt does not define this variable automatically, so it is empty unless the project sets it.",
    references: "https://docs.getdbt.com/reference/dbt-jinja-functions/target",
    dbtVersionFocus: "Core"
  },
  {
    id: 42,
    category: "Developing and optimizing dbt models",
    difficulty: "Advanced",
    questionText: "An analytics engineer materializes a staging model as `ephemeral`. A downstream model references it three times, inside separate join subqueries. How does dbt compile the downstream model?",
    options: [
      "dbt creates a temporary view for the ephemeral model and drops it after the downstream model runs.",
      "dbt compiles the ephemeral model as one CTE at the top of the file and references that CTE three times.",
      "dbt compiles the ephemeral model as a separate CTE for each reference, repeating its SQL three times.",
      "dbt raises a circular dependency error because an ephemeral model can be referenced only once."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nAn ephemeral model is never built in the warehouse. dbt interpolates its SQL into the downstream model as a single CTE at the top of the compiled query, and each `ref` to the ephemeral model points to that CTE.\n\nINCORRECT COMPETING OPTIONS:\n- Temporary view: an ephemeral model creates no relation in the database, so there is no view to drop.\n- A separate CTE for each reference: dbt defines the ephemeral model once per downstream model, not once per `ref` call.\n- Circular dependency error: referencing a model several times does not create a cycle, so dbt compiles it normally.",
    references: "https://docs.getdbt.com/docs/build/materializations#ephemeral",
    dbtVersionFocus: "Core (Ephemeral Compilation)"
  },
  {
    id: 43,
    category: "Developing and optimizing dbt models",
    difficulty: "Basic",
    questionText: "Which statement describes how the `source()` and `ref()` Jinja functions differ in compilation and lineage?",
    options: [
      "`source` references tables loaded outside dbt; `ref` references dbt models and sets build order.",
      "`ref` can only reference views, and `source` can only reference incremental models.",
      "`source` runs a freshness check before each model compiles, and `ref` reads a cached copy of the model.",
      "`source` and `ref` compile to identical SQL and appear identically in the DAG."
    ],
    correctAnswers: [0],
    explanation: "CORRECT ACTION:\n`source` points to a table that an ingestion tool loads outside the dbt project, so it becomes an entry point in the lineage graph. `ref` points to a model that dbt builds, and it creates the dependency that determines build order in the DAG.\n\nINCORRECT COMPETING OPTIONS:\n- Views only and incremental only: `ref` works for any materialization, and `source` is not tied to incremental models.\n- Freshness check and cached copy: `source` does not run freshness checks during compilation (that is `dbt source freshness`), and `ref` does not read a cache.\n- Identical SQL and lineage: the two functions create different node types in the DAG, and only `ref` sets build order between models.",
    references: "https://docs.getdbt.com/reference/dbt-jinja-functions/source",
    dbtVersionFocus: "Core"
  },
  {
    id: 44,
    category: "Developing and optimizing dbt models",
    difficulty: "Advanced",
    questionText: "By default, when you configure a custom schema on a dbt model (e.g., `schema: marketing`) and run the model in development under target schema `dev_john`, how does dbt determine the final target schema name in the database?",
    options: [
      "The custom schema replaces the target schema, so the model builds in `marketing`.",
      "The custom schema is appended to the target schema, so the model builds in `dev_john_marketing`.",
      "The custom schema is prepended to the target schema, so the model builds in `marketing_dev_john`.",
      "The custom schema is ignored in development, so the model builds in `dev_john`."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nThe default `generate_schema_name` macro joins the target schema and the custom schema with an underscore, in that order. With target schema `dev_john` and `schema: marketing`, the model builds in `dev_john_marketing`. Overriding the `generate_schema_name` macro changes this behaviour.\n\nINCORRECT COMPETING OPTIONS:\n- Replacing the target schema: this applies only after overriding `generate_schema_name`, not by default.\n- Prepending the custom schema: the target schema comes first, so the result is not `marketing_dev_john`.\n- Ignoring the custom schema: dbt applies the custom schema in every environment, development included.",
    references: "https://docs.getdbt.com/docs/build/custom-schemas",
    dbtVersionFocus: "Core (Custom Schema Resolution)"
  },
  {
    id: 45,
    category: "Debugging data modeling errors",
    difficulty: "Intermediate",
    questionText: "An analytics engineer creates two separate SQL files in their project: one at `models/staging/marketing/stg_customers.sql` and another at `models/staging/sales/stg_customers.sql`. How does dbt handle this configuration when they run `dbt compile`?",
    options: [
      "dbt compiles both models and resolves each `ref` by the subdirectory of the calling model.",
      "dbt raises a compilation error because model names must be unique in a project.",
      "dbt builds both models into a single relation that combines their rows.",
      "dbt compiles the first file it finds and skips the other one without an error."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\ndbt resolves `ref('stg_customers')` by model name, so each model name must be unique within a project. Two files with the same name raise a compilation error even when they sit in different folders. Renaming one file fixes it.\n\nINCORRECT COMPETING OPTIONS:\n- Compiling both by subdirectory: `ref` does not use folder paths to tell models apart.\n- Combining both into one relation: dbt never merges two models into one relation.\n- Skipping the second file: dbt does not silently drop a duplicate and stops with an error instead.",
    references: "https://docs.getdbt.com/reference/dbt-jinja-functions/ref#resolving-relations",
    dbtVersionFocus: "Core Namespace Rules"
  },
  {
    id: 46,
    category: "Developing and optimizing dbt models",
    difficulty: "Intermediate",
    questionText: "A project declares `cutoff_date` under `vars` in `dbt_project.yml`, and a scheduled job runs the command below. Which value does dbt use for `cutoff_date`?",
    codeSnippet: `dbt run --vars '{"cutoff_date": "2026-01-01"}'`,
    options: [
      "dbt uses the `dbt_project.yml` value and ignores the `--vars` value.",
      "dbt uses the `--vars` value and ignores the `dbt_project.yml` value.",
      "dbt raises an error because `cutoff_date` is defined in two places.",
      "dbt combines both values into a list returned by `var('cutoff_date')`."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nVariables passed with `--vars` on the command line take precedence over variables defined in `dbt_project.yml`. The run uses `2026-01-01` for `cutoff_date`, which lets a scheduled job inject dates without editing the project.\n\nINCORRECT COMPETING OPTIONS:\n- Project value wins: the command-line value has higher precedence than the project file.\n- Error on duplicate definition: dbt allows the same variable in both places and applies the precedence rule.\n- Combined list: `var()` returns a single value and dbt does not merge the two definitions.",
    references: "https://docs.getdbt.com/docs/build/project-variables",
    dbtVersionFocus: "Core"
  },
  {
    id: 47,
    category: "Developing and optimizing dbt models",
    difficulty: "Advanced",
    questionText: "You are designing an incremental model and configure `on_schema_change: sync_all_columns`. During a source deployment, we drop three legacy columns and add two new columns to the SQL model file. How does dbt handle the target database table on the next incremental execution run?",
    options: [
      "dbt fails the run because incremental models cannot change their schema.",
      "dbt adds the two new columns and keeps the three dropped columns in the table.",
      "dbt adds the two new columns and removes the three dropped ones.",
      "dbt drops the table and rebuilds it in full whenever the schema changes."
    ],
    correctAnswers: [2],
    explanation: "CORRECT ACTION:\nWith `sync_all_columns`, dbt aligns the existing table with the model's query on the next incremental run. It adds the new columns and removes the columns that are no longer selected, without rebuilding the table.\n\nINCORRECT COMPETING OPTIONS:\n- Failing the run: that is the behaviour of `on_schema_change: fail`, not of `sync_all_columns`.\n- Adding new columns and keeping dropped ones: that is the behaviour of `append_new_columns`.\n- Dropping and rebuilding the table: a full rebuild happens only with `--full-refresh`, not on a schema change.",
    references: "https://docs.getdbt.com/docs/build/incremental-models",
    dbtVersionFocus: "Core (on_schema_change)"
  },
  {
    id: 48,
    category: "Developing and optimizing dbt models",
    difficulty: "Intermediate",
    questionText: "When writing highly modular models, what three conditions must evaluate to true for the dbt Jinja conditional block `is_incremental()` to return true during pipeline execution?",
    codeSnippet: `{% if is_incremental() %}
    where event_timestamp >= (select max(event_timestamp) from {{ this }})
{% endif %}`,
    codeLanguage: "jinja",
    options: [
      "The model is materialized as `incremental`, the table exists, and `--full-refresh` is not passed.",
      "The model is materialized as `incremental`, it sets a `unique_key`, and the target is named `prod`.",
      "The model is materialized as `incremental`, it sets `on_schema_change`, and the command is `dbt build`.",
      "The model is materialized as `incremental`, the table is partitioned, and `dbt compile` ran first."
    ],
    correctAnswers: [0],
    explanation: "CORRECT ACTION:\n`is_incremental()` returns true only when the model is materialized as `incremental`, the relation already exists in the database, and the run does not use `--full-refresh`. If any of these fails, dbt runs the full query and skips the incremental block.\n\nINCORRECT COMPETING OPTIONS:\n- `unique_key` and a `prod` target: `unique_key` is optional and the target name has no effect on `is_incremental()`.\n- `on_schema_change` and `dbt build`: `is_incremental()` returns true under `dbt run` as well, and `on_schema_change` is not required.\n- Partitioned table and a prior `dbt compile`: partitioning is optional and no earlier compile is needed.",
    references: "https://docs.getdbt.com/docs/build/incremental-models",
    dbtVersionFocus: "Core Incremental logic"
  },
  {
    id: 49,
    category: "Developing and optimizing dbt models",
    difficulty: "Intermediate",
    questionText: "An analytics engineer changes a model's materialization from `view` to `table` in its `config()` block and runs `dbt run` while the view still exists in the warehouse. Which statement describes the risk in this change and how dbt's built-in materializations handle it?",
    options: [
      "Connection timeouts are the risk because databases convert a view to a table in place; raising `connect_timeout` in `profiles.yml` resolves it.",
      "Databases cannot replace a view with a table in place; dbt detects the type change and drops the existing relation first.",
      "The adapter cache holds stale relation metadata; running `dbt clean` before `dbt run` refreshes the cache and allows the type change.",
      "Changing materialization requires the `--full-refresh` flag; without it dbt skips the model and raises a relation type mismatch error until the flag is added."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nMany databases do not let a `create table` statement replace an existing view, or the reverse. dbt checks the type of the existing relation before building, and when it differs from the configured materialization it drops the old relation first. The new relation is then created normally.\n\nINCORRECT COMPETING OPTIONS:\n- Connection timeouts: a timeout is unrelated to relation types, and databases do not convert views to tables in place.\n- Stale adapter cache and `dbt clean`: `dbt clean` only removes local folders such as `target/`, and does not touch relation metadata.\n- `--full-refresh` requirement: `--full-refresh` applies to incremental models, and dbt handles a view-to-table change without it.",
    references: "https://docs.getdbt.com/docs/build/materializations#materializations",
    dbtVersionFocus: "Core State Management"
  },
  {
    id: 50,
    category: "Debugging data modeling errors",
    difficulty: "Advanced",
    questionText: "A model named `stg_payments` in `models/staging/` fails in CI. A developer wants its `select` statement, with every `ref` and `source` resolved to a relation name, to paste into a warehouse console. Where in the project filesystem should they look?",
    options: [
      "In `logs/dbt.log`, which stores the rendered SQL of every model as a standalone file.",
      "In `target/compiled/<project_name>/models/staging/stg_payments.sql`, which stores the rendered `select` statement.",
      "In `target/run/<project_name>/models/staging/stg_payments.sql`, which stores the SQL wrapped in the DDL that dbt executes.",
      "In `target/catalog.json`, which stores the rendered SQL of every model."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\ndbt writes the compiled SELECT statement of each model under `target/compiled/<project_name>/`, mirroring the model's folder, with `ref` and `source` resolved to real relation names. This is the file to copy into a warehouse console to troubleshoot.\n\nINCORRECT COMPETING OPTIONS:\n- `logs/dbt.log`: it records execution logs, not a standalone copy of each compiled model.\n- `target/run/`: it holds the SQL that dbt actually runs, including the `create table as` wrapper, so it is not the plain compiled query.\n- `target/catalog.json`: it holds table and column metadata produced by `dbt docs generate`, not SQL.",
    references: "https://docs.getdbt.com/reference/dbt-commands",
    dbtVersionFocus: "Core"
  },
  {
    id: 51,
    category: "Debugging data modeling errors",
    difficulty: "Basic",
    questionText: "When onboarding a new analytics developer, they run `dbt debug`. What is the primary purpose of this command compared to `dbt compile` or `dbt run`?",
    options: [
      "It compiles all macros in the project and checks them for circular imports.",
      "It validates `profiles.yml` and the connection to the data platform.",
      "It runs ad hoc SQL against the warehouse and prints the resulting rows.",
      "It drops and recreates the development schemas to reset the environment."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\n`dbt debug` checks the setup of the dbt environment. It confirms that `profiles.yml` exists and is valid and that dbt can connect to the data platform. It does not compile or run models.\n\nINCORRECT COMPETING OPTIONS:\n- Compiling macros for circular imports: `dbt debug` does not parse the project's macros.\n- Running ad hoc SQL: querying rows is the job of commands such as `dbt show`, not `dbt debug`.\n- Dropping and recreating schemas: `dbt debug` is read-only and never changes the warehouse.",
    references: "https://docs.getdbt.com/reference/commands/debug",
    dbtVersionFocus: "Core Setup Guides"
  },
  {
    id: 52,
    category: "Troubleshooting and optimizing dbt pipelines",
    difficulty: "Intermediate",
    questionText: "On Postgres, two independent table models, `fct_orders` and `fct_payments`, both use the config below. The `post_hook` updates the same row of a shared audit table and then keeps the model's transaction open for five seconds. The profile sets `threads: 4`, and `dbt run` fails one of the two models with `canceling statement due to lock timeout`. What happens when you rerun the same command with `--threads 1`, and why?",
    codeSnippet: `{{ config(
    materialized='table',
    pre_hook="set lock_timeout = '2s'",
    post_hook="update audit.load_audit set last_loaded_at = now() where id = 1; select pg_sleep(5)"
) }}`,
    codeLanguage: "sql",
    options: [
      "One model still fails, because `--threads` on the command line does not override the `threads` value set in the profile.",
      "One model still fails, because `threads` sets how many CPU cores dbt uses locally, not how many models run at once.",
      "Both models succeed, because dbt finishes one model before it starts the next, so neither update waits for the other's lock.",
      "Both models fail, because with one thread the two post-hooks share a single connection and block each other's update."
    ],
    correctAnswers: [2],
    explanation: "CORRECT ACTION:\nWith `threads: 1`, dbt starts building only one model and finishes it before moving on to the next. With `threads: 4`, the two independent models run at the same time: one model's `post_hook` updates the audit row and keeps its transaction open, and the other model's update waits longer than the 2-second `lock_timeout` and is cancelled. Run one at a time, the second update starts only after the first model has finished, so both models succeed. Rerunning with `--threads 1` is a way to confirm that the error comes from models running in parallel.\n\nINCORRECT COMPETING OPTIONS:\n- `--threads` not overriding the profile: the `--threads` option sets a different number of threads than the value defined in the target.\n- Local CPU cores: `threads` is the maximum number of models dbt works on at once, so it decides whether the two updates overlap.\n- One shared connection blocking itself: with one thread the models run one after the other, and the second update finds the row free.",
    references: "https://docs.getdbt.com/docs/running-a-dbt-project/using-threads",
    dbtVersionFocus: "Threads and parallel models"
  },
  {
    id: 53,
    category: "Debugging data modeling errors",
    difficulty: "Intermediate",
    questionText: "A developer runs `dbt run` and dbt stops before building any model, reporting `Found a cycle: model.analytics.int_orders --> model.analytics.fct_orders --> model.analytics.int_orders`. Which approach resolves this error?",
    options: [
      "Run `dbt run --full-refresh` to rebuild the models in the cycle from scratch.",
      "Find the models in the cycle in the error output and move shared logic into a separate upstream model.",
      "Set `materialized: ephemeral` on the models in the cycle, since ephemeral models can reference each other.",
      "Set `threads: 1` in `profiles.yml` so dbt resolves the models one at a time."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nA cyclic dependency means models reference each other through `ref`, so the DAG has no valid build order. The error output lists the models in the loop. Moving the shared logic into a new upstream model removes the circular reference.\n\nINCORRECT COMPETING OPTIONS:\n- `--full-refresh`: this flag affects incremental models and does not change the dependency graph.\n- Ephemeral materialization: the `ref` calls still form a cycle, so the DAG remains invalid.\n- `threads: 1`: thread count changes execution parallelism, not whether the DAG has a cycle.",
    references: "https://docs.getdbt.com/reference/dbt-jinja-functions/ref",
    dbtVersionFocus: "Core"
  },
  {
    id: 54,
    category: "Developing and optimizing dbt models",
    difficulty: "Advanced",
    questionText: "If an analytics engineer defines a model as `ephemeral`, which of the following is a key functional and debugging constraint compared to `table` or `view` materializations?",
    options: [
      "Ephemeral models can only be referenced by other ephemeral models or by view models.",
      "Ephemeral models are not built in the database, so they cannot be queried directly.",
      "Ephemeral models are compiled only when the active target is named `dev` or `default`.",
      "Ephemeral models cannot be included in packages that are installed with `dbt deps`."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nAn ephemeral model is compiled into a CTE inside the models that reference it, so no table or view exists in the warehouse. To inspect its output, you have to read the compiled SQL of a downstream model in `target/compiled/`.\n\nINCORRECT COMPETING OPTIONS:\n- Only referenced by ephemeral models: table, view and incremental models can reference ephemeral models.\n- Compiled only on a `dev` target: dbt compiles ephemeral models on every target.\n- Cannot be in packages: packages can contain models of any materialization, ephemeral included.",
    references: "https://docs.getdbt.com/docs/build/materializations#ephemeral",
    dbtVersionFocus: "Debugging constraints"
  },
  {
    id: 55,
    category: "Debugging data modeling errors",
    difficulty: "Intermediate",
    questionText: "An analytics engineer running complex continuous integration checks wants to accelerate pre-flight validation by compiling project manifest dependencies locally. What does `dbt parse` do, and what output is cached?",
    options: [
      "It runs the project's tests against the raw schemas without changing any tables.",
      "It parses the project and writes `manifest.json` without querying the warehouse.",
      "It compiles the view models and skips any model that has an enforced contract.",
      "It compares the project to production artifacts and drops relations for deleted models."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\n`dbt parse` reads the SQL, YAML and configuration files, builds the project graph and writes `manifest.json` to `target/`. It catches Jinja and YAML errors without running queries against the warehouse, which makes it a fast check in CI.\n\nINCORRECT COMPETING OPTIONS:\n- Running tests on raw schemas: tests are run by `dbt test`, which queries the warehouse.\n- Compiling views and skipping contracts: `dbt parse` treats every model the same and does not skip contracted models.\n- Dropping relations for deleted models: `dbt parse` never changes the warehouse.",
    references: "https://docs.getdbt.com/reference/commands/parse",
    dbtVersionFocus: "v1.5+ (Compilation performance)"
  },
  {
    id: 56,
    category: "Developing and optimizing dbt models",
    difficulty: "Intermediate",
    questionText: "When using third-party dbt packages (like `dbt-utils`), a developer wants to customize a variables setting declared inside the imported package. How is the variable value resolution completed under dbt Core architecture?",
    options: [
      "Edit the variable defaults in the package files under the `dbt_packages/` folder.",
      "Set the variable in the `vars` block of the project's `dbt_project.yml`.",
      "Set the variable under the active target in the `profiles.yml` connection file.",
      "Define the variable in `packages.yml` next to the entry for the package."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nThe root project's `vars` block in `dbt_project.yml` overrides the defaults set inside an installed package. This keeps the package code untouched, so the override survives `dbt deps`.\n\nINCORRECT COMPETING OPTIONS:\n- Editing files in `dbt_packages/`: dbt overwrites that folder the next time `dbt deps` runs.\n- Setting it in `profiles.yml`: profiles hold connection settings and do not define project variables.\n- Defining it in `packages.yml`: this file lists package sources and versions and does not accept variable values.",
    references: "https://docs.getdbt.com/docs/build/packages#overriding-package-variables",
    dbtVersionFocus: "Core"
  },
  {
    id: 57,
    category: "Implementing dbt tests",
    difficulty: "Intermediate",
    questionText: "What is the primary operational difference in dbt between a singular data test and a generic data test?",
    options: [
      "Singular tests validate formatting rules, and generic tests validate only primary keys.",
      "Singular tests are one-off SQL files in `tests/`, and generic tests are reusable macros.",
      "Singular tests only raise warnings and never fail a run, while generic tests always fail it.",
      "Singular tests run only in production environments, and generic tests run only in development."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nA singular test is a custom SQL query saved as a file in the `tests/` folder, and it fails when it returns rows. A generic test is a reusable macro, such as `unique` or `not_null`, that you apply to models and columns in YAML.\n\nINCORRECT COMPETING OPTIONS:\n- Formatting versus primary keys: both test types can check any condition, and neither is limited to one purpose.\n- Warn versus fail: both types follow the same severity configuration and can fail a run.\n- Production versus development: test type does not depend on the environment.",
    references: "https://docs.getdbt.com/docs/build/data-tests#singular-data-tests",
    dbtVersionFocus: "Core"
  },
  {
    id: 58,
    category: "Implementing dbt tests",
    difficulty: "Advanced",
    questionText: "An analytics engineer applies an `accepted_values` test on a column that contains nullable records. If some schema rows contain null values, how does dbt evaluate this assertion, and does it fail the test?",
    options: [
      "The test fails, because `NULL` is missing from the list of accepted values for the column.",
      "The test passes, because null values are not counted as failures by `accepted_values`.",
      "dbt replaces `NULL` values with the first accepted value before it runs the test.",
      "dbt skips the test for nullable columns and reports it as skipped in the run results."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nThe `accepted_values` test looks for values that are not in the list. A `NULL` is not comparable to the listed values, so null rows are not returned as failures and the test passes. A separate `not_null` test is needed to reject nulls.\n\nINCORRECT COMPETING OPTIONS:\n- Failing on `NULL`: the test does not return null rows as violations.\n- Replacing `NULL` with an accepted value: dbt never changes the data it tests.\n- Skipping nullable columns: dbt runs the test on nullable columns and does not skip it.",
    references: "https://docs.getdbt.com/reference/resource-properties/tests#accepted-values",
    dbtVersionFocus: "Core Assertions"
  },
  {
    id: 59,
    category: "Developing and optimizing dbt models",
    difficulty: "Intermediate",
    questionText: "To support rich documentation catalog generation, a dbt developer wants to reference descriptions written inside a separate markdown (`.md`) file using the Jinja `doc()` function. What is the correct criteria for this markdown file?",
    options: [
      "Name the file `descriptions.md` and place it in the `target/` output directory.",
      "Wrap the text in a `{% docs block_name %}` block in a `.md` file under `docs-paths`.",
      "Limit the content to plain text, since `doc()` cannot render markdown formatting in the catalog.",
      "Register the file under a `docs` key in `profiles.yml` so dbt can find it."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nA docs block starts with `{% docs block_name %}` and ends with `{% enddocs %}`. It lives in a `.md` file inside the project's configured `docs-paths`. A YAML description then points to it with `{{ doc('block_name') }}`.\n\nINCORRECT COMPETING OPTIONS:\n- `descriptions.md` in `target/`: the file name is free, and `target/` holds generated output rather than source files.\n- Plain text only: docs blocks support markdown formatting.\n- Registering in `profiles.yml`: profiles hold connection settings, and dbt finds docs blocks through `docs-paths`.",
    references: "https://docs.getdbt.com/docs/build/documentation#using-docs-blocks",
    dbtVersionFocus: "Core documentation integration"
  },
  {
    id: 60,
    category: "Implementing dbt tests",
    difficulty: "Advanced",
    questionText: "By default, a generic test that returns even one failing row is reported as an error, and `dbt test` exits with a failure. How can a developer configure the test below so that its failures are reported as warnings instead?",
    codeSnippet: `models:
  - name: dim_users
    columns:
      - name: user_id
        data_tests:
          - unique`,
    codeLanguage: "yaml",
    options: [
      "Set `store_failures: true` in the test `config` so failing rows are stored and the run continues.",
      "Add `severity: warn` to the test `config` so failures are reported as warnings.",
      "Set a global test severity in the target block of `profiles.yml` for the project.",
      "Add `--warn-error` to `dbt test` so that failing tests are reported as warnings."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nA test's `config` block accepts `severity: warn`, which reports failures as warnings instead of errors. Setting `warn_if` and `error_if` thresholds is a related way to make a small number of failing rows a warning.\n\nINCORRECT COMPETING OPTIONS:\n- `store_failures: true`: this saves failing rows to a table and does not change the test's severity.\n- Global severity in `profiles.yml`: profiles hold connection settings, not test configuration.\n- `--warn-error`: this flag does the opposite and turns warnings into errors.",
    references: "https://docs.getdbt.com/reference/resource-configs/severity",
    dbtVersionFocus: "v1.3+ (Test configuration updates)"
  },
  {
    id: 61,
    category: "Implementing and maintaining external dependencies",
    difficulty: "Intermediate",
    questionText: "An analytics team runs `dbt source freshness` on a source table configured with `loaded_at_field: _loaded_at` and gets failures although the data arrives on time. How does dbt compute freshness for this table?",
    options: [
      "dbt reads the creation timestamps of the source table's files in storage.",
      "dbt compares the maximum `loaded_at_field` value to the current UTC time.",
      "dbt compares the minimum `loaded_at_field` value to the time of the last `dbt run`.",
      "dbt compares the maximum `loaded_at_field` value to the timestamp in the previous `sources.json`."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nSource freshness checks whether data is arriving on schedule. dbt queries the maximum value of the `loaded_at_field` column in the source table and compares it with the current time in UTC.\n\nINCORRECT COMPETING OPTIONS:\n- File creation timestamps in storage: dbt queries the warehouse and never inspects the underlying storage files.\n- Minimum `loaded_at_field` against the last `dbt run`: freshness uses the most recent (maximum) value, and it is measured against the current time, not a previous run.\n- Maximum `loaded_at_field` against the previous `sources.json`: the artifact stores the result of the last check but is not the reference point for the calculation.",
    references: "https://docs.getdbt.com/docs/build/sources#source-freshness",
    dbtVersionFocus: "Core Freshness Rules"
  },
  {
    id: 62,
    category: "Implementing dbt tests",
    difficulty: "Advanced",
    questionText: "In dbt Core v1.8+, how does an engineer run ONLY the unit tests defined in their project while completely bypassing any generic tests or custom singular SQL assertions?",
    options: [
      "`dbt run --select \"test_type:unit\"`",
      "`dbt test --select \"test_type:unit\"`",
      "`dbt test --exclude \"test_type:singular\"`",
      "`dbt test --select \"test_type:generic\"`"
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nThe `test_type:unit` selector method matches only unit tests. Running it with `dbt test --select \"test_type:unit\"` executes the unit tests and leaves out generic and singular data tests.\n\nINCORRECT COMPETING OPTIONS:\n- `dbt run` with `test_type:unit`: `dbt run` builds models and does not execute tests.\n- Excluding `test_type:singular`: this still runs generic tests and unit tests together.\n- Selecting `test_type:generic`: this runs only generic data tests and skips unit tests.",
    references: "https://docs.getdbt.com/docs/build/unit-tests#running-unit-tests",
    dbtVersionFocus: "v1.8+ (Unit Testing Selector)"
  },
  {
    id: 63,
    category: "Leveraging the dbt state",
    difficulty: "Advanced",
    questionText: "In modern dbt Slim CI configurations, you run dbt with both `--defer` and `--state` flags. What is the fundamental behavior of this setup when executing modified models locally, and does it copy production records?",
    options: [
      "dbt copies the production tables of unmodified parents into the development schema.",
      "dbt points `ref` to production for unselected parents missing in development.",
      "dbt inlines unselected parent models as CTEs in the models that depend on them.",
      "dbt rebuilds every parent model in the development schema before the selected models."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nWith `--defer` and `--state`, dbt reads the `manifest.json` from the state directory. For parent models that are not selected and do not exist in the development schema, `ref` resolves to the production relation. No production data is copied.\n\nINCORRECT COMPETING OPTIONS:\n- Copying production tables: deferral only changes which relation `ref` points to, and `dbt clone` is the command that copies relations.\n- Inlining parents as CTEs: only `ephemeral` models are compiled as CTEs, and deferral does not change materialization.\n- Rebuilding every parent in development: that is what happens without deferral, and deferral exists to avoid it.",
    references: "https://docs.getdbt.com/reference/node-selection/defer",
    dbtVersionFocus: "v1.5+ (Slim CI Integration)"
  },
  {
    id: 64,
    category: "Developing and optimizing dbt models",
    difficulty: "Intermediate",
    questionText: "A developer runs `dbt docs generate` and serves the documentation site to browse project lineage and column metadata. Which artifacts does the site read?",
    options: [
      "`manifest.json` and `catalog.json`, generated in the `target/` directory",
      "`profiles.yml` and `dbt_project.yml`, copied into the `target/` directory",
      "`sources.json` and `run_results.json`, generated in the `target/` directory",
      "`graph.gpickle` and `partial_parse.msgpack`, generated in the `target/` directory"
    ],
    correctAnswers: [0],
    explanation: "CORRECT ACTION:\n`manifest.json` holds models, configurations, descriptions and the dependency graph. `catalog.json` holds warehouse metadata such as column types, and is produced by `dbt docs generate`. The documentation site reads both.\n\nINCORRECT COMPETING OPTIONS:\n- `profiles.yml` and `dbt_project.yml`: these are configuration inputs to dbt, not metadata artifacts, and they hold no lineage information.\n- `sources.json` and `run_results.json`: these record freshness results and execution outcomes, not the project structure.\n- `graph.gpickle` and `partial_parse.msgpack`: these are internal files dbt uses to speed up parsing and are not documentation artifacts.",
    references: "https://docs.getdbt.com/docs/collaborate/explore-projects",
    dbtVersionFocus: "v1.10+ (dbt Explorer metadata)"
  },
  {
    id: 65,
    category: "Developing and optimizing dbt models",
    difficulty: "Intermediate",
    questionText: "How can an analytics engineer safely handle production warehouse credentials without committing raw secrets (like passwords or tokens) into git repositories?",
    options: [
      "Hardcode them in `profiles.yml`, which dbt encrypts at compile time.",
      "Use `env_var()` in `profiles.yml` to read them from the environment.",
      "Store them as `vars` in `dbt_project.yml` and commit the file to git.",
      "Save them in a seed file and reference the seed in the model config."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nThe `env_var()` function reads a value from the environment when dbt runs, for example `{{ env_var('DBT_PROD_PASSWORD') }}`. The secret is supplied by the runtime environment and never stored in the repository.\n\nINCORRECT COMPETING OPTIONS:\n- Hardcoding in `profiles.yml`: dbt does not encrypt `profiles.yml`, so the secret would sit in plain text.\n- Storing as `vars` in `dbt_project.yml`: committing the file puts the secret in git, and `vars` are not meant for credentials.\n- Saving in a seed file: seeds are CSV files loaded into the warehouse, are committed to git, and are not used for connection settings.",
    references: "https://docs.getdbt.com/reference/dbt-jinja-functions/env_var",
    dbtVersionFocus: "Core Security"
  },
  {
    id: 66,
    category: "Developing and optimizing dbt models",
    difficulty: "Advanced",
    questionText: "A snapshot uses the `check` strategy with `check_cols: ['status']`. On the next `dbt snapshot`, the `status` value of a record has changed from `'active'` to `NULL`. What does dbt do?",
    options: [
      "dbt closes the existing row and inserts a new row, because a change to `NULL` counts as a change.",
      "dbt keeps the existing row unchanged, because a comparison involving `NULL` never evaluates to true.",
      "dbt fails the snapshot, because a column in `check_cols` cannot contain `NULL`.",
      "dbt updates the existing row in place and adds no new row, because the key is unchanged."
    ],
    correctAnswers: [0],
    explanation: "CORRECT ACTION:\nThe `check` strategy compares each column in `check_cols` between the snapshot row and the source row, and it adds explicit checks for a value changing to or from `NULL`. A change from `'active'` to `NULL` therefore closes the old row with `dbt_valid_to` and inserts a new row.\n\nINCORRECT COMPETING OPTIONS:\n- Keeping the row unchanged because of `NULL` comparison: dbt adds `is null` checks, so the change is detected.\n- Failing because of `NULL` in `check_cols`: dbt does not validate the nullability of monitored columns.\n- Updating the row in place: snapshots keep history by inserting a new row per version and do not overwrite the old one.",
    references: "https://docs.getdbt.com/docs/build/snapshots#check-strategy",
    dbtVersionFocus: "Core Snapshots"
  },
  {
    id: 67,
    category: "Developing and optimizing dbt models",
    difficulty: "Advanced",
    questionText: "An analytics engineer writes a custom `generate_schema_name` macro. Why is it standard practice to keep a check on `target.name` inside this macro, and what is the risk if the macro simply returns `custom_schema_name`?",
    options: [
      "dbt raises a compilation error because the macro never references `target`.",
      "dbt uses the custom schema alone, so development runs write to production.",
      "dbt appends the target schema twice, producing names such as `dev_dev_marketing`.",
      "dbt creates the custom schema in the default database instead of the target database."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nBy default, dbt builds development schema names as the target schema plus the custom schema, such as `dev_john_marketing`. If the macro returns only `custom_schema_name`, every environment uses the same schema name. A developer's `dbt run` then writes into the shared `marketing` schema, which production also uses. Checking `target.name` keeps development builds separate.\n\nINCORRECT COMPETING OPTIONS:\n- Compilation error: a `generate_schema_name` override compiles without referencing `target`.\n- Target schema appended twice: returning only `custom_schema_name` removes the target prefix and does not duplicate it.\n- Wrong default database: the database comes from the target and database settings, which this macro does not control.",
    references: "https://docs.getdbt.com/docs/build/custom-schemas#how-does-dbt-use-custom-schemas",
    dbtVersionFocus: "Environments & Sandboxes"
  },
  {
    id: 68,
    category: "Developing and optimizing dbt models",
    difficulty: "Advanced",
    questionText: "An incremental model is configured with a `unique_key` constraint. During execution, some records returned by the source model query contain null values in the unique key column. How do common database adapters (such as Snowflake or BigQuery) handle these records, and what is the resulting side-effect?",
    options: [
      "The adapter drops rows with a null `unique_key` before loading them into the target.",
      "The adapter fails the run with a primary key constraint violation on the target.",
      "The adapter inserts duplicates, since a null key never matches in the merge.",
      "The adapter replaces the null with a generated value to keep each row unique."
    ],
    correctAnswers: [2],
    explanation: "CORRECT ACTION:\nThe incremental update matches source and target rows with an equality comparison on `unique_key`. Null never equals null in SQL, so a row with a null key matches nothing in the target. It is inserted as new on each run, which produces duplicate rows.\n\nINCORRECT COMPETING OPTIONS:\n- Dropping rows with a null key: the adapter does not filter any rows out.\n- Primary key constraint violation: dbt does not create a primary key from `unique_key`, and Snowflake and BigQuery do not enforce one.\n- Generating a replacement value: neither dbt nor the adapter rewrites key values.",
    references: "https://docs.getdbt.com/reference/resource-configs/unique_key",
    dbtVersionFocus: "Core Incremental Gotchas"
  },
  {
    id: 69,
    category: "Debugging data modeling errors",
    difficulty: "Advanced",
    questionText: "A custom macro calls `run_query` against the database catalog and reads `results.columns[0].values()`. Every dbt command fails while parsing the project because `results` is `None`. What dbt concept explains this, and what is the correct fix?",
    options: [
      "Partial parsing skips the macro during `dbt compile`; adding `--no-partial-parse` makes the queries run.",
      "dbt renders Jinja at parse time, when `run_query` returns nothing; wrap the call in `{% if execute %}`.",
      "`run_query` only works inside hooks; moving the macro call into a `pre-hook` fixes the failure.",
      "The macro runs before the adapter connects; setting `threads: 1` in `profiles.yml` delays it until the connection opens."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\ndbt renders Jinja during parsing to build the project graph, and no queries run in that phase. Calls such as `run_query` return no usable result there, which breaks code that depends on them. Wrapping the logic in `{% if execute %}` runs it only when dbt is executing queries.\n\nINCORRECT COMPETING OPTIONS:\n- `--no-partial-parse`: this flag only forces a full re-parse and does not enable queries during parsing.\n- Moving the call into a `pre-hook`: `run_query` works in model code and macros, and the parse-time problem would remain for the macro.\n- Setting `threads: 1`: thread count has no effect on whether queries run during parsing.",
    references: "https://docs.getdbt.com/reference/dbt-jinja-functions/execute",
    dbtVersionFocus: "Parsing vs Execution Phases"
  },
  {
    id: 70,
    category: "Developing and optimizing dbt models",
    difficulty: "Intermediate",
    questionText: "In dbt Core 1.11, what is the structural relationship between a semantic model and a metric in the dbt Semantic Layer?",
    options: [
      "A semantic model defines the calculation over a table; a metric defines the entities and dimensions.",
      "A semantic model defines entities, dimensions and measures; a metric calculates over measures.",
      "A semantic model is a table of pre-aggregated results; a metric is a column inside that table.",
      "A semantic model and a metric are the same resource, defined under two different names."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nA semantic model maps a table or view to semantic concepts: entities (join keys), dimensions (attributes) and measures (aggregations). A metric is a calculation, such as a ratio or cumulative sum, defined on top of those measures.\n\nINCORRECT COMPETING OPTIONS:\n- Semantic model defines the calculation: the roles are reversed, since the calculation belongs to the metric.\n- Pre-aggregated table with a metric column: a semantic model describes an existing relation and does not store aggregated results, and a metric is not a column.\n- Same resource under two names: they are distinct resource types with different purposes.",
    references: "https://docs.getdbt.com/docs/build/semantic-models",
    dbtVersionFocus: "v1.6+ (Semantic Layer)"
  },
  {
    id: 71,
    category: "Developing and optimizing dbt models",
    difficulty: "Basic",
    questionText: "By default, which column that dbt adds to a snapshot table is NULL for the row holding the current version of a record?",
    options: [
      "`dbt_valid_from`",
      "`dbt_valid_to`",
      "`dbt_scd_id`",
      "`dbt_updated_at`"
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nSnapshots keep one row per version of a record. By default, the current version has a `dbt_valid_to` of NULL. When a change is detected, dbt sets `dbt_valid_to` on the old row to the time of the change and inserts a new row with a NULL `dbt_valid_to`. The `dbt_valid_to_current` config replaces this NULL with a custom value, such as a far-future date.\n\nINCORRECT COMPETING OPTIONS:\n- `dbt_valid_from`: it holds the time a version became valid and is populated on every row.\n- `dbt_scd_id`: it is a generated unique identifier for each row version and is never NULL.\n- `dbt_updated_at`: it holds the source record's change timestamp, or the snapshot time under the `check` strategy without `updated_at`, and is populated on every row.",
    references: "https://docs.getdbt.com/docs/build/snapshots",
    dbtVersionFocus: "Core Snapshots"
  },
  {
    id: 72,
    category: "Debugging data modeling errors",
    difficulty: "Intermediate",
    questionText: "If a model's materialization statement encounters a syntax error or execution failure during `dbt run`, does dbt execute the post-hook defined for that model?",
    options: [
      "Yes, dbt runs the post-hook to roll back the failed model.",
      "No, dbt skips the post-hook if the model fails to build.",
      "Yes, dbt runs the post-hook after a failure just as it does after a success.",
      "Yes, dbt runs the post-hook for syntax errors but skips it for warehouse failures."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\ndbt runs a model's post-hook only after the model has been built successfully. If the materialization fails for any reason, the model is marked as an error and its post-hook does not run.\n\nINCORRECT COMPETING OPTIONS:\n- Post-hook as a rollback: post-hooks are ordinary SQL statements and dbt does not use them to undo failed builds.\n- Running after any outcome: post-hooks depend on the model succeeding, so they are not run after a failure.\n- Running only for syntax errors: dbt does not distinguish between error types when deciding whether to run a post-hook.",
    references: "https://docs.getdbt.com/reference/resource-configs/pre-hook-post-hook",
    dbtVersionFocus: "Hooks Execution Order"
  },
  {
    id: 73,
    category: "Managing dbt models governance",
    difficulty: "Intermediate",
    questionText: "When adopting a distributed team project setup with dbt Mesh, a developer in a downstream `finance` project needs to reference a public model named `stg_customers` owned by an upstream project named `core_platform`. What is the correct syntax for the `ref()` function?",
    options: [
      "`{{ ref('core_platform.stg_customers') }}`",
      "`{{ ref('core_platform', 'stg_customers') }}`",
      "`{{ ref(project='core_platform', model='stg_customers') }}`",
      "`{{ source('core_platform', 'stg_customers') }}`",
      "`{{ ref('stg_customers', 'core_platform') }}`"
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nA cross-project reference passes two arguments to `ref`: the upstream project name first, then the model name. The upstream project name is the one set in its `dbt_project.yml`, and the model must be public.\n\nINCORRECT COMPETING OPTIONS:\n- Dot-separated project and model in one argument: `ref` treats a single argument as a model name and does not parse project prefixes.\n- Keyword arguments `project` and `model`: `ref` does not accept these keyword names.\n- `source('core_platform', 'stg_customers')`: `source` points to raw tables declared in a sources file, not to models.\n- Model name first, then project: the project name must be the first argument.",
    references: "https://docs.getdbt.com/reference/dbt-jinja-functions/ref#cross-project-ref",
    dbtVersionFocus: "v1.6+ (dbt Mesh)"
  },
  {
    id: 74,
    category: "Developing and optimizing dbt models",
    difficulty: "Basic",
    questionText: "When planning a dbt transformation strategy, why is storing large, frequently updated transactional tables as dbt seeds considered a major anti-pattern?",
    options: [
      "Seeds are materialized as views, so downstream queries rescan the CSV on every run.",
      "Seeds are CSV files in the repository, so large or changing data does not fit them.",
      "Seeds require elevated privileges that must be configured in `profiles.yml`.",
      "Seeds are left out of the lineage graph shown in the dbt docs site."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nSeeds are CSV files stored in the project repository and loaded into the warehouse with `dbt seed`. They suit small, static lookup data. Large or frequently changing tables would bloat the git history and have to be re-committed on each change, and they should be loaded with a proper ingestion process.\n\nINCORRECT COMPETING OPTIONS:\n- Seeds materialized as views: seeds are loaded as tables.\n- Elevated privileges in `profiles.yml`: seeds use the same connection and permissions as other resources.\n- Missing from the lineage graph: seeds appear in the lineage graph and can be referenced with `ref`.",
    references: "https://docs.getdbt.com/docs/build/seeds",
    dbtVersionFocus: "Core"
  },
  {
    id: 75,
    category: "Implementing and maintaining external dependencies",
    difficulty: "Advanced",
    questionText: "A source table declared in `sources.yml` does not exist in the warehouse, and `dbt source freshness` fails with a database error in CI. Which change stops that table from breaking the check?",
    options: [
      "Set `freshness: null` on the source table in `sources.yml` so dbt does not check it.",
      "Delete `target/sources.json` so dbt has no previous result for the table.",
      "Remove `loaded_at_field` from the table so dbt skips it and reports a warning.",
      "Add `--warn-error` to the command so the missing table is reported as a warning."
    ],
    correctAnswers: [0],
    explanation: "CORRECT ACTION:\nSetting `freshness: null` on a source table excludes it from freshness calculations, so dbt does not check it. The failure itself is a database error because dbt cannot read the freshness of a table that does not exist.\n\nINCORRECT COMPETING OPTIONS:\n- Deleting `target/sources.json`: that file only records the results of a freshness check and does not stop dbt from checking the table.\n- Removing `loaded_at_field`: dbt does not skip the table; it calculates freshness from warehouse metadata where possible, or fails where metadata is unavailable.\n- `--warn-error`: this flag turns warnings into errors rather than the reverse.",
    references: "https://docs.getdbt.com/reference/resource-properties/freshness",
    dbtVersionFocus: "v1.7+ (Source Freshness)"
  },
  {
    id: 76,
    category: "Leveraging the dbt state",
    difficulty: "Intermediate",
    questionText: "After a dbt execution finishes, a `run_results.json` file is generated inside the `target/` directory. What telemetry metadata does this file primarily capture, and what is its main use case?",
    options: [
      "It stores the row values returned by each model in the run.",
      "It records the status, timing and adapter response of each node.",
      "It lists every node in the project with its dependencies and configuration.",
      "It stores the compiled SQL cache that dbt reuses on the next run."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\n`run_results.json` records the outcome of an invocation: the status of each node (success, error, skip, fail), the execution time, and the adapter response such as rows affected. Monitoring and orchestration tools read it to track run history.\n\nINCORRECT COMPETING OPTIONS:\n- Row values from each model: the file contains metadata about execution and never the data itself.\n- Every node with dependencies and configuration: that describes `manifest.json`, which captures the project graph.\n- Compiled SQL cache for the next run: dbt does not reuse this file between runs, and parsing speed-ups come from `partial_parse.msgpack`.",
    references: "https://docs.getdbt.com/reference/artifacts/run-results-json",
    dbtVersionFocus: "Core Artifacts"
  },
  {
    id: 77,
    category: "Developing and optimizing dbt models",
    difficulty: "Intermediate",
    questionText: "A developer writes a custom SQL script containing standard references and places it in the `analyses/` folder. What is the behavior when they execute `dbt compile`?",
    options: [
      "dbt materializes the compiled query as a table in the target database.",
      "dbt runs the compiled query and writes the result to the log.",
      "dbt compiles the file into `target/compiled/` and creates no relation.",
      "dbt fails with a compilation error because `analyses/` files cannot contain `ref`."
    ],
    correctAnswers: [2],
    explanation: "CORRECT ACTION:\nFiles in `analyses/` can use `ref`, `source` and macros, and `dbt compile` compiles them to plain SQL under `target/compiled/`. They are never materialized as tables or views, which makes them useful for audit or one-off queries. `dbt run` does not execute them either.\n\nINCORRECT COMPETING OPTIONS:\n- Materializing as a table: only models are materialized, and analyses are not.\n- Running the query and logging the result: dbt compiles analyses but does not execute them.\n- Compilation error for `ref`: analyses support `ref`, `source` and other Jinja functions.",
    references: "https://docs.getdbt.com/docs/build/analyses",
    dbtVersionFocus: "Core"
  },
  {
    id: 78,
    category: "Implementing dbt tests",
    difficulty: "Intermediate",
    questionText: "An analytics engineer is writing a custom generic test named `is_even` to reuse in validation schemas. How must they declare and structure this test to ensure dbt registers it as an applicable data test?",
    options: [
      "Create `is_even.sql` in `tests/` with a query that returns the failing rows.",
      "Define a macro `test_is_even(model, column_name)` that returns the failing rows.",
      "Create a macro named `is_even` in `macros/` that returns `true` when the values pass.",
      "Declare `is_even` under `data_tests:` in `dbt_project.yml` with an expression for the passing rows."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nA generic test is a macro whose name starts with `test_`, or an equivalent `{% test %}` block, that takes `model` and, for column tests, `column_name`. Its query returns the rows that fail the check, and the test passes when no rows are returned.\n\nINCORRECT COMPETING OPTIONS:\n- `is_even.sql` in `tests/`: this is a singular test tied to specific models and cannot be reused with arguments.\n- Macro named `is_even` that returns true: without the `test_` prefix dbt does not register it as a test, and tests return failing rows rather than a boolean.\n- Declaring `is_even` in `dbt_project.yml`: that file configures tests that already exist and cannot define new ones.",
    references: "https://docs.getdbt.com/docs/build/data-tests#generic-data-tests",
    dbtVersionFocus: "Core Custom Tests"
  },
  {
    id: 79,
    category: "Developing and optimizing dbt models",
    difficulty: "Intermediate",
    questionText: "A developer defines a model's materialization in three separate locations: `dbt_project.yml` sets it as `view` for the directory, `schema.yml` sets it as `ephemeral`, and the model's inline SQL `config()` block sets it as `table`. How will the compiling engine materialize this model?",
    options: [
      "dbt materializes it as a view because `dbt_project.yml` has the highest precedence.",
      "dbt materializes it as ephemeral because properties files are applied after SQL configs.",
      "dbt materializes it as a table because `config()` has the highest precedence.",
      "dbt fails with a config conflict error because the setting is defined in three places."
    ],
    correctAnswers: [2],
    explanation: "CORRECT ACTION:\ndbt applies the most specific configuration. A `config()` block in the model file overrides the properties file, and the properties file overrides `dbt_project.yml`. The model is therefore built as a table.\n\nINCORRECT COMPETING OPTIONS:\n- View from `dbt_project.yml`: project-level settings have the lowest precedence.\n- Ephemeral from the properties file: the properties file ranks below the in-file `config()` block.\n- Error for repeated settings: defining a config at several levels is allowed and the most specific one wins.",
    references: "https://docs.getdbt.com/reference/configs-and-properties",
    dbtVersionFocus: "Configuration Precedence"
  },
  {
    id: 80,
    category: "Developing and optimizing dbt models",
    difficulty: "Advanced",
    questionText: "Under incremental materialization on Snowflake or BigQuery, how can a developer configure dbt to only modify a specific subset of columns (e.g., `updated_at`, `status`) upon matching unique keys, instead of overriding all columns?",
    options: [
      "Set `on_schema_change: ignore` in `dbt_project.yml` for the incremental model.",
      "Set `merge_update_columns` in the model config to a list of columns.",
      "Set `incremental_predicates` in the model config to the list of columns to update.",
      "Set `incremental_strategy: append` and list the columns to update in `unique_key`."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nWith the `merge` incremental strategy, `merge_update_columns` takes a list of columns. When a source row matches an existing row on `unique_key`, only the listed columns are updated and the others keep their values.\n\nINCORRECT COMPETING OPTIONS:\n- `on_schema_change: ignore`: it controls how new or removed columns are handled and does not select columns to update.\n- `incremental_predicates`: it adds SQL conditions that limit which rows are considered and does not accept a column list.\n- `append` strategy with columns in `unique_key`: `append` only inserts rows and never updates matches, and `unique_key` identifies rows rather than columns to update.",
    references: "https://docs.getdbt.com/docs/build/incremental-strategy",
    dbtVersionFocus: "Core Incremental Customizations"
  },
  {
    id: 81,
    category: "Managing dbt models governance",
    difficulty: "Advanced",
    questionText: "An analytics agency configures dbt model contracts (`contract: {enforced: true}`) for multiple key warehouse staging relations. During a routine run, dbt compiles the staging SQL file. If the query output contains a different column datatype than specified in the schema YAML (e.g., `FLOAT` instead of `INT`), what will happen, and how is it processed?",
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
      "dbt builds the model with the returned `FLOAT` type and logs a warning.",
      "dbt casts the column to the `data_type` declared in the YAML and builds the model.",
      "dbt fails the model because the returned type differs from the declared `data_type`.",
      "dbt builds the model and then fails the tests that check column types."
    ],
    correctAnswers: [2],
    explanation: "CORRECT ACTION:\nWith `contract: {enforced: true}`, dbt compares the data types returned by the model's query with the `data_type` values declared in the YAML. A mismatch such as `FLOAT` instead of integer makes the model fail and the relation is not built.\n\nINCORRECT COMPETING OPTIONS:\n- Building with a warning: a contract violation is an error, not a warning.\n- Casting to the declared type: dbt does not change the model's SQL to fit the contract.\n- Building and then failing type tests: the check happens when the model is built, not afterwards through tests.",
    references: "https://docs.getdbt.com/docs/collaborate/govern/model-contracts",
    dbtVersionFocus: "v1.5+ (Model Contracts)"
  },
  {
    id: 82,
    category: "Managing dbt models governance",
    difficulty: "Intermediate",
    questionText: "In multi-project dbt Mesh structures, an engineer is assigning boundaries to protect internal models. What is the fundamental behavioral difference between assigning a model `access: private` versus `access: protected`?",
    codeSnippet: `models:
  - name: int_sales_calculations
    config:
      access: private`,
    codeLanguage: "yaml",
    options: [
      "Private models can be referenced by any project; protected models only by their own project.",
      "Private models can only use the `ephemeral` materialization; protected models can use any materialization.",
      "Private models are limited to their group; protected models are open to the whole project.",
      "Private models need an enforced contract; protected models can be referenced without one."
    ],
    correctAnswers: [2],
    explanation: "CORRECT ACTION:\nA `private` model can be referenced only by models in the same group. A `protected` model, the default, can be referenced by any model in the same project. Only `public` models can be referenced from other projects.\n\nINCORRECT COMPETING OPTIONS:\n- Private visible to any project: cross-project references require `access: public`.\n- Private limited to `ephemeral`: access level does not restrict the materialization.\n- Private requires a contract: enforced contracts are expected for public models, not required for private ones.",
    references: "https://docs.getdbt.com/docs/collaborate/govern/model-access",
    dbtVersionFocus: "v1.6+ (Model Access Controls)"
  },
  {
    id: 83,
    category: "Developing and optimizing dbt models",
    difficulty: "Advanced",
    questionText: "A `profiles.yml` target reads its schema with `env_var`. Which statement about `env_var` is true?",
    options: [
      "`env_var` takes a single argument and raises an error if the variable is not set.",
      "`env_var` takes an optional second argument as the default for an unset variable.",
      "`env_var` defaults must be declared under `vars` in `dbt_project.yml`.",
      "`env_var` can be used in `dbt_project.yml` but not in `profiles.yml` files."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nThe `env_var` function accepts an optional second argument that dbt uses as the default value when the environment variable is not set. Without a default, dbt raises an error for a missing variable. Secrets such as tokens should still be read from the environment rather than written into the file.\n\nINCORRECT COMPETING OPTIONS:\n- Single argument that errors when unset: `env_var` accepts a second argument as a fallback.\n- Defaults declared under `vars`: the default is passed directly in the `env_var` call.\n- Not usable in `profiles.yml`: `env_var` is commonly used in `profiles.yml` for credentials.",
    references: "https://docs.getdbt.com/reference/dbt-jinja-functions/env_var",
    dbtVersionFocus: "v1.5+ (Env Var Fallbacks)"
  },
  {
    id: 84,
    category: "Developing and optimizing dbt models",
    difficulty: "Advanced",
    questionText: "An analytics developer has written their own version of the `generate_surrogate_key` macro in their project, but models that call `dbt_utils.generate_surrogate_key` still use the version from the installed `dbt_utils` package. What is the correct way to make dbt use the local version?",
    codeSnippet: `-- macros/generate_surrogate_key.sql
{% macro default__generate_surrogate_key(field_list) %}
    md5({{ field_list | join(" || '-' || ") }})
{% endmacro %}

-- models/dim_orders.sql
select
    {{ dbt_utils.generate_surrogate_key(['customer_id', 'order_id']) }} as order_key,
    *
from {{ ref('stg_orders') }}`,
    codeLanguage: "jinja",
    options: [
      "Edit the macro file inside `dbt_packages/dbt_utils/macros/`, which `dbt deps` preserves between installs.",
      "Add a `dispatch` config in `dbt_project.yml` listing the local project first in `search_order`.",
      "Declare the local macro under `macro-paths` in `dbt_project.yml` so it replaces package macros of the same name.",
      "Macros from installed packages cannot be overridden; only their arguments can be changed by the project."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\n`dbt_utils.generate_surrogate_key` calls its implementation through `adapter.dispatch`, and the `dispatch` config in `dbt_project.yml` sets the `search_order` for the `dbt_utils` macro namespace. Listing the local project before `dbt_utils` makes dbt pick the project's `default__generate_surrogate_key` instead of the package's version.\n\nINCORRECT COMPETING OPTIONS:\n- Editing files in `dbt_packages/`: `dbt deps` reinstalls packages and overwrites local edits.\n- Declaring the macro under `macro-paths`: this setting only tells dbt where macro files live and does not change resolution order.\n- Packages cannot be overridden: `dispatch` exists to override package macros.",
    references: "https://docs.getdbt.com/reference/dbt-jinja-functions/dispatch",
    dbtVersionFocus: "Core (Macro Dispatch Architecture)"
  },
  {
    id: 85,
    category: "Developing and optimizing dbt models",
    difficulty: "Intermediate",
    questionText: "A security engineer manages privileges on models built by dbt. A model's properties config declares a `grants` block. When does dbt apply these grants?",
    codeSnippet: `models:
  - name: dim_customers
    config:
      grants:
        select: ['reporter_role']`,
    codeLanguage: "yaml",
    options: [
      "dbt applies the grants during `dbt compile`, before the model is built.",
      "dbt runs `grant` statements after the model is built, as part of the same run.",
      "dbt applies the grants only when `dbt run-operation` is called on a grants macro.",
      "dbt applies the grants only through `pre-hook` entries configured on the model."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nAfter dbt builds a model, it runs the `grant` statements declared in the `grants` config as part of the same run. Because a rebuilt table or view can replace the previous relation, applying grants after the build keeps the declared permissions in place.\n\nINCORRECT COMPETING OPTIONS:\n- Grants during `dbt compile`: compile only renders SQL and does not change permissions in the warehouse.\n- Grants only through `dbt run-operation`: grants are applied automatically during the run without a separate operation.\n- Grants only through `pre-hook`: the `grants` config removes the need for hand-written hooks.",
    references: "https://docs.getdbt.com/reference/resource-configs/grants",
    dbtVersionFocus: "Core Grants"
  },
  {
    id: 86,
    category: "Developing and optimizing dbt models",
    difficulty: "Intermediate",
    questionText: "An engineer is writing a dynamic database helper macro that executes checks against existing tables. If we call the adapter helper `adapter.get_relation(database, schema, identifier)` and the target table does not exist physically in the database, how does dbt handle the response?",
    codeSnippet: `{% set existing_relation = adapter.get_relation(
    database=target.database,
    schema=target.schema,
    identifier='my_table'
) %}`,
    codeLanguage: "jinja",
    options: [
      "It raises a compilation error and stops the `dbt build`.",
      "It returns an empty relation object whose type is `null`.",
      "It returns `none`, which should be checked before use.",
      "It returns `false`, which is then tested with `is false`."
    ],
    correctAnswers: [2],
    explanation: "CORRECT ACTION:\nWhen the relation is not found, `adapter.get_relation` returns `none` instead of raising an error. A macro should test `existing_relation is not none` before reading properties such as `name` or `type`.\n\nINCORRECT COMPETING OPTIONS:\n- Compilation error: a missing relation is a normal result, not an error.\n- Empty relation object: no relation object is returned when the table does not exist.\n- Returning `false`: the missing-relation value is `none`, not a boolean.",
    references: "https://docs.getdbt.com/reference/dbt-jinja-functions/adapter#get_relation",
    dbtVersionFocus: "Core Adapter APIs"
  },
  {
    id: 87,
    category: "Developing and optimizing dbt models",
    difficulty: "Advanced",
    questionText: "A data team has run a snapshot of customer memberships for months. The snapshot's query is `select * from {{ source('crm', 'memberships') }}`. During an upstream system migration, a new column called `loyalty_tier` is added to the source table. What happens to the existing snapshot table on the next `dbt snapshot` run?",
    options: [
      "dbt rebuilds the snapshot table from scratch and discards the history.",
      "dbt adds the column to the snapshot and leaves it null in old rows.",
      "dbt fails the snapshot until the column is added to the table manually.",
      "dbt skips the new column and keeps the snapshot table unchanged."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nWhen the columns of the snapshot query change, dbt creates the new columns in the existing snapshot table. Because the query selects `*`, `loyalty_tier` is now part of the query, so dbt adds it. Rows that were already stored have a null value in the new column, and dbt does not backfill them. If the query listed its columns explicitly, the new source column would not reach the snapshot until someone added it to the query. Snapshots have no `on_schema_change` config: that setting belongs to incremental models, whose default (`ignore`) does not add new columns.\n\nINCORRECT COMPETING OPTIONS:\n- Rebuilding from scratch: dbt alters the existing table and keeps the stored history.\n- Failing until a manual change: dbt adds the column itself without a manual migration.\n- Skipping the new column: that happens only when the snapshot query does not select the column; `select *` does.",
    references: "https://docs.getdbt.com/docs/build/snapshots#schema-evolution-for-snapshots",
    dbtVersionFocus: "Core Snapshot Behaviours"
  },
  {
    id: 88,
    category: "Developing and optimizing dbt models",
    difficulty: "Intermediate",
    questionText: "An analytics engineer wants to run a specific group of models during a scheduled staging run. What is the correct dbt selection syntax and meaning difference between separating filters with a comma (`,`) versus separating them with a space?",
    codeSnippet: `dbt run --select "tag:hourly,path:models/staging"
dbt run --select "tag:hourly path:models/staging"`,
    codeLanguage: "bash",
    options: [
      "A comma selects models that match either criterion; a space selects models that match both.",
      "A comma selects models that match both criteria; a space selects models that match either.",
      "A comma runs the selected models in sequence; a space runs them in parallel.",
      "A comma separates the models to run; a space is not valid in a selector."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nA comma between selector methods is an intersection, so only models matching both `tag:hourly` and `path:models/staging` run. A space is a union, so models matching either one run.\n\nINCORRECT COMPETING OPTIONS:\n- Comma as either and space as both: this reverses the two operators.\n- Sequential versus parallel execution: the separators control selection, and execution order follows the DAG and `--threads`.\n- Space is not valid: a space is the union operator in `--select`.",
    references: "https://docs.getdbt.com/reference/node-selection/syntax",
    dbtVersionFocus: "Core Selectors"
  },
  {
    id: 89,
    category: "Developing and optimizing dbt models",
    difficulty: "Intermediate",
    questionText: "`dbt deps` fails with a version conflict: two packages installed from dbt Hub, `fivetran_log` and `dbt_utils`, each require a range of the same shared helper package, and the two ranges do not overlap. How must this conflict be resolved?",
    options: [
      "Set `require-dbt-version` in `dbt_project.yml` so dbt ignores package version constraints.",
      "Change the version constraint in the `packages.yml` inside the installed package in `dbt_packages/`.",
      "Change the version of one of the two packages in the root `packages.yml` so their ranges overlap.",
      "Run `dbt clean` and then `dbt deps` again, so dbt resolves the conflict on a fresh install."
    ],
    correctAnswers: [2],
    explanation: "CORRECT ACTION:\nFor packages installed from dbt Hub, dbt handles a shared dependency by installing one version that satisfies every package that requires it. When the required ranges do not overlap, no such version exists. Moving one of the importing packages to a release whose requirement overlaps with the other gives dbt a version it can install. Listing the shared package in the root `packages.yml` does not help: a root entry adds one more constraint and cannot satisfy two ranges that do not overlap.\n\nINCORRECT COMPETING OPTIONS:\n- Setting `require-dbt-version`: this setting checks the dbt version and has no effect on package version constraints.\n- Editing the installed package's `packages.yml`: `dbt deps` reinstalls packages and overwrites changes in `dbt_packages/`.\n- Running `dbt clean` and `dbt deps` again: the constraints are unchanged, so the same conflict appears.",
    references: "https://docs.getdbt.com/docs/build/packages",
    dbtVersionFocus: "Dependency Management"
  },
  {
    id: 90,
    category: "Implementing dbt tests",
    difficulty: "Intermediate",
    questionText: "In dbt Core v1.8+, how does an analytics engineer provide static mock data inputs to execute a component level unit test on a transformation model, and where in the filesystem is this declared?",
    codeSnippet: `-- models/marts/dim_orders.sql
select
    order_id,
    sum(amount) as order_total
from {{ ref('stg_orders') }}
group by order_id`,
    codeLanguage: "sql",
    options: [
      "In CSV files in the `seeds/` directory, which all unit tests require.",
      "As `rows` under `given` in a `unit_tests` entry of a `.yml` file.",
      "As `vars` in `dbt_project.yml` that the model reads with `var()` calls.",
      "In singular test `.sql` files stored in the `tests/` directory."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nA unit test is declared in a properties `.yml` file under `unit_tests`. The `given` block lists each input, and its `rows` hold the mock records that dbt uses in place of the real tables.\n\nINCORRECT COMPETING OPTIONS:\n- CSV files in `seeds/`: unit tests can define rows in YAML, so seeds are not required.\n- `vars` in `dbt_project.yml`: variables do not replace the inputs of a unit test.\n- Singular test files in `tests/`: those hold data test queries, not unit test inputs.",
    references: "https://docs.getdbt.com/docs/build/unit-tests",
    dbtVersionFocus: "v1.8+ (Unit Testing Framework)"
  },
  {
    id: 91,
    category: "Implementing and maintaining external dependencies",
    difficulty: "Advanced",
    questionText: "When configuring `dbt source freshness` checks on a massive, several-terabyte database table on BigQuery or Snowflake, what is a major performance and financial gotcha, and how is it resolved in source properties?",
    codeSnippet: `sources:
  - name: heavy_clicks
    tables:
      - name: raw_events
        config:
          loaded_at_field: loaded_at
          freshness:
            warn_after: {count: 6, period: hour}`,
    codeLanguage: "yaml",
    options: [
      "Set `warn_after` to a longer period so the freshness query scans fewer rows.",
      "Add a `filter` to the source `freshness` config so the query scans only recent rows.",
      "Add `store_failures: true` to the freshness config so the last result is reused.",
      "Run `dbt source freshness` with `--threads 1` so the scan uses less compute."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nThe freshness check queries the maximum value of the `loaded_at_field`, which can scan the whole table. The `filter` property adds a `where` condition to that query so it reads only recent data, for example a recent partition.\n\nINCORRECT COMPETING OPTIONS:\n- Longer `warn_after`: the threshold changes when a warning is raised, not how much data the query scans.\n- `store_failures`: this config applies to data tests and does not reduce the freshness query.\n- `--threads 1`: threads set how many nodes run at once and do not change the size of the scan.",
    references: "https://docs.getdbt.com/reference/resource-properties/freshness#filter",
    dbtVersionFocus: "Core Performance Customization"
  },
  {
    id: 92,
    category: "Developing and optimizing dbt models",
    difficulty: "Advanced",
    questionText: "A BigQuery incremental model uses the default incremental strategy and the config below. Why can the incremental runs after the first build fail, and how do you prevent it?",
    codeSnippet: `{{ config(
    materialized='incremental',
    unique_key='event_id',
    partition_by={
      "field": "event_date",
      "data_type": "date",
      "granularity": "day"
    },
    require_partition_filter=true
) }}`,
    codeLanguage: "jinja",
    options: [
      "`require_partition_filter` is not supported on `date` partitions; remove it from the config.",
      "The `MERGE` does not filter the destination's partition column; add `incremental_predicates`.",
      "dbt adds a partition filter only on a full refresh; run `dbt run --full-refresh` on every build.",
      "The `MERGE` needs `cluster_by` on `event_date`; add it so BigQuery can prune partitions."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nThe default incremental strategy on BigQuery is `merge`. With `require_partition_filter` enabled, BigQuery rejects any query that does not filter on the partition column. The incremental `MERGE` reads the destination table, so it needs a predicate on `event_date` for that table, which `incremental_predicates` adds through the `DBT_INTERNAL_DEST` alias. A filter inside `is_incremental()` only restricts the rows selected from the source.\n\nINCORRECT COMPETING OPTIONS:\n- Removing the config because dates are unsupported: BigQuery supports it on date-partitioned tables.\n- Full refresh on every build: a full refresh rebuilds the table and removes the benefit of incremental runs.\n- Adding `cluster_by`: clustering orders data inside partitions and does not add the partition filter that BigQuery requires.",
    references: "https://docs.getdbt.com/reference/resource-configs/bigquery-configs#require_partition_filter",
    dbtVersionFocus: "BigQuery Adaption Specs"
  },
  {
    id: 93,
    category: "Implementing dbt tests",
    difficulty: "Basic",
    questionText: "When designing data testing strategies, a developer adds a custom SQL script containing assertions directly into the `tests/` directory. How does dbt evaluate success or failure for these singular tests?",
    options: [
      "A test passes when the query returns a single row containing `true`, and fails otherwise.",
      "A test passes when the query returns zero rows, and fails when it returns any rows.",
      "A test passes when the query returns at least one row, and fails when it returns none.",
      "A test passes when the query runs without a database error, and fails only on an error."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nA singular test is a `select` query that returns the rows that violate a rule. If the query returns zero rows the test passes, and any returned row makes it fail.\n\nINCORRECT COMPETING OPTIONS:\n- Single row with `true`: dbt does not read a boolean value, it counts the returned rows.\n- Passing on at least one row: this reverses the rule, since returned rows are failures.\n- Passing when the query runs without error: a query that runs and returns rows still fails the test.",
    references: "https://docs.getdbt.com/docs/build/data-tests#singular-data-tests",
    dbtVersionFocus: "Core Schema Testing"
  },
  {
    id: 94,
    category: "Developing and optimizing dbt models",
    difficulty: "Advanced",
    questionText: "How does the `delete+insert` incremental strategy differ from the `merge` strategy?",
    options: [
      "`delete+insert` runs only on Postgres, and other adapters reject it.",
      "`delete+insert` runs a `delete` and then an `insert`; `merge` runs one `MERGE` statement.",
      "`delete+insert` is required on Snowflake and BigQuery, because they do not support `merge`.",
      "`delete+insert` replaces `merge` whenever `--full-refresh` is passed, on any adapter."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nThe `delete+insert` strategy deletes the rows in the target that match the `unique_key` of the new data and then inserts the new rows. The `merge` strategy does the same work in a single `MERGE` statement.\n\nINCORRECT COMPETING OPTIONS:\n- Available only on Postgres: several adapters, including Redshift and Snowflake, support `delete+insert`.\n- Required on Snowflake and BigQuery: both support `merge`, and `merge` is the default on both.\n- Used on full refresh: a full refresh rebuilds the table regardless of the incremental strategy.",
    references: "https://docs.getdbt.com/reference/resource-configs/redshift-configs#incremental-strategies",
    dbtVersionFocus: "Core Incremental Strategies"
  },
  {
    id: 95,
    category: "Developing and optimizing dbt models",
    difficulty: "Intermediate",
    questionText: "Inside an advanced dbt Jinja macro, you execute a database call using the `run_query` function. What data type is returned by `run_query`, and how should a developer extract a specific cell value?",
    codeSnippet: `{% set results = run_query('select count(*) as count from ' ~ this) %}`,
    codeLanguage: "jinja",
    options: [
      "A Python dictionary; a cell is read with a key, as in `results['count']`.",
      "An `agate` table; a cell is read by row and column index, as in `results.rows[0][0]`.",
      "A database cursor; a cell is read with a method call, as in `results.fetchone()`.",
      "A Pandas DataFrame; a cell is read by position, as in `results.iloc[0, 0]`."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\n`run_query` returns an `agate` table. A cell is read by position through its rows and columns, such as `results.rows[0][0]` for the first value in the first row. Reading the result should be wrapped in `{% if execute %}` because queries run only at execution time, not during parsing.\n\nINCORRECT COMPETING OPTIONS:\n- Python dictionary: the result is a table object, not a dictionary keyed by column name.\n- Database cursor: dbt returns a fully loaded table, so no cursor methods are available.\n- Pandas DataFrame: dbt uses `agate`, not Pandas, so `iloc` does not exist.",
    references: "https://docs.getdbt.com/reference/dbt-jinja-functions/run_query",
    dbtVersionFocus: "Advanced Macro Jinja API"
  },
  {
    id: 96,
    category: "Debugging data modeling errors",
    difficulty: "Intermediate",
    questionText: "A developer attempts to build circular references involving ephemeral models (e.g., Ephemeral Model A references Model B, which references Ephemeral Model A). How does dbt handle this configuration, and where is the exception thrown?",
    options: [
      "dbt inlines both models as CTEs, and the warehouse resolves the circular reference at run time.",
      "dbt raises a dependency cycle error while it builds the graph, before any SQL runs.",
      "dbt compiles both models and fails with a timeout when the warehouse runs the query.",
      "dbt converts one ephemeral model to a `view` to break the cycle and continues."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\ndbt builds a directed acyclic graph from the `ref` calls, and this includes ephemeral models. A circular reference cannot be ordered, so dbt stops with a dependency cycle error before it runs any SQL.\n\nINCORRECT COMPETING OPTIONS:\n- Inlining as CTEs and letting the warehouse resolve it: the cycle is detected in the graph before any SQL is sent.\n- Failing with a timeout in the warehouse: no query is sent, so no warehouse timeout can occur.\n- Converting one model to a `view`: dbt never changes a materialization to break a cycle.",
    references: "https://docs.getdbt.com/reference/dbt-jinja-functions/ref",
    dbtVersionFocus: "Core DAG rules"
  },
  {
    id: 97,
    category: "Developing and optimizing dbt models",
    difficulty: "Intermediate",
    questionText: "An analytics engineer is running a slim deployment task in their continuous integration pipeline. They execute: `dbt run --select \"models/staging/*\" --exclude \"stg_customers+\"`. What is the final targeted model selection outcome?",
    options: [
      "All staging models run except `stg_customers`, which is also dropped from the warehouse.",
      "All staging models run except `stg_customers` and the models downstream of it.",
      "All staging models run except `stg_customers` and the models upstream of it.",
      "No models run, because `--exclude` cannot be combined with a path selector."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nA `+` placed after a node name selects that node and all of its descendants. Used with `--exclude`, `stg_customers+` removes `stg_customers` and every model downstream of it from the staging selection.\n\nINCORRECT COMPETING OPTIONS:\n- Dropping `stg_customers` from the warehouse: `--exclude` only removes nodes from the selection and does not delete relations.\n- Excluding upstream models: a trailing `+` means descendants, while a leading `+` means ancestors.\n- No models running: `--exclude` can be combined with any `--select` expression.",
    references: "https://docs.getdbt.com/reference/node-selection/exclude",
    dbtVersionFocus: "Core Lineage Selectors"
  },
  {
    id: 98,
    category: "Developing and optimizing dbt models",
    difficulty: "Intermediate",
    questionText: "When using the `dbt clean` command, what configuration in `dbt_project.yml` controls which files and directories are deleted from the disk filesystem, and what is a destructive gotcha to protect against?",
    options: [
      "`clean-targets` lists warehouse schemas to drop; `dbt clean` removes them with a cascading drop.",
      "`clean-targets` lists directories to delete; adding `models/` makes `dbt clean` delete the model files.",
      "`target-path` lists the directories to delete; `dbt clean` always asks for confirmation first.",
      "`clean-targets` lists directories to delete; `dbt clean` skips any directory tracked in git."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\n`clean-targets` in `dbt_project.yml` lists the directories that `dbt clean` deletes, usually `target` and `dbt_packages`. dbt deletes whatever is listed, so adding a source directory such as `models/` would delete those files.\n\nINCORRECT COMPETING OPTIONS:\n- Dropping warehouse schemas: `dbt clean` only removes local directories and does not touch the warehouse.\n- `target-path` with a confirmation prompt: `target-path` sets the output directory, and `dbt clean` deletes without asking.\n- Skipping directories tracked in git: dbt does not check git, so tracked directories are deleted too.",
    references: "https://docs.getdbt.com/reference/commands/clean",
    dbtVersionFocus: "Core CLI commands"
  },
  {
    id: 99,
    category: "Managing dbt models governance",
    difficulty: "Advanced",
    questionText: "To support coordinated project division under dbt Mesh, you cluster models into distinct 'groups'. What is the security behavior of setting `group: finance` on a set of models, and how are private model access boundaries checked?",
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
      "The `finance` role receives `select` on the model, and other roles cannot query it.",
      "Only models in the `finance` group can use `ref` on the model; other models fail to compile.",
      "Any model in the same project can use `ref` on the model; the group only sets the owner.",
      "Models in other projects can use `ref` on the model if their `dependencies.yml` lists it."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nA model with `access: private` can be referenced only by models in the same group. When a model in another group uses `ref` on `int_sensitive_revenues`, dbt raises an error at parse time.\n\nINCORRECT COMPETING OPTIONS:\n- Role receiving `select`: groups control `ref` access in dbt and do not create warehouse permissions, which come from `grants`.\n- Any model in the project can reference it: private access is limited to the group.\n- Cross-project reference through `dependencies.yml`: other projects can only reference `public` models.",
    references: "https://docs.getdbt.com/docs/build/groups",
    dbtVersionFocus: "v1.6+ (Model Governance & Groups)"
  },
  {
    id: 100,
    category: "Developing and optimizing dbt models",
    difficulty: "Advanced",
    questionText: "When generating unique candidate/surrogate keys on composite natural columns, what is a key pitfall of utilizing simple string concatenation (like `col_a || col_b`) in SQL databases, and how do dbt macros safely handle this?",
    codeSnippet: `select {{ dbt_utils.generate_surrogate_key(['customer_id', 'order_id']) }}`,
    codeLanguage: "jinja",
    options: [
      "`||` cuts values off at 255 characters; the macro casts each column to `varchar(255)`.",
      "`||` returns `NULL` if any column is `NULL`; the macro replaces nulls before hashing.",
      "`||` fails on numeric columns; the macro converts every column to `integer` before hashing.",
      "`||` always produces duplicate keys; the macro replaces it with `row_number()` over the columns."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nIn most warehouses, `||` returns `NULL` when any operand is `NULL`, so a row with a null column gets no key. `dbt_utils.generate_surrogate_key` replaces nulls with a placeholder and joins the columns with a delimiter before hashing, so every row gets a non-null key.\n\nINCORRECT COMPETING OPTIONS:\n- Truncation at 255 characters: `||` does not truncate values, and the macro does not cast to `varchar(255)`.\n- Failure on numeric columns: the macro casts columns to strings before hashing, not to `integer`.\n- Always producing duplicates and using `row_number()`: a row number is not derived from the column values, so it is not a surrogate key built from them.",
    references: "https://github.com/dbt-labs/dbt-utils#generate_surrogate_key-source",
    dbtVersionFocus: "Core Surrogate Key Patterns"
  },
  {
    id: 101,
    category: "Implementing and maintaining external dependencies",
    difficulty: "Intermediate",
    questionText: "An analytics engineering manager configures source `freshness` checks on a high-velocity webhook interface dataset. What is the correct syntax for declaring freshness parameters inside source schemas, and does it support string plurals?",
    options: [
      "`warn_after` takes `count` and `period`, and `period` also accepts plural values such as `hours`.",
      "`warn_after` takes `count` and `period`, and `period` accepts only singular values such as `hour`.",
      "`warn_after` takes a single string such as `24 hours`, and plural units are required.",
      "`warn_after` takes `count` and `unit`, and `unit` accepts values such as `hour` or `hours`."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\n`warn_after` is a dictionary with a `count` integer and a `period` value. `period` accepts only `minute`, `hour` or `day`, so a plural such as `hours` is rejected as an invalid configuration.\n\nINCORRECT COMPETING OPTIONS:\n- Plural values accepted for `period`: `hours` and `days` are not valid values, so the configuration fails.\n- Single string such as `24 hours`: `warn_after` is a dictionary with separate `count` and `period` keys, not a single string.\n- `unit` key: the key is named `period`, so `unit` is not a valid property.",
    references: "https://docs.getdbt.com/reference/resource-properties/freshness",
    dbtVersionFocus: "Core Freshness Schemas"
  },
  {
    id: 102,
    category: "Developing and optimizing dbt models",
    difficulty: "Advanced",
    questionText: "A developer filters a metadata table with `{{ this.identifier }}` in a comparison. What do `{{ this }}` and `this.identifier` render as?",
    codeSnippet: `where object_name = '{{ this.identifier }}'`,
    codeLanguage: "jinja",
    options: [
      "`this` renders as the table name only, and `this.schema` gives the fully qualified relation name.",
      "`this` renders as the fully qualified relation name; `this.identifier` is the table name.",
      "`this` renders as the schema name only, and `this.identifier` gives the database name.",
      "`this` renders as the model file path, and `this.identifier` gives the file name without its extension."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\n`this` is a `Relation` object. Rendered as a string it outputs the fully qualified relation name, such as `my_db.my_schema.my_model`, with quoting that follows the adapter's quote policy. Its `identifier` property returns only the table name, which is what a comparison against a metadata column needs.\n\nINCORRECT COMPETING OPTIONS:\n- Table name only with `this.schema` for the full name: `this` renders the full relation name, and `schema` returns only the schema.\n- Schema name only with `this.identifier` as the database: `identifier` is the table name, and the database is `this.database`.\n- Model file path: `this` refers to the relation in the warehouse, not to a file in the project.",
    references: "https://docs.getdbt.com/reference/dbt-jinja-functions/this",
    dbtVersionFocus: "Core metadata Context"
  },
  {
    id: 103,
    category: "Developing and optimizing dbt models",
    difficulty: "Basic",
    questionText: "A developer checks in multiple profile target connections inside their local `profiles.yml` configuration file under an active project named `ecommerce`. If they execute `dbt run` from their local terminal, how does dbt know which target connection (e.g., `dev` vs `prod`) to connect with?",
    options: [
      "dbt uses the first output listed in `outputs`, and `--target` is ignored.",
      "dbt uses the profile's `target` value, unless `--target` overrides it.",
      "dbt uses the output named `dev`, unless `dbt_project.yml` names another.",
      "dbt prompts for a target in the terminal when `--target` is not passed."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nThe `target` key in the profile names the default output. Passing `--target` (or `-t`) on the command line overrides that default for a single invocation.\n\nINCORRECT COMPETING OPTIONS:\n- First output in `outputs`: order does not matter, and `--target` is honoured.\n- Output named `dev`: `dev` is only a naming convention, and the default comes from the `target` key in `profiles.yml`.\n- Terminal prompt for a target: dbt never prompts, it falls back to the `target` key.",
    references: "https://docs.getdbt.com/docs/core/connect-data-platform/profiles.yml#understanding-profilesyml",
    dbtVersionFocus: "Core Connection Profiles"
  },
  {
    id: 104,
    category: "Developing and optimizing dbt models",
    difficulty: "Advanced",
    questionText: "An analytics team configures an incremental model tracking event histories with `on_schema_change: fail`. During a staging schema update, the source model adds two new columns. What is the behavior of dbt on the subsequent incremental execution run?",
    options: [
      "dbt adds the new columns to the target table and continues the run.",
      "dbt stops with an error and leaves the target table unchanged.",
      "dbt ignores the new columns and loads only the existing ones.",
      "dbt rebuilds the target table with the new columns, as with `--full-refresh`."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nWith `on_schema_change: fail`, dbt compares the columns of the new query with the existing target table. When they differ, it raises an error and stops before loading any rows.\n\nINCORRECT COMPETING OPTIONS:\n- Adding the new columns and continuing: this is the behavior of `append_new_columns`.\n- Ignoring the new columns: this is the behavior of `ignore`, the default value.\n- Rebuilding the table: dbt rebuilds only when `--full-refresh` is passed, not because of schema changes.",
    references: "https://docs.getdbt.com/docs/build/incremental-models",
    dbtVersionFocus: "Core Incremental Schemas"
  },
  {
    id: 105,
    category: "Implementing dbt tests",
    difficulty: "Intermediate",
    questionText: "How do dbt unit tests (v1.8+) differ from data tests such as `unique` or singular SQL tests?",
    options: [
      "Unit tests check the data built in the warehouse, whereas data tests validate model logic against mock input rows.",
      "Unit tests validate model logic against mock input rows, whereas data tests check the data built in the warehouse.",
      "Unit tests run only in production, whereas data tests run only in development.",
      "Unit tests validate YAML configuration, whereas data tests validate model SQL syntax."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nUnit tests run a model's SQL against small, static mock inputs defined in YAML and compare the result with an expected output. They verify transformation logic, such as `case` branching, without depending on production data. Data tests such as `unique` query the actual tables built in the warehouse.\n\nINCORRECT COMPETING OPTIONS:\n- Unit tests on warehouse data, data tests on mock rows: this reverses the two; data tests query real built data.\n- Unit tests only in production, data tests only in development: unit tests are recommended for development and CI because their inputs are static, and data tests run wherever the data is built.\n- Unit tests validate YAML, data tests validate SQL syntax: neither kind checks configuration or syntax.",
    references: "https://docs.getdbt.com/docs/build/unit-tests#how-does-unit-testing-differ-from-data-testing",
    dbtVersionFocus: "v1.8+ (Testing Paradigms)"
  },
  {
    id: 106,
    category: "Implementing and maintaining external dependencies",
    difficulty: "Advanced",
    questionText: "A source sets `loaded_at_field` and `freshness` at the source level, and one of its tables declares its own `freshness`, as shown below. Which thresholds does `dbt source freshness` apply to `session_events` and `page_views`?",
    codeSnippet: `sources:
  - name: internal_clicks
    config:
      loaded_at_field: _loaded_at
      freshness:
        warn_after: {count: 12, period: hour}
    tables:
      - name: session_events
        config:
          freshness:
            warn_after: {count: 1, period: hour}
      - name: page_views`,
    codeLanguage: "yaml",
    options: [
      "`session_events` warns after 12 hours; `page_views` warns after 12 hours.",
      "`session_events` warns after 1 hour; `page_views` warns after 12 hours.",
      "`session_events` warns after 1 hour; `page_views` is not checked for freshness.",
      "`session_events` warns after 1 hour; `page_views` warns after 1 hour."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nA `freshness` set on a source applies to every table in that source, and a `freshness` set on a table overrides the source-level value for that table. `session_events` uses its own 1-hour threshold, and `page_views` inherits the source's 12-hour threshold.\n\nINCORRECT COMPETING OPTIONS:\n- Both tables at 12 hours: the table-level `freshness` overrides the source-level one for `session_events`.\n- `page_views` not checked: a table without its own `freshness` inherits the source-level value; only `freshness: null` excludes a table.\n- Both tables at 1 hour: a table-level `freshness` applies only to the table that declares it.",
    references: "https://docs.getdbt.com/reference/resource-properties/freshness",
    dbtVersionFocus: "Source Freshness"
  },
  {
    id: 107,
    category: "Troubleshooting and optimizing dbt pipelines",
    difficulty: "Advanced",
    questionText: "A CI job on Snowflake runs the command below. The `prod_artifacts` directory holds the manifest from the latest production run, and none of the selected nodes exist yet in the CI target schema. What does `dbt clone` do?",
    codeSnippet: `dbt clone --state prod_artifacts --select tag:daily`,
    codeLanguage: "bash",
    options: [
      "It copies the compiled SQL from the state artifacts into the `target` folder instead of compiling.",
      "It creates the selected nodes in the target schema from the production relations, without rebuilding them.",
      "It rebuilds the selected models and stores the results in the `prod_artifacts` folder.",
      "It runs the selected models with `--full-refresh` against the production schema."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\n`dbt clone` reads the manifest in the state directory and creates the selected nodes in the target schema from the relations recorded there. On Snowflake, a node that exists as a table in production is created as a zero-copy clone, and other nodes are created as `select * from` pointer views, so no model SQL is run and no data is duplicated.\n\nINCORRECT COMPETING OPTIONS:\n- Copying compiled SQL into `target`: the command creates warehouse objects, it does not copy compiled files.\n- Rebuilding and storing results in `prod_artifacts`: that folder holds artifacts such as `manifest.json` and receives no model results.\n- Running with `--full-refresh` against production: `dbt clone` writes to the target schema and does not execute model SQL.",
    references: "https://docs.getdbt.com/reference/commands/clone",
    dbtVersionFocus: "v1.6+ (dbt clone)"
  },
  {
    id: 108,
    category: "Developing and optimizing dbt models",
    difficulty: "Advanced",
    questionText: "You are implementing the `microbatch` incremental strategy on Snowflake in dbt Core v1.11 to process clickstream events in batches. Which configs must the model declare?",
    codeSnippet: `models:
  - name: fct_web_logs
    config:
      materialized: incremental
      incremental_strategy: microbatch
      # Which mandatory microbatch properties must be declared here?`,
    codeLanguage: "yaml",
    options: [
      "`unique_key`, `event_time` and `batch_size`",
      "`event_time`, `begin` and `batch_size`",
      "`event_time`, `lookback` and `batch_size`",
      "`unique_key`, `begin` and `lookback`"
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nA `microbatch` model requires `event_time`, the timestamp column used to slice the data, `begin`, the start of the first batch, and `batch_size`, the granularity of each batch such as `day`. On Snowflake, `unique_key` and `lookback` are not required. Some adapters add requirements, such as `unique_key` on Postgres.\n\nINCORRECT COMPETING OPTIONS:\n- `unique_key`, `event_time` and `batch_size`: `begin` is missing, and `unique_key` is not required on Snowflake.\n- `event_time`, `lookback` and `batch_size`: `begin` is missing, and `lookback` is optional with a default value.\n- `unique_key`, `begin` and `lookback`: `event_time` and `batch_size` are missing, and neither `unique_key` nor `lookback` is required on Snowflake.",
    references: "https://docs.getdbt.com/docs/build/incremental-microbatch",
    dbtVersionFocus: "v1.9+ (Microbatch Incremental)"
  },
  {
    id: 109,
    category: "Developing and optimizing dbt models",
    difficulty: "Advanced",
    questionText: "An analytics team that uses the `dbt_utils` package adds the `dispatch` config below to `dbt_project.yml`. What does `search_order` control?",
    codeSnippet: `dispatch:
  - macro_namespace: dbt_utils
    search_order: ['my_project', 'dbt_utils']`,
    codeLanguage: "yaml",
    options: [
      "`search_order` sets the order in which `dbt deps` installs packages into the project.",
      "`search_order` sets the order of projects dbt checks when it resolves a package's macro.",
      "`search_order` sets the order in which macros run in `on-run-start` hooks.",
      "`search_order` sets the order in which packages are loaded into `manifest.json`."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\n`search_order` lists the projects dbt checks, in order, when it resolves a macro that a package dispatches through its namespace, here `dbt_utils`. With `my_project` listed first, dbt uses a matching implementation defined in the project, such as `default__generate_surrogate_key`, before the package's own, so the package code stays unchanged.\n\nINCORRECT COMPETING OPTIONS:\n- Package installation order: `dbt deps` installs what `packages.yml` lists and ignores `dispatch`.\n- Hook execution order: hooks run in the order they are defined, and `dispatch` does not change it.\n- Loading order into `manifest.json`: `dispatch` affects macro lookup only, not how the manifest is built.",
    references: "https://docs.getdbt.com/reference/dbt-jinja-functions/dispatch",
    dbtVersionFocus: "Core Macro Resolution & Governance"
  },
  {
    id: 110,
    category: "Leveraging the dbt state",
    difficulty: "Advanced",
    questionText: "A CI job runs `dbt run --select state:modified --defer --state prod_state`. Only `fct_revenue` is modified. It selects from `ref('stg_orders')`, which is unmodified and does not exist in the CI schema. How does dbt resolve `ref('stg_orders')`?",
    options: [
      "The run fails because `stg_orders` does not exist in the CI schema.",
      "It resolves to the production relation in the `prod_state` manifest.",
      "It resolves to an empty relation created in the CI schema.",
      "It resolves to a clone of `stg_orders` created in the CI schema."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nWith `--defer` and `--state`, dbt resolves a `ref` to a node that is not selected and does not exist in the target database by using the relation recorded in the state manifest. That relation points to the production table, so `stg_orders` is not rebuilt in the CI schema.\n\nINCORRECT COMPETING OPTIONS:\n- Run failure: deferral exists so that unbuilt upstream relations do not cause missing-relation errors.\n- Empty relation in the CI schema: an empty relation comes from `--empty`, which is a different flag from `--defer`.\n- Clone in the CI schema: cloning requires `dbt clone`, and `--defer` creates no objects.",
    references: "https://docs.getdbt.com/reference/node-selection/defer",
    dbtVersionFocus: "Slim CI & Deferral"
  },
  {
    id: 111,
    category: "Developing and optimizing dbt models",
    difficulty: "Advanced",
    questionText: "A model sets `+schema: mart`. The project does not override `generate_schema_name`. The target schema is `analytics_dev` in development and `analytics` in production. Which schema does dbt build the model in?",
    codeSnippet: `models:
  my_project:
    marts:
      +schema: mart`,
    codeLanguage: "yaml",
    options: [
      "`analytics_dev_mart` in development and `mart` in production",
      "`analytics_dev_mart` in development and `analytics_mart` in production",
      "`mart_analytics_dev` in development and `mart_analytics` in production",
      "`analytics_dev` in development and `mart` in production"
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nThe default `generate_schema_name` macro appends the custom schema to the target schema in every environment, so the model builds in `analytics_dev_mart` in development and `analytics_mart` in production. Using the custom schema alone in production requires overriding the macro.\n\nINCORRECT COMPETING OPTIONS:\n- Appending in development and using `mart` alone in production: that behavior needs a custom `generate_schema_name` override; the default does not check the environment.\n- `mart_analytics_dev` and `mart_analytics`: the default macro puts the target schema first and appends the custom schema after an underscore.\n- Ignoring the custom schema in development and using it alone in production: the default macro applies the custom schema in both environments.",
    references: "https://docs.getdbt.com/docs/build/custom-schemas",
    dbtVersionFocus: "Core Schema Macro Customization"
  },
  {
    id: 112,
    category: "Developing and optimizing dbt models",
    difficulty: "Advanced",
    questionText: "When planning snapshot rules for historical capture, what is a crucial performance and cost trade-off between the `check` strategy and the `timestamp` strategy?",
    options: [
      "`timestamp` compares every column in the source row, while `check` compares a single `updated_at` column.",
      "`timestamp` compares a single `updated_at` column, while `check` compares every column in `check_cols`.",
      "`check` requires an `updated_at` column, while `timestamp` requires `check_cols`.",
      "`timestamp` rebuilds the snapshot table on each run, while `check` only inserts new rows."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nThe `timestamp` strategy detects changes by comparing one column, `updated_at`, so it is the cheaper option. The `check` strategy compares each column listed in `check_cols`, and `check_cols: all` means every column, which costs more on wide or large tables.\n\nINCORRECT COMPETING OPTIONS:\n- `timestamp` compares every column and `check` compares one: this reverses the two strategies.\n- `check` needs `updated_at` and `timestamp` needs `check_cols`: each strategy requires its own config, `updated_at` for `timestamp` and `check_cols` for `check`.\n- `timestamp` rebuilds the table and `check` only inserts: both strategies keep history and update changed records without rebuilding the table.",
    references: "https://docs.getdbt.com/docs/build/snapshots",
    dbtVersionFocus: "Core Snapshot Strategies"
  },
  {
    id: 113,
    category: "Developing and optimizing dbt models",
    difficulty: "Advanced",
    questionText: "In the dbt Semantic Layer, the simple metrics `revenue` and `active_users` already exist. You want to add a metric `average_revenue_per_user` that divides `revenue` by `active_users`. Which definition is correct?",
    options: [
      "A `simple` metric with `measure: revenue / active_users` and no other parameters.",
      "A `derived` metric with `expr: revenue / active_users` and both metrics under `metrics`.",
      "A `conversion` metric with `base_measure: revenue` and `conversion_measure: active_users`.",
      "A `cumulative` metric with `measure: revenue` and `window: active_users`."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nA `derived` metric computes a new value from other metrics. Its `type_params` set an `expr` that uses the names of the input metrics, here `revenue / active_users`, and list those metrics under `metrics`.\n\nINCORRECT COMPETING OPTIONS:\n- `simple` metric with a division in `measure`: a `simple` metric points to one measure and cannot hold an expression of metrics.\n- `conversion` metric: it measures how often a base event leads to a conversion event, which is not a division of two metrics.\n- `cumulative` metric with `window`: it accumulates one measure over time, and `window` takes a time span, not a metric.",
    references: "https://docs.getdbt.com/docs/build/about-metricflow",
    dbtVersionFocus: "Semantic Layer (MetricFlow)"
  },
  {
    id: 114,
    category: "Implementing dbt tests",
    difficulty: "Advanced",
    questionText: "An analytics engineer on Postgres is writing a unit test under dbt Core v1.8+ for a model that parses a `json` column from its input `stg_json_source`. How do they mock the value of that column for the input?",
    options: [
      "Return the nested value from a macro listed under `overrides.macros`.",
      "Write the nested value as a JSON string in the `rows` entry.",
      "Supply the nested value through `expect.fixture` for the input.",
      "Mock only the top-level columns, since unit tests cannot set nested values."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nOn Postgres, a `json` column is mocked by writing its whole value as a quoted JSON string in the `rows` entry, such as `'{\"bar\": \"baz\", \"active\": false}'`. Nested keys are part of that string, so no separate mechanism is needed. The format for other complex types, such as arrays and structs, depends on the adapter.\n\nINCORRECT COMPETING OPTIONS:\n- Macro under `overrides.macros`: `overrides.macros` replaces the output of dbt macros such as `is_incremental`, and does not supply row values.\n- `expect.fixture` for the input: `expect` describes the expected output of the model, not its inputs.\n- Top-level columns only: the JSON string in `rows` carries the nested keys with the rest of the value.",
    references: "https://docs.getdbt.com/docs/build/unit-tests",
    dbtVersionFocus: "v1.8+ (Model Unit Testing)"
  },
  {
    id: 115,
    category: "Managing dbt models governance",
    difficulty: "Advanced",
    questionText: "When enforcing a Model Contract (`contract: {enforced: true}`) on an incremental table inside a raw Postgres warehouse, how does dbt Core regulate physical database updates during subsequent model executions?",
    options: [
      "dbt checks the contract on the first run only, and later runs skip the check.",
      "dbt checks the contract on every run and fails before changing the table.",
      "dbt alters the target table to match the contract whenever the data types differ.",
      "dbt checks the contract on `dbt build` only, and `dbt run` skips the check."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nWith an enforced contract, dbt compares the columns and data types the model returns with those declared in the YAML on every run, including incremental runs. If they do not match, the run fails before any change is made to the table.\n\nINCORRECT COMPETING OPTIONS:\n- Check on the first run only: the contract is evaluated each time the model runs.\n- Altering the table to match the contract: dbt reports the mismatch as an error and does not modify column types on its own.\n- Check on `dbt build` only: the contract is part of the model's configuration and applies to `dbt run` as well.",
    references: "https://docs.getdbt.com/docs/mesh/govern/model-contracts",
    dbtVersionFocus: "Core Model Contracts"
  },
  {
    id: 116,
    category: "Developing and optimizing dbt models",
    difficulty: "Advanced",
    questionText: "In the project `sandbox` on Postgres, `dbt_project.yml` declares a project variable and a query comment as shown below. You run `dbt run` without the `--vars` flag and read the SQL that dbt sends in the debug log. Which comment does dbt add to the statement that builds the model `stg_customers`, and where?",
    codeSnippet: `vars:
  cost_center: finance

query-comment:
  comment: "cost_center={{ var('cost_center', 'unassigned') }} node={{ node.unique_id if node else 'internal' }}"
  append: true`,
    codeLanguage: "yaml",
    options: [
      "`/* cost_center=finance node=model.sandbox.stg_customers */`, at the end of the statement",
      "`/* cost_center=unassigned node=model.sandbox.stg_customers */`, at the end of the statement",
      "`/* cost_center=finance node=model.sandbox.stg_customers */`, at the start of the statement",
      "`/* cost_center=unassigned node=internal */`, at the start of the statement"
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nIn a query comment, `var()` reads only variables passed with `--vars` on the command line; variables in the `vars` block of `dbt_project.yml` are not accessible, so the default `unassigned` is used. The `node` context variable holds the node being run, so its `unique_id` is `model.sandbox.stg_customers`. `append: true` adds the comment at the bottom of the query instead of the top.\n\nINCORRECT COMPETING OPTIONS:\n- `cost_center=finance` at the end: the project-level `vars` block is not visible when dbt renders query comments.\n- `cost_center=finance` at the start: the variable is not visible, and `append: true` moves the comment to the end.\n- `node=internal` at the start: `node` is set for the statement that builds a model, and `append: true` places the comment at the end.",
    references: "https://docs.getdbt.com/reference/project-configs/query-comment",
    dbtVersionFocus: "Query comments"
  },
  {
    id: 117,
    category: "Developing and optimizing dbt models",
    difficulty: "Intermediate",
    questionText: "To defend `profiles.yml` against committing hardcoded passwords or database tokens into security repositories, what is the best practice for establishing safe credential management, and how is it parsed?",
    codeSnippet: `outputs:
  dev:
    type: postgres
    user: analyst
    password: # How should sensitive credentials be securely supplied here?`,
    codeLanguage: "yaml",
    options: [
      "Store the password under `vars` in `dbt_project.yml` and read it with `var`.",
      "Read the password from an environment variable with `env_var`.",
      "Store the password in `packages.yml` so that `dbt deps` supplies it at runtime.",
      "Store the password in a `.env` file, which dbt loads automatically."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nThe `env_var` Jinja function reads an environment variable when dbt parses `profiles.yml`, for example `{{ env_var('DBT_PASSWORD') }}`. The file holds no secret value, so it can be committed safely.\n\nINCORRECT COMPETING OPTIONS:\n- Password under `vars` in `dbt_project.yml`: that file is committed to the repository, so the secret would be exposed.\n- Password in `packages.yml`: this file lists packages to install and does not supply credentials.\n- `.env` file loaded automatically: dbt Core does not read `.env` files, so the variables must be set in the shell or by the orchestrator.",
    references: "https://docs.getdbt.com/reference/dbt-jinja-functions/env_var",
    dbtVersionFocus: "Core Profiles & Variables Security"
  },
  {
    id: 118,
    category: "Developing and optimizing dbt models",
    difficulty: "Advanced",
    questionText: "An analytics engineer sets `on_schema_change: sync_all_columns` on an incremental model. What does dbt do on the next incremental run when a column is removed from the model's query?",
    options: [
      "dbt stops with an error and requests a `--full-refresh` run.",
      "dbt drops the column from the target table to match the query.",
      "dbt keeps the column in the target table and fills it with NULL for new rows.",
      "dbt drops the target table and rebuilds it from the full source query."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nWith `sync_all_columns`, dbt adds columns that are new in the query and removes columns that are no longer in it, so the target table matches the query. Adapter support for dropping columns can vary.\n\nINCORRECT COMPETING OPTIONS:\n- Stopping with an error: this is the behavior of `fail`.\n- Keeping the column and filling NULLs: this is the behavior of `append_new_columns`, which never removes columns.\n- Dropping and rebuilding the table: the table is altered in place, and a rebuild happens only with `--full-refresh`.",
    references: "https://docs.getdbt.com/docs/build/incremental-models",
    dbtVersionFocus: "Incremental Model Columns"
  },
  {
    id: 119,
    category: "Troubleshooting and optimizing dbt pipelines",
    difficulty: "Intermediate",
    questionText: "You are attempting to speed up compilation and execution by running `dbt run --threads 16`. What controls thread allocations, and what is a primary debug gotcha of configuring excessively high thread counts?",
    options: [
      "`threads` sets how many models run concurrently; a high value lets models run before their parents finish.",
      "`threads` sets how many models run concurrently; above the warehouse's concurrency limit, queries wait in a queue.",
      "`threads` sets the warehouse size; a high value raises credit cost but never slows the run.",
      "`threads` can be set only in `dbt_project.yml`; a value above 8 is rejected at parse time."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\n`threads` is the number of nodes dbt runs in parallel, set in `profiles.yml` or overridden with `--threads`. A value higher than the warehouse can handle makes queries wait in the warehouse queue, which adds overhead and can make the run slower.\n\nINCORRECT COMPETING OPTIONS:\n- Models running before their parents: dbt always respects the DAG, so a model waits for its parents regardless of thread count.\n- Warehouse size: `threads` controls dbt's concurrency and does not change the size of the warehouse.\n- Only in `dbt_project.yml`, rejected above 8: `threads` is set in `profiles.yml` or with `--threads`, and dbt sets no limit of 8.",
    references: "https://docs.getdbt.com/docs/core/connect-data-platform/connection-profiles#configuring-threads",
    dbtVersionFocus: "Core Concurrency & Performance Tuning"
  },
  {
    id: 120,
    category: "Implementing dbt tests",
    difficulty: "Advanced",
    questionText: "To keep deployment alerts clean, you configure failure threshold boundaries using `warn_if` and `error_if` on a key metrics test. How do these properties evaluate test outcomes?",
    codeSnippet: `data_tests:
  - my_custom_test:
      config:
        warn_if: "> 5"
        error_if: "> 10"`,
    codeLanguage: "yaml",
    options: [
      "Each expression is compared with the percentage of rows that fail the test.",
      "Each expression is compared with the count of failing rows.",
      "Each expression is compared with the number of tests that fail in the run.",
      "Each expression is compared with the run time of the test in seconds."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nA data test returns the rows that fail, and `warn_if` and `error_if` are conditions on the count of those rows. In the snippet, more than 5 failing rows gives a warning, and more than 10 gives an error.\n\nINCORRECT COMPETING OPTIONS:\n- Percentage of failing rows: the conditions use an absolute row count, not a percentage.\n- Number of failing tests in the run: each test is evaluated on its own result.\n- Run time of the test: thresholds apply to the failing row count, not to duration.",
    references: "https://docs.getdbt.com/reference/resource-properties/tests#error_if-and-warn_if",
    dbtVersionFocus: "Advanced Testing Customization"
  },
  {
    id: 121,
    category: "Managing dbt models governance",
    difficulty: "Intermediate",
    questionText: "On Postgres, `dim_customers` is materialized as a table with the enforced contract below. Its SQL returns the same three columns with matching data types, selected in the order `customer_name`, `customer_id`, `created_at`. What happens when you run `dbt run --select dim_customers`?",
    codeSnippet: `models:
  - name: dim_customers
    config:
      materialized: table
      contract:
        enforced: true
    columns:
      - name: customer_id
        data_type: int
      - name: created_at
        data_type: date
      - name: customer_name
        data_type: text`,
    codeLanguage: "yaml",
    options: [
      "The contract check fails, because the SQL does not select the columns in the order the YAML declares.",
      "The model builds, and the table's columns follow the order of the `select` in the model's SQL.",
      "The model builds, and the table's columns follow the order declared in the YAML contract.",
      "The model builds, and dbt logs a warning that the column order differs from the contract."
    ],
    correctAnswers: [2],
    explanation: "CORRECT ACTION:\nThe contract's preflight check compares the names and data types of the columns, and it does not depend on their order in the SQL or the YAML. dbt then writes the column names and data types into the DDL it sends to the platform and orders the columns as the contract declares them, not as the SQL selects them.\n\nINCORRECT COMPETING OPTIONS:\n- Failing on column order: the preflight check is agnostic to the order of the columns.\n- Columns in the order of the SQL: with an enforced contract, dbt orders the columns per the contract instead of the model's SQL.\n- A warning about column order: order is not part of the contract check, so dbt raises no warning and the run completes with `WARN=0`.",
    references: "https://docs.getdbt.com/docs/mesh/govern/model-contracts",
    dbtVersionFocus: "Model contracts"
  },
  {
    id: 122,
    category: "Managing dbt models governance",
    difficulty: "Advanced",
    questionText: "The incremental model `fct_orders` does not set `on_schema_change`, so the default applies. You add an enforced contract to it that declares the `name` and `data_type` of every column its SQL returns. What happens on the next `dbt run`?",
    options: [
      "dbt raises an error while parsing, because a contracted incremental model must set `on_schema_change` to `append_new_columns` or `fail`.",
      "dbt builds the model but checks the contract on the first run only, because later incremental runs insert into a table that already exists.",
      "dbt builds the model and switches it to `on_schema_change: sync_all_columns`, so the table keeps matching the columns in the contract.",
      "dbt builds the model and ignores the contract, because contracts are supported only on models materialized as `table` or `view`."
    ],
    correctAnswers: [0],
    explanation: "CORRECT ACTION:\nContracts on incremental models are supported only with `on_schema_change: append_new_columns` or `on_schema_change: fail`. dbt Core 1.11 validates this while parsing, so with the default `ignore` the command stops before any model runs, with the error `Invalid value for on_schema_change: ignore. Models materialized as incremental with contracts enabled must set on_schema_change to 'append_new_columns' or 'fail'`. With `ignore`, a column added to the SQL and the YAML would never be added to the existing table, and the contract would no longer describe the table.\n\nINCORRECT COMPETING OPTIONS:\n- Checking the contract on the first run only: dbt does not get as far as building the model, because the configuration is rejected during parsing.\n- Switching to `sync_all_columns`: dbt does not change the setting, and `sync_all_columns` is itself rejected for a contracted incremental model, because removing existing columns is a breaking change.\n- Ignoring the contract on incremental models: `incremental` is a supported materialization for contracts, with the `on_schema_change` values above.",
    references: "https://docs.getdbt.com/reference/resource-configs/contract",
    dbtVersionFocus: "Model contracts on incremental models"
  },
  {
    id: 123,
    category: "Managing dbt models governance",
    difficulty: "Intermediate",
    questionText: "`dim_customers` is versioned as shown below. The downstream model `fct_orders` selects from `{{ ref('dim_customers') }}`, without a version argument. Which version of `dim_customers` does `fct_orders` read?",
    codeSnippet: `models:
  - name: dim_customers
    latest_version: 1
    config:
      materialized: table
    versions:
      - v: 1
      - v: 2
      - v: 3`,
    codeLanguage: "yaml",
    options: [
      "Version 3, because an unpinned `ref` resolves to the numerically greatest version.",
      "None, because dbt raises an error when a `ref` to a versioned model omits `v`.",
      "Version 3, because `latest_version` only controls what `version:latest` selects.",
      "Version 1, because an unpinned `ref` resolves to the version in `latest_version`."
    ],
    correctAnswers: [3],
    explanation: "CORRECT ACTION:\n`latest_version` sets the version that unpinned `ref()` calls resolve to. With `latest_version: 1`, `ref('dim_customers')` compiles to the relation of version 1, and versions 2 and 3 are prereleases. dbt logs that it resolved the unpinned reference to `dim_customers.v1` and that a prerelease version 3 is available.\n\nINCORRECT COMPETING OPTIONS:\n- The numerically greatest version: that is only the default when `latest_version` is not set.\n- An error for a missing `v`: an unpinned `ref` is valid; dbt resolves it to the latest version and the model builds.\n- `latest_version` affecting selection only: it governs both unpinned `ref` calls and the `version:` selection method.",
    references: "https://docs.getdbt.com/reference/resource-properties/latest_version",
    dbtVersionFocus: "Model versions"
  },
  {
    id: 124,
    category: "Managing dbt models governance",
    difficulty: "Advanced",
    questionText: "On Postgres, `dim_customers` is materialized as a table and declares the properties below. No `contract` config is set for it anywhere in the project. Its SQL returns three rows: one with a null `customer_id`, and two that share the same `customer_id`. What happens when you run `dbt run --select dim_customers`?",
    codeSnippet: `models:
  - name: dim_customers
    config:
      materialized: table
    columns:
      - name: customer_id
        data_type: int
        constraints:
          - type: not_null
          - type: primary_key
      - name: customer_name
        data_type: text`,
    codeLanguage: "yaml",
    options: [
      "The run fails, because Postgres rejects the null `customer_id` when dbt inserts the rows.",
      "The model builds with all three rows, because dbt applies constraints only with an enforced contract.",
      "The run fails during parsing, because `constraints` are accepted only on models with an enforced contract.",
      "The model builds with all three rows, and dbt logs a warning for each constraint the data violates."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nTo use constraints, a model must declare and enforce a contract. Without `contract: {enforced: true}`, dbt leaves the constraints out of the DDL, so Postgres has nothing to check and stores all three rows, null and duplicate included.\n\nINCORRECT COMPETING OPTIONS:\n- Postgres rejecting the null value: that happens only once the contract is enforced, because dbt then writes `not null primary key` into the table's DDL and the build fails with a not-null violation.\n- A parsing error: dbt accepts the `constraints` property without a contract and builds the model.\n- A warning per violated constraint: dbt does not check the data against constraints itself; the platform does, and only for constraints that are in the DDL. The run ends with `WARN=0`.",
    references: "https://docs.getdbt.com/reference/resource-properties/constraints",
    dbtVersionFocus: "Constraints"
  },
  {
    id: 125,
    category: "Managing dbt models governance",
    difficulty: "Intermediate",
    questionText: "`dim_customers` has two versions and `latest_version: 2`. Version 1 is defined in `dim_customers_v1.sql`, and version 2 in `dim_customers.sql`. No `alias` is configured. Which relations does `dbt run --select dim_customers` create?",
    options: [
      "`dim_customers` for version 2, and `dim_customers_v1` for version 1",
      "Only `dim_customers`, which holds version 2, the latest version",
      "`dim_customers_v1` for version 1, and `dim_customers_v2` for version 2",
      "`dim_customers_v1`, `dim_customers_v2` and a `dim_customers` view on version 2"
    ],
    correctAnswers: [2],
    explanation: "CORRECT ACTION:\nEach model version creates a database relation with the alias `<model_name>_v<v>`. The file name only tells dbt where a version is defined: the latest version may live in `dim_customers.sql` without a suffix, but it is still built as `dim_customers_v2`.\n\nINCORRECT COMPETING OPTIONS:\n- `dim_customers` for version 2: the unsuffixed file name does not change the relation name, which keeps the `_v2` suffix.\n- Only `dim_customers`: every version is built as its own relation, so version 1 is built too.\n- An extra `dim_customers` view: dbt Core 1.11 builds only one relation per version, and no view named `dim_customers` is created.",
    references: "https://docs.getdbt.com/docs/mesh/govern/model-versions",
    dbtVersionFocus: "Model versions"
  },
  {
    id: 126,
    category: "Debugging data modeling errors",
    difficulty: "Basic",
    questionText: "Your team wants to opt in to the behavior change flag `state_modified_compare_more_unrendered_values` for every run of the project. Where does dbt expect the flag to be set, so that the setting lives with the project and dbt raises no deprecation warning?",
    options: [
      "Under the `vars:` dictionary in `dbt_project.yml`",
      "As a `DBT_`-prefixed environment variable",
      "Under the `config:` block in `profiles.yml`",
      "Under the `flags:` dictionary in `dbt_project.yml`"
    ],
    correctAnswers: [3],
    explanation: "CORRECT ACTION:\nBehavior change flags must be set in the `flags` dictionary in `dbt_project.yml`. They configure behavior tied to project code, so they belong in version control and change through reviewed merge requests.\n\nINCORRECT COMPETING OPTIONS:\n- `vars:`: it defines project variables that provide values to models at compilation, not behavior flags.\n- An environment variable: dbt does not read behavior change flags from environment variables, so setting one leaves the default behavior in place.\n- `config:` in `profiles.yml`: dbt 1.11 still reads flags there, but setting them in `profiles.yml` is deprecated and raises a deprecation warning; they belong in the `flags` dictionary of `dbt_project.yml`.",
    references: "https://docs.getdbt.com/reference/global-configs/behavior-changes",
    dbtVersionFocus: "Behavior change flags"
  },
  {
    id: 127,
    category: "Debugging data modeling errors",
    difficulty: "Advanced",
    questionText: "A project on dbt Core 1.11 has an `on-run-start` hook that inserts a row into an audit table, and its `dbt_project.yml` sets no `flags:`. During `dbt run`, the hook fails because the audit table does not exist. What happens to the selected models?",
    options: [
      "They run as usual, and dbt reports the hook failure as an error in the run summary.",
      "They are all skipped, because a failed `on-run-start` hook blocks every selected node.",
      "dbt stops before any model starts, as it does for a parsing error, and prints no summary.",
      "They run, and dbt retries the failed hook once, after the last model has finished."
    ],
    correctAnswers: [0],
    explanation: "CORRECT ACTION:\nIn dbt Core 1.11, the behavior change flag `skip_nodes_if_on_run_start_fails` exists but is disabled by default; its default becomes `true` in dbt 1.12. With the default, a failed `on-run-start` hook is reported as an error, and the selected models still build: the run ends with `PASS=2 ERROR=1 SKIP=0`.\n\nINCORRECT COMPETING OPTIONS:\n- All models skipped: that is the behavior when `skip_nodes_if_on_run_start_fails: true` is set under `flags:`, which is not the 1.11 default.\n- Stopping before any model starts: the hook runs as its own step, the run continues, and the summary lists the hook failure.\n- Retrying the hook: dbt runs the hook once at the start of the run and does not run it again.",
    references: "https://docs.getdbt.com/reference/global-configs/behavior-flags/skip_nodes_if_on_run_start_fails",
    dbtVersionFocus: "Behavior change flags"
  },
  {
    id: 128,
    category: "Developing and optimizing dbt models",
    difficulty: "Intermediate",
    questionText: "`fct_customer_orders` selects from `{{ ref('stg_orders') }}` and `{{ ref('stg_customers') }}`. `stg_orders` is configured with `event_time: ordered_at`, and `stg_customers` has no `event_time`. Both are tables that are already built. You run `dbt run --select fct_customer_orders --sample=\"3 days\"`. Which input rows does `fct_customer_orders` read?",
    options: [
      "Rows of both models loaded in the last 3 days, based on when each table was last built",
      "Rows of `stg_orders` with `ordered_at` in the last 3 days, and every row of `stg_customers`",
      "No rows, because dbt fails when a ref read by a sampled model has no `event_time`",
      "Every row of both models, because `--sample` filters on the selected model's own `event_time`"
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nSample mode generates filtered refs and sources, and the filter uses the `event_time` of the model being referenced. dbt wraps `ref('stg_orders')` in a filter on `ordered_at` covering the last 3 days. `stg_customers` has no `event_time`, so its `ref` is left unfiltered and every row is read.\n\nINCORRECT COMPETING OPTIONS:\n- Rows loaded in the last 3 days: dbt filters on the column named in `event_time`, not on when a table was built.\n- Failing on a missing `event_time`: the run succeeds, and the ref without `event_time` is simply not sampled.\n- The selected model's own `event_time`: the filter applies to the refs the model reads; `fct_customer_orders` sets no `event_time`, and the ref to `stg_orders` is still filtered.",
    references: "https://docs.getdbt.com/docs/build/sample-flag",
    dbtVersionFocus: "Sample mode"
  },
  {
    id: 131,
    category: "Troubleshooting and optimizing dbt pipelines",
    difficulty: "Intermediate",
    questionText: "A production job on Postgres runs the command below with `threads: 2`. The selected models are independent of each other. `stg_events` fails with a division-by-zero error while `stg_sessions` is still running a long query. What does dbt do with `stg_sessions`?",
    codeSnippet: `dbt run --fail-fast`,
    codeLanguage: "bash",
    options: [
      "dbt cancels the query of `stg_sessions`, and `stg_sessions` is not built in this run.",
      "dbt lets `stg_sessions` finish, then stops before it starts any other model.",
      "dbt lets `stg_sessions` and the other models finish, because only children of `stg_events` are affected.",
      "dbt retries `stg_events` once, and cancels `stg_sessions` only if that retry also fails."
    ],
    correctAnswers: [0],
    explanation: "CORRECT ACTION:\n`--fail-fast` makes dbt exit immediately on the first failure. If other models are in progress when that failure happens, dbt terminates the connections for these still-running models. The query of `stg_sessions` is cancelled, and `run_results.json` records it as skipped with the message `Skipping due to fail_fast`.\n\nINCORRECT COMPETING OPTIONS:\n- Letting `stg_sessions` finish: dbt does not wait for running models; it terminates their connections.\n- Letting all independent models finish: that is the behaviour without `--fail-fast`, where only the children of the failed model are skipped.\n- Retrying `stg_events`: `--fail-fast` does not retry anything; it stops the run at the first failure.",
    references: "https://docs.getdbt.com/reference/global-configs/failing-fast",
    dbtVersionFocus: "Fail fast"
  },
  {
    id: 132,
    category: "Troubleshooting and optimizing dbt pipelines",
    difficulty: "Intermediate",
    questionText: "A team on Postgres runs the command below to give a developer a copy of production in their empty development schema. In the production manifest, `fct_orders` is an incremental model that exists as a table in the production schema. What does `dbt clone` create for `fct_orders` in the development schema?",
    codeSnippet: `dbt clone --select fct_orders --state prod-artifacts`,
    codeLanguage: "bash",
    options: [
      "A zero-copy clone of the production `fct_orders` table",
      "A view that selects from the production `fct_orders` table",
      "A new table built by running the `fct_orders` model SQL",
      "An empty table with the columns of the production `fct_orders`"
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\n`dbt clone` creates a node as a clone only when the data platform supports zero-copy cloning of tables (Snowflake, Databricks or BigQuery) and the node exists as a table in the source environment. Otherwise it creates a simple pointer view, `select * from` the source object. Postgres has no zero-copy cloning, so `fct_orders` becomes a view on the production table.\n\nINCORRECT COMPETING OPTIONS:\n- Zero-copy clone: that applies only on platforms that support cloning tables, which Postgres is not.\n- Running the model SQL: `dbt clone` creates objects from the relations in the state manifest and does not run the model's SQL.\n- Empty table with the same columns: the pointer view returns the production rows, not an empty structure.",
    references: "https://docs.getdbt.com/reference/commands/clone",
    dbtVersionFocus: "dbt clone on platforms without zero-copy cloning"
  },
  {
    id: 133,
    category: "Troubleshooting and optimizing dbt pipelines",
    difficulty: "Advanced",
    questionText: "A developer's schema already holds a `dim_customers` table that they built last week from their own branch. They run the command below, where `prod-artifacts` holds the manifest of the latest production run, which includes `dim_customers`. What happens to the developer's `dim_customers`?",
    codeSnippet: `dbt clone --state prod-artifacts`,
    codeLanguage: "bash",
    options: [
      "dbt replaces it with a copy of the production `dim_customers`, and reports it as cloned.",
      "dbt drops it and then fails the node, because the relation already exists.",
      "dbt rebuilds it by running the `dim_customers` model SQL from the current branch.",
      "dbt leaves it unchanged, and reports that the relation already exists."
    ],
    correctAnswers: [3],
    explanation: "CORRECT ACTION:\nBy default, `dbt clone` does not recreate relations that already exist in the current target. The developer's table keeps last week's data, and the log shows that the relation already exists. Adding `--full-refresh` makes dbt recreate pre-existing relations from the state.\n\nINCORRECT COMPETING OPTIONS:\n- Replacing it with production: that happens only with `--full-refresh`.\n- Dropping it and failing: dbt neither drops the relation nor fails the node; the command completes successfully.\n- Rebuilding from the model SQL: `dbt clone` does not run model SQL; it creates objects from the relations in the state manifest.",
    references: "https://docs.getdbt.com/reference/commands/clone",
    dbtVersionFocus: "dbt clone and --full-refresh"
  },
  {
    id: 134,
    category: "Troubleshooting and optimizing dbt pipelines",
    difficulty: "Intermediate",
    questionText: "On Postgres, the table model `fct_daily_revenue` was built successfully by yesterday's run. Today's `dbt run` fails on this model with `division by zero`. A dashboard queries `fct_daily_revenue` right after the failure. What data does it see?",
    options: [
      "No rows, because dbt truncates the table before it runs the failing query.",
      "An error, because dbt dropped the table before the failing query ran.",
      "Yesterday's rows, because the failed build never replaced the existing table.",
      "The rows computed before the error, because dbt commits each insert as it goes."
    ],
    correctAnswers: [2],
    explanation: "CORRECT ACTION:\nOn Postgres, the `table` materialization creates the new table as `fct_daily_revenue__dbt_tmp` and renames it into place only after the query succeeds. When the query fails, the existing `fct_daily_revenue` is never touched, so the dashboard keeps reading yesterday's data. A failed run leaves stale data behind rather than an empty or missing table.\n\nINCORRECT COMPETING OPTIONS:\n- No rows after a truncate: dbt does not truncate the existing table; it builds a separate temporary relation.\n- An error because the table was dropped: the old table is replaced only after the new one has been built.\n- Partial rows: the failing statement creates no table at all, so no partial result is published.",
    references: "https://docs.getdbt.com/docs/build/materializations",
    dbtVersionFocus: "Partial results after a failed model"
  },
  {
    id: 135,
    category: "Troubleshooting and optimizing dbt pipelines",
    difficulty: "Advanced",
    questionText: "The `not_null` test on `stg_orders.order_id` is configured with `severity: warn`, and today it finds one null value. The model `fct_orders` selects from `stg_orders`. The production job runs the command below. What happens to `fct_orders`?",
    codeSnippet: `dbt build --warn-error`,
    codeLanguage: "bash",
    options: [
      "It is skipped, because the test's warning is promoted to an error, which blocks its children.",
      "It is built, because `severity: warn` on the test takes precedence over the `--warn-error` flag.",
      "It is built, because `--warn-error` applies only to warnings raised while dbt parses the project.",
      "It is built, because in `dbt build` only tests on sources can block downstream models."
    ],
    correctAnswers: [0],
    explanation: "CORRECT ACTION:\n`--warn-error` converts all dbt warnings into errors, including tests that are configured to return warnings. The `not_null` test is reported as a failure instead of a warning, and in `dbt build` a test failure skips the resources downstream of the tested model, so `fct_orders` is skipped. Without the flag, the same test reports `WARN 1` and `fct_orders` is built.\n\nINCORRECT COMPETING OPTIONS:\n- `severity: warn` taking precedence: the flag promotes the warning that this severity produces.\n- Parse-time warnings only: the flag's scope includes tests and freshness checks that return warnings.\n- Only source tests blocking: any test on an upstream resource that fails blocks its downstream resources.",
    references: "https://docs.getdbt.com/reference/global-configs/warnings",
    dbtVersionFocus: "--warn-error and skipped nodes"
  },
  {
    id: 136,
    category: "Leveraging the dbt state",
    difficulty: "Advanced",
    questionText: "A `dbt build` fails on `int_orders` and skips its child `fct_orders`; every other node succeeds. Before anyone fixes the model, a colleague runs `dbt compile` in the same project directory to inspect the SQL, and it completes successfully. You then fix `int_orders` and run `dbt retry`. What does `dbt retry` do?",
    options: [
      "It reruns `int_orders` and `fct_orders`, the nodes that errored or were skipped in the build.",
      "It reruns the whole `dbt build`, because the last invocation was not a build command.",
      "It recompiles `int_orders` only, because it retries the `dbt compile` invocation.",
      "It runs nothing, because the latest `run_results.json` records a successful `dbt compile`."
    ],
    correctAnswers: [3],
    explanation: "CORRECT ACTION:\n`dbt retry` re-executes the last invocation from the point of failure, and it reads `run_results.json` to determine where to start. `dbt compile` overwrote that file with its own results, in which every node succeeded. When the previously executed command completed successfully, retry finishes as a no operation, and dbt logs `Nothing to do`. `int_orders` and `fct_orders` stay unbuilt until you run them again with `dbt build` or `dbt run`.\n\nINCORRECT COMPETING OPTIONS:\n- Rerunning the errored and skipped nodes: that happens only when the failed build is still the last invocation recorded in `run_results.json`.\n- Rerunning the whole build: retry picks up from the point of failure of the last invocation instead of rerunning a full command.\n- Recompiling `int_orders`: the compile had no failures, so there is nothing to retry.",
    references: "https://docs.getdbt.com/reference/commands/retry",
    dbtVersionFocus: "dbt retry and run_results.json"
  },
  {
    id: 137,
    category: "Leveraging the dbt state",
    difficulty: "Intermediate",
    questionText: "A CI job runs `dbt build --select state:modified+ --state prod-artifacts`. In the pull request, a developer changes one value in `geo_lookup.csv`, a 2.3 MB seed, and one value in `order_statuses.csv`, a seed of a few bytes. Neither file is moved or renamed. Which seeds does `state:modified` select?",
    options: [
      "Both seeds, because dbt compares the contents of every seed file.",
      "Only `order_statuses`, because dbt compares seeds of 1 MiB or more by file path only.",
      "Only `geo_lookup`, because dbt compares small seeds by file path only.",
      "Neither seed, because seeds are selected only when their YAML properties change."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\ndbt stores a file hash only for seed files under 1 MiB, so a change to the contents of `order_statuses.csv` marks it modified. For a seed over 1 MiB, dbt cannot compare contents, raises a warning, and uses only the file path to detect changes. `geo_lookup.csv` kept its path, so it is not selected.\n\nINCORRECT COMPETING OPTIONS:\n- Comparing every seed's contents: dbt hashes only seeds under 1 MiB.\n- Comparing small seeds by path: it is the other way round; large seeds are compared by path and small seeds by contents.\n- YAML properties only: a content change to a small seed is enough for `state:modified`.",
    references: "https://docs.getdbt.com/reference/node-selection/state-comparison-caveats",
    dbtVersionFocus: "State comparison for seeds"
  },
  {
    id: 138,
    category: "Leveraging the dbt state",
    difficulty: "Advanced",
    questionText: "The model `fct_orders` filters on `{{ var('start_date') }}`, and `dbt_project.yml` sets `start_date: '2026-01-01'`. The production manifest in `prod-artifacts` was produced with that default. With no file changed in the project, a CI job runs the command below. What is the result?",
    codeSnippet: `dbt build --select state:modified+ --state prod-artifacts --vars '{"start_date": "2026-10-01"}'`,
    codeLanguage: "bash",
    options: [
      "dbt selects `fct_orders`, because its compiled SQL differs from the production run.",
      "dbt selects every model, because passing `--vars` invalidates the comparison manifest.",
      "dbt selects no nodes, because a changed `var` value does not mark the model as modified.",
      "dbt raises an error, because `--vars` cannot be combined with `state:` selection."
    ],
    correctAnswers: [2],
    explanation: "CORRECT ACTION:\nWhen a model uses a `var` or `env_var` in its definition, dbt cannot detect that the model changed because the variable's value changed. The model's code is the same as in the production manifest, so `state:modified+` matches nothing and dbt reports that there is nothing to do, even though the compiled SQL now filters on `2026-10-01`.\n\nINCORRECT COMPETING OPTIONS:\n- Selecting `fct_orders` because compiled SQL differs: state comparison does not include the changed `var` value in the model's definition.\n- Selecting every model: `--vars` does not invalidate the comparison; the manifest is still used and nothing differs.\n- Raising an error: `--vars` and `state:` selection can be combined; the command completes with nothing selected.",
    references: "https://docs.getdbt.com/reference/node-selection/state-comparison-caveats",
    dbtVersionFocus: "State comparison and vars"
  },
  {
    id: 139,
    category: "Troubleshooting and optimizing dbt pipelines",
    difficulty: "Basic",
    questionText: "An orchestrator runs `dbt build` and decides what to do next from dbt's exit code. Tonight one model fails with a database error, its two children are skipped, and every other node succeeds. Which exit code does dbt return?",
    options: [
      "`0`, because the invocation ran to the end and only some models were skipped",
      "`1`, because the invocation completed with at least one handled error",
      "`2`, because a database error counts as an unhandled error",
      "`3`, because dbt reports runs with skipped models with their own exit code"
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\ndbt returns `1` when the invocation completed with at least one handled error, such as a model syntax error or bad permissions; the run was completed, but some models may have been skipped. A failed model with skipped children is exactly that case.\n\nINCORRECT COMPETING OPTIONS:\n- `0`: dbt returns it only when the invocation completes successfully; a failed model makes the invocation end with an error code.\n- `2`: it is reserved for unhandled errors such as ctrl-c or a network interruption.\n- `3`: dbt returns only `0`, `1` or `2`, and skipped models do not have a separate code.",
    references: "https://docs.getdbt.com/reference/exit-codes",
    dbtVersionFocus: "Exit codes"
  },
  {
    id: 141,
    category: "Implementing and maintaining external dependencies",
    difficulty: "Basic",
    questionText: "A dbt Core 1.11 job runs `dbt source freshness`. A later job must read the freshness results of this run, including each source's `max_loaded_at`, to select sources that received new data. Which file in the `target/` directory holds these results?",
    options: [
      "`target/run_results.json`",
      "`target/manifest.json`",
      "`target/sources.json`",
      "`target/freshness.json`"
    ],
    correctAnswers: [2],
    explanation: "CORRECT ACTION:\n`dbt source freshness` writes its results to `target/sources.json`. The file holds the status, execution times and `max_loaded_at` of each checked source table, and later invocations can read it, for example with the `source_status` selector.\n\nINCORRECT COMPETING OPTIONS:\n- `target/run_results.json`: in dbt Core 1.11, `dbt source freshness` does not write `run_results.json`; the freshness results go to `sources.json`.\n- `target/manifest.json`: the command writes a manifest too, but the freshness results that later invocations read, with each source's status and `max_loaded_at`, are in `sources.json`.\n- `target/freshness.json`: dbt Core 1.11 does not write this file when it runs `dbt source freshness`.",
    references: "https://docs.getdbt.com/reference/node-selection/configure-state",
    dbtVersionFocus: "Source freshness (artifacts)"
  },
  {
    id: 142,
    category: "Implementing and maintaining external dependencies",
    difficulty: "Intermediate",
    questionText: "In a dbt Core 1.11 project named `sandbox`, `dbt_project.yml` sets a default freshness for its sources, and the source YAML sets only `loaded_at_field`, as shown below. The newest `loaded_at` value in `orders` is 2 hours old. What does `dbt source freshness` report for `orders`?",
    codeSnippet: `# dbt_project.yml
sources:
  sandbox:
    +freshness:
      warn_after: {count: 1, period: hour}

# models/sources.yml
sources:
  - name: shop
    config:
      loaded_at_field: loaded_at
    tables:
      - name: orders`,
    codeLanguage: "yaml",
    options: [
      "`PASS`, because freshness set in `dbt_project.yml` is not applied to sources.",
      "`ERROR STALE`, because without `error_after` any breach is reported as an error.",
      "No result, because `orders` has no `freshness` block in its own YAML entry.",
      "`WARN`, because the `+freshness` set in `dbt_project.yml` applies to `orders`."
    ],
    correctAnswers: [3],
    explanation: "CORRECT ACTION:\n`freshness` can be set for sources in `dbt_project.yml` under `sources:` with the `+` prefix, and it applies to every source table in that resource path. `orders` inherits `warn_after` of 1 hour and its `loaded_at_field` from the YAML, so data 2 hours old is reported as `WARN`.\n\nINCORRECT COMPETING OPTIONS:\n- `PASS` because project-level freshness is ignored: the project-level `+freshness` is applied, and 2 hours exceeds the 1-hour `warn_after`.\n- `ERROR STALE` without `error_after`: one or both thresholds can be set, and breaching only `warn_after` produces a warning.\n- No result without a YAML `freshness` block: the table inherits the freshness configured in `dbt_project.yml`, so dbt checks it.",
    references: "https://docs.getdbt.com/reference/resource-configs/freshness",
    dbtVersionFocus: "Source freshness (project-level config)"
  },
  {
    id: 143,
    category: "Implementing and maintaining external dependencies",
    difficulty: "Advanced",
    questionText: "A project on Postgres declares the source below. Both tables receive new rows every hour. What happens when you run `dbt source freshness`?",
    codeSnippet: `sources:
  - name: shop
    config:
      freshness:
        warn_after: {count: 12, period: hour}
        error_after: {count: 24, period: hour}
    tables:
      - name: orders
        config:
          loaded_at_field: loaded_at
      - name: events`,
    codeLanguage: "yaml",
    options: [
      "`orders` passes; `events` passes, because dbt reads its last-modified time from Postgres metadata.",
      "`orders` passes; `events` errors, because Postgres cannot compute freshness without `loaded_at_field`.",
      "`orders` passes; `events` is left out of the results, with no warning or error reported.",
      "Both tables error, because `loaded_at_field` must be set at the source level to apply to tables."
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nWithout `loaded_at_field`, dbt can compute freshness only from warehouse metadata, and the Postgres adapter does not support metadata-based freshness. dbt reports a runtime error for `events`: no `loaded_at_field` provided and the adapter does not support metadata-based freshness checks. `orders` has a `loaded_at_field` and recent data, so it passes.\n\nINCORRECT COMPETING OPTIONS:\n- `events` passes from Postgres metadata: metadata-based freshness is available only on adapters that support it, and Postgres does not.\n- `events` left out of the results: dbt runs the check for `events` because it inherits a `freshness` block, and reports an error for it.\n- Both tables error: `loaded_at_field` can be set on a single table, and `orders` is checked with its own `loaded_at_field`.",
    references: "https://docs.getdbt.com/docs/build/sources",
    dbtVersionFocus: "Source freshness (loaded_at_field)"
  },
  {
    id: 144,
    category: "Implementing and maintaining external dependencies",
    difficulty: "Intermediate",
    questionText: "Your project defines many exposures in YAML files under `models/`. You want to set one exposure property for all of them at once in `dbt_project.yml`, under the `exposures:` key. In dbt Core 1.11, which setting takes effect there?",
    options: [
      "`+enabled`",
      "`+maturity`",
      "`+owner`",
      "`+type`"
    ],
    correctAnswers: [0],
    explanation: "CORRECT ACTION:\nExposure properties are special properties that must be set in the exposure's YAML entry. The only project-level config that `dbt_project.yml` supports for exposures under `exposures:` is `enabled`, for example `+enabled: false` to disable them.\n\nINCORRECT COMPETING OPTIONS:\n- `+maturity`: maturity is an exposure property set in YAML; a project-level `+maturity` does not change the exposure's `maturity`.\n- `+owner`: the owner is a required exposure property declared in the exposure's YAML entry.\n- `+type`: the type is a required exposure property declared in the exposure's YAML entry.",
    references: "https://docs.getdbt.com/reference/exposure-properties",
    dbtVersionFocus: "Exposures (project-level configs)"
  },
  {
    id: 145,
    category: "Developing and optimizing dbt models",
    difficulty: "Intermediate",
    questionText: "On DuckDB, a Python model sets its materialization as shown below. What happens when you run `dbt run --select customer_scores`?",
    codeSnippet: `def model(dbt, session):
    dbt.config(materialized="view")
    customers = dbt.ref("stg_customers")
    return customers.filter("id > 1")`,
    codeLanguage: "python",
    options: [
      "dbt creates a view whose definition runs the Python code each time the view is queried.",
      "dbt ignores the setting and builds a table, because `table` is the default for Python models.",
      "The model fails with an error, because the `view` materialization supports only SQL models.",
      "dbt builds nothing and inlines the Python result into downstream models as a CTE."
    ],
    correctAnswers: [2],
    explanation: "CORRECT ACTION:\nPython models support only the `table` and `incremental` materializations; they can't be materialized as `view` or `ephemeral`. dbt fails the model with a runtime error stating that the view materialization only supports the `sql` language.\n\nINCORRECT COMPETING OPTIONS:\n- A view that runs the Python code: the `view` materialization rejects Python models, so no view is created.\n- Falling back to a table: `table` is the default only when no materialization is set; an explicit `view` is not replaced, it fails.\n- Inlining as a CTE: that is the `ephemeral` behaviour of SQL models, and Python models can't be ephemeral either.",
    references: "https://docs.getdbt.com/docs/build/python-models",
    dbtVersionFocus: "Python models (materializations)"
  },
  {
    id: 146,
    category: "Developing and optimizing dbt models",
    difficulty: "Intermediate",
    questionText: "On Postgres, `dbt_project.yml` and the table model `fct_payments` configure grants as shown below. The roles `analyst`, `bi` and `finance` exist. After `dbt run`, which roles hold the `select` privilege on `fct_payments`?",
    codeSnippet: `# dbt_project.yml
models:
  +materialized: table
  +grants:
    select: ['analyst', 'bi']

-- models/fct_payments.sql
{{ config(grants={'select': ['finance']}) }}
select * from {{ ref('stg_payments') }}`,
    codeLanguage: "yaml",
    options: [
      "`analyst`, `bi` and `finance`",
      "`finance` only",
      "`analyst` and `bi` only",
      "None, until `dbt run-operation` runs"
    ],
    correctAnswers: [1],
    explanation: "CORRECT ACTION:\nWhen `grants` is set in several places, the more specific config replaces the grantees of the less specific one for each privilege. The model-level `select: ['finance']` replaces the project-level list, so only `finance` receives `select`. To add `finance` to the inherited grantees instead, the model would use the key `+select`.\n\nINCORRECT COMPETING OPTIONS:\n- `analyst`, `bi` and `finance`: grantees are combined only when the privilege key has the `+` prefix, which this model does not use.\n- `analyst` and `bi` only: the model's own config is more specific than `dbt_project.yml`, so it wins.\n- None until `dbt run-operation` runs: dbt runs the `grant` statements itself when the model is built.",
    references: "https://docs.getdbt.com/reference/resource-configs/grants",
    dbtVersionFocus: "Grants (config inheritance)"
  },
  {
    id: 147,
    category: "Developing and optimizing dbt models",
    difficulty: "Intermediate",
    questionText: "A snapshot on Postgres uses the configuration below. After the first `dbt snapshot`, the row with `id = 2` is deleted from the source table. What does the next `dbt snapshot` do for `id = 2`?",
    codeSnippet: `snapshots:
  - name: customers_snapshot
    relation: source('crm', 'customers')
    config:
      unique_key: id
      strategy: timestamp
      updated_at: updated_at
      hard_deletes: new_record`,
    codeLanguage: "yaml",
    options: [
      "It sets `dbt_valid_to` on the row and adds no new row.",
      "It leaves the row unchanged, with `dbt_valid_to` still null.",
      "It deletes the row for `id = 2` from the snapshot table.",
      "It closes the row and adds a row where `dbt_is_deleted` is `True`."
    ],
    correctAnswers: [3],
    explanation: "CORRECT ACTION:\n`hard_deletes: new_record` tracks deletions as new rows. dbt sets `dbt_valid_to` on the current row for `id = 2` and inserts a new row whose `dbt_is_deleted` column is `True`. The setting adds the `dbt_is_deleted` meta column to the snapshot table.\n\nINCORRECT COMPETING OPTIONS:\n- Setting `dbt_valid_to` with no new row: this is `hard_deletes: invalidate`.\n- Leaving the row unchanged: this is `hard_deletes: ignore`, the default.\n- Deleting the row from the snapshot: no `hard_deletes` option removes history from the snapshot table.",
    references: "https://docs.getdbt.com/reference/resource-configs/hard-deletes",
    dbtVersionFocus: "Snapshots (hard_deletes, v1.9+)"
  },
  {
    id: 148,
    category: "Developing and optimizing dbt models",
    difficulty: "Advanced",
    questionText: "On Postgres, the incremental model below loads app events. Upstream, a whole day of events can be reprocessed: rows of that day change and new rows are added. Each run reselects every row from the latest loaded day onwards, and many rows share each `event_date`. Which `incremental_strategy` replaces the rows of each reselected day without duplicates?",
    codeSnippet: `{{ config(materialized='incremental', unique_key='event_date') }}

select event_date, event_id, amount
from {{ source('app', 'events') }}
{% if is_incremental() %}
where event_date >= (select max(event_date) from {{ this }})
{% endif %}`,
    codeLanguage: "sql",
    options: [
      "`delete+insert`",
      "`merge`",
      "`append`",
      "`insert_overwrite`"
    ],
    correctAnswers: [0],
    explanation: "CORRECT ACTION:\n`delete+insert` deletes the target rows whose `unique_key` matches the new data and then inserts the new rows. With `unique_key='event_date'`, every row of a reselected day is removed and replaced, which suits a key that is not unique per row.\n\nINCORRECT COMPETING OPTIONS:\n- `merge`: many new rows share each `event_date`, so the `MERGE` would update the same target row more than once, and Postgres fails the run with `MERGE command cannot affect row a second time`.\n- `append`: it inserts the reselected rows without deleting the old ones, so the reprocessed day is duplicated.\n- `insert_overwrite`: dbt-postgres does not support it, and the run fails with `The incremental strategy 'insert_overwrite' is not valid for this adapter`.",
    references: "https://docs.getdbt.com/docs/build/incremental-strategy",
    dbtVersionFocus: "Incremental strategies (choosing one)"
  },
  {
    id: 149,
    category: "Developing and optimizing dbt models",
    difficulty: "Intermediate",
    questionText: "The microbatch model below already exists in the warehouse. A scheduled `dbt run` of the model starts on 2026-11-09 (UTC), and the run is not a full refresh. Which batches does it process?",
    codeSnippet: `{{ config(
    materialized='incremental',
    incremental_strategy='microbatch',
    event_time='viewed_at',
    unique_key='view_id',
    begin='2026-11-01',
    batch_size='day',
    lookback=2
) }}

select view_id, viewed_at
from {{ source('app', 'page_views') }}`,
    codeLanguage: "sql",
    options: [
      "Only the batch for 2026-11-09",
      "The batches for 2026-11-08 and 2026-11-09",
      "Every daily batch from 2026-11-01 through 2026-11-09",
      "The batches for 2026-11-07, 2026-11-08 and 2026-11-09"
    ],
    correctAnswers: [3],
    explanation: "CORRECT ACTION:\nOn a standard incremental run, dbt picks batches from the current timestamp and the `lookback`, with one query per batch. With `batch_size='day'`, it processes the current day plus `lookback=2` earlier days: 2026-11-07, 2026-11-08 and 2026-11-09.\n\nINCORRECT COMPETING OPTIONS:\n- Only 2026-11-09: that would be `lookback=0`; the configured `lookback` adds earlier batches to catch late-arriving records.\n- 2026-11-08 and 2026-11-09: this is the default `lookback` of 1, but the model sets 2.\n- Every batch from `begin`: dbt starts from `begin` when the model is first built, not on a standard incremental run of an existing model.",
    references: "https://docs.getdbt.com/reference/resource-configs/lookback",
    dbtVersionFocus: "Microbatch (lookback)"
  }
];
