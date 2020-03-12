module.exports = {
	dialect: "postgres",
	host: process.env.DB_HOST,
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: "ecommerce-api",
	define: {
		timestamps: true,
		underscored: true
	}
};