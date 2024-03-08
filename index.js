const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const { UserModel, PostModel } = require("./models/model.js");

mongoose
    .connect(
        "mongodb+srv://socialmedia:banaomern@cluster0.oisdgwm.mongodb.net/social-media?retryWrites=true&w=majority&appName=Cluster0"
    )
    .then(() => {
        console.log("Connected to database ");
    })
    .catch((err) => {
        console.error(`Error connecting to the database. \n${err}`);
    });

const app = express();

app.use(cors());
app.use(express());
app.use(bodyparser.json());

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.post("/registration", async (req, res) => {
    const { username } = req.body;
    const user = await UserModel.find({ username: username });

    if (user.length !== 0) {
        res.json({
            status: 0,
            message: "User with this username already exist"
        });
        return;
    }

    UserModel.create(req.body)
        .then((result) => {
            res.json({
                status: 1,
                message: "User Registered Successfully",
                user: result
            });
        })
        .catch(() => {
            res.json({ status: 0, message: "Error in Registration" });
        });
});

app.post("/login", async (req, res) => {
    const user = await UserModel.find(req.body);

    if (user.length !== 0) {
        res.json({ status: 1, message: "Login Successful", user: user[0] });
    } else {
        res.json({ status: 0, message: "Invalid Username or Password" });
    }
});

app.put("/forgotpassword", (req, res) => {
    const { username, email, newPassword } = req.body;

    UserModel.findOneAndUpdate({ username, email }, { password: newPassword })
        .then((result) => {
            result == null
                ? res.json({
                      status: 0,
                      message:
                          "Error in resetting password (Check Username and Email)"
                  })
                : res.json({
                      status: 1,
                      message: "Password Updated",
                      user: { ...result, password: newPassword }
                  });
        })
        .catch(() => {
            res.json({
                status: 0,
                message: "Error in resetting password"
            });
        });
});

app.post("/upload", (req, res) => {
    PostModel.create(req.body)
        .then(() => {
            res.json({
                status: 1,
                message: "Post Uploaded"
            });
        })
        .catch(() => {
            res.json({ status: 0, message: "Error in Uploading Post" });
        });
});

app.get("/post", (req, res) => {
    PostModel.find()
        .then((result) => {
            res.json({
                status: 1,
                post: result
            });
        })
        .catch(() => {
            res.json({ status: 0, message: "Error in fetching Post" });
        });
});

app.put("/like", async (req, res) => {
    const { post_id, user } = req.body;

    var post = await PostModel.find({ _id: post_id });
    post = post[0];
    const likes = post.likes;
    var alreadyLiked = false;

    likes.forEach((like) => {
        if (like._id === user._id) {
            alreadyLiked = true;
        }
    });

    var newLikes = [];
    if (alreadyLiked) {
        newLikes = likes.filter((like) => like._id !== user._id);
    } else {
        newLikes = [...likes, user];
    }

    PostModel.findOneAndUpdate({ _id: post_id }, { likes: newLikes })
        .then(() => {
            res.json({
                status: 1,
                message: "Like Updated"
            });
        })
        .catch(() => {
            res.json({
                status: 0,
                message: "Error"
            });
        });
});

app.put("/comment", async (req, res) => {
    const { post_id, user, comment } = req.body;

    var post = await PostModel.find({ _id: post_id });
    post = post[0];
    const comments = post.comments;

    var newComments = [];

    newComments = [...comments, { user: user, comment: comment }];

    PostModel.findOneAndUpdate({ _id: post_id }, { comments: newComments })
        .then(() => {
            res.json({ status: 1, message: "Comment Updated" });
        })
        .catch(() => {
            res.json({ status: 0, message: "Error" });
        });
});

app.delete("/deletepost", (req, res) => {
    const { post_id } = req.body;

    PostModel.deleteOne({ _id: post_id })
        .then(() => {
            res.json({ status: 1, message: "Post Deleted" });
        })
        .catch(() => {
            res.json({ status: 0, message: "Error" });
        });
});

app.put("/updatepost", async (req, res) => {
    const { post_id, topic, content } = req.body;

    PostModel.findOneAndUpdate(
        { _id: post_id },
        { topic: topic, content: content }
    )
        .then(() => {
            res.json({ status: 1, message: "Post Updated" });
        })
        .catch(() => {
            res.json({ status: 0, message: "Error" });
        });
});

app.listen(5000, () => {
    console.log("Server Running on 5000");
});
