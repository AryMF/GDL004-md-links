const fs = require('fs');
const path = require('path');

module.exports = fileExtractor = (directory, recursive = false) => {
	let result = [];
	let dirContent = fs.readdirSync(directory, {withFileTypes: false});
	for(let element of dirContent){
		let fullPath = directory + '/' + element;
		//console.log(fullPath);
		if(fs.statSync(fullPath).isDirectory() && recursive){
			result = result.concat(fileExtractor(fullPath));
		} else {
			if(path.extname(fullPath) == '.md') {
				result.push(fullPath);
			}

		}
	}
	return result;
}
