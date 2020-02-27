const validateFile = require('./src\\validateFile.js');
const parseURL = require('.\\src\\parseURL.js');
const urlStatusCheck = require('.\\src\\urlStatusCheck.js');
const calculateStats = require('.\\src\\calculateStats.js');
var yargs = require('yargs');
const chalk = require('chalk');
var Spinner = require('cli-spinner').Spinner;

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
  })
  .example('md-Links --path= <file/directory> --validate --stats')
  .argv;

//module.exports =
async function mdLinks (args) {
	try {
		const spinner = new Spinner('Processing.. %s	');
		spinner.setSpinnerString('|/-\\');
		//spinner.start();

		//Validar si se recibio un directorio o un archivo
		let filesArray = validateFile(args.path);
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
		console.log('\n\n');

		//Imprimir resultados
		results.data.forEach(item => {
				let egg = '';
				item.responseCode === 418 ? egg = ' ᴺᵒ ᶜᵒᶠᶠᵉᵉ ⁴ ᵁ' : egg;
				let template = `${chalk.yellow('Path')}: ${item.file}  ${chalk.blue('Text')}: ${chalk.bold(item.text)}  ${chalk.magenta('Url')}: ${item.href}`;
				if(item.status === 'Ok') {
					template += `  ${chalk.yellow('Status')}: ${chalk.green.bold(item.status)}`;
				} else {
					template += `  ${chalk.yellow('Status')}: ${chalk.red.bold(item.status)}`;
				}
				item.responseCode ? template += `  ResponseCode: ${chalk.cyanBright.bold(item.responseCode)}${chalk.greenBright(egg)}\n` : template += `\n`;
				console.log(template);
		});

		//options === -s, --stats
		if(args.stats) {
			results = calculateStats(results);
			let statsKeys = Object.keys(results.stats);
			let template = ``;
			statsKeys.forEach(element => {
				template += `${element}: ${chalk.magenta.bold(results.stats[element])}\n`;
			});
			console.log(template);
		}
	} catch (error) {
		console.log( `${error}`);
	}
}

//mdLinks(['nada', 'nada', 'other/test.md', '--validate', '--stats']);
mdLinks(argv);
