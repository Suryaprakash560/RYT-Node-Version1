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
const Middleware = require('./modules/middleware/middleware');


const app = express()
const corsOptions = {
    origin : true,
    credentials: true,
    methods: ['GET', 'HEAD', 'OPTIONS', 'POST', 'PUT', 'DELETE'],
}
app.use(cookieParser())
app.use(express.json())
app.use(cors(corsOptions))

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
                        res.status(201).send(responce)
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
                        res.status(201).send(responce)
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
                        res.status(201).send(responce)
                }

        })
})

/* 
* Tittle : Delete User
* Model : Usermodel
* Date : 16-05-2025
*/

app.post('/api/deleteuser',async(req,res)=>{
        User.DeleteUser(req,(err,responce)=>{
                if(err){
                        res.status(500).send(err)
                }
                else{
                        res.status(201).send(responce)
                }

        })
})

app.listen(PORT,()=>{console.log("App running on port " + PORT)})