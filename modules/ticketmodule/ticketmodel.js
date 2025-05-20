const mongoose = require('mongoose')

const TicketSchema = new mongoose.Schema({
    TicketDescription :{
        type : mongoose.SchemaTypes.String,
        require : true
    },
    UserId : {
        type : mongoose.SchemaTypes.ObjectId,
        ref : 'User'
    },
    TicketStatus : {
        type : mongoose.SchemaTypes.Int32,
    },
    SysAdminId : {
        type : mongoose.SchemaTypes.ObjectId,
        ref : 'User'
    },
    WorksDone : {
        type : mongoose.SchemaTypes.String
    }
})

module.exports = mongoose.model("Tickets",TicketSchema)