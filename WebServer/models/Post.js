const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    author:{
        type:mongoose.Schema.Types.ObjectId,ref:'User',
        required:true
    },
    body:{
        type:String,
        required:true
    },
    date:{
        year:{
            type:String,
        },
        month:{
            type:String
        },
        day:{
            type:String
        }
    },
    emotion:{
        type:String
    },
    sentence:{
        type:String
    },
    situation:{
        type:String
    }
},{timestamps:true});


module.exports = mongoose.model('Post',PostSchema);
