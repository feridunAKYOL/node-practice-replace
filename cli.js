const express = require('express');
const fs = require('fs');
const util = require('util');
const path = require('path');

const replace = require('./logic/index');

const readFile = util.promisify(fs.readFileSync);
const writeFile = util.promisify(fs.writeFile);

/* write a CLI interface for the "replace" function and your files

  command line arguments:
    1: the file you want to read from
    2: the old string to replace
    3: the new string to replace it with
    4: the file you want to write to

  examples:
  $ node cli.js the-book-of-sand.txt the any sand-the-any.txt
  $ node cli.js the-library-of-babel.txt f g library-f-g.txt

  behavior:
  : parse command line arguments from process.argv
    (let the user know if they are missing any arguments!)
  : read from the selected file in the './files' directory
  : use your logic function to create the new text
  : write to the new file
  : console.log a nice message letting the user know what happened

  little challenges:
  : -help
    if a user passes in "-help" as any command line argument,
    log a little description of how the CLI works
  : -list
    if a user passes in "-list" as any command line argument,
    log a list of all the file names in "./files"

*/
const DOC_TYPE = `
command line arguments:
    1: the file you want to read from
    2: the old string to replace
    3: the new string to replace it with
    4: the file you want to write to

  examples:
  $ node cli.js the-book-of-sand.txt the any sand-the-any.txt
  $ node cli.js the-library-of-babel.txt f g library-f-g.txt
  `;
if (process.argv.includes('-h')) {
	console.log(DOC_TYPE);
	// this line tells Node to stop right now, done, end, finished.
	//  it's kind of like an early return, but for a node app
	process.exit(0);
}

const list = fs.readdirSync(path.join(__dirname, 'files'));

const entriesManager = (oldFile, newWord, oldWord, newFile) => {
	if (oldFile == null) {
		console.log(`a fileName is required  \nSee "node cli.js -h"`);
		process.exit(0);
	}
	if (!list.includes(oldFile)) {
		console.log('you must enter a valid file from "files" for reading');
	}
	if (newWord == null) {
		console.log(`a string is required  \nSee "node cli.js -h"`);
		process.exit(0);
	}
	if (oldWord == null) {
		console.log(`another string is required to replace  \nSee "node cli.js -h"`);
		process.exit(0);
	}
	if (newFile == null) {
		console.log(`a fileName is required to write again \nSee "node cli.js -h"`);
		process.exit(0);
	} else {
		const FILE_PATH = path.join(__dirname, 'files', oldFile);
		const FILE_TARGET_PATH = path.join(__dirname, 'files', newFile);

		// const readFileCb = (err) => {
		// 	// step 4: handle file system error, or execute main app function
		// 	if (err) {
		// 		console.log(err);
		// 		return;
		// 	}
		// };
		const text = fs.readFileSync(FILE_PATH, 'utf-8');

		const newText = replace(text, newWord, oldWord);

		const writeFileCallback = (err) => {
			// let the user know if their changes were successfully saved
			if (err) {
				console.log(err);
			} else {
				console.log('your changes were saved');
			}
		};

		fs.writeFile(FILE_TARGET_PATH, newText, writeFileCallback);
	}
};

entriesManager(process.argv[2], process.argv[3], process.argv[4], process.argv[5]);
