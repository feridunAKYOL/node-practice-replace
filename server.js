const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const replace = require('./logic');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// GET: '/files'
// response: {status: 'ok', files: ['all.txt','file.txt','names.txt']}
const list = fs.readdirSync(path.join(__dirname, 'files'));

app.get('/files' , (req,res) =>{
  res.json({ status: 'ok', files: list })
})


// POST: '/files/add/:name'
//  body: {text: "file contents"}
//  write a new files into ./files with the given name and contents
// redirect -> GET: '/files'

// PUT: '/files/replace/:oldFile/:newFile'
//  body: {toReplace: "str to replace", withThis: "replacement string"}
//  route logic:
//    read the old file
//    use the replace function to create the new text
//    write the new text to the new file name
//  note - params should not include .txt, you should add that in the route logic
// failure: {status: '404', message: `no file named ${oldFile}`  }
// success: redirect -> GET: '/files'

// GET: '/report'
//  reads the contents from ./test/report.json and sends it
// response: {status: 'ok', report }


const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Replacer is serving at http://localhost:${port}`));
