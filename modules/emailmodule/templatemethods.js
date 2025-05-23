const fs = require('fs');
const nodemailer = require('nodemailer');
const Middleware = require('../middleware/middleware')
const path = require('path');
const Users = require('../usermodel/usermodel')
const Tickets = require('../ticketmodule/ticketmodel')
// Load template

function UserCreationmail (data,callback){
    try{
        const filePath = path.join(__dirname, 'templates', 'usercreationemail.html');
        let htmlTemplate = fs.readFileSync(filePath, 'utf8');     
        const BaseEmail = Middleware.Decrypt(data.Email,'RYTCKEY')
        const BasePassword = Middleware.Decrypt(data.Password,'RYTCKEY')
        htmlTemplate = htmlTemplate
        .replace('{{_Name_}}', data.UserName)
        .replace('{{_Email_}}', Buffer.from(BaseEmail, 'base64').toString('utf8'))
        .replace('{{_Password_}}', Buffer.from(BasePassword, 'base64').toString('utf8'))
        .replace('{{_loginUrl_}}', 'http://localhost:3000/');
        const transporter = nodemailer.createTransport({
        host: 'smtp-relay.brevo.com',
        port: 587,
        auth: {
            user: '8dbf8e001@smtp-brevo.com',
            pass: '87Jk40s5ThxCfaOg'
        }
        });
        const mailOptions = {
        from: '<masssurya560@gmail.com>',
        to: Buffer.from(BaseEmail, 'base64').toString('utf8'),
        subject: 'User Registeration',
        html: htmlTemplate
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) return callback(error, null);
            return callback(null, info.response);
        });
    }
    catch(err){
        console.log(err)
    }
}


async function TicketCreationEmail(req,data,callback){
    try{
    const filePath = path.join(__dirname, 'templates', 'ticketcreate.html');
    let htmlTemplate = fs.readFileSync(filePath, 'utf8'); 
    let Admin = await Users.find({"_id":data.SysAdminId});
    let Adminemail = Middleware.Decrypt(Admin[0].Email,'RYTCKEY')
        htmlTemplate = htmlTemplate
        .replace('{{_Name_}}', Admin[0].UserName)
        .replace('{{_UserName_}}',req.session.UserName)
        .replace('{{_Issues_}}',data.TicketDescription)

        const transporter = nodemailer.createTransport({
        host: 'smtp-relay.brevo.com',
        port: 587,
        auth: {
            user: '8dbf8e001@smtp-brevo.com',
            pass: '87Jk40s5ThxCfaOg'
        }
        });
        const mailOptions = {
        from: '<masssurya560@gmail.com>',
        to: Buffer.from(Adminemail, 'base64').toString('utf8'),
        subject: 'User Registeration',
        html: htmlTemplate
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) return callback(error, null);
            return callback(null, info.response);
        });
    }
    catch(err){
        console.log(err)
    }
    
    // const AdminEmail = Middleware.Decrypt(data.Email,'RYTCKEY')
}

async function closeTicketEmail (req,callback){
    try{
        const filePath = path.join(__dirname, 'templates', 'ticketcloseemail.html');
        let htmlTemplate = fs.readFileSync(filePath, 'utf8'); 
        let User = await Users.find({"_id":req.body.UserId});
        let Ticket = await Tickets.find({"_id":req.body.TicketId})
        let Useremail = Middleware.Decrypt(User[0].Email,'RYTCKEY')
        htmlTemplate = htmlTemplate
        .replace('{{_UserName_}}', User[0].UserName)
        .replace('{{_AdminName_}}',req.session.UserName)
        .replace('{{_WorksDone_}}',Ticket[0].WorksDone)
        const transporter = nodemailer.createTransport({
        host: 'smtp-relay.brevo.com',
        port: 587,
        auth: {
            user: '8dbf8e001@smtp-brevo.com',
            pass: '87Jk40s5ThxCfaOg'
        }
        });
        const mailOptions = {
        from: '<masssurya560@gmail.com>',
        to: Buffer.from(Useremail, 'base64').toString('utf8'),
        subject: 'User Registeration',
        html: htmlTemplate
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) return callback(error, null);
            return callback(null, info.response);
        });

    }
    catch(err){
        console.log(err)
    }
}
module.exports ={
    UserCreationmail,
    TicketCreationEmail,
    closeTicketEmail
}