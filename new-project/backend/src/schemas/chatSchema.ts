import { Schema, model } from 'mongoose';

interface IChat {
    membersId: string[],
    messagesId: string[]
};

// Create a chatSchema schema
const chatSchema = new Schema<IChat>({
    membersId: {
        type: [],
        required: true
    },
    messagesId: {
        type: []
    }
}, {timestamps: true});

// Create a UserMessage model
const Chat = model<IChat>('Chat', chatSchema);

export default Chat;
