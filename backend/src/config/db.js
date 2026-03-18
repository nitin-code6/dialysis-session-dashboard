const mongoose=require('mongoose');

const connectDB= async ()=>{
    
try{
    await mongoose.connect(process.env.connection_string);
    console.log("MongoDB connected");
}
catch(error){
    console.error('Mongoose connection failed',error);
    
}
}
    
module.exports=connectDB;