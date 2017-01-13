var oauthVars = require("./oauthVars"),
	stringHelper = require("./stringHelper"),
	url = require("url");

module.exports.baseParameter = function baseParameterString(timestamp, nonce, oauthToken, oauthVerifier, deviceToken, callback) {
	var myBaseParameter = ""
	if (oauthToken === null && oauthVerifier === null) {
		myBaseParameter = oauthVars.vars.consumer_key + "=" + deviceToken + "&" + oauthVars.vars.nonce + "=" + nonce
			+ "&" + oauthVars.vars.signature_method + "=HMAC-SHA256" + "&" + oauthVars.vars.timestamp + "=" + timestamp +
			"&" + oauthVars.vars.version + "=1.0";
	}
	if (oauthVerifier === null && oauthToken !== null) {
		myBaseParameter = oauthVars.vars.date_since + "=0" + "&" + oauthVars.vars.max + "=100" + "&" + oauthVars.vars.consumer_key +
			"=" + deviceToken + "&" + oauthVars.vars.nonce + "=" + nonce
			+ "&" + oauthVars.vars.signature_method + "=HMAC-SHA256" + "&" + oauthVars.vars.timestamp + "=" + timestamp +
			"&" + oauthVars.vars.token + "=" + oauthToken + "&" + oauthVars.vars.version + "=1.0"+ "&" +oauthVars.vars.start + "=1";
	}
	if (oauthVerifier !== null && oauthToken !== null) {
		myBaseParameter = oauthVars.vars.consumer_key + "=" + deviceToken + "&" + oauthVars.vars.nonce + "=" + nonce
			+ "&" + oauthVars.vars.signature_method + "=HMAC-SHA256" + "&" + oauthVars.vars.timestamp + "=" + timestamp +
			"&" + oauthVars.vars.token + "=" + oauthToken + "&" + oauthVars.vars.verifier + "=" + oauthVerifier + "&"
			+ oauthVars.vars.version + "=1.0";
	}
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

module.exports.requestUrl = function requestUrl(myUrl, cb) {
	var parsedUrl = url.parse(myUrl);
	var formattedUrl = parsedUrl.protocol+"//"+parsedUrl.host+parsedUrl.pathname;
	var encodedUrl = stringHelper.myUrlEncoded(formattedUrl);
	cb(encodedUrl);
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
