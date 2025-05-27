const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');

const dbconfig = require('./db/db-config.json')
mongoose.connect('mongodb+srv://'+dbconfig.database.user+':'+dbconfig.database.password+'@cluster0.mlknoha.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
        .then(()=>{console.log("Database Connected")})
        .catch((err)=>{console.log(err)})
const PORT = process.env.PORT || 8080;

const Roles = require('./modules/rolemodel/rolemodel');
const User = require('./modules/usermodel/usermethods');
const Loginmodule = require('./modules/loginmodule/login');
const TicketModule = require('./modules/ticketmodule/ticketmethod')
const Mailmodule = require('./modules/emailmodule/templatemethods')
const app = express()
const corsOptions = {
    origin : true,
    credentials: true,
    methods: ['GET', 'HEAD', 'OPTIONS', 'POST', 'PUT', 'DELETE'],
}
app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json())

app.use(session({
//   name: 'RYT-Cookies', // optional: name of the cookie
  secret : process.env.RYT_SEC_KEY, 
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: true,        
    sameSite: 'none',    
    maxAge: 24 * 60 * 60 * 1000,
    domain : '.onrender.com'
  },
  store:MongoStore.create({
        client : mongoose.connection.getClient()
      })
}));

// app.use(session({
//         secret : 'RYTAPP',
//         saveUninitialized : true,
//         resave : true,
//         cookie: {
//                 // httpOnly: true,
//         secure: true, 
//         sameSite: 'none', 
//         maxAge: 1000 * 60 * 60 * 24,
//       },
//       store:MongoStore.create({
//         client : mongoose.connection.getClient()
//       })
// }))


// app.use((req,res,next)=>{
//         console.log(app)
//         console.log(req.method)
// })



/* 
* Tittle : Login 
* Model : Usermodel
* Date : 16-05-2025
*/

// app.post()

/* 
* Tittle : CreateRole
* Model : Rolemodel
* Date : 15-05-2025
*/

app.post('/api/createrole',async(req,res)=>{
        try {
        let NewRole = {
                RoleId : req.body.RoleId,
                RoleName: req.body.RoleName,
                CreatedDate : new Date()    
        }
        const creatdRoles = await Roles.create(NewRole)
        res.send(creatdRoles).status(201)
        } catch (err) {
                res.status(500).send({ error: 'Internal Server Error' });
        }
        
})

/* 
* Tittle : GetAllRoles
* Model : Rolemodel
* Date : 16-05-2025
*/

app.get('/api/getroles',async(req,res)=>{
        try{
                
                const AllRoles = await Roles.find()
                const TransArray = AllRoles.map((x)=>{
                        return {
                                value : x._id,
                                label : x.RoleName,
                                Dbid : x._id,
                                RoleId : x.RoleId,
                                RoleName : x.RoleName,
                        }
                })
                res.status(200).send(TransArray)
        }
        catch{
           res.status(500).send({ error: 'Internal Server Error' });     
        }
})

/* 
* Tittle : Save User Info
* Model : Usermodel
* Date : 16-05-2025
*/

app.post('/api/saveuserinfo',(req,res)=>{
        User.CreateUser(req,(err,responce)=>{
                if(err){
                        res.status(500).send(err)
                }
                else{
                       
                        if(responce._id!=''){
                                Mailmodule.UserCreationmail(responce,(emailErr,emailInfo)=>{
                                        if (emailErr) {
                                                console.error('Email failed:', emailErr);
                                                return res.status(200).json({
                                                message: 'User created, but email could not be sent'
                                                });
                                        }
                                        return res.status(200).json({
                                                message: 'User created and email sent successfully'
                                        });
                                })
                        }
                         res.status(201).send(responce)
                        // UserCreationmail
                }

        })  

})

/* 
* Tittle : Get All User
* Model : Usermodel
* Date : 16-05-2025
*/

app.get('/api/getalluser',async(req,res)=>{
        User.GetallUsers(req,(err,responce)=>{
                if(err){
                        res.status(500).send(err)
                }
                else{
                        res.status(200).send(responce)
                }

        })  
})

/* 
* Tittle : Edit User
* Model : Usermodel
* Date : 16-05-2025
*/

app.post('/api/edituser',async(req,res)=>{
        User.UpdateUser(req,(err,responce)=>{
                if(err){
                        res.status(500).send(err)
                }
                else{
                        res.status(200).send(responce)
                }

        })
})

/* 
* Tittle : Delete User
* Model : Usermodel
* Date : 16-05-2025
*/

app.delete('/api/deleteuser',async(req,res)=>{
        User.DeleteUser(req,(err,responce)=>{
                if(err){
                        res.status(500).send(err)
                }
                else{
                        res.status(200).send(responce)
                }
        })
})

/* 
* Tittle : User Login
* Model : Loginmodel
* Date : 19-05-2025
*/

app.post('/api/Login',async(req,res)=>{
        
        Loginmodule.Login(req,(err,responce)=>{
                if(err){
                        res.status(500).send(err)
                }
                else{
                        if(responce[0].Status == 0){
                               res.status(200).send(responce) 
                        }
                        else{   
                                console.log("i am here in login")
                                req.session.Issession = 1
                                req.session.UserId = responce[0]._id
                                req.session.UserName = responce[0].UserName
                                req.session.UserEmail = responce[0].Email
                                req.session.MobileNumber = responce[0].MobileNumber
                                req.session.Desigination = responce[0].Desigination
                                req.session.ProfileImage = responce[0].ProfileImage
                                req.session.RoleId = responce[0].RoleId.RoleId
                                req.session.RoleName = responce[0].RoleId.RoleName
                                req.session.RoleIdD = responce[0].RoleId._id
                                res.status(200).send(responce)
                                console.log(req.session)
                        }
                        
                }
        })
})

/* 
* Tittle : User Logout
* Date : 20-05-2025
*/

app.get('/api/logout',async(req,res)=>{
        req.session.destroy(err => {
        if (err) {
             res.status(500).send('Could not log out.');
        } else {
                let Responcejson = [{Status:1,msg:'Logged out successfully.'}]
            res.status(200).send(Responcejson);
        }
    });
})
/* 
* Tittle : Get Session
* Date : 19-05-2025
*/
app.get('/api/getsession',async(req,res)=>{
        console.log(req.session)
        if(req.session.Issession != 1 ){
                res.status(204).send("No Session")
        }
        else{
                var Responce = []
                Responce = [{
                Issession : req.session.Issession,
                UserId : req.session.UserId,
                UserName : req.session.UserName, 
                UserEmail : req.session.UserEmail, 
                MobileNumber : req.session.MobileNumber ,
                Desigination : req.session.Desigination ,
                ProfileImage: req.session.ProfileImage ,
                RoleId: req.session.RoleId  ,
                RoleName : req.session.RoleName ,
                RoleIdD : req.session.RoleIdD ,
                }]
                console.log("Responce",Responce)
                res.status(200).send(Responce)
        }
})

/* 
* Tittle : Ticket Creation
* Model : Ticketmodule
* Date : 20-05-2025
*/
app.post('/api/saveticket',(req,res)=>{
        TicketModule.SaveTicket(req,(err,responce)=>{
                if(err){
                     res.status(500).send(err)   
                }
                else{
                        if(responce._id!=''){
                                Mailmodule.TicketCreationEmail(req,responce,(emailErr,emailInfo)=>{
                                        if (emailErr) {
                                                console.error('Email failed:', emailErr);
                                                return res.status(200).json({
                                                message: 'User created, but email could not be sent'
                                                });
                                        }
                                        return res.status(200).json({
                                                message: 'User created and email sent successfully'
                                        });
                                })
                        }
                     res.status(201).send(responce)   
                }
        })
})

/* 
* Tittle : Update Ticket
* Model : Ticketmodule
* Date : 20-05-2025
*/
app.post('/api/updateticket',(req,res)=>{
        TicketModule.UpdateTicket(req,(err,responce)=>{
                if(err){
                     res.status(500).send(err)   
                }
                else{
                        if(req.body.TicketStatus == 2){
                                Mailmodule.closeTicketEmail(req,responce,(err,Emailres)=>{
                                        if (emailErr) {
                                                console.error('Email failed:', emailErr);
                                                return res.status(200).json({
                                                message: 'User created, but email could not be sent'
                                                });
                                        }
                                        return res.status(200).json({
                                                message: 'User created and email sent successfully'
                                        });
                                })
                        }
                     res.status(201).send(responce)   
                }
        })
})

/* 
* Tittle : Get all Tickets
* Model : Ticketmodule
* Date : 20-05-2025
*/

app.get('/api/getallTickets',(req,res)=>{
        TicketModule.GetallTickets(req,(err,responce)=>{
                if(err){
                     res.status(500).send(err)   
                }
                else{
                     res.status(201).send(responce)   
                }
        })
})

/* 
* Tittle : Get all user tickets
* Model : Ticketmodule
* Date : 20-05-2025
*/
app.post('/api/getallusertickets',(req,res)=>{
        TicketModule.GetallUserTickets(req,(err,responce)=>{
                if(err){
                     res.status(500).send(err)   
                }
                else{
                     res.status(201).send(responce)   
                }
        })
})


/* 
* Tittle : Get all sysadm tickets
* Model : Ticketmodule
* Date : 20-05-2025
*/
app.post('/api/getallsysadmtickets',(req,res)=>{
        TicketModule.GetallSysAdmTickets(req,(err,responce)=>{
                if(err){
                     res.status(500).send(err)   
                }
                else{
                     res.status(201).send(responce)   
                }
        })
})

/* 
* Tittle : Check email password
* Model : Loginmodel
* Date : 22-05-2025
*/
app.post('/api/checkemailpassword',(req,res)=>{
        Loginmodule.Checkemailpassword(req,(err,responce)=>{
                if(err){
                        res.status(500).send(err)
                }
                else{
                        res.status(200).send(responce)   
                }
        })
})

/* 
* Tittle : Update user password
* Model : Loginmodel
* Date : 22-05-2025
*/
app.post('/api/updateuserpassword',(req,res)=>{
        Loginmodule.UpdateUserpassword(req,(err,responce)=>{
                if(err){
                        res.status(500).send(err)
                }
                else{
                        res.status(200).send(responce)   
                }
        })
})

/* 
* Tittle : Update user password
* Model : Loginmodel
* Date : 22-05-2025
*/
app.delete('/api/deleteticket',(req,res)=>{
        TicketModule.Deleteticket(req,(err,responce)=>{
                if(err){
                        res.status(500).send(err)
                }
                else{
                        res.status(200).send(responce)
                }
        })
})
app.listen(PORT,()=>{console.log("App running on port " + PORT)})