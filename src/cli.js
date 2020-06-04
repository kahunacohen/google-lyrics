#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const { search } = require("./index");

const getVersion = () => {
  let splitDirname = __dirname.split(path.sep);
  splitDirname.pop();
  packageJsonPath = `${splitDirname.join(path.sep)}${path.sep}package.json`;
  const parsed = JSON.parse(
    fs.readFileSync(packageJsonPath, { encoding: "utf-8" })
  );
  return parsed.version;
};

const argv = require("yargs")
  .version(getVersion())
  .usage("$ google-lyrics [-f | --format (json|text)] query")
  .example("google-lyrics -f json 'beatles help'")
  .demandCommand(1) // Require one arg (the query).
  .option("k", {
    alias: "keep-browser-open",
    type: "boolean",
    default: false,
    describe:
      "Whether to close the browser or not. Defaults to true. Useful with --headless switch for debugging",
  })
  .option("f", {
    alias: "format",
    default: "text",
    type: "string",
    describe:
      "Format of output ('json' or 'text'). Without setting, defaults to text",
  })
  .option("e", {
    alias: "headful",
    type: "boolean",
    default: false,
    describe:
      "Boolean flag whether to run the browser headless or not. Useful when debugging and in conjunction with --keep-browser-open flag.",
  })
  .help("h")
  .alias("h", "help").argv;

(async function main() {
  const q = argv._[0];
  try {
    console.log(
      await search(q, {
        headful: argv.headful,
        format: argv.format,
        keepBrowserOpen: argv.keepBrowserOpen,
      })
    );
  } catch (e) {
    console.error("Problem getting lyrics: ", e.message);
    process.exit(1);
  }
})();
