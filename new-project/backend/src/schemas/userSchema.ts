import { Schema, model, Document } from 'mongoose';
import validator from 'validator';


interface IUser extends Document {
    email: string,
    password: string,
    username: string,
    info: string,
    age: number,
    refresh: string,
    friends: { username: string, accepted: boolean }[];
}


// Create a user schema
const userSchema = new Schema<IUser>({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: (value: string) => validator.isEmail(value),
            message: (props: any) => `${props.value} is not a valid email`
        }
    },
    password: {
        type: String,
        required: true
    },
    username: {
        type: String,
    },
    info: {
        type: String,
    },
    age: {
        type: Number,
    },
    refresh: {
        type: String
    },
    friends: [{
        username: {
            type: String,
            required: true
        },
        accepted: {
            type: Boolean,
            default: false
        }
    }]
});

// Create a User model
const User = model<IUser>('User', userSchema);
export default User;

