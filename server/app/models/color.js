var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ColorSchema   = new Schema({
    id: Number,
    descr: String,
});

module.exports = mongoose.model('Color', ColorSchema);
