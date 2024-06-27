import jwt from "jsonwebtoken";

async function crypt(req, res, next) {
    try {
        res.setHeader("access-control-allow-origin", "*");
        const token = await req.body["token"]["token"];
        const decodedToken = await jwt.verify(
            token,
            "RANDOM-TOKEN"
        );
        

        const user = await decodedToken;

        req.user = user;

        next();

    } catch (err) {

        res.status(401).json({ message: "Invalid authorization" })
    }
}

export default crypt;