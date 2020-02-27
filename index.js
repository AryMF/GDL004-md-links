const validateFile = require('.\\src\\validateFile.js');
const parseURL = require('.\\src\\parseURL.js');
const urlStatusCheck = require('.\\src\\urlStatusCheck.js');
const calculateStats = require('.\\src\\calculateStats.js');

module.exports = mdLinks = ( filePath, options = { validate: false, stats: false } ) => {
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
			//options === -s, --stats
			if(options.stats === true) {
				results = calculateStats(results);
			}
			resolve(results);
		} catch (error) {
			reject( `${error}`);
		}
	});
	return promise;
}

let test3 = 'other/test.md'; // Archivo valido
let test4 = 'other/'; //Directorio con multiples archivos validos

mdLinks(test4, {validate: true, stats: true}).then(respuesta =>{
	console.log(respuesta);
}).catch(error => {
	console.log(error);
});
