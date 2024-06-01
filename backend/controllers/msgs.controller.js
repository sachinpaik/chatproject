import Conversation from "../model/chat.model.js";

export const addMsgToConversation = async (participants, msg) => {
    try {
        // Fetch all users, including only the username field
        let conversation = await Conversation.findOne({users: {$all: participants}});
        if (!conversation) {
            conversation = await Conversation.create({ users: participants});
        }
        conversation.msgs.push(msg);
        conversation.save();
    } catch (error) {
        console.log(error.message);
    }
}

export const getMsgToConversation = async (req, res) => {
    try {
        const {sender, receiver} = req.query;
        const participants = [sender, receiver]
        console.log(participants);
        let conversation = await Conversation.findOne({users: {$all: participants}});
        console.log(conversation);
        if (!conversation) {
            return res.status(200).send();
        }
        return res.status(200).json(conversation.msgs);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: 'Error in getting conversation: ' + error.message});
    }
}

