const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    role: {
        type: String,
        required: true
    },
    reference: {
        type: String,
        required: true
    },
    locdata: {
       type:String,
       required: true
    }
});

const Role = mongoose.model('Role', roleSchema);
module.exports = Role;
