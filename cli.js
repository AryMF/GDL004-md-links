#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const fetch = require("node-fetch");
const chalk = require('chalk');
const ora = require('ora');

export async function mdLinks (args) {
	let errorMsg = '';
	let failStatusCounter = 0;
	let filePath = args[2];
	let options = args.slice(3, args.length);

	//options === -h, --help
	//Imprimir ayuda

	//Validar si se recibio un directorio o un archivo
	let fileArray = [];
	try {
		const pathValidation = fs.statSync(filePath);
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
	} catch (error) {
		errorMsg = error.name + ': ' + error.message;
	}
	fileArray.length === 0 && errorMsg === '' ? errorMsg = 'No files to verify in the path' : errorMsg;

	// **** Ciclo en el array a trabajar ****
	let resultsArray = await Promise.all(
		fileArray.map(async elementFile => {
			const spinner = ora().start();
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
					if(options.includes('-v') || options.includes('--validate')) {
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
							status === 'Fail' ? failStatusCounter += 1 : failStatusCounter;
							element['status'] = status;
							element['responseCode'] = linksStatus[index][0];
						});
					}

				}
				spinner.stop();
				return results;
			}
			catch(error) {
				errorMsg = error.name + ': ' + error.message;
				spinner.stop();
				return;
			}
		})
	);

	if(errorMsg === ''){
		resultsArray.forEach(element => {
			element.map(item => {
				let egg = '';
				item.responseCode === 418 ? egg = ' ᴺᵒ ᶜᵒᶠᶠᵉᵉ ⁴ ᵁ' : egg;
				let template = `${chalk.yellow('Path')}: ${item.file}  ${chalk.blue('Text')}: ${chalk.bold(item.text)}  ${chalk.magenta('Url')}: ${item.href}`;
				item.status === 'Ok' ? template += `  ${chalk.yellow('Status')}: ${chalk.green.bold(item.status)}` : template;
				item.status === 'Fail' ? template += `  ${chalk.yellow('Status')}: ${chalk.red.bold(item.status)}` : template;
				item.responseCode ? template += `  ResponseCode: ${chalk.cyanBright.bold(item.responseCode)}${chalk.greenBright(egg)}\n` : template += `\n`;
				console.log(template);
			});
		});

		if(options.includes('-s') || options.includes('--stats')){
			//Numero de links
			let totalLinks = 0;
			for(const element of resultsArray) {
				totalLinks += element.length;
			}
			let template = `TotalLinks: ${chalk.magenta.bold(totalLinks)}\n`;
			//Broken
			options.includes('-v') || options.includes('--validate')
			? template += `Broken: ${chalk.red.bold(failStatusCounter)}\n`
			: template;

			console.log(template);
		}

	} else {
		console.log(errorMsg);
	}
}

//md-links other/test.md --validate --stats
//md-links other/test.md -v -s
