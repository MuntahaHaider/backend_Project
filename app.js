import 'dotenv/config'
import express from 'express';
import mongoose from 'mongoose';
import postModel from './models/postSchema.js';
import userModel from './models/userScheme.js';
import bcrypt from 'bcrypt';

const port = process.env.PORT || 6090
const dbUrl = process.env.DB_URI

const app = express()
app.use(express.json());
app.use(express.urlencoded({extended:true}))

mongoose.connect(dbUrl)

mongoose.connection.on('connected',()=>{
    console.log('monogodb connected')
})

mongoose.connection.on('error',(err)=>{
 console.log(err)
})


app.get("/", (req, res) => {
    res.send({
        message:'server up....',
        status:true
    })
})

// ====================  Post Method ==================== //

app.post("/createpost",async(request,response)=>{
    console.log(request.body);
    const { title ,desc , postId } = request.body;
    if(!title || !desc || !postId){
        response.json({
            message:'required field is missing...',
        })
        return;
    }
    
    // data save in database
     const postObj ={
        title,
        desc,
        postId,
     }
     const dbresponse = await postModel.create({postObj})
    response.json({
        message:'post created successfully.....',
        data:dbresponse,
    })
    response.send("crate post api is running......!")
})



// ====================  Get Method ==================== //



// app.get('')

// ====================  Put Method (update post)==================== //
// app.put('/updatepost/',async(req,res)=>{
//  const {title,desc,postId} = req.body;
//  console.log(title,desc,postId)
//  const updatepost = postModel.findByIdAndUpdate(postId,{title,desc})
//  res.json({
//     message:'post updated successfully...',
//     data:updatepost,
//  })

// })

// // ====================  Delete Method (delete post)==================== //
// app.delete('/deletepost/:id',async(req,res)=>{
// const params = req.params.id;
// await postModel.findByIdAndDelete(params)
// res.json({
//     message:'post deleted successfully...',

// })
// })




// ===================== Signup 
app.post('/api/signup',async(req,res)=>{

    const body = req.body
    console.log(body)

   const  {firstName,lastName,email,password} = req.body
   if(!firstName || !lastName || !email || !password){
    res.json({
         message:'required fields are missing....',
         status:false
    })
    return;

   }

// check kareingy k koi email same tw nhi h 
const emailExit = await userModel.findOne({email})
console.log(emailExit)
if(emailExit){

}




// password ko encrypt krk store kreingy
   const hashPassword = await bcrypt(password,10)
   console.log('hashPassword' , hashPassword)
   let userObj = {
    firstName,
    lastName,
    email,
    password:hashPassword
   }

   //  create user in db
    const userCreate = await userModel.create({userObj})
    response.json({
        message:'user created successfully.....',
        status:true,
    })
    res.send('signup api')
})




// login api
app.post('/api/login', async(req , res)=>{
const {email,password} = res.body
if(!email || !password){
    res.json({
        message:'requires field are missing....',
        status:false,
    })
    return;
}

const emailExist = await userModel.findOne({email})

if(!emailExist){
    res.json({
        message:'invalid email & password',
        status:false,
    })
    return
}

const camparePassword = await bcrypt.compare(
    password,''
)

if(!camparePassword){
    res.json({
        message:'invalid email & password',
        status:false,
    })
    return
}

res.json({
    message:'login successfully.....',
    status:true,
})

})










app.listen(port, () => {
    console.log(`Server start... ${port}`)
})
