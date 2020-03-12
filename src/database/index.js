const Sequelize = require("sequelize");
const { join } = require("path");

const dbConfig = require("..");

const logger = require("../util/logger");
const execPromise = require("../util/childPromise");

class Database {
	constructor() {
		this.connection = new Sequelize(dbConfig);
	}

	async init() {
		try {
			const models = await execPromise(
				`ls ${join(__dirname, "..", "models")}`,
				{}
			);
			const { stdout } = models;
			const modelsArray = stdout.split("\n");

			const modelsMap = {};

			for (let i = modelsArray.length - 2; i >= 0; i--) {
				const reqModel = require(join(
					__dirname,
					"..",
					"models",
					modelsArray[i]
				));
				reqModel.init(this.connection);
				modelsMap[modelsArray[i]] = reqModel;
			}

			for (let model in modelsMap) {
				if (modelsMap[model].associate) {
					modelsMap[model].associate(this.connection.models);
				}
			}
		} catch (ex) {
			logger.error("It wasn't possible to initialize the models");
			throw new Error(ex.message);
		}
	}
}

module.exports = Database;