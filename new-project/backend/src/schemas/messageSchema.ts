import { Schema, model } from 'mongoose';

interface IMessage {
    from: string,
    to: string,
    message:string
};

// Creates a userMessage schema
const userMessageSchema = new Schema<IMessage>({
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true,
        maxlength: 140,
        minlength: 1
    }
}, {timestamps: true});

// Creates a UserMessage model
const UserMessage = model<IMessage>('UserMessage', userMessageSchema);

export default UserMessage;
