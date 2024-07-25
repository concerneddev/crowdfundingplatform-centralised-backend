import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.SECRET_KEY;

export default (request, response, next) => {
    const token = request.header("x-auth-token");
    if(!token) {
        return response.status(401).send({message: "No token, access denied."});
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        request.decodedUserId = decoded.userId;
        next();
    } catch(error) {
        response.status(401).send(error.message);
    }
}