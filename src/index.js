/**
 * @author Enzo Aurichi Batrov
 */
const { config } = require("dotenv");
const { join } = require("path");
const Sentry = require("@sentry/node");
const app = require("./boot/server");

config({
	path: join(__dirname, "..", ".env")
});

Sentry.init({ dsn: "https://b5435108e03b49f18513b0bf88ffd497@sentry.io/4434711" });

app.listen(process.env.PORT, () => {
	console.log(`Server listening on port ${process.env.PORT}`);
});