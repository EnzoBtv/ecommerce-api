const { exec } = require("child_process");

module.exports = function execPromise(command, execOptions) {
	return new Promise((resolve, reject) => {
		exec(command, execOptions, (error, stdout, stderr) => {
			if (error || !stdout) {
				return reject({ error, stderr });
			}
			return resolve({ stdout });
		});
	});
};