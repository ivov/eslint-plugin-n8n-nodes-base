"use strict";

import path from "path";
import { fileURLToPath } from "url";

import glob from "tiny-glob";
import shell from "shelljs";
import esbuild from "esbuild";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, "..");
const DIST_DIR = path.resolve(ROOT_DIR, "dist");

const tsFiles = await glob(path.resolve(ROOT_DIR, "lib/**/*.ts"));

const filesToTranspile = tsFiles.filter(
	(f) => !f.endsWith(".d.ts") && !f.endsWith("ruleTester.ts")
);

shell.rm("-rf", DIST_DIR);
shell.mkdir("-p", "dist", "lib");
shell.cp("index.js", path.resolve("dist", "index.js")); // set up entrypoint to `/dist/index.js`

esbuild
	.build({
		platform: "node",
		format: "cjs",
		entryPoints: filesToTranspile,
		outdir: path.resolve(DIST_DIR, "lib"),
	})
	.catch((error) => {
		console.error("[esbuild] Failed to build plugin", error);
		process.exit(1);
	});
