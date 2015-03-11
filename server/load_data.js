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
  .option('-s, --sets <fileName>',       'sets')
  .option('-p, --pieces <fileName>',     'pieces')
  .option('-c, --colors <fileName>',     'colors')
  .option('-e, --setPieces <fileName>', 'set pieces')
  .parse(process.argv);

console.log('event file:');
if (
    !program.sets      ||
    !program.pieces    ||
    !program.colors    ||
    !program.setPieces
   ) {
    console.log("must specify all arguments.");
}

////
//// Sets
////

var setIO = readline.createInterface({
    input: fs.createReadStream(program.sets),
    output: process.stdout,
    terminal: false
});

setIO.on('close', function(line) {
    console.log("Done processing sets"); 
});

setIO.on('line', function(line) {
    raw = line.split(',');
    
    var set = new Set(); 
    set.id = raw[0];
    set.year   = raw[1];
    set.peices = raw[2];
    set.t1     = raw[3];
    set.descr  = raw[4];

    set.save(function(err) { if (err) { console.log('FAILED -> ' + err); } });
});

////
//// setPieces
////

var setPieceIO = readline.createInterface({
    input: fs.createReadStream(program.setPieces),
    output: process.stdout,
    terminal: false
});

setPieceIO.on('close', function(line) {
    console.log("Done processing setPieces"); 
});

setPieceIO.on('line', function(line) {
    raw = line.split(',');
    
    var setPiece = new SetPiece(); 
    setPiece.set_id   = raw[0];
    setPiece.piece_id = raw[1];
    setPiece.num      = raw[2];
    setPiece.color    = raw[3];
    setPiece.type     = raw[4];

    setPiece.save(function(err) { if (err) { console.log('FAILED -> ' + err); } });
});

////
//// Pieces
////

var pieceIO = readline.createInterface({
    input: fs.createReadStream(program.pieces),
    output: process.stdout,
    terminal: false
});

pieceIO.on('close', function(line) {
    console.log("Done processing pieces"); 
});

pieceIO.on('line', function(line) {
    raw = line.split(',');
    
    var piece = new Piece(); 
    piece.id       = raw[0];
    piece.descr    = raw[1];
    piece.category = raw[2];

    piece.save(function(err) { if (err) { console.log('FAILED -> ' + err); } });
});

////
//// Colors
////

var colorIO = readline.createInterface({
    input: fs.createReadStream(program.colors),
    output: process.stdout,
    terminal: false
});

colorIO.on('close', function(line) {
    console.log("Done processing colors"); 
});

colorIO.on('line', function(line) {
    raw = line.split(',');
    
    var color = new Color(); 
    color.id    = raw[0];
    color.descr = raw[1];

    color.save(function(err) { if (err) { console.log('FAILED -> ' + err); } });
});

