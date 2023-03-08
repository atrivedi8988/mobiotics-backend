const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
const connectDatabase = async()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`Mongodb connected : ${conn.connection.host}`)
    } catch (error) {
        console.log(`Error : ${error.message}`);
        process.exit()
    }
}

module.exports = connectDatabase