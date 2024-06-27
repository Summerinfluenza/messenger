import express, { Request, Response, NextFunction } from 'express';
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';

import dotenv from 'dotenv';
dotenv.config();

export interface CustomRequest extends Request {
    token: string | JwtPayload;
}

export default class Token {
    //Authentication by token generated in authService login.
    async auth(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.header("Authorization")?.replace("Bearer", "").trim();
            if(!token) {
                throw new Error();
            }
            const decoded = jwt.verify(token, process.env.JWT_KEY as string);
            (req as CustomRequest).token = decoded;
            next();
        } catch (err) {
            res.status(401).json({message: "Please authenticate"});
            return
        }
    }
};
