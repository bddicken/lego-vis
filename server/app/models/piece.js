var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var PieceSchema   = new Schema({
    id: String,
    descr: String,
    category: String,
});

module.exports = mongoose.model('Piece', PieceSchema);
