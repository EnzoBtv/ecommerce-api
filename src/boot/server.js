const { join } = require("path");

const express = require("express");
const { json, urlencoded } = require("body-parser");
const Ddos = require("ddos");
const cors = require("cors");

const Database = require("../database");

const logger = require("../util/logger");
const exec = require("../util/childPromise");

class Server {
	constructor() {
		this.app = express();
		this.middlewares();
		this.controllers();
		new Database().init();
	}

	middlewares() {
		this.app.use(json());
		this.app.use(urlencoded({ extended: true }));
		this.app.use(new Ddos({ burst: 10, limit: 15 }).express);
		this.app.use(cors());
	}

	async controllers() {
		try {
			logger.info("Trying no initialize all controllers");
			const controllers = await exec(`ls ${join(__dirname, "..", "controllers")}`);
			const { stdout } = controllers;
			const controllerArray = stdout.split("\n");
			for (const controller of controllerArray) {
				if (controller) {
					logger.info(`Initilizing ${controller} Controller`);
					const reqController = require(join(
						__dirname,
						"..",
						"controllers",
						controller
					));
					this.app.use(new reqController().router);
				}
			}
		} catch (ex) {
			logger.error(
				`It wasn't possible to initialize the controllers, error: ${JSON.stringify(
					ex
				)}`
			);
			throw new Error(JSON.stringify(ex));
		}
	}
}

module.exports = new Server().app;
