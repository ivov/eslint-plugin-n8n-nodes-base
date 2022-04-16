"use strict";

import path from "path";
import { fileURLToPath } from "url";

import shell from "shelljs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, "..");
const rulesDocsDir = path.resolve(__dirname, "docs", "rules");

shell.rm("-rf", rulesDocsDir);

shell.exec("DOCGEN=1 npm run test");

shell.exec(`node ${path.resolve("scripts", "make-docs-untested-rules.js")}`);

shell.exec(`node ${path.resolve("scripts", "make-docs-readme-table.js")}`);

const formatCommand = [
  path.resolve(rootDir, "node_modules", "prettier", "bin-prettier.js"),
  path.resolve("docs", "rules", "**.md"),
  "--write",
].join(" ");

shell.exec(formatCommand);
