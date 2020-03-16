"use strict";

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.addColumn("clients", "password", {
			allowNull: false,
			type: Sequelize.STRING
		});
	},

	down: (queryInterface) => {
		return queryInterface.removeColumn("clients", "password");
	}
};
