/* eslint-disable no-console */
const EventEmitter = require("events");
const DirWatcher = require("./dirwatcher.js");
const csvjson = require("csvjson");
const fs = require("fs");

class Importer {
	constructor() {
		this.dirWatcher = new DirWatcher();
		this.lastChangedFile = {};
	}

	watch(path, delayTime) {
		this.dirWatcher.watch(path, delayTime);
		this.dirWatcher.on("dirwatcher:changed", file => {
			const newFilePath = file.replace(".csv", ".json");
			const data = fs.readFileSync(file, "utf8");
			const options = {
				delimiter: ",", 
				quote: "\"" 
			};
			const jsonData = csvjson.toObject(data, options);
			this.lastChangedFile = JSON.stringify(jsonData, null, "\t");
			fs.writeFileSync(newFilePath, this.lastChangedFile, "utf8");
		});
	}
	stopWatching() {
		this.watcher.close();
		this.watcher = null;
	}

	LastChangedFile() {
		return new Promise((resolve, reject) => {
			(this.lastChangedFile === "{}") ? (reject(new Error)) : (resolve(this.lastChangedFile));
		});
	}
	LastChangedFileSync() {
		return this.lastChangedFile;
	}
}
module.exports = Importer;