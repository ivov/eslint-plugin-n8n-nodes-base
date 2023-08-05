"use strict";

import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import shell from "shelljs";

const __filename = fileURLToPath(import.meta.url);
const SCRIPTS_DIR = path.dirname(__filename);

const ROOT_DIR = path.resolve(SCRIPTS_DIR, "..");
const RULES_DOCUMENTATION_DIR = path.resolve(ROOT_DIR, "docs", "rules");
const PRETTIER_CONFIG_PATH = path.resolve(ROOT_DIR, ".prettierrc.js");
const FORMAT_TARGET_PATH = path.resolve(RULES_DOCUMENTATION_DIR, "**.md");

shell.rm("-rf", RULES_DOCUMENTATION_DIR);

shell.exec("DOCGEN=1 pnpm test"); // https://github.com/wikimedia/eslint-docgen#-usage

fs.readdirSync(SCRIPTS_DIR)
	.filter((filename) => filename.startsWith("make-docs-")) // mind the trailing dash
	.forEach((script) => {
		const command = ["node", path.resolve(SCRIPTS_DIR, script)].join(" ");

		shell.exec(command);
	});

const command = [
	"prettier",
	FORMAT_TARGET_PATH,
	"--write",
	"--config",
	PRETTIER_CONFIG_PATH,
].join(" ");

shell.exec(command);
