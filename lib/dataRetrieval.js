var request = require("request"),
	oauthAssembly = require("./oauthAssembly"),
	stringHelper = require("./stringHelper");

var mainUrl = "https://cloud.vitadock.com";
if (process.env.NODE_ENV === "development") {
	mainUrl = "https://test-cloud.vitadock.com";
}

module.exports.getData = function getData(moduleName, params, creds, callback){
	var nonce = stringHelper.nonce();
	var date = stringHelper.date();
	var url = mainUrl+"/data/"+moduleName+"/sync?";

	oauthAssembly.baseParameter(date, nonce, creds.oauthToken, null, creds.deviceToken, params, function(baseParameterData){
		oauthAssembly.requestUrl(url, params, function(url, encodedUrl){
			oauthAssembly.signatureBaseString("GET", encodedUrl, baseParameterData, function(signatureBaseString){
				oauthAssembly.signature(signatureBaseString, creds.oauthTokenSecret, creds.deviceSecret, function(signature){
					oauthAssembly.authorizationHeader(date, nonce, signature, creds.oauthToken, null, creds.deviceToken, function(authHeader){
						request.get(url, {headers:{
							"Accept" : "application/json",
							"Content-Type": "application/json;charset=utf-8",
							"Authorization": authHeader
						}}, function(err, resp, body){
							if (err) {
								callback(false, {code: resp.statusCode, err: err, body: body});
								return;
							}

							if (resp.statusCode !== 200) {
								callback(false, {code: resp.statusCode, err: err, body: body});
								return;
							}

							var data = JSON.parse(body);
							callback(true, data);
						});
					})
				})
			})
		})
	})
}
