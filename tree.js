#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const IGNORED_DIRS = new Set([
  "node_modules, .git, dist, build, coverage, .next, .turbo, out, tmp, logs",
]);

function printTree(rootPath, prefix = "") {
  let entries;
  try {
    entries = fs.readdirSync(rootPath, { withFileTypes: true });
  } catch (err) {
    console.error(prefix + "⟂ [error reading]", rootPath);
    return;
  }

  entries.sort((a, b) => {
    if (a.isDirectory() && !b.isDirectory()) return -1;
    if (!a.isDirectory() && b.isDirectory()) return 1;
    return a.name.localeCompare(b.name);
  });

  const last = entries.length - 1;

  entries.forEach((entry, i) => {
    const isLast = i === last;
    const connector = isLast ? "└── " : "├── ";
    const nextPrefix = prefix + (isLast ? "    " : "│   ");
    const fullPath = path.join(rootPath, entry.name);

    if (entry.isDirectory()) {
      if (IGNORED_DIRS.has(entry.name)) return;

      console.log(prefix + connector + entry.name + path.sep);
      printTree(fullPath, nextPrefix);
    } else {
      console.log(prefix + connector + entry.name);
    }
  });
}

function main() {
  const start = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
  console.log(start);
  printTree(start);
}

main();
