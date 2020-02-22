const fs = require('fs');
const path = require('path');

module.exports = validateFile = (filePath) => {
	//Validar si se recibio un directorio o un archivo
		let filesArray = [];
		const pathValidation = fs.statSync(filePath);
		if(pathValidation.isDirectory()) {
			//Si es directorio push al array de archivos a trabajar de todos los archivos con extension .md
			let file = fs.readdirSync(filePath);
			for(let element of file){
				if(path.extname(element) == '.md') {
					filesArray.push(`${filePath}${element}`);
				}
			}
		} else if(pathValidation.isFile() && path.extname(filePath) === '.md') {
			//Si es archivo push directo al array de archivos a trabajar
			filesArray.push(filePath);
		} else {
			throw new Error ('File or directory invalid.');
		}
		if(filesArray.length === 0){
			throw 'Empty directory.';
		}
		return filesArray;
};
