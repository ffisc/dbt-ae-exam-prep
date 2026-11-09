import { Question } from "./types";

// Fill-in-the-blank (2001+), matching (3001+), build-list (4001+) and hotspot (5001+) questions.
export const formatQuestions: Question[] = [
  {
    "id": 2001,
    "format": "fill_blank",
    "category": "Developing and optimizing dbt models",
    "difficulty": "Intermediate",
    "questionText": "An incremental model must load only rows newer than the latest `event_time` already stored in the model's own table. The filter must apply on incremental runs and be skipped on the first run. Complete the model.",
    "codeSnippet": "{{ config(materialized='incremental') }}\n\nselect * from {{ ref('stg_events') }}\n\n{% if [[1]]() %}\nwhere event_time >= (select max(event_time) from {{ [[2]] }})\n{% endif %}",
    "codeLanguage": "jinja",
    "blanks": [
      {
        "accepted": [
          "is_incremental"
        ]
      },
      {
        "accepted": [
          "this"
        ]
      }
    ],
    "explanation": "CORRECT ACTION:\n`is_incremental()` returns true only when the model already exists as a table, `--full-refresh` is not passed and the model is materialized as `incremental`. `{{ this }}` resolves to the relation the model builds into, so the subquery reads the existing table.\n\nCOMMON MISTAKES:\n- `ref`: `{{ ref('fct_events') }}` inside `fct_events` would create a circular dependency, so a model cannot select from itself with `ref`.\n- `source`: `source` points to raw tables declared in a sources file, not to the table the current model builds.\n- `is_incremental` without the call parentheses: the macro must be called, otherwise the `if` tests the macro object instead of its result.",
    "references": "https://docs.getdbt.com/docs/build/incremental-models",
    "dbtVersionFocus": "Incremental models"
  },
  {
    "id": 2002,
    "format": "fill_blank",
    "category": "Developing and optimizing dbt models",
    "difficulty": "Intermediate",
    "questionText": "An upstream team adds a column to the source of an incremental model and removes a different column. The existing table in the warehouse must gain the new column and lose the removed one on the next run, without a full refresh. Which value completes the model properties?",
    "codeSnippet": "models:\n  - name: fct_events\n    config:\n      materialized: incremental\n      on_schema_change: [[1]]",
    "codeLanguage": "yaml",
    "blanks": [
      {
        "accepted": [
          "sync_all_columns"
        ]
      }
    ],
    "explanation": "CORRECT ACTION:\n`on_schema_change: sync_all_columns` adds new columns to the existing table and removes columns that are no longer in the new data. It also covers data type changes.\n\nCOMMON MISTAKES:\n- `append_new_columns`: it adds new columns but does not remove columns missing from the new data.\n- `fail`: it raises an error when the source and target schemas diverge, so the run stops.\n- `ignore`: it is the default, and it leaves the existing table schema unchanged.",
    "references": "https://docs.getdbt.com/docs/build/incremental-models",
    "dbtVersionFocus": "Incremental models (schema changes)"
  },
  {
    "id": 2003,
    "format": "fill_blank",
    "category": "Managing dbt models governance",
    "difficulty": "Advanced",
    "questionText": "The `dim_customers` model is published in two numbered releases, 1 and 2, and an unpinned `ref('dim_customers')` resolves to 2. A downstream model must keep reading 1 until its owners migrate. Which keyword argument completes the `ref` call?",
    "codeSnippet": "select * from {{ ref('dim_customers', [[1]]=1) }}",
    "codeLanguage": "jinja",
    "blanks": [
      {
        "accepted": [
          "v",
          "version"
        ]
      }
    ],
    "explanation": "CORRECT ACTION:\nPassing the version keyword to `ref` pins the reference to that version, for example `ref('dim_customers', v=1)`. Without it, `ref('dim_customers')` resolves to the latest version, which is version 2 here.\n\nCOMMON MISTAKES:\n- `latest_version`: it is a property in the model YAML that declares which version is the latest, not an argument to `ref`.\n- Omitting the argument: the reference moves to whichever version the maintainer marks as latest.",
    "references": "https://docs.getdbt.com/docs/mesh/govern/model-versions",
    "dbtVersionFocus": "Model versions"
  },
  {
    "id": 2004,
    "format": "fill_blank",
    "category": "Developing and optimizing dbt models",
    "difficulty": "Basic",
    "questionText": "The SQL logic of the incremental model `fct_orders` changed, and all historical rows must be reprocessed with the new logic. dbt must drop the existing table and rebuild it from scratch. Which flag completes the command?",
    "codeSnippet": "dbt run [[1]] --select fct_orders",
    "codeLanguage": "bash",
    "blanks": [
      {
        "accepted": [
          "--full-refresh",
          "-f"
        ]
      }
    ],
    "explanation": "CORRECT ACTION:\n`--full-refresh` makes dbt treat incremental models as table models, so `is_incremental()` returns false and the model is rebuilt for all time. Its short form is `-f`.\n\nCOMMON MISTAKES:\n- `--empty`: it limits refs and sources to zero rows, so the rebuilt table would hold no historical data.\n- `--fail-fast`: it stops the run at the first failure and does not change how an incremental model builds.\n- `--defer`: it resolves unselected upstream refs to another environment and does not rebuild the table.",
    "references": "https://docs.getdbt.com/reference/commands/run",
    "dbtVersionFocus": "Incremental models (full refresh)"
  },
  {
    "id": 2005,
    "format": "fill_blank",
    "category": "Developing and optimizing dbt models",
    "difficulty": "Intermediate",
    "questionText": "You want to see the first 20 rows that the query of `stg_orders` returns. dbt must compile the model, run the query against the warehouse and print the rows in the terminal without creating or replacing any relation. Which subcommand completes the command?",
    "codeSnippet": "dbt [[1]] --select stg_orders --limit 20",
    "codeLanguage": "bash",
    "blanks": [
      {
        "accepted": [
          "show"
        ]
      }
    ],
    "explanation": "CORRECT ACTION:\n`dbt show` compiles a single model, runs the compiled query and prints a preview in the terminal. The results are not materialized in the warehouse. `--limit` adds a `limit` clause to the underlying SQL.\n\nCOMMON MISTAKES:\n- `compile`: it renders the SQL but does not run it, so no rows are returned.\n- `run`: it materializes the model in the warehouse and does not print a preview of the rows.\n- `debug`: it tests the connection and the project setup, and it does not query model results.",
    "references": "https://docs.getdbt.com/reference/commands/show",
    "dbtVersionFocus": "Previewing model results"
  },
  {
    "id": 2006,
    "format": "fill_blank",
    "category": "Debugging data modeling errors",
    "difficulty": "Intermediate",
    "questionText": "A macro computes `n`, the number of rows in a relation. While debugging, you need the message below to appear both in the terminal and in the log file. By default, `log` writes only to the log file. Which argument completes the call?",
    "codeSnippet": "{{ log('Row count: ' ~ n, [[1]]=true) }}",
    "codeLanguage": "jinja",
    "blanks": [
      {
        "accepted": [
          "info"
        ]
      }
    ],
    "explanation": "CORRECT ACTION:\nThe `log` function takes the argument `info`, which defaults to false. With `info=true`, the message goes to both the log file and stdout.\n\nCOMMON MISTAKES:\n- `debug`: it is the name of a global CLI flag, not an argument of `log`.\n- `msg`: it is the first argument of `log` and holds the message text, not the output destination.",
    "references": "https://docs.getdbt.com/reference/dbt-jinja-functions/log",
    "dbtVersionFocus": "Jinja functions (log)"
  },
  {
    "id": 2007,
    "format": "fill_blank",
    "category": "Developing and optimizing dbt models",
    "difficulty": "Advanced",
    "questionText": "You changed the SQL of several models and want to confirm that they build and that their dependencies resolve in the target warehouse. dbt must still execute the model SQL, but it must avoid expensive reads of the input data by limiting every ref and source to zero rows. Which flag completes the command?",
    "codeSnippet": "dbt run [[1]]",
    "codeLanguage": "bash",
    "blanks": [
      {
        "accepted": [
          "--empty"
        ]
      }
    ],
    "explanation": "CORRECT ACTION:\n`--empty` builds schema-only dry runs. dbt still executes the model SQL against the warehouse, but each ref and source returns zero rows.\n\nCOMMON MISTAKES:\n- `--full-refresh`: it rebuilds incremental models for all time and reads all of the input data.\n- `--fail-fast`: it stops the run at the first failure and does not limit the rows read.\n- `--defer`: it resolves unselected upstream refs to another environment and does not limit the rows read.",
    "references": "https://docs.getdbt.com/reference/commands/run",
    "dbtVersionFocus": "Schema-only dry runs"
  },
  {
    "id": 2008,
    "format": "fill_blank",
    "category": "Implementing dbt tests",
    "difficulty": "Basic",
    "questionText": "In dbt 1.10.5 or later, the parameters of a generic test sit under one key inside the test entry. Complete the test so every non-null `customer_id` in `orders` must match an `id` in `customers`.",
    "codeSnippet": "models:\n  - name: orders\n    columns:\n      - name: customer_id\n        data_tests:\n          - relationships:\n              [[1]]:\n                to: ref('customers')\n                [[2]]: id",
    "codeLanguage": "yaml",
    "blanks": [
      {
        "accepted": [
          "arguments"
        ]
      },
      {
        "accepted": [
          "field"
        ]
      }
    ],
    "explanation": "CORRECT ACTION:\nThe `relationships` test takes `to`, the relation to check against, and `field`, the column in that relation. From dbt 1.10.5, test parameters are nested under `arguments`.\n\nCOMMON MISTAKES:\n- `config`: it holds test options such as `where` or `severity`, not the parameters the test needs to run.\n- `to`: it names the relation to check against, and it sits inside `arguments` as a parameter, so it cannot be the key that holds the parameters.",
    "references": "https://docs.getdbt.com/reference/resource-properties/data-tests",
    "dbtVersionFocus": "v1.10.5+ (Test arguments)"
  },
  {
    "id": 2009,
    "format": "fill_blank",
    "category": "Implementing dbt tests",
    "difficulty": "Intermediate",
    "questionText": "You are writing a unit test for `fct_orders`. The first blank is the key that lists the mocked input rows for each model the test reads. The second blank is the key that declares the output rows the model must produce. Complete the YAML.",
    "codeSnippet": "unit_tests:\n  - name: test_order_total\n    model: fct_orders\n    [[1]]:\n      - input: ref('stg_orders')\n        rows:\n          - {order_id: 1, amount: 10}\n    [[2]]:\n      rows:\n        - {order_id: 1, total: 10}",
    "codeLanguage": "yaml",
    "blanks": [
      {
        "accepted": [
          "given"
        ]
      },
      {
        "accepted": [
          "expect"
        ]
      }
    ],
    "explanation": "CORRECT ACTION:\nA unit test lists its mocked inputs under `given`, with one `input` per ref or source, and declares the expected output under `expect`. Both take rows, for example in `dict` format.\n\nCOMMON MISTAKES:\n- `input`: it is a key inside each `given` entry that names the ref or source, and it does not hold the list of inputs.\n- `rows`: it is the key inside a `given` entry or inside `expect` that holds the row data, and it does not group the inputs or the expected output.",
    "references": "https://docs.getdbt.com/docs/build/unit-tests",
    "dbtVersionFocus": "v1.8+ (Unit tests)"
  },
  {
    "id": 2010,
    "format": "fill_blank",
    "category": "Developing and optimizing dbt models",
    "difficulty": "Basic",
    "questionText": "A docs block named `order_status` is declared with `{% docs order_status %}` in a Markdown file in the project. Which Jinja function completes the column description so that the block text is used in the generated documentation?",
    "codeSnippet": "models:\n  - name: orders\n    columns:\n      - name: status\n        description: \"{{ [[1]]('order_status') }}\"",
    "codeLanguage": "yaml",
    "blanks": [
      {
        "accepted": [
          "doc"
        ]
      }
    ],
    "explanation": "CORRECT ACTION:\nThe `doc` function returns the text of a docs block by name, and it works in the `description` properties of YAML files. The block name must be unique in the project.\n\nCOMMON MISTAKES:\n- `docs`: it is the tag name used to declare a block with `{% docs %}`, and it is not a function that references one.\n- `ref`: it returns a model relation for the DAG, not documentation text.\n- `var`: it reads a project variable, so it does not look up a docs block.",
    "references": "https://docs.getdbt.com/reference/dbt-jinja-functions/doc",
    "dbtVersionFocus": "Documentation (docs blocks)"
  },
  {
    "id": 2011,
    "format": "fill_blank",
    "category": "Leveraging the dbt state",
    "difficulty": "Advanced",
    "questionText": "A CI job must build only the models that differ from the production manifest, plus their downstream models. Unselected upstream models are not built in the CI schema, so their refs must resolve to the production relations. The job sets an environment variable that points dbt at the production manifest in `prod-run-artifacts`. Complete the command.",
    "codeSnippet": "dbt build --select [[1]]:modified+ [[2]]",
    "codeLanguage": "bash",
    "blanks": [
      {
        "accepted": [
          "state"
        ]
      },
      {
        "accepted": [
          "--defer"
        ]
      }
    ],
    "explanation": "CORRECT ACTION:\nThe `state:modified+` selector compares the project with the manifest from a previous run and selects changed nodes and their descendants. Here the job supplies that manifest path through the `DBT_ENGINE_STATE` environment variable, which sets the same value as the `--state` flag. `--defer` resolves refs to unselected nodes using that manifest, but only when the node does not exist in the target database.\n\nCOMMON MISTAKES:\n- `result`: it selects nodes by their status in the previous `run_results.json` and does not detect code changes.\n- `--favor-state`: it makes deferral prefer the state manifest even when the node exists in the database, and it only works together with `--defer`.\n- `--full-refresh`: it rebuilds incremental models from scratch and does not resolve refs to another environment.",
    "references": "https://docs.getdbt.com/reference/node-selection/defer",
    "dbtVersionFocus": "Slim CI (state and defer)"
  },
  {
    "id": 2012,
    "format": "fill_blank",
    "category": "Developing and optimizing dbt models",
    "difficulty": "Basic",
    "questionText": "A project's `profiles.yml` defines two connections, `dev` and `prod`. dbt must use `dev` when a command does not choose a connection, and the production job chooses `prod` with a command-line flag. Complete the two keys in the profile below.",
    "codeSnippet": "my_project:\n  [[1]]: dev\n  [[2]]:\n    dev:\n      type: snowflake\n    prod:\n      type: snowflake",
    "codeLanguage": "yaml",
    "blanks": [
      {
        "accepted": [
          "target"
        ]
      },
      {
        "accepted": [
          "outputs"
        ]
      }
    ],
    "explanation": "CORRECT ACTION:\nThe `target` key in a profile names the default target, and the `outputs` key holds the target definitions. The production job selects another target for one command with `--target prod` (short form `-t prod`); the name must exist under `outputs`.\n\nCOMMON MISTAKES:\n- `default` or `profile` for the first key: the key that names the default target is `target`.\n- `targets` or `connections` for the second key: the target definitions sit under `outputs`.",
    "references": "https://docs.getdbt.com/docs/core/connect-data-platform/connection-profiles",
    "dbtVersionFocus": "Targets and profiles"
  },
  {
    "id": 3001,
    "format": "matching",
    "category": "Developing and optimizing dbt models",
    "difficulty": "Basic",
    "questionText": "You are choosing materializations for the models in a new project. Match each materialization to what dbt does when the model runs.",
    "prompts": [
      "`view`",
      "`table`",
      "`ephemeral`",
      "`incremental`"
    ],
    "choices": [
      "Inserts or updates records in an existing table since the last run",
      "Rebuilds the model as a view with a `create view as` statement",
      "Creates and maintains a materialized view in the target database",
      "Builds nothing in the database and interpolates its SQL into dependent models as a CTE",
      "Rebuilds the model as a table with a `create table as` statement"
    ],
    "matches": [
      1,
      4,
      3,
      0
    ],
    "explanation": "CORRECT ACTION:\n`view` is rebuilt as a view with `create view as`. `table` is rebuilt as a table with `create table as`. `ephemeral` models are not built in the database; dbt interpolates their code into dependent models as a common table expression. `incremental` models insert or update records in a table since the last run.\n\nCOMMON MISTAKES:\n- `table` with inserting or updating records since the last run: this describes `incremental`, because a `table` model is rebuilt in full on each run.\n- `ephemeral` with creating a materialized view: an `ephemeral` model creates no object in the database, and the materialized view behaviour belongs to `materialized_view`.\n- `view` with rebuilding the model as a table: the object type created by the model is what separates `view` from `table`.",
    "references": "https://docs.getdbt.com/docs/build/materializations",
    "dbtVersionFocus": "Materializations"
  },
  {
    "id": 3002,
    "format": "matching",
    "category": "Developing and optimizing dbt models",
    "difficulty": "Intermediate",
    "questionText": "An analytics engineer is evaluating incremental strategies for different models. Match each `incremental_strategy` to how it writes data to the target table.",
    "prompts": [
      "`append`",
      "`merge`",
      "`delete+insert`",
      "`insert_overwrite`",
      "`microbatch`"
    ],
    "choices": [
      "Replaces entire partitions of a partitioned table with new data",
      "Updates rows whose `unique_key` already exists and inserts the remaining rows",
      "Splits the data into time-based batches using an `event_time` column",
      "Inserts selected records without checking whether they already exist",
      "Deletes rows for the `unique_key` from the target, then inserts the new rows"
    ],
    "matches": [
      3,
      1,
      4,
      0,
      2
    ],
    "explanation": "CORRECT ACTION:\n`append` inserts selected records and does not check for duplicates. `merge` updates matched rows by `unique_key` and inserts new ones. `delete+insert` deletes the rows for the `unique_key` from the target and then inserts the new data. `insert_overwrite` replaces whole partitions. `microbatch` processes the model in time-based batches based on an `event_time` column.\n\nCOMMON MISTAKES:\n- `merge` with deleting rows and then inserting: that is `delete+insert`, which removes matching rows before the insert instead of updating them in place.\n- `insert_overwrite` with updating rows by `unique_key`: `insert_overwrite` works on whole partitions, not on individual rows.\n- `append` with time-based batches: `append` has no batching and does not use `event_time`.",
    "references": "https://docs.getdbt.com/docs/build/incremental-strategy",
    "dbtVersionFocus": "Incremental strategies"
  },
  {
    "id": 3003,
    "format": "matching",
    "category": "Developing and optimizing dbt models",
    "difficulty": "Intermediate",
    "questionText": "Match each node selector to the nodes it selects.",
    "prompts": [
      "`+my_model`",
      "`my_model+`",
      "`1+my_model`",
      "`my_model+1`",
      "`@my_model`"
    ],
    "choices": [
      "`my_model`, its descendants, and every ancestor of those descendants",
      "`my_model` and its first-degree descendants",
      "`my_model` and all of its descendants",
      "`my_model`, its first-degree ancestors, and its first-degree descendants",
      "`my_model` and its first-degree ancestors",
      "`my_model` and all of its ancestors"
    ],
    "matches": [
      5,
      2,
      4,
      1,
      0
    ],
    "explanation": "CORRECT ACTION:\nA `+` before the model selects its ancestors, and a `+` after it selects its descendants. A number next to the `+` limits how many degrees dbt steps through, so `1+my_model` selects first-degree ancestors and `my_model+1` selects first-degree descendants. The `@` operator selects the model, its descendants, and all ancestors of those descendants, which is useful in CI to build everything the descendants need.\n\nCOMMON MISTAKES:\n- `+my_model` with the descendants: the `+` on the left of the name goes upstream, so `my_model+` is the selector for descendants.\n- `@my_model` with the model and only its first-degree neighbours: that is `1+my_model+1`; `@` steps through as many degrees of ancestors as needed to build every descendant.\n- `1+my_model` with all ancestors: without a number, `+my_model` selects every ancestor, while the `1` limits it to the first degree.",
    "references": "https://docs.getdbt.com/reference/node-selection/graph-operators",
    "dbtVersionFocus": "Node selection graph operators"
  },
  {
    "id": 3004,
    "format": "matching",
    "category": "Developing and optimizing dbt models",
    "difficulty": "Basic",
    "questionText": "Match each Jinja function or variable available in model SQL to what it resolves to.",
    "prompts": [
      "`ref()`",
      "`source()`",
      "`var()`",
      "`env_var()`",
      "`this`"
    ],
    "choices": [
      "Resolves to a project variable, or to the value passed with `--vars`",
      "Resolves to the relation of the model currently being built",
      "Resolves to another model, seed or snapshot and creates a dependency on it",
      "Resolves to properties of the active connection target, such as its name or schema",
      "Resolves to a system environment variable and raises an error if it is unset and has no default",
      "Resolves to a table declared under `sources` in YAML and creates a dependency on it"
    ],
    "matches": [
      2,
      5,
      0,
      4,
      1
    ],
    "explanation": "CORRECT ACTION:\n`ref()` returns a relation for a model, seed or snapshot and creates a dependency. `source()` returns a relation for a source declared in YAML and also creates a dependency. `var()` returns a project variable or the value passed with `--vars`. `env_var()` reads a system environment variable and raises a compilation error when it is unset and no default is given. `this` is the database representation of the current model.\n\nCOMMON MISTAKES:\n- `ref()` with a table declared under `sources`: raw tables declared in YAML are referenced with `source()`, and `ref()` is for models, seeds and snapshots.\n- `this` with another model: `this` always points to the model being built, which is why it is used in incremental filters and hooks.\n- `var()` with a system environment variable: `var()` reads values defined in the project or passed with `--vars`, while `env_var()` reads the operating system environment.",
    "references": "https://docs.getdbt.com/reference/dbt-jinja-functions/ref",
    "dbtVersionFocus": "Jinja functions"
  },
  {
    "id": 3005,
    "format": "matching",
    "category": "Debugging data modeling errors",
    "difficulty": "Intermediate",
    "questionText": "While debugging a failed deployment job you inspect the artifacts that dbt wrote to `target/`. Match each artifact to the information it holds.",
    "prompts": [
      "`manifest.json`",
      "`run_results.json`",
      "`catalog.json`",
      "`sources.json`"
    ],
    "choices": [
      "Freshness results for sources, including the latest `loaded_at_field` value found",
      "A representation of the project's resources and their configurations, including parent and child maps",
      "The expected schema of each source table, generated from `sources.yml`",
      "The status and execution time of each node that was executed in the invocation",
      "Column names and data types of warehouse tables and views, produced by `dbt docs generate`"
    ],
    "matches": [
      1,
      3,
      4,
      0
    ],
    "explanation": "CORRECT ACTION:\n`manifest.json` contains the full representation of the project's resources, configurations and properties, along with `parent_map` and `child_map`. `run_results.json` records the status, timing and execution time of each node that ran. `catalog.json` holds information from the warehouse about tables and views, such as column names and types, and is produced by `dbt docs generate`. `sources.json` holds the freshness results for sources.\n\nCOMMON MISTAKES:\n- `manifest.json` with column names and data types from the warehouse: the manifest is built from project files, while `catalog.json` is built from warehouse metadata.\n- `catalog.json` with the status of each node: statuses and execution times are recorded in `run_results.json`, which is the first file to read after a failed run.\n- `run_results.json` with source freshness results: freshness results are written to `sources.json`, not to `run_results.json`.",
    "references": "https://docs.getdbt.com/reference/artifacts/dbt-artifacts",
    "dbtVersionFocus": "Artifacts"
  },
  {
    "id": 3006,
    "format": "matching",
    "category": "Debugging data modeling errors",
    "difficulty": "Intermediate",
    "questionText": "You are troubleshooting a project that no longer runs as expected. Match each command to its effect.",
    "prompts": [
      "`dbt debug`",
      "`dbt parse`",
      "`dbt compile`",
      "`dbt ls`",
      "`dbt show`"
    ],
    "choices": [
      "Prints the names or paths of the resources that match a selector",
      "Tests the database connection and checks the project file and dependencies",
      "Removes the directories listed under `clean-targets` in `dbt_project.yml`",
      "Displays a preview of the rows a model's query returns, without materializing them",
      "Renders Jinja into executable SQL and writes the files to `target/`",
      "Validates Jinja and YAML syntax and writes a manifest that has no compiled code"
    ],
    "matches": [
      1,
      5,
      4,
      0,
      3
    ],
    "explanation": "CORRECT ACTION:\n`dbt debug` tests the database connection and shows information about the project file, the dbt version and dependencies. `dbt parse` validates Jinja and YAML and writes a manifest without compiled code, because it does not connect to the warehouse. `dbt compile` generates executable SQL into `target/`. `dbt ls` lists the resources that match a selector. `dbt show` previews the results of a query in the terminal without materializing them.\n\nCOMMON MISTAKES:\n- `dbt compile` with a manifest that has no compiled code: that is `dbt parse`, while `dbt compile` produces the compiled SQL files.\n- `dbt debug` with debug-level logging: the `--debug` flag increases log verbosity, while the `dbt debug` command checks the connection and setup.\n- `dbt ls` with removing directories: removing the directories in `clean-targets` is the job of `dbt clean`.",
    "references": "https://docs.getdbt.com/reference/commands/compile",
    "dbtVersionFocus": "Debugging commands"
  },
  {
    "id": 3007,
    "format": "matching",
    "category": "Debugging data modeling errors",
    "difficulty": "Intermediate",
    "questionText": "A team needs to investigate failures in a long-running `dbt build`. Match each command-line flag to its effect.",
    "prompts": [
      "`--fail-fast`",
      "`--empty`",
      "`--warn-error`",
      "`--debug`",
      "`--store-failures`"
    ],
    "choices": [
      "Saves the rows that fail a test into a table in the database",
      "Shows debug-level log output in the terminal as well as in `logs/dbt.log`",
      "Re-runs only the nodes that failed in the previous invocation",
      "Converts every dbt warning into an error",
      "Exits immediately when the first run or test failure occurs",
      "Limits refs and sources to zero rows while still running the model SQL"
    ],
    "matches": [
      4,
      5,
      3,
      1,
      0
    ],
    "explanation": "CORRECT ACTION:\n`--fail-fast` makes dbt exit on the first failure. `--empty` limits refs and sources to zero rows but still runs the model SQL against the warehouse. `--warn-error` turns all warnings into errors. `--debug` sends debug-level logs to the terminal in addition to `logs/dbt.log`. `--store-failures` saves the failing rows of tests in the database.\n\nCOMMON MISTAKES:\n- `--fail-fast` with re-running the failed nodes: re-running from the point of failure is done by the `dbt retry` command, and `--fail-fast` only stops the current invocation early.\n- `--warn-error` with exiting on the first failure: `--warn-error` affects how warnings are treated, and does not stop the run on an ordinary error.\n- `--empty` with saving failing rows: `--empty` reads zero rows from inputs, while `--store-failures` writes test failures to the database.",
    "references": "https://docs.getdbt.com/reference/global-configs/about-global-configs",
    "dbtVersionFocus": "Command-line flags"
  },
  {
    "id": 3008,
    "format": "matching",
    "category": "Implementing dbt tests",
    "difficulty": "Basic",
    "questionText": "Match each built-in generic test to the condition that makes it fail.",
    "prompts": [
      "`unique`",
      "`not_null`",
      "`accepted_values`",
      "`relationships`"
    ],
    "choices": [
      "Fails when a column value has no matching value in a column of a related model",
      "Fails when a column contains duplicate values",
      "Fails when a numeric column holds a value outside a set minimum and maximum",
      "Fails when a column contains a value that is not in a listed set",
      "Fails when a column contains null values"
    ],
    "matches": [
      1,
      4,
      3,
      0
    ],
    "explanation": "CORRECT ACTION:\n`unique` fails when a column has duplicate values. `not_null` fails when a column has nulls. `accepted_values` fails when a value is not in the list given in `values`. `relationships` checks referential integrity, so it fails when a value has no match in the referenced model's column.\n\nCOMMON MISTAKES:\n- `accepted_values` with a numeric minimum and maximum: the built-in test compares against an explicit list of values, and range checks come from packages.\n- `relationships` with a listed set of values: `relationships` compares against the values in another model, not against a list written in YAML.\n- `unique` with null values: nulls are checked by `not_null`, and `unique` looks only for duplicated values.",
    "references": "https://docs.getdbt.com/docs/build/data-tests",
    "dbtVersionFocus": "Generic data tests"
  },
  {
    "id": 3009,
    "format": "matching",
    "category": "Implementing dbt tests",
    "difficulty": "Advanced",
    "questionText": "A team wants to tune a data test on a large table so that it reports warnings and errors sensibly. Match each test config to what it controls.",
    "prompts": [
      "`severity`",
      "`error_if`",
      "`where`",
      "`limit`",
      "`fail_calc`"
    ],
    "choices": [
      "Caps the number of failing rows that the test query returns",
      "Filters the tested resource with a SQL condition before the test runs",
      "Reuses the failing rows stored by the previous test run instead of querying again",
      "Sets the calculation used to report the test result, `count(*)` by default",
      "Accepts a condition on the number of failures, such as `>1000`, that makes the test return an error",
      "Accepts `error` or `warn` and sets the level at which the test reports failures"
    ],
    "matches": [
      5,
      4,
      1,
      0,
      3
    ],
    "explanation": "CORRECT ACTION:\n`severity` takes `error` or `warn` and defaults to `error`. `error_if` takes a condition on the number of failures, for example `>1000`, that turns the result into an error. `where` is templated into the test query as a subquery that filters the tested resource. `limit` caps the number of failures returned. `fail_calc` defines how the failure result is calculated, with `count(*)` as the default.\n\nCOMMON MISTAKES:\n- `limit` with filtering the tested resource: `limit` restricts the failing rows returned, while `where` restricts which rows of the resource are tested.\n- `severity` with a condition on the number of failures: `severity` takes `error` or `warn`, and the failure-count conditions belong to `error_if` and `warn_if`.\n- `fail_calc` with the level at which the test reports failures: `fail_calc` changes how the result is calculated, not whether it is reported as an error or a warning.",
    "references": "https://docs.getdbt.com/reference/resource-configs/severity",
    "dbtVersionFocus": "Data test configs"
  },
  {
    "id": 3010,
    "format": "matching",
    "category": "Developing and optimizing dbt models",
    "difficulty": "Intermediate",
    "questionText": "A project is adding documentation to its models. Match each documentation feature to what it does.",
    "prompts": [
      "`{% docs %}` block",
      "`doc()`",
      "`persist_docs`",
      "`meta`"
    ],
    "choices": [
      "Stores arbitrary key-value pairs that are compiled into `manifest.json`",
      "Defines reusable text in a markdown file within the project",
      "Uploads the generated documentation site to the data warehouse",
      "Writes descriptions to the warehouse as relation and column comments",
      "Inserts the text of a docs block into a `description` field"
    ],
    "matches": [
      1,
      4,
      3,
      0
    ],
    "explanation": "CORRECT ACTION:\nA `{% docs %}` block defines reusable text in a markdown file. The `doc()` function pulls the text of a docs block into a `description` in a properties file. `persist_docs` writes resource descriptions to the warehouse as relation and column comments. `meta` accepts any key-value pairs, which are compiled into `manifest.json` and shown in the generated documentation.\n\nCOMMON MISTAKES:\n- `doc()` with defining reusable text: the block holds the text, and `doc()` is only the function that references it by name.\n- `persist_docs` with uploading the documentation site: `persist_docs` writes descriptions as comments on warehouse objects and does not publish a site.\n- `meta` with writing comments to the warehouse: `meta` is metadata stored in `manifest.json`, and it is `persist_docs` that writes comments to the database.",
    "references": "https://docs.getdbt.com/reference/dbt-jinja-functions/doc",
    "dbtVersionFocus": "Documentation"
  },
  {
    "id": 3011,
    "format": "matching",
    "category": "Leveraging the dbt state",
    "difficulty": "Advanced",
    "questionText": "A CI job selects nodes with `state:` and `result:` selectors, which compare against artifacts from a previous invocation passed with `--state`, as well as with other selector methods. Match each selector to the nodes it selects.",
    "prompts": [
      "`state:new`",
      "`state:modified`",
      "`result:error`",
      "`result:fail`",
      "`access:public`"
    ],
    "choices": [
      "Models whose `access` property is set to `public`",
      "Nodes with no matching `unique_id` in the comparison manifest",
      "Only test nodes that failed in the prior invocation",
      "New nodes plus any changes to existing nodes",
      "Nodes that were skipped in the prior invocation",
      "Any resource, including models and tests, that returned an error in the prior invocation"
    ],
    "matches": [
      1,
      3,
      5,
      2,
      0
    ],
    "explanation": "CORRECT ACTION:\n`state:new` selects nodes that have no node with the same `unique_id` in the comparison manifest. `state:modified` selects all new nodes plus changes to existing nodes. `result:error` selects any resource that returned an error in the prior invocation, and `result:fail` is specific to test nodes that failed. `access:public` selects models by their `access` property.\n\nCOMMON MISTAKES:\n- `state:new` with new nodes plus changes to existing nodes: that is `state:modified`, which includes new nodes and also nodes whose definitions changed.\n- `result:fail` with any resource that returned an error: `result:fail` applies only to tests, while `result:error` covers models, snapshots and other resources.\n- `access:public` with nodes that have no match in the comparison manifest: `access` reads a model property and does not compare against any state.",
    "references": "https://docs.getdbt.com/reference/node-selection/methods",
    "dbtVersionFocus": "State and result selectors"
  },
  {
    "id": 3012,
    "format": "matching",
    "category": "Troubleshooting and optimizing dbt pipelines",
    "difficulty": "Intermediate",
    "questionText": "You are building steps for a production deployment job. Match each dbt command to its effect.",
    "prompts": [
      "`dbt retry`",
      "`dbt clone`",
      "`dbt seed`",
      "`dbt build`",
      "`dbt source freshness`"
    ],
    "choices": [
      "Loads CSV files from `seed-paths` into the warehouse as tables",
      "Checks each source against its configured `freshness` thresholds",
      "Runs all selected models first and then all tests in separate passes",
      "Re-executes the previous invocation from the point of failure",
      "Copies selected nodes from the `--state` environment into the target schema as clones or views",
      "Runs models, tests, snapshots and seeds in DAG order"
    ],
    "matches": [
      3,
      4,
      0,
      5,
      1
    ],
    "explanation": "CORRECT ACTION:\n`dbt retry` re-executes the last invocation from the point of failure, using `run_results.json`. `dbt clone` clones selected nodes from the state you pass into the target schema, as zero-copy clones or pointer views. `dbt seed` loads CSV files from `seed-paths` as tables. `dbt build` runs models, tests, snapshots and seeds in DAG order. `dbt source freshness` evaluates the `freshness` config of each source.\n\nCOMMON MISTAKES:\n- `dbt build` with running models first and then tests in separate passes: `dbt build` runs each resource in DAG order, so a test on an upstream model runs before its downstream models.\n- `dbt clone` with re-executing from the point of failure: `dbt retry` is the command that reads `run_results.json` and continues from the failed node.\n- `dbt seed` with checking source freshness: seeds are CSV files in the project, and freshness is evaluated on sources by `dbt source freshness`.",
    "references": "https://docs.getdbt.com/reference/commands/build",
    "dbtVersionFocus": "Job commands"
  },
  {
    "id": 4001,
    "format": "build_list",
    "category": "Developing and optimizing dbt models",
    "difficulty": "Basic",
    "questionText": "The `materialized` config for the model `stg_orders` is set in several places. Order these settings from highest to lowest precedence.",
    "items": [
      "A `config(materialized='view')` call in `stg_orders.sql`",
      "A `config` property for `stg_orders` in a `.yml` file",
      "`+materialized` under the `staging` subdirectory key in `dbt_project.yml`",
      "`+materialized` under the project name key in `dbt_project.yml`"
    ],
    "distractors": [
      "A `materialized` setting in the target block of `profiles.yml`"
    ],
    "explanation": "CORRECT ACTION:\nThe most specific config wins. An in-file `config()` block overrides properties set in a `.yml` file, which override configs in `dbt_project.yml`. Inside `dbt_project.yml`, a config on a subdirectory overrides a config applied to the whole project.\n\nCOMMON MISTAKES:\n- Placing `dbt_project.yml` above the `.yml` properties file: the project file holds the least specific configs, so it is overridden by the properties file.\n- Placing the project-wide key above the subdirectory key: a config on a subdirectory takes precedence over the project-wide config.\n- Including a `materialized` setting in `profiles.yml`: `profiles.yml` holds connection details and does not set model configs.",
    "references": "https://docs.getdbt.com/reference/define-configs",
    "dbtVersionFocus": "Config precedence"
  },
  {
    "id": 4002,
    "format": "build_list",
    "category": "Developing and optimizing dbt models",
    "difficulty": "Basic",
    "questionText": "You need to bring a raw `orders` table in the `shop` schema into your project with a staging model, and check it after it is built. Order the steps from first to last.",
    "items": [
      "Declare the `shop` source and its `orders` table in a `.yml` file, create `stg_orders.sql` that selects from `{{ source('shop', 'orders') }}`, and add a `unique` test on `id` for `stg_orders`",
      "Run `dbt run --select stg_orders` to build the model",
      "Run `dbt test --select stg_orders` to test the built model"
    ],
    "distractors": [
      "Run `dbt seed --select orders` to load the raw table"
    ],
    "explanation": "CORRECT ACTION:\nThe source declaration, the model that calls `source()` and the test are all defined in the project first. The model is then built with `dbt run`, and tested with `dbt test` once the relation exists in the warehouse.\n\nCOMMON MISTAKES:\n- Running `dbt seed` to load the raw table: `dbt seed` loads CSV files from the project, not tables that already exist in the warehouse.\n- Testing before building: `dbt test` queries the relation, so the model must be built first.\n- Running `dbt test` without defining a test: there is nothing for the command to run.",
    "references": "https://docs.getdbt.com/docs/build/sources",
    "dbtVersionFocus": "Sources and staging models"
  },
  {
    "id": 4003,
    "format": "build_list",
    "category": "Managing dbt models governance",
    "difficulty": "Advanced",
    "questionText": "The `finance` project owns `monthly_revenue`. The `marketing` project needs to select from it using a cross-project `ref`. Order the steps from first to last.",
    "items": [
      "In `finance`, set `access: public` on `monthly_revenue`",
      "Run a successful deployment job in the `finance` production environment so a `manifest.json` is generated",
      "In `marketing`, list `finance` under `projects` in `dependencies.yml` and select from `{{ ref('finance', 'monthly_revenue') }}` in a model"
    ],
    "distractors": [
      "In `marketing`, add `finance` to `packages.yml` and run `dbt deps`"
    ],
    "explanation": "CORRECT ACTION:\nOnly public models can be referenced from another project, and the upstream project must run a successful deployment job after `access` is defined so its metadata exists. The downstream project then declares the dependency in `dependencies.yml` and uses the two-argument `ref` that includes the project name.\n\nCOMMON MISTAKES:\n- Adding `finance` to `packages.yml`: that installs its code as a package and does not create a project dependency on its public models.\n- Running the upstream job before setting `access: public`: the metadata generated by that run does not list the model as public.\n- Using the two-argument `ref` without listing the project in `dependencies.yml`: dbt cannot resolve a model from a project that is not a declared dependency.",
    "references": "https://docs.getdbt.com/docs/mesh/govern/project-dependencies",
    "dbtVersionFocus": "dbt Mesh project dependencies"
  },
  {
    "id": 4004,
    "format": "build_list",
    "category": "Developing and optimizing dbt models",
    "difficulty": "Intermediate",
    "questionText": "You track changes to the `orders` source with a snapshot named `orders_snapshot`. Order the events from first to last so that a later change to a source row is recorded as a new version, with the previous version closed.",
    "items": [
      "Define `orders_snapshot` in a `.yml` file with `relation`, `unique_key`, `strategy` and `updated_at`",
      "Run `dbt snapshot` to create the snapshot table, where every row has `dbt_valid_to` set to null",
      "A source row changes and its `updated_at` value moves forward",
      "Run `dbt snapshot` again",
      "dbt sets `dbt_valid_to` on the old record and inserts the changed row with `dbt_valid_to` set to null"
    ],
    "distractors": [
      "Run `dbt snapshot --full-refresh` to drop and recreate the snapshot table"
    ],
    "explanation": "CORRECT ACTION:\nThe snapshot is defined first. The first `dbt snapshot` creates the table from the query result with `dbt_valid_from` and `dbt_valid_to`. After a source row changes, the next `dbt snapshot` closes the old record by setting `dbt_valid_to` and inserts the new version.\n\nCOMMON MISTAKES:\n- Running `dbt snapshot --full-refresh`: `dbt snapshot` has no `--full-refresh` option, so the command fails, and `dbt build --full-refresh` leaves snapshot tables and their history as they are.\n- Running `dbt snapshot` before the source row changes: dbt finds no change to record, so no new version is inserted.\n- Treating the change as visible before the second run: the snapshot table only updates when `dbt snapshot` runs.",
    "references": "https://docs.getdbt.com/docs/build/snapshots",
    "dbtVersionFocus": "v1.9+ (YAML snapshots)"
  },
  {
    "id": 4005,
    "format": "build_list",
    "category": "Implementing dbt tests",
    "difficulty": "Intermediate",
    "questionText": "The model `dim_customers` has a unit test and a `not_null` data test, and `fct_orders` depends on it. During `dbt build`, order what happens from first to last.",
    "items": [
      "The unit test runs on `dim_customers` with mocked inputs",
      "`dim_customers` is materialized in the warehouse",
      "The `not_null` data test runs on `dim_customers`",
      "`fct_orders` is built"
    ],
    "distractors": [
      "`dim_customers` is rebuilt after its data test passes"
    ],
    "explanation": "CORRECT ACTION:\n`dbt build` runs in lineage order. For a model, the unit tests run first, then the model is materialized, then its data tests run. Downstream models only run after those tests pass.\n\nCOMMON MISTAKES:\n- Running the data test before materializing: data tests query the built relation, so they cannot run first.\n- Building `fct_orders` before the data test: a failing test on `dim_customers` skips `fct_orders`, so it must wait for the test.\n- Rebuilding `dim_customers` after its data test: `dbt build` materializes each model once per run.",
    "references": "https://docs.getdbt.com/docs/build/unit-tests",
    "dbtVersionFocus": "Unit tests and dbt build order"
  },
  {
    "id": 4006,
    "format": "build_list",
    "category": "Implementing dbt tests",
    "difficulty": "Advanced",
    "questionText": "You run `dbt test --store-failures` and the `unique` test on `orders.order_id` finds duplicates. Order what dbt does from first to last.",
    "items": [
      "dbt compiles the test into a `select` query that returns the failing rows",
      "dbt saves the failing rows to a table in the audit schema",
      "dbt counts the rows in the saved table",
      "dbt reports the test result from that count"
    ],
    "distractors": [
      "dbt appends the failing rows to the previous run's failures table"
    ],
    "explanation": "CORRECT ACTION:\nA generic test compiles to a query that returns the rows where the assertion is false. With `--store-failures`, dbt saves those rows to a table first and then counts them, and the count decides the result.\n\nCOMMON MISTAKES:\n- Counting before saving: with `store_failures`, the failing rows are written to a table first and counted afterwards.\n- Appending to the previous failures table: the results of a test replace the previous failures stored for the same test.\n- Reporting the result before counting rows: the result depends on how many rows the test query returned.",
    "references": "https://docs.getdbt.com/docs/build/data-tests",
    "dbtVersionFocus": "Data tests and `store_failures`"
  },
  {
    "id": 4007,
    "format": "build_list",
    "category": "Implementing dbt tests",
    "difficulty": "Intermediate",
    "questionText": "You want a reusable generic test named `is_positive` for numeric columns, and the `amount` column of `orders` contains only positive values. Order the steps from first to last.",
    "items": [
      "Write a `{% test is_positive(model, column_name) %}` block that selects the rows where the column is not positive, and add `is_positive` under `data_tests` for `amount` in a `.yml` file",
      "Run `dbt test --select orders`",
      "dbt marks the test as passed because the query returns zero rows"
    ],
    "distractors": [
      "Run `dbt compile` to register the test with the project"
    ],
    "explanation": "CORRECT ACTION:\nA generic test is a `test` block that returns the rows that break the assertion. It is applied to a column through `data_tests` in YAML, and `dbt test` runs it. A test passes when its query returns zero rows.\n\nCOMMON MISTAKES:\n- Writing the block to select rows where the column is positive: the query must return the failing rows, so any returned row makes the test fail.\n- Running `dbt compile` to register the test: dbt registers tests when it parses the project, so no separate step is needed.\n- Expecting a pass before `dbt test` runs: the result only exists once the test query has executed.",
    "references": "https://docs.getdbt.com/docs/build/data-tests",
    "dbtVersionFocus": "Generic data tests"
  },
  {
    "id": 4008,
    "format": "build_list",
    "category": "Debugging data modeling errors",
    "difficulty": "Basic",
    "questionText": "`dbt run --select customers` stops with a `Database Error` because the warehouse rejected the SQL. Order the debugging steps from first to last, following the process in dbt's guide to debugging errors.",
    "items": [
      "Read the error message to find the error type and the file involved",
      "Open the model and its compiled SQL in `target/run/` side by side",
      "Run the compiled query in a query runner to reproduce the error",
      "Fix the mistake in the model",
      "Rerun the failed model"
    ],
    "distractors": [
      "Run `dbt clean` to remove the `target/` directory"
    ],
    "explanation": "CORRECT ACTION:\nStart with the error message, which names the error type and the file. Then compare the model with the compiled SQL in `target/run/`, run that query yourself to isolate the problem, fix it, and rerun only the failed model.\n\nCOMMON MISTAKES:\n- Fixing the model before reproducing the error: running the compiled query first confirms which part of the SQL the warehouse rejects.\n- Running `dbt clean`: it deletes the compiled files in `target/` that are needed to inspect the failing SQL.\n- Rerunning before fixing: the same SQL fails again with the same `Database Error`.",
    "references": "https://docs.getdbt.com/guides/debug-errors",
    "dbtVersionFocus": "Debugging database errors"
  },
  {
    "id": 4009,
    "format": "build_list",
    "category": "Troubleshooting and optimizing dbt pipelines",
    "difficulty": "Intermediate",
    "questionText": "In a `dbt build`, `fct_orders` depends on `stg_orders`, and the `not_null` test on `stg_orders.order_id` fails with 23 rows. Order what dbt did, from first to last.",
    "items": [
      "Built the model `stg_orders`",
      "Ran the `not_null` test on `stg_orders.order_id`",
      "Found 23 rows that failed the test",
      "Skipped the downstream model `fct_orders`"
    ],
    "distractors": [
      "Retried `fct_orders` after the test failed"
    ],
    "explanation": "CORRECT ACTION:\n`dbt build` follows the DAG. `stg_orders` is built, its test runs and fails with 23 rows, and the failure blocks `fct_orders`, which is skipped.\n\nCOMMON MISTAKES:\n- Placing the skip before the test failure: a model is only skipped because a test on one of its parents failed.\n- Placing the test before the model build: the test queries `stg_orders`, so it must be built first.\n- Including a retry of `fct_orders`: dbt does not retry skipped nodes within the same run.",
    "references": "https://docs.getdbt.com/reference/commands/build",
    "dbtVersionFocus": "dbt build skip behavior"
  },
  {
    "id": 4010,
    "format": "build_list",
    "category": "Debugging data modeling errors",
    "difficulty": "Advanced",
    "questionText": "A macro calls `run_query` and reads `results.columns[0]` without checking `execute`. It fails with `'None' has no attribute 'table'`. Order what dbt does during `dbt run` from first to last.",
    "items": [
      "Read the project files and identify `ref`, `source` and macro definitions",
      "Build the dependency graph from the parsed `ref` and `source` calls",
      "For a node that is about to run, render its Jinja into SQL with `execute` set to true and resolve `ref()` to relation names",
      "Run that node's rendered SQL in the warehouse to create or update the relation"
    ],
    "distractors": [
      "Run each model's SQL to discover its dependencies"
    ],
    "explanation": "CORRECT ACTION:\nDuring parsing, `execute` is false and no SQL runs, so a query result is `None`. dbt reads the files, builds the DAG from `ref` and `source`, and only in the execution phase renders the Jinja fully and runs SQL. A macro that uses query results must be guarded with `execute`.\n\nCOMMON MISTAKES:\n- Running SQL to discover dependencies: dbt finds dependencies from `ref` and `source` calls without running any SQL.\n- Resolving `ref()` before building the graph: during parsing `ref()` is only a placeholder used to record the dependency.\n- Running SQL before rendering: the SQL is produced by rendering the Jinja, so rendering must come first.",
    "references": "https://docs.getdbt.com/reference/dbt-jinja-functions/execute",
    "dbtVersionFocus": "Parse and execution phases"
  },
  {
    "id": 4011,
    "format": "build_list",
    "category": "Leveraging the dbt state",
    "difficulty": "Advanced",
    "questionText": "You set up a Slim CI job that builds only changed models and defers to production for the rest. Order the steps from first to last.",
    "items": [
      "A production job run writes `manifest.json` to its target directory",
      "The CI job stores that `manifest.json` in a directory such as `prod-run-artifacts`",
      "The CI job runs `dbt build --select \"state:modified+\" --defer --state prod-run-artifacts`",
      "dbt builds the modified models and their children, and resolves `ref` to unbuilt parents from the state manifest"
    ],
    "distractors": [
      "The CI job runs `dbt build --full-refresh` to rebuild every model in the CI schema"
    ],
    "explanation": "CORRECT ACTION:\n`state:modified+` and `--defer` both need a manifest from a previous run, which is passed with `--state`. The production run produces it and the CI job stores it, then the command builds the changed models and their children. For parents that are not selected and not in the CI schema, `ref` resolves to the state manifest.\n\nCOMMON MISTAKES:\n- Running the CI command before the production manifest is available: `--state` needs an existing manifest to compare against and to defer to.\n- Running `dbt build --full-refresh` on everything: it rebuilds the whole project instead of only the modified models and their children.\n- Resolving deferred `ref` calls before the build starts: dbt resolves them while it compiles the selected models.",
    "references": "https://docs.getdbt.com/reference/node-selection/defer",
    "dbtVersionFocus": "Slim CI with `state:modified+` and `--defer`"
  },
  {
    "id": 4012,
    "format": "build_list",
    "category": "Leveraging the dbt state",
    "difficulty": "Basic",
    "questionText": "A developer opens a pull request in a project that has a dbt CI job configured. Order what happens from first to last.",
    "items": [
      "The Git provider notifies dbt that the pull request was opened or updated",
      "dbt enqueues a run of the CI job",
      "dbt builds and tests the modified models and their children in a temporary schema unique to the pull request",
      "dbt updates the pull request with a status message showing the result",
      "dbt deletes the temporary schema when the pull request is closed or merged"
    ],
    "distractors": [
      "dbt merges the pull request after the checks pass"
    ],
    "explanation": "CORRECT ACTION:\nThe Git provider notification triggers a CI run. dbt builds and tests only the affected models in a schema unique to the pull request, reports the result on the pull request, and removes the schema once the pull request is closed or merged.\n\nCOMMON MISTAKES:\n- Merging the pull request automatically: a CI job reports a status and does not merge the pull request.\n- Deleting the temporary schema right after the run: the schema is kept until the pull request is closed or merged.\n- Building before the notification: the CI run is only enqueued after the Git provider reports the change.",
    "references": "https://docs.getdbt.com/docs/deploy/continuous-integration",
    "dbtVersionFocus": "dbt platform CI jobs"
  },
  {
    "id": 5001,
    "format": "hotspot",
    "category": "Developing and optimizing dbt models",
    "difficulty": "Basic",
    "questionText": "The incremental model below uses the adapter's default incremental strategy and receives updated versions of orders it has already loaded. Click the line that makes dbt update the existing row for a changed order instead of inserting a duplicate.",
    "codeSnippet": "{{\n    config(\n        materialized='incremental',\n        unique_key='order_id',\n        on_schema_change='fail'\n    )\n}}\n\nselect order_id, customer_id, status, updated_at\nfrom {{ ref('stg_orders') }}\n{% if is_incremental() %}\nwhere updated_at > (select max(updated_at) from {{ this }})\n{% endif %}",
    "codeLanguage": "sql",
    "target": {
      "kind": "code_lines",
      "correctLines": [
        4
      ]
    },
    "explanation": "CORRECT ACTION:\n`unique_key='order_id'` identifies a single row. With the default incremental strategy, when a new row has the same key as a row already in the target table, dbt updates or replaces the old row instead of appending a second one.\n\nCOMMON MISTAKES:\n- `where updated_at > (select max(updated_at) from {{ this }})`: this filter limits which source rows are read on an incremental run, but without a unique key most adapters append every returned row, so changed orders would be duplicated.\n- `materialized='incremental'`: this makes the model incremental but does not say how matching rows are identified.\n- `on_schema_change='fail'`: this controls what happens when the model's columns change, not how rows are matched.",
    "references": "https://docs.getdbt.com/docs/build/incremental-models",
    "dbtVersionFocus": "Incremental models"
  },
  {
    "id": 5002,
    "format": "hotspot",
    "category": "Developing and optimizing dbt models",
    "difficulty": "Intermediate",
    "questionText": "In the warehouse, the table that `{{ source('stripe', 'payments') }}` must read is not named `payments`. Click the line that tells dbt the physical table name behind the source table `payments`.",
    "codeSnippet": "sources:\n  - name: stripe\n    database: raw\n    schema: payments_raw\n    tables:\n      - name: payments\n        identifier: payments_v2\n        config:\n          loaded_at_field: _loaded_at\n      - name: refunds",
    "codeLanguage": "yaml",
    "target": {
      "kind": "code_lines",
      "correctLines": [
        7
      ]
    },
    "explanation": "CORRECT ACTION:\n`identifier: payments_v2` sets the actual name of the table in the warehouse. The source table keeps the name `payments` in `source()` calls, and dbt resolves it to `payments_v2`.\n\nCOMMON MISTAKES:\n- `- name: payments`: this is the name used inside `source('stripe', 'payments')`, not the name of the table in the warehouse.\n- `schema: payments_raw`: this sets the schema that holds the tables, not a table name.\n- `loaded_at_field: _loaded_at`: this names the timestamp column used for freshness checks and has no effect on which table is read.",
    "references": "https://docs.getdbt.com/reference/source-properties",
    "dbtVersionFocus": "Source properties"
  },
  {
    "id": 5003,
    "format": "hotspot",
    "category": "Developing and optimizing dbt models",
    "difficulty": "Intermediate",
    "questionText": "Select every model that `dbt run --select 1+fct_orders` builds.",
    "target": {
      "kind": "dag",
      "nodes": [
        {
          "id": "raw_shop",
          "label": "source: raw_shop",
          "column": 0,
          "row": 1
        },
        {
          "id": "stg_orders",
          "label": "stg_orders",
          "column": 1,
          "row": 0
        },
        {
          "id": "stg_payments",
          "label": "stg_payments",
          "column": 1,
          "row": 1
        },
        {
          "id": "stg_customers",
          "label": "stg_customers",
          "column": 1,
          "row": 2
        },
        {
          "id": "int_order_payments",
          "label": "int_order_payments",
          "column": 2,
          "row": 0
        },
        {
          "id": "fct_orders",
          "label": "fct_orders",
          "column": 3,
          "row": 0
        },
        {
          "id": "dim_customers",
          "label": "dim_customers",
          "column": 3,
          "row": 2
        }
      ],
      "edges": [
        [
          "raw_shop",
          "stg_orders"
        ],
        [
          "raw_shop",
          "stg_payments"
        ],
        [
          "raw_shop",
          "stg_customers"
        ],
        [
          "stg_orders",
          "int_order_payments"
        ],
        [
          "stg_payments",
          "int_order_payments"
        ],
        [
          "int_order_payments",
          "fct_orders"
        ],
        [
          "stg_customers",
          "fct_orders"
        ],
        [
          "stg_customers",
          "dim_customers"
        ]
      ],
      "correctNodes": [
        "fct_orders",
        "int_order_payments",
        "stg_customers"
      ]
    },
    "explanation": "CORRECT ACTION:\n`1+fct_orders` selects `fct_orders` and its ancestors up to one edge away. The first-degree parents of `fct_orders` are `int_order_payments` and `stg_customers`, so these two models and `fct_orders` are built.\n\nCOMMON MISTAKES:\n- `stg_orders` and `stg_payments`: these are second-degree ancestors, parents of `int_order_payments`, and `1+` stops after one edge.\n- `dim_customers`: it shares the parent `stg_customers` with `fct_orders` but is not an ancestor of `fct_orders`, so the `+` before the model does not select it.\n- `source: raw_shop`: a source is not a model, so `dbt run` does not build it, and it is also more than one edge away from `fct_orders`.",
    "references": "https://docs.getdbt.com/reference/node-selection/graph-operators",
    "dbtVersionFocus": "Graph operators"
  },
  {
    "id": 5004,
    "format": "hotspot",
    "category": "Developing and optimizing dbt models",
    "difficulty": "Basic",
    "questionText": "`dbt run` sometimes builds `dim_customers` before one of the models it selects from, and the run fails because that model does not exist yet. Click the line that causes the wrong build order.",
    "codeSnippet": "{{ config(materialized='table') }}\n\nselect\n    c.customer_id,\n    c.customer_name,\n    count(o.order_id) as order_count\nfrom {{ ref('stg_customers') }} as c\nleft join analytics.stg_orders as o\n    on c.customer_id = o.customer_id\ngroup by 1, 2",
    "codeLanguage": "sql",
    "target": {
      "kind": "code_lines",
      "correctLines": [
        8
      ]
    },
    "explanation": "CORRECT ACTION:\n`left join analytics.stg_orders as o` hard-codes a table name. dbt reads dependencies from `ref` and `source` calls, so it does not know that `dim_customers` needs `stg_orders` and may build the models in any order.\n\nCOMMON MISTAKES:\n- `from {{ ref('stg_customers') }} as c`: this line already uses `ref`, so dbt builds `stg_customers` first.\n- `{{ config(materialized='table') }}`: the materialization does not affect the order in which models build.\n- `on c.customer_id = o.customer_id`: the join condition does not affect dependencies between models.",
    "references": "https://docs.getdbt.com/reference/dbt-jinja-functions/ref",
    "dbtVersionFocus": "The ref function"
  },
  {
    "id": 5005,
    "format": "hotspot",
    "category": "Debugging data modeling errors",
    "difficulty": "Intermediate",
    "questionText": "The first `dbt run` of this new incremental model fails because the target relation does not exist yet. Click the line that causes the error.",
    "codeSnippet": "{{ config(materialized='incremental', unique_key='event_id') }}\n\nselect\n    event_id,\n    user_id,\n    event_type,\n    event_at\nfrom {{ ref('stg_events') }}\nwhere event_at > (select max(event_at) from {{ this }})",
    "codeLanguage": "sql",
    "target": {
      "kind": "code_lines",
      "correctLines": [
        9
      ]
    },
    "explanation": "CORRECT ACTION:\n`where event_at > (select max(event_at) from {{ this }})` runs on every execution, including the first one. On the first run the table behind `{{ this }}` does not exist, so the query fails. The filter belongs inside an `is_incremental()` block, because the SQL must be valid whether `is_incremental()` is true or false.\n\nCOMMON MISTAKES:\n- `{{ config(materialized='incremental', unique_key='event_id') }}`: both configs are valid and do not query the target table.\n- `from {{ ref('stg_events') }}`: `ref` reads the upstream model, which already exists, so it does not cause a missing-relation error.\n- `event_at`: a column in the select list is valid and is not read from the target table.",
    "references": "https://docs.getdbt.com/docs/build/incremental-models",
    "dbtVersionFocus": "Incremental models"
  },
  {
    "id": 5006,
    "format": "hotspot",
    "category": "Managing dbt models governance",
    "difficulty": "Advanced",
    "questionText": "The SQL of `dim_customers` returns exactly the four columns listed below, and each declared `data_type` matches the type the SQL returns. `dbt run` fails with an error about the enforced contract on `dim_customers`. Click the line that causes the error.",
    "codeSnippet": "models:\n  - name: dim_customers\n    config:\n      contract:\n        enforced: true\n    columns:\n      - name: customer_id\n        data_type: int\n        constraints:\n          - type: not_null\n      - name: customer_name\n        data_type: string\n      - name: created_at\n        description: When the customer record was created.\n      - name: country_code\n        data_type: string\n        description: ISO 3166-1 alpha-2 country code.",
    "codeLanguage": "yaml",
    "target": {
      "kind": "code_lines",
      "correctLines": [
        13
      ]
    },
    "explanation": "CORRECT ACTION:\nWhen a contract is enforced, every column must have a `name` and a `data_type`. `- name: created_at` has a `description` but no `data_type`, so the contract is invalid.\n\nCOMMON MISTAKES:\n- `enforced: true`: this is the valid way to turn the contract on, nested under `contract` in `config`.\n- `- type: not_null`: a constraint is optional and `not_null` is a valid constraint type, so it is not the cause.\n- `data_type: int`: a declared data type is what the contract requires, and `int` is a type the warehouse understands.",
    "references": "https://docs.getdbt.com/docs/mesh/govern/model-contracts",
    "dbtVersionFocus": "Model contracts"
  },
  {
    "id": 5007,
    "format": "hotspot",
    "category": "Troubleshooting and optimizing dbt pipelines",
    "difficulty": "Advanced",
    "questionText": "During `dbt build`, a `unique` test on the model `stg_orders` fails with severity `error`. Select every model that dbt skips.",
    "target": {
      "kind": "dag",
      "nodes": [
        {
          "id": "raw_orders",
          "label": "source: raw_orders",
          "column": 0,
          "row": 0
        },
        {
          "id": "raw_customers",
          "label": "source: raw_customers",
          "column": 0,
          "row": 1
        },
        {
          "id": "stg_orders",
          "label": "stg_orders",
          "column": 1,
          "row": 0
        },
        {
          "id": "stg_customers",
          "label": "stg_customers",
          "column": 1,
          "row": 1
        },
        {
          "id": "int_orders_enriched",
          "label": "int_orders_enriched",
          "column": 2,
          "row": 0
        },
        {
          "id": "dim_customers",
          "label": "dim_customers",
          "column": 2,
          "row": 1
        },
        {
          "id": "fct_orders",
          "label": "fct_orders",
          "column": 3,
          "row": 0
        }
      ],
      "edges": [
        [
          "raw_orders",
          "stg_orders"
        ],
        [
          "raw_customers",
          "stg_customers"
        ],
        [
          "stg_orders",
          "int_orders_enriched"
        ],
        [
          "int_orders_enriched",
          "fct_orders"
        ],
        [
          "stg_customers",
          "fct_orders"
        ],
        [
          "stg_customers",
          "dim_customers"
        ]
      ],
      "correctNodes": [
        "int_orders_enriched",
        "fct_orders"
      ]
    },
    "explanation": "CORRECT ACTION:\nIn `dbt build`, a failing test blocks the resources downstream of the tested model, and dbt skips them. `int_orders_enriched` is a child of `stg_orders`, and `fct_orders` is downstream of `int_orders_enriched`, so both are skipped.\n\nCOMMON MISTAKES:\n- `stg_orders`: the model is built before its tests run, so it is already built when the test fails and is not skipped.\n- `dim_customers`: it depends only on `stg_customers`, which is not downstream of `stg_orders`, so it still runs.\n- `stg_customers`: it is a sibling branch with no dependency on `stg_orders`, so it builds normally even though `fct_orders` is skipped.",
    "references": "https://docs.getdbt.com/reference/commands/build",
    "dbtVersionFocus": "dbt build"
  },
  {
    "id": 5008,
    "format": "hotspot",
    "category": "Implementing dbt tests",
    "difficulty": "Intermediate",
    "questionText": "Click the line that sets how many failing rows make this `relationships` test report a failure instead of a warning.",
    "codeSnippet": "models:\n  - name: fct_orders\n    columns:\n      - name: customer_id\n        data_tests:\n          - relationships:\n              arguments:\n                to: ref('dim_customers')\n                field: customer_id\n              config:\n                severity: error\n                warn_if: \">0\"\n                error_if: \">10\"",
    "codeLanguage": "yaml",
    "target": {
      "kind": "code_lines",
      "correctLines": [
        13
      ]
    },
    "explanation": "CORRECT ACTION:\n`error_if: \">10\"` sets the failure threshold for an error. With this config, 1 to 10 failing rows give a warning from `warn_if`, and more than 10 give an error.\n\nCOMMON MISTAKES:\n- `warn_if: \">0\"`: this sets the threshold for a warning, not for an error.\n- `severity: error`: this is the default severity. dbt checks `error_if` first and then `warn_if`, so it does not hold the number of rows.\n- `field: customer_id`: this is an argument that names the column in the parent model, not a threshold.",
    "references": "https://docs.getdbt.com/reference/resource-configs/severity",
    "dbtVersionFocus": "dbt 1.10.5+ test arguments and config"
  },
  {
    "id": 5009,
    "format": "hotspot",
    "category": "Developing and optimizing dbt models",
    "difficulty": "Basic",
    "questionText": "Click the line whose description text is written in a Markdown file elsewhere in the project instead of in this YAML file.",
    "codeSnippet": "models:\n  - name: fct_orders\n    description: One row per completed order.\n    columns:\n      - name: order_id\n        description: Primary key of the order, as in **stg_orders**.\n        data_tests:\n          - unique\n      - name: status\n        description: '{{ doc(\"order_status\") }}'\n        data_tests:\n          - accepted_values:\n              arguments:\n                values: ['placed', 'shipped', 'returned']",
    "codeLanguage": "yaml",
    "target": {
      "kind": "code_lines",
      "correctLines": [
        10
      ]
    },
    "explanation": "CORRECT ACTION:\n`description: '{{ doc(\"order_status\") }}'` uses the `doc()` function, which expands to the markdown written in the `order_status` block (`{% docs order_status %}`) of a `.md` file.\n\nCOMMON MISTAKES:\n- `description: One row per completed order.`: this is a plain-text model description written directly in the YAML.\n- `description: Primary key of the order, as in **stg_orders**.`: the Markdown formatting is rendered in the docs site, but the text is written directly in the YAML.\n- `values: ['placed', 'shipped', 'returned']`: these are the arguments of the `accepted_values` test and do not describe anything.",
    "references": "https://docs.getdbt.com/docs/build/documentation",
    "dbtVersionFocus": "Docs blocks"
  },
  {
    "id": 5010,
    "format": "hotspot",
    "category": "Implementing and maintaining external dependencies",
    "difficulty": "Intermediate",
    "questionText": "The exposure `weekly_kpis` depends on the model `fct_revenue`. Select every model that `dbt run --select +exposure:weekly_kpis` builds.",
    "codeSnippet": "exposures:\n  - name: weekly_kpis\n    type: dashboard\n    owner:\n      name: Analytics Team\n    depends_on:\n      - ref('fct_revenue')",
    "codeLanguage": "yaml",
    "target": {
      "kind": "dag",
      "nodes": [
        {
          "id": "raw_shop",
          "label": "source: raw_shop",
          "column": 0,
          "row": 1
        },
        {
          "id": "stg_orders",
          "label": "stg_orders",
          "column": 1,
          "row": 0
        },
        {
          "id": "stg_payments",
          "label": "stg_payments",
          "column": 1,
          "row": 1
        },
        {
          "id": "stg_customers",
          "label": "stg_customers",
          "column": 1,
          "row": 2
        },
        {
          "id": "fct_revenue",
          "label": "fct_revenue",
          "column": 2,
          "row": 0
        },
        {
          "id": "fct_customers",
          "label": "fct_customers",
          "column": 2,
          "row": 2
        },
        {
          "id": "weekly_kpis",
          "label": "exposure: weekly_kpis",
          "column": 3,
          "row": 0
        }
      ],
      "edges": [
        [
          "raw_shop",
          "stg_orders"
        ],
        [
          "raw_shop",
          "stg_payments"
        ],
        [
          "raw_shop",
          "stg_customers"
        ],
        [
          "stg_orders",
          "fct_revenue"
        ],
        [
          "stg_payments",
          "fct_revenue"
        ],
        [
          "stg_customers",
          "fct_customers"
        ],
        [
          "fct_revenue",
          "weekly_kpis"
        ]
      ],
      "correctNodes": [
        "fct_revenue",
        "stg_orders",
        "stg_payments"
      ]
    },
    "explanation": "CORRECT ACTION:\nThe `+` before `exposure:weekly_kpis` selects the exposure and all of its ancestors. The exposure depends on `fct_revenue`, whose parents are `stg_orders` and `stg_payments`, so these three models are built.\n\nCOMMON MISTAKES:\n- `stg_customers` and `fct_customers`: they are on a separate branch that the exposure does not depend on, so they are not ancestors of the exposure.\n- `exposure: weekly_kpis`: the exposure is selected, but it is a downstream consumer and not a model, so `dbt run` has nothing to build for it.\n- `source: raw_shop`: a source is an ancestor of the exposure, but it is not a model and `dbt run` does not build it.",
    "references": "https://docs.getdbt.com/docs/build/exposures",
    "dbtVersionFocus": "Exposures"
  },
  {
    "id": 5011,
    "format": "hotspot",
    "category": "Implementing and maintaining external dependencies",
    "difficulty": "Intermediate",
    "questionText": "The job below runs on a schedule, and `./previous-artifacts` holds the artifacts of the previous run. Click the line that builds only the models downstream of sources that have loaded new data since the previous run.",
    "codeSnippet": "scheduled_build:\n  stage: deploy\n  script:\n    - dbt deps\n    - dbt source freshness\n    - dbt build --select \"state:modified+\" --state ./previous-artifacts\n    - dbt build --select \"source_status:fresher+\" --state ./previous-artifacts\n    - dbt build --select \"result:error+\" --state ./previous-artifacts\n    - dbt build --select \"source:stripe+\"\n  rules:\n    - if: $CI_PIPELINE_SOURCE == \"schedule\"",
    "codeLanguage": "yaml",
    "target": {
      "kind": "code_lines",
      "correctLines": [
        7
      ]
    },
    "explanation": "CORRECT ACTION:\n`dbt build --select \"source_status:fresher+\" --state ./previous-artifacts` compares the current freshness results with the previous ones and selects the sources with newer data plus everything downstream of them. The `+` adds the downstream nodes.\n\nCOMMON MISTAKES:\n- `dbt build --select \"state:modified+\" --state ./previous-artifacts`: this selects nodes whose code or config changed compared with the previous manifest, not sources with new data.\n- `dbt build --select \"result:error+\" --state ./previous-artifacts`: this selects nodes that errored in the previous run, based on `run_results.json`, not sources with new data.\n- `dbt build --select \"source:stripe+\"`: this selects everything downstream of the `stripe` source on every run, whether or not it has loaded new data.\n- `dbt source freshness`: this command produces the freshness results that `source_status:fresher+` compares, but it does not build any model.",
    "references": "https://docs.getdbt.com/reference/node-selection/methods",
    "dbtVersionFocus": "The source_status selector"
  },
  {
    "id": 5012,
    "format": "hotspot",
    "category": "Leveraging the dbt state",
    "difficulty": "Advanced",
    "questionText": "In a CI job, only the model `stg_payments` differs from the production manifest. Select every model that `dbt build --select \"state:modified+\" --state ./prod-artifacts` builds.",
    "target": {
      "kind": "dag",
      "nodes": [
        {
          "id": "raw_shop",
          "label": "source: raw_shop",
          "column": 0,
          "row": 1
        },
        {
          "id": "stg_orders",
          "label": "stg_orders",
          "column": 1,
          "row": 0
        },
        {
          "id": "stg_payments",
          "label": "stg_payments",
          "column": 1,
          "row": 1
        },
        {
          "id": "stg_customers",
          "label": "stg_customers",
          "column": 1,
          "row": 2
        },
        {
          "id": "fct_revenue",
          "label": "fct_revenue",
          "column": 2,
          "row": 0
        },
        {
          "id": "dim_customers",
          "label": "dim_customers",
          "column": 2,
          "row": 2
        },
        {
          "id": "finance_summary",
          "label": "finance_summary",
          "column": 3,
          "row": 0
        }
      ],
      "edges": [
        [
          "raw_shop",
          "stg_orders"
        ],
        [
          "raw_shop",
          "stg_payments"
        ],
        [
          "raw_shop",
          "stg_customers"
        ],
        [
          "stg_orders",
          "fct_revenue"
        ],
        [
          "stg_payments",
          "fct_revenue"
        ],
        [
          "stg_customers",
          "dim_customers"
        ],
        [
          "fct_revenue",
          "finance_summary"
        ]
      ],
      "correctNodes": [
        "stg_payments",
        "fct_revenue",
        "finance_summary"
      ]
    },
    "explanation": "CORRECT ACTION:\n`state:modified` selects `stg_payments`, the only node that differs from the manifest in `./prod-artifacts`. The `+` adds its descendants, `fct_revenue` and `finance_summary`.\n\nCOMMON MISTAKES:\n- `stg_orders`: it is a parent of `fct_revenue`, and `state:modified+` adds descendants, not ancestors of the descendants. The `@` operator would add it.\n- `stg_customers` and `dim_customers`: they are not modified and are not downstream of `stg_payments`.\n- `source: raw_shop`: it is not modified, and it is upstream of `stg_payments`, so the `+` after the selector does not add it.",
    "references": "https://docs.getdbt.com/reference/node-selection/methods",
    "dbtVersionFocus": "The state selector"
  },
  {
    "id": 2013,
    "format": "fill_blank",
    "category": "Managing dbt models governance",
    "difficulty": "Intermediate",
    "questionText": "Version 2 of the versioned model `dim_customers` is written in `models/customers_reworked.sql`, and the team does not want to rename that file. Complete the version entry so that dbt builds version 2 from it.",
    "codeSnippet": "models:\n  - name: dim_customers\n    versions:\n      - v: 1\n      - v: 2\n        [[1]]: customers_reworked",
    "codeLanguage": "yaml",
    "blanks": [
      {
        "accepted": [
          "defined_in"
        ]
      }
    ],
    "explanation": "CORRECT ACTION:\nBy default, dbt expects each version in a file named `<model_name>_v<v>`, and the latest version may also live in the unsuffixed `dim_customers.sql`. `defined_in` overrides that convention with any file name, given without the `.sql` extension.\n\nCOMMON MISTAKES:\n- `alias`: it sets the name of the database relation a version builds, not the file its SQL is read from.\n- Leaving the key out: dbt then looks for `dim_customers_v2.sql` or `dim_customers.sql` and does not use `customers_reworked.sql` for version 2.",
    "references": "https://docs.getdbt.com/docs/mesh/govern/model-versions",
    "dbtVersionFocus": "Model versions"
  },
  {
    "id": 3013,
    "format": "matching",
    "category": "Managing dbt models governance",
    "difficulty": "Intermediate",
    "questionText": "`dim_customers` declares versions 1, 2 and 3, with `latest_version: 2`. The project also has models that are not versioned, such as `stg_orders`. Match each `--select` value to the models it selects.",
    "prompts": [
      "`version:latest`",
      "`version:prerelease`",
      "`version:old`",
      "`version:none`",
      "`dim_customers`"
    ],
    "choices": [
      "Version 1 of `dim_customers`",
      "Version 2 of `dim_customers`",
      "Version 3 of `dim_customers`",
      "All three versions of `dim_customers`",
      "Only the models that are not versioned, such as `stg_orders`",
      "Versions 1 and 3 of `dim_customers`"
    ],
    "matches": [
      1,
      2,
      0,
      4,
      3
    ],
    "explanation": "CORRECT ACTION:\nThe `version` method classifies each version against `latest_version`. `version:latest` selects version 2, the one set in `latest_version`. `version:prerelease` selects versions newer than the latest, here version 3. `version:old` selects versions older than the latest, here version 1. `version:none` selects models that are not versioned. Selecting the model by name, `dim_customers`, selects all of its versions.\n\nCOMMON MISTAKES:\n- `version:latest` with version 3: the latest version is the one `latest_version` names, not the highest number.\n- `version:prerelease` with version 1: prerelease versions are newer than the latest, and older ones are `old`.\n- `dim_customers` with version 2 only: the model name selects every version; `dim_customers.v2` selects one.\n- Versions 1 and 3 together: none of these values selects that pair, because `old` and `prerelease` each select one side of the latest version.",
    "references": "https://docs.getdbt.com/reference/node-selection/methods",
    "dbtVersionFocus": "Model versions"
  },
  {
    "id": 4013,
    "format": "build_list",
    "category": "Debugging data modeling errors",
    "difficulty": "Basic",
    "questionText": "A behavior change flag in dbt switches between an old and a new behavior. Order the phases the flag goes through, from first to last.",
    "items": [
      "The new behavior is added behind the flag, which is disabled by default",
      "The flag's default switches to the new behavior, and setting it to `false` keeps the old one",
      "The old behavior is removed from the dbt codebase"
    ],
    "distractors": [
      "The flag moves from `dbt_project.yml` to `profiles.yml`, so each developer can set it"
    ],
    "explanation": "CORRECT ACTION:\nA behavior change flag is first introduced disabled by default, so the old behavior is kept unless you opt in. When it matures, its default switches to the new behavior; you can still keep the old behavior by setting the flag to `false`, but you may see deprecation warnings. Finally the old behavior is removed from the codebase.\n\nCOMMON MISTAKES:\n- Placing the default switch first: a new flag starts disabled, so upgrading dbt alone does not change behavior.\n- Placing the removal before maturity: the old behavior stays available, behind `false`, until it is removed.\n- Including the move to `profiles.yml`: behavior change flags are always set in the `flags` dictionary in `dbt_project.yml`.",
    "references": "https://docs.getdbt.com/reference/global-configs/behavior-changes",
    "dbtVersionFocus": "Behavior change flags"
  },
  {
    "id": 5013,
    "format": "hotspot",
    "category": "Managing dbt models governance",
    "difficulty": "Advanced",
    "questionText": "The project runs on Snowflake, and `dim_customers` declares the constraints below. Click the line that declares the only constraint here that Snowflake enforces, so that the model fails to build when its data violates it.",
    "codeSnippet": "models:\n  - name: dim_customers\n    config:\n      materialized: table\n      contract:\n        enforced: true\n    columns:\n      - name: customer_id\n        data_type: int\n        constraints:\n          - type: primary_key\n      - name: email\n        data_type: varchar\n        constraints:\n          - type: unique\n          - type: not_null\n      - name: account_id\n        data_type: int\n        constraints:\n          - type: foreign_key\n            to: ref('dim_accounts')\n            to_columns: [account_id]",
    "codeLanguage": "yaml",
    "target": {
      "kind": "code_lines",
      "correctLines": [
        16
      ]
    },
    "explanation": "CORRECT ACTION:\nOn Snowflake, `not_null` is definable and enforced, so a null `email` makes the build fail. `primary_key`, `unique` and `foreign_key` are definable but not enforced: Snowflake records them as metadata, and the model still builds when the data violates them.\n\nCOMMON MISTAKES:\n- `- type: primary_key`: Snowflake accepts it in the DDL but does not enforce it, so duplicate `customer_id` values do not stop the build.\n- `- type: unique`: also definable but not enforced on Snowflake.\n- `- type: foreign_key`: also recorded for metadata only, so an `account_id` missing from `dim_accounts` does not stop the build.\n- `enforced: true`: it enforces the contract, which constraints require, but it is not itself a constraint on the data.",
    "references": "https://docs.getdbt.com/docs/mesh/govern/model-contracts",
    "dbtVersionFocus": "Constraints"
  },
  {
    "id": 5014,
    "format": "hotspot",
    "category": "Developing and optimizing dbt models",
    "difficulty": "Intermediate",
    "questionText": "You run `dbt run --select fct_orders --empty` to check that `fct_orders` builds without reading its input data. Click the line whose input table dbt still reads in full during this run.",
    "codeSnippet": "{{ config(materialized='table') }}\n\nwith orders as (\n    select * from {{ ref('stg_orders') }}\n),\n\ncustomers as (\n    select * from {{ source('crm', 'customers') }}\n),\n\nfx_rates as (\n    select * from analytics.finance.fx_rates\n)\n\nselect\n    orders.order_id,\n    customers.customer_name,\n    orders.amount * fx_rates.rate_to_usd as amount_usd\nfrom orders\njoin customers on orders.customer_id = customers.customer_id\njoin fx_rates on orders.currency = fx_rates.currency",
    "codeLanguage": "sql",
    "target": {
      "kind": "code_lines",
      "correctLines": [
        12
      ]
    },
    "explanation": "CORRECT ACTION:\n`--empty` limits the refs and sources to zero rows: dbt replaces each `ref` and `source` with a subquery that returns no rows. `analytics.finance.fx_rates` is a hard-coded table name, not a `ref` or a `source`, so dbt sends it to the warehouse unchanged and the query reads the whole table.\n\nCOMMON MISTAKES:\n- `select * from {{ ref('stg_orders') }}`: the ref is wrapped in a `where false limit 0` subquery, so it returns zero rows.\n- `select * from {{ source('crm', 'customers') }}`: sources are limited to zero rows in the same way.\n- The `join` lines: they join the CTEs, whose inputs are already decided in the CTE definitions.",
    "references": "https://docs.getdbt.com/docs/build/empty-flag",
    "dbtVersionFocus": "Empty flag"
  },
  {
    "id": 2015,
    "format": "fill_blank",
    "category": "Leveraging the dbt state",
    "difficulty": "Intermediate",
    "questionText": "A job should run and test only the models downstream of sources that have loaded new data since the previous production run. `prod-artifacts` holds the `sources.json` written by that run's `dbt source freshness`. Complete the selector in the second command.",
    "codeSnippet": "dbt source freshness\ndbt build --select \"[[1]]:[[2]]+\" --state prod-artifacts",
    "codeLanguage": "bash",
    "blanks": [
      {
        "accepted": [
          "source_status"
        ]
      },
      {
        "accepted": [
          "fresher"
        ]
      }
    ],
    "explanation": "CORRECT ACTION:\n`source_status:fresher+` compares the current `sources.json` with the one in the `--state` directory and selects the sources that are fresher than in the previous run, plus everything downstream of them. Both runs must produce `sources.json`, which is why the job runs `dbt source freshness` before the build.\n\nCOMMON MISTAKES:\n- `state:modified`: it detects changes to project code and configuration, not new data in a source.\n- `source:<name>`: the `source` method selects sources by name, whether or not new data arrived, and does not compare freshness results.\n- `result:<status>`: it reads node statuses from a previous `run_results.json`, not source freshness results.",
    "references": "https://docs.getdbt.com/reference/node-selection/methods",
    "dbtVersionFocus": "source_status selector"
  },
  {
    "id": 2016,
    "format": "fill_blank",
    "category": "Troubleshooting and optimizing dbt pipelines",
    "difficulty": "Advanced",
    "questionText": "On Snowflake, a CI job builds into a schema unique to each pull request. As its first step, it clones from production the incremental models that are modified or downstream of a modified model, so that the later `dbt build --select state:modified+` runs them in incremental mode. Incremental models that are new in the pull request do not exist in production and must not be cloned. Complete the selector.",
    "codeSnippet": "dbt clone --select \"state:modified+,config.materialized:incremental,[[1]]\" --state prod-artifacts",
    "codeLanguage": "bash",
    "blanks": [
      {
        "accepted": [
          "state:old"
        ]
      }
    ],
    "explanation": "CORRECT ACTION:\nThe comma intersects the three criteria. `state:old` keeps only nodes whose `unique_id` exists in the comparison manifest, so the job clones the pre-existing incremental models that are modified or downstream of a modified model. Once cloned, they already exist in the pull request schema, so `is_incremental()` is true when `dbt build` runs them.\n\nCOMMON MISTAKES:\n- `state:new`: it selects the nodes that have no match in the comparison manifest, the opposite of what the step needs.\n- `state:unmodified`: intersected with `state:modified+`, it drops the modified models themselves.\n- `result:success`: it filters on statuses in a previous `run_results.json`, not on whether the model exists in production.",
    "references": "https://docs.getdbt.com/best-practices/clone-incremental-models",
    "dbtVersionFocus": "dbt clone in CI for incremental models"
  },
  {
    "id": 3014,
    "format": "matching",
    "category": "Leveraging the dbt state",
    "difficulty": "Intermediate",
    "questionText": "A CI job compares the project with the production manifest in `prod-artifacts` and uses sub-selectors of `state:modified` to narrow what it builds. Match each selector to the changes it detects.",
    "prompts": [
      "`state:modified.body`",
      "`state:modified.configs`",
      "`state:modified.relation`",
      "`state:modified.macros`",
      "`state:modified.contract`"
    ],
    "choices": [
      "Changes to the `database`, `schema` or `alias` of a node, irrespective of `target` values",
      "Changes to upstream macros, whether called directly or by another macro",
      "Changes to the node body, such as model SQL or seed values",
      "New rows loaded into a source table that the node selects from",
      "Changes to the `name` and `data_type` of the columns in a model's contract",
      "Changes to node configs, excluding `database`, `schema`, `alias`, `tags` and `meta`"
    ],
    "matches": [
      2,
      5,
      0,
      1,
      4
    ],
    "explanation": "CORRECT ACTION:\n`state:modified.body` detects changes to the node body, such as model SQL or seed values. `state:modified.configs` detects config changes other than `database`, `schema`, `alias`, `tags` and `meta`. `state:modified.relation` detects changes to `database`, `schema` or `alias`, irrespective of `target` values or `generate_x_name` macros. `state:modified.macros` detects changes to upstream macros, called directly or through another macro. `state:modified.contract` detects changes to a model's contract, which include the `name` and `data_type` of its columns.\n\nCOMMON MISTAKES:\n- `state:modified.configs` with `database`, `schema` or `alias` changes: those are excluded from `configs` and detected by `state:modified.relation`.\n- `state:modified.body` with macro changes: a macro lives in its own file, so editing it leaves the calling model's SQL unchanged; `state:modified.macros` catches it.\n- Any selector with new rows in a source table: `state:modified` and its sub-selectors detect changes to project code and configuration, not to the data.",
    "references": "https://docs.getdbt.com/reference/node-selection/methods",
    "dbtVersionFocus": "state:modified sub-selectors"
  },
  {
    "id": 5015,
    "format": "hotspot",
    "category": "Troubleshooting and optimizing dbt pipelines",
    "difficulty": "Advanced",
    "questionText": "During `dbt build`, the `relationships` test on `int_orders.customer_id`, which checks that every value exists in `stg_customers.id`, fails with severity `error`. Every other node succeeds. Select every model that dbt skips.",
    "target": {
      "kind": "dag",
      "nodes": [
        {
          "id": "raw_customers",
          "label": "seed: raw_customers",
          "column": 0,
          "row": 0
        },
        {
          "id": "stg_customers",
          "label": "stg_customers",
          "column": 1,
          "row": 0
        },
        {
          "id": "stg_orders",
          "label": "stg_orders",
          "column": 1,
          "row": 2
        },
        {
          "id": "dim_customers",
          "label": "dim_customers",
          "column": 2,
          "row": 0
        },
        {
          "id": "int_orders",
          "label": "int_orders",
          "column": 2,
          "row": 2
        },
        {
          "id": "customer_segments",
          "label": "customer_segments",
          "column": 3,
          "row": 0
        },
        {
          "id": "fct_orders",
          "label": "fct_orders",
          "column": 3,
          "row": 2
        },
        {
          "id": "rpt_segments",
          "label": "rpt_segments",
          "column": 4,
          "row": 0
        },
        {
          "id": "rpt_customer_orders",
          "label": "rpt_customer_orders",
          "column": 4,
          "row": 1
        }
      ],
      "edges": [
        [
          "raw_customers",
          "stg_customers"
        ],
        [
          "stg_customers",
          "dim_customers"
        ],
        [
          "stg_customers",
          "int_orders"
        ],
        [
          "stg_orders",
          "int_orders"
        ],
        [
          "dim_customers",
          "customer_segments"
        ],
        [
          "customer_segments",
          "rpt_segments"
        ],
        [
          "int_orders",
          "fct_orders"
        ],
        [
          "dim_customers",
          "rpt_customer_orders"
        ],
        [
          "fct_orders",
          "rpt_customer_orders"
        ]
      ],
      "correctNodes": [
        "fct_orders",
        "rpt_customer_orders"
      ]
    },
    "explanation": "CORRECT ACTION:\nThe `relationships` test has two parents, `int_orders` and `stg_customers`, and `int_orders` depends on `stg_customers`. A test with multiple parents where one depends on the other blocks and skips the children of the most-downstream parent only, here `int_orders`. So `fct_orders` is skipped, and `rpt_customer_orders` is skipped because its parent `fct_orders` was skipped.\n\nCOMMON MISTAKES:\n- Selecting `dim_customers`, `customer_segments` or `rpt_segments`: they descend only from `stg_customers`, the upstream parent of the test, which the failure does not block.\n- Selecting `int_orders`: the test queries it, so it is built before the test runs.\n- Leaving out `rpt_customer_orders`: one of its parents is skipped, so it cannot run either.",
    "references": "https://docs.getdbt.com/reference/commands/build",
    "dbtVersionFocus": "dbt build skipping with multi-parent tests"
  },
  {
    "id": 5016,
    "format": "hotspot",
    "category": "Leveraging the dbt state",
    "difficulty": "Intermediate",
    "questionText": "A `dbt build` ends with the results below. You fix the SQL error in `int_orders` and, with no other dbt command in between, run `dbt retry`. Click every line for a node that `dbt retry` runs.",
    "codeSnippet": "1 of 7 OK created sql view model main.stg_orders ............ [OK in 0.04s]\n2 of 7 OK loaded seed file main.raw_customers ............... [INSERT 2 in 0.03s]\n3 of 7 ERROR creating sql table model main.int_orders ....... [ERROR in 0.03s]\n4 of 7 OK created sql view model main.stg_customers ......... [OK in 0.01s]\n5 of 7 SKIP relation main.fct_orders ........................ [SKIP]\n6 of 7 PASS not_null_stg_customers_id ....................... [PASS in 0.02s]\n7 of 7 OK created sql table model main.dim_customers ........ [OK in 0.01s]",
    "codeLanguage": "text",
    "target": {
      "kind": "code_lines",
      "correctLines": [
        3,
        5
      ]
    },
    "explanation": "CORRECT ACTION:\n`dbt retry` re-executes the last invocation from the point of failure, reading `run_results.json` to decide where to start. It runs the errored `int_orders` and the skipped `fct_orders`, and does not rerun the nodes that already succeeded.\n\nCOMMON MISTAKES:\n- Selecting the successful models and the passing test: retry picks up from the error rather than running the upstream nodes again.\n- Selecting only the `ERROR` line: the node skipped because of that error is part of the work left to do, so retry runs it too.\n- Selecting every line: that would be a new `dbt build`, not a retry.",
    "references": "https://docs.getdbt.com/reference/commands/retry",
    "dbtVersionFocus": "dbt retry"
  },
  {
    "id": 3015,
    "format": "matching",
    "category": "Implementing and maintaining external dependencies",
    "difficulty": "Basic",
    "questionText": "You are declaring an exposure for a dashboard that reads two of your models. Match each exposure property to what it holds.",
    "prompts": [
      "`type`",
      "`maturity`",
      "`owner`",
      "`depends_on`",
      "`url`"
    ],
    "choices": [
      "The link behind **View this exposure** in the generated documentation site",
      "The `ref`, `source` or `metric` nodes that the exposure reads from",
      "The schedule on which dbt refreshes the downstream dashboard",
      "One of `high`, `medium` or `low`, for the level of confidence or stability in the exposure",
      "The person or team responsible, given with a `name` or an `email`",
      "One of `dashboard`, `notebook`, `analysis`, `ml` or `application`, used to organize the docs site"
    ],
    "matches": [
      5,
      3,
      4,
      1,
      0
    ],
    "explanation": "CORRECT ACTION:\n`type` is one of `dashboard`, `notebook`, `analysis`, `ml` or `application` and is used to organize exposures in the docs site. `maturity` is `high`, `medium` or `low`. `owner` requires a `name` or an `email`. `depends_on` lists the refable nodes the exposure reads, which lets you run, test and list the resources that feed it. `url` populates the **View this exposure** link in the generated documentation site.\n\nCOMMON MISTAKES:\n- The refresh schedule: no exposure property schedules anything; dbt does not refresh the downstream dashboard.\n- `type` with the confidence level: the confidence or stability level is `maturity`, while `type` names the kind of downstream use.\n- `url` with the nodes it reads: `url` is only a link; the upstream nodes are listed under `depends_on`.",
    "references": "https://docs.getdbt.com/docs/build/exposures",
    "dbtVersionFocus": "Exposures (properties)"
  },
  {
    "id": 5017,
    "format": "hotspot",
    "category": "Implementing and maintaining external dependencies",
    "difficulty": "Intermediate",
    "questionText": "`dbt parse` fails on the exposure file below with `Parsing Error: Invalid exposures config given in ... is not valid under any of the given schemas`. The model `stg_customers` exists. Click the line that causes the error.",
    "codeSnippet": "exposures:\n  - name: customer_overview\n    label: Customer Overview\n    type: dashboard\n    maturity: production\n    url: https://bi.example.com/dashboards/12\n    owner:\n      name: Customer Analytics\n      email: analytics@example.com\n    depends_on:\n      - ref('stg_customers')",
    "codeLanguage": "yaml",
    "target": {
      "kind": "code_lines",
      "correctLines": [
        5
      ]
    },
    "explanation": "CORRECT ACTION:\n`maturity` accepts only `high`, `medium` or `low`. The value `production` fails the exposure schema, so dbt raises a parsing error for the file.\n\nCOMMON MISTAKES:\n- `label: Customer Overview`: `label` may contain spaces and capital letters; only `name` is limited to letters, numbers and underscores.\n- `type: dashboard`: `dashboard` is one of the valid types, with `notebook`, `analysis`, `ml` and `application`.\n- The `owner` block: an owner needs a `name` or an `email`, and giving both is valid.",
    "references": "https://docs.getdbt.com/reference/exposure-properties",
    "dbtVersionFocus": "Exposures (properties)"
  },
  {
    "id": 2017,
    "format": "fill_blank",
    "category": "Developing and optimizing dbt models",
    "difficulty": "Basic",
    "questionText": "The Python model `customer_scores.py` must read the SQL model `stg_customers`, so that dbt builds `stg_customers` first, and return the filtered rows as the model's result. Complete the model.",
    "codeSnippet": "def [[1]](dbt, session):\n    customers = dbt.[[2]](\"stg_customers\")\n    active = customers.filter(\"id > 1\")\n    return active",
    "codeLanguage": "python",
    "blanks": [
      {
        "accepted": [
          "model"
        ]
      },
      {
        "accepted": [
          "ref"
        ]
      }
    ],
    "explanation": "CORRECT ACTION:\nA Python model defines a function named `model` that takes the `dbt` and `session` arguments and returns a single DataFrame. `dbt.ref(\"stg_customers\")` reads another model as a DataFrame and adds it to the DAG as an upstream dependency.\n\nCOMMON MISTAKES:\n- `main` or the file name as the function name: dbt calls the function named `model`, whatever the file is called.\n- `source`: `dbt.source()` reads a raw source table declared in YAML and takes a source name and a table name, not a model name.\n- `{{ ref('stg_customers') }}`: Python models do not use Jinja; references go through the `dbt` argument.",
    "references": "https://docs.getdbt.com/docs/build/python-models",
    "dbtVersionFocus": "Python models"
  },
  {
    "id": 5018,
    "format": "hotspot",
    "category": "Developing and optimizing dbt models",
    "difficulty": "Advanced",
    "questionText": "`dbt parse` fails on the Python model below with `Parsing Error: Error when trying to literal_eval an arg to dbt.ref(), dbt.source(), dbt.config() or dbt.config.get()`. Click the line that causes the error.",
    "codeSnippet": "UPSTREAM = \"stg_customers\"\n\n\ndef model(dbt, session):\n    dbt.config(materialized=\"table\", tags=[\"scoring\"])\n    min_id = dbt.config.get(\"min_id\", 1)\n    customers = dbt.ref(UPSTREAM)\n    active = customers.filter(f\"id > {min_id}\")\n    return active",
    "codeLanguage": "python",
    "target": {
      "kind": "code_lines",
      "correctLines": [
        7
      ]
    },
    "explanation": "CORRECT ACTION:\ndbt reads the arguments of `dbt.ref()`, `dbt.source()`, `dbt.config()` and `dbt.config.get()` by static analysis while parsing, without running the Python code, so each argument must be a Python literal. `dbt.ref(UPSTREAM)` passes a variable name, which dbt cannot evaluate at parse time. Writing `dbt.ref(\"stg_customers\")` fixes it.\n\nCOMMON MISTAKES:\n- `dbt.config(materialized=\"table\", tags=[\"scoring\"])`: a string and a list of strings are literals, so this call parses.\n- `dbt.config.get(\"min_id\", 1)`: both arguments are literals.\n- The f-string in `customers.filter(...)`: dbt does not analyze DataFrame calls at parse time; only the arguments of the `dbt` methods must be literals.",
    "references": "https://docs.getdbt.com/docs/build/python-models",
    "dbtVersionFocus": "Python models (configuration)"
  },
  {
    "id": 2018,
    "format": "fill_blank",
    "category": "Developing and optimizing dbt models",
    "difficulty": "Basic",
    "questionText": "In dbt Core 1.11, a snapshot is defined in a YAML file in the `snapshots/` directory, with no SQL file. It must record changes to the table `customers` of the source `crm`. Which key completes the snapshot definition?",
    "codeSnippet": "snapshots:\n  - name: customers_snapshot\n    [[1]]: source('crm', 'customers')\n    config:\n      unique_key: id\n      strategy: timestamp\n      updated_at: updated_at",
    "codeLanguage": "yaml",
    "blanks": [
      {
        "accepted": [
          "relation"
        ]
      }
    ],
    "explanation": "CORRECT ACTION:\nA snapshot defined in YAML (dbt 1.9 and later) names the table it tracks with the `relation` key, which takes `source('my_source', 'my_table')` or `ref('my_model')`. The `config` block then sets `unique_key`, `strategy` and the strategy's own settings.\n\nCOMMON MISTAKES:\n- `source`: `source(...)` is the value of the key, not the key itself.\n- `sql` or `select`: a YAML snapshot does not take a query; to transform the data first, point `relation` at an ephemeral model with `ref`.\n- `schema`: it is a config that sets where the snapshot is built, not which table it reads.",
    "references": "https://docs.getdbt.com/docs/build/snapshots",
    "dbtVersionFocus": "Snapshots in YAML (v1.9+)"
  }
];
