const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.json());

const messageSchema = new mongoose.Schema({
    message: { type: String }
});

const Message = mongoose.model("message", messageSchema);

Message.watch().on("change", data => console.log("change stream", data));

app.get("/", async (req, res) => {
    res.send("<h1>hello from server!</h1>");
});

app.get("/message", async (req, res) => {
    const messages = await Message.find();
    res.json(messages);
});

app.post("/message", async (req, res) => {
    const message = req.body.message;
    try {
        const newMessage = new Message({
            message
        });
        await newMessage.save();
        res.json(newMessage);
    } catch (err) {
        console.error("cannot post message", err.message);
    }
});

const PORT = process.env.PORT || 4000;
const connectionStream =
    "mongodb://mongo:27017,mongo_repl:27018/mydb?replicaSet=message";

mongoose
    .connect(connectionStream)
    .then(res => {
        app.listen(PORT, () => {
            console.log("server started on ", PORT);
        });
    })
    .catch(err => {
        console.error(err.message);
    });
