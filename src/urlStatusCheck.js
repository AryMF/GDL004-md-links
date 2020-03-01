const fetch = require('node-fetch');

module.exports = async (results) => {
	// Llamadas a los links
	const linksStatus = { data: []};
	linksStatus.data = await Promise.all(
		results.data.map(async (element, index) => {
			let urlResponse = {};
			try {
				urlResponse = await fetch(element.href);
			} catch (error) {
				urlResponse = {
					status: `${error.name}: ${error.message}`,
					ok: false,
				};
			}
			const status = urlResponse.ok === true ? 'Ok' : 'Fail';
			element.status = status;
			element.responseCode = urlResponse.status;
			return element;
		}),
	);
	return linksStatus;
};
