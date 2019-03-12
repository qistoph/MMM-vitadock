var oauthVars = require("./oauthVars"),
	stringHelper = require("./stringHelper"),
	url = require("url");

var iterateSorted = function(arr, worker) {
	var keys = [];
	for(var key in arr) {
		if(arr.hasOwnProperty(key)) {
			keys.push(key);
		}
	}
	keys.sort();

	var results = [];
	for(var i=0; i<keys.length; ++i) {
		results.push(worker(keys[i], arr[keys[i]]));
	}
	return results;
};

module.exports.baseParameter = function baseParameterString(timestamp, nonce, oauthToken, oauthVerifier, deviceToken, parameters, callback) {

	parameters[oauthVars.vars.timestamp] = timestamp;
	parameters[oauthVars.vars.nonce] = nonce;
	parameters[oauthVars.vars.consumer_key] = deviceToken;
	parameters[oauthVars.vars.signature_method] = 'HMAC-SHA256';
	parameters[oauthVars.vars.version] = "1.0";

	if (oauthToken !== null) {
		parameters[oauthVars.vars.token] = oauthToken;
	}
	if (oauthVerifier !== null) {
		parameters[oauthVars.vars.verifier] = oauthVerifier;
	}

	var myBaseParameter = iterateSorted(parameters, (k, v) => k + "=" + v).join("&");
	callback(myBaseParameter);
}
module.exports.signature = function signature(signatureBaseString, accessTokenSecret, deviceSecret, cb) {
	var mysecret = "";
	if (accessTokenSecret === null) {
		mysecret = deviceSecret + "&"
	} else {
		mysecret = deviceSecret + "&" + accessTokenSecret;
	}
	var mySignature = stringHelper.hmac(mysecret, signatureBaseString)
	cb(mySignature);
}

module.exports.requestUrl = function requestUrl(myUrl, params, cb) {
	myUrl += Object.keys(params).map((k) => k+"="+params[k]).join("&");
	var parsedUrl = url.parse(myUrl);
	var formattedUrl = parsedUrl.protocol+"//"+parsedUrl.host+parsedUrl.pathname;
	var encodedUrl = stringHelper.myUrlEncoded(formattedUrl);
	cb(myUrl, encodedUrl);
}

module.exports.signatureBaseString = function signatureBaseString(method, encodedRequestUrl, baseParameterString, cb) {
	var mySignatureBaseString = method + "&" + encodedRequestUrl + "&" + stringHelper.myUrlEncoded(baseParameterString);
	cb(mySignatureBaseString);
}

module.exports.authorizationHeader = function authorizationHeader(date, nonce, signature, accessToken, verifier, deviceToken, cb) {
	var myAuthorizationHeader = "";
	if (accessToken === null && verifier === null) {
		myAuthorizationHeader = "OAuth " + oauthVars.vars.consumer_key + "=\"" + deviceToken + "\"," + oauthVars.vars.nonce + "=\"" + nonce + "\","
			+ oauthVars.vars.signature_method + "=\"HMAC-SHA256\"," + oauthVars.vars.timestamp + "=\"" + date + "\","
			+ oauthVars.vars.version + "=\"1.0\"," + oauthVars.vars.signature + "=\"" + signature + "\"";
	}
	if (verifier === null && accessToken !== null) {
		myAuthorizationHeader = "OAuth " + oauthVars.vars.consumer_key + "=\"" + deviceToken + "\"," + oauthVars.vars.nonce + "=\"" + nonce + "\","
			+ oauthVars.vars.signature_method + "=\"HMAC-SHA256\"," + oauthVars.vars.timestamp + "=\"" + date + "\","
			+ oauthVars.vars.token + "=\"" + accessToken + "\"," + oauthVars.vars.version + "=\"1.0\","
			+ oauthVars.vars.signature + "=\"" + signature + "\"";
	}
	if (verifier != null && accessToken != null) {
		myAuthorizationHeader = "OAuth " + oauthVars.vars.consumer_key + "=\"" + deviceToken + "\"," + oauthVars.vars.nonce + "=\"" + nonce + "\","
			+ oauthVars.vars.signature_method + "=\"HMAC-SHA256\"," + oauthVars.vars.timestamp + "=\"" + date + "\","
			+ oauthVars.vars.token + "=\"" + accessToken + "\"," + oauthVars.vars.verifier + "=\"" + verifier + "\","
			+ oauthVars.vars.version + "=\"1.0\"," + oauthVars.vars.signature + "=\"" + signature + "\"";
	}
	cb(myAuthorizationHeader);
}
