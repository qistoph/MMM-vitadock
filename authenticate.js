const readline = require("readline");
const login = require("./lib/login");
const fs = require("fs");

// Credits to Stefan Vranic
// for writing the vitadock interface that
// I have based my vitadock oauth code on:
// https://bitbucket.org/stefkev/vitadock/

var state = {};
var credsFile = "creds.json";

console.log("To call the API a device specific API key is required. This script will help you set one up.");

if(fs.existsSync(credsFile)) {
	console.log("Credits file (" + credsFile + ") already exists. Remove this first.");
	return;
}

login.authenticateDevice(state, function(success, state) {
	if(!success) {
		console.log("Could not authenticate device: " + state);
		return;
	}

	//console.log("Device authenticated.");
	//console.log(state);

	login.UnauthorizedAccess(state, function(success, state) {
		if(!success) {
			console.log("Could not get unauthorized keys: " + state);
			return;
		}
		
		//console.log("Unauthorized keys retrieved.");
		//console.log(state);

		var authUrl = login.getAuthorizationUrl(state);
		console.log("Go to " + authUrl);

		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout
		});

		rl.question("Authorization code: ", (answer) => {
			console.log("Entered: " + answer);
			rl.close();

			login.AuthorizeAccess(answer, state, (success, state) => {
				if(!success) {
					console.log("Could not verify authorization: " + state);
					return;
				}

				fs.writeFile(
					credsFile,
					JSON.stringify(state, null, "\t"),
					{
						encoding: "utf-8",
						mode: 0o400,
						flag: "wx"
					}
				);

				console.log("Use the following values in your configuration:");
				console.log("This is also stored in creds.js for your reference.");
				console.log(state);
				
			});
		});

	});
});
