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

const fileName = process.argv[2];

const toReplace = process.argv[3];
const withThis = process.argv[4];
const targetFile = process.argv[5];
const list = fs.readdirSync(path.join(__dirname, 'files'));

if (!toReplace || !withThis || !targetFile || !fileName) {
	console.log(`you should enter " $ node cli.js <read file> <old string> <new string> <target file>" `);
} else {
	if (!list.includes(fileName)) {
		console.log('you must enter a valid file for reading');
	} else {
		const FILE_PATH = path.join(__dirname, 'files', fileName);
		const FILE_TARGET_PATH = path.join(__dirname, 'files', targetFile);
		const text = fs.readFileSync(FILE_PATH, 'utf-8');

		const newText = replace(text, toReplace, withThis);

		fs.writeFileSync(FILE_TARGET_PATH, newText);
	}
}
