const app = require('./app');
const cloudinary = require('cloudinary')
const connectDatabase = require('./database/database')

//Handling Uncaught Exception
process.on('uncaughtException', (err) => {
    console.log(`Error : ${err.message}`);
    console.log("shutting down server due to Uncaught Exception");

    process.exit(1)

});

//config
if (process.env.NODE_ENV !== "PRODUCTION") {
    require('dotenv').dotenv.config({ path: 'backend/config/config.env' });
}

//Connecting to database
connectDatabase();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const server = app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

//Unhandle Promiss Rejection
process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`);
    console.log("shutting down the server due to Unhandle Promiss Rejaction");

    server.close(() => {
        process.exit(1)
    })
});