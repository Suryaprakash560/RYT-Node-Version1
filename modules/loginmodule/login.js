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

module.exports = {
    Login
}