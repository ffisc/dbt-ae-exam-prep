// Generated: documentation quotes and dbt runs that back each answer key. Questions without an entry are not served.
export interface Evidence {
  quotes: { page: string; url: string; text: string }[];
  run?: { dbtVersion: string; commands: string[]; observed: string };
}

export const evidence: Record<number, Evidence> = {
  "2": {
    "quotes": [
      {
        "page": "Model contracts",
        "url": "https://docs.getdbt.com/docs/mesh/govern/model-contracts",
        "text": "To enforce a model's contract, set `enforced: true` under the `contract` configuration."
      },
      {
        "page": "Model contracts",
        "url": "https://docs.getdbt.com/docs/mesh/govern/model-contracts",
        "text": "When enforced, your contract *must* include every column's `name` and `data_type` (where `data_type` matches one that your data platform understands)."
      }
    ]
  },
  "3": {
    "quotes": [
      {
        "page": "Model versions",
        "url": "https://docs.getdbt.com/docs/mesh/govern/model-versions",
        "text": "Instead, we're going to declare that these are versions of the same model, both named `dim_customers`."
      },
      {
        "page": "Model versions",
        "url": "https://docs.getdbt.com/docs/mesh/govern/model-versions",
        "text": "dbt expects each model version to be defined in a file named `<model_name>_v<v>`."
      },
      {
        "page": "Model versions",
        "url": "https://docs.getdbt.com/docs/mesh/govern/model-versions",
        "text": "All versions of a model preserve the model's original name. They are `ref`'d by that name, rather than the name of the file that they're defined in."
      },
      {
        "page": "Model versions",
        "url": "https://docs.getdbt.com/docs/mesh/govern/model-versions",
        "text": "**Which version is \"latest\"?** If not specified explicitly, the `latest_version` would be `2`, because it's numerically greatest."
      }
    ]
  },
  "4": {
    "quotes": [
      {
        "page": "Unit tests",
        "url": "https://docs.getdbt.com/docs/build/unit-tests",
        "text": "unit_tests:\n  - name: test_is_valid_email_address__sql\n    model: dim_customers\n    given:"
      },
      {
        "page": "Unit tests",
        "url": "https://docs.getdbt.com/docs/build/unit-tests",
        "text": "Unit tests must be defined in a YML file in your [`models/` directory](https://docs.getdbt.com/reference/project-configs/model-paths.md)."
      },
      {
        "page": "Unit tests",
        "url": "https://docs.getdbt.com/docs/build/unit-tests",
        "text": "Don't define unit test YAML in the `tests/` directory, which is reserved for [data tests](https://docs.getdbt.com/docs/build/data-tests.md)."
      },
      {
        "page": "Unit tests",
        "url": "https://docs.getdbt.com/docs/build/unit-tests",
        "text": "Include all [`ref`](https://docs.getdbt.com/reference/dbt-jinja-functions/ref.md) or [`source`](https://docs.getdbt.com/reference/dbt-jinja-functions/source.md) model references in the unit test configuration as `input`s to avoid \"node not found\" errors during compilation."
      }
    ]
  },
  "6": {
    "quotes": [
      {
        "page": "Clone incremental models as the first step of your CI job",
        "url": "https://docs.getdbt.com/best-practices/clone-incremental-models",
        "text": "* Run the command `dbt build --select state:modified+` to run and test all of the models you've modified and their downstream dependencies."
      },
      {
        "page": "Best practices for workflows",
        "url": "https://docs.getdbt.com/best-practices/best-practice-workflows",
        "text": "By comparing to artifacts from a previous production run, dbt can determine which models are modified and build them on top of their unmodified parents."
      },
      {
        "page": "Node selector methods",
        "url": "https://docs.getdbt.com/reference/node-selection/methods",
        "text": "`state:new`: There is no node with the same `unique_id` in the comparison manifest"
      },
      {
        "page": "Node selector methods",
        "url": "https://docs.getdbt.com/reference/node-selection/methods",
        "text": "`state:modified`: All new nodes, plus any changes to existing nodes."
      },
      {
        "page": "Defer",
        "url": "https://docs.getdbt.com/reference/node-selection/defer",
        "text": "Deferral requires both `--defer` and `--state` to be set, either by passing flags explicitly or by setting environment variables ((Applies to dbt v1.11 and later) `DBT_ENGINE_DEFER` and `DBT_ENGINE_STATE`)."
      }
    ]
  },
  "7": {
    "quotes": [
      {
        "page": "About microbatch incremental models",
        "url": "https://docs.getdbt.com/docs/build/incremental-microbatch",
        "text": "dbt will automatically filter upstream inputs (`source` or `ref`) that define `event_time`, based on the `lookback` and `batch_size` configs for this model."
      },
      {
        "page": "About microbatch incremental models",
        "url": "https://docs.getdbt.com/docs/build/incremental-microbatch",
        "text": "You don’t need to think about `is_incremental` filtering"
      },
      {
        "page": "About microbatch incremental models",
        "url": "https://docs.getdbt.com/docs/build/incremental-microbatch",
        "text": "During standard incremental runs, dbt will process batches according to the current timestamp and the configured `lookback`, with one query per batch."
      },
      {
        "page": "About microbatch incremental models",
        "url": "https://docs.getdbt.com/docs/build/incremental-microbatch",
        "text": "Most incremental models rely on the end user (you) to explicitly tell dbt what \"new\" means, in the context of each model, by writing a filter in an `{% if is_incremental() %}` conditional block."
      }
    ]
  },
  "9": {
    "quotes": [
      {
        "page": "Custom aliases",
        "url": "https://docs.getdbt.com/docs/build/custom-aliases",
        "text": "dbt cannot create two resources with identical database representations. To fix this,"
      },
      {
        "page": "Custom aliases",
        "url": "https://docs.getdbt.com/docs/build/custom-aliases",
        "text": "change the \"schema\" or \"alias\" configuration of one of these resources:"
      },
      {
        "page": "Custom aliases",
        "url": "https://docs.getdbt.com/docs/build/custom-aliases",
        "text": "Using aliases, it's possible to accidentally create models with ambiguous identifiers."
      }
    ]
  },
  "10": {
    "quotes": [
      {
        "page": "Custom schemas",
        "url": "https://docs.getdbt.com/docs/build/custom-schemas",
        "text": "If your dbt project has a custom macro called `generate_schema_name`, dbt will use it instead of the default macro."
      },
      {
        "page": "Custom schemas",
        "url": "https://docs.getdbt.com/docs/build/custom-schemas",
        "text": "dbt generates the schema name for a model by appending the custom schema to the target schema."
      },
      {
        "page": "Custom schemas",
        "url": "https://docs.getdbt.com/docs/build/custom-schemas",
        "text": "A common customization is to use the custom schema in production when provided, with the target schema serving only as a fallback if no custom schema is specified."
      },
      {
        "page": "Custom schemas",
        "url": "https://docs.getdbt.com/docs/build/custom-schemas",
        "text": "In other environments, such as development and CI, custom schema configurations are ignored, defaulting to the target schema instead."
      },
      {
        "page": "Custom databases",
        "url": "https://docs.getdbt.com/docs/build/custom-databases",
        "text": "The database name generated for a model is controlled by a macro called `generate_database_name`."
      }
    ]
  },
  "11": {
    "quotes": [
      {
        "page": "Unit tests",
        "url": "https://docs.getdbt.com/docs/build/unit-tests",
        "text": "To run only unit tests on demand, use the `test_type` selector — this works across all engines (dbt v1 and dbt v2):"
      },
      {
        "page": "Node selector methods",
        "url": "https://docs.getdbt.com/reference/node-selection/methods",
        "text": "The `test_type` method is used to select tests based on their type:"
      },
      {
        "page": "Node selector methods",
        "url": "https://docs.getdbt.com/reference/node-selection/methods",
        "text": "The `test_name` method is used to select tests based on the name of the generic test that defines it."
      },
      {
        "page": "Node selector methods",
        "url": "https://docs.getdbt.com/reference/node-selection/methods",
        "text": "The `tag:` method is used to select models that match a specified [tag](https://docs.getdbt.com/reference/resource-configs/tags.md)."
      }
    ]
  },
  "12": {
    "quotes": [
      {
        "page": "About microbatch incremental models",
        "url": "https://docs.getdbt.com/docs/build/incremental-microbatch",
        "text": "Backfilling a microbatch model is as simple as selecting it to run or build, and specifying a \"start\" and \"end\" for `event_time`."
      },
      {
        "page": "About microbatch incremental models",
        "url": "https://docs.getdbt.com/docs/build/incremental-microbatch",
        "text": "Note that `--event-time-start` and `--event-time-end` are mutually necessary, meaning that if you specify one, you must specify the other."
      },
      {
        "page": "About microbatch incremental models",
        "url": "https://docs.getdbt.com/docs/build/incremental-microbatch",
        "text": "If you need to reprocess historical data, we recommend using a targeted backfill with `--event-time-start` and `--event-time-end`."
      }
    ]
  },
  "13": {
    "quotes": [
      {
        "page": "Add sources to your DAG",
        "url": "https://docs.getdbt.com/docs/build/sources",
        "text": "To configure source freshness information, add a `freshness` block to your source and `loaded_at_field` to your table declaration:"
      },
      {
        "page": "Add sources to your DAG",
        "url": "https://docs.getdbt.com/docs/build/sources",
        "text": "Additionally, the `loaded_at_field` is required to calculate freshness for a table (except for cases where dbt can leverage warehouse metadata to calculate freshness)."
      },
      {
        "page": "Source freshness",
        "url": "https://docs.getdbt.com/docs/deploy/source-freshness",
        "text": "[`dbt build`](https://docs.getdbt.com/reference/commands/build.md) does *not* include source freshness checks when building and testing resources in your DAG."
      },
      {
        "page": "About dbt source command",
        "url": "https://docs.getdbt.com/reference/commands/source",
        "text": "The `dbt source` command provides one legacy subcommand, `dbt source freshness`, which evaluates sources only."
      },
      {
        "page": "About dbt test command",
        "url": "https://docs.getdbt.com/reference/commands/test",
        "text": "`dbt test` runs data tests defined on models, sources, snapshots, and seeds and unit tests defined on SQL models."
      }
    ]
  },
  "14": {
    "quotes": [
      {
        "page": "Coordinating model versions",
        "url": "https://docs.getdbt.com/best-practices/how-we-mesh/mesh-6-coordinate-versions",
        "text": "In the model's `properties.yml` file, set a [`deprecation_date`](https://docs.getdbt.com/reference/resource-properties/deprecation_date.md) for the model's old version."
      },
      {
        "page": "deprecation_date",
        "url": "https://docs.getdbt.com/reference/resource-properties/deprecation_date",
        "text": "When a project references a model that's slated for deprecation or the deprecation date has passed, a warning is generated."
      },
      {
        "page": "Model versions",
        "url": "https://docs.getdbt.com/docs/mesh/govern/model-versions",
        "text": "dbt will notify consumers of your versioned model when new versions become available, or when they are slated for deprecation"
      }
    ]
  },
  "16": {
    "quotes": [
      {
        "page": "Project variables",
        "url": "https://docs.getdbt.com/docs/build/project-variables",
        "text": "Variables defined using `--var`, override values defined in `dbt_project.yml`."
      },
      {
        "page": "Project variables",
        "url": "https://docs.getdbt.com/docs/build/project-variables",
        "text": "You can override them at runtime using the `--vars` command-line argument, which is useful when you want to change a value for a specific run."
      },
      {
        "page": "About var function",
        "url": "https://docs.getdbt.com/reference/dbt-jinja-functions/var",
        "text": "The `var()` function returns the value defined in your project or passed using `--vars`, based on precedence."
      }
    ]
  },
  "18": {
    "quotes": [
      {
        "page": "Add data tests to your DAG",
        "url": "https://docs.getdbt.com/docs/build/data-tests",
        "text": "A **singular** data test, in its simplest form, is when you write a SQL query that returns failing rows, you can save that query in a `.sql` file within your [test directory](https://docs.getdbt.com/reference/project-configs/test-paths.md)."
      },
      {
        "page": "Add data tests to your DAG",
        "url": "https://docs.getdbt.com/docs/build/data-tests",
        "text": "A **generic** data test is a parameterized query that accepts arguments."
      },
      {
        "page": "Add data tests to your DAG",
        "url": "https://docs.getdbt.com/docs/build/data-tests",
        "text": "Singular data tests placed in the tests directory are automatically executed when running `dbt test`."
      }
    ]
  },
  "19": {
    "quotes": [
      {
        "page": "Materializations",
        "url": "https://docs.getdbt.com/docs/build/materializations",
        "text": "`ephemeral` models are not directly built into the database. Instead, dbt will interpolate the code from an ephemeral model into its dependent models using a common table expression (CTE)."
      }
    ]
  },
  "20": {
    "quotes": [
      {
        "page": "About dbt clean command",
        "url": "https://docs.getdbt.com/reference/commands/clean",
        "text": "`dbt clean` is a utility function that deletes the paths specified within the [`clean-targets`](https://docs.getdbt.com/reference/project-configs/clean-targets.md) list in the `dbt_project.yml` file."
      },
      {
        "page": "Packages",
        "url": "https://docs.getdbt.com/docs/build/packages",
        "text": "run `dbt clean` to delete *all* packages (and any compiled models), followed by `dbt deps`."
      },
      {
        "page": "About dbt deps command",
        "url": "https://docs.getdbt.com/reference/commands/deps",
        "text": "`dbt deps` pulls the most recent version of the dependencies listed in your `packages.yml` from git."
      },
      {
        "page": "clean-targets",
        "url": "https://docs.getdbt.com/reference/project-configs/clean-targets",
        "text": "To remove packages as well as compiled files, include the value of your [packages-install-path](https://docs.getdbt.com/reference/project-configs/packages-install-path.md) configuration in your `clean-targets` configuration."
      }
    ]
  },
  "21": {
    "quotes": [
      {
        "page": "Model contracts",
        "url": "https://docs.getdbt.com/docs/mesh/govern/model-contracts",
        "text": "dbt will run a \"preflight\" check to ensure that the model's query will return a set of columns with names and data types matching the ones you have defined."
      },
      {
        "page": "Model contracts",
        "url": "https://docs.getdbt.com/docs/mesh/govern/model-contracts",
        "text": "If they do not match, the contract fails and the model does not build."
      },
      {
        "page": "contract",
        "url": "https://docs.getdbt.com/reference/resource-configs/contract",
        "text": "When a model has an enforced contract, dbt ensures the model’s returned dataset exactly matches the YAML-defined `name` and `data_type` for every column; if they don’t match, dbt errors."
      },
      {
        "page": "dbt Mesh FAQs",
        "url": "https://docs.getdbt.com/best-practices/how-we-mesh/mesh-5-faqs",
        "text": "Should a model fail to adhere to its established contracts, it will not build successfully."
      }
    ]
  },
  "24": {
    "quotes": [
      {
        "page": "Defer",
        "url": "https://docs.getdbt.com/reference/node-selection/defer",
        "text": "Defer is a powerful feature that makes it possible to run a subset of (Applies to dbt v1.11 and later) models, tests, or functions in a [sandbox environment](https://docs.getdbt.com/docs/environments-in-dbt.md) without having to first build their upstream parents."
      },
      {
        "page": "Defer",
        "url": "https://docs.getdbt.com/reference/node-selection/defer",
        "text": "When `--defer` is enabled, dbt resolves `ref`(Applies to dbt v1.11 and later) and `function` calls using the state manifest instead, but only if:"
      },
      {
        "page": "Defer",
        "url": "https://docs.getdbt.com/reference/node-selection/defer",
        "text": "1. The node isn’t among the selected nodes, *and*"
      },
      {
        "page": "Defer",
        "url": "https://docs.getdbt.com/reference/node-selection/defer",
        "text": "2. It doesn’t exist in the database (or `--favor-state` is used)."
      },
      {
        "page": "Defer",
        "url": "https://docs.getdbt.com/reference/node-selection/defer",
        "text": "Ephemeral models are never deferred, since they serve as \"passthroughs\" for other `ref` calls."
      },
      {
        "page": "Defer",
        "url": "https://docs.getdbt.com/reference/node-selection/defer",
        "text": "In most cases, you will want to use the same state for both; compare logical changes against production, and also \"fail over\" to the production environment for unbuilt upstream resources."
      }
    ]
  },
  "25": {
    "quotes": [
      {
        "page": "Unit tests",
        "url": "https://docs.getdbt.com/docs/build/unit-tests",
        "text": "# contents of current my_incremental_model"
      },
      {
        "page": "Unit tests",
        "url": "https://docs.getdbt.com/docs/build/unit-tests",
        "text": "# unit test this model in \"incremental\" mode"
      },
      {
        "page": "Unit tests",
        "url": "https://docs.getdbt.com/docs/build/unit-tests",
        "text": "# what will be inserted/merged into my_incremental_model"
      },
      {
        "page": "about this",
        "url": "https://docs.getdbt.com/reference/dbt-jinja-functions/this",
        "text": "`this` can be thought of as equivalent to `ref('<the_current_model>')`, and is a neat way to avoid circular dependencies."
      }
    ]
  },
  "26": {
    "quotes": [
      {
        "page": "Add snapshots to your DAG",
        "url": "https://docs.getdbt.com/docs/build/snapshots",
        "text": "The `timestamp` strategy uses an `updated_at` field to determine if a row has changed."
      },
      {
        "page": "Add snapshots to your DAG",
        "url": "https://docs.getdbt.com/docs/build/snapshots",
        "text": "| Only if using the `timestamp` strategy"
      },
      {
        "page": "Add snapshots to your DAG",
        "url": "https://docs.getdbt.com/docs/build/snapshots",
        "text": "A primary key column(s) (string or array) or expression for the record"
      },
      {
        "page": "Add snapshots to your DAG",
        "url": "https://docs.getdbt.com/docs/build/snapshots",
        "text": "| `dbt_scd_id`     | A unique key generated for each snapshot row."
      },
      {
        "page": "Add snapshots to your DAG",
        "url": "https://docs.getdbt.com/docs/build/snapshots",
        "text": "| `dbt_updated_at` | The source record's change timestamp when this snapshot row was inserted."
      }
    ]
  },
  "27": {
    "quotes": [
      {
        "page": "Add Seeds to your DAG",
        "url": "https://docs.getdbt.com/docs/build/seeds",
        "text": "Because these CSV files are located in your dbt repository, they are version controlled and code reviewable. Seeds are best suited to static data which changes infrequently."
      },
      {
        "page": "Can I use seeds to load raw data?",
        "url": "https://docs.getdbt.com/faqs/Seeds/load-raw-data-with-seed",
        "text": "Seeds should **not** be used to load raw data (for example, large CSV exports from a production database)."
      },
      {
        "page": "Can I use seeds to load raw data?",
        "url": "https://docs.getdbt.com/faqs/Seeds/load-raw-data-with-seed",
        "text": "Loading CSVs using dbt's seed functionality is not performant for large files."
      }
    ]
  },
  "28": {
    "quotes": [
      {
        "page": "Custom databases",
        "url": "https://docs.getdbt.com/docs/build/custom-databases",
        "text": "The database name generated for a model is controlled by a macro called `generate_database_name`."
      },
      {
        "page": "Custom databases",
        "url": "https://docs.getdbt.com/docs/build/custom-databases",
        "text": "To override dbt's database name generation, create a macro named `generate_database_name` in your own dbt project."
      },
      {
        "page": "Custom databases",
        "url": "https://docs.getdbt.com/docs/build/custom-databases",
        "text": "The default implementation of `generate_database_name` simply uses the supplied `database` config if one is present, otherwise the database configured in the active `target` is used."
      },
      {
        "page": "Custom databases",
        "url": "https://docs.getdbt.com/docs/build/custom-databases",
        "text": "If the `database` configuration *is* supplied for a model, then dbt will build the model into the configured database."
      },
      {
        "page": "Custom schemas",
        "url": "https://docs.getdbt.com/docs/build/custom-schemas",
        "text": "dbt uses a default macro called `generate_schema_name` to determine the name of the schema that a model should be built in."
      },
      {
        "page": "Custom aliases",
        "url": "https://docs.getdbt.com/docs/build/custom-aliases",
        "text": "The alias generated for a model is controlled by a macro called `generate_alias_name`."
      }
    ]
  },
  "29": {
    "quotes": [
      {
        "page": "Add sources to your DAG",
        "url": "https://docs.getdbt.com/docs/build/sources",
        "text": "Additionally, the `loaded_at_field` is required to calculate freshness for a table (except for cases where dbt can leverage warehouse metadata to calculate freshness)."
      },
      {
        "page": "Add sources to your DAG",
        "url": "https://docs.getdbt.com/docs/build/sources",
        "text": "Behind the scenes, dbt uses the freshness properties to construct a `select` query, shown below."
      },
      {
        "page": "dbt freshness",
        "url": "https://docs.getdbt.com/reference/commands/freshness",
        "text": "Queries `MAX(<loaded_at_field>)` against the materialized relation."
      }
    ],
    "run": {
      "dbtVersion": "1.11",
      "commands": [
        "cd dbt-sandbox/exp-13",
        "# table main.ev: stale_col = now()-5 days, fresh_col = now()-10 minutes; two source entries on it, loaded_at_field stale_col and fresh_col, error_after 24 hours",
        "../.venv/bin/dbt source freshness --profiles-dir ."
      ],
      "observed": "'1 of 2 ERROR STALE freshness of raw.ev' (loaded_at_field: stale_col) and '2 of 2 PASS freshness of raw.ev_fresh' (loaded_at_field: fresh_col) on the same physical table."
    }
  },
  "30": {
    "quotes": [
      {
        "page": "Writing custom generic data tests",
        "url": "https://docs.getdbt.com/best-practices/writing-custom-generic-tests",
        "text": "Generic tests are defined in SQL files. Those files can live in two places:"
      },
      {
        "page": "Writing custom generic data tests",
        "url": "https://docs.getdbt.com/best-practices/writing-custom-generic-tests",
        "text": "To define your own generic tests, simply create a `test` block called `<test_name>`."
      },
      {
        "page": "Writing custom generic data tests",
        "url": "https://docs.getdbt.com/best-practices/writing-custom-generic-tests",
        "text": "-- if this is true, then even_field is actually odd!"
      },
      {
        "page": "Writing custom generic data tests",
        "url": "https://docs.getdbt.com/best-practices/writing-custom-generic-tests",
        "text": "If this `select` statement returns zero records, then every record in the supplied `model` argument is even!"
      },
      {
        "page": "Add data tests to your DAG",
        "url": "https://docs.getdbt.com/docs/build/data-tests",
        "text": "Don't reference singular tests in `model_name.yml`, as they are not treated as generic tests or macros, and doing so will result in an error."
      }
    ]
  },
  "31": {
    "quotes": [
      {
        "page": "About dbt run command",
        "url": "https://docs.getdbt.com/reference/commands/run",
        "text": "The `dbt run` command only applies to models. It doesn't run tests, snapshots, seeds, or other resource types."
      },
      {
        "page": "About dbt build command",
        "url": "https://docs.getdbt.com/reference/commands/build",
        "text": "* test [tests](https://docs.getdbt.com/docs/build/data-tests.md)"
      },
      {
        "page": "About dbt test command",
        "url": "https://docs.getdbt.com/reference/commands/test",
        "text": "It expects that you have already created those resources through the appropriate commands."
      },
      {
        "page": "About dbt compile command",
        "url": "https://docs.getdbt.com/reference/commands/compile",
        "text": "`dbt compile` generates executable SQL from source files for:"
      }
    ]
  },
  "32": {
    "quotes": [
      {
        "page": "About documentation",
        "url": "https://docs.getdbt.com/docs/build/documentation",
        "text": "Place docs blocks in `.md` files."
      },
      {
        "page": "About documentation",
        "url": "https://docs.getdbt.com/docs/build/documentation",
        "text": "To use a docs block, reference it from your `schema.yml` file with the [doc()](https://docs.getdbt.com/reference/dbt-jinja-functions/doc.md) function in place of a markdown string."
      },
      {
        "page": "persist_docs",
        "url": "https://docs.getdbt.com/reference/resource-configs/persist_docs",
        "text": "Optionally persist [resource descriptions](https://docs.getdbt.com/reference/resource-properties/description.md) as column and relation comments in the database."
      },
      {
        "page": "docs",
        "url": "https://docs.getdbt.com/reference/resource-configs/docs",
        "text": "You can configure `docs` behavior for many resources at once by setting in `dbt_project.yml`."
      }
    ]
  },
  "33": {
    "quotes": [
      {
        "page": "Debug errors",
        "url": "https://docs.getdbt.com/guides/debug-errors",
        "text": "Your dbt DAG is not acyclic, and needs to be fixed!"
      },
      {
        "page": "Debug errors",
        "url": "https://docs.getdbt.com/guides/debug-errors",
        "text": "Update the `ref` functions to break the cycle."
      },
      {
        "page": "Debug errors",
        "url": "https://docs.getdbt.com/guides/debug-errors",
        "text": "Compile the dependencies into a graph. Check that it's acyclic."
      },
      {
        "page": "SQL models",
        "url": "https://docs.getdbt.com/docs/build/sql-models",
        "text": "Determine the order to run the models by creating a dependent acyclic graph (DAG)."
      }
    ]
  },
  "34": {
    "quotes": [
      {
        "page": "Add snapshots to your DAG",
        "url": "https://docs.getdbt.com/docs/build/snapshots",
        "text": "This strategy works by comparing a list of columns between their current and historical values. If any of these columns have changed, then dbt will invalidate the old record and record the new one."
      }
    ],
    "run": {
      "dbtVersion": "1.11",
      "commands": [
        "cd dbt-sandbox/exp-34",
        "# snapshot s_check: strategy check, check_cols ['status','note']; run 1 source rows (1,a,x) (2,b,y) (3,c,NULL); run 2 source rows (1,a,NULL) (2,b,y) (3,c,z)",
        "../.venv/bin/dbt snapshot --profiles-dir .  (twice, source changed in between)",
        "duckdb: select id,status,note,dbt_valid_to is null as current from main.s_check order by id, dbt_valid_from"
      ],
      "observed": "(1,'a','x',False) (1,'a',None,True) (2,'b','y',True) (3,'c',None,False) (3,'c','z',True): value to null and null to value each closed the old row and inserted a new one; unchanged id 2 kept one row."
    }
  },
  "35": {
    "quotes": [
      {
        "page": "About var function",
        "url": "https://docs.getdbt.com/reference/dbt-jinja-functions/var",
        "text": "The `var()` function returns the value defined in your project or passed using `--vars`, based on precedence."
      },
      {
        "page": "About env_var function",
        "url": "https://docs.getdbt.com/reference/dbt-jinja-functions/env_var",
        "text": "The `env_var` function can be used to incorporate environment variables from the system into your dbt project."
      },
      {
        "page": "About env_var function",
        "url": "https://docs.getdbt.com/reference/dbt-jinja-functions/env_var",
        "text": "You can use the `env_var` function in your `profiles.yml` file, the `dbt_project.yml` file, the `sources.yml` file, your `schema.yml` files, and in model `.sql` files."
      },
      {
        "page": "About env_var function",
        "url": "https://docs.getdbt.com/reference/dbt-jinja-functions/env_var",
        "text": "Essentially, `env_var` is available anywhere dbt processes Jinja code."
      },
      {
        "page": "Project variables",
        "url": "https://docs.getdbt.com/docs/build/project-variables",
        "text": "To use a variable in a model, hook, or macro, use the `{{ var('...') }}` function."
      }
    ]
  },
  "36": {
    "quotes": [
      {
        "page": "About profiles.yml",
        "url": "https://docs.getdbt.com/docs/local/profiles.yml",
        "text": "`~/.dbt/profiles.yml` is the recommended location for the following reasons:"
      },
      {
        "page": "About profiles.yml",
        "url": "https://docs.getdbt.com/docs/local/profiles.yml",
        "text": "This takes you through the process of configuring an adapter and places the file into the recommended `~/.dbt/` location."
      },
      {
        "page": "Using threads",
        "url": "https://docs.getdbt.com/docs/running-a-dbt-project/using-threads",
        "text": "The number of threads represents the maximum number of paths through the graph dbt may work on at once – increasing the number of threads can minimize the run time of your project."
      },
      {
        "page": "Using threads",
        "url": "https://docs.getdbt.com/docs/running-a-dbt-project/using-threads",
        "text": "Specifying `threads: 4` means that dbt will work on *up to* 4 models at once without violating dependencies; the actual number of models it can work on will likely be constrained by the available paths through the dependency graph."
      }
    ]
  },
  "37": {
    "quotes": [
      {
        "page": "severity, error_if, and warn_if",
        "url": "https://docs.getdbt.com/reference/resource-configs/severity",
        "text": "It's possible to configure tests to return warnings instead of errors, or to make the test status conditional on the number of failures returned."
      },
      {
        "page": "severity, error_if, and warn_if",
        "url": "https://docs.getdbt.com/reference/resource-configs/severity",
        "text": "Maybe 1 duplicate record can count as a warning, but 10 duplicate records should count as an error."
      },
      {
        "page": "severity, error_if, and warn_if",
        "url": "https://docs.getdbt.com/reference/resource-configs/severity",
        "text": "* `warn_if`: conditional expression (default: `!=0`)"
      },
      {
        "page": "limit",
        "url": "https://docs.getdbt.com/reference/resource-configs/limit",
        "text": "Limit the number of failures that will be returned by a test query."
      },
      {
        "page": "Failing fast",
        "url": "https://docs.getdbt.com/reference/global-configs/failing-fast",
        "text": "Supply the `-x` or `--fail-fast` flag to `dbt run`, `dbt build`, or `dbt test` to make dbt exit immediately on the first failure."
      },
      {
        "page": "store_failures",
        "url": "https://docs.getdbt.com/reference/resource-configs/store_failures",
        "text": "Optionally set a test to always or never store its failures in the database."
      }
    ]
  },
  "38": {
    "quotes": [
      {
        "page": "Snowflake configurations",
        "url": "https://docs.getdbt.com/reference/resource-configs/snowflake-configs",
        "text": "To control clustering for a table or incremental model, use the `cluster_by` config."
      },
      {
        "page": "Snowflake configurations",
        "url": "https://docs.getdbt.com/reference/resource-configs/snowflake-configs",
        "text": "The `cluster_by` config accepts either a string, or a list of strings to use as clustering keys."
      }
    ]
  },
  "39": {
    "quotes": [
      {
        "page": "pre-hook & post-hook",
        "url": "https://docs.getdbt.com/reference/resource-configs/pre-hook-post-hook",
        "text": "A SQL statement (or list of SQL statements) to be run before or after a model, seed, or snapshot is built."
      },
      {
        "page": "Hooks and operations",
        "url": "https://docs.getdbt.com/docs/build/hooks-operations",
        "text": "* `pre-hook`: executed *before* a model, seed or snapshot is built."
      },
      {
        "page": "Hooks and operations",
        "url": "https://docs.getdbt.com/docs/build/hooks-operations",
        "text": "* `post-hook`: executed *after* a model, seed or snapshot is built."
      },
      {
        "page": "on-run-start & on-run-end",
        "url": "https://docs.getdbt.com/reference/project-configs/on-run-start-on-run-end",
        "text": "A SQL statement (or list of SQL statements) to be run at the start or end of the following commands:"
      }
    ]
  },
  "41": {
    "quotes": [
      {
        "page": "About target variables",
        "url": "https://docs.getdbt.com/reference/dbt-jinja-functions/target",
        "text": "| `target.type`         | postgres     | The active adapter being used."
      },
      {
        "page": "About target variables",
        "url": "https://docs.getdbt.com/reference/dbt-jinja-functions/target",
        "text": "| `target.name`         | dev          | Name of the active target"
      },
      {
        "page": "About target variables",
        "url": "https://docs.getdbt.com/reference/dbt-jinja-functions/target",
        "text": "These values are based on the target defined in your [profiles.yml](https://docs.getdbt.com/docs/local/profiles.yml.md) file."
      }
    ]
  },
  "42": {
    "quotes": [
      {
        "page": "Materializations",
        "url": "https://docs.getdbt.com/docs/build/materializations",
        "text": "`ephemeral` models are not directly built into the database. Instead, dbt will interpolate the code from an ephemeral model into its dependent models using a common table expression (CTE)."
      }
    ],
    "run": {
      "dbtVersion": "1.11",
      "commands": [
        "cd dbt-sandbox/exp-42",
        "# eph.sql: ephemeral, select 1 as id; down.sql refs eph three times in three join subqueries",
        "../.venv/bin/dbt run --profiles-dir . --select down",
        "cat target/compiled/sandbox/models/down.sql"
      ],
      "observed": "with __dbt__cte__eph as (select 1 as id) select a.id from (select * from __dbt__cte__eph) a join (select * from __dbt__cte__eph) b on a.id=b.id join (select * from __dbt__cte__eph) c on a.id=c.id  -- one CTE definition, three references; no view created (information_schema lists only 'down')."
    }
  },
  "43": {
    "quotes": [
      {
        "page": "Add sources to your DAG",
        "url": "https://docs.getdbt.com/docs/build/sources",
        "text": "Sources make it possible to name and describe the data loaded into your warehouse by your Extract and Load tools."
      },
      {
        "page": "Add sources to your DAG",
        "url": "https://docs.getdbt.com/docs/build/sources",
        "text": "select from source tables in your models using the [`{{ source() }}` function,](https://docs.getdbt.com/reference/dbt-jinja-functions/source.md) helping define the lineage of your data"
      },
      {
        "page": "About ref function",
        "url": "https://docs.getdbt.com/reference/dbt-jinja-functions/ref",
        "text": "Creates dependencies between the referenced node and the current model, which is useful for documentation and [node selection](https://docs.getdbt.com/reference/node-selection/syntax.md)"
      },
      {
        "page": "Migrate from DDL, DML, and stored procedures",
        "url": "https://docs.getdbt.com/guides/migrate-from-stored-procedures",
        "text": "dbt uses the ref and source macros to discover the ordering that transformations need to execute in"
      }
    ]
  },
  "44": {
    "quotes": [
      {
        "page": "Custom schemas",
        "url": "https://docs.getdbt.com/docs/build/custom-schemas",
        "text": "However, dbt puts it in a schema like `<target_schema>_marketing`."
      },
      {
        "page": "Custom schemas",
        "url": "https://docs.getdbt.com/docs/build/custom-schemas",
        "text": "By combining the target schema and the custom schema, dbt ensures that objects it creates in your data warehouse don't collide with one another."
      },
      {
        "page": "Customize dbt models database, schema, and alias",
        "url": "https://docs.getdbt.com/guides/customize-schema-alias",
        "text": "If you define a custom schema, dbt concatenates the schema mentioned earlier with the custom one."
      }
    ]
  },
  "45": {
    "quotes": [
      {
        "page": "Do ref-able resource names need to be unique?",
        "url": "https://docs.getdbt.com/faqs/Project/unique-resource-names",
        "text": "dbt uses that resource name to uniquely resolve the `ref` to a specific resource."
      },
      {
        "page": "Do ref-able resource names need to be unique?",
        "url": "https://docs.getdbt.com/faqs/Project/unique-resource-names",
        "text": "As a result, these resource names need to be unique, *even if they are in distinct folders*."
      }
    ]
  },
  "46": {
    "quotes": [
      {
        "page": "Project variables",
        "url": "https://docs.getdbt.com/docs/build/project-variables",
        "text": "Variables defined using `--var`, override values defined in `dbt_project.yml`."
      }
    ]
  },
  "47": {
    "quotes": [
      {
        "page": "Configure incremental models",
        "url": "https://docs.getdbt.com/docs/build/incremental-models",
        "text": "`sync_all_columns`: Adds any new columns to the existing table, and removes any columns that are now missing."
      },
      {
        "page": "Configure incremental models",
        "url": "https://docs.getdbt.com/docs/build/incremental-models",
        "text": "`append_new_columns`: Append new columns to the existing table. Note that this setting does *not* remove columns from the existing table that are not present in the new data."
      },
      {
        "page": "Configure incremental models",
        "url": "https://docs.getdbt.com/docs/build/incremental-models",
        "text": "`fail`: Triggers an error message when the source and target schemas diverge"
      }
    ]
  },
  "48": {
    "quotes": [
      {
        "page": "Configure incremental models",
        "url": "https://docs.getdbt.com/docs/build/incremental-models",
        "text": "The `is_incremental()` macro powers incremental materializations. It will return `True` if *all* of the following conditions are met:"
      },
      {
        "page": "Configure incremental models",
        "url": "https://docs.getdbt.com/docs/build/incremental-models",
        "text": "The model must already exist as a table in the database"
      },
      {
        "page": "Configure incremental models",
        "url": "https://docs.getdbt.com/docs/build/incremental-models",
        "text": "The `full-refresh` flag *is not* passed"
      },
      {
        "page": "Configure incremental models",
        "url": "https://docs.getdbt.com/docs/build/incremental-models",
        "text": "The running model is configured with `materialized='incremental'`"
      }
    ]
  },
  "49": {
    "quotes": [],
    "run": {
      "dbtVersion": "1.11",
      "commands": [
        "cd dbt-sandbox/exp-49; seed; model stg_customers with materialized=view; dbt run",
        "change config to materialized=table; ../.venv/bin/dbt --debug run --profiles-dir .",
        "query information_schema.tables for stg_customers"
      ],
      "observed": "debug log: alter view \"dev\".\"main\".\"stg_customers\" rename to \"stg_customers__dbt_backup\"; alter table \"dev\".\"main\".\"stg_customers__dbt_tmp\" rename to \"stg_customers\"; drop view if exists \"dev\".\"main\".\"stg_customers__dbt_backup\" cascade; run ended OK without --full-refresh; table_type = BASE TABLE"
    }
  },
  "50": {
    "quotes": [
      {
        "page": "How can I see the SQL that dbt is running?",
        "url": "https://docs.getdbt.com/faqs/Runs/checking-logs",
        "text": "The `target/compiled/` directory for compiled `select` statements"
      },
      {
        "page": "How can I see the SQL that dbt is running?",
        "url": "https://docs.getdbt.com/faqs/Runs/checking-logs",
        "text": "The `target/run/` directory for compiled `create` statements"
      },
      {
        "page": "How can I see the SQL that dbt is running?",
        "url": "https://docs.getdbt.com/faqs/Runs/checking-logs",
        "text": "The `logs/dbt.log` file for verbose logging."
      }
    ]
  },
  "51": {
    "quotes": [
      {
        "page": "About dbt debug command",
        "url": "https://docs.getdbt.com/reference/commands/debug",
        "text": "Use dbt debug to test database connections and check system setup."
      },
      {
        "page": "About dbt debug command",
        "url": "https://docs.getdbt.com/reference/commands/debug",
        "text": "It checks your database connection, local configuration, and system setup across multiple axes to help identify potential issues before running dbt commands."
      },
      {
        "page": "About dbt debug command",
        "url": "https://docs.getdbt.com/reference/commands/debug",
        "text": "* **Database connection** (for configured profiles)"
      }
    ]
  },
  "52": {
    "quotes": [
      {
        "page": "Using threads",
        "url": "https://docs.getdbt.com/docs/running-a-dbt-project/using-threads",
        "text": "For example, if you specify `threads: 1`, dbt will start building only one model, and finish it, before moving on to the next."
      },
      {
        "page": "Using threads",
        "url": "https://docs.getdbt.com/docs/running-a-dbt-project/using-threads",
        "text": "You can use a different number of threads than the value defined in your target by using the `--threads` option when executing a dbt command."
      }
    ],
    "run": {
      "dbtVersion": "1.11",
      "commands": [
        "psql: create table b_52.load_audit(id int primary key, last_loaded_at timestamp); insert into b_52.load_audit values (1, null);",
        "cd dbt-sandbox/exp-b-52 (Postgres, schema b_52, profile threads: 4; fct_orders and fct_payments both with pre_hook \"set lock_timeout = '2s'\" and post_hook \"update b_52.load_audit set last_loaded_at = now() where id = 1; select pg_sleep(5)\")",
        "../.venv/bin/dbt run --profiles-dir .   (run twice)",
        "../.venv/bin/dbt run --profiles-dir . --threads 1"
      ],
      "observed": "threads 4, run 1: '1 of 2 START ... fct_orders', '2 of 2 START ... fct_payments', '2 of 2 ERROR creating sql table model b_52.fct_payments [ERROR in 2.06s]', 'canceling statement due to lock timeout / CONTEXT: while updating tuple (0,1) in relation \"load_audit\"', 'Done. PASS=1 WARN=0 ERROR=1', exit 1. threads 4, run 2: fct_orders failed with the same lock timeout and fct_payments succeeded. --threads 1: 'Concurrency: 1 threads', fct_orders START/OK then fct_payments START/OK, 'Done. PASS=2 WARN=0 ERROR=0', exit 0."
    }
  },
  "53": {
    "quotes": [],
    "run": {
      "dbtVersion": "1.11",
      "commands": [
        "cd dbt-sandbox/exp-53; models int_orders -> ref(fct_orders) and fct_orders -> ref(int_orders); ../.venv/bin/dbt run --profiles-dir .",
        "same two models with materialized=ephemeral; dbt run",
        "int_orders refs new model shared, fct_orders refs int_orders; ../.venv/bin/dbt build --profiles-dir ."
      ],
      "observed": "RuntimeError: Found a cycle: model.sandbox.int_orders --> model.sandbox.fct_orders (nothing built); ephemeral variant: RuntimeError: Found a cycle: model.sandbox.fct_orders --> model.sandbox.int_orders; after moving the shared select to its own upstream model: Done. PASS=5 WARN=0 ERROR=0 TOTAL=5"
    }
  },
  "54": {
    "quotes": [
      {
        "page": "Materializations",
        "url": "https://docs.getdbt.com/docs/build/materializations",
        "text": "`ephemeral` models are not directly built into the database."
      },
      {
        "page": "Materializations",
        "url": "https://docs.getdbt.com/docs/build/materializations",
        "text": "You cannot select directly from this model."
      },
      {
        "page": "Materializations",
        "url": "https://docs.getdbt.com/docs/build/materializations",
        "text": "Overuse of ephemeral materialization can also make queries harder to debug."
      }
    ]
  },
  "55": {
    "quotes": [
      {
        "page": "About dbt parse command",
        "url": "https://docs.getdbt.com/reference/commands/parse",
        "text": "The `dbt parse` command parses and validates the contents of your dbt project."
      },
      {
        "page": "About dbt parse command",
        "url": "https://docs.getdbt.com/reference/commands/parse",
        "text": "Starting in v1.5, `dbt parse` will write or return a [manifest](https://docs.getdbt.com/reference/artifacts/manifest-json.md), enabling you to introspect dbt's understanding of all the resources in your project."
      },
      {
        "page": "About dbt parse command",
        "url": "https://docs.getdbt.com/reference/commands/parse",
        "text": "Since `dbt parse` doesn't connect to your warehouse, [this manifest will not contain any compiled code](https://docs.getdbt.com/faqs/Warehouse/db-connection-dbt-compile.md)."
      }
    ]
  },
  "56": {
    "quotes": [
      {
        "page": "Upgrading to v1.6",
        "url": "https://docs.getdbt.com/docs/dbt-versions/dbt-upgrade/Older versions/upgrading-to-v1.6",
        "text": "`vars` defined in a package's `dbt_project.yml` are now available in the resolution order when compiling nodes in that package, though CLI `--vars` and the root project's `vars` will still take precedence."
      },
      {
        "page": "Project variables",
        "url": "https://docs.getdbt.com/docs/build/project-variables",
        "text": "5. The global variable declaration in the root `dbt_project.yml` file"
      },
      {
        "page": "Project variables",
        "url": "https://docs.getdbt.com/docs/build/project-variables",
        "text": "6. If this node is defined in a package: variable declarations in that package's `dbt_project.yml` file"
      }
    ]
  },
  "57": {
    "quotes": [
      {
        "page": "Add data tests to your DAG",
        "url": "https://docs.getdbt.com/docs/build/data-tests",
        "text": "We call these \"singular\" data tests, because they're one-off assertions usable for a single purpose."
      },
      {
        "page": "Add data tests to your DAG",
        "url": "https://docs.getdbt.com/docs/build/data-tests",
        "text": "These tests are defined in `.sql` files, typically in your `tests` directory"
      },
      {
        "page": "Add data tests to your DAG",
        "url": "https://docs.getdbt.com/docs/build/data-tests",
        "text": "A **generic** data test is a parameterized query that accepts arguments."
      },
      {
        "page": "Add data tests to your DAG",
        "url": "https://docs.getdbt.com/docs/build/data-tests",
        "text": "The test query is defined in a special `test` block (like a [macro](https://docs.getdbt.com/docs/build/jinja-macros.md))."
      }
    ]
  },
  "58": {
    "quotes": [
      {
        "page": "About data tests property",
        "url": "https://docs.getdbt.com/reference/resource-properties/data-tests",
        "text": "This data test validates that all of the non-`null` values in a column are present in a supplied list of `values`."
      }
    ]
  },
  "59": {
    "quotes": [
      {
        "page": "About documentation",
        "url": "https://docs.getdbt.com/docs/build/documentation",
        "text": "Docs block files can contain arbitrary markdown, but they must be uniquely named."
      },
      {
        "page": "About documentation",
        "url": "https://docs.getdbt.com/docs/build/documentation",
        "text": "To declare a docs block, use the Jinja `docs` tag."
      },
      {
        "page": "About documentation",
        "url": "https://docs.getdbt.com/docs/build/documentation",
        "text": "To use a docs block, reference it from your `schema.yml` file with the [doc()](https://docs.getdbt.com/reference/dbt-jinja-functions/doc.md) function in place of a markdown string."
      },
      {
        "page": "docs-paths",
        "url": "https://docs.getdbt.com/reference/project-configs/docs-paths",
        "text": "Optionally specify a custom list of directories where [docs blocks](https://docs.getdbt.com/docs/build/documentation.md#docs-blocks) are located."
      }
    ]
  },
  "60": {
    "quotes": [
      {
        "page": "severity, error_if, and warn_if",
        "url": "https://docs.getdbt.com/reference/resource-configs/severity",
        "text": "`severity`: `error` or `warn` (default: `error`)"
      },
      {
        "page": "severity, error_if, and warn_if",
        "url": "https://docs.getdbt.com/reference/resource-configs/severity",
        "text": "By default, a test with `severity: warn` will only ever return a warning, and not cause errors."
      },
      {
        "page": "severity, error_if, and warn_if",
        "url": "https://docs.getdbt.com/reference/resource-configs/severity",
        "text": "`--warn-error`: Promotes *all* dbt warnings (including test warnings, Jinja warnings, deprecations, and so on.) to errors."
      }
    ]
  },
  "61": {
    "quotes": [
      {
        "page": "dbt freshness",
        "url": "https://docs.getdbt.com/reference/commands/freshness",
        "text": "dbt retrieves the latest timestamp using one of the following methods, then compares it with the current timestamp to determine the age of the data."
      },
      {
        "page": "dbt freshness",
        "url": "https://docs.getdbt.com/reference/commands/freshness",
        "text": "Queries `MAX(<loaded_at_field>)` against the materialized relation."
      },
      {
        "page": "Sources JSON file",
        "url": "https://docs.getdbt.com/reference/artifacts/sources-json",
        "text": "`max_loaded_at`: Max value of `loaded_at_field` timestamp in the source table when queried."
      }
    ],
    "run": {
      "dbtVersion": "1.11",
      "commands": [
        "cd dbt-sandbox/exp-61; table t with ts = timestamp '2026-01-01 00:00:00', source freshness warn_after 1 day, loaded_at_field: ts",
        "TZ=Asia/Tokyo ../.venv/bin/dbt source freshness --profiles-dir . ; read target/sources.json results[0]"
      ],
      "observed": "max_loaded_at 2026-01-01T00:00:00+00:00, snapshotted_at 2026-11-08T23:22:47.063597+00:00 (host `date -u` 23:22:48 UTC), max_loaded_at_time_ago_in_s 26954567; the snapshot time is UTC although TZ=Asia/Tokyo"
    }
  },
  "62": {
    "quotes": [
      {
        "page": "Unit tests",
        "url": "https://docs.getdbt.com/docs/build/unit-tests",
        "text": "To run only unit tests on demand, use the `test_type` selector — this works across all engines (dbt v1 and dbt v2):"
      },
      {
        "page": "About dbt test command",
        "url": "https://docs.getdbt.com/reference/commands/test",
        "text": "`dbt test` runs data tests defined on models, sources, snapshots, and seeds and unit tests defined on SQL models."
      },
      {
        "page": "About dbt build command",
        "url": "https://docs.getdbt.com/reference/commands/build",
        "text": "Unit tests and data tests can be selected using `--select test_type:unit` or `--select test_type:data` for `dbt build` (same for the `--exclude` flag)."
      }
    ]
  },
  "63": {
    "quotes": [
      {
        "page": "Defer",
        "url": "https://docs.getdbt.com/reference/node-selection/defer",
        "text": "Defer is a powerful feature that makes it possible to run a subset of (Applies to dbt v1.11 and later) models, tests, or functions in a [sandbox environment](https://docs.getdbt.com/docs/environments-in-dbt.md) without having to first build their upstream parents."
      },
      {
        "page": "Defer",
        "url": "https://docs.getdbt.com/reference/node-selection/defer",
        "text": "When `--defer` is enabled, dbt resolves `ref`(Applies to dbt v1.11 and later) and `function` calls using the state manifest instead, but only if:"
      },
      {
        "page": "Defer",
        "url": "https://docs.getdbt.com/reference/node-selection/defer",
        "text": "Ephemeral models are never deferred, since they serve as \"passthroughs\" for other `ref` calls."
      },
      {
        "page": "Defer",
        "url": "https://docs.getdbt.com/reference/node-selection/defer",
        "text": "For some use cases, you can use `dbt clone` to achieve similar functionality."
      }
    ]
  },
  "64": {
    "quotes": [
      {
        "page": "Quickstart for dbt v1 using DuckDB",
        "url": "https://docs.getdbt.com/guides/duckdb",
        "text": "Use the `dbt docs generate` command to compile information about your dbt project and warehouse into `manifest.json` and `catalog.json` files"
      }
    ],
    "run": {
      "dbtVersion": "1.11",
      "commands": [
        "cd dbt-sandbox/exp-64; ../.venv/bin/dbt build --profiles-dir . ; ../.venv/bin/dbt docs generate --profiles-dir .",
        "ls target; grep -o \"manifest.json\\|catalog.json\\|run_results.json\\|sources.json\\|profiles.yml\\|dbt_project.yml\" target/index.html | sort | uniq -c"
      ],
      "observed": "target contains catalog.json, manifest.json, index.html, graph.gpickle, partial_parse.msgpack, run_results.json; index.html references manifest.json (1) and catalog.json (1) and none of run_results.json, sources.json, profiles.yml, dbt_project.yml"
    }
  },
  "65": {
    "quotes": [
      {
        "page": "About env_var function",
        "url": "https://docs.getdbt.com/reference/dbt-jinja-functions/env_var",
        "text": "When used in a `profiles.yml` file (to avoid putting credentials on a server), it can be used like this:"
      },
      {
        "page": "About env_var function",
        "url": "https://docs.getdbt.com/reference/dbt-jinja-functions/env_var",
        "text": "The `env_var` function can be used to incorporate environment variables from the system into your dbt project."
      },
      {
        "page": "dbt tips and tricks",
        "url": "https://docs.getdbt.com/docs/build/dbt-tips",
        "text": "Only `profiles.yml` and `packages.yml` support environment variables for secure values (using the `DBT_ENV_SECRET_` prefix). These are masked in logs and intended for credentials or secrets."
      }
    ]
  },
  "66": {
    "quotes": [
      {
        "page": "Add snapshots to your DAG",
        "url": "https://docs.getdbt.com/docs/build/snapshots",
        "text": "If at least one of the specified `check_cols `changes, the snapshot creates a new row."
      }
    ],
    "run": {
      "dbtVersion": "1.11",
      "commands": [
        "cd dbt-sandbox/exp-66; seed src.csv (1,active),(2,active); snapshots/snap.yml: strategy check, check_cols [status], unique_key id; dbt seed; dbt snapshot",
        "seed src.csv (1,<empty>),(2,active); dbt seed; dbt snapshot",
        "select id,status,dbt_valid_to is null from main.snap order by id,dbt_valid_from"
      ],
      "observed": "[(1, 'active', False), (1, None, True), (2, 'active', True)]  (old row closed, new NULL-status row current, id 2 unchanged)"
    }
  },
  "67": {
    "quotes": [
      {
        "page": "Custom schemas",
        "url": "https://docs.getdbt.com/docs/build/custom-schemas",
        "text": "If dbt ignored the target schema and only used the model's custom schema, every dbt user would create models in the same schema and would overwrite each other's work."
      },
      {
        "page": "Custom schemas",
        "url": "https://docs.getdbt.com/docs/build/custom-schemas",
        "text": "If you remove `{{ default_schema }}`, it causes developers to override each other's models if they create their own custom schemas."
      },
      {
        "page": "Customize dbt models database, schema, and alias",
        "url": "https://docs.getdbt.com/guides/customize-schema-alias",
        "text": "As described in the previous example, update the macro to check if dbt is running in production. Only in production should we remove the concatenation and use the custom schema alone."
      }
    ]
  },
  "68": {
    "quotes": [
      {
        "page": "Configure incremental models",
        "url": "https://docs.getdbt.com/docs/build/incremental-models",
        "text": "Columns used in this way should not contain any nulls, or the incremental model may fail to match rows and generate duplicate rows."
      }
    ]
  },
  "69": {
    "quotes": [
      {
        "page": "About execute variable",
        "url": "https://docs.getdbt.com/reference/dbt-jinja-functions/execute",
        "text": "`execute` is a Jinja variable that returns True when dbt is in \"execute\" mode."
      },
      {
        "page": "About execute variable",
        "url": "https://docs.getdbt.com/reference/dbt-jinja-functions/execute",
        "text": "Any Jinja that relies on a result being returned from the database will error during the parse phase."
      },
      {
        "page": "About execute variable",
        "url": "https://docs.getdbt.com/reference/dbt-jinja-functions/execute",
        "text": "Compiles (and runs) each node (eg. building models, or running tests). **SQL is run during this phase**, and `execute == True`."
      }
    ]
  },
  "71": {
    "quotes": [
      {
        "page": "Add snapshots to your DAG",
        "url": "https://docs.getdbt.com/docs/build/snapshots",
        "text": "By default, `dbt_valid_to` is `NULL` for current records."
      },
      {
        "page": "Add snapshots to your DAG",
        "url": "https://docs.getdbt.com/docs/build/snapshots",
        "text": "The timestamp when this snapshot row became valid."
      },
      {
        "page": "Add snapshots to your DAG",
        "url": "https://docs.getdbt.com/docs/build/snapshots",
        "text": "A unique key generated for each snapshot row."
      }
    ]
  },
  "72": {
    "quotes": [],
    "run": {
      "dbtVersion": "1.11",
      "commands": [
        "cd dbt-sandbox/exp-72; bad.sql: table 'select * from not_existing_table' with post_hook 'create table if not exists main.hook_log as select 1 as x'; good.sql: 'select 1 as id' with post_hook creating main.hook_log_ok; ../.venv/bin/dbt run --profiles-dir .",
        "select table_name from information_schema.tables where table_name like 'hook_log%'"
      ],
      "observed": "1 of 3 ERROR creating sql table model main.bad; 2 of 3 OK created sql table model main.good; tables: [('hook_log_ok',)] (hook_log, the failed model's post-hook table, does not exist)"
    }
  },
  "74": {
    "quotes": [
      {
        "page": "Add Seeds to your DAG",
        "url": "https://docs.getdbt.com/docs/build/seeds",
        "text": "Seeds should **not** be used to load raw data (for example, large CSV exports from a production database)."
      },
      {
        "page": "Add Seeds to your DAG",
        "url": "https://docs.getdbt.com/docs/build/seeds",
        "text": "Loading CSVs using dbt's seed functionality is not performant for large files."
      },
      {
        "page": "Add Seeds to your DAG",
        "url": "https://docs.getdbt.com/docs/build/seeds",
        "text": "Seeds are best suited to static data which changes infrequently."
      }
    ]
  },
  "75": {
    "quotes": [
      {
        "page": "Upgrading to v1.7",
        "url": "https://docs.getdbt.com/docs/dbt-versions/dbt-upgrade/upgrading-to-v1.7",
        "text": "To exclude a source from freshness calculations, explicitly set `freshness: null`."
      },
      {
        "page": "How do I exclude a table from a freshness snapshot?",
        "url": "https://docs.getdbt.com/faqs/Project/exclude-table-from-freshness",
        "text": "To work around this, you can set the table's freshness to null (`freshness: null`) to \"unset\" the freshness for a particular table:"
      },
      {
        "page": "Upgrading to v1.7",
        "url": "https://docs.getdbt.com/docs/dbt-versions/dbt-upgrade/upgrading-to-v1.7",
        "text": "If a `loaded_at_field` is *not* provided, dbt will calculate freshness via warehouse metadata tables when possible (new behavior)."
      }
    ]
  },
  "76": {
    "quotes": [
      {
        "page": "Run results JSON file",
        "url": "https://docs.getdbt.com/reference/artifacts/run-results-json",
        "text": "This file contains information about a completed invocation of dbt, including timing and status info for each node (model, test, etc) that was executed."
      },
      {
        "page": "Run results JSON file",
        "url": "https://docs.getdbt.com/reference/artifacts/run-results-json",
        "text": "`adapter_response`: Dictionary of metadata returned from the database, which varies by adapter. For example, success `code`, number of `rows_affected`, total `bytes_processed`, and so on."
      },
      {
        "page": "Run results JSON file",
        "url": "https://docs.getdbt.com/reference/artifacts/run-results-json",
        "text": "(The full `node` object is recorded in [`manifest.json`](https://docs.getdbt.com/reference/artifacts/manifest-json.md).)"
      }
    ]
  },
  "77": {
    "quotes": [
      {
        "page": "Analyses",
        "url": "https://docs.getdbt.com/docs/build/analyses",
        "text": "Any `.sql` files found in the `analyses/` directory of a dbt project will be compiled, but not executed."
      },
      {
        "page": "Analyses",
        "url": "https://docs.getdbt.com/docs/build/analyses",
        "text": "This means that analysts can use dbt functionality like `{{ ref(...) }}` to select from models in an environment-agnostic way."
      },
      {
        "page": "Analyses",
        "url": "https://docs.getdbt.com/docs/build/analyses",
        "text": "Note that no `running_total_by_account` relation will be materialized in the database as this is an `analysis`, not a `model`."
      }
    ]
  },
  "78": {
    "quotes": [
      {
        "page": "Writing custom generic data tests",
        "url": "https://docs.getdbt.com/best-practices/writing-custom-generic-tests",
        "text": "To define your own generic tests, simply create a `test` block called `<test_name>`."
      },
      {
        "page": "Writing custom generic data tests",
        "url": "https://docs.getdbt.com/best-practices/writing-custom-generic-tests",
        "text": "When documenting custom test macros in a `schema.yml` file, add the `test_` prefix to the macro name."
      },
      {
        "page": "Add data tests to your DAG",
        "url": "https://docs.getdbt.com/docs/build/data-tests",
        "text": "These tests are defined in `.sql` files, typically in your `tests` directory"
      }
    ],
    "run": {
      "dbtVersion": "1.11",
      "commands": [
        "cd dbt-sandbox/exp-78; macros/t.sql: {% macro test_is_even(model, column_name) %} select {{ column_name }} from {{ model }} where ({{ column_name }} % 2) = 1 {% endmacro %}; schema.yml data_tests: [is_even] on stg_customers.id; ../.venv/bin/dbt build --profiles-dir .",
        "replace the macro by tests/is_even.sql (singular SQL) while schema.yml still lists is_even; dbt build"
      ],
      "observed": "macro variant: '3 of 3 START test is_even_stg_customers_id' then FAIL 1 (the macro registered as a generic test and returned the odd row); singular-file variant: 'FAIL 1 is_even' runs as a singular test, while the schema.yml reference 'ERROR is_even_stg_customers_id' (not usable as a generic test)"
    }
  },
  "79": {
    "quotes": [
      {
        "page": "Define configs",
        "url": "https://docs.getdbt.com/reference/define-configs",
        "text": "The most specific config always takes precedence."
      },
      {
        "page": "Define configs",
        "url": "https://docs.getdbt.com/reference/define-configs",
        "text": "This generally follows the order above: an in-file `config()` block --> properties defined in a `.yml` file --> config defined in the project file."
      }
    ]
  },
  "80": {
    "quotes": [
      {
        "page": "About incremental strategy",
        "url": "https://docs.getdbt.com/docs/build/incremental-strategy",
        "text": "On adapters which support the `merge` strategy, you may optionally pass a list of column names to a `merge_update_columns` config."
      },
      {
        "page": "About incremental strategy",
        "url": "https://docs.getdbt.com/docs/build/incremental-strategy",
        "text": "In that case, dbt will update *only* the columns specified by the config, and keep the previous values of other columns."
      }
    ]
  },
  "81": {
    "quotes": [
      {
        "page": "Model contracts",
        "url": "https://docs.getdbt.com/docs/mesh/govern/model-contracts",
        "text": "While building your model, dbt will verify that your model's transformation will produce a dataset matching up with its contract, or it will fail to build."
      }
    ]
  },
  "83": {
    "quotes": [
      {
        "page": "About env_var function",
        "url": "https://docs.getdbt.com/reference/dbt-jinja-functions/env_var",
        "text": "You can also provide a default value as a second argument:"
      },
      {
        "page": "Environment variables",
        "url": "https://docs.getdbt.com/docs/build/environment-variables",
        "text": "how to call the Jinja function `{{env_var('DBT_KEY','OPTIONAL_DEFAULT')}}`"
      },
      {
        "page": "About env_var function",
        "url": "https://docs.getdbt.com/reference/dbt-jinja-functions/env_var",
        "text": "If your project references environment variables that aren't set, dbt will raise a compilation error."
      }
    ]
  },
  "84": {
    "quotes": [
      {
        "page": "About dispatch config",
        "url": "https://docs.getdbt.com/reference/dbt-jinja-functions/dispatch",
        "text": "As a user, I can accomplish this via a [project-level `dispatch` config](https://docs.getdbt.com/reference/project-configs/dispatch-config.md)."
      },
      {
        "page": "About dispatch config",
        "url": "https://docs.getdbt.com/reference/dbt-jinja-functions/dispatch",
        "text": "The config below defines dynamic routing for that namespace, telling dbt to search through an ordered sequence of packages, instead of just the `dbt_utils` package."
      },
      {
        "page": "About dispatch config",
        "url": "https://docs.getdbt.com/reference/dbt-jinja-functions/dispatch",
        "text": "Note that this config *must* be specified in the user's root `dbt_project.yml`."
      }
    ]
  },
  "85": {
    "quotes": [
      {
        "page": "grants",
        "url": "https://docs.getdbt.com/reference/resource-configs/grants",
        "text": "When your model, seed, or snapshot finishes building, dbt ensures that the grants on its view or table match exactly the grants you have configured."
      },
      {
        "page": "grants",
        "url": "https://docs.getdbt.com/reference/resource-configs/grants",
        "text": "When you `run` a model, `seed` data, or `snapshot` a dataset, dbt will run `grant` and/or `revoke` statements to ensure that the permissions on the database object match the `grants` you have configured on the resource."
      }
    ]
  },
  "86": {
    "quotes": [
      {
        "page": "About adapter object",
        "url": "https://docs.getdbt.com/reference/dbt-jinja-functions/adapter",
        "text": "Returns a cached [Relation](https://docs.getdbt.com/reference/dbt-classes.md#relation) object identified by the `database.schema.identifier` provided to the method, or `None` if the relation does not exist."
      }
    ]
  },
  "87": {
    "quotes": [
      {
        "page": "What happens if I add new columns to my snapshot query?",
        "url": "https://docs.getdbt.com/faqs/Snapshots/snapshot-schema-changes",
        "text": "When the columns of your source query changes, dbt will attempt to reconcile this change in the destination snapshot table. dbt does this by:"
      },
      {
        "page": "What happens if I add new columns to my snapshot query?",
        "url": "https://docs.getdbt.com/faqs/Snapshots/snapshot-schema-changes",
        "text": "Creating new columns from the source query in the destination table"
      }
    ]
  },
  "88": {
    "quotes": [
      {
        "page": "Set operators",
        "url": "https://docs.getdbt.com/reference/node-selection/set-operators",
        "text": "Use commas with no spaces between arguments to define an intersection when you pass multiple arguments to `--select` or `--exclude`. Spaces between arguments still mean a [union](#unions)."
      },
      {
        "page": "Set operators",
        "url": "https://docs.getdbt.com/reference/node-selection/set-operators",
        "text": "An intersection keeps only the nodes that match every selector expression; a resource must satisfy *all* comma-separated arguments to remain in the final set."
      }
    ]
  },
  "89": {
    "quotes": [
      {
        "page": "Packages",
        "url": "https://docs.getdbt.com/docs/build/packages",
        "text": "Where possible, we recommend installing packages via dbt Hub, since this allows dbt to handle duplicate dependencies."
      }
    ],
    "run": {
      "dbtVersion": "1.11",
      "commands": [
        "cd dbt-sandbox/exp-89; packages.yml = dbt-labs/audit_helper 0.6.0 (needs dbt_utils >=0.9.0,<2.0.0) + dbt-labs/codegen 0.5.0 (needs dbt_utils >=0.8.0,<0.9.0); ../.venv/bin/dbt deps --profiles-dir .",
        "../.venv/bin/dbt clean --profiles-dir .; ../.venv/bin/dbt deps --profiles-dir .",
        "add require-dbt-version: [\">=1.0.0\", \"<2.0.0\"] to dbt_project.yml; ../.venv/bin/dbt deps --profiles-dir .",
        "change codegen to 0.8.0 (dbt_utils >=0.8.0,<2.0.0); ../.venv/bin/dbt deps --profiles-dir .",
        "then restore codegen 0.5.0 after editing dbt_packages/audit_helper/packages.yml to relax its range; ../.venv/bin/dbt deps --profiles-dir ."
      ],
      "observed": "Conflict: 'Version error for package dbt-labs/dbt_utils: Could not find a satisfactory version from options: [>=0.9.0, <2.0.0, >=0.8.0, <0.9.0]' (same after dbt clean, same with require-dbt-version, same after editing the installed package's packages.yml). With codegen 0.8.0: 'Installing dbt-labs/dbt_utils / Installed from version 1.4.1 / Up to date!' and dbt_packages holds audit_helper, codegen, dbt_utils."
    }
  },
  "90": {
    "quotes": [
      {
        "page": "Unit tests",
        "url": "https://docs.getdbt.com/docs/build/unit-tests",
        "text": "Unit tests must be defined in a YML file in your [`models/` directory](https://docs.getdbt.com/reference/project-configs/model-paths.md)."
      },
      {
        "page": "Supported data formats for unit tests",
        "url": "https://docs.getdbt.com/reference/resource-properties/data-formats",
        "text": "`dict` (default): Inline dictionary values."
      },
      {
        "page": "Supported data formats for unit tests",
        "url": "https://docs.getdbt.com/reference/resource-properties/data-formats",
        "text": "`dict` requires an inline dictionary for `rows`:"
      },
      {
        "page": "Unit tests",
        "url": "https://docs.getdbt.com/docs/build/unit-tests",
        "text": "The previous example defines the mock data using the inline `dict` format, but you can also use `csv` or `sql` either inline or in a separate fixture file."
      }
    ]
  },
  "91": {
    "quotes": [
      {
        "page": "freshness",
        "url": "https://docs.getdbt.com/reference/resource-configs/freshness",
        "text": "Adds a `WHERE` clause to the freshness query to limit data scanned."
      },
      {
        "page": "freshness",
        "url": "https://docs.getdbt.com/reference/resource-configs/freshness",
        "text": "Useful for BigQuery partitioned tables or large tables on Snowflake, Databricks, or Spark."
      }
    ]
  },
  "93": {
    "quotes": [
      {
        "page": "Add data tests to your DAG",
        "url": "https://docs.getdbt.com/docs/build/data-tests",
        "text": "The simplest way to define a data test is by writing the exact SQL that will return failing records."
      },
      {
        "page": "Add data tests to your DAG",
        "url": "https://docs.getdbt.com/docs/build/data-tests",
        "text": "If the data test returns zero failing rows, it passes, and your assertion has been validated."
      }
    ]
  },
  "94": {
    "quotes": [
      {
        "page": "About incremental strategy",
        "url": "https://docs.getdbt.com/docs/build/incremental-strategy",
        "text": "The `delete+insert` strategy deletes the data for the `unique_key` from the target table and then inserts the data for those with a `unique_key`, which may be less efficient for larger datasets."
      },
      {
        "page": "About incremental strategy",
        "url": "https://docs.getdbt.com/docs/build/incremental-strategy",
        "text": "This strategy shouldn't be confused with `delete+insert` which deletes matching records before inserting new ones."
      },
      {
        "page": "BigQuery configurations",
        "url": "https://docs.getdbt.com/reference/resource-configs/bigquery-configs",
        "text": "The `merge` incremental strategy will generate a `merge` statement that looks something like:"
      },
      {
        "page": "BigQuery configurations",
        "url": "https://docs.getdbt.com/reference/resource-configs/bigquery-configs",
        "text": "`merge` (default)"
      },
      {
        "page": "Snowflake configurations",
        "url": "https://docs.getdbt.com/reference/resource-configs/snowflake-configs",
        "text": "If you encounter this error, you can instruct dbt to use a two-step incremental approach by setting the `incremental_strategy` config for your model to `delete+insert`."
      }
    ]
  },
  "95": {
    "quotes": [
      {
        "page": "About run_query macro",
        "url": "https://docs.getdbt.com/reference/dbt-jinja-functions/run_query",
        "text": "Returns a [Table](https://agate.readthedocs.io/page/api/table.html) object with the result of the query."
      }
    ],
    "run": {
      "dbtVersion": "1.11",
      "commands": [
        "cd dbt-sandbox/exp-95 && ../.venv/bin/dbt run-operation chk --profiles-dir .  (macro runs run_query('select 41 + 1 as count') and logs results, results.rows[0][0], results.columns[0].values(), results.fetchone is defined, results.iloc is defined, results['count'])"
      ],
      "observed": "REPR=| column | data_type | / | count | Integer |; ROWS0_0=42; COLUMNS_values=(42,); ATTR_fetchone=False; ATTR_iloc=False; KEY_count= (empty: results['count'] does not return 42)"
    }
  },
  "96": {
    "quotes": [
      {
        "page": "Debug errors",
        "url": "https://docs.getdbt.com/guides/debug-errors",
        "text": "Compile the dependencies into a graph. Check that it's acyclic."
      },
      {
        "page": "Debug errors",
        "url": "https://docs.getdbt.com/guides/debug-errors",
        "text": "Found a cycle: model.jaffle_shop.customers --> model.jaffle_shop.stg_customers --> model.jaffle_shop.customers"
      },
      {
        "page": "Debug errors",
        "url": "https://docs.getdbt.com/guides/debug-errors",
        "text": "Your dbt DAG is not acyclic, and needs to be fixed!"
      }
    ]
  },
  "97": {
    "quotes": [
      {
        "page": "Exclude models from your run",
        "url": "https://docs.getdbt.com/reference/node-selection/exclude",
        "text": "Models specified with the `--exclude` flag will be removed from the set of models selected with `--select`."
      },
      {
        "page": "Graph operators",
        "url": "https://docs.getdbt.com/reference/node-selection/graph-operators",
        "text": "Placed after a model/resource — Includes the resource itself and all its descendants (downstream dependencies)."
      },
      {
        "page": "Exclude models from your run",
        "url": "https://docs.getdbt.com/reference/node-selection/exclude",
        "text": "dbt provides an `--exclude` flag with the same semantics as `--select`."
      }
    ]
  },
  "100": {
    "quotes": [
      {
        "page": "Upgrading to dbt utils v1.0",
        "url": "https://docs.getdbt.com/docs/dbt-versions/dbt-upgrade/Older versions/upgrading-to-dbt-utils-v1.0",
        "text": "The original treated null values and blank strings the same, which could lead to duplicate keys being created."
      }
    ],
    "run": {
      "dbtVersion": "1.11",
      "commands": [
        "cd dbt-sandbox/exp-100; packages.yml = dbt-labs/dbt_utils 1.3.0; ../.venv/bin/dbt deps --profiles-dir .; ../.venv/bin/dbt run --select sk --profiles-dir .",
        "../.venv/bin/dbt show --inline \"select customer_id, order_id, concat_key, surrogate_key from {{ ref('sk') }} order by 1\" --profiles-dir .   (concat_key = cast(customer_id as varchar) || '-' || cast(order_id as varchar))",
        "inspect dbt_packages/dbt_utils/macros/sql/generate_surrogate_key.sql"
      ],
      "observed": "Row (2, order_id NULL): concat_key is empty (NULL), surrogate_key = 529273ab1940ae5fa... (non-null); row (1, 10): concat_key 1-10, surrogate_key dd56b78777e207544... Macro source: \"coalesce(cast(\" ~ field ~ \" as \" ~ dbt.type_string() ~ \"), '\" ~ default_null_value ~\"')\" with default_null_value '_dbt_utils_surrogate_key_null_', joined by '-' then dbt.hash(dbt.concat(fields))."
    }
  },
  "101": {
    "quotes": [
      {
        "page": "freshness",
        "url": "https://docs.getdbt.com/reference/resource-configs/freshness",
        "text": "Each of `warn_after` and `error_after` requires both `count` and `period`; setting only one issues a parse warning but causes an error when `dbt freshness` runs."
      },
      {
        "page": "freshness",
        "url": "https://docs.getdbt.com/reference/resource-configs/freshness",
        "text": "period: minute | hour | day"
      }
    ],
    "run": {
      "dbtVersion": "1.11",
      "commands": [
        "cd dbt-sandbox/exp-101; ../.venv/bin/dbt seed --profiles-dir .; ../.venv/bin/dbt source freshness --profiles-dir .  (source table config has freshness: warn_after: {count: 6, period: hours})"
      ],
      "observed": "mashumaro.exceptions.InvalidFieldValue: Field \"warn_after\" of type Optional[Time] in FreshnessThreshold has invalid value {'count': 6, 'period': 'hours'}"
    }
  },
  "102": {
    "quotes": [
      {
        "page": "about this",
        "url": "https://docs.getdbt.com/reference/dbt-jinja-functions/this",
        "text": "`this` is a [Relation](https://docs.getdbt.com/reference/dbt-classes.md#relation), and as such, properties such as `{{ this.database }}` and `{{ this.schema }}` compile as expected."
      },
      {
        "page": "dbt Classes",
        "url": "https://docs.getdbt.com/reference/dbt-classes",
        "text": "-- Return the `identifier` for this relation"
      },
      {
        "page": "dbt Classes",
        "url": "https://docs.getdbt.com/reference/dbt-classes",
        "text": "The `Relation` object is used to interpolate schema and table names into SQL code with appropriate quoting."
      }
    ],
    "run": {
      "dbtVersion": "1.11",
      "commands": [
        "cd dbt-sandbox/exp-102 && ../.venv/bin/dbt run --select th --profiles-dir .  (model logs this, this.identifier, this.schema, this.database with info=True)"
      ],
      "observed": "THIS=\"dev\".\"main\".\"th\" | IDENTIFIER=th | SCHEMA=main | DATABASE=dev"
    }
  },
  "103": {
    "quotes": [
      {
        "page": "Connection profiles",
        "url": "https://docs.getdbt.com/docs/local/connection-profiles",
        "text": "`target`: This is the default target your dbt project will use. It must be one of the targets you define in your profile. Commonly it is set to `dev`."
      },
      {
        "page": "Connection profiles",
        "url": "https://docs.getdbt.com/docs/local/connection-profiles",
        "text": "If you do have multiple targets in your profile, and want to use a target other than the default, you can do this using the `--target` flag when running a dbt command."
      }
    ]
  },
  "104": {
    "quotes": [
      {
        "page": "Configure incremental models",
        "url": "https://docs.getdbt.com/docs/build/incremental-models",
        "text": "`fail`: Triggers an error message when the source and target schemas diverge"
      }
    ],
    "run": {
      "dbtVersion": "1.11",
      "commands": [
        "cd dbt-sandbox/exp-104; ../.venv/bin/dbt run --select inc_fail inc_sync inc_append --profiles-dir .",
        "../.venv/bin/dbt run --select inc_fail inc_sync inc_append --vars '{widen: true}' --profiles-dir .  (inc_fail then selects two extra columns)",
        "../.venv/bin/dbt show --inline \"select * from main.inc_fail\" --profiles-dir ."
      ],
      "observed": "ERROR creating sql incremental model main.inc_fail: Compilation Error ... The source and target schemas on this incremental model are out of sync! (macro default__process_schema_changes). Afterwards main.inc_fail still has columns id, c1 only (row 1, a)."
    }
  },
  "105": {
    "quotes": [
      {
        "page": "Unit tests",
        "url": "https://docs.getdbt.com/docs/build/unit-tests",
        "text": "Unit tests allow you to validate your SQL modeling logic on a small set of static inputs *before* you materialize your full model in production."
      },
      {
        "page": "Unit tests",
        "url": "https://docs.getdbt.com/docs/build/unit-tests",
        "text": "However, these tests could only be executed *after* building a model."
      },
      {
        "page": "Add data tests to your DAG",
        "url": "https://docs.getdbt.com/docs/build/data-tests",
        "text": "These queries return the rows where your assertion is *not* true; if the test returns zero rows, your assertion passes."
      },
      {
        "page": "Unit tests",
        "url": "https://docs.getdbt.com/docs/build/unit-tests",
        "text": "dbt Labs strongly recommends only running unit tests in development or CI environments."
      }
    ]
  },
  "106": {
    "quotes": [
      {
        "page": "freshness",
        "url": "https://docs.getdbt.com/reference/resource-configs/freshness",
        "text": "A `freshness` and `loaded_at_field` set on a source apply to all tables in that source."
      },
      {
        "page": "freshness",
        "url": "https://docs.getdbt.com/reference/resource-configs/freshness",
        "text": "A `freshness` and `loaded_at_field` set on a source *table* override the source-level values."
      },
      {
        "page": "freshness",
        "url": "https://docs.getdbt.com/reference/resource-configs/freshness",
        "text": "To exclude a source from freshness calculations, explicitly set `freshness: null`."
      }
    ]
  },
  "107": {
    "quotes": [
      {
        "page": "About dbt clone command",
        "url": "https://docs.getdbt.com/reference/commands/clone",
        "text": "The `dbt clone` command clones selected nodes from the [specified state](https://docs.getdbt.com/reference/node-selection/syntax.md#establishing-state) to the target schema(s)."
      },
      {
        "page": "About dbt clone command",
        "url": "https://docs.getdbt.com/reference/commands/clone",
        "text": "If your data platform supports zero-copy cloning of tables (Snowflake, Databricks, or BigQuery), and this model exists as a table in the source environment, dbt will create it in your target environment as a clone."
      },
      {
        "page": "About dbt clone command",
        "url": "https://docs.getdbt.com/reference/commands/clone",
        "text": "Otherwise, dbt will create a simple pointer view (`select * from` the source object)"
      }
    ]
  },
  "108": {
    "quotes": [
      {
        "page": "About microbatch incremental models",
        "url": "https://docs.getdbt.com/docs/build/incremental-microbatch",
        "text": "Required for your microbatch model and any direct parents that should be filtered."
      },
      {
        "page": "About microbatch incremental models",
        "url": "https://docs.getdbt.com/docs/build/incremental-microbatch",
        "text": "The granularity of your batches. Supported values are `hour`, `day`, `month`, and `year`"
      },
      {
        "page": "About microbatch incremental models",
        "url": "https://docs.getdbt.com/docs/build/incremental-microbatch",
        "text": "Process X batches prior to the latest bookmark to capture late-arriving records."
      },
      {
        "page": "About microbatch incremental models",
        "url": "https://docs.getdbt.com/docs/build/incremental-microbatch",
        "text": "In this example, `unique_key` is required because `dbt-postgres` microbatch uses the `merge` strategy, which needs a `unique_key` to identify which rows dbt should merge in the data warehouse."
      }
    ],
    "run": {
      "dbtVersion": "1.11",
      "commands": [
        "cd dbt-sandbox/exp-108; ../.venv/bin/dbt seed --profiles-dir .",
        "../.venv/bin/dbt run --select mb --full-refresh --vars '{}' --profiles-dir .   (event_time, begin, batch_size set; no unique_key, no lookback)",
        "same command with --vars '{with_event_time: false}', '{with_begin: false}', '{with_batch_size: false}'"
      ],
      "observed": "Baseline: 'Batch 1 of 314 OK created batch 2025-12-30 of main.mb' (runs with no unique_key or lookback on DuckDB). Without event_time: \"Microbatch model 'mb' must provide an 'event_time' (string) config\". Without begin: \"must provide a 'begin' (datetime) config\". Without batch_size: \"must provide a 'batch_size' config that is one of ['hour', 'day', 'month', 'year'], but got: None.\""
    }
  },
  "109": {
    "quotes": [
      {
        "page": "dispatch (config)",
        "url": "https://docs.getdbt.com/reference/project-configs/dispatch-config",
        "text": "Optionally override the [dispatch](https://docs.getdbt.com/reference/dbt-jinja-functions/dispatch.md) search locations for macros in certain namespaces."
      },
      {
        "page": "About dispatch config",
        "url": "https://docs.getdbt.com/reference/dbt-jinja-functions/dispatch",
        "text": "When dbt goes to dispatch `dbt_utils.concat`, it knows from the `macro_namespace` argument to search in the `dbt_utils` namespace."
      },
      {
        "page": "About dispatch config",
        "url": "https://docs.getdbt.com/reference/dbt-jinja-functions/dispatch",
        "text": "If a package name is included in the `search_order` of a project-level `dispatch` config, dbt expects that package to contain macros which are viable candidates for dispatching."
      }
    ]
  },
  "110": {
    "quotes": [
      {
        "page": "Defer",
        "url": "https://docs.getdbt.com/reference/node-selection/defer",
        "text": "When `--defer` is enabled, dbt resolves `ref`(Applies to dbt v1.11 and later) and `function` calls using the state manifest instead, but only if:"
      },
      {
        "page": "Defer",
        "url": "https://docs.getdbt.com/reference/node-selection/defer",
        "text": "Defer requires a manifest from a previous dbt invocation."
      },
      {
        "page": "Defer",
        "url": "https://docs.getdbt.com/reference/node-selection/defer",
        "text": "without having to first build their upstream parents."
      }
    ]
  },
  "111": {
    "quotes": [
      {
        "page": "Custom schemas",
        "url": "https://docs.getdbt.com/docs/build/custom-schemas",
        "text": "dbt generates the schema name for a model by appending the custom schema to the target schema. For example, `<target_schema>_<custom_schema>`."
      },
      {
        "page": "Custom schemas",
        "url": "https://docs.getdbt.com/docs/build/custom-schemas",
        "text": "However, dbt puts it in a schema like `<target_schema>_marketing`."
      },
      {
        "page": "Custom schemas",
        "url": "https://docs.getdbt.com/docs/build/custom-schemas",
        "text": "A common customization is to use the custom schema in production when provided, with the target schema serving only as a fallback if no custom schema is specified."
      }
    ]
  },
  "112": {
    "quotes": [
      {
        "page": "Add snapshots to your DAG",
        "url": "https://docs.getdbt.com/docs/build/snapshots",
        "text": "The `timestamp` strategy uses an `updated_at` field to determine if a row has changed."
      },
      {
        "page": "Add snapshots to your DAG",
        "url": "https://docs.getdbt.com/docs/build/snapshots",
        "text": "This strategy works by comparing a list of columns between their current and historical values."
      },
      {
        "page": "Add snapshots to your DAG",
        "url": "https://docs.getdbt.com/docs/build/snapshots",
        "text": "The `check` snapshot strategy can be configured to track changes to *all* columns by supplying `check_cols = 'all'`."
      },
      {
        "page": "Add snapshots to your DAG",
        "url": "https://docs.getdbt.com/docs/build/snapshots",
        "text": "If `updated_at` is configured, the `check` strategy uses this column instead, as with the timestamp strategy."
      }
    ]
  },
  "114": {
    "quotes": [
      {
        "page": "Platform-specific data types",
        "url": "https://docs.getdbt.com/reference/resource-properties/data-types",
        "text": "json_field: '{\"bar\": \"baz\", \"balance\": 7.77, \"active\": false}'"
      },
      {
        "page": "Platform-specific data types",
        "url": "https://docs.getdbt.com/reference/resource-properties/data-types",
        "text": "dbt takes the value you provide and attempts to cast it to the data type as inferred from the input and output models."
      },
      {
        "page": "Unit test overrides",
        "url": "https://docs.getdbt.com/reference/resource-properties/unit-test-overrides",
        "text": "When configuring your unit test, you can override the output of [macros](https://docs.getdbt.com/docs/build/jinja-macros.md#macros), [project variables](https://docs.getdbt.com/docs/build/project-variables.md), or [environment variables](https://docs.getdbt.com/docs/build/environment-variables.md) for a given unit test."
      }
    ]
  },
  "115": {
    "quotes": [
      {
        "page": "contract",
        "url": "https://docs.getdbt.com/reference/resource-configs/contract",
        "text": "When you `dbt run` your model, *before* dbt has materialized it as a table in the database, you will see this error:"
      },
      {
        "page": "contract",
        "url": "https://docs.getdbt.com/reference/resource-configs/contract",
        "text": "`incremental` — with `on_schema_change: append_new_columns` or `on_schema_change: fail`"
      },
      {
        "page": "Model contracts",
        "url": "https://docs.getdbt.com/docs/mesh/govern/model-contracts",
        "text": "If the model's logic or input data doesn't conform to that shape, the model does not build."
      }
    ],
    "run": {
      "dbtVersion": "1.11",
      "commands": [
        "cd dbt-sandbox/exp-115; ../.venv/bin/dbt run --profiles-dir .   (incremental model inc_contract, contract enforced: id integer, label varchar; on_schema_change: fail)",
        "../.venv/bin/dbt run --vars '{bad: true}' --profiles-dir .   (second run, table exists, query now returns label as integer)",
        "../.venv/bin/dbt show --inline \"select column_name, data_type from information_schema.columns where table_name='inc_contract'\" --profiles-dir ."
      ],
      "observed": "Run 1: OK created sql incremental model main.inc_contract. Run 2 (incremental): 'This model has an enforced contract that failed. ... | label | INTEGER | VARCHAR | data type mismatch |'. Table afterwards: id INTEGER, label VARCHAR, row (1, ok) unchanged."
    }
  },
  "116": {
    "quotes": [
      {
        "page": "query-comment",
        "url": "https://docs.getdbt.com/reference/project-configs/query-comment",
        "text": "Note: The `var()` function in `query-comment` macros only access variables passed through the `--vars` argument in the CLI. Variables defined in the vars block of your `dbt_project.yml` are not accessible when generating query comments."
      },
      {
        "page": "query-comment",
        "url": "https://docs.getdbt.com/reference/project-configs/query-comment",
        "text": "* `append` (optional, default=`false`): Whether a comment should be appended (added to the bottom of a query) or not (i.e. added to the top of a query)."
      },
      {
        "page": "query-comment",
        "url": "https://docs.getdbt.com/reference/project-configs/query-comment",
        "text": "A dictionary representation of the parsed node object. Use `node.unique_id`, `node.database`, `node.schema`, and so on."
      }
    ]
  },
  "117": {
    "quotes": [
      {
        "page": "About profiles.yml",
        "url": "https://docs.getdbt.com/docs/local/profiles.yml",
        "text": "Use environment variables to keep sensitive credentials out of your `profiles.yml` file."
      },
      {
        "page": "About env_var function",
        "url": "https://docs.getdbt.com/reference/dbt-jinja-functions/env_var",
        "text": "The `env_var` function can be used to incorporate environment variables from the system into your dbt project."
      }
    ]
  },
  "118": {
    "quotes": [
      {
        "page": "Configure incremental models",
        "url": "https://docs.getdbt.com/docs/build/incremental-models",
        "text": "`sync_all_columns`: Adds any new columns to the existing table, and removes any columns that are now missing."
      },
      {
        "page": "Configure incremental models",
        "url": "https://docs.getdbt.com/docs/build/incremental-models",
        "text": "`append_new_columns`: Append new columns to the existing table. Note that this setting does *not* remove columns from the existing table that are not present in the new data."
      },
      {
        "page": "Configure incremental models",
        "url": "https://docs.getdbt.com/docs/build/incremental-models",
        "text": "`fail`: Triggers an error message when the source and target schemas diverge"
      }
    ]
  },
  "119": {
    "quotes": [
      {
        "page": "Using threads",
        "url": "https://docs.getdbt.com/docs/running-a-dbt-project/using-threads",
        "text": "Specifying `threads: 4` means that dbt will work on *up to* 4 models at once without violating dependencies"
      },
      {
        "page": "Using threads",
        "url": "https://docs.getdbt.com/docs/running-a-dbt-project/using-threads",
        "text": "The number of concurrent queries your database will allow you to run may be a limiting factor in how many models can be actively built – some models may queue while waiting for an available query slot."
      },
      {
        "page": "Using threads",
        "url": "https://docs.getdbt.com/docs/running-a-dbt-project/using-threads",
        "text": "You can use a different number of threads than the value defined in your target by using the `--threads` option when executing a dbt command."
      },
      {
        "page": "Using threads",
        "url": "https://docs.getdbt.com/docs/running-a-dbt-project/using-threads",
        "text": "You will define the number of threads in your `profiles.yml` file (when developing locally with dbt v1 and dbt v2), dbt job definition, and dbt development credentials under your profile."
      }
    ]
  },
  "120": {
    "quotes": [
      {
        "page": "severity, error_if, and warn_if",
        "url": "https://docs.getdbt.com/reference/resource-configs/severity",
        "text": "Tests return a number of failures—most often, this is the count of rows returned by the test query, but it could be a [custom calculation](https://docs.getdbt.com/reference/resource-configs/fail_calc.md)."
      },
      {
        "page": "severity, error_if, and warn_if",
        "url": "https://docs.getdbt.com/reference/resource-configs/severity",
        "text": "Conditional expressions can be any comparison logic that is supported by your SQL syntax with an integer number of failures: `> 5`, `= 0`, `between 5 and 10`, and so on."
      }
    ]
  },
  "121": {
    "quotes": [
      {
        "page": "Model contracts",
        "url": "https://docs.getdbt.com/docs/mesh/govern/model-contracts",
        "text": "1. dbt will run a \"preflight\" check to ensure that the model's query will return a set of columns with names and data types matching the ones you have defined. This check is agnostic to the order of columns specified in your model (SQL) or YAML spec."
      },
      {
        "page": "Model contracts",
        "url": "https://docs.getdbt.com/docs/mesh/govern/model-contracts",
        "text": "2. dbt will include the column names, data types, and constraints in the DDL statements it submits to the data platform, which will be enforced while building or updating the model's table, and order the columns per the contract instead of your dbt model."
      }
    ]
  },
  "122": {
    "quotes": [
      {
        "page": "contract",
        "url": "https://docs.getdbt.com/reference/resource-configs/contract",
        "text": "* `incremental` — with `on_schema_change: append_new_columns` or `on_schema_change: fail`"
      },
      {
        "page": "contract",
        "url": "https://docs.getdbt.com/reference/resource-configs/contract",
        "text": "Why `append_new_columns` (or `fail`) rather than `sync_all_columns`? Because removing existing columns is a breaking change for contracted models!"
      }
    ],
    "run": {
      "dbtVersion": "1.11",
      "commands": [
        "cd dbt-sandbox/exp-a-122 && ../.venv/bin/dbt run --profiles-dir .  (fct_orders: materialized incremental, contract enforced, no on_schema_change)",
        "same with on_schema_change: sync_all_columns",
        "same with on_schema_change: append_new_columns"
      ],
      "observed": "No on_schema_change: 'Encountered an error: Invalid value for on_schema_change: ignore. Models materialized as incremental with contracts enabled must set on_schema_change to 'append_new_columns' or 'fail'' right after 'Starting full parse', no model started. sync_all_columns: same error with 'Invalid value for on_schema_change: sync_all_columns'. append_new_columns: 'OK created sql incremental model a_122.fct_orders', PASS=1."
    }
  },
  "123": {
    "quotes": [
      {
        "page": "latest_version",
        "url": "https://docs.getdbt.com/reference/resource-properties/latest_version",
        "text": "1. Resolving `ref()` calls to this model that are \"unpinned\" (a version is not explicitly specified)"
      },
      {
        "page": "latest_version",
        "url": "https://docs.getdbt.com/reference/resource-properties/latest_version",
        "text": "If not specified for a versioned model, `latest_version` defaults to the largest [version identifier](https://docs.getdbt.com/reference/resource-properties/versions.md#v): numerically greatest (if all version identifiers are numeric)"
      },
      {
        "page": "latest_version",
        "url": "https://docs.getdbt.com/reference/resource-properties/latest_version",
        "text": "In this case, the `latest_version` is explicitly set to `2`. Any unpinned references will resolve to `model_name.v2`. `v3` is considered \"prerelease\", and `v1` is considered \"old\"."
      }
    ]
  },
  "124": {
    "quotes": [
      {
        "page": "constraints",
        "url": "https://docs.getdbt.com/reference/resource-properties/constraints",
        "text": "* **You enforce a contract** — To use constraints, your model must declare and enforce a [contract](https://docs.getdbt.com/reference/resource-configs/contract.md). This means you need to explicitly define the `data_type` for every column in your model's schema configuration."
      },
      {
        "page": "constraints",
        "url": "https://docs.getdbt.com/reference/resource-properties/constraints",
        "text": "Constraints are a feature of many data platforms. When specified, the platform will perform additional validation on data as it is being populated in a new table or inserted into a preexisting table."
      }
    ],
    "run": {
      "dbtVersion": "1.11",
      "commands": [
        "cd dbt-sandbox/exp-a-124 && ../.venv/bin/dbt run --profiles-dir .  (Postgres, schema a_124; YAML as in the question, no contract; SQL returns ids 1, null, 1)",
        "psql: select count(*), count(customer_id) from a_124.dim_customers; select conname from pg_constraint ... where nspname='a_124'",
        "add contract: {enforced: true} and rerun"
      ],
      "observed": "Without contract: 'OK created sql table model a_124.dim_customers ... SELECT 3', Done. PASS=1 WARN=0 ERROR=0; table has 3 rows, 2 non-null ids; no constraints in pg_constraint; target/run SQL has no 'not null' or 'primary key'. With contract enforced: DDL contains 'customer_id int not null primary key,' and the run fails: 'null value in column \"customer_id\" of relation \"dim_customers__dbt_tmp\" violates not-null constraint'."
    }
  },
  "125": {
    "quotes": [
      {
        "page": "Model versions",
        "url": "https://docs.getdbt.com/docs/mesh/govern/model-versions",
        "text": "**Where will they be materialized?** Each model version will create a database relation with alias `<model_name>_v<v>`. In this case: `dim_customers_v1` and `dim_customers_v2`."
      },
      {
        "page": "Model versions",
        "url": "https://docs.getdbt.com/docs/mesh/govern/model-versions",
        "text": "It's also possible to define the \"latest\" version in `dim_customers.sql` (no suffix), without additional configuration."
      }
    ]
  },
  "126": {
    "quotes": [
      {
        "page": "About behavior changes",
        "url": "https://docs.getdbt.com/reference/global-configs/behavior-changes",
        "text": "These flags *must* be set in the `flags` dictionary in `dbt_project.yml`. They configure behaviors closely tied to project code, which means they should be defined in version control and modified through pull or merge requests, with the same testing and peer review."
      },
      {
        "page": "Upgrading to v1.8",
        "url": "https://docs.getdbt.com/docs/dbt-versions/dbt-upgrade/upgrading-to-v1.8",
        "text": "Custom defaults of [global config flags](https://docs.getdbt.com/reference/global-configs/about-global-configs.md) should be set in the `flags` dictionary in [`dbt_project.yml`](https://docs.getdbt.com/reference/dbt_project.yml.md), instead of in [`profiles.yml`](https://docs.getdbt.com/docs/local/profiles.yml.md). Support for `profiles.yml` has been deprecated."
      },
      {
        "page": "Project variables",
        "url": "https://docs.getdbt.com/docs/build/project-variables",
        "text": "dbt provides a mechanism called [variables](https://docs.getdbt.com/reference/dbt-jinja-functions/var.md) to provide data to models for compilation. Variables allow you to define configurable values for your project instead of hardcoding them in SQL."
      }
    ]
  },
  "127": {
    "quotes": [
      {
        "page": "Failures in on-run-start hooks",
        "url": "https://docs.getdbt.com/reference/global-configs/behavior-flags/skip_nodes_if_on_run_start_fails",
        "text": "Starting in dbt v1.12, `skip_nodes_if_on_run_start_fails` defaults to `true`, skipping all selected resources if there is a failure on an `on-run-start` hook."
      },
      {
        "page": "Upgrading to v1.9",
        "url": "https://docs.getdbt.com/docs/dbt-versions/dbt-upgrade/upgrading-to-v1.9",
        "text": "(Introduced, disabled by default) [`skip_nodes_if_on_run_start_fails` project config flag](https://docs.getdbt.com/reference/global-configs/behavior-flags/skip_nodes_if_on_run_start_fails.md). If the flag is set and **any** `on-run-start` hook fails, mark all selected nodes as skipped."
      }
    ],
    "run": {
      "dbtVersion": "1.11",
      "commands": [
        "cd dbt-sandbox/exp-a-127 && ../.venv/bin/dbt run --profiles-dir .  (DuckDB; on-run-start: insert into audit.run_log values (1); two models; no flags:)",
        "add flags: {skip_nodes_if_on_run_start_fails: true} and rerun"
      ],
      "observed": "Default: '1 of 1 ERROR hook: sandbox.on-run-start.0', then 'OK created sql view model main.stg_orders' and 'OK created sql view model main.fct_orders'; summary 'Completed with 1 error ... Failure in operation sandbox-on-run-start-0'; Done. PASS=2 WARN=0 ERROR=1 SKIP=0. Hook started once ('1 of 1 START hook'). With the flag true: both models 'SKIP', Done. PASS=0 ERROR=1 SKIP=2."
    }
  },
  "128": {
    "quotes": [
      {
        "page": "About the --sample flag",
        "url": "https://docs.getdbt.com/docs/build/sample-flag",
        "text": "When used, sample mode generates filtered refs and sources. Since it's using time-based sampling, if you have refs like `{{ ref('some_model') }}` being sampled, you need to set [`event_time`](https://docs.getdbt.com/reference/resource-configs/event-time.md) for `some_model` to the field that will be used as the timestamp."
      }
    ],
    "run": {
      "dbtVersion": "1.11",
      "commands": [
        "cd dbt-sandbox/exp-a-128 && ../.venv/bin/dbt seed --profiles-dir . && ../.venv/bin/dbt run --profiles-dir .  (DuckDB; stg_orders has event_time: ordered_at, stg_customers none; 3 rows each)",
        "../.venv/bin/dbt run --profiles-dir . --select fct_counts --sample=\"3 days\"  (fct_counts counts rows of both refs)"
      ],
      "observed": "Compiled SQL: (select * from \"dev\".\"main\".\"stg_orders\" where ordered_at >= '2026-11-06 00:02:44...' and ordered_at < '2026-11-09 00:02:44...') and, unchanged, \"dev\".\"main\".\"stg_customers\". Result: n_orders 1 (of 3), n_customers 3 (of 3). Done. PASS=1 ERROR=0."
    }
  },
  "131": {
    "quotes": [
      {
        "page": "Failing fast",
        "url": "https://docs.getdbt.com/reference/global-configs/failing-fast",
        "text": "Supply the `-x` or `--fail-fast` flag to `dbt run`, `dbt build`, or `dbt test` to make dbt exit immediately on the first failure."
      },
      {
        "page": "Failing fast",
        "url": "https://docs.getdbt.com/reference/global-configs/failing-fast",
        "text": "If other models are in-progress when the first failure happens, then dbt will terminate the connections for these still-running models."
      }
    ]
  },
  "132": {
    "quotes": [
      {
        "page": "About dbt clone command",
        "url": "https://docs.getdbt.com/reference/commands/clone",
        "text": "* If your data platform supports zero-copy cloning of tables (Snowflake, Databricks, or BigQuery), and this model exists as a table in the source environment, dbt will create it in your target environment as a clone."
      },
      {
        "page": "About dbt clone command",
        "url": "https://docs.getdbt.com/reference/commands/clone",
        "text": "* Otherwise, dbt will create a simple pointer view (`select * from` the source object)"
      }
    ]
  },
  "133": {
    "quotes": [
      {
        "page": "About dbt clone command",
        "url": "https://docs.getdbt.com/reference/commands/clone",
        "text": "* By default, `dbt clone` will not recreate pre-existing relations in the current target. To override this, use the `--full-refresh` flag."
      }
    ]
  },
  "134": {
    "quotes": [],
    "run": {
      "dbtVersion": "1.11",
      "commands": [
        "cd dbt-sandbox/exp-b-134 (Postgres, schema b_134; fct_daily_revenue materialized='table', 7 rows for 2026-11-01..07)",
        "../.venv/bin/dbt run --profiles-dir .",
        "psql: select count(*), max(revenue_date) from b_134.fct_daily_revenue",
        "edit model to divide by zero on 2026-11-08, then ../.venv/bin/dbt run --profiles-dir .",
        "psql: select count(*), max(revenue_date) from b_134.fct_daily_revenue; list relations in b_134"
      ],
      "observed": "First run: 'OK created sql table model b_134.fct_daily_revenue [SELECT 7]', 7 rows, max 2026-11-07. Second run: 'ERROR creating sql table model b_134.fct_daily_revenue', 'division by zero', exit 1. Afterwards the table still has 7 rows, max 2026-11-07, and fct_daily_revenue is the only relation in b_134. logs/dbt.log shows 'create table \"sandbox\".\"b_134\".\"fct_daily_revenue__dbt_tmp\"' and, on the successful run, 'alter table ... \"fct_daily_revenue__dbt_tmp\" rename to \"fct_daily_revenue\"'."
    }
  },
  "135": {
    "quotes": [
      {
        "page": "Warnings",
        "url": "https://docs.getdbt.com/reference/global-configs/warnings",
        "text": "Enabling `WARN_ERROR` config or setting the `--warn-error` flag will convert *all* dbt warnings into errors."
      },
      {
        "page": "Warnings",
        "url": "https://docs.getdbt.com/reference/global-configs/warnings",
        "text": "Examples include `--select` criteria that selects no resources, deprecations, configurations with no associated models, invalid test configurations, or tests and freshness checks that are configured to return warnings."
      },
      {
        "page": "About dbt build command",
        "url": "https://docs.getdbt.com/reference/commands/build",
        "text": "**Skipping on failures:** Tests on upstream resources will block downstream resources from running, and a test failure will cause those downstream resources to skip entirely."
      }
    ],
    "run": {
      "dbtVersion": "1.11",
      "commands": [
        "cd dbt-sandbox/exp-b-135 (DuckDB; stg_orders has one null order_id, not_null test with config severity: warn; fct_orders selects from stg_orders)",
        "../.venv/bin/dbt build --profiles-dir . -s stg_orders+",
        "../.venv/bin/dbt build --warn-error --profiles-dir . -s stg_orders+"
      ],
      "observed": "Without the flag: '2 of 3 WARN 1 not_null_stg_orders_order_id', '3 of 3 OK created sql view model main.fct_orders', 'Done. PASS=2 WARN=1 ERROR=0 SKIP=0', exit 0. With --warn-error: '2 of 3 FAIL 1 not_null_stg_orders_order_id', '3 of 3 SKIP relation main.fct_orders', 'Done. PASS=1 WARN=0 ERROR=1 SKIP=1', exit 1."
    }
  },
  "136": {
    "quotes": [
      {
        "page": "About dbt retry command",
        "url": "https://docs.getdbt.com/reference/commands/retry",
        "text": "Retry re-executes the last invocation from the point of failure."
      },
      {
        "page": "About dbt retry command",
        "url": "https://docs.getdbt.com/reference/commands/retry",
        "text": "* If the previously executed command completed successfully, retry will finish as `no operation`."
      },
      {
        "page": "About dbt retry command",
        "url": "https://docs.getdbt.com/reference/commands/retry",
        "text": "Retry references [run\\_results.json](https://docs.getdbt.com/reference/artifacts/run-results-json.md) to determine where to start."
      }
    ],
    "run": {
      "dbtVersion": "1.11",
      "commands": [
        "cd dbt-sandbox/exp-b-136 (DuckDB; int_orders selects a missing column amount_usd; fct_orders refs int_orders)",
        "../.venv/bin/dbt build --profiles-dir .",
        "../.venv/bin/dbt compile --profiles-dir .",
        "fix int_orders (select amount instead of amount_usd)",
        "../.venv/bin/dbt retry --profiles-dir ."
      ],
      "observed": "Build: '3 of 7 ERROR creating sql table model main.int_orders', '5 of 7 SKIP relation main.fct_orders', exit 1. Compile: exit 0; target/run_results.json then has args.which = 'compile' and all 7 nodes 'success'. Retry: 'Nothing to do. Try checking your model configs and model specification args', exit 0; int_orders and fct_orders absent from dev.duckdb. Control: after a failed build followed by dbt ls (which does not write run_results.json), dbt retry ran '1 of 2 ... int_orders' and '2 of 2 SKIP relation main.fct_orders'."
    }
  },
  "137": {
    "quotes": [
      {
        "page": "Caveats to state comparison",
        "url": "https://docs.getdbt.com/reference/node-selection/state-comparison-caveats",
        "text": "dbt stores a file hash of seed files that are <1 MiB in size. If the contents of these seeds is modified, the seed will be included in `state:modified`."
      },
      {
        "page": "Caveats to state comparison",
        "url": "https://docs.getdbt.com/reference/node-selection/state-comparison-caveats",
        "text": "If a seed file is >1 MiB in size, dbt cannot compare its contents and will raise a warning as such. Instead, dbt will use only the seed's file path to detect changes."
      }
    ]
  },
  "138": {
    "quotes": [
      {
        "page": "Caveats to state comparison",
        "url": "https://docs.getdbt.com/reference/node-selection/state-comparison-caveats",
        "text": "If a model uses a `var` or `env_var` in its definition, dbt is unable to identify that lineage in such a way that it can include the model in `state:modified` because the `var` or `env_var` value has changed."
      }
    ]
  },
  "139": {
    "quotes": [
      {
        "page": "Exit codes",
        "url": "https://docs.getdbt.com/reference/exit-codes",
        "text": "When dbt exits, it will return an exit code of either 0, 1, or 2."
      },
      {
        "page": "Exit codes",
        "url": "https://docs.getdbt.com/reference/exit-codes",
        "text": "The dbt invocation completed with at least one handled error (eg. model syntax error, bad permissions, etc). The run was completed, but some models may have been skipped."
      },
      {
        "page": "Exit codes",
        "url": "https://docs.getdbt.com/reference/exit-codes",
        "text": "The dbt invocation completed with an unhandled error (eg. ctrl-c, network interruption, etc)."
      }
    ]
  },
  "141": {
    "quotes": [
      {
        "page": "Configure state selection",
        "url": "https://docs.getdbt.com/reference/node-selection/configure-state",
        "text": "After executing `dbt source freshness`, for example, dbt creates the `sources.json` artifact which contains execution times and `max_loaded_at` dates for dbt sources."
      },
      {
        "page": "Configure state selection",
        "url": "https://docs.getdbt.com/reference/node-selection/configure-state",
        "text": "The `dbt source freshness` command produces a `sources.json` artifact whose results can be referenced in subsequent dbt invocations."
      }
    ],
    "run": {
      "dbtVersion": "1.11",
      "commands": [
        "psql: create table c_141_raw.orders/events/payments with loaded_at 2h, 18h and 30h old",
        "cd dbt-sandbox/exp-c-141 && rm -rf target && ../.venv/bin/dbt source freshness --profiles-dir . && ls target"
      ],
      "observed": "Running with dbt=1.11.17 ... 1 of 3 WARN freshness of shop.events / 3 of 3 ERROR STALE freshness of shop.payments / 2 of 3 PASS freshness of shop.orders. ls target: graph.gpickle graph_summary.json manifest.json partial_parse.msgpack semantic_manifest.json sources.json (no run_results.json, no freshness.json). sources.json results carry status and max_loaded_at per source."
    }
  },
  "142": {
    "quotes": [
      {
        "page": "freshness",
        "url": "https://docs.getdbt.com/reference/resource-configs/freshness",
        "text": "sources:\n  <resource-path>:\n    +freshness:\n      warn_after:\n        count: <positive_integer>\n        period: minute | hour | day"
      },
      {
        "page": "freshness",
        "url": "https://docs.getdbt.com/reference/resource-configs/freshness",
        "text": "One or both of `warn_after` and `error_after` can be provided. If neither is set, dbt will not check freshness for that resource."
      }
    ],
    "run": {
      "dbtVersion": "1.11",
      "commands": [
        "exp-c-141: dbt_project.yml `sources: sandbox: +freshness: warn_after: {count: 1, period: hour}`; models/sources.yml source `shop` with `config: loaded_at_field: loaded_at` and no freshness; c_141_raw.orders loaded_at = now() - 2 hours",
        "../.venv/bin/dbt source freshness --profiles-dir ."
      ],
      "observed": "Found 1 model, 1 seed, 3 sources ... 2 of 3 WARN freshness of shop.orders ........ [WARN in 0.02s]; events (18h) and payments (30h) also WARN, none ERROR."
    }
  },
  "143": {
    "quotes": [
      {
        "page": "Add sources to your DAG",
        "url": "https://docs.getdbt.com/docs/build/sources",
        "text": "Additionally, the `loaded_at_field` is required to calculate freshness for a table (except for cases where dbt can leverage warehouse metadata to calculate freshness)."
      }
    ],
    "run": {
      "dbtVersion": "1.11",
      "commands": [
        "exp-c-141: models/sources.yml exactly as the stem (source shop in schema c_141_raw, freshness at source level, loaded_at_field only on orders); orders loaded_at 2 hours old",
        "dbt source freshness --project-dir exp-c-141 --profiles-dir exp-c-141"
      ],
      "observed": "Parse warning: The configured adapter does not support metadata-based freshness. A loaded_at_field must be specified for source 'shop.events'. Then: 1 of 2 ERROR freshness of shop.events / 2 of 2 PASS freshness of shop.orders / Runtime Error in source events (models/sources.yml): Could not compute freshness for source events: no 'loaded_at_field' provided and postgres adapter does not support metadata-based freshness checks."
    }
  },
  "144": {
    "quotes": [
      {
        "page": "Exposure properties",
        "url": "https://docs.getdbt.com/reference/exposure-properties",
        "text": "You can define project-level configs for exposures in the `dbt_project.yml` file under the `exposures:` key using the `+` prefix. Currently, only the [`enabled` config](https://docs.getdbt.com/reference/resource-configs/enabled.md) is supported:"
      },
      {
        "page": "Exposure properties",
        "url": "https://docs.getdbt.com/reference/exposure-properties",
        "text": "Exposure properties are \"special properties\" in that you can't configure them in the `dbt_project.yml` file or using `config()` blocks."
      }
    ]
  },
  "145": {
    "quotes": [
      {
        "page": "Python models",
        "url": "https://docs.getdbt.com/docs/build/python-models",
        "text": "Python models can't be materialized as `view` or `ephemeral`."
      },
      {
        "page": "Python models",
        "url": "https://docs.getdbt.com/docs/build/python-models",
        "text": "Python models support these materializations:\n\n* `table` (default)\n* `incremental`"
      }
    ]
  },
  "146": {
    "quotes": [
      {
        "page": "grants",
        "url": "https://docs.getdbt.com/reference/resource-configs/grants",
        "text": "When you set `grants` for the same model in multiple places, such as in `dbt_project.yml` and in a more-specific `.sql` or `.yml` file, dbt's default behavior replaces the less-specific set of grantees with the more-specific set of grantees."
      },
      {
        "page": "grants",
        "url": "https://docs.getdbt.com/reference/resource-configs/grants",
        "text": "As a result of this configuration, `specific_model` will be configured to grant the `select` privilege to `user_c` *only*."
      },
      {
        "page": "grants",
        "url": "https://docs.getdbt.com/reference/resource-configs/grants",
        "text": "When you `run` a model, `seed` data, or `snapshot` a dataset, dbt will run `grant` and/or `revoke` statements to ensure that the permissions on the database object match the `grants` you have configured on the resource."
      }
    ]
  },
  "147": {
    "quotes": [
      {
        "page": "Add snapshots to your DAG",
        "url": "https://docs.getdbt.com/docs/build/snapshots",
        "text": "In this example, the `hard_deletes: new_record` config will add a new row for deleted records with the `dbt_is_deleted` column set to `True`. Any restored records are added as new rows with the `dbt_is_deleted` field set to `False`."
      },
      {
        "page": "hard_deletes",
        "url": "https://docs.getdbt.com/reference/resource-configs/hard-deletes",
        "text": "By default, if you don’t specify `hard_deletes`, it'll automatically default to `ignore`. Deleted rows will not be tracked and their `dbt_valid_to` column remains `NULL`."
      },
      {
        "page": "hard_deletes",
        "url": "https://docs.getdbt.com/reference/resource-configs/hard-deletes",
        "text": "| `invalidate`       | Behaves the same as the existing `invalidate_hard_deletes=true`, where deleted records are invalidated by setting `dbt_valid_to` to current time."
      }
    ]
  },
  "148": {
    "quotes": [
      {
        "page": "About incremental strategy",
        "url": "https://docs.getdbt.com/docs/build/incremental-strategy",
        "text": "The `delete+insert` strategy deletes the data for the `unique_key` from the target table and then inserts the data for those with a `unique_key`, which may be less efficient for larger datasets. It ensures updated records are fully replaced, avoiding partial updates and can be useful when a `unique_key` isn't truly unique or when `merge` is unsupported."
      },
      {
        "page": "About incremental strategy",
        "url": "https://docs.getdbt.com/docs/build/incremental-strategy",
        "text": "The `append` strategy is simple to implement and has low processing costs. It inserts selected records into the destination table without updating or deleting existing data."
      }
    ],
    "run": {
      "dbtVersion": "1.11",
      "commands": [
        "exp-c-148 (Postgres): python3 exp-c-148/run_strategies.py. For each strategy: recreate c_148_raw.events with days 2026-01-01 (events 1, 2) and 2026-01-02 (events 3, 4); dbt run --vars \"{strategy: '<s>'}\" (model as in the snippet with incremental_strategy=var('strategy')); then update day 2 amounts (+1) and insert event 5 on day 2; dbt run again; select the model."
      ],
      "observed": "append: 7 rows, events 3 and 4 duplicated (30/31, 40/41). merge: second run ERROR, Database Error in model fct_daily_events: MERGE command cannot affect row a second time. delete+insert: 5 rows, day 2 = (3, 31), (4, 41), (5, 50). insert_overwrite: Runtime Error: The incremental strategy 'insert_overwrite' is not valid for this adapter."
    }
  },
  "149": {
    "quotes": [
      {
        "page": "About microbatch incremental models",
        "url": "https://docs.getdbt.com/docs/build/incremental-microbatch",
        "text": "During standard incremental runs, dbt will process batches according to the current timestamp and the configured `lookback`, with one query per batch."
      },
      {
        "page": "lookback",
        "url": "https://docs.getdbt.com/reference/resource-configs/lookback",
        "text": "Set the `lookback` to an integer greater than or equal to zero. The default value is `1`."
      }
    ],
    "run": {
      "dbtVersion": "1.11",
      "commands": [
        "exp-c-150 (Postgres, threads 1): c_150_raw.page_views with event_time viewed_at, rows every 6 hours from 2026-11-01; model exactly as the snippet",
        "dbt run --select fct_page_views (table absent) at 2026-11-09 00:50 UTC",
        "dbt run --select fct_page_views (table exists) at 2026-11-09 00:51 UTC"
      ],
      "observed": "First run: Batch 1 of 9 ... batch 2026-11-01 through Batch 9 of 9 batch 2026-11-09. Second run: Batch 1 of 3 START batch 2026-11-07 / Batch 2 of 3 batch 2026-11-08 / Batch 3 of 3 batch 2026-11-09, all OK."
    }
  },
  "2001": {
    "quotes": [
      {
        "page": "Configure incremental models",
        "url": "https://docs.getdbt.com/docs/build/incremental-models",
        "text": "It will return `True` if *all* of the following conditions are met:"
      },
      {
        "page": "Configure incremental models",
        "url": "https://docs.getdbt.com/docs/build/incremental-models",
        "text": "The model must already exist as a table in the database"
      },
      {
        "page": "Configure incremental models",
        "url": "https://docs.getdbt.com/docs/build/incremental-models",
        "text": "The `full-refresh` flag *is not* passed"
      },
      {
        "page": "about this",
        "url": "https://docs.getdbt.com/reference/dbt-jinja-functions/this",
        "text": "`this` can be thought of as equivalent to `ref('<the_current_model>')`, and is a neat way to avoid circular dependencies."
      }
    ]
  },
  "2002": {
    "quotes": [
      {
        "page": "Configure incremental models",
        "url": "https://docs.getdbt.com/docs/build/incremental-models",
        "text": "`sync_all_columns`: Adds any new columns to the existing table, and removes any columns that are now missing."
      },
      {
        "page": "Configure incremental models",
        "url": "https://docs.getdbt.com/docs/build/incremental-models",
        "text": "`append_new_columns`: Append new columns to the existing table. Note that this setting does *not* remove columns from the existing table that are not present in the new data."
      },
      {
        "page": "Configure incremental models",
        "url": "https://docs.getdbt.com/docs/build/incremental-models",
        "text": "`ignore`: Default behavior (see below)."
      }
    ]
  },
  "2003": {
    "quotes": [
      {
        "page": "About ref function",
        "url": "https://docs.getdbt.com/reference/dbt-jinja-functions/ref",
        "text": "The `ref` function supports an optional keyword argument - `version` (or `v`)."
      },
      {
        "page": "Model versions",
        "url": "https://docs.getdbt.com/docs/mesh/govern/model-versions",
        "text": "By default, the `ref` resolves to the latest version (as declared by that model's maintainer), but you can also `ref` a specific version of the model, with a `version` keyword."
      },
      {
        "page": "Model versions",
        "url": "https://docs.getdbt.com/docs/mesh/govern/model-versions",
        "text": "`ref('dim_customers', v=1)`"
      }
    ]
  },
  "2004": {
    "quotes": [
      {
        "page": "About dbt run command",
        "url": "https://docs.getdbt.com/reference/commands/run",
        "text": "If you provide the `--full-refresh` flag to `dbt run`, dbt will treat incremental models as table models."
      },
      {
        "page": "full_refresh",
        "url": "https://docs.getdbt.com/reference/resource-configs/full_refresh",
        "text": "The `--full-refresh` flag also supports a short name, `-f`."
      }
    ]
  },
  "2005": {
    "quotes": [
      {
        "page": "About dbt show command",
        "url": "https://docs.getdbt.com/reference/commands/show",
        "text": "If previewing a model, dbt will always compile and run the compiled query from source."
      },
      {
        "page": "About dbt show command",
        "url": "https://docs.getdbt.com/reference/commands/show",
        "text": "The results of the preview query are only included in dbt's logs and displayed in the terminal and aren't materialized in the data warehouse or stored in any dbt file"
      },
      {
        "page": "About dbt show command",
        "url": "https://docs.getdbt.com/reference/commands/show",
        "text": "The `--limit` flag modifies the underlying SQL and not just the number of rows displayed."
      }
    ]
  },
  "2006": {
    "quotes": [
      {
        "page": "log",
        "url": "https://docs.getdbt.com/reference/dbt-jinja-functions/log",
        "text": "`info`: If False, write to the log file. If True, write to both the log file and stdout (default=False)"
      }
    ]
  },
  "2007": {
    "quotes": [
      {
        "page": "About dbt run command",
        "url": "https://docs.getdbt.com/reference/commands/run",
        "text": "The `--empty` flag limits the refs and sources to zero rows."
      },
      {
        "page": "About dbt run command",
        "url": "https://docs.getdbt.com/reference/commands/run",
        "text": "dbt will still execute the model SQL against the target data warehouse but will avoid expensive reads of input data."
      }
    ]
  },
  "2008": {
    "quotes": [
      {
        "page": "Add data tests to your DAG",
        "url": "https://docs.getdbt.com/docs/build/data-tests",
        "text": "Some generic data tests need only the test name. Others need extra inputs, which you nest under an `arguments` property (available in v1.10.5 and higher)."
      },
      {
        "page": "Add data tests to your DAG",
        "url": "https://docs.getdbt.com/docs/build/data-tests",
        "text": "Use `arguments:` for inputs to the test macro (for example, `values`, `to`, and `field`)."
      },
      {
        "page": "Add data tests to your DAG",
        "url": "https://docs.getdbt.com/docs/build/data-tests",
        "text": "and `relationships` asserts that each value exists in another model (referential integrity)."
      }
    ]
  },
  "2009": {
    "quotes": [
      {
        "page": "About unit tests property",
        "url": "https://docs.getdbt.com/reference/resource-properties/unit-tests",
        "text": "given: # the mock data for your inputs"
      },
      {
        "page": "About unit tests property",
        "url": "https://docs.getdbt.com/reference/resource-properties/unit-tests",
        "text": "expect: # the expected output given the inputs above"
      }
    ]
  },
  "2010": {
    "quotes": [
      {
        "page": "About the doc function",
        "url": "https://docs.getdbt.com/reference/dbt-jinja-functions/doc",
        "text": "You can specify documentation text in a docs block, then use the `doc()` Jinja function in description fields as a way to reuse the same text in multiple places."
      },
      {
        "page": "About the doc function",
        "url": "https://docs.getdbt.com/reference/dbt-jinja-functions/doc",
        "text": "You can only use the `doc()` Jinja function in properties YAML files for resources with description properties."
      },
      {
        "page": "About documentation",
        "url": "https://docs.getdbt.com/docs/build/documentation",
        "text": "To declare a docs block, use the Jinja `docs` tag."
      },
      {
        "page": "About documentation",
        "url": "https://docs.getdbt.com/docs/build/documentation",
        "text": "Docs blocks provide a robust method for documenting models and other resources using Jinja and markdown. Docs block files can contain arbitrary markdown, but they must be uniquely named."
      }
    ]
  },
  "2011": {
    "quotes": [
      {
        "page": "Node selector methods",
        "url": "https://docs.getdbt.com/reference/node-selection/methods",
        "text": "`state:modified`: All new nodes, plus any changes to existing nodes."
      },
      {
        "page": "Node selector methods",
        "url": "https://docs.getdbt.com/reference/node-selection/methods",
        "text": "The file path of the comparison manifest *must* be specified via the `--state` flag or (Applies to dbt v1.11 and later) `DBT_ENGINE_STATE` environment variable."
      },
      {
        "page": "Defer",
        "url": "https://docs.getdbt.com/reference/node-selection/defer",
        "text": "Defer requires a manifest from a previous dbt invocation."
      },
      {
        "page": "Defer",
        "url": "https://docs.getdbt.com/reference/node-selection/defer",
        "text": "Deferral requires both `--defer` and `--state` to be set, either by passing flags explicitly or by setting environment variables ((Applies to dbt v1.11 and later) `DBT_ENGINE_DEFER` and `DBT_ENGINE_STATE`)."
      },
      {
        "page": "Defer",
        "url": "https://docs.getdbt.com/reference/node-selection/defer",
        "text": "When `--favor-state` is passed, dbt prioritizes node definitions from the `--state` directory."
      },
      {
        "page": "Node selector methods",
        "url": "https://docs.getdbt.com/reference/node-selection/methods",
        "text": "On the other hand, `result:error` selects any resource (models, tests, snapshots, and more) that returned an error."
      }
    ]
  },
  "2012": {
    "quotes": [
      {
        "page": "Connection profiles",
        "url": "https://docs.getdbt.com/docs/local/connection-profiles",
        "text": "`target`: This is the default target your dbt project will use. It must be one of the targets you define in your profile."
      },
      {
        "page": "Connection profiles",
        "url": "https://docs.getdbt.com/docs/local/connection-profiles",
        "text": "To add an additional target (like `prod`) to your existing `profiles.yml`, you can add another entry under the `outputs` key."
      },
      {
        "page": "About profiles.yml",
        "url": "https://docs.getdbt.com/docs/local/profiles.yml",
        "text": "If you do have multiple targets in your profile, and want to use a target other than the default, you can do this using the `--target` flag when running a dbt command."
      }
    ]
  },
  "2013": {
    "quotes": [
      {
        "page": "Model versions",
        "url": "https://docs.getdbt.com/docs/mesh/govern/model-versions",
        "text": "**Where are they defined?** dbt expects each model version to be defined in a file named `<model_name>_v<v>`. In this case: `dim_customers_v1.sql` and `dim_customers_v2.sql`."
      },
      {
        "page": "Model versions",
        "url": "https://docs.getdbt.com/docs/mesh/govern/model-versions",
        "text": "Finally, you can override this convention by setting [`defined_in: any_file_name_you_want`](https://docs.getdbt.com/reference/resource-properties/versions.md#defined_in)—but we strongly encourage you to follow the convention, unless you have a very good reason."
      },
      {
        "page": "Model versions",
        "url": "https://docs.getdbt.com/docs/mesh/govern/model-versions",
        "text": "Following the example, let's say you wanted `dim_customers_v1` to continue populating the database table named `dim_customers`. That's what the table was named previously, and you may have several other dashboards or tools expecting to read its data from `<dbname>.<schemaname>.dim_customers`.\n\nYou could use the `alias` configuration:"
      }
    ]
  },
  "2015": {
    "quotes": [
      {
        "page": "Node selector methods",
        "url": "https://docs.getdbt.com/reference/node-selection/methods",
        "text": "dbt build --select \"source_status:fresher+\" --state path/to/prod/artifacts"
      },
      {
        "page": "Configure state selection",
        "url": "https://docs.getdbt.com/reference/node-selection/configure-state",
        "text": "In your job commands, you can signal dbt to run and test only on the fresher sources and their children by including the `source_status:fresher+` argument. This requires both the previous and current states to have the `sources.json` artifact available."
      }
    ]
  },
  "2016": {
    "quotes": [
      {
        "page": "Clone incremental models as the first step of your CI job",
        "url": "https://docs.getdbt.com/best-practices/clone-incremental-models",
        "text": "1. Clone all of the pre-existing incremental models that have been modified or are downstream of another model that has been modified:"
      },
      {
        "page": "Clone incremental models as the first step of your CI job",
        "url": "https://docs.getdbt.com/best-practices/clone-incremental-models",
        "text": "dbt clone --select state:modified+,config.materialized:incremental,state:old"
      },
      {
        "page": "Node selector methods",
        "url": "https://docs.getdbt.com/reference/node-selection/methods",
        "text": "* `state:old` — A node with the same `unique_id` exists in the comparison manifest"
      }
    ]
  },
  "2017": {
    "quotes": [
      {
        "page": "Python models",
        "url": "https://docs.getdbt.com/docs/build/python-models",
        "text": "It defines a function named **`model()`**, which takes two parameters:"
      },
      {
        "page": "Python models",
        "url": "https://docs.getdbt.com/docs/build/python-models",
        "text": "Use the `dbt.ref()` method within a Python model to read data from other models (SQL or Python). If you want to read directly from a raw source table, use `dbt.source()`."
      },
      {
        "page": "Python models",
        "url": "https://docs.getdbt.com/docs/build/python-models",
        "text": "The `model()` function must return a single DataFrame."
      },
      {
        "page": "Python models",
        "url": "https://docs.getdbt.com/docs/build/python-models",
        "text": "dbt Python models don't use Jinja to render compiled code."
      }
    ]
  },
  "2018": {
    "quotes": [
      {
        "page": "Add snapshots to your DAG",
        "url": "https://docs.getdbt.com/docs/build/snapshots",
        "text": "    relation: relation # source('my_source', 'my_table') or ref('my_model')"
      },
      {
        "page": "Add snapshots to your DAG",
        "url": "https://docs.getdbt.com/docs/build/snapshots",
        "text": "If you need to apply transformations (such as filtering or deduplication), define an ephemeral model first to apply those transformations, and reference it in the snapshot relation field instead of calling `source()` directly."
      },
      {
        "page": "Add snapshots to your DAG",
        "url": "https://docs.getdbt.com/docs/build/snapshots",
        "text": "Developers can still set a custom location with [`schema`](https://docs.getdbt.com/reference/resource-configs/schema.md) and [`database`](https://docs.getdbt.com/reference/resource-configs/database.md) configs, consistent with other resource types."
      }
    ]
  },
  "3001": {
    "quotes": [
      {
        "page": "Materializations",
        "url": "https://docs.getdbt.com/docs/build/materializations",
        "text": "When using the `view` materialization, your model is rebuilt as a view on each run, via a `create view as` statement."
      },
      {
        "page": "Materializations",
        "url": "https://docs.getdbt.com/docs/build/materializations",
        "text": "When using the `table` materialization, your model is rebuilt as a table on each run, via a `create table as` statement."
      },
      {
        "page": "Materializations",
        "url": "https://docs.getdbt.com/docs/build/materializations",
        "text": "`ephemeral` models are not directly built into the database."
      },
      {
        "page": "Materializations",
        "url": "https://docs.getdbt.com/docs/build/materializations",
        "text": "Instead, dbt will interpolate the code from an ephemeral model into its dependent models using a common table expression (CTE)."
      },
      {
        "page": "Materializations",
        "url": "https://docs.getdbt.com/docs/build/materializations",
        "text": "`incremental` models allow dbt to insert or update records into a table since the last time that model was run."
      }
    ]
  },
  "3002": {
    "quotes": [
      {
        "page": "About incremental strategy",
        "url": "https://docs.getdbt.com/docs/build/incremental-strategy",
        "text": "It inserts selected records into the destination table without updating or deleting existing data."
      },
      {
        "page": "About incremental strategy",
        "url": "https://docs.getdbt.com/docs/build/incremental-strategy",
        "text": "Importantly, `append` doesn't check for duplicates or verify whether a record already exists in the destination."
      },
      {
        "page": "About incremental strategy",
        "url": "https://docs.getdbt.com/docs/build/incremental-strategy",
        "text": "If the `unique_key` already exists in the destination table, `merge` will update the record, so you won't have duplicates."
      },
      {
        "page": "About incremental strategy",
        "url": "https://docs.getdbt.com/docs/build/incremental-strategy",
        "text": "The `delete+insert` strategy deletes the data for the `unique_key` from the target table and then inserts the data for those with a `unique_key`, which may be less efficient for larger datasets."
      },
      {
        "page": "About incremental strategy",
        "url": "https://docs.getdbt.com/docs/build/incremental-strategy",
        "text": "is used to efficiently update partitioned tables by replacing entire partitions with new data, rather than merging or updating individual rows."
      },
      {
        "page": "About incremental strategy",
        "url": "https://docs.getdbt.com/docs/build/incremental-strategy",
        "text": "dbt will process the incremental model in multiple queries (or \"batches\") based on a configured `event_time` column."
      }
    ]
  },
  "3003": {
    "quotes": [
      {
        "page": "Graph operators",
        "url": "https://docs.getdbt.com/reference/node-selection/graph-operators",
        "text": "Placed after a model/resource — Includes the resource itself and all its descendants (downstream dependencies)."
      },
      {
        "page": "Graph operators",
        "url": "https://docs.getdbt.com/reference/node-selection/graph-operators",
        "text": "Placed before a model/resource — Includes the resource itself and all its ancestors (upstream dependencies)."
      },
      {
        "page": "Graph operators",
        "url": "https://docs.getdbt.com/reference/node-selection/graph-operators",
        "text": "You can adjust the behavior of the `+` operator by quantifying the number of edges to step through."
      },
      {
        "page": "Graph operators",
        "url": "https://docs.getdbt.com/reference/node-selection/graph-operators",
        "text": "select my_model, its first-degree ancestors (\"parents\"), and its second-degree ancestors (\"grandparents\")"
      },
      {
        "page": "Graph operators",
        "url": "https://docs.getdbt.com/reference/node-selection/graph-operators",
        "text": "select my_model and its first-degree descendants"
      },
      {
        "page": "Graph operators",
        "url": "https://docs.getdbt.com/reference/node-selection/graph-operators",
        "text": "select my_model, its descendants, and the ancestors of its descendants"
      }
    ]
  },
  "3004": {
    "quotes": [
      {
        "page": "About ref function",
        "url": "https://docs.getdbt.com/reference/dbt-jinja-functions/ref",
        "text": "Returns a [Relation](https://docs.getdbt.com/reference/dbt-classes.md#relation) for a [model](https://docs.getdbt.com/docs/build/models.md), [seed](https://docs.getdbt.com/docs/build/seeds.md), or [snapshot](https://docs.getdbt.com/docs/build/snapshots.md)"
      },
      {
        "page": "About ref function",
        "url": "https://docs.getdbt.com/reference/dbt-jinja-functions/ref",
        "text": "Creates dependencies between the referenced node and the current model, which is useful for documentation and [node selection](https://docs.getdbt.com/reference/node-selection/syntax.md)"
      },
      {
        "page": "About source function",
        "url": "https://docs.getdbt.com/reference/dbt-jinja-functions/source",
        "text": "Creates dependencies between a source and the current model, which is useful for documentation and [node selection](https://docs.getdbt.com/reference/node-selection/syntax.md)"
      },
      {
        "page": "Project variables",
        "url": "https://docs.getdbt.com/docs/build/project-variables",
        "text": "The `var()` function retrieves the value defined in your project or passed using `--vars`."
      },
      {
        "page": "About env_var function",
        "url": "https://docs.getdbt.com/reference/dbt-jinja-functions/env_var",
        "text": "The `env_var` function can be used to incorporate environment variables from the system into your dbt project."
      },
      {
        "page": "about this",
        "url": "https://docs.getdbt.com/reference/dbt-jinja-functions/this",
        "text": "`this` is the database representation of the current model."
      },
      {
        "page": "About target variables",
        "url": "https://docs.getdbt.com/reference/dbt-jinja-functions/target",
        "text": "The `target` variable contains information about your connection to the warehouse."
      }
    ],
    "run": {
      "dbtVersion": "1.11",
      "commands": [
        "cd dbt-sandbox/exp-3004 (one model per run: select '{{ env_var(\"EXP_NOPE\") }}'; select '{{ var(\"x\") }}')",
        "../.venv/bin/dbt compile --profiles-dir .  (env_var unset, no default)",
        "../.venv/bin/dbt compile --profiles-dir .  (var x unset)",
        "../.venv/bin/dbt show -s m_var --vars '{x: hello}' --profiles-dir .",
        "../.venv/bin/dbt show -s m_this --profiles-dir ."
      ],
      "observed": "Parsing Error: Env var required but not provided: 'EXP_NOPE'; Compilation Error: Required var 'x' not found in config; --vars gives v = hello; this renders \"dev\".\"main\".\"m_t...\" (the model's own relation)"
    }
  },
  "3005": {
    "quotes": [
      {
        "page": "Manifest JSON file",
        "url": "https://docs.getdbt.com/reference/artifacts/manifest-json",
        "text": "This file contains a full representation of your dbt project's resources (models, tests, macros, and more), including all node configurations and resource properties."
      },
      {
        "page": "Manifest JSON file",
        "url": "https://docs.getdbt.com/reference/artifacts/manifest-json",
        "text": "`parent_map`: Dictionary that contains the first-order parents of each resource"
      },
      {
        "page": "Run results JSON file",
        "url": "https://docs.getdbt.com/reference/artifacts/run-results-json",
        "text": "This file contains information about a completed invocation of dbt, including timing and status info for each node (model, test, etc) that was executed."
      },
      {
        "page": "Catalog JSON file",
        "url": "https://docs.getdbt.com/reference/artifacts/catalog-json",
        "text": "This file contains information from your data warehouse about the tables and views produced and defined by the resources in your project."
      },
      {
        "page": "About dbt artifacts",
        "url": "https://docs.getdbt.com/reference/artifacts/dbt-artifacts",
        "text": "produced by `docs generate`"
      },
      {
        "page": "Node selector methods",
        "url": "https://docs.getdbt.com/reference/node-selection/methods",
        "text": "dbt creates the `sources.json` artifact which contains execution times and `max_loaded_at` dates for dbt sources."
      }
    ]
  },
  "3006": {
    "quotes": [
      {
        "page": "About dbt debug command",
        "url": "https://docs.getdbt.com/reference/commands/debug",
        "text": "`dbt debug` is a utility function to test the database connection and display information for debugging purposes, such as the validity of your project file,"
      },
      {
        "page": "About dbt parse command",
        "url": "https://docs.getdbt.com/reference/commands/parse",
        "text": "The `dbt parse` command parses and validates the contents of your dbt project."
      },
      {
        "page": "About dbt parse command",
        "url": "https://docs.getdbt.com/reference/commands/parse",
        "text": "Since `dbt parse` doesn't connect to your warehouse, [this manifest will not contain any compiled code](https://docs.getdbt.com/faqs/Warehouse/db-connection-dbt-compile.md)."
      },
      {
        "page": "About dbt compile command",
        "url": "https://docs.getdbt.com/reference/commands/compile",
        "text": "`dbt compile` generates executable SQL from source files for:"
      },
      {
        "page": "About dbt compile command",
        "url": "https://docs.getdbt.com/reference/commands/compile",
        "text": "You can find these compiled SQL files in the `target/` directory of your dbt project."
      },
      {
        "page": "About dbt ls (list) command",
        "url": "https://docs.getdbt.com/reference/commands/list",
        "text": "The `dbt ls` command lists resources in your dbt project."
      },
      {
        "page": "About dbt ls (list) command",
        "url": "https://docs.getdbt.com/reference/commands/list",
        "text": "[--output {json,name,path,selector}]"
      },
      {
        "page": "About dbt show command",
        "url": "https://docs.getdbt.com/reference/commands/show",
        "text": "The results of the preview query are only included in dbt's logs and displayed in the terminal and aren't materialized in the data warehouse or stored in any dbt file, except if you use `dbt show --inline`."
      },
      {
        "page": "About dbt clean command",
        "url": "https://docs.getdbt.com/reference/commands/clean",
        "text": "`dbt clean` is a utility function that deletes the paths specified within the [`clean-targets`](https://docs.getdbt.com/reference/project-configs/clean-targets.md) list in the `dbt_project.yml` file."
      }
    ]
  },
  "3007": {
    "quotes": [
      {
        "page": "Failing fast",
        "url": "https://docs.getdbt.com/reference/global-configs/failing-fast",
        "text": "Supply the `-x` or `--fail-fast` flag to `dbt run`, `dbt build`, or `dbt test` to make dbt exit immediately on the first failure."
      },
      {
        "page": "About dbt run command",
        "url": "https://docs.getdbt.com/reference/commands/run",
        "text": "The `--empty` flag limits the refs and sources to zero rows."
      },
      {
        "page": "About dbt run command",
        "url": "https://docs.getdbt.com/reference/commands/run",
        "text": "dbt will still execute the model SQL against the target data warehouse but will avoid expensive reads of input data."
      },
      {
        "page": "Warnings",
        "url": "https://docs.getdbt.com/reference/global-configs/warnings",
        "text": "Enabling `WARN_ERROR` config or setting the `--warn-error` flag will convert *all* dbt warnings into errors."
      },
      {
        "page": "Logs",
        "url": "https://docs.getdbt.com/reference/global-configs/logs",
        "text": "This has the effect of showing debug-level log information in the terminal in addition to the `logs/dbt.log` file."
      },
      {
        "page": "Add data tests to your DAG",
        "url": "https://docs.getdbt.com/docs/build/data-tests",
        "text": "dbt will first save the results of a test query to a table in the database, and then query that table to calculate the number of failures."
      },
      {
        "page": "About dbt retry command",
        "url": "https://docs.getdbt.com/reference/commands/retry",
        "text": "Retry re-executes the last invocation from the point of failure."
      }
    ]
  },
  "3008": {
    "quotes": [
      {
        "page": "Add data tests to your DAG",
        "url": "https://docs.getdbt.com/docs/build/data-tests",
        "text": "`unique` asserts that a column has no duplicate values, and `not_null` asserts that a column has no nulls."
      },
      {
        "page": "Add data tests to your DAG",
        "url": "https://docs.getdbt.com/docs/build/data-tests",
        "text": "`accepted_values` asserts that a column's values are in a supplied list"
      },
      {
        "page": "Add data tests to your DAG",
        "url": "https://docs.getdbt.com/docs/build/data-tests",
        "text": "and `relationships` asserts that each value exists in another model (referential integrity)."
      },
      {
        "page": "Add data tests to your DAG",
        "url": "https://docs.getdbt.com/docs/build/data-tests",
        "text": "dbt ships with four generic data tests built in"
      }
    ]
  },
  "3009": {
    "quotes": [
      {
        "page": "severity, error_if, and warn_if",
        "url": "https://docs.getdbt.com/reference/resource-configs/severity",
        "text": "`severity`: `error` or `warn` (default: `error`)"
      },
      {
        "page": "severity, error_if, and warn_if",
        "url": "https://docs.getdbt.com/reference/resource-configs/severity",
        "text": "`error_if`: conditional expression (default: `!=0`)"
      },
      {
        "page": "severity, error_if, and warn_if",
        "url": "https://docs.getdbt.com/reference/resource-configs/severity",
        "text": "Conditional expressions can be any comparison logic that is supported by your SQL syntax with an integer number of failures: `> 5`, `= 0`, `between 5 and 10`, and so on."
      },
      {
        "page": "where",
        "url": "https://docs.getdbt.com/reference/resource-configs/where",
        "text": "Filter the resource being tested (model, source, seed, or snapshot)."
      },
      {
        "page": "where",
        "url": "https://docs.getdbt.com/reference/resource-configs/where",
        "text": "The `where` condition is templated into the test query by replacing the resource reference with a subquery."
      },
      {
        "page": "limit",
        "url": "https://docs.getdbt.com/reference/resource-configs/limit",
        "text": "Limit the number of failures that will be returned by a test query."
      },
      {
        "page": "fail_calc",
        "url": "https://docs.getdbt.com/reference/resource-configs/fail_calc",
        "text": "the default value of `fail_calc` is `count(*)`"
      }
    ]
  },
  "3010": {
    "quotes": [
      {
        "page": "About documentation",
        "url": "https://docs.getdbt.com/docs/build/documentation",
        "text": "Docs blocks provide a robust method for documenting models and other resources using Jinja and markdown."
      },
      {
        "page": "About documentation",
        "url": "https://docs.getdbt.com/docs/build/documentation",
        "text": "Place docs blocks in `.md` files."
      },
      {
        "page": "About the doc function",
        "url": "https://docs.getdbt.com/reference/dbt-jinja-functions/doc",
        "text": "You can specify documentation text in a docs block, then use the `doc()` Jinja function in description fields as a way to reuse the same text in multiple places."
      },
      {
        "page": "persist_docs",
        "url": "https://docs.getdbt.com/reference/resource-configs/persist_docs",
        "text": "Optionally persist [resource descriptions](https://docs.getdbt.com/reference/resource-properties/description.md) as column and relation comments in the database."
      },
      {
        "page": "meta",
        "url": "https://docs.getdbt.com/reference/resource-configs/meta",
        "text": "`meta` accepts key-value pairs, is compiled into `manifest.json`, and appears in auto-generated documentation."
      }
    ]
  },
  "3011": {
    "quotes": [
      {
        "page": "Node selector methods",
        "url": "https://docs.getdbt.com/reference/node-selection/methods",
        "text": "`state:new`: There is no node with the same `unique_id` in the comparison manifest"
      },
      {
        "page": "Node selector methods",
        "url": "https://docs.getdbt.com/reference/node-selection/methods",
        "text": "`state:modified`: All new nodes, plus any changes to existing nodes."
      },
      {
        "page": "Node selector methods",
        "url": "https://docs.getdbt.com/reference/node-selection/methods",
        "text": "Only use `result:fail` when you want to re-run tests that failed during the last invocation."
      },
      {
        "page": "Node selector methods",
        "url": "https://docs.getdbt.com/reference/node-selection/methods",
        "text": "On the other hand, `result:error` selects any resource (models, tests, snapshots, and more) that returned an error."
      },
      {
        "page": "Node selector methods",
        "url": "https://docs.getdbt.com/reference/node-selection/methods",
        "text": "The `access` method selects models based on their [access](https://docs.getdbt.com/reference/resource-configs/access.md) property."
      }
    ]
  },
  "3012": {
    "quotes": [
      {
        "page": "About dbt retry command",
        "url": "https://docs.getdbt.com/reference/commands/retry",
        "text": "Retry re-executes the last invocation from the point of failure."
      },
      {
        "page": "About dbt clone command",
        "url": "https://docs.getdbt.com/reference/commands/clone",
        "text": "The `dbt clone` command clones selected nodes from the [specified state](https://docs.getdbt.com/reference/node-selection/syntax.md#establishing-state) to the target schema(s)."
      },
      {
        "page": "About dbt clone command",
        "url": "https://docs.getdbt.com/reference/commands/clone",
        "text": "Otherwise, dbt will create a simple pointer view (`select * from` the source object)"
      },
      {
        "page": "About dbt seed command",
        "url": "https://docs.getdbt.com/reference/commands/seed",
        "text": "The `dbt seed` command loads static CSV files from your project’s `seed-paths` into your data warehouse as tables."
      },
      {
        "page": "About dbt build command",
        "url": "https://docs.getdbt.com/reference/commands/build",
        "text": "In DAG order, for selected resources or an entire project."
      },
      {
        "page": "Quickstart for dbt v1 using DuckDB",
        "url": "https://docs.getdbt.com/guides/duckdb",
        "text": "`dbt source freshness` — checks the freshness"
      }
    ]
  },
  "3013": {
    "quotes": [
      {
        "page": "Node selector methods",
        "url": "https://docs.getdbt.com/reference/node-selection/methods",
        "text": "dbt list --select \"version:latest\"      # only 'latest' versions\ndbt list --select \"version:prerelease\"  # versions newer than the 'latest' version\ndbt list --select \"version:old\"         # versions older than the 'latest' version\n\ndbt list --select \"version:none\"        # models that are *not* versioned"
      },
      {
        "page": "latest_version",
        "url": "https://docs.getdbt.com/reference/resource-properties/latest_version",
        "text": "In this case, the `latest_version` is explicitly set to `2`. Any unpinned references will resolve to `model_name.v2`. `v3` is considered \"prerelease\", and `v1` is considered \"old\"."
      },
      {
        "page": "Model versions",
        "url": "https://docs.getdbt.com/docs/mesh/govern/model-versions",
        "text": "dbt run --select dim_customers # Run all versions of the model"
      }
    ]
  },
  "3014": {
    "quotes": [
      {
        "page": "Node selector methods",
        "url": "https://docs.getdbt.com/reference/node-selection/methods",
        "text": "* `state:modified.body`: Changes to node body (e.g. model SQL, seed values)"
      },
      {
        "page": "Node selector methods",
        "url": "https://docs.getdbt.com/reference/node-selection/methods",
        "text": "* `state:modified.configs`: Changes to any node configs, excluding `database`/`schema`/`alias`/`tags`/`meta`"
      },
      {
        "page": "Node selector methods",
        "url": "https://docs.getdbt.com/reference/node-selection/methods",
        "text": "* `state:modified.relation`: Changes to `database`/`schema`/`alias` (the database representation of this node), irrespective of `target` values or `generate_x_name` macros"
      },
      {
        "page": "Node selector methods",
        "url": "https://docs.getdbt.com/reference/node-selection/methods",
        "text": "* `state:modified.macros`: Changes to upstream macros (whether called directly or indirectly by another macro)"
      },
      {
        "page": "Node selector methods",
        "url": "https://docs.getdbt.com/reference/node-selection/methods",
        "text": "* `state:modified.contract`: Changes to a model's [contract](https://docs.getdbt.com/reference/resource-configs/contract.md), which currently include the `name` and `data_type` of `columns`."
      },
      {
        "page": "Caveats to state comparison",
        "url": "https://docs.getdbt.com/reference/node-selection/state-comparison-caveats",
        "text": "[`state:modified`](https://docs.getdbt.com/reference/node-selection/methods.md#state) and `state:modified+` only detect changes to your project's code, configuration, or manifest-relevant metadata — not changes to the data itself, like new rows landing in a source table."
      }
    ]
  },
  "3015": {
    "quotes": [
      {
        "page": "Add Exposures to your DAG",
        "url": "https://docs.getdbt.com/docs/build/exposures",
        "text": "* **type**: one of `dashboard`, `notebook`, `analysis`, `ml`, `application` (used to organize in docs site)"
      },
      {
        "page": "Add Exposures to your DAG",
        "url": "https://docs.getdbt.com/docs/build/exposures",
        "text": "* **owner**: `name` or `email` required; additional properties allowed"
      },
      {
        "page": "Add Exposures to your DAG",
        "url": "https://docs.getdbt.com/docs/build/exposures",
        "text": "* **depends\\_on**: list of refable nodes, including `metric`, `ref`, and `source`."
      },
      {
        "page": "Add Exposures to your DAG",
        "url": "https://docs.getdbt.com/docs/build/exposures",
        "text": "* **url**: Activates and populates the link to **View this exposure** in the upper right corner of the generated documentation site"
      },
      {
        "page": "Add Exposures to your DAG",
        "url": "https://docs.getdbt.com/docs/build/exposures",
        "text": "* **maturity**: Indicates the level of confidence or stability in the exposure. One of `high`, `medium`, or `low`."
      },
      {
        "page": "Add Exposures to your DAG",
        "url": "https://docs.getdbt.com/docs/build/exposures",
        "text": "* run, test, and list resources that feed into your exposure"
      }
    ]
  },
  "4001": {
    "quotes": [
      {
        "page": "Define configs",
        "url": "https://docs.getdbt.com/reference/define-configs",
        "text": "This generally follows the order above: an in-file `config()` block --> properties defined in a `.yml` file --> config defined in the project file."
      },
      {
        "page": "Define configs",
        "url": "https://docs.getdbt.com/reference/define-configs",
        "text": "In the project file, for example, configurations applied to a `marketing` subdirectory will take precedence over configurations applied to the entire `jaffle_shop` project."
      },
      {
        "page": "Connection profiles",
        "url": "https://docs.getdbt.com/docs/local/connection-profiles",
        "text": "A profile contains all the details required to connect to your data warehouse."
      }
    ]
  },
  "4002": {
    "quotes": [
      {
        "page": "About dbt test command",
        "url": "https://docs.getdbt.com/reference/commands/test",
        "text": "It expects that you have already created those resources through the appropriate commands."
      },
      {
        "page": "About dbt seed command",
        "url": "https://docs.getdbt.com/reference/commands/seed",
        "text": "The `dbt seed` command loads static CSV files from your project’s `seed-paths` into your data warehouse as tables."
      },
      {
        "page": "About source function",
        "url": "https://docs.getdbt.com/reference/dbt-jinja-functions/source",
        "text": "Creates dependencies between a source and the current model, which is useful for documentation and [node selection](https://docs.getdbt.com/reference/node-selection/syntax.md)"
      }
    ]
  },
  "4004": {
    "quotes": [
      {
        "page": "Add snapshots to your DAG",
        "url": "https://docs.getdbt.com/docs/build/snapshots",
        "text": "**On the first run:** dbt will create the initial snapshot table — this will be the result set of your `select` statement, with additional columns including `dbt_valid_from` and `dbt_valid_to`."
      },
      {
        "page": "Add snapshots to your DAG",
        "url": "https://docs.getdbt.com/docs/build/snapshots",
        "text": "The `dbt_valid_to` column will be updated for any existing records that have changed."
      },
      {
        "page": "Add snapshots to your DAG",
        "url": "https://docs.getdbt.com/docs/build/snapshots",
        "text": "The updated record and any new records will be inserted into the snapshot table."
      },
      {
        "page": "Add snapshots to your DAG",
        "url": "https://docs.getdbt.com/docs/build/snapshots",
        "text": "Snapshots ignore both the `full_refresh` config and the `--full-refresh` flag."
      }
    ]
  },
  "4005": {
    "quotes": [
      {
        "page": "About dbt build command",
        "url": "https://docs.getdbt.com/reference/commands/build",
        "text": "When `dbt build` is executed with unit tests applied, the models will be processed according to their lineage and dependencies."
      },
      {
        "page": "About dbt build command",
        "url": "https://docs.getdbt.com/reference/commands/build",
        "text": "[Unit tests](https://docs.getdbt.com/docs/build/unit-tests.md) are run on a SQL model."
      },
      {
        "page": "About dbt build command",
        "url": "https://docs.getdbt.com/reference/commands/build",
        "text": "The model is materialized."
      },
      {
        "page": "About dbt build command",
        "url": "https://docs.getdbt.com/reference/commands/build",
        "text": "[Data tests](https://docs.getdbt.com/docs/build/data-tests.md) are run on the model."
      },
      {
        "page": "About dbt build command",
        "url": "https://docs.getdbt.com/reference/commands/build",
        "text": "Tests on upstream resources will block downstream resources from running, and a test failure will cause those downstream resources to skip entirely."
      }
    ]
  },
  "4006": {
    "quotes": [
      {
        "page": "Add data tests to your DAG",
        "url": "https://docs.getdbt.com/docs/build/data-tests",
        "text": "Behind the scenes, dbt constructs a `select` query for each data test, using the parameterized query from the generic test block."
      },
      {
        "page": "Add data tests to your DAG",
        "url": "https://docs.getdbt.com/docs/build/data-tests",
        "text": "dbt will first save the results of a test query to a table in the database, and then query that table to calculate the number of failures."
      },
      {
        "page": "store_failures",
        "url": "https://docs.getdbt.com/reference/resource-configs/store_failures",
        "text": "A test's results will always **replace** previous failures for the same test, even if that test results in no failures."
      },
      {
        "page": "store_failures",
        "url": "https://docs.getdbt.com/reference/resource-configs/store_failures",
        "text": "By default, `store_failures` uses a schema named `{{ profile.schema }}_dbt_test__audit`"
      }
    ]
  },
  "4007": {
    "quotes": [
      {
        "page": "Writing custom generic data tests",
        "url": "https://docs.getdbt.com/best-practices/writing-custom-generic-tests",
        "text": "To define your own generic tests, simply create a `test` block called `<test_name>`."
      },
      {
        "page": "Add data tests to your DAG",
        "url": "https://docs.getdbt.com/docs/build/data-tests",
        "text": "These queries return the rows where your assertion is *not* true; if the test returns zero rows, your assertion passes."
      }
    ]
  },
  "4008": {
    "quotes": [
      {
        "page": "Debug errors",
        "url": "https://docs.getdbt.com/guides/debug-errors",
        "text": "Read the error message — when writing the code behind dbt, we try our best to make error messages as useful as we can."
      },
      {
        "page": "Debug errors",
        "url": "https://docs.getdbt.com/guides/debug-errors",
        "text": "Also open the compiled SQL (in this case `target/run/jaffle_shop/models/customers.sql` as per the error message) — it can be useful to show these side-by-side in your code editor."
      },
      {
        "page": "Debug errors",
        "url": "https://docs.getdbt.com/guides/debug-errors",
        "text": "Copy and paste the compiled query into a query runner (e.g. the Snowflake UI, or a desktop app like DataGrip / TablePlus) and execute it"
      },
      {
        "page": "Debug errors",
        "url": "https://docs.getdbt.com/guides/debug-errors",
        "text": "Rerun the failed model."
      },
      {
        "page": "About dbt clean command",
        "url": "https://docs.getdbt.com/reference/commands/clean",
        "text": "`dbt clean` is a utility function that deletes the paths specified within the [`clean-targets`](https://docs.getdbt.com/reference/project-configs/clean-targets.md) list in the `dbt_project.yml` file."
      }
    ]
  },
  "4009": {
    "quotes": [
      {
        "page": "About dbt build command",
        "url": "https://docs.getdbt.com/reference/commands/build",
        "text": "Tests on upstream resources will block downstream resources from running, and a test failure will cause those downstream resources to skip entirely."
      },
      {
        "page": "Job commands",
        "url": "https://docs.getdbt.com/docs/deploy/job-commands",
        "text": "If any upstream resource fails, all downstream resources are skipped, and the command exits with an error code of `1`."
      }
    ]
  },
  "4010": {
    "quotes": [
      {
        "page": "About execute variable",
        "url": "https://docs.getdbt.com/reference/dbt-jinja-functions/execute",
        "text": "Reads all of the files in your project and generates a [manifest](https://docs.getdbt.com/reference/artifacts/manifest-json.md) comprised of models, tests, and other graph nodes present in your project."
      },
      {
        "page": "About execute variable",
        "url": "https://docs.getdbt.com/reference/dbt-jinja-functions/execute",
        "text": "During this phase, dbt uses the [`ref`](https://docs.getdbt.com/reference/dbt-jinja-functions/ref.md) and [`source`](https://docs.getdbt.com/reference/dbt-jinja-functions/source.md) statements it finds to generate the DAG for your project."
      },
      {
        "page": "About execute variable",
        "url": "https://docs.getdbt.com/reference/dbt-jinja-functions/execute",
        "text": "**No SQL is run during this phase**, and `execute == False`."
      },
      {
        "page": "About execute variable",
        "url": "https://docs.getdbt.com/reference/dbt-jinja-functions/execute",
        "text": "Compiles (and runs) each node (eg. building models, or running tests)."
      },
      {
        "page": "About execute variable",
        "url": "https://docs.getdbt.com/reference/dbt-jinja-functions/execute",
        "text": "**SQL is run during this phase**, and `execute == True`."
      },
      {
        "page": "About execute variable",
        "url": "https://docs.getdbt.com/reference/dbt-jinja-functions/execute",
        "text": "Any Jinja that relies on a result being returned from the database will error during the parse phase."
      }
    ]
  },
  "4011": {
    "quotes": [
      {
        "page": "Best practices for workflows",
        "url": "https://docs.getdbt.com/best-practices/best-practice-workflows",
        "text": "By comparing to artifacts from a previous production run, dbt can determine which models are modified and build them on top of their unmodified parents."
      },
      {
        "page": "Defer",
        "url": "https://docs.getdbt.com/reference/node-selection/defer",
        "text": "Defer requires a manifest from a previous dbt invocation."
      },
      {
        "page": "Defer",
        "url": "https://docs.getdbt.com/reference/node-selection/defer",
        "text": "I access the dbt-generated [artifacts](https://docs.getdbt.com/docs/deploy/artifacts.md) (namely `manifest.json`) from a production run, and copy them into a local directory called `prod-run-artifacts`."
      },
      {
        "page": "Defer",
        "url": "https://docs.getdbt.com/reference/node-selection/defer",
        "text": "If it doesn't exist, dbt will resolve all instances of `{{ ref('model_a') }}` to `prod.model_a` instead."
      },
      {
        "page": "Node selector methods",
        "url": "https://docs.getdbt.com/reference/node-selection/methods",
        "text": "`state:modified`: All new nodes, plus any changes to existing nodes."
      }
    ]
  },
  "4013": {
    "quotes": [
      {
        "page": "About behavior changes",
        "url": "https://docs.getdbt.com/reference/global-configs/behavior-changes",
        "text": "1. **Introduced (disabled by default):** dbt adds logic to support both 'old' and 'new' behaviors. The 'new' behavior is gated behind a flag, disabled by default, preserving the old behavior."
      },
      {
        "page": "About behavior changes",
        "url": "https://docs.getdbt.com/reference/global-configs/behavior-changes",
        "text": "2. **Mature (enabled by default):** The default value of the flag is switched to the new behavior by default. You can still preserve the old behavior, but you may see deprecation warnings."
      },
      {
        "page": "About behavior changes",
        "url": "https://docs.getdbt.com/reference/global-configs/behavior-changes",
        "text": "3. **Removed (generally enabled):** The old behavior is removed from the dbt codebase(s)."
      },
      {
        "page": "About behavior changes",
        "url": "https://docs.getdbt.com/reference/global-configs/behavior-changes",
        "text": "These flags *must* be set in the `flags` dictionary in `dbt_project.yml`."
      }
    ]
  },
  "5001": {
    "quotes": [
      {
        "page": "Configure incremental models",
        "url": "https://docs.getdbt.com/docs/build/incremental-models",
        "text": "If you don't specify a `unique_key`, most adapters will result in `append`-only behavior, which means dbt inserts all rows returned by the model's SQL into the preexisting target table without regard for whether the rows represent duplicates."
      }
    ],
    "run": {
      "dbtVersion": "1.11",
      "commands": [
        "cd dbt-sandbox/exp-5005 (orders_keyed: incremental with unique_key='event_id'; orders_nokey: incremental without unique_key; both select event_id 1 with an event_type taken from --vars s)",
        "dbt run  (s=a)",
        "dbt run -s orders_keyed orders_nokey --vars '{s: b}'",
        "dbt show --inline union of both tables"
      ],
      "observed": "keyed: one row (1, b); nokey: two rows (1, a) and (1, b)"
    }
  },
  "5002": {
    "quotes": [
      {
        "page": "identifier",
        "url": "https://docs.getdbt.com/reference/resource-properties/identifier",
        "text": "The table name as stored in the database."
      },
      {
        "page": "identifier",
        "url": "https://docs.getdbt.com/reference/resource-properties/identifier",
        "text": "This parameter is useful if you want to use a source table name that differs from the table name in the database."
      },
      {
        "page": "Add sources to your DAG",
        "url": "https://docs.getdbt.com/docs/build/sources",
        "text": "use the [schema](https://docs.getdbt.com/reference/resource-properties/schema.md) and [identifier](https://docs.getdbt.com/reference/resource-properties/identifier.md) properties to define the names as per the database, and use your `name:` property for the name that makes sense!"
      }
    ]
  },
  "5003": {
    "quotes": [
      {
        "page": "Graph operators",
        "url": "https://docs.getdbt.com/reference/node-selection/graph-operators",
        "text": "Placed before a model/resource — Includes the resource itself and all its ancestors (upstream dependencies)."
      },
      {
        "page": "Graph operators",
        "url": "https://docs.getdbt.com/reference/node-selection/graph-operators",
        "text": "You can adjust the behavior of the `+` operator by quantifying the number of edges to step through."
      },
      {
        "page": "Graph operators",
        "url": "https://docs.getdbt.com/reference/node-selection/graph-operators",
        "text": "select my_model, its first-degree ancestors (\"parents\"), and its second-degree ancestors (\"grandparents\")"
      }
    ]
  },
  "5004": {
    "quotes": [
      {
        "page": "Best practices for workflows",
        "url": "https://docs.getdbt.com/best-practices/best-practice-workflows",
        "text": "Using the `ref` function allows dbt to infer dependencies, ensuring that models are built in the correct order."
      },
      {
        "page": "Best practices for workflows",
        "url": "https://docs.getdbt.com/best-practices/best-practice-workflows",
        "text": "Always use the `ref` function when selecting from another model, rather than using the direct relation reference (e.g. `my_schema.my_table`)."
      },
      {
        "page": "About execute variable",
        "url": "https://docs.getdbt.com/reference/dbt-jinja-functions/execute",
        "text": "During this phase, dbt uses the [`ref`](https://docs.getdbt.com/reference/dbt-jinja-functions/ref.md) and [`source`](https://docs.getdbt.com/reference/dbt-jinja-functions/source.md) statements it finds to generate the DAG for your project."
      }
    ]
  },
  "5005": {
    "quotes": [
      {
        "page": "Configure incremental models",
        "url": "https://docs.getdbt.com/docs/build/incremental-models",
        "text": "Note that the SQL in your model needs to be valid whether `is_incremental()` evaluates to `True` or `False`."
      },
      {
        "page": "Configure incremental models",
        "url": "https://docs.getdbt.com/docs/build/incremental-models",
        "text": "The model must already exist as a table in the database"
      }
    ],
    "run": {
      "dbtVersion": "1.11",
      "commands": [
        "cd dbt-sandbox/exp-5005 && ../.venv/bin/dbt run --profiles-dir . (events_bad: incremental, unique_key event_id, unguarded where event_at > (select max(event_at) from {{ this }}); events_ok: same filter inside {% if is_incremental() %})"
      ],
      "observed": "ERROR creating sql incremental model main.events_bad: Runtime Error ... Catalog Error: Table with name events_bad does not exist!; OK created sql incremental model main.events_ok"
    }
  },
  "5007": {
    "quotes": [
      {
        "page": "About dbt build command",
        "url": "https://docs.getdbt.com/reference/commands/build",
        "text": "Tests on upstream resources will block downstream resources from running, and a test failure will cause those downstream resources to skip entirely."
      },
      {
        "page": "About dbt build command",
        "url": "https://docs.getdbt.com/reference/commands/build",
        "text": "If you have a test with multiple parents that are independent of each other, dbt [skips](https://github.com/dbt-labs/dbt/blob/d5071fa13502be273596a0b7c8b13d14b6c68655/core/dbt/compilation.py#L224-L257) the downstream node only if that node depends on all of those parents."
      }
    ]
  },
  "5008": {
    "quotes": [
      {
        "page": "severity, error_if, and warn_if",
        "url": "https://docs.getdbt.com/reference/resource-configs/severity",
        "text": "If `severity: error`, dbt will check the `error_if` condition first."
      },
      {
        "page": "severity, error_if, and warn_if",
        "url": "https://docs.getdbt.com/reference/resource-configs/severity",
        "text": "`error_if`: conditional expression (default: `!=0`)"
      },
      {
        "page": "severity, error_if, and warn_if",
        "url": "https://docs.getdbt.com/reference/resource-configs/severity",
        "text": "`warn_if`: conditional expression (default: `!=0`)"
      },
      {
        "page": "Add data tests to your DAG",
        "url": "https://docs.getdbt.com/docs/build/data-tests",
        "text": "Use `arguments:` for inputs to the test macro (for example, `values`, `to`, and `field`)."
      }
    ]
  },
  "5009": {
    "quotes": [
      {
        "page": "About documentation",
        "url": "https://docs.getdbt.com/docs/build/documentation",
        "text": "To use a docs block, reference it from your `schema.yml` file with the [doc()](https://docs.getdbt.com/reference/dbt-jinja-functions/doc.md) function in place of a markdown string."
      },
      {
        "page": "About documentation",
        "url": "https://docs.getdbt.com/docs/build/documentation",
        "text": "Place docs blocks in `.md` files."
      },
      {
        "page": "About documentation",
        "url": "https://docs.getdbt.com/docs/build/documentation",
        "text": "In the resulting documentation, `'{{ doc(\"table_events\") }}'` will be expanded to the markdown defined in the `table_events` docs block."
      }
    ]
  },
  "5010": {
    "quotes": [
      {
        "page": "Node selector methods",
        "url": "https://docs.getdbt.com/reference/node-selection/methods",
        "text": "# run all models that feed into the weekly_kpis exposure"
      },
      {
        "page": "Graph operators",
        "url": "https://docs.getdbt.com/reference/node-selection/graph-operators",
        "text": "Placed before a model/resource — Includes the resource itself and all its ancestors (upstream dependencies)."
      }
    ]
  },
  "5011": {
    "quotes": [
      {
        "page": "Configure state selection",
        "url": "https://docs.getdbt.com/reference/node-selection/configure-state",
        "text": "In your job commands, you can signal dbt to run and test only on the fresher sources and their children by including the `source_status:fresher+` argument."
      },
      {
        "page": "Upgrading to v1.1",
        "url": "https://docs.getdbt.com/docs/dbt-versions/dbt-upgrade/Older versions/upgrading-to-v1.1",
        "text": "dbt can compare them to determine which sources have loaded new data, and select only resources downstream of \"fresher\" sources."
      },
      {
        "page": "Node selector methods",
        "url": "https://docs.getdbt.com/reference/node-selection/methods",
        "text": "`state:modified`: All new nodes, plus any changes to existing nodes."
      },
      {
        "page": "Node selector methods",
        "url": "https://docs.getdbt.com/reference/node-selection/methods",
        "text": "On the other hand, `result:error` selects any resource (models, tests, snapshots, and more) that returned an error."
      }
    ]
  },
  "5012": {
    "quotes": [
      {
        "page": "Node selector methods",
        "url": "https://docs.getdbt.com/reference/node-selection/methods",
        "text": "`state:modified`: All new nodes, plus any changes to existing nodes."
      },
      {
        "page": "Graph operators",
        "url": "https://docs.getdbt.com/reference/node-selection/graph-operators",
        "text": "Placed after a model/resource — Includes the resource itself and all its descendants (downstream dependencies)."
      },
      {
        "page": "Graph operators",
        "url": "https://docs.getdbt.com/reference/node-selection/graph-operators",
        "text": "select my_model, its descendants, and the ancestors of its descendants"
      }
    ]
  },
  "5013": {
    "quotes": [
      {
        "page": "Model contracts",
        "url": "https://docs.getdbt.com/docs/mesh/govern/model-contracts",
        "text": "* **Definable and not enforced** — The platform supports specifying the type of constraint, but a model can still build even if building the model violates the constraint. This constraint exists for metadata purposes only."
      },
      {
        "page": "Model contracts",
        "url": "https://docs.getdbt.com/docs/mesh/govern/model-contracts",
        "text": "* **Definable and enforced** — The model won't build if it violates the constraint."
      },
      {
        "page": "constraints",
        "url": "https://docs.getdbt.com/reference/resource-properties/constraints",
        "text": "* **You enforce a contract** — To use constraints, your model must declare and enforce a [contract](https://docs.getdbt.com/reference/resource-configs/contract.md). This means you need to explicitly define the `data_type` for every column in your model's schema configuration."
      }
    ]
  },
  "5014": {
    "quotes": [
      {
        "page": "About the --empty flag",
        "url": "https://docs.getdbt.com/docs/build/empty-flag",
        "text": "The `--empty` flag limits the refs and sources to zero rows. dbt will still execute the model SQL against the target data warehouse but will avoid expensive reads of input data."
      }
    ],
    "run": {
      "dbtVersion": "1.11",
      "commands": [
        "cd dbt-sandbox/exp-a-5014 && ../.venv/bin/dbt seed --profiles-dir . && ../.venv/bin/dbt run --profiles-dir .  (DuckDB; fct_orders counts rows from ref('stg_orders'), source('shop', 'raw_customers') and hard-coded main.raw_customers)",
        "../.venv/bin/dbt run --profiles-dir . --select fct_orders --empty",
        "../.venv/bin/dbt show --profiles-dir . --inline \"select * from main.fct_orders\""
      ],
      "observed": "Compiled SQL: (select * from \"dev\".\"main\".\"stg_orders\" where false limit 0), (select * from \"dev\".\"main\".\"raw_customers\" where false limit 0), and unchanged 'from main.raw_customers'. Result: n_ref 0, n_source 0, n_hardcoded 2."
    }
  },
  "5015": {
    "quotes": [
      {
        "page": "About dbt build command",
        "url": "https://docs.getdbt.com/reference/commands/build",
        "text": "* In the case of a test with multiple parents, where one parent depends on the other (e.g. a `relationships` test between `model_a` + `model_b`), that test will block-and-skip children of the most-downstream parent only (`model_b`)."
      }
    ]
  },
  "5016": {
    "quotes": [
      {
        "page": "About dbt retry command",
        "url": "https://docs.getdbt.com/reference/commands/retry",
        "text": "Retry re-executes the last invocation from the point of failure."
      },
      {
        "page": "About dbt retry command",
        "url": "https://docs.getdbt.com/reference/commands/retry",
        "text": "In each scenario `dbt retry` picks up from the error rather than running all of the upstream dependencies again."
      }
    ],
    "run": {
      "dbtVersion": "1.11",
      "commands": [
        "cd dbt-sandbox/exp-b-5016 (DuckDB; int_orders selects missing column amount_usd; fct_orders refs int_orders)",
        "../.venv/bin/dbt build --profiles-dir .",
        "../.venv/bin/dbt retry --profiles-dir .   (before the fix)",
        "fix int_orders, then ../.venv/bin/dbt retry --profiles-dir ."
      ],
      "observed": "Build log as in the code snippet (timestamps and dot padding trimmed). Retry before the fix: '1 of 2 START sql table model main.int_orders', '1 of 2 ERROR', '2 of 2 SKIP relation main.fct_orders'. Retry after the fix: '1 of 2 OK created sql table model main.int_orders', '2 of 2 OK created sql table model main.fct_orders', 'Done. PASS=2 ERROR=0 SKIP=0'. A further retry: 'Nothing to do.'"
    }
  },
  "5017": {
    "quotes": [
      {
        "page": "Exposure properties",
        "url": "https://docs.getdbt.com/reference/exposure-properties",
        "text": "maturity: {high, medium, low}  # Indicates level of confidence or stability in the exposure"
      },
      {
        "page": "Exposure properties",
        "url": "https://docs.getdbt.com/reference/exposure-properties",
        "text": "Exposure names must contain only letters, numbers, and underscores (no spaces or special characters). For a short human-friendly name with title casing, spaces, and special characters, use the `label` property."
      }
    ]
  },
  "5018": {
    "quotes": [
      {
        "page": "Python models",
        "url": "https://docs.getdbt.com/docs/build/python-models",
        "text": "It accepts *only* literal values (strings, booleans, and numeric types) and dynamic configuration. Passing another function or a more complex data structure is not possible. The reason is that dbt statically analyzes the arguments to `config()` while parsing your model without executing your Python code."
      }
    ],
    "run": {
      "dbtVersion": "1.11",
      "commands": [
        "exp-c-5018 (DuckDB): models/customer_scores.py exactly as the code snippet",
        "dbt parse --profiles-dir .",
        "then replace dbt.ref(UPSTREAM) with dbt.ref(\"stg_customers\") and run dbt build --profiles-dir ."
      ],
      "observed": "Parsing Error\n  Error when trying to literal_eval an arg to dbt.ref(), dbt.source(), dbt.config() or dbt.config.get()\n  malformed node or string on line 7: <ast.Name object ...>\n  In dbt python model, `dbt.ref`, `dbt.source`, `dbt.config`, `dbt.config.get` function args only support Python literal structures. After the fix: 3 of 3 OK created python table model main.customer_scores (so lines 5, 6 and 8 are valid). A separate run with dbt.config(materialized=pick_materialization()) also failed with the same error."
    }
  }
};
