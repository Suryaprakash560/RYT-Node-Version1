const Users = require('../usermodel/usermodel');
const Middleware = require('../middleware/middleware')


async function Login (req,callback){
    try{
        let ErrresponceArr=[];
        if(req.body.Email !='' && req.body.Password !=''){
            const ParticularUser = await Users.find().populate({ path : 'RoleId'})
            const MyUser  = ParticularUser.filter(User=>Middleware.Decrypt(User.Email,'RYTCKEY') == req.body.Email && Middleware.Decrypt(User.Password,'RYTCKEY') == req.body.Password)
            if(MyUser.length>0){
                MyUser[0].Email = Middleware.Decrypt(MyUser[0].Email,'RYTCKEY')
                
                callback(null,MyUser)
            }
            else{
                ErrresponceArr=[{Status:0,MSG:"* Invalid Username Password"}]
                callback(null,ErrresponceArr)
            }
            
        }
        else{
            ErrresponceArr=[{Status:0,MSG:"* Enter Email and Password"}]
            callback(null,ErrresponceArr)
        }
        
        
    }
    catch(err){
        callback(err,null)
    }
}

async function Checkemailpassword (req,callback){
    const AllUser = await Users.find()
    const MyUser  = AllUser.filter(User=>Middleware.Decrypt(User.Email,'RYTCKEY') == req.body.Email && Middleware.Decrypt(User.Password,'RYTCKEY') == req.body.Password)
    let Responce = []
    if(MyUser.length>0){
        Responce = [{Status : 1, MSG:'Username Password Matched'}]        
        callback(null,Responce)
    }
    else{
        Responce = [{Status : 0, MSG:'In valid Username password'}]  
        callback(null,Responce)
    }
}

async function UpdateUserpassword (req,callback){
    try{
        const AllUser = await Users.find()
        const MyUser  = AllUser.filter(User=>Middleware.Decrypt(User.Email,'RYTCKEY') == req.body.Email && Middleware.Decrypt(User.Password,'RYTCKEY') == req.body.Password)
        const Decodepassword = Middleware.Encrypt(req.body.Newpassword,'RYTCKEY')
        const changedpassword = await Users.updateOne({_id:MyUser[0]._id},{"Password":Decodepassword})
        callback(null,changedpassword)
    }
    catch(err){
        callback(err,null)
    }
    
}
module.exports = {
    Login,
    Checkemailpassword,
    UpdateUserpassword
}