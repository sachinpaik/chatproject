// routes/auth.route.js


import express from "express"
import signup, {login} from "../controllers/auth.controller.js";
import verifyToken from "../middleware/verifyToken.js";



const router = express.Router();


// Sign up
router.post('/signup', signup);
router.post('/login', login);


export default router;
