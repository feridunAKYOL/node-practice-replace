const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const replace = require('./logic');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const FILES_DIR = path.join(__dirname, 'files');

// GET: '/files'
// response: {status: 'ok', files: ['all.txt','file.txt','names.txt']}
const list = fs.readdirSync(path.join(__dirname, 'files'));

app.get('/', (req, res) => {
	res.send(`<h1> HELLO THERE </h1>
  <p>
  POST: '/files/add/:name'
 body: {text: "file contents"}
 write a new files into ./files with the given name and contents
redirect -> GET: '/files'
</p>
<p>
PUT: '/files/replace/:oldFile/:newFile'
 body: {toReplace: "str to replace", withThis: "replacement string"}
 
</p>
<p>
GET: '/report'
 reads the contents from ./test/report.json and sends it
response: {status: 'ok', report }

  </p>
  `);
});

app.get('/files', (req, res) => {
	res.json({ status: 'ok', files: list });
});

// POST: '/files/add/:name'
//  body: {text: "file contents"}
//  write a new files into ./files with the given name and contents
// redirect -> GET: '/files'

app.post('/files/add/:name', (req, res, next) => {
	const new_file = req.params.name;
	const content = {
		text: req.body.text
	};

	const writeFileCallback = (err) => {
		// let the user know if their changes were successfully saved
		if (err) {
			next(err);
			return;
		} else {
			console.log('your changes were saved');
		}
	};

	const newFile = fs.writeFile(`${FILES_DIR}/${new_file}`, content.text, writeFileCallback);
	res.redirect(200, '/files');
});

// PUT: '/files/replace/:oldFile/:newFile'
//  body: {toReplace: "str to replace", withThis: "replacement string"}
//  route logic:
//    read the old file
//    use the replace function to create the new text
//    write the new text to the new file name
//  note - params should not include .txt, you should add that in the route logic
// failure: {status: '404', message: `no file named ${oldFile}`  }
// success: redirect -> GET: '/files'

app.put('/files/replace/:oldFile/:newFile', async (req, res) => {
	const oldFile = req.params.oldFile;
	const newFile = req.params.newFile;
	const replaceStr = {
		toReplace: req.body.toReplace,
		withThis: req.body.withThis
	};
	try {
		const text = await fs.readFileSync(`${FILES_DIR}/${oldFile}.txt`, 'utf-8');
		const new_text = replace(text, replaceStr.toReplace, replaceStr.withThis);
		fs.writeFileSync(`${FILES_DIR}/${newFile}.txt`, new_text);
		res.redirect(200, '/files');
	} catch (err) {
		console.log(`{status: '404', message: no file named ${oldFile}`);
		res.send(`{status: '404', message: no file named ${oldFile}`);
	}
});

// GET: '/report'
//  reads the contents from ./test/report.json and sends it
// response: {status: 'ok', report }

app.get('/report', async (req, res) => {
	try {
		const report = await fs.readFileSync(`${__dirname}/test/report.json`, 'utf-8');
		res.send({ status: 'ok', report: report });
	} catch (err) {
		console.log(err.stack);
	}
});

app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(400).end();
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Replacer is serving at http://localhost:${port}`));
