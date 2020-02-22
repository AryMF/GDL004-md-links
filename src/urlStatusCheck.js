const fetch = require("node-fetch");

module.exports = urlStatusCheck = async (results) => {
	//Llamadas a los links
	let linksStatus = await Promise.all(
		results.map(async (element, index) => {
			let urlResponse = {};
			try {
				urlResponse = await fetch(element.href);
			}
			catch(error) {
				urlResponse = {
					status: error.name + ': ' + error.message,
					ok: false
				}
			}
			let status = urlResponse.ok === true ? 'Ok' : 'Fail';
			element['status'] = status;
			element['responseCode'] = urlResponse.status;
			return element;
		})
	);
	return linksStatus;
};
