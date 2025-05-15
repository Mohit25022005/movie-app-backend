const dotenv = require('dotenv');
const app = require('./app');
const mongoose = require('mongoose')
dotenv.config({path:'./.env'});

const DB = process.env.MONGO_URI;

mongoose.set("strictQuery",false)
mongoose.connect(DB)
    .then(()=>{
        console.log('Successfully connected to database');
    })
    .catch((e)=>{
        console.log('Some error occured',e);
        process.exit(1); 
    })

const port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log(`Server is up on ${port}!!`)
})