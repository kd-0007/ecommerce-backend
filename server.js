const app = require('./app');
const connectDatabase = require('./database');



process.on("uncaughtException",(err)=>{
    console.log(`Error: ${err.message}`);
    console.log("Shutting down server due to uncaughtException");
        process.exit(1)
})


connectDatabase();

const port  = process.env.PORT || 4000;
const server = app.listen( port , ()=>{
    console.log('listening on port '+process.env.PORT);
})

process.on("unhandledRejection",(err)=>{
    console.log(`Error: ${err.message}`);
    console.log("Shutting down server due to unhandled Promise Rejection");

    server.close(()=>{
        process.exit(1)
    })
})