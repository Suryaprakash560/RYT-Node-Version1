const Users = require('./usermodel')
const Middleware  = require('../middleware/middleware')
async function CreateUser (req,callback){
    try{
        const EncEmail = Middleware.Encrypt(req.body.Email,'RYTCKEY')
        const EncPassword  = Middleware.Encrypt(req.body.Password,'RYTCKEY')
        const NewUsers = {
                UserName : req.body.UserName,
                Email: EncEmail,
                Password : EncPassword,
                MobileNumber : req.body.MobileNumber,
                Desigination : req.body.Desigination,
                ProfileImage : req.body.ProfileImage,
                RoleId : req.body.RoleId,
                CreatedDate : new Date()
        }
        const AddUser = await Users.create(NewUsers)
        callback(null,AddUser)
    }
    catch(err){
        callback(err,null)
    }
        
}

async function GetallUsers (req,callback){
    try{
        const AllUser = await Users.find().populate({
                path : 'RoleId',
        })
        AllUser.forEach((x,i,arr)=>{
                arr[i].Email = Middleware.Decrypt(x.Email,"RYTCKEY")
                arr[i].Password = Middleware.Decrypt(x.Password,"RYTCKEY")
        })
        callback(null,AllUser)
    }
    catch(err){
        callback(err,null)
    }
    
}

async function UpdateUser (req,callback){
    try{
        const EncEmail = Middleware.Encrypt(req.body.Email,'RYTCKEY')
        const EncPassword  = Middleware.Encrypt(req.body.Password,'RYTCKEY')
        const EditedUsers = {
                UserName : req.body.UserName,
                Email: EncEmail,
                Password : EncPassword,
                MobileNumber : req.body.MobileNumber,
                Desigination : req.body.Desigination,
                ProfileImage : req.body.ProfileImage,
                RoleId : req.body.RoleId,
                CreatedDate : new Date()
        }
        const EditedUser = await Users.updateOne({_id:req.body.UserId},{$set:EditedUsers}) 
        callback(null,EditedUser)
        }
    catch(err){
            callback(err,null)
    }
}

async function DeleteUser (req,callback){
    try{
    const DeletedUser = await Users.deleteOne({_id:req.body.UserId})
    callback(null,DeletedUser)
    }
    catch(err){
        callback(err,null)
    }
}

module.exports ={
    CreateUser,
    GetallUsers,
    UpdateUser,
    DeleteUser
}