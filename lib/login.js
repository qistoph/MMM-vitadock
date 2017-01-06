var request = require("request"),
	oauthAssembly = require("./oauthAssembly"),
	stringHelper = require("./stringHelper"),
	qs = require("querystring");

//require("request-debug")(request);

var mainUrl = "https://cloud.vitadock.com";
if (process.env.NODE_ENV === "development") {
	mainUrl = "https://test-cloud.vitadock.com";
}

module.exports.authenticateDevice = function(state, callback) {
	var date = stringHelper.date();
	var nonce = stringHelper.nonce();
	var url = mainUrl + "/auth/devices";

	const crypto = require("crypto");
	const os = require("os");
	const machineHash = crypto.createHash("sha1").update(os.hostname()).digest("hex");

	oauthAssembly.baseParameter(date, nonce, null, null, null, function(baseParameterData) {
		oauthAssembly.requestUrl(url, function(encodedUrl){
			oauthAssembly.signatureBaseString("POST", encodedUrl, baseParameterData, function(signatureBaseString){
				oauthAssembly.signature(signatureBaseString, null, null, function(signature){
					oauthAssembly.authorizationHeader(date, nonce, signature, null, null, null, function(authHeader){
						request.post(url, {
							headers:{
								"Content-type":"application/x-www-form-urlencoded",
								"Authorization": authHeader,
								"device_id": "MagicMirror_" + machineHash
							}
						}, function(err, resp, body){
							if (err){
								callback(false, err);
								return;
							}

							if (resp.statusCode !== 200) {
								callback(false, resp.statusMessage);
								return;
							}

							var keys = qs.parse(body);

							if (!keys.oauth_token || !keys.oauth_token_secret) {
								callback(false, "No device tokens received.");
								return;
							}

							callback(true, Object.assign(state, {deviceToken: keys.oauth_token, deviceSecret: keys.oauth_token_secret}));
						});
					});
				});
			});
		});
	});
}

module.exports.UnauthorizedAccess = function(state, callback){
	var date = stringHelper.date();
	var nonce = stringHelper.nonce();
	var url = mainUrl + "/auth/unauthorizedaccesses";

	oauthAssembly.baseParameter(date, nonce, null, null, state.deviceToken, function(baseParameterData){
		oauthAssembly.requestUrl(url, function(encodedUrl){
			oauthAssembly.signatureBaseString("POST", encodedUrl, baseParameterData, function(signatureBaseString){
				oauthAssembly.signature(signatureBaseString, null, state.deviceSecret, function(singature){
					oauthAssembly.authorizationHeader(date, nonce, singature, null, null, state.deviceToken, function(authHeader){
						request.post(url, {
							headers:{
								"Content-type":"application/x-www-form-urlencoded",
								"Authorization": authHeader
							}
						}, function(err, resp, body){
							if (err){
								callback(false, err);
								return;
							}

							if (resp.statusCode !== 200) {
								callback(false, resp.statusMessage);
								return;
							}

							var keys = qs.parse(body);

							if (!keys.oauth_token || !keys.oauth_token_secret) {
								callback(false, "No unauthorized tokens received.");
								return;
							}

							callback(true, Object.assign(state, {oauthToken: keys.oauth_token, oauthTokenSecret: keys.oauth_token_secret}))
						});
					});
				});
			});
		});
	});
};

module.exports.getAuthorizationUrl = function(state) {
	return mainUrl+ "/desiredaccessrights/request?oauth_token=" + state.oauthToken;
};

module.exports.AuthorizeAccess = function(verifierToken, state, callback) {
	var nonce = stringHelper.nonce();
	var date = stringHelper.date();
	var url = mainUrl + "/auth/accesses/verify";

	oauthAssembly.baseParameter(date, nonce, state.oauthToken, verifierToken, state.deviceToken, function(baseParameterData){
		oauthAssembly.requestUrl(url, function(encodedUrl){
			oauthAssembly.signatureBaseString("POST", encodedUrl, baseParameterData, function(signatureBaseString){
				oauthAssembly.signature(signatureBaseString, state.oauthTokenSecret, state.deviceSecret, function(signature){
					oauthAssembly.authorizationHeader(date, nonce, signature, state.oauthToken, verifierToken, state.deviceToken, function(authHeader){
						request.post(url, {headers:{
							"Content-type": "application/x-www-form-urlencoded",
							"Authorization": authHeader
						}}, function(err, resp, body){
							if (err) {
								callback(false, err);
								return;
							}

							if (resp.statusCode !== 200) {
								callback(false, resp.statusMessage);
								return;
							}

							var finalKeys = qs.parse(body);

							if(!finalKeys.oauth_token || !finalKeys.oauth_token_secret) {
								callback(false, "No authorized tokens received.");
								return;
							}

							callback(true, Object.assign(state, {oauthToken: finalKeys.oauth_token, oauthTokenSecret: finalKeys.oauth_token_secret}));
						})
					})
				})
			})
		})
	})
}
