const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    skill: String,
    count: Number,
});

const Data = mongoose.model('Data', dataSchema);
module.exports = Data;
