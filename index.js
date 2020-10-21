const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const cors=require('cors');
const mongodb=require('mongodb');
const randomstring=require('randomstring');
const nodemailer=require('nodemailer');
const mongoClient=mongodb.MongoClient;
const url=process.env.URL;


app.use(cors({
    origin:"*"
}));


app.use(bodyParser.json());

app.get("/enterEmail",function(req,res){
    res.send("Get Route for enter Email");
});

app.put("/enterEmail",async function(req,res){
   try{
       let data=req.body.email;
       console.log(data);
       let client=await mongoClient.connect(url);
       let db=client.db("passReset");
       let rs=randomstring.generate(20);
       let foundEmail=await db.collection('users').findOneAndUpdate({email:data},{$set:{rs:rs}});
       res.json(rs);
       var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'formetolearnalltime@gmail.com',
          pass: 'process.env.PASS'
        }
      });
      var mailOptions = {
        from: `formetolearnalltime@gmail.com`,
        to: `${req.body.email}`,
        subject: 'Password Reset',
        text: `Use this link to reset password: https://pass-reset.netlify.app/newpass/newpassword.html`
      }
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
    });
}
   catch(err){
       console.log("Invalid E-Mail ID");
   }
});

app.put("/:randomString/passReset",async function(req,res){
    try{
    let client=await mongoClient.connect(url);
    let db=client.db('passReset');
    let foundUser=await db.collection('users').findOneAndUpdate({rs:req.params.randomString},{$set:{password:req.body.pass}});
    res.json("Password Updated!");
    }
    catch(error){
        res.json("Something went wrong");
    }
});

app.listen(process.env.PORT||3000,function(req,res){
    console.log("Server has started!");
})
