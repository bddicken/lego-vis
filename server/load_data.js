// load_data.js
//
// Load comma delimited data into mongodb
//

var mongoose    = require('mongoose');

var Set      = require('./app/models/set');
var Piece    = require('./app/models/piece');
var SetPiece = require('./app/models/setPiece');
var Color    = require('./app/models/color');

var program     = require('commander');
var csv         = require("fast-csv");
var fs          = require('fs');
var readline    = require('readline');

var dbConnectString = 'mongodb://localhost/legodb';
mongoose.connect(dbConnectString); 

program
  .version('0.0.1')
  .option('-s, --set <fileName>',       'set')
  .option('-p, --piece <fileName>',     'piece')
  .option('-c, --color <fileName>',     'color')
  .option('-e, --setPiece <fileName>', 'set piece')
  .parse(process.argv);

if (
    !program.set      ||
    !program.piece    ||
    !program.color    ||
    !program.setPiece
   ) {
    console.log("must specify all arguments.");
}

var fileCount = 4;
var checkFinished = function(rowCount, rowType) {
    if (rowCount == 0) {
        console.log("Done processing " + rowType + " elements.");
        fileCount--;
    }
    if (fileCount == 0) {
        console.log("Done processing all Files. Exiting.");
        process.exit(code=0);
    }
}

////
//// Sets
////

var setStream = fs.createReadStream(program.set);
var setCount = 1;
var setCSVStream = csv()
.on('end', function(line) {
    console.log("Done processing set"); 
    setCount--;
    checkFinished(setCount, "Set");
})
.on('data', function(line) {
    setCount++;
    var set = new Set(); 
    set.id     = line[0];
    set.year   = line[1];
    set.peices = line[2];
    set.t1     = line[3];
    set.descr  = line[4];
    set.save(function(err) { 
        if (err) { console.log('FAILED -> ' + err); }
        setCount--;
        checkFinished(setCount, "Set");
    });
});
setStream.pipe(setCSVStream);

////
//// setPeices
////

var setPieceStream = fs.createReadStream(program.setPiece);
var setPieceCount = 1;
var setPieceCSVStream = csv()
.on('end', function(line) {
    console.log("Done processing setPiece"); 
    setPieceCount--;
    checkFinished(setPieceCount, "SetPiece");
})
.on('data', function(line) {
    setPieceCount++;
    var setPiece = new SetPiece(); 
    setPiece.set_id   = line[0];
    setPiece.piece_id = line[1];
    setPiece.num      = line[2];
    setPiece.color    = line[3];
    setPiece.type     = line[4];
    setPiece.save(function(err) { 
        if (err) { console.log('FAILED -> ' + err); }
        setPieceCount--;
        checkFinished(setPieceCount, "SetPiece");
    });
});
setPieceStream.pipe(setPieceCSVStream);

////
//// peices
////

var pieceStream = fs.createReadStream(program.piece);
var pieceCount = 1;
var pieceCSVStream = csv()
.on('end', function(line) {
    console.log("Done processing piece"); 
    pieceCount--;
    checkFinished(pieceCount, "piece");
})
.on('data', function(line) {
    pieceCount++;
    var piece = new Piece(); 
    piece.id       = line[0];
    piece.descr    = line[1];
    piece.category = line[2];
    piece.save(function(err) { 
        if (err) { console.log('FAILED -> ' + err); }
        pieceCount--;
        checkFinished(pieceCount, "Piece");
    });
});
pieceStream.pipe(pieceCSVStream);

////
//// color
////

var colorStream = fs.createReadStream(program.color);
var colorCount = 1;
var colorCSVStream = csv()
.on('end', function(line) {
    console.log("Done processing color"); 
    colorCount--;
    checkFinished(colorCount, "Color");
})
.on('data', function(line) {
    colorCount++;
    var color = new Color(); 
    color.id    = line[0];
    color.descr = line[1];
    color.save(function(err) { 
        if (err) { console.log('FAILED -> ' + err); }
        colorCount--;
        checkFinished(colorCount, "Color");
    });
});
colorStream.pipe(colorCSVStream);







