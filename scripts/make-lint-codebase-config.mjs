"use strict";

/**
 * Create `.eslintplugin.js` based on `dist/index.js` for use by
 * `lint-codebase-config.js` in the `lint-codebase` command.
 */

import path from "path";
import { fileURLToPath } from "url";

import shell, { ShellString } from "shelljs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, "..");
const distDir = path.resolve(rootDir, "dist");

const pluginIndexFile = path.resolve(distDir, "index.js");

shell.cp(pluginIndexFile, ".eslintplugin.js");

const oldContent = shell.cat(".eslintplugin.js");
const newContent = oldContent.replace(
	/__dirname, "lib", "rules"/,
	'__dirname, "dist", "lib", "rules"' // adjust reference based on new (root) location
);

new ShellString(newContent).to(".eslintplugin.js");

console.log("Created .eslintplugin.js");
