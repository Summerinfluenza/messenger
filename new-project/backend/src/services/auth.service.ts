import express, { Request, Response, NextFunction } from 'express';
import UserSchema from '../schemas/userSchema';
import bcrypt from 'bcrypt'
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import Token from './auth';
import randtoken from "rand-token";


const saltRounds = 10;

export default class AuthService {
    constructor() {

    };

    async signup(
        email: string, 
        password: string, 
        username: string, 
        info: string, 
        age: number, 
        res: Response): Promise<any> {

        try {
            //Checks if user exists.
            const flag = await UserSchema.findOne({ email: email });
            if (flag) {
                return res.status(400).json({ error: "Email already registrated." });
            }

            //Encrypts the password.
            const encryptedPassword = await bcrypt.hash(password, saltRounds);
            const userModel = new UserSchema({
                email: email,
                password: encryptedPassword,
                username: username,
                info: info,
                age: age
            });

            const result = await userModel.save();
            return res.status(201).json({message: "success"});
        } catch (error) {
            const err = error as Error;
            return res.status(500).json({ error: err.message });
        }
    }

    async login(email: string, password: string, res: Response): Promise<any> {
        try {
            const user = await UserSchema.findOne({ email: email });
            if (!user) {
                return res.status(400).json({ error: "User not found" });
            }
            //Checks the password.
            const isMatch = bcrypt.compareSync(password, user.password);

            if (isMatch) {
                const token = jwt.sign({
                    _id: user._id.toString(),
                    name: user.email
                },
                    process.env.JWT_KEY as string, {
                    expiresIn: "2 days",
                })

                const filter = ({ email: email });
                user.refresh = randtoken.uid(256);

                await UserSchema.findOneAndUpdate(filter, user);

                return res.status(200).json({
                    message: "success",
                    user: {
                        _id: user._id,
                        email: user.email
                    },
                    token: token //to be extracted for authentication.
                });
            } else {
                return res.status(400).send("Error 400: Incorrect password");
            }
        } catch (error) {
            const err = error as Error;
            return res.status(500).json({ error: err.message });
        }
    }

    async getFriends(userId: string): Promise<any> {
        try {
            const user = await UserSchema.findOne({ _id: userId.replace(/"/g, "") });
            if (!user) {
                throw new Error('User not found');
            }
            return user;
        } catch (error) {
            console.error('Error fetching user:', error);
            const err = error as Error;
            throw new Error(err.message);
        }
    }

    async getUserId(email: string, res: Response): Promise<any> {
        try {
            const user = await UserSchema.findOne({ email: email.replace(/"/g, "") });

            if (!user) {
                return res.status(400).json({ error: "User doesn't exist." });
            }
            return res.status(201).json({ message: "success", userId: user._id });

        } catch (error) {
            const err = error as Error;
            return res.status(500).json({ error: err.message });
        }
    }

    async findAll(value: string, res: Response): Promise<any> {
        try {
            const users = await UserSchema.find({ email: { $regex: value } });
            const userDetails = users.map(user => ({
                email: user.email, 
                username: user.username, 
                info: user.info, 
                age: user.age}));
            return userDetails;

        } catch (error) {
            const err = error as Error;
            return res.status(500).json({ error: err.message });
        }
    }

    async friendRequest(userId: string, friendname: string, res: Response): Promise<any> {
        try {
            const user = await UserSchema.findOne({ _id: userId.replace(/"/g, "") })
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            
            // Checks if the friendname user exists.
            const friend = await UserSchema.findOne({ email: friendname.replace(/"/g, "") })
            if (!friend) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Checks if the friendname already exists in user's friends list
            const existingFriend = friend.friends.find(friend => friend.username === user.email);
            if (existingFriend) {
                if (existingFriend.accepted) {
                    return res.status(400).json({ message: 'Friend request already accepted' });
                } else {
                    return res.status(400).json({ message: 'Friend request already pending' });
                }
            }

            
            // If friendname not found, add newFriend to friends array
            const newFriend = {
                username: user.email,
                accepted: false
            };


            friend.friends.push(newFriend);
            // Save the updated friend document
            const result = await friend.save();

            return res.status(200).json({ message: "Friend request sent successfully" });
        } catch (error) {
            const err = error as Error;
            return res.status(500).json({ error: err.message });
        }


    }

    async addFriend(userId: string, friendname: string, res: Response): Promise<any> {
        const user = await UserSchema.findOne({ _id: userId.replace(/"/g, "") })

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Checks if the friendname user exists.
        const friend = await UserSchema.findOne({ email: friendname.replace(/"/g, "") })
        if (!friend) {
            return res.status(404).json({ message: 'User not found' });
        }

        try {
            let existingFriend = user.friends.find(friend => friend.username === friendname);
            if (existingFriend) {
                existingFriend.accepted = true;
            }

            await UserSchema.findOneAndUpdate({ _id: userId.replace(/"/g, "") }, { friends: user.friends });

            const newFriend = {
                username: user.email,
                accepted: true
            };

            friend.friends.push(newFriend);
            // Save the updated friend document
            await friend.save();


            return res.status(200).json({ message: "success" });
        } catch (error) {
            const err = error as Error;
            return res.status(500).json({ error: err.message });
        }


    }
}