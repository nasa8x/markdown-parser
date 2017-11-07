var Markdown = require('./index');

var fs = require('fs')
fs.readFile('./data.txt', 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }
    console.log( Markdown.parse(data));
});