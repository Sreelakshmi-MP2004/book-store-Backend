const mongoose = require('mongoose')

mongoose.connect(process.env.connectionString).then(res=>{
    console.log("Mongodb Connected...");
})
.catch(err=>{
    console.log("Mongodb connection error"+ err);
})
