# @arymf/md-links
![npm](https://img.shields.io/npm/v/@arymf/md-links) ![GitHub last commit](https://img.shields.io/github/last-commit/AryMF/GDL004-md-links) ![NPM](https://img.shields.io/npm/l/@arymf/md-links)

---
Library that reads markdown text files and validates the state of the contained links [alive/dead].

---

## Installation

To add the module to your project:

	npm install @arymf/md-links

---
## API

After recibing a valid path, mdLinks extracts all the urls of the valid files (markdown) and checks their status.

### mdLinks(\<path>, [options])

Parameters:
* `path`: The path to a markdown file or directory, that can contain more directories.
* `options`: Object of optional options, containing any of the following optional fields
	* `validate`: (boolean) Verify the status of each link on the file
	* `stats`: (boolean) Prints the number of links found and the number of unique links

Response:
* `resolve`: Results in a objects with the following properties:
	* `href`: Retrieved url
	* `text`: Text that accompanies the link
	* `file`: File/directory path
	* `status`: (Ok/Fail) Status of the url
	* `responseCode`: Responding code
* `reject`: Error code throw when the operation fails

### Module examples

**Basic usage**

```js
mdLinks('directory/file.md').then(response =>{
	console.log(response);
}).catch(err => {
	console.error(err);
});
```

**With options**

```js
mdLinks('directory/file.md', {validate: true, stats: true}).then(response =>{
	console.log(response);
}).catch(err => {
	console.error(err);
});
```
---

### CLI

**Check links from a markdown file**

	$ md-links -p ./readME.md -v

**Check links from a local markdown folder with recursive search**

	$ md-links -- path ./other --validate --recursive

**Usage**

	Usage: md-Links -p <path> [options]

	Options:
	--help, -h       Show help                                           [boolean]
	--version, -V    Show version number                                 [boolean]
	--path, -p       <filename> Input file name.                        [required]
	--validate, -v   Verify the status of each link on the file.
	--stats, -s      Prints the number of links found and the number of unique
					links.
	--recursive, -r  Search in all the sub directories of the given path

	Examples:
	md-Links --path= <file/directory> --validate --stats --recursive
