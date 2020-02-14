const fs = require('fs');
const path = require('path');
const fetch = require("node-fetch");

module.exports = async function mdLinks ( filePath, options = { validate: false } ) {
	//Validar si se recibio un directorio o un archivo
	let fileArray = [];
	var pathValidation = fs.statSync(filePath);
	if(pathValidation.isDirectory()) {
		//Si es directorio push al array de archivos a trabajar de todos los archivos con extension .md
		let file = fs.readdirSync(filePath);
		for(let element of file){
			if(path.extname(element) == '.md') {
				fileArray.push(`${filePath}\\${element}`);
			}
		}
	} else {
		//Si es archivo push directo al array de archivos a trabajar
		fileArray.push(filePath);
	}

	// **** Ciclo en el array a trabajar ****
	let errorMsg = '';
	let resultsArray = await Promise.all(
		fileArray.map(async elementFile => {
			try {
				let results = [];
				// ***** Leer el archivo *****
				const contents = fs.readFileSync(elementFile, 'utf8');
				//Conseguir array de links
				const regexMdLinks = /\[(.*)\](\(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)\))/gm;
				const singleMatch = /\[(.*)\]\((https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*))\)/;
				let matches = contents.match(regexMdLinks);

				//Validar que existan links para trabajar, sino mensaje de error.
				if(!matches) { //Is null
					errorMsg = 'No links to verify in the file';
				} else {
					//options === vacio
					//debe identificar el archivo markdown (a partir de la ruta que recibe como argumento),
					//analizar el archivo Markdown e imprimir los links que vaya encontrando,
					//junto con la ruta del archivo donde aparece y el texto que hay dentro del link (truncado a 50 caracteres).
					results = matches.map(element => {
						let linkInfo = singleMatch.exec(element);
						let info = {
							href: linkInfo[2],
							text: linkInfo[1].substring(0, 50),
							file: elementFile
						};
						return info;
					});

					//options === -v, --validate
					if(options.validate === true) {
						//Llamadas a los links
						let linksStatus = await Promise.all(
							results.map(async url => {
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
					}

				}
				return results;
			}
			catch(error) {
				errorMsg = error.name + ': ' + error.message;
				return;
			}
		})
	);

	let promise = new Promise( (resolve, reject) => {
		if(errorMsg === '') {
			resolve(resultsArray);
		} else {
			reject(errorMsg);
		}
    });
    return promise;
}

/*mdLinks ( 'other', {validate : true} ).then(result => {
	console.log(result.length);
}).catch(error => {
	console.log(`***${error}***`);
});*/
