"use strict";

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable("favorite-products", {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false
			},
			client_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: { model: "clients", key: "id" },
				onUpdate: "CASCADE",
				onDelete: "CASCADE"
			},
			external_id: {
				type: Sequelize.STRING,
				allowNull: false
			},
			created_at: {
				type: Sequelize.DATE,
				allowNull: false
			},
			updated_at: {
				type: Sequelize.DATE,
				allowNull: false
			}
		});
	},

	down: (queryInterface) => {
		return queryInterface.dropTable("favorite-products");
	}
};
