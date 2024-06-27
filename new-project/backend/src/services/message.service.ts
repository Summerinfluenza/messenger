import express, { Request, Response, NextFunction } from 'express';
import UserMessageSchema from '../schemas/messageSchema';
import ChatSchema from  '../schemas/chatSchema';

export default class MessageService {
    async getMessages(membersId: string[], res: Response): Promise<any> {
        try {
            const result =  await UserMessageSchema.find({ 
                from: {$in: [membersId[0], membersId[1]]}, 
                to: {$in: [membersId[0], membersId[1]]}
            }).sort({ createdAt:1 });
            return res.status(200).json(result);

        } catch (error) {
            const err = error as Error;
            return res.status(500).json({ error: err.message });
        }

    }

    async createChat(membersId: string[], res: Response) {
        const reversedMembersId = membersId.reverse();

        const query = {membersId: { $in: [membersId, reversedMembersId]}};

        try {
            const chat = await ChatSchema.find({query});

            if (chat) {
                return res.status(200).json({message: "success"});
            }
            const chatModel = new ChatSchema({
                membersId: membersId
            });
            await chatModel.save();
            
            return res.status(200).json({message: "success"});
            
        } catch (error) {
            const err = error as Error;
            if (err.name === "ValidationError") {
                return res.status(400).send("Error 400: Invalid parameter");
            } else {
                return res.status(500).json({ error: err.message });
            }
        }
    }

    async createMessage(from:string, to: string, message: string, res: Response) {
        
        try {
            const messageModel = new UserMessageSchema({
                from: from,
                to: to,
                message: message.trim()
            });

            const result = await messageModel.save();
            return res.status(200).json(result);
                
    
            
        } catch (error) {
            const err = error as Error;
            if (err.name === "ValidationError") {
                return res.status(400).send("Error 400: Invalid parameter");
            } else {
                return res.status(500).json({ error: err.message });
            }
        }
    }
}