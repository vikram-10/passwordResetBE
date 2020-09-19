const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const cors=require('cors');
const mongodb=require('mongodb');
const randomstring=require('randomstring');
const nodemailer=require('nodemailer');
const mongoClient=mongodb.MongoClient;
const url="mongodb://localhost:27017";


app.use(cors({
    origin:"*"
}));


app.use(bodyParser.json());

app.get("/enterEmail",function(req,res){
    res.send("HELLO WORLD!");
});

app.put("/enterEmail",async function(req,res){
   try{
       let client=await mongoClient.connect(url);
       let db=client.db("passReset");
       let rs=randomstring.generate(20);
       let foundEmail=await db.collection('users').findOneAndUpdate({email:req.body.email},{$set:{rs:rs}});
       var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'formetolearnalltime@gmail.com',
          pass: 'trialPass'
        }
      });
      var mailOptions = {
        from: `formetolearnalltime@gmail.com`,
        to: `${req.body.email}`,
        subject: 'Password Reset',
        text: 'If you are seeing this, this worked!'
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
       res.json("Invalid E-Mail ID");
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

app.listen(process.env.PORT||3000,function(){
    console.log("Server has started!");
})