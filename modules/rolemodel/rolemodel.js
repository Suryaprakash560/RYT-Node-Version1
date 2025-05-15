const mongoose = require('mongoose')

const RoleScheme = {
    RoleId : {
        type : mongoose.SchemaTypes.Int32
    },
    RoleName : {
        type : mongoose.SchemaTypes.String
    },
    CreatedDate : {
            type : mongoose.SchemaTypes.Date
    }
}

module.exports = mongoose.model("Role",RoleScheme)