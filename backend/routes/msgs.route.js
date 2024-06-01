import express from "express"
import {getMsgToConversation} from "../controllers/msgs.controller.js";


const router = express.Router();
router.get('/', getMsgToConversation);
export default router;
