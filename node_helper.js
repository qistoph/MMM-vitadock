var NodeHelper = require("node_helper");
const Vitadock = require("./lib/dataRetrieval.js");

module.exports = NodeHelper.create({
	// Override start method.
	start: function() {
		console.log("Starting node helper for: " + this.name);
	},

	// Override socketNotificationReceived method.
	socketNotificationReceived: function(notification, payload) {
		//console.log("Notification received: " + notification);
		if (notification === "ADD_VITADOCK") {
			//console.log("ADD_STATION: ");
			this.createFetcher(payload); // payload = config
		}
	},

	sortByMeasurementDate: function(a, b) {
		if (a.measurementDate < b.measurementDate) {
			return -1;
		} else if(a.measurementDate > b.measurementDate) {
			return 1;
		} else if(a.measurementDate === b.measurementDate) {
			return 0;
		} else {
			throw "Can not compare data";
		}
	},

	createFetcher: function(config) {
		var self = this;

		//var data = [{"bodyWeight":63.338,"bodyFat":15.4354,"bmi":19.5488,"muscleMass":null,"boneMass":null,"bodyWater":54.709,"kcal":1528,"targetWeight":70,"athletic":0,"mealStatus":1,"activityStatus":2,"mood":0,"note":"","moduleSerialId":"[Autogenerated Item]","id":"fcb5b1b1-afc2-44a4-b43b-26e913d38b70","active":true,"version":1,"measurementDate":1480321639000,"updatedDate":1483432039000},{"bodyWeight":65.8264,"bodyFat":14.0805,"bmi":20.3168,"muscleMass":null,"boneMass":null,"bodyWater":53.8806,"kcal":1537,"targetWeight":70,"athletic":0,"mealStatus":0,"activityStatus":0,"mood":1,"note":"","moduleSerialId":"[Autogenerated Item]","id":"e14ed2bd-896d-4aa9-90df-8dba383f356f","active":true,"version":1,"measurementDate":1481790439000,"updatedDate":1483432039000},{"bodyWeight":67.0112,"bodyFat":10.6693,"bmi":20.6825,"muscleMass":null,"boneMass":null,"bodyWater":56.8204,"kcal":1540,"targetWeight":70,"athletic":0,"mealStatus":1,"activityStatus":0,"mood":2,"note":"","moduleSerialId":"[Autogenerated Item]","id":"478ec4e4-7190-4b66-8748-fbc368d9fbf1","active":true,"version":1,"measurementDate":1483345639000,"updatedDate":1483432039000},{"bodyWeight":62.2041,"bodyFat":19.1206,"bmi":19.1988,"muscleMass":null,"boneMass":null,"bodyWater":61.3254,"kcal":1463,"targetWeight":70,"athletic":0,"mealStatus":1,"activityStatus":3,"mood":2,"note":"","moduleSerialId":"[Autogenerated Item]","id":"0d3337bb-1ba7-4807-a48f-cd68a57e6f99","active":true,"version":1,"measurementDate":1475396839000,"updatedDate":1483432039000},{"bodyWeight":62.2859,"bodyFat":17.5597,"bmi":19.224,"muscleMass":null,"boneMass":null,"bodyWater":62.2532,"kcal":1428,"targetWeight":70,"athletic":0,"mealStatus":1,"activityStatus":3,"mood":0,"note":"","moduleSerialId":"[Autogenerated Item]","id":"e45879f3-4ba5-493a-ba21-89322127ae25","active":true,"version":1,"measurementDate":1476001639000,"updatedDate":1483432039000},{"bodyWeight":66.037,"bodyFat":14.9349,"bmi":20.3818,"muscleMass":null,"boneMass":null,"bodyWater":49.8148,"kcal":1523,"targetWeight":70,"athletic":0,"mealStatus":0,"activityStatus":0,"mood":1,"note":"","moduleSerialId":"[Autogenerated Item]","id":"3158df26-b95e-442c-a18e-1336ba687b14","active":true,"version":1,"measurementDate":1482308839000,"updatedDate":1483432039000},{"bodyWeight":58.3188,"bodyFat":17.3794,"bmi":17.9996,"muscleMass":null,"boneMass":null,"bodyWater":50.5879,"kcal":1494,"targetWeight":70,"athletic":0,"mealStatus":1,"activityStatus":1,"mood":0,"note":"","moduleSerialId":"[Autogenerated Item]","id":"784a1cba-aafd-4b4e-91f6-f3629e984f5d","active":true,"version":1,"measurementDate":1479371239000,"updatedDate":1483432039000},{"bodyWeight":60.4552,"bodyFat":17.6696,"bmi":18.659,"muscleMass":null,"boneMass":null,"bodyWater":51.1706,"kcal":1523,"targetWeight":70,"athletic":0,"mealStatus":0,"activityStatus":1,"mood":1,"note":"","moduleSerialId":"[Autogenerated Item]","id":"ee614873-a8b1-4912-9c19-14313dd79e87","active":true,"version":1,"measurementDate":1479803239000,"updatedDate":1483432039000},{"bodyWeight":61.6566,"bodyFat":13.8761,"bmi":19.0298,"muscleMass":null,"boneMass":null,"bodyWater":59.279,"kcal":1461,"targetWeight":70,"athletic":0,"mealStatus":0,"activityStatus":3,"mood":1,"note":"","moduleSerialId":"[Autogenerated Item]","id":"ec6ec863-993c-4047-9c2d-dbc5fec1a5c8","active":true,"version":1,"measurementDate":1477124839000,"updatedDate":1483432039000},{"bodyWeight":60.2136,"bodyFat":17.8446,"bmi":18.5844,"muscleMass":null,"boneMass":null,"bodyWater":52.744,"kcal":1473,"targetWeight":70,"athletic":0,"mealStatus":1,"activityStatus":3,"mood":1,"note":"","moduleSerialId":"[Autogenerated Item]","id":"618ff033-26a2-4325-80d0-2dc5feacbd32","active":true,"version":1,"measurementDate":1478766439000,"updatedDate":1483432039000},{"bodyWeight":60.7789,"bodyFat":18.4022,"bmi":18.7589,"muscleMass":null,"boneMass":null,"bodyWater":61.8407,"kcal":1461,"targetWeight":70,"athletic":0,"mealStatus":0,"activityStatus":1,"mood":0,"note":"","moduleSerialId":"[Autogenerated Item]","id":"67336b3c-eb54-4348-9e84-29a2b4ed357f","active":true,"version":1,"measurementDate":1476606439000,"updatedDate":1483432039000},{"bodyWeight":69.0243,"bodyFat":13.3184,"bmi":21.3038,"muscleMass":null,"boneMass":null,"bodyWater":49.6337,"kcal":1540,"targetWeight":70,"athletic":0,"mealStatus":1,"activityStatus":2,"mood":2,"note":"","moduleSerialId":"[Autogenerated Item]","id":"460541ee-5f43-4845-ba52-a1df292764cf","active":true,"version":1,"measurementDate":1482913639000,"updatedDate":1483432039000},{"bodyWeight":58.4989,"bodyFat":17.8218,"bmi":18.0552,"muscleMass":null,"boneMass":null,"bodyWater":60.1812,"kcal":1465,"targetWeight":70,"athletic":0,"mealStatus":0,"activityStatus":1,"mood":2,"note":"","moduleSerialId":"[Autogenerated Item]","id":"b6e635e4-8576-455d-a9a1-d695780d660d","active":true,"version":1,"measurementDate":1476692839000,"updatedDate":1483432039000},{"bodyWeight":62.7127,"bodyFat":19.802,"bmi":19.3558,"muscleMass":null,"boneMass":null,"bodyWater":55.4076,"kcal":1455,"targetWeight":70,"athletic":0,"mealStatus":0,"activityStatus":3,"mood":0,"note":"","moduleSerialId":"[Autogenerated Item]","id":"57017c6f-1216-4c0e-935a-559c74a17ad1","active":true,"version":1,"measurementDate":1477729639000,"updatedDate":1483432039000},{"bodyWeight":67.4498,"bodyFat":18.2908,"bmi":20.8178,"muscleMass":null,"boneMass":null,"bodyWater":61.6168,"kcal":1450,"targetWeight":70,"athletic":0,"mealStatus":0,"activityStatus":2,"mood":0,"note":"","moduleSerialId":"[Autogenerated Item]","id":"ad4175f2-9aee-4103-82d4-9cd261186e6f","active":true,"version":1,"measurementDate":1474878439000,"updatedDate":1483432039000},{"bodyWeight":68.1546,"bodyFat":10.1232,"bmi":21.0354,"muscleMass":null,"boneMass":null,"bodyWater":52.582,"kcal":1530,"targetWeight":70,"athletic":0,"mealStatus":0,"activityStatus":1,"mood":0,"note":"","moduleSerialId":"[Autogenerated Item]","id":"97a81606-0d10-47b5-b97e-3ff2799472e2","active":true,"version":1,"measurementDate":1481531239000,"updatedDate":1483432039000},{"bodyWeight":60.4438,"bodyFat":19.111,"bmi":18.6555,"muscleMass":null,"boneMass":null,"bodyWater":62.0729,"kcal":1453,"targetWeight":70,"athletic":0,"mealStatus":0,"activityStatus":1,"mood":1,"note":"","moduleSerialId":"[Autogenerated Item]","id":"9164d6ae-7f4d-472c-a770-90a09b902f54","active":true,"version":1,"measurementDate":1476433639000,"updatedDate":1483432039000},{"bodyWeight":62.591,"bodyFat":15.5867,"bmi":19.3182,"muscleMass":null,"boneMass":null,"bodyWater":54.534,"kcal":1538,"targetWeight":70,"athletic":0,"mealStatus":0,"activityStatus":0,"mood":1,"note":"","moduleSerialId":"[Autogenerated Item]","id":"97a6b91e-3b0c-4153-a8a4-d666bf26d234","active":true,"version":1,"measurementDate":1480148839000,"updatedDate":1483432039000},{"bodyWeight":61.347,"bodyFat":17.6102,"bmi":18.9343,"muscleMass":null,"boneMass":null,"bodyWater":61.8722,"kcal":1443,"targetWeight":70,"athletic":0,"mealStatus":1,"activityStatus":2,"mood":2,"note":"","moduleSerialId":"[Autogenerated Item]","id":"8b633ef7-aa6d-4bab-8d25-1132e119a777","active":true,"version":1,"measurementDate":1476260839000,"updatedDate":1483432039000},{"bodyWeight":63.2996,"bodyFat":16.7231,"bmi":19.5369,"muscleMass":null,"boneMass":null,"bodyWater":51.6278,"kcal":1531,"targetWeight":70,"athletic":0,"mealStatus":0,"activityStatus":1,"mood":0,"note":"","moduleSerialId":"[Autogenerated Item]","id":"33aab521-25ff-47e1-9bca-88c02af65b05","active":true,"version":1,"measurementDate":1479976039000,"updatedDate":1483432039000},{"bodyWeight":63.9799,"bodyFat":21.4066,"bmi":19.7469,"muscleMass":null,"boneMass":null,"bodyWater":53.6174,"kcal":1443,"targetWeight":70,"athletic":0,"mealStatus":0,"activityStatus":1,"mood":2,"note":"","moduleSerialId":"[Autogenerated Item]","id":"1ef32c39-ea98-4e47-9e21-d87a9320deb2","active":true,"version":1,"measurementDate":1478161639000,"updatedDate":1483432039000},{"bodyWeight":64.2906,"bodyFat":15.6459,"bmi":19.8428,"muscleMass":null,"boneMass":null,"bodyWater":52.9619,"kcal":1542,"targetWeight":70,"athletic":0,"mealStatus":1,"activityStatus":3,"mood":1,"note":"","moduleSerialId":"[Autogenerated Item]","id":"c3aa91e8-6d0a-4bfe-aa0b-38a9bb18a725","active":true,"version":1,"measurementDate":1481876839000,"updatedDate":1483432039000},{"bodyWeight":62.704,"bodyFat":13.6941,"bmi":19.3531,"muscleMass":null,"boneMass":null,"bodyWater":53.3212,"kcal":1531,"targetWeight":70,"athletic":0,"mealStatus":1,"activityStatus":3,"mood":0,"note":"","moduleSerialId":"[Autogenerated Item]","id":"e4e3bddc-469f-4657-8907-b295bba37233","active":true,"version":1,"measurementDate":1480667239000,"updatedDate":1483432039000},{"bodyWeight":68.2199,"bodyFat":11.4445,"bmi":21.0555,"muscleMass":null,"boneMass":null,"bodyWater":53.1991,"kcal":1539,"targetWeight":70,"athletic":0,"mealStatus":1,"activityStatus":2,"mood":2,"note":"","moduleSerialId":"[Autogenerated Item]","id":"e5bb7327-5f5b-4679-8807-9d9f90d9d4a7","active":true,"version":1,"measurementDate":1481617639000,"updatedDate":1483432039000},{"bodyWeight":61.4259,"bodyFat":15.3884,"bmi":18.9586,"muscleMass":null,"boneMass":null,"bodyWater":57.4755,"kcal":1454,"targetWeight":70,"athletic":0,"mealStatus":1,"activityStatus":0,"mood":2,"note":"","moduleSerialId":"[Autogenerated Item]","id":"ce71858a-98e2-4b9a-873b-dfda1163e309","active":true,"version":1,"measurementDate":1477211239000,"updatedDate":1483432039000},{"bodyWeight":61.6946,"bodyFat":16.2564,"bmi":19.0415,"muscleMass":null,"boneMass":null,"bodyWater":52.3394,"kcal":1523,"targetWeight":70,"athletic":0,"mealStatus":1,"activityStatus":2,"mood":0,"note":"","moduleSerialId":"[Autogenerated Item]","id":"f9854642-9790-4758-ba60-aa75fb41a025","active":true,"version":1,"measurementDate":1479889639000,"updatedDate":1483432039000},{"bodyWeight":66.4302,"bodyFat":18.4816,"bmi":20.5031,"muscleMass":null,"boneMass":null,"bodyWater":60.506,"kcal":1465,"targetWeight":70,"athletic":0,"mealStatus":1,"activityStatus":1,"mood":1,"note":"","moduleSerialId":"[Autogenerated Item]","id":"3c155dd3-aaed-44a8-8475-2395be9d30ac","active":true,"version":1,"measurementDate":1475137639000,"updatedDate":1483432039000},{"bodyWeight":66.8663,"bodyFat":22.031,"bmi":20.6377,"muscleMass":null,"boneMass":null,"bodyWater":53.2868,"kcal":1450,"targetWeight":70,"athletic":0,"mealStatus":1,"activityStatus":3,"mood":2,"note":"","moduleSerialId":"[Autogenerated Item]","id":"43ace909-91bc-41f5-adf7-2cdfcc19b050","active":true,"version":1,"measurementDate":1478334439000,"updatedDate":1483432039000},{"bodyWeight":59.954,"bodyFat":16.9008,"bmi":18.5043,"muscleMass":null,"boneMass":null,"bodyWater":58.6308,"kcal":1455,"targetWeight":70,"athletic":0,"mealStatus":1,"activityStatus":0,"mood":2,"note":"","moduleSerialId":"[Autogenerated Item]","id":"5eb722c6-3461-423b-990d-b3cc7e591c06","active":true,"version":1,"measurementDate":1476779239000,"updatedDate":1483432039000},{"bodyWeight":61.8579,"bodyFat":15.9921,"bmi":19.092,"muscleMass":null,"boneMass":null,"bodyWater":55.069,"kcal":1448,"targetWeight":70,"athletic":0,"mealStatus":1,"activityStatus":1,"mood":1,"note":"","moduleSerialId":"[Autogenerated Item]","id":"aff8b7fb-8573-4bbe-bed1-e27aa1cdb1b0","active":true,"version":1,"measurementDate":1477556839000,"updatedDate":1483432039000},{"bodyWeight":61.5359,"bodyFat":15.3246,"bmi":18.9925,"muscleMass":null,"boneMass":null,"bodyWater":52.971,"kcal":1538,"targetWeight":70,"athletic":0,"mealStatus":1,"activityStatus":3,"mood":1,"note":"","moduleSerialId":"[Autogenerated Item]","id":"fc204134-e490-4d24-9729-0a849a5840e4","active":true,"version":1,"measurementDate":1480062439000,"updatedDate":1483432039000},{"bodyWeight":63.882,"bodyFat":18.4794,"bmi":19.7167,"muscleMass":null,"boneMass":null,"bodyWater":60.7924,"kcal":1465,"targetWeight":70,"athletic":0,"mealStatus":0,"activityStatus":2,"mood":2,"note":"","moduleSerialId":"[Autogenerated Item]","id":"901a5072-6154-409c-b55b-8c8feb8707b5","active":true,"version":1,"measurementDate":1475483239000,"updatedDate":1483432039000},{"bodyWeight":60.8333,"bodyFat":14.5762,"bmi":18.7757,"muscleMass":null,"boneMass":null,"bodyWater":59.0048,"kcal":1469,"targetWeight":70,"athletic":0,"mealStatus":1,"activityStatus":3,"mood":2,"note":"","moduleSerialId":"[Autogenerated Item]","id":"3792cb24-acff-4fdf-b9ac-7b7ec078f4d6","active":true,"version":1,"measurementDate":1477038439000,"updatedDate":1483432039000},{"bodyWeight":59.2569,"bodyFat":17.8921,"bmi":18.2892,"muscleMass":null,"boneMass":null,"bodyWater":62.591,"kcal":1451,"targetWeight":70,"athletic":0,"mealStatus":1,"activityStatus":2,"mood":1,"note":"","moduleSerialId":"[Autogenerated Item]","id":"9cfba8c4-9a26-4410-a28f-64be28356db4","active":true,"version":1,"measurementDate":1476520039000,"updatedDate":1483432039000},{"bodyWeight":65.2179,"bodyFat":17.4696,"bmi":20.129,"muscleMass":null,"boneMass":null,"bodyWater":60.7592,"kcal":1459,"targetWeight":70,"athletic":0,"mealStatus":0,"activityStatus":0,"mood":0,"note":"","moduleSerialId":"[Autogenerated Item]","id":"c5fff1f6-37af-4228-807c-6c48aac7f3a8","active":true,"version":1,"measurementDate":1475224039000,"updatedDate":1483432039000},{"bodyWeight":63.2781,"bodyFat":17.5106,"bmi":19.5303,"muscleMass":null,"boneMass":null,"bodyWater":61.0855,"kcal":1462,"targetWeight":70,"athletic":0,"mealStatus":1,"activityStatus":1,"mood":1,"note":"","moduleSerialId":"[Autogenerated Item]","id":"7ac3158a-f5d6-43d1-b5a6-39cb4f1b8dcd","active":true,"version":1,"measurementDate":1475310439000,"updatedDate":1483432039000},{"bodyWeight":60.0299,"bodyFat":14.5184,"bmi":18.5277,"muscleMass":null,"boneMass":null,"bodyWater":57.6356,"kcal":1466,"targetWeight":70,"athletic":0,"mealStatus":0,"activityStatus":1,"mood":2,"note":"","moduleSerialId":"[Autogenerated Item]","id":"3955f78f-5fb4-4197-96c2-dcc7ee8d05ca","active":true,"version":1,"measurementDate":1476952039000,"updatedDate":1483432039000},{"bodyWeight":58.4635,"bodyFat":15.9985,"bmi":18.0443,"muscleMass":null,"boneMass":null,"bodyWater":50.0699,"kcal":1501,"targetWeight":70,"athletic":0,"mealStatus":0,"activityStatus":1,"mood":1,"note":"","moduleSerialId":"[Autogenerated Item]","id":"9ad81ddb-5293-4722-9ff8-5c4a0530a3ed","active":true,"version":1,"measurementDate":1479284839000,"updatedDate":1483432039000},{"bodyWeight":61.3575,"bodyFat":16.1644,"bmi":18.9375,"muscleMass":null,"boneMass":null,"bodyWater":55.8533,"kcal":1451,"targetWeight":70,"athletic":0,"mealStatus":0,"activityStatus":3,"mood":0,"note":"","moduleSerialId":"[Autogenerated Item]","id":"27966898-7ddb-45cd-8610-dfb19cf3043d","active":true,"version":1,"measurementDate":1477470439000,"updatedDate":1483432039000},{"bodyWeight":63.0932,"bodyFat":14.0318,"bmi":19.4732,"muscleMass":null,"boneMass":null,"bodyWater":55.8733,"kcal":1529,"targetWeight":70,"athletic":0,"mealStatus":0,"activityStatus":3,"mood":2,"note":"","moduleSerialId":"[Autogenerated Item]","id":"5faa953a-d791-431b-a6e7-56633e0d0f83","active":true,"version":1,"measurementDate":1480926439000,"updatedDate":1483432039000},{"bodyWeight":65.1135,"bodyFat":16.9495,"bmi":20.0968,"muscleMass":null,"boneMass":null,"bodyWater":52.4221,"kcal":1527,"targetWeight":70,"athletic":0,"mealStatus":0,"activityStatus":1,"mood":2,"note":"","moduleSerialId":"[Autogenerated Item]","id":"05779ecb-f7e0-4bb5-bba5-6db469f3e465","active":true,"version":1,"measurementDate":1482136039000,"updatedDate":1483432039000},{"bodyWeight":63.4875,"bodyFat":18.7781,"bmi":19.5949,"muscleMass":null,"boneMass":null,"bodyWater":54.2543,"kcal":1446,"targetWeight":70,"athletic":0,"mealStatus":1,"activityStatus":1,"mood":0,"note":"","moduleSerialId":"[Autogenerated Item]","id":"c950c737-7ffc-4f53-aa64-31a1aac373cf","active":true,"version":1,"measurementDate":1477816039000,"updatedDate":1483432039000},{"bodyWeight":62.596,"bodyFat":20.0934,"bmi":19.3198,"muscleMass":null,"boneMass":null,"bodyWater":62.3095,"kcal":1457,"targetWeight":70,"athletic":0,"mealStatus":1,"activityStatus":1,"mood":1,"note":"","moduleSerialId":"[Autogenerated Item]","id":"47cdee79-bce0-4648-aa4a-932105b5b872","active":true,"version":1,"measurementDate":1475569639000,"updatedDate":1483432039000},{"bodyWeight":67.6184,"bodyFat":13.9248,"bmi":20.8699,"muscleMass":null,"boneMass":null,"bodyWater":49.2455,"kcal":1537,"targetWeight":70,"athletic":0,"mealStatus":0,"activityStatus":2,"mood":1,"note":"","moduleSerialId":"[Autogenerated Item]","id":"6186d7b4-f2d1-4897-ba09-a9ad74355056","active":true,"version":1,"measurementDate":1482827239000,"updatedDate":1483432039000},{"bodyWeight":67.341,"bodyFat":10.1357,"bmi":20.7843,"muscleMass":null,"boneMass":null,"bodyWater":54.624,"kcal":1530,"targetWeight":70,"athletic":0,"mealStatus":1,"activityStatus":1,"mood":0,"note":"","moduleSerialId":"[Autogenerated Item]","id":"a0ff1178-6737-4b15-9fb0-3ea6e7dd4ec4","active":true,"version":1,"measurementDate":1481185639000,"updatedDate":1483432039000},{"bodyWeight":67.028,"bodyFat":14.8253,"bmi":20.6877,"muscleMass":null,"boneMass":null,"bodyWater":51.4573,"kcal":1538,"targetWeight":70,"athletic":0,"mealStatus":0,"activityStatus":3,"mood":1,"note":"","moduleSerialId":"[Autogenerated Item]","id":"a484033b-a6f8-4bec-9253-9b23dbfa4252","active":true,"version":1,"measurementDate":1483000039000,"updatedDate":1483432039000},{"bodyWeight":60.306,"bodyFat":15.5585,"bmi":18.613,"muscleMass":null,"boneMass":null,"bodyWater":56.6132,"kcal":1451,"targetWeight":70,"athletic":0,"mealStatus":0,"activityStatus":0,"mood":0,"note":"","moduleSerialId":"[Autogenerated Item]","id":"e31f1d49-cf9c-4d5b-ad71-288a9e1b4be6","active":true,"version":1,"measurementDate":1477297639000,"updatedDate":1483432039000},{"bodyWeight":62.9368,"bodyFat":14.1313,"bmi":19.425,"muscleMass":null,"boneMass":null,"bodyWater":53.7387,"kcal":1533,"targetWeight":70,"athletic":0,"mealStatus":1,"activityStatus":3,"mood":2,"note":"","moduleSerialId":"[Autogenerated Item]","id":"94326e3d-66b6-496f-a5aa-fef2b887db6b","active":true,"version":1,"measurementDate":1480408039000,"updatedDate":1483432039000},{"bodyWeight":63.8382,"bodyFat":17.0876,"bmi":19.7031,"muscleMass":null,"boneMass":null,"bodyWater":55.4539,"kcal":1531,"targetWeight":70,"athletic":0,"mealStatus":0,"activityStatus":0,"mood":0,"note":"","moduleSerialId":"[Autogenerated Item]","id":"2c98f025-994e-4f57-b560-fe1a82e07b75","active":true,"version":1,"measurementDate":1480235239000,"updatedDate":1483432039000},{"bodyWeight":58.8941,"bodyFat":16.179,"bmi":18.1772,"muscleMass":null,"boneMass":null,"bodyWater":51.9934,"kcal":1481,"targetWeight":70,"athletic":0,"mealStatus":1,"activityStatus":0,"mood":1,"note":"","moduleSerialId":"[Autogenerated Item]","id":"81e38187-75ca-4bf6-bc80-eddadfb9e1d3","active":true,"version":1,"measurementDate":1479025639000,"updatedDate":1483432039000},{"bodyWeight":61.2081,"bodyFat":18.2148,"bmi":18.8914,"muscleMass":null,"boneMass":null,"bodyWater":62.1141,"kcal":1444,"targetWeight":70,"athletic":0,"mealStatus":1,"activityStatus":0,"mood":0,"note":"","moduleSerialId":"[Autogenerated Item]","id":"c7c64e5a-b123-4757-b35c-8ae644bf81db","active":true,"version":1,"measurementDate":1476347239000,"updatedDate":1483432039000},{"bodyWeight":62.9941,"bodyFat":20.6471,"bmi":19.4426,"muscleMass":null,"boneMass":null,"bodyWater":55.7165,"kcal":1440,"targetWeight":70,"athletic":0,"mealStatus":0,"activityStatus":2,"mood":0,"note":"","moduleSerialId":"[Autogenerated Item]","id":"5224a5d9-d157-4646-a7b8-461f6c6d1297","active":true,"version":1,"measurementDate":1477902439000,"updatedDate":1483432039000},{"bodyWeight":69.1196,"bodyFat":13.1086,"bmi":21.3332,"muscleMass":null,"boneMass":null,"bodyWater":52.818,"kcal":1523,"targetWeight":70,"athletic":0,"mealStatus":0,"activityStatus":2,"mood":2,"note":"","moduleSerialId":"[Autogenerated Item]","id":"3a00e121-3fb4-49e2-ba58-1b38255741b9","active":true,"version":1,"measurementDate":1481444839000,"updatedDate":1483432039000},{"bodyWeight":68.9792,"bodyFat":11.9342,"bmi":21.2899,"muscleMass":null,"boneMass":null,"bodyWater":53.0392,"kcal":1525,"targetWeight":70,"athletic":0,"mealStatus":0,"activityStatus":3,"mood":1,"note":"","moduleSerialId":"[Autogenerated Item]","id":"24cc4daf-7644-47de-aff1-d13fa2256cb4","active":true,"version":1,"measurementDate":1481272039000,"updatedDate":1483432039000},{"bodyWeight":65.1098,"bodyFat":13.944,"bmi":20.0956,"muscleMass":null,"boneMass":null,"bodyWater":49.6327,"kcal":1530,"targetWeight":70,"athletic":0,"mealStatus":1,"activityStatus":2,"mood":2,"note":"","moduleSerialId":"[Autogenerated Item]","id":"5aa74264-f022-4566-92cf-e034600e01bd","active":true,"version":1,"measurementDate":1482395239000,"updatedDate":1483432039000},{"bodyWeight":62.4985,"bodyFat":14.5806,"bmi":19.2897,"muscleMass":null,"boneMass":null,"bodyWater":53.8541,"kcal":1534,"targetWeight":70,"athletic":0,"mealStatus":1,"activityStatus":2,"mood":2,"note":"","moduleSerialId":"[Autogenerated Item]","id":"b9b01ec6-307e-43ef-84ce-25535ecc5da9","active":true,"version":1,"measurementDate":1480494439000,"updatedDate":1483432039000},{"bodyWeight":65.948,"bodyFat":10.5133,"bmi":20.3543,"muscleMass":null,"boneMass":null,"bodyWater":55.4565,"kcal":1525,"targetWeight":70,"athletic":0,"mealStatus":1,"activityStatus":2,"mood":1,"note":"","moduleSerialId":"[Autogenerated Item]","id":"c7c755e8-fb3c-4e6e-bdff-f9dc20fdf9a8","active":true,"version":1,"measurementDate":1481099239000,"updatedDate":1483432039000},{"bodyWeight":67.8716,"bodyFat":17.7095,"bmi":20.948,"muscleMass":null,"boneMass":null,"bodyWater":58.7818,"kcal":1456,"targetWeight":70,"athletic":0,"mealStatus":1,"activityStatus":0,"mood":0,"note":"","moduleSerialId":"[Autogenerated Item]","id":"76802d4c-b588-4bba-a96e-ac31eef44019","active":true,"version":1,"measurementDate":1475051239000,"updatedDate":1483432039000},{"bodyWeight":62.4349,"bodyFat":11.4723,"bmi":19.27,"muscleMass":null,"boneMass":null,"bodyWater":55.1929,"kcal":1525,"targetWeight":70,"athletic":0,"mealStatus":0,"activityStatus":0,"mood":0,"note":"","moduleSerialId":"[Autogenerated Item]","id":"690fa062-a55e-4a6f-8114-a6e24ee2c2df","active":true,"version":1,"measurementDate":1480753639000,"updatedDate":1483432039000},{"bodyWeight":63.1837,"bodyFat":21.5616,"bmi":19.5011,"muscleMass":null,"boneMass":null,"bodyWater":51.3458,"kcal":1456,"targetWeight":70,"athletic":0,"mealStatus":0,"activityStatus":1,"mood":0,"note":"","moduleSerialId":"[Autogenerated Item]","id":"52b59180-269f-4a3b-9add-1bdbabf81029","active":true,"version":1,"measurementDate":1478507239000,"updatedDate":1483432039000},{"bodyWeight":61.2974,"bodyFat":18.7278,"bmi":18.919,"muscleMass":null,"boneMass":null,"bodyWater":49.9052,"kcal":1516,"targetWeight":70,"athletic":0,"mealStatus":0,"activityStatus":1,"mood":2,"note":"","moduleSerialId":"[Autogenerated Item]","id":"ed60f100-47f9-49dc-83f9-adf67ab6c074","active":true,"version":1,"measurementDate":1479630439000,"updatedDate":1483432039000},{"bodyWeight":61.0023,"bodyFat":15.9715,"bmi":18.8279,"muscleMass":null,"boneMass":null,"bodyWater":62.3159,"kcal":1438,"targetWeight":70,"athletic":0,"mealStatus":1,"activityStatus":0,"mood":0,"note":"","moduleSerialId":"[Autogenerated Item]","id":"e6564fc0-6907-4ceb-b7f5-2b1ac8c8eaf7","active":true,"version":1,"measurementDate":1476088039000,"updatedDate":1483432039000},{"bodyWeight":66.077,"bodyFat":14.8147,"bmi":20.3941,"muscleMass":null,"boneMass":null,"bodyWater":49.0826,"kcal":1546,"targetWeight":70,"athletic":0,"mealStatus":0,"activityStatus":1,"mood":0,"note":"","moduleSerialId":"[Autogenerated Item]","id":"98cf247d-0c41-4932-8f3a-9c76c64df36b","active":true,"version":1,"measurementDate":1482740839000,"updatedDate":1483432039000},{"bodyWeight":64.0739,"bodyFat":12.2973,"bmi":19.7759,"muscleMass":null,"boneMass":null,"bodyWater":54.6606,"kcal":1532,"targetWeight":70,"athletic":0,"mealStatus":1,"activityStatus":1,"mood":0,"note":"","moduleSerialId":"[Autogenerated Item]","id":"15226ce6-daf9-44ec-aede-e6216e83aa55","active":true,"version":1,"measurementDate":1481012839000,"updatedDate":1483432039000},{"bodyWeight":67.9847,"bodyFat":12.9216,"bmi":20.9829,"muscleMass":null,"boneMass":null,"bodyWater":53.2512,"kcal":1536,"targetWeight":70,"athletic":0,"mealStatus":0,"activityStatus":3,"mood":0,"note":"","moduleSerialId":"[Autogenerated Item]","id":"3e621a2a-7784-4328-8e86-7e55585752cb","active":true,"version":1,"measurementDate":1483086439000,"updatedDate":1483432039000},{"bodyWeight":61.6573,"bodyFat":16.0718,"bmi":19.03,"muscleMass":null,"boneMass":null,"bodyWater":59.5183,"kcal":1462,"targetWeight":70,"athletic":0,"mealStatus":0,"activityStatus":0,"mood":2,"note":"","moduleSerialId":"[Autogenerated Item]","id":"018dca0c-37c9-44e8-928c-a561329326d5","active":true,"version":1,"measurementDate":1476865639000,"updatedDate":1483432039000},{"bodyWeight":63.6923,"bodyFat":12.9821,"bmi":19.6581,"muscleMass":null,"boneMass":null,"bodyWater":49.1155,"kcal":1546,"targetWeight":70,"athletic":0,"mealStatus":0,"activityStatus":1,"mood":0,"note":"","moduleSerialId":"[Autogenerated Item]","id":"e3798556-5dde-43fd-8fa0-f7cda660d008","active":true,"version":1,"measurementDate":1482568039000,"updatedDate":1483432039000},{"bodyWeight":63.4979,"bodyFat":12.3753,"bmi":19.5981,"muscleMass":null,"boneMass":null,"bodyWater":55.7769,"kcal":1527,"targetWeight":70,"athletic":0,"mealStatus":1,"activityStatus":2,"mood":0,"note":"","moduleSerialId":"[Autogenerated Item]","id":"a39b66e1-400b-434a-97aa-a2773f1bcd41","active":true,"version":1,"measurementDate":1480840039000,"updatedDate":1483432039000},{"bodyWeight":59.081,"bodyFat":16.2478,"bmi":18.2349,"muscleMass":null,"boneMass":null,"bodyWater":53.1478,"kcal":1480,"targetWeight":70,"athletic":0,"mealStatus":1,"activityStatus":1,"mood":2,"note":"","moduleSerialId":"[Autogenerated Item]","id":"796dcb26-236a-4641-bb73-56b9bcdf1901","active":true,"version":1,"measurementDate":1478939239000,"updatedDate":1483432039000},{"bodyWeight":58.4119,"bodyFat":16.7032,"bmi":18.0284,"muscleMass":null,"boneMass":null,"bodyWater":51.0509,"kcal":1490,"targetWeight":70,"athletic":0,"mealStatus":0,"activityStatus":1,"mood":0,"note":"","moduleSerialId":"[Autogenerated Item]","id":"e33a66cd-2ca7-42ca-ba44-46339bfc2750","active":true,"version":1,"measurementDate":1479112039000,"updatedDate":1483432039000},{"bodyWeight":64.6695,"bodyFat":17.0419,"bmi":19.9597,"muscleMass":null,"boneMass":null,"bodyWater":51.7761,"kcal":1538,"targetWeight":70,"athletic":0,"mealStatus":1,"activityStatus":0,"mood":1,"note":"","moduleSerialId":"[Autogenerated Item]","id":"b694fcfa-c9f6-451b-b92e-314e22402697","active":true,"version":1,"measurementDate":1481963239000,"updatedDate":1483432039000},{"bodyWeight":59.9495,"bodyFat":16.281,"bmi":18.5029,"muscleMass":null,"boneMass":null,"bodyWater":62.0729,"kcal":1435,"targetWeight":70,"athletic":0,"mealStatus":0,"activityStatus":3,"mood":1,"note":"","moduleSerialId":"[Autogenerated Item]","id":"6812a05a-53b5-4a81-b52d-07b3b3aa3ce2","active":true,"version":1,"measurementDate":1476174439000,"updatedDate":1483432039000},{"bodyWeight":58.1009,"bodyFat":17.4262,"bmi":17.9324,"muscleMass":null,"boneMass":null,"bodyWater":54.4722,"kcal":1471,"targetWeight":70,"athletic":0,"mealStatus":0,"activityStatus":1,"mood":1,"note":"","moduleSerialId":"[Autogenerated Item]","id":"46c0c97e-1755-4ba0-bfa4-6a9e77b72804","active":true,"version":1,"measurementDate":1478852839000,"updatedDate":1483432039000},{"bodyWeight":63.9797,"bodyFat":13.4625,"bmi":19.7468,"muscleMass":null,"boneMass":null,"bodyWater":51.3115,"kcal":1538,"targetWeight":70,"athletic":0,"mealStatus":1,"activityStatus":1,"mood":2,"note":"","moduleSerialId":"[Autogenerated Item]","id":"a5b0d47a-c9c8-4291-b790-89db16bd5246","active":true,"version":1,"measurementDate":1482481639000,"updatedDate":1483432039000},{"bodyWeight":62.9587,"bodyFat":19.4334,"bmi":19.4317,"muscleMass":null,"boneMass":null,"bodyWater":64.3485,"kcal":1445,"targetWeight":70,"athletic":0,"mealStatus":1,"activityStatus":3,"mood":1,"note":"","moduleSerialId":"[Autogenerated Item]","id":"fe645efe-6e67-442b-8dad-6b23861491fa","active":true,"version":1,"measurementDate":1475742439000,"updatedDate":1483432039000},{"bodyWeight":62.3783,"bodyFat":20.9411,"bmi":19.2526,"muscleMass":null,"boneMass":null,"bodyWater":51.4315,"kcal":1460,"targetWeight":70,"athletic":0,"mealStatus":1,"activityStatus":0,"mood":0,"note":"","moduleSerialId":"[Autogenerated Item]","id":"c50a30c8-688b-4851-a720-e641ade93328","active":true,"version":1,"measurementDate":1478593639000,"updatedDate":1483432039000},{"bodyWeight":63.1965,"bodyFat":20.0473,"bmi":19.5051,"muscleMass":null,"boneMass":null,"bodyWater":62.9121,"kcal":1445,"targetWeight":70,"athletic":0,"mealStatus":0,"activityStatus":1,"mood":1,"note":"","moduleSerialId":"[Autogenerated Item]","id":"100a6a57-d985-4028-b1a9-78217335c829","active":true,"version":1,"measurementDate":1475828839000,"updatedDate":1483432039000},{"bodyWeight":69.246,"bodyFat":12.0061,"bmi":21.3722,"muscleMass":null,"boneMass":null,"bodyWater":51.4941,"kcal":1522,"targetWeight":70,"athletic":0,"mealStatus":0,"activityStatus":0,"mood":0,"note":"","moduleSerialId":"[Autogenerated Item]","id":"86f8bb76-2c05-4765-b618-72650e73a71d","active":true,"version":1,"measurementDate":1481358439000,"updatedDate":1483432039000},{"bodyWeight":60.7869,"bodyFat":19.3838,"bmi":18.7614,"muscleMass":null,"boneMass":null,"bodyWater":50.8173,"kcal":1470,"targetWeight":70,"athletic":0,"mealStatus":0,"activityStatus":1,"mood":1,"note":"","moduleSerialId":"[Autogenerated Item]","id":"9fff3ac9-9152-4a5a-b43f-f017d0cf48c5","active":true,"version":1,"measurementDate":1478680039000,"updatedDate":1483432039000},{"bodyWeight":60.5648,"bodyFat":16.8501,"bmi":18.6928,"muscleMass":null,"boneMass":null,"bodyWater":57.8213,"kcal":1448,"targetWeight":70,"athletic":0,"mealStatus":0,"activityStatus":3,"mood":1,"note":"","moduleSerialId":"[Autogenerated Item]","id":"4f9049f0-8bb0-424a-84bc-70f4e3879cee","active":true,"version":1,"measurementDate":1477384039000,"updatedDate":1483432039000},{"bodyWeight":58.7998,"bodyFat":16.8266,"bmi":18.1481,"muscleMass":null,"boneMass":null,"bodyWater":48.3256,"kcal":1499,"targetWeight":70,"athletic":0,"mealStatus":0,"activityStatus":3,"mood":2,"note":"","moduleSerialId":"[Autogenerated Item]","id":"49d76b94-b49f-4f93-8978-4136d675b3cc","active":true,"version":1,"measurementDate":1479198439000,"updatedDate":1483432039000},{"bodyWeight":67.7765,"bodyFat":12.3034,"bmi":20.9187,"muscleMass":null,"boneMass":null,"bodyWater":52.3987,"kcal":1540,"targetWeight":70,"athletic":0,"mealStatus":0,"activityStatus":2,"mood":2,"note":"","moduleSerialId":"[Autogenerated Item]","id":"78eb3e04-c8fb-458e-9071-0579c6fbb107","active":true,"version":1,"measurementDate":1481704039000,"updatedDate":1483432039000},{"bodyWeight":69.2324,"bodyFat":10.7759,"bmi":21.368,"muscleMass":null,"boneMass":null,"bodyWater":53.3455,"kcal":1541,"targetWeight":70,"athletic":0,"mealStatus":0,"activityStatus":1,"mood":2,"note":"","moduleSerialId":"[Autogenerated Item]","id":"ceba8e57-c010-4f1e-a79e-c5e8318c641c","active":true,"version":1,"measurementDate":1483172839000,"updatedDate":1483432039000},{"bodyWeight":65.9294,"bodyFat":18.385,"bmi":20.3486,"muscleMass":null,"boneMass":null,"bodyWater":51.3343,"kcal":1530,"targetWeight":70,"athletic":0,"mealStatus":0,"activityStatus":1,"mood":1,"note":"","moduleSerialId":"[Autogenerated Item]","id":"a6e72d53-761f-4883-bf11-cc3a8ffbd60b","active":true,"version":1,"measurementDate":1482049639000,"updatedDate":1483432039000},{"bodyWeight":64.1799,"bodyFat":19.3431,"bmi":19.8086,"muscleMass":null,"boneMass":null,"bodyWater":62.5285,"kcal":1447,"targetWeight":70,"athletic":0,"mealStatus":0,"activityStatus":2,"mood":0,"note":"","moduleSerialId":"[Autogenerated Item]","id":"975134c2-70cc-4025-af49-c1e68b9d0fc8","active":true,"version":1,"measurementDate":1475656039000,"updatedDate":1483432039000},{"bodyWeight":63.5017,"bodyFat":14.3649,"bmi":19.5993,"muscleMass":null,"boneMass":null,"bodyWater":53.9331,"kcal":1525,"targetWeight":70,"athletic":0,"mealStatus":0,"activityStatus":0,"mood":2,"note":"","moduleSerialId":"[Autogenerated Item]","id":"2065bc3f-8d32-44e4-a57d-6bda8900046d","active":true,"version":1,"measurementDate":1480580839000,"updatedDate":1483432039000},{"bodyWeight":65.192,"bodyFat":21.9286,"bmi":20.121,"muscleMass":null,"boneMass":null,"bodyWater":53.5639,"kcal":1449,"targetWeight":70,"athletic":0,"mealStatus":1,"activityStatus":1,"mood":1,"note":"","moduleSerialId":"[Autogenerated Item]","id":"cfdaf7b0-ad00-4e21-ae78-7d832b1fc7a9","active":true,"version":1,"measurementDate":1478248039000,"updatedDate":1483432039000},{"bodyWeight":68.2971,"bodyFat":11.5608,"bmi":21.0793,"muscleMass":null,"boneMass":null,"bodyWater":57.196,"kcal":1542,"targetWeight":70,"athletic":0,"mealStatus":0,"activityStatus":0,"mood":2,"note":"","moduleSerialId":"[Autogenerated Item]","id":"d70a33c8-b4fc-47d2-a73c-c4af8932c3a1","active":true,"version":1,"measurementDate":1483432039000,"updatedDate":1483432039000},{"bodyWeight":64.7557,"bodyFat":13.0892,"bmi":19.9863,"muscleMass":null,"boneMass":null,"bodyWater":49.9601,"kcal":1546,"targetWeight":70,"athletic":0,"mealStatus":1,"activityStatus":1,"mood":2,"note":"","moduleSerialId":"[Autogenerated Item]","id":"695f97de-0f07-468d-b0bf-8c05af4fd6e7","active":true,"version":1,"measurementDate":1482654439000,"updatedDate":1483432039000},{"bodyWeight":60.4704,"bodyFat":18.3005,"bmi":18.6637,"muscleMass":null,"boneMass":null,"bodyWater":48.1014,"kcal":1509,"targetWeight":70,"athletic":0,"mealStatus":0,"activityStatus":2,"mood":1,"note":"","moduleSerialId":"[Autogenerated Item]","id":"2583b6d7-840f-46b1-9a54-b34dde7ef077","active":true,"version":1,"measurementDate":1479544039000,"updatedDate":1483432039000},{"bodyWeight":68.6765,"bodyFat":17.7198,"bmi":21.1965,"muscleMass":null,"boneMass":null,"bodyWater":60.1458,"kcal":1454,"targetWeight":70,"athletic":0,"mealStatus":1,"activityStatus":0,"mood":2,"note":"","moduleSerialId":"[Autogenerated Item]","id":"84b55b19-a10f-42ec-8bfc-b8bd014d35b8","active":true,"version":1,"measurementDate":1474964839000,"updatedDate":1483432039000},{"bodyWeight":61.7092,"bodyFat":19.3858,"bmi":19.0461,"muscleMass":null,"boneMass":null,"bodyWater":61.315,"kcal":1437,"targetWeight":70,"athletic":0,"mealStatus":1,"activityStatus":1,"mood":0,"note":"","moduleSerialId":"[Autogenerated Item]","id":"e1466369-5552-4d59-8697-615e20a7aa95","active":true,"version":1,"measurementDate":1475915239000,"updatedDate":1483432039000},{"bodyWeight":61.1622,"bodyFat":18.0174,"bmi":18.8772,"muscleMass":null,"boneMass":null,"bodyWater":51.0225,"kcal":1525,"targetWeight":70,"athletic":0,"mealStatus":1,"activityStatus":3,"mood":2,"note":"","moduleSerialId":"[Autogenerated Item]","id":"2026c0e7-9374-4c82-8265-31d78f0963fe","active":true,"version":1,"measurementDate":1479716839000,"updatedDate":1483432039000},{"bodyWeight":65.0507,"bodyFat":20.1137,"bmi":20.0774,"muscleMass":null,"boneMass":null,"bodyWater":51.9078,"kcal":1458,"targetWeight":70,"athletic":0,"mealStatus":0,"activityStatus":2,"mood":2,"note":"","moduleSerialId":"[Autogenerated Item]","id":"1a8b23ce-b76d-4af1-badf-ee93f231a497","active":true,"version":1,"measurementDate":1478420839000,"updatedDate":1483432039000},{"bodyWeight":68.7543,"bodyFat":11.4061,"bmi":21.2205,"muscleMass":null,"boneMass":null,"bodyWater":55.1842,"kcal":1541,"targetWeight":70,"athletic":0,"mealStatus":0,"activityStatus":3,"mood":1,"note":"","moduleSerialId":"[Autogenerated Item]","id":"a7fd1a9d-0894-4087-bf2a-835486de8817","active":true,"version":1,"measurementDate":1483259239000,"updatedDate":1483432039000},{"bodyWeight":65.5943,"bodyFat":15.632,"bmi":20.2452,"muscleMass":null,"boneMass":null,"bodyWater":51.0359,"kcal":1528,"targetWeight":70,"athletic":0,"mealStatus":1,"activityStatus":0,"mood":1,"note":"","moduleSerialId":"[Autogenerated Item]","id":"a65e98a7-2ae5-46a2-b94c-3597fee728bc","active":true,"version":1,"measurementDate":1482222439000,"updatedDate":1483432039000},{"bodyWeight":65.2863,"bodyFat":20.4328,"bmi":20.1501,"muscleMass":null,"boneMass":null,"bodyWater":55.3367,"kcal":1433,"targetWeight":70,"athletic":0,"mealStatus":1,"activityStatus":3,"mood":1,"note":"","moduleSerialId":"[Autogenerated Item]","id":"b883d693-3850-4d83-8779-a082c58835e9","active":true,"version":1,"measurementDate":1478075239000,"updatedDate":1483432039000},{"bodyWeight":60.7898,"bodyFat":17.8037,"bmi":18.7623,"muscleMass":null,"boneMass":null,"bodyWater":53.7871,"kcal":1449,"targetWeight":70,"athletic":0,"mealStatus":1,"activityStatus":1,"mood":1,"note":"","moduleSerialId":"[Autogenerated Item]","id":"a713d5b8-bfb6-444f-9b8d-a8fb07811de1","active":true,"version":1,"measurementDate":1477643239000,"updatedDate":1483432039000},{"bodyWeight":63.972,"bodyFat":20.0758,"bmi":19.7445,"muscleMass":null,"boneMass":null,"bodyWater":54.8899,"kcal":1433,"targetWeight":70,"athletic":0,"mealStatus":0,"activityStatus":2,"mood":1,"note":"","moduleSerialId":"[Autogenerated Item]","id":"afdb55e5-d6cf-4fb2-848a-ff1b1d970d57","active":true,"version":1,"measurementDate":1477988839000,"updatedDate":1483432039000},{"bodyWeight":84.4902,"bodyFat":10.9976,"bmi":26.0772,"muscleMass":null,"boneMass":null,"bodyWater":66.9464,"kcal":1409,"targetWeight":70,"athletic":0,"mealStatus":0,"activityStatus":0,"mood":2,"note":"","moduleSerialId":"[Autogenerated Item]","id":"cddeec5a-8db8-4d9f-9de6-c248facfb2a9","active":true,"version":1,"measurementDate":1483086443000,"updatedDate":1483432043000}];

		Vitadock.getData(config.credentials, "targetscales", function(success, data) {
			if(!success) {
				console.log("Unable to retrieve Vitadock targetscales data: " + data);
				return;
			}

			data = data.sort(self.sortByMeasurementDate);
			self.sendSocketNotification("VITADOCK_TARGETSCALES", {
				id: config.credentials.oauthToken,
				data: data,
			});
		});
		//*/

		/*data.forEach( function(row) {
			console.log(new Date(row.measurementDate) + ": " + row.bodyWeight + "kg " + row.bodyFat + "%");
		});*/

	},
});
