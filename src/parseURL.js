const fs = require('fs');

module.exports = (filesArray) => {
	const results = { data: []};
	let controlCounter = 0;
	const regexMdLinks = /\[(.*)\](\(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)\))/gm;
	const singleMatch = /\[(.*)\]\((https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*))\)/;
	// Iterar entre los elemetos del filesArray y sacar todos los matches
	for (const elementFile of filesArray) {
		// ***** Leer el archivo *****
		const contents = fs.readFileSync(elementFile, 'utf8');
		// Conseguir array de links
		const matches = contents.match(regexMdLinks);
		// Validar que existan links para trabajar.
		if (!matches) {
			controlCounter++;
		} else {
			// Formato de informacion
			fileInfo = matches.map((element) => {
				const linkInfo = singleMatch.exec(element);
				const info = {
					href: linkInfo[2],
					text: linkInfo[1].substring(0, 50),
					file: elementFile,
				};
				return info;
			});
			// results = results.concat(fileInfo);
			results.data = results.data.concat(fileInfo);
		}
	}

	if (controlCounter === filesArray.length) {
		throw 'No links to verify in the file.';
	} else {
		return results;
	}
};
