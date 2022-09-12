"use strict";

import path from "path";
import fs from "fs";
import { writeFile, mkdir } from "fs/promises";

import fetch from "node-fetch";
import pMap from "p-map";
import listContent from "list-github-dir-content";

const controller = new AbortController();

let totalFiles = 0;
let downloadCount = 0;

async function main() {
	const filenames = await getFilenames();
	totalFiles = filenames.length;

	if (filenames.length === 0) {
		throw new Error("No files to download");
	}

	await pMap(filenames, downloadFile, { concurrency: 20 }).catch(abortAndStop);

	console.log(`Downloaded ${downloadCount} files`);
}

main();

async function getFilenames() {
	return listContent
		.viaTreesApi({
			user: "n8n-io",
			repository: "n8n",
			ref: "master",
			directory: decodeURIComponent("packages/nodes-base"),
			getFullData: true,
		})
		.then((files) =>
			files.filter(
				(file) => file.path.endsWith(".ts") && !file.path.endsWith(".d.ts")
			)
		);
}

async function fetchFile(file, signal) {
	const response = await fetch(
		`https://raw.githubusercontent.com/n8n-io/n8n/master/${file.path}`,
		{ signal }
	);

	return response.text();
}

function toLocalPath(filepath) {
	const rootlessFilepath = filepath.replace("packages/nodes-base/", "");

	return path.join("scripts", "downloads", rootlessFilepath);
}

async function downloadFile(file) {
	const fileContent = await fetchFile(file, controller.signal);

	downloadCount++;

	console.log(`Downloading (${downloadCount}/${totalFiles}) files...`);

	write(toLocalPath(file.path), fileContent);
}

function abortAndStop(error) {
	controller.abort();

	throw error;
}

function exists(path) {
	try {
		fs.access(path);
		return true;
	} catch {
		return false;
	}
}

async function write(filePath, data) {
	const dirname = path.dirname(filePath);

	if (!exists(dirname)) {
		await mkdir(dirname, { recursive: true });
	}

	writeFile(filePath, data, "utf8");
}
