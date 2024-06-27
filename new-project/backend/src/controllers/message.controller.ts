import express, { Request, Response, NextFunction } from 'express';
import { check, validationResult } from 'express-validator';
import MessageService from '../services/message.service';
import Token from "../services/auth"

const router = express.Router();
const messageService = new MessageService();
const token = new Token();

// Helper function to escape HTML
function escapeHtml(str: string): string {
    return str.replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Middleware to handle validation errors
const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

//-----------------REST API------------------------
/** POST Methods */
/**
 * @openapi
 * '/message/getmessages':
 *  post:
 *     tags:
 *     - User Controller
 *     summary: Gets all messages between two users.
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - membersId
 * 
 *            properties:
 *              membersId:
 *                type: array
 *                default: ["66659265189156297298191b", "666d0d116017825bf3b9750f"]
 *     responses:
 *      200:
 *        description: Fetched
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
router.post("/getmessages", [
    check('membersId').isArray().withMessage('membersId must be an array of strings')
], handleValidationErrors, token.auth, async (req: Request, res: Response) => {
    try {
        const firstId = req.body.membersId[0];
        const secondsId = req.body.membersId[1];
        return await messageService.getMessages([firstId, secondsId], res);
    } catch (error) {
        const err = error as Error;
        return res.status(500).json({ error: err.message });
    }
});

/** POST Methods */
/**
 * @openapi
 * '/message/createchat':
 *  post:
 *     tags:
 *     - User Controller
 *     summary: Creates a chat.
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - membersId
 *              - messagesId
 * 
 *            properties:
 *              membersId:
 *                type: String[]
 *                default: ["66659265189156297298191b", "666d0d116017825bf3b9750f"]
 *              messagesId:
 *                type: []
 *                default: []
 *     responses:
 *      201:
 *        description: Created
 *      409:
 *        description: Conflict
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
router.post("/createchat", [
    check('membersId').isArray().withMessage('membersId must be an array of strings')
], handleValidationErrors, token.auth, async (req: Request, res: Response) => {
        try {
            const firstId = req.body.membersId[0];
            const secondsId = req.body.membersId[1];
            return await messageService.createChat([firstId, secondsId], res);
        } catch (error) {
            const err = error as Error;
            return res.status(500).json({ error: err.message });
        }


    });

/** POST Methods */
/**
 * @openapi
 * '/message/createmessage':
 *  post:
 *     tags:
 *     - User Controller
 *     summary: Creates a message.
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - from
 *              - to
 *              - message
 * 
 *            properties:
 *              from:
 *                type: string
 *                default: "66659265189156297298191b"
 *              to:
 *                type: string
 *                default: "666d0d116017825bf3b9750f"
 *              message:
 *                type: string
 *                default: Hello there
 *     responses:
 *      201:
 *        description: Created
 *      409:
 *        description: Conflict
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
router.post("/createmessage", [
    check('from').isString().trim().escape(),
    check('to').isString().trim().escape(),
    check('message').isString().trim().escape()
], handleValidationErrors, token.auth, async (req: Request, res: Response) => {
        

        const from = escapeHtml(req.body.from);
        const to = escapeHtml(req.body.to);
        const message = escapeHtml(req.body.message);
        try {
            return await messageService.createMessage(from, to, message, res);
        } catch (error) {
            const err = error as Error;
            return res.status(500).json({ error: err.message });
        }


    });

export default router;
