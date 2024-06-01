// Importing required modules
import express from "express";
import dotenv from "dotenv";
import router from "./routes/auth.route.js";
import connectToMongoDB from "./db/connectToMongoDB.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import usersRouter from "./routes/users.route.js";
import verifyToken from "./middleware/verifyToken.js";

// Creating an instance of Express

dotenv.config();
const PORT = process.env.PORT || 3001; // Use the provided port or default to 3000
const app = express();
app.use(cors({
        credentials: true,
        origin: ["http://hhld-chat-1924609593.us-east-1.elb.amazonaws.com:3000","http://hhld-chat-1924609593.us-east-1.elb.amazonaws.com:3001"]
    }
));
app.use(express.json());
app.use(cookieParser());
app.use('/users', usersRouter);
app.use('/auth',router);

// Define a route
app.get('/', (req, res) => {
  res.send('Hello, world!');
});





app.get('/health', (req, res) => {
    const userId = req.params.id;
    res.status(201).send(`ok`);
  });

app.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server is running on port ${PORT}`);
});

