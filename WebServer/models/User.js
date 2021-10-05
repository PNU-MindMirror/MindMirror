const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    gender:{
        type:String
    },
    age:{
        type:String
    },
    name:{
        type:String
    },
    posts:[
        {type:mongoose.Schema.Types.ObjectId,ref:'Post'}],
},{timestamps:true});

module.exports = mongoose.model('User',UserSchema);
