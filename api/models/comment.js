const mongoose = require("mongoose");

const { Schema } = mongoose;

const CommentSchema = new Schema({
	text: { type: String, required: true },
	timestamp: { type: Date, required: true },
	// author: { type: Schema.Types.ObjectId, ref: "User", required: true },
	post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
});

CommentSchema.virtual("url").get(function () {
	return `/posts/${this.post}/comments/${this._id}`;
});

module.exports = mongoose.model("Comment", CommentSchema);
