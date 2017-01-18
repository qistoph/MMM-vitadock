const Promise = require("promise");
const readline = require("readline");
const login = require("./lib/login");
const fs = require("fs");

// Credits to Stefan Vranic
// for writing the vitadock interface that
// I have based my vitadock oauth code on:
// https://bitbucket.org/stefkev/vitadock/

var deviceCreds = "deviceCreds.json";
var credsFile = "creds.json";

console.log("To call the API an OAuth-token is required. This script will help you set one up.");

if(fs.existsSync(credsFile)) {
	console.log("Credits file (" + credsFile + ") already exists. (Re)move this first.");
	return;
}

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

new Promise(function(fulfill, reject) {
	if(fs.existsSync(deviceCreds)) {
		var state = JSON.parse(fs.readFileSync(deviceCreds, "utf8"));
		console.log("Device credentials are read from " + deviceCreds + ".");
		fulfill(state);
	} else {
		console.log("Device credentials for this device are also created and stored in " + deviceCreds + ".");

		rl.question("Application token: ", (appToken) => {
			rl.question("Application secret: ", (appSecret) => {
				login.authenticateDevice(appToken, appSecret, function(success, state) {
					if(!success) {
						return reject(new Error("Could not authenticate device: " + state));
					}

					console.log("Device authenticated.");
					console.log(state);

					fs.writeFile(
						deviceCreds,
						JSON.stringify(state, null, "\t"),
						{
							encoding: "utf-8",
							mode: 0o400,
							flag: "wx"
						});

					//loginUser(state, closeStdIn);
					return fulfill(state);
				});
			});
		});
	}
}).then(function(state) {
	return new Promise(function(fulfill, reject) {
		login.UnauthorizedAccess(state, function(success, state) {
			if(!success) {
				return reject(new Error("Could not get unauthorized keys: " + state));
			}

			//console.log("Unauthorized keys retrieved.");
			//console.log(state);

			var authUrl = login.getAuthorizationUrl(state);
			console.log("Go to " + authUrl);

			rl.question("Authorization code: ", (answer) => {
				console.log("Entered: " + answer);

				login.AuthorizeAccess(answer, state, (success, state) => {
					if(!success) {
						return reject(new Error("Could not verify authorization: " + state));
					}

					fs.writeFile(
							credsFile,
							JSON.stringify(state, null, "\t"), {
								encoding: "utf-8",
								mode: 0o400,
								flag: "wx"
							}
							);

					console.log("Use the following values in your configuration:");
					console.log("This is also stored in " + credsFile + " for your reference.");
					console.log(JSON.stringify(state, null, "\t"));
					return fulfill(state);
				});
			});
		});
	});
}).catch(function(reason) {
	console.log(reason.message);
	//console.log(reason.stack);
}).done(function(res) {
	rl.close();
});
