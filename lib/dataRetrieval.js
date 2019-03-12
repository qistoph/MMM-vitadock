var request = require("request"),
	oauthAssembly = require("./oauthAssembly"),
	stringHelper = require("./stringHelper");

var mainUrl = "https://cloud.vitadock.com";
if (process.env.NODE_ENV === "development") {
	mainUrl = "https://test-cloud.vitadock.com";
}

module.exports.getData = function getData(state, moduleName, callback){
	var nonce = stringHelper.nonce();
	var date = stringHelper.date();
	var params = {start: 1, max: 100, date_since: 0};

	var url = mainUrl+"/data/"+moduleName+"/sync?";

	oauthAssembly.baseParameter(date, nonce, state.oauthToken, null, state.deviceToken, params, function(baseParameterData){
		oauthAssembly.requestUrl(url, params, function(url, encodedUrl){
			oauthAssembly.signatureBaseString("GET", encodedUrl, baseParameterData, function(signatureBaseString){
				oauthAssembly.signature(signatureBaseString, state.oauthTokenSecret, state.deviceSecret, function(signature){
					oauthAssembly.authorizationHeader(date, nonce, signature, state.oauthToken, null, state.deviceToken, function(authHeader){
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
