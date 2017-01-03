var crypto = require("crypto"),
	uuid = require("node-uuid");


exports.hmac = function createHmac(key, base){
	return this.myUrlEncoded(crypto.createHmac("sha256", key).update(base).digest("base64"));

}
exports.myUrlEncoded = function myUrlEncoded(string){
	return encodeURIComponent(string)
		.replace(/!/g, "%21")
		.replace(/\*/g, "%2A")
		.replace(/\(/g, "%28")
		.replace(/\)/g, "%29")
		.replace(/'/g, "%27")
		.replace(/%20/g, "+");
}
exports.nonce = function nonceGenerator(){
	return uuid.v1().replace(/-/g, "a");
}

exports.date = function dateGenerator(){
	return new Date().getTime()
}
