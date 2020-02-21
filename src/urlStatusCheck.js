const fetch = require("node-fetch");

module.exports = urlStatusCheck = async (results) => {
	//Llamadas a los links
	let linksStatus = await Promise.all(
		results.map(async (url) => {
			try {
				let urlResponse = await fetch(url.href);
				return [ urlResponse.status, urlResponse.ok ];
			}
			catch(error) {
				let text = error.name + ': ' + error.message;
				return [ text, false];
			}

		})
	);

	results.map((element, index) => {
		let status = linksStatus[index][1] === true ? 'Ok' : 'Fail';
		element['status'] = status;
		element['responseCode'] = linksStatus[index][0];
	});

	return results;
};
