"use strict";

import path from "path";
import { fileURLToPath } from "url";

import shell, { ShellString } from "shelljs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, "..");
const DIST_DIR = path.resolve(ROOT_DIR, "dist");

const pluginIndexFile = path.resolve(DIST_DIR, "index.js");

shell.cp(pluginIndexFile, ".eslintplugin.js");

const oldContent = shell.cat(".eslintplugin.js");
const newContent = oldContent
	.replace(
		/__dirname, "lib", "rules"/,
		'__dirname, "dist", "lib", "rules"' // adjust reference based on new location (root)
	)
	.replace(/n8n-nodes-base/g, "local");

new ShellString(newContent).to(".eslintplugin.js");

console.log("Created .eslintplugin.js at root");
