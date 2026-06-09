const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

let queue = [];
let tokenNumber = 1;

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

app.get("/queue", (req, res) => {
    res.json(queue);
});

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
