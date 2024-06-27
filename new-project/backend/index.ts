import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import mongoose, { ConnectOptions } from 'mongoose';
import message from "./src/controllers/message.controller"
import auth from "./src/controllers/auth.controller"
import dotenv from 'dotenv';
import swaggerDocs from './swagger'

dotenv.config();

const app = express();
swaggerDocs(app, Number(process.env.PORT));

interface ServerConfig {
    port: number;
}

type Callback = () => void;

/**
 * Returns a server and executes the callback when the server is running.
 * 
 * @param {ServerConfig} config - Server configuration 
 * @param {Callback} [callback] - Optional callback function
 * @returns {Promise<void>}
 */
function startServer(config: ServerConfig, callback?: Callback): void {
    const port = config.port;
    app.listen(port, () => {
        if (callback) {
            callback();
        }
    });
}

//-----------------Database------------------------
// Connection URL
const uri = `mongodb+srv://${process.env.DBUSERNAME}:${process.env.DBPASSWORD}@cluster0.tokgkkp.mongodb.net/?retryWrites=true&w=majority`;
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: process.env.DBNAME
} as ConnectOptions)
    .then(() => {
        app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
        });
        
    })
    .catch((err: Error) => console.log(err));

//-----------------Assets------------------------

app.use(cors());

// static assets
app.use(express.static("./message-app"));

// parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//-----------------Router------------------------
// Routes to message
app.use("/message", message);

// Routes to auth
app.use("/auth", auth);




//-----------------Error Handling------------------------

// Error handling 405
app.all("/message", (req: Request, res: Response) => {
    res.status(405).send("Error 405: Method not allowed.");
});

// Error handling middleware for 404 errors
app.use((req: Request, res: Response) => {
    res.status(404).send('Error 404: Page not found.');
});

// Error handling middleware for 500 errors
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(500).send("Error 500: Something went terribly wrong.");
});

// Route for simulating a 500 internal server error
app.get('/message/internalerror', (req: Request, res: Response) => {
    // Simulate an internal server error by throwing an exception
    throw new Error('Internal Server Error');
});

export { startServer };