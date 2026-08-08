const mongoose = require('mongoose')

const env_virable = require('dotenv');
env_virable.config();


const url = process.env.clustername;
const connectdb = async function(){
 await mongoose.connect( url );
}

module.exports = connectdb;