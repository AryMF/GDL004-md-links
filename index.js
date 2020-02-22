const validateFile = require('.\\src\\validateFile.js');
const parseURL = require('.\\src\\parseURL.js');
const urlStatusCheck = require('.\\src\\urlStatusCheck.js');

module.exports = mdLinks = ( filePath, options = { validate: false } ) => {
	const promise = new Promise( async (resolve, reject) => {
		try {
			//Validar si se recibio un directorio o un archivo
			let filesArray = validateFile(filePath);
			//Conseguir array de links -> options === vacio
			let results = parseURL(filesArray);

			//options === -v, --validate
			if(options.validate === true) {
				results = await urlStatusCheck(results);
			}
			resolve(results);
		} catch (error) {
			reject( `${error}`);
		}
	});
	return promise;
}
