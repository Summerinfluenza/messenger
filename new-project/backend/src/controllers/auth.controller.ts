import express, { Request, Response, NextFunction } from 'express';
import { check, validationResult } from 'express-validator';
import AuthService from "../services/auth.service"
import Token from "../services/auth";

const router = express.Router();
const authService = new AuthService();
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
 * '/auth/verify':
 *  post:
 *     tags:
 *     - User Controller
 *     summary: Verifies a user.
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - email
 *            properties:
 *              email:
 *                type: email
 *                default: test@gmail.com
 * 
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
router.post('/verify', async (req: Request, res: Response) => {
    try {
        await token.auth(req, res, () => {});
        res.status(200).json({message: "success"});
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(500).send(error);
    }
});


/** POST Methods */
/**
 * @openapi
 * '/auth/signup':
 *  post:
 *     tags:
 *     - User Controller
 *     summary: Creates a user.
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - email
 *              - password
 *              - username
 *              - age
 *              - info
 *            properties:
 *              email:
 *                type: email
 *                default: test@gmail.com
 *              password:
 *                type: password
 *                default: randompass
 *              username:
 *                type: string
 *                default: Tango
*              info:
 *                type: string
 *                default: I'm great!
 *              age:
 *                type: integer
 *                default: 18 
 * 
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
router.post("/signup", [
    check('email').isEmail().withMessage('Enter a valid email'),
    check('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    check('username').trim().escape(),
    check('info').trim().escape(),
    check('age').isInt({ min: 1 }).withMessage('Age must be a positive integer')
], handleValidationErrors, async (req: Request, res: Response) => {

    try {
        const { email, password, username, info, age } = req.body;
        return await authService.signup(email, password, username, info, age, res)
    } catch (error) {
        return res.status(500).send(error);
    }
});

/** POST Methods */
/**
 * @openapi
 * '/auth/login':
 *  post:
 *     tags:
 *     - User Controller
 *     summary: Login.
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - email
 *              - password
 * 
 *            properties:
 *              email:
 *                type: email
 *                default: test@gmail.com
 *              password:
 *                type: password
 *                default: randompass
 *     responses:
 *      200:
 *        description: Fetched Successfully
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
router.post("/login", [
    check('email').isEmail().withMessage('Enter a valid email'),
    check('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
], handleValidationErrors, async (req: Request, res: Response) => {


    try {
        const { email, password } = req.body;
        return await authService.login(email, password, res)
    } catch (error) {
        res.status(500).send(error);
    }

});

//auth/logout
/* router.post('/verify', verifyToken, (req: Request, res: Response) => {
    res.status(200).json({ message: 'success' });
}); */

/**
 * @openapi
 * '/auth/getfriends/:id':
 *  get:
 *     tags:
 *     - User Controller
 *     summary: Get friends by id.
 *     responses:
 *      200:
 *        description: Fetched Successfully
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
router.get('/getfriends/:id', token.auth, async (req: Request, res: Response) => {

    try {
        const userId = escapeHtml(req.params.id);
        const user = await authService.getFriends(userId);
        return res.status(200).json({ message: 'success', data: user });
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching users', error });
    }
});

/**
 * @openapi
 * '/auth/getuserid':
 *  post:
 *     tags:
 *     - User Controller
 *     summary: Gets a userid by email.
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - email
 * 
 *            properties:
 *              email:
 *                type: email
 *                default: test@gmail.com
 *     responses:
 *      200:
 *        description: Fetched Successfully
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
router.post('/getuserid', [
    check('email').isEmail().withMessage('Enter a valid email')
], handleValidationErrors, token.auth, async (req: Request, res: Response) => {
    try {
        return await authService.getUserId(req.body.email, res);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching users', error });
    }
});

/**
 * @openapi
 * '/auth/findall':
 *  post:
 *     tags:
 *     - User Controller
 *     summary: Gets all users.
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - value
 * 
 *            properties:
 *              value:
 *                type: string
 *                default: test
 *     responses:
 *      200:
 *        description: Fetched Successfully
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
router.post('/findall', [
    check('value').trim().escape()
], handleValidationErrors, token.auth, async (req: Request, res: Response) => {
    try {
        const users = await authService.findAll(req.body.value, res);
        return res.status(201).json({ message: 'success', data: users });
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching users', error });
    }
});

/**
 * @openapi
 * '/auth/friendrequest':
 *  post:
 *     tags:
 *     - User Controller
 *     summary: Sends a friend request.
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - id
 *              - friendname
 * 
 *            properties:
 *              id:
 *                type: string
 *                default: 66659265189156297298191b
 *              friendname:
 *                type: string
 *                default: test@gmail.com
 *     responses:
 *      200:
 *        description: Fetched Successfully
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
router.post('/friendrequest', [
    check('id').trim().escape(),
    check('friendname').isEmail().withMessage('Enter a valid email')
], handleValidationErrors, token.auth, async (req: Request, res: Response) => {
    try {
        const result = await authService.friendRequest(req.body.id, req.body.friendname, res);
        return result;
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching users', error });
    }
});

/**
 * @openapi
 * '/auth/addfriend':
 *  post:
 *     tags:
 *     - User Controller
 *     summary: Accepts a user's friendrequest.
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - id
 *              - friendname
 * 
 *            properties:
 *              id:
 *                type: string
 *                default: 66659265189156297298191b
 *              friendname:
 *                type: string
 *                default: test@gmail.com
 *     responses:
 *      200:
 *        description: Fetched Successfully
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
router.post('/addFriend', [
    check('id').trim().escape(),
    check('friendname').isEmail().withMessage('Enter a valid email')
], handleValidationErrors, token.auth, async (req: Request, res: Response) => {
    try {
        const result = await authService.addFriend(req.body.id, req.body.friendname, res);
        return result;
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching users', error });
    }
});

export default router;
