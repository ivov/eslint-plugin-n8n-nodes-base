"use strict";

import path from "path";
import { fileURLToPath } from "url";

import glob from "tiny-glob";
import shell from "shelljs";
import esbuild from "esbuild";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, "..");
const distDir = path.resolve(rootDir, "dist");

const tsFiles = await glob(path.resolve(rootDir, "lib/**/*.ts"));

const filesToTranspile = tsFiles.filter(
	(f) => !f.endsWith(".d.ts") && !f.endsWith("ruleTester.ts")
);

shell.rm("-rf", distDir);
shell.mkdir("-p", "dist", "lib");
shell.cp("index.js", path.resolve("dist", "index.js"));

esbuild
	.build({
		platform: "node",
		format: "cjs",
		entryPoints: filesToTranspile,
		outdir: path.resolve(distDir, "lib"),
	})
	.catch((error) => {
		console.error("[esbuild] Failed to build plugin", error);
		process.exit(1);
	});
