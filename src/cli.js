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
  .option("f", {
    alias: "format",
    describe:
      "Format of output ('json' or 'text'). Without setting, defaults to text",
  })
  .help("h")
  .alias("h", "help").argv;

(async function main() {
  const q = argv._[0];
  const format = argv.format || "text";
  try {
    console.log(await search(q, format));
  } catch (e) {
    console.error("Problem getting lyrics: ", e.message);
    process.exit(1);
  }
})();
