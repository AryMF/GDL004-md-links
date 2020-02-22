const fs = require('fs');

module.exports = parseURL = (filesArray) => {
	let results = [];
	let controlCounter = 0;
	const regexMdLinks = /\[(.*)\](\(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)\))/gm;
	const singleMatch = /\[(.*)\]\((https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*))\)/;
	//Iterar entre los elemetos del filesArray y sacar todos los matches
	for(let elementFile of filesArray){
		// ***** Leer el archivo *****
		const contents = fs.readFileSync(elementFile, 'utf8');
		//Conseguir array de links
		let matches = contents.match(regexMdLinks);
		//matches = matches.concat(matchesAux);
		//Validar que existan links para trabajar, sino mensaje de error.
		if(!matches) {
			controlCounter++;
		} else {
			//Formato de informacion
			fileInfo = matches.map(element => {
				let linkInfo = singleMatch.exec(element);
				let info = {
					href: linkInfo[2],
					text: linkInfo[1].substring(0, 50),
					file: elementFile
				};
				return info;
			});
			results = results.concat(fileInfo);
		}
	}

	if(controlCounter === filesArray.length) {
		throw 'No links to verify in the file.';
	} else {
		return results;
	}
};
