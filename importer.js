/* eslint-disable no-console */
const EventEmitter = require("events");
const DirWatcher = require("./dirwatcher.js");
const chokidar = require("chokidar");
const fs = require("fs");
const csv = require("csvtojson");

class Importer extends EventEmitter {
	constructor() {
		super();
		this.dirWatcher = new DirWatcher();
		this.lastChangedFile = {};
	}

	watch(path, delayTime) {
		this.dirWatcher.watch(path, delayTime);
		this.dirWatcher.on("dirwatcher:changed", file => {
			const newFilePath = file.replace(".csv", ".json");
			const csvFilePath = require(file);
			csv()
				.fromFile(csvFilePath)
				.then((jsonObj) => {
					fs.writeFileSync(newFilePath, jsonObj, "utf8");
					this.lastChangedFile = jsonObj;
				});

		});

	}
	stopWatching() {
		this.watcher.close();
		this.watcher = null;
	}
}

function returnLastChangedFile() {
	return this.lastChangedFile;
}

const importer = new Importer();
importer.watch(".", 5);
module.exports = Importer;