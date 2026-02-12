import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/mongoDB.js";
import authroutes from "./routes/authroutes.js";
import taskroutes from "./routes/taskRoutes.js"; 




const app = express();

app.use(cors({
    origin:"http://localhost:5173",
    methods:["GET","POST","PUT","DELETE"],
    credentials:true
}));
app.use(express.json());

app.use("/api/auth",authroutes); 
app.use("/api/task",taskroutes);


app.get('/ping', (req, res) => {
    res.send('Hello World!');
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT} 🚀`);
    });
}).catch((error) => {
    console.error('Failed to start server:', error.message);
});




