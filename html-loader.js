var express = require('express');
var app = express();
const port = 3000;

app.use('/', express.static(__dirname + '/html'));
app.listen(port, function() {
    console.log('Ends in [control + C]');
});
