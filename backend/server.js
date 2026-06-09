
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "smartqueue_secret_key";

const app = express();

app.use(cors());
app.use(express.json());

let queue = [];
let tokenNumber = 1;

/* JWT Verification Middleware */

function verifyToken(req, res, next) {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(403).json({
            message: "Token required"
        });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, SECRET_KEY, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                message: "Invalid token"
            });
        }

        req.user = decoded;
        next();
    });
}

/* Login API */

app.post("/login", (req, res) => {

    const { email, password } = req.body;

    if (
        email === "admin@smartqueue.com" &&
        password === "admin123"
    ) {

        const token = jwt.sign(
            {
                email,
                role: "admin"
            },
            SECRET_KEY,
            {
                expiresIn: "1h"
            }
        );

        return res.json({
            message: "Login successful",
            token
        });
    }

    res.status(401).json({
        message: "Invalid credentials"
    });
});

/* Book Token */

app.post("/book-token", (req, res) => {

    const user = req.body.name;

    const token = {
        tokenNumber: tokenNumber++,
        name: user,
        status: "Waiting"
    };

    queue.push(token);

    res.json(token);
});

/* Protected Queue API */

app.get("/queue", verifyToken, (req, res) => {
    res.json(queue);
});

/* Call Next Token */

app.put("/next-token", (req, res) => {

    if (queue.length > 0) {
        queue.shift();
    }

    res.json({
        message: "Next token called"
    });
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});

