import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import NavBar from "./NavBar";

function CommentItem({ comment }) {
	return (
		<li>
			<h4>Commenter: {comment.author.username}</h4>
			<p>Commented at: {comment.createdAt}</p>
			<p>{comment.text}</p>
		</li>
	);
}

function CommentList({ comments }) {
	return (
		<ul>
			{comments.map((comment) => {
				return <CommentItem key={comment._id} comment={comment} />;
			})}
		</ul>
	);
}

function Post() {
	const [user, setUser] = useState(null);
	const [post, setPost] = useState(null);
	const [comments, setComments] = useState(null);
	const { postId } = useParams();

	useEffect(() => {
		async function fetchPost() {
			try {
				let response = await fetch(
					`http://localhost:3000/api/posts/${postId}`,
					{
						mode: "cors",
						headers: new Headers({
							Authorization: `Bearer ${localStorage.getItem(
								"accessToken",
							)}`,
						}),
					},
				);
				response = await response.json();
				setPost(response.post);
				setComments(response.comments);
				setUser(response.user);
			} catch (e) {
				console.log(e);
			}
		}
		fetchPost();
	}, [postId]);

	if (post === undefined) {
		const message = "Post was not found";
		return <Navigate to="/error" state={{ message: message }} />;
	} else if (post !== null) {
		return (
			<>
				<NavBar user={user} />
				<h1>{post.title}</h1>
				<h2>Written by: {post.author.username}</h2>
				<p>{post.text}</p>
				<hr />
				<h3>Comments:</h3>
				{comments != null && <CommentList comments={comments} />}
			</>
		);
	}
}

export default Post;
