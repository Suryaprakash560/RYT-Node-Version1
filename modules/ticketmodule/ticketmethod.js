const Tickets = require('./ticketmodel')
const Middleware  = require('../middleware/middleware')

async function SaveTicket (req,callback){
    try{
        const Bodyobj = {
            TicketDescription : req.body.TicketDescription,
            UserId : req.session.RoleId==3?req.session.UserId:req.body.UserId,
            TicketStatus: req.body.TicketStatus,
            SysAdminId : req.body.SysAdminId,
            WorksDone : req.body.WorksDone
        }
        const NewTicket = await Tickets.create(Bodyobj)
        callback(null,NewTicket)
    }
    catch(err){
        callback(err,null)
    }
    
}

async function UpdateTicket (req,callback){
    try{
        
        const Bodyobj = {
            TicketDescription : req.body.TicketDescription,
            UserId : req.session.RoleId==3?req.session.UserId:req.body.UserId,
            TicketStatus: req.body.TicketStatus,
            SysAdminId : req.body.SysAdminId,
            WorksDone : req.body.WorksDone
        }
        const Updateticket = await Tickets.updateOne({_id:req.body.TicketId},{$set:Bodyobj})
        callback(null,Updateticket)
    }   
    catch(err){
        callback(err,null)
    }
}

async function GetallTickets (req,callback){
    try{
        const AllTicket = await Tickets.find().populate({
            path : 'UserId SysAdminId'
        })
        callback(null,AllTicket)
    }
    catch(err){
        callback(err,null)
    }
    
}


async function GetallUserTickets (req,callback){
    try{
        const AllTicket = await Tickets.find({UserId:req.session.UserId}).populate({
            path : 'SysAdminId',
        })
        callback(null,AllTicket)
    }
    catch(err){
        console.log(err)
        callback(err,null)
    }
    
}

async function GetallSysAdmTickets (req,callback){
    try{
        const AllTicket = await Tickets.find({SysAdminId:req.session.UserId}).populate({
            path : 'UserId',
        })
        callback(null,AllTicket)
    }
    catch(err){
        console.log(err)
        callback(err,null)
    }
    
}

async function Deleteticket (req,callback){
    try{
        const deletedTicket = await Tickets.deleteOne({"_id":req.body.TicketId})
        callback(null,deletedTicket)
    }
    catch(err){
        callback(err,null)
    }
}
module.exports = {
    SaveTicket,
    GetallTickets,
    GetallUserTickets,
    GetallSysAdmTickets,
    UpdateTicket,
    Deleteticket
}