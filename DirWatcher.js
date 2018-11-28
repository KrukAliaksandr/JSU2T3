/* eslint-disable no-console */
const EventEmitter = require("events");
let chokidar = require("chokidar");
const fs = require("fs");

class DirWatcher extends EventEmitter {
	constructor() {
		super();
		this.watcher = null;
	}

	watch(path, delayTime) {
		this.watcher = chokidar.watch(path, {
			usePolling: true,
			interval: delayTime,
			followSymlinks: false,
		});
		this.watcher.on("change", file => this.emit("dirwatcher:changed", fs.realpathSync(file)));
	}
	stopWatching() {
		this.watcher.close();
		this.watcher = null;
	}
}

module.exports = DirWatcher;