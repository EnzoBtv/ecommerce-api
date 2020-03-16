const { Router } = require("express");
const cryptoJS = require("crypto-js");

const Client = require("../database/models/Client");

const { SUCCESS, INTERNAL_SERVER_ERROR, BAD_REQUEST, CONFLICT, NOT_FOUND } = require("../constants/HttpStatus");

const logger = require("../util/logger");
const privateRoute = require("../middlewares/Auth");
module.exports = class ClientController {
	constructor() {
		this.router = Router();
		this.path = "/client";
		this.init();
	}

	init() {
		this.router.post(this.path, this.store);
		this.router.put(this.path, privateRoute, this.update);
		this.router.get(this.path, privateRoute, this.index);
		this.router.put(this.path, privateRoute, this.update);
	}

	async store(req, res) {
		try {
			const { email, name, password } = req.body;

			if (!email || !name || !password) {
				logger.error("Client#store failed due to missing parameters");
				return res.status(BAD_REQUEST).json({ error: "Estão faltando parametros na requisição" });
			}

			const oldClient = await Client.findOne({
				where: {
					email
				}
			});

			if (oldClient) {
				logger.error("Client#store failed due to email already exists");
				return res.status(CONFLICT).json({ error: "Esse email já está cadastrado em nosso sistema" });
			}
			const shaPass = cryptoJS.SHA512(password);
			const newPassword = cryptoJS.enc.Base64.stringify(shaPass);

			const client = await Client.create({
				name,
				email,
				password: newPassword
			});

			if (!client) {
				logger.error("Client#store failed due to internal server error");
				return res.status(INTERNAL_SERVER_ERROR).json({ error: "Não foi possível realizar a criação de usuário, por favor, entre em contato com o nosso suporte" });
			}

			return res.status(SUCCESS).json({ success: true });
		} catch (e) {
			logger.error(e.message || e);
			logger.error(__filename);
			return res.status(INTERNAL_SERVER_ERROR).json({ error: e.message });
		}

	}

	async update(req, res) {
		try {
			const { id, body: { email, name } } = req;

			if (!email || !name) {
				logger.error("Client#update failed due to missing parameters");
				return res.status(BAD_REQUEST).json({ error: "Estão faltando parametros na requisição" });
			}

			const [, [client]] = await Client.update({
				name,
				email
			}, {
				where: {
					id
				}
			});

			if (!client) {
				logger.error("Client#update failed due to client not found in database");
				return res.status(NOT_FOUND).json({ error: "Não foi possível atualizar seu usuário, por favor, entre em contato com o nosso suporte" });
			}

			return res.status(SUCCESS).json({ success: true });
		} catch (e) {
			logger.error(e.message || e);
			logger.error(__filename);
			return res.status(INTERNAL_SERVER_ERROR).json({ error: e.message });
		}
	}

	async index(req, res) {
		try {
			const { id } = req;

			const client = await Client.findByPk(id);

			if (!client) {
				logger.error("Client#index failed due to client not found in database");
				res.status(NOT_FOUND).json({ error: "Não foi possível encontrar o seu usuário, por favor, entre em contato com o nosso suporte" });
			}

			return res.status(SUCCESS).json(client.toJSON());
		} catch (e) {
			logger.error(e.message || e);
			logger.error(__filename);
			return res.status(INTERNAL_SERVER_ERROR).json({ error: e.message });
		}
	}

	async destroy(req, res) {
		try {
			const { id } = req;

			const client = await Client.destroy({
				where: {
					id
				}
			});

			if (!client) {
				logger.error("Client#destroy failed due to client not found in database");
				res.status(NOT_FOUND).json({ error: "Não foi possível deletar seu usuário, por favor, entre em contato com o nosso suporte" });
			}

			return res.status(SUCCESS).json({ success: true });
		} catch (e) {
			logger.error(e.message || e);
			logger.error(__filename);
			return res.status(INTERNAL_SERVER_ERROR).json({ error: e.message });
		}
	}
};