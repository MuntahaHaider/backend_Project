import mongoose from "mongoose";

const schema = new mongoose.Schema({
     title:String,
     desc:String,
     postId:Number,
})

const postModel = mongoose.model('post',schema)
export default postModel;
