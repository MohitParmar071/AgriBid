const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/AgriBid")
.then(()=>{
    console.log("You can use allow to Contect collections");
}).catch(()=>{
    console.log("Disconnect");
})

const contectSchema = new mongoose.Schema({
  username:{
    type:String,
    required:true,
  },

    mo_num:{
    type:Number,
    required:true,
  },

   email:{
    type:String,
    required:true,
  },

   address:{
    type:String,
    required:true,
  },

  password:{
    type:String,
     required:true,
},

 img:{
  type:String,
  required:true,
 }



});

const Contect = mongoose.model("Contect",contectSchema);

module.exports = Contect;