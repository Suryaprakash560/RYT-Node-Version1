const express = require('express');
const cors = require('cors')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')

const dbconfig = require('./db/db-config.json')
mongoose.connect('mongodb+srv://'+dbconfig.database.user+':'+dbconfig.database.password+'@cluster0.mlknoha.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
        .then(()=>{console.log("Database Connected")})
        .catch((err)=>{console.log(err)})
const PORT = process.env.PORT || 8080;

const Roles = require('./modules/rolemodel/rolemodel')


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
* Tittle : CreateRole
* Model : Rolemodel
* Date : 15-05-2025
*/

app.post('/createrole',async(req,res)=>{
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

app.get('/getroles',async(req,res)=>{
        try{
                const AllRoles = await Roles.find()
                const TransArray = AllRoles.map((x)=>{
                        return {
                                value : x.RoleId,
                                label : x.RoleName,
                                Dbid : x._id,
                                RoleId : x.RoleId,
                                RoleName : x.RoleName,
                        }
                })
                res.status(200).send(TransArray)
        }
        catch{

        }
})



app.listen(PORT,()=>{console.log("App running on port " + PORT)})