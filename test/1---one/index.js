const fs = require('fs');
module.exports = {
  name: __dirname.split('/').pop(), //// 1---one
  args: [
    fs.readFileSync(__dirname + '/input.txt', 'utf-8'),
    "the",
    "hat"
  ],
  expected: fs.readFileSync(__dirname + '/expected.txt', 'utf-8')
};
