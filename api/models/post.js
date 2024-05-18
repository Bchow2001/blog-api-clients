const mongoose = require("mongoose");

const { Schema } = mongoose;

const PostSchema = new Schema({
	title: { type: String, required: true },
	text: { type: String, required: true },
	timestamp: { type: Date, required: true },
	published: { type: Boolean, required: true },
	author: { type: Schema.Types.ObjectId, ref: "User" },
});

PostSchema.virtual("url").get(function () {
	return `/posts/${this._id}`;
});

module.exports = mongoose.model("Post", PostSchema);
