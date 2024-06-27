import { Schema, model, Document } from 'mongoose';

// Define the interface for a Friend
export interface IFriend extends Document {
    username: string;
    accepted: boolean;
}

// Create a friend schema
const friendSchema = new Schema<IFriend>({
    username: {
        type: String,
        required: true
    },
    accepted: {
        type: Boolean,
        default: false
    }
});

// Create a Friend model
const Friend = model<IFriend>('Friend', friendSchema);
export default Friend;
