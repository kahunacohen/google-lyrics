#!/usr/bin/env node

const { search } = require("./index");

(async function main() {
  const q = process.argv[2];
  console.log(await search(q));
})();
