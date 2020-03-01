const fs = require('fs');
const path = require('path');

const fileExtractor = (directory, recursive = false) => {
	let result = [];
	const dirContent = fs.readdirSync(directory, { withFileTypes: false });
	for (const element of dirContent) {
		const fullPath = `${directory}/${element}`;
		if (fs.statSync(fullPath).isDirectory() && recursive) {
			result = result.concat(fileExtractor(fullPath, recursive));
		} else if (path.extname(fullPath) === '.md') {
			result.push(fullPath);
		}
	}
	return result;
};

module.exports = fileExtractor;