const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const cors=require('cors');
const mongodb=require('mongodb');
const mongoClient=mongodb.MongoClient;
const url="mongodb://localhost:3000/27017";


app.use(cors({
    origin:"*"
}));


app.use(bodyParser.json());

app.get("/enterEmail",function(req,res){
    res.send("HELLO WORLD!");
});

app.post("/enterEmail",async function(req,res){
    try{
    let client=mongoClient.connect(url);
    let db=client.db('passReset');
    let foundEmail=db.collection('users').find({email:req.body.email});
    if(foundEmail==undefined){
        res.json({
            message:"Not found!"
        });
    }
    else{
        res.json({
            message:"Found!"
        });
    }
    }
    catch(err){
        console.log(err);
    }

})

app.listen(process.env.PORT||3000,function(){
    console.log("Server has started!");
})