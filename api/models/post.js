const mongoose = require("mongoose");

const { Schema } = mongoose;

const PostSchema = new Schema(
	{
		title: { type: String, required: true },
		text: { type: String, required: true },
		published: { type: Boolean, required: true },
		author: { type: Schema.Types.ObjectId, ref: "User" },
	},
	{ timestamps: true },
);

PostSchema.virtual("url").get(function () {
	return `/api/posts/${this._id}`;
});

module.exports = mongoose.model("Post", PostSchema);
