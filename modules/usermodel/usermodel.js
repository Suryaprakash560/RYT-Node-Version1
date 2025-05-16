const mongoose = require('mongoose')

const UsersSchema = new mongoose.Schema({
    UserName : {
        type : mongoose.SchemaTypes.String,
        //require : true
    },
    Email : {
        type : mongoose.SchemaTypes.String,
        //require : true
    },
    Password : {
        type : mongoose.SchemaTypes.String,
        //require : true
    },
    MobileNumber : {
        type : mongoose.SchemaTypes.String,
        //require : true
    },
    Desigination : {
        type : mongoose.SchemaTypes.String,
        //require : true
    },
    ProfileImage : {
        type : mongoose.SchemaTypes.String
    },
    RoleId : {
        type : mongoose.SchemaTypes.ObjectId,
        ref : 'Role'
    },
    CreatedDate : {
        type : mongoose.SchemaTypes.Date
    }
})

module.exports = mongoose.model('User',UsersSchema)