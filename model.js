const mongoose = require('mongoose');

const urlModel = mongoose.Schema({
  original_url: String,
  short_url: String,
  estado: Boolean
});

module.exports = mongoose.model('URL', urlModel);