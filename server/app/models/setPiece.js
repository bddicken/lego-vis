var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var SetPieceSchema   = new Schema({
    set_id: String,
    piece_id: String,
    num: Number,
    color: Number,
    type: Number,
});

module.exports = mongoose.model('SetPiece', SetPieceSchema);
