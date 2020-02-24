const validateFile = require('.\\src\\validateFile.js');
const parseURL = require('.\\src\\parseURL.js');
const urlStatusCheck = require('.\\src\\urlStatusCheck.js');
const calculateStats = require('.\\src\\calculateStats.js');
const chalk = require('chalk');
const ora = require('ora');

module.exports = mdLinks = async (args) => {
	let failStatusCounter = 0;
	let filePath = args[2];
	let options = args.slice(3, args.length);

	try {
		//options === -h, --help
		//Imprimir ayuda

		//Validar si se recibio un directorio o un archivo
		let filesArray = validateFile(filePath);
		const spinner = ora().start();
		//Conseguir array de links -> options === vacio
		let results = parseURL(filesArray);

		//options === -v, --validate
		if(options.includes('-v') || options.includes('--validate')) {
			results = await urlStatusCheck(results);
		}

		//console.log(results);
		spinner.stop();

		//Imprimir resultados
		results.data.forEach(item => {
				let egg = '';
				item.responseCode === 418 ? egg = ' ᴺᵒ ᶜᵒᶠᶠᵉᵉ ⁴ ᵁ' : egg;
				let template = `${chalk.yellow('Path')}: ${item.file}  ${chalk.blue('Text')}: ${chalk.bold(item.text)}  ${chalk.magenta('Url')}: ${item.href}`;
				if(item.status === 'Ok') {
					template += `  ${chalk.yellow('Status')}: ${chalk.green.bold(item.status)}`;
				} else {
					template += `  ${chalk.yellow('Status')}: ${chalk.red.bold(item.status)}`;
					failStatusCounter++;
				}
				item.responseCode ? template += `  ResponseCode: ${chalk.cyanBright.bold(item.responseCode)}${chalk.greenBright(egg)}\n` : template += `\n`;
				console.log(template);
		});

		//options === -s, --stats
		if(options.includes('-s') || options.includes('--stats')) {
			results = calculateStats(results);
			let template = `TotalLinks: ${chalk.magenta.bold(results.stats.Total)}\n`;
			//Broken
			options.includes('-v') || options.includes('--validate')
			? template += `Broken: ${chalk.red.bold(results.stats.Broken)}\n`
			: template;

			console.log(template);
		}
	} catch (error) {
		console.log( `${error}`);
	}
}
