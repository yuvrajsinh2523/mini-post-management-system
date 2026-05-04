const express=require("express");
const app=express();
const mysql=require("mysql2");
const {faker}=require("@faker-js/faker");
const path=require("path")
const {v4:uuidv4}=require("uuid")
let port=8080;
const methodoverride=require("method-override")


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.urlencoded({extended:true}));
app.use(methodoverride("_method"));
app.use(express.static(path.join(__dirname,"public")));




const connection=mysql.createConnection({
    host:"localhost",
    user:"root",
    database:"quara",
    password:"abc@123"
})


app.listen(port,()=>{
    console.log(`your port is working now ${port}`);
})

app.get("/",(req,res)=>{
    res.render("home.ejs");
})


app.post("/view",(req,res)=>{
    let id=uuidv4();
    let {name,comment,email}=req.body;

    let q=`insert into post(id,name,comment,email)values (?,?, ?, ?)`;
    try{
        connection.query(q,[id,name,comment,email],(err,result)=>{
            if(err)throw err;
            res.redirect("/view");
        })
    }catch(err){
        coneole.log(err);
    }
})

app.get("/view",(req,res)=>{
    try{
        let q='select * from post';
        connection.query(q,(err,result)=>{
            if(err)throw err;
           let value=result;
           res.render("view.ejs",{value});

        })

    }catch(err){
        console.log(err);
    }
})

app.get("/view/:id/edit",(req,res)=>{
    let {id}=req.params;
   
    let q=`select * from post where id=?`;
    try{
        connection.query(q,[id],(err,result)=>{
            if(err)throw err;
            let value=result[0];
            res.render("edit.ejs",{value})
        })
    }catch(err){
        console.log(err);
    }
})

app.patch("/view/:id",(req,res)=>{
    let {comment}=req.body;
    let {id}=req.params;
    let q=`update post set comment='${comment}' where id='${id}'`;
    try{
        connection.query(q,(err,result)=>{
            if(err)throw err;
            res.redirect("/view");
        })

    }catch(err){
        console.log(err);
    }
})

app.delete("/view/:id",(req,res)=>{
    let {id}=req.params;
    let q=`delete from post where id=?`;
    try{
        connection.query(q,[id],(err,result)=>{
            if(err)throw err;
            res.redirect("/view");

    })
    }catch(err){
        console.log(err)
    }
})
