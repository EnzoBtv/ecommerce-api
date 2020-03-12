const express = require("express");
const { json, urlencoded } = require("body-parser");
const Ddos = require("ddos");
const cors = require("cors");
class Server {
	constructor() {
		this.app = express();
	}

	middlewares() {
		this.app.use(json());
		this.app.use(urlencoded({ extended: true }));
		this.app.use(new Ddos({ burst: 10, limit: 15 }).express);
		this.app.use(cors());
	}

	controllers() {

	}
}

module.exports = new Server().app;
