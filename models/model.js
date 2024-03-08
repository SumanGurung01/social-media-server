const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
});

const PostSchema = new mongoose.Schema({
    user: {
        type: Object
    },
    topic: String,
    content: String,
    likes: [],
    comments: []
});

const UserModel = mongoose.model("User", UserSchema);

const PostModel = mongoose.model("Post", PostSchema);

module.exports = {
    UserModel,
    PostModel
};
