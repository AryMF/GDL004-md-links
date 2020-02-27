const validateFile = require('./src\\validateFile.js');
const parseURL = require('.\\src\\parseURL.js');
const urlStatusCheck = require('.\\src\\urlStatusCheck.js');
const calculateStats = require('.\\src\\calculateStats.js');
var yargs = require('yargs');
const chalk = require('chalk');
var Spinner = require('cli-spinner').Spinner;
const boxen = require('boxen');

const argv = yargs
  .usage('\nClean library that reads markdown text files and validates the state of the contained links [alive/dead].\n\nUsage: md-Links [options]')
  .help('help').alias('help', 'h')
  .version().alias('version', 'V')
  .options({
	path:	{
		alias: 'p',
		description: "<filename> Input file name.",
		requiresArg: true,
		required: true
	},
	validate:	{
		alias: 'v',
		description: 'Verify the status of each link on the file.',
		requiresArg: false,
		required: false
	},
    stats:	{
		alias: 's',
		description: 'Prints the number of links found and the number of unique links.',
		requiresArg: false,
		required: false
	},
	recursive:	{
		alias: 'r',
		description: 'Search in all the sub directories of the given path',
		requiresArg: false,
		required: false
	},
  })
  .example('md-Links --path= <file/directory> --validate --stats')
  .argv;

//export async function mdLinks(args){
module.exports = mdLinks = async (args) => {
	try {
		const spinner = new Spinner('Processing.. %s	');
		spinner.setSpinnerString('|/-\\');
		//spinner.start();

		//Validar si se recibio un directorio o un archivo
		let filesArray = validateFile(args.path, args.recursive);
		//const spinner = ora().start();
		spinner.start();
		//Conseguir array de links -> options === vacio
		spinner.setSpinnerTitle('Reading file.. %s	');
		let results = parseURL(filesArray);

		//options === -v, --validate
		if(args.validate) {
			spinner.setSpinnerTitle('Validating url.. %s	');
			results = await urlStatusCheck(results);
		}

		//console.log(results);
		spinner.stop(true);
		console.log('\n');

		//Imprimir resultados
		results.data.forEach(item => {
				let egg = '';
				item.responseCode === 418 ? egg = ' ᴺᵒ ᶜᵒᶠᶠᵉᵉ ⁴ ᵁ' : egg;
				let template = `${chalk.yellow('Path')}: ${item.file}  ${chalk.blue('Text')}: ${chalk.bold(item.text)}  ${chalk.magenta('Url')}: ${item.href}`;
				if(item.status){
					item.status === 'Ok' ? template += `  ${chalk.yellow('Status')}: ${chalk.green.bold(item.status)}`
					: template += `  ${chalk.yellow('Status')}: ${chalk.red.bold(item.status)}`;

					template += `  ResponseCode: ${chalk.cyanBright.bold(item.responseCode)}${chalk.greenBright(egg)}\n`
				} else {
					template += `\n`;
				}
				console.log(template);
		});

		//options === -s, --stats
		if(args.stats) {
			results = calculateStats(results, filesArray.length);
			let statsKeys = Object.keys(results.stats);
			let template = ``;
			statsKeys.forEach(element => {
				template += `${element}: ${chalk.magenta.bold(results.stats[element])}\n`;
			});
			console.log('\n\n' + boxen(chalk.cyan(template), {
				padding: 1,
				margin: {
					top: 1,
					left: 30,
					bottom: 1
				},
				borderColor: '#eebbaa',
				borderStyle: 'double'
			}) + '\n');
		}
	} catch (error) {
		console.log( `${error}`);
	}
}

mdLinks(argv);
