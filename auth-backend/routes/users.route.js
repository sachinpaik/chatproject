import express from "express"
import verifyToken from "../middleware/verifyToken.js";
import getUsers from "../controllers/users.controller.js";


const usersRouter = express.Router();


usersRouter.get('/', verifyToken, getUsers);


export default usersRouter;
