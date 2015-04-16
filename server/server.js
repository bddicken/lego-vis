// load_data.js
//
// Load comma delimited data into mongodb
//

var express    = require('express');
var bodyParser = require('body-parser');

var program     = require('commander');
var csv         = require("fast-csv");
var fs          = require('fs');
var readline    = require('readline');

program
  .version('0.0.1')
  .option('-d, --data <fileName>','lego data directory')
  .parse(process.argv);

if (!program.data) {
    console.log("must specify all arguments.");
}

var pieces = {};
var setPieces = {};
var sets = {};
var colors = {};

var fileCount = 4;
var checkFinished = function(rowType) {
    console.log("Done processing " + rowType + " elements.");
    if (--fileCount <= 0) {
        console.log("Done processing all data elements. Server now ready to handle all requests.");
    }
}

////
//// Sets
////

var setStream = fs.createReadStream(program.data + '/sets.csv');
var setDone = false;
var setCSVStream = csv()
.on('end', function(line) {
    setDone = true;
    checkFinished("Set");
})
.on('data', function(line) {
    var set = {};
    set.id     = line[0];
    set.year   = line[1];
    set.peices = line[2];
    set.t1     = line[3];
    set.descr  = line[4];
    sets[set.id] = set;
});
setStream.pipe(setCSVStream);

////
//// setPeices
////

var setPieceStream = fs.createReadStream(program.data + '/set_pieces.csv');
var setPieceDone = false;
var setPieceCSVStream = csv()
.on('end', function(line) {
    setPieceDone = true;
    checkFinished("SetPiece");
})
.on('data', function(line) {
    var setPiece = {};
    setPiece.set_id   = line[0];
    setPiece.piece_id = line[1];
    setPiece.num      = line[2];
    setPiece.color    = line[3];
    setPiece.type     = line[4];
    setPieces[setPiece.set_id + "+" + setPiece.piece_id] = setPiece;
});
setPieceStream.pipe(setPieceCSVStream);

////
//// peices
////

var pieceStream = fs.createReadStream(program.data + '/pieces.csv');
var pieceDone = false;
var pieceCSVStream = csv()
.on('end', function(line) {
    pieceDone = true;
    checkFinished("piece");
})
.on('data', function(line) {
    var piece = {}; 
    piece.id       = line[0];
    piece.descr    = line[1];
    piece.category = line[2];
    pieces[piece.id] = piece;
});
pieceStream.pipe(pieceCSVStream);

////
//// color
////

var colorStream = fs.createReadStream(program.data + '/colors.csv');
var colorDone = false;
var colorCSVStream = csv()
.on('end', function(line) {
    colorDone = true;
    checkFinished("Color");
})
.on('data', function(line) {
    var color = {}; 
    color.id    = line[0];
    color.descr = line[1];
    colors[color.id] = color;
});
colorStream.pipe(colorCSVStream);

//////////////////////////// NOW FOR THE SERVER /////////////////////////////

var app        = express();
var maxReturn = 100000000;

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 9090;
var router = express.Router();              

// middleware to use for all requests
router.use(function(req, res, next) {
    console.log('Handling generic request.');

    // Dangerous!
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    res.header("Content-Type", "text/cache-manifest")

    next(); 
});

router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to the api!' });   
});

router.route('/pieces')
.get(function(req, res) {
    res.json(pieces);
});

app.use('/api', router);
app.listen(port);
console.log('Server running on port ' + port);

