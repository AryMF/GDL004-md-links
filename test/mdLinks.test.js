const validateFile = require('../src/validateFile.js');
const fileExtractor = require('../src/fileExtractor.js');
const parseURL = require('../src/parseURL.js');
const urlStatusCheck = require('../src/urlStatusCheck.js');
const calculateStats = require('../src/calculateStats.js');

const dataOneFile = require('../test/_mock_/mockInfo.js');
const dataMultipleFiles = require('../test/_mock_/mockInfoMultipleFile.js');
const afterValidateData = require('../test/_mock_/mockURLvalidate.js');

const singleFileArray = [ './other/test.md' ];
const multipleFileArray =	[
	'./other/secondDir/test4.md',
	'./other/test.md',
	'./other/test2.md',
	'./other/test3.md',
];
const noURLFile = [ './other/test3.md' ];

const statsResultsWithBroken = {
	Files: 1, Total: 13, Unique: 13, Broken: 7,
};
const statsResults = { Files: 4, Total: 61, Unique: 41 };

describe('validateFile', () => {
	it('debería ser una función', () => {
		expect(typeof validateFile).toBe('function');
	});
	it('Retornar "File or directory invalid." para archivo invalido ', () => {
		expect(() => { validateFile('other/temp.txt'); }).toThrow('File or directory invalid.');
	});
	it('Retornar "Empty directory." para directorio vacio ', () => {
		expect(() => { validateFile('other/secondDir/noMdDir'); }).toThrow('Empty directory.');
	});
	it('Retornar error para archivo mal escrito', () => {
		expect(() => { validateFile('other/test.m'); }).toThrow("ENOENT: no such file or directory, stat 'other/test.m'");
	});
	it('Retornar error para directorio mal escrito', () => {
		expect(() => { validateFile('othe'); }).toThrow("ENOENT: no such file or directory, stat 'othe\'");
	});
	it('Retornar array con path de archivo para archivo valido', () => {
		expect(validateFile('./other/test.md')).toEqual(expect.arrayContaining(singleFileArray));
	});
	it('Retornar array con paths de archivos para directorio valido', () => {
		expect(validateFile('./other', true)).toEqual(expect.arrayContaining(multipleFileArray));
	});
});

describe('fileExtractor', () => {
	it('debería ser una función', () => {
		expect(typeof fileExtractor).toBe('function');
	});
	it('Retornar array con paths de archivos para directorio valido', () => {
		expect(fileExtractor('./other', true)).toEqual(expect.arrayContaining(multipleFileArray));
	});
});

describe('parseURL', () => {
	it('debería ser una función', () => {
		expect(typeof parseURL).toBe('function');
	});
	it('Retornar un array de objetos para un array de un solo path de archivo', () => {
		expect(parseURL(singleFileArray)).toEqual(dataOneFile);
	});
	it('Retornar un array de objetos para un array de multiples paths de archivos', () => {
		expect(parseURL(multipleFileArray)).toEqual(dataMultipleFiles);
	});
	it('Retornar "No links to verify in the file" para un archivo sin URLs', () => {
		expect(() => { parseURL(noURLFile); }).toThrow('No links to verify in the file.');
	});
});

describe('urlStatusCheck', () => {
	it('debería ser una función', () => {
		expect(typeof urlStatusCheck).toBe('function');
	});
	it('Retornar un array de objetos con el URL validado', async () => {
		const promise = await Promise.resolve(urlStatusCheck(dataOneFile));
		expect(promise).toEqual(afterValidateData);
	});
});

describe('calculateStats', () => {
	it('debería ser una función', () => {
		expect(typeof calculateStats).toBe('function');
	});
	it('Retornar objeto con propiedades { Total: 13, Unique: 13, Broken: 7 } para data con url validadas', () => {
		expect(calculateStats(afterValidateData, singleFileArray.length).stats).toEqual(expect.objectContaining(statsResultsWithBroken));
	});
	it('Retornar objeto con propiedades { Total: 61, Unique: 41 } para data con url no validadas', () => {
		expect(calculateStats(dataMultipleFiles, multipleFileArray.length).stats).toEqual(expect.objectContaining(statsResults));
	});
});
