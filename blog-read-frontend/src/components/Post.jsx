import { useEffect, useState } from "react";
import { Navigate, useParams, useNavigate } from "react-router-dom";
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
	const [newComment, setNewComment] = useState(null);
	const [commentError, setCommentError] = useState(null);
	const { postId } = useParams();

	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		const requestOptions = {
			method: "Post",
			headers: new Headers({
				Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
				"Content-Type": "application/json",
			}),
			mode: "cors",
			body: JSON.stringify({
				text: newComment,
			}),
		};
		try {
			let response = await fetch(
				`http://localhost:3000/api/posts/${postId}/comments`,
				requestOptions,
			);
			if (response.status === 403) {
				response = await response.json();
				setCommentError(response.errors.errors);
			} else if (response.status === 200) {
				setNewComment("");
				setCommentError(null);
				window.location.reload();
			}
		} catch (e) {
			console.log(e);
		}
	};

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
				if (response.status === 200) {
					response = await response.json();
					setPost(response.post);
					setComments(response.comments);
					setUser(response.user);
				} else {
					navigate("/users/login");
				}
			} catch (e) {
				console.log(e);
			}
		}
		fetchPost();
	}, [navigate, postId]);

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
				{comments.length != 0 ? (
					<CommentList comments={comments} />
				) : (
					<p>There are no comments yet! Add your thoughts below :)</p>
				)}
				<form onSubmit={handleSubmit}>
					<div className="form-group">
						<label htmlFor="newComment">Submit new comment:</label>
						<br />
						<textarea
							name="newComment"
							id="newComment"
							onChange={(e) => setNewComment(e.target.value)}
						>
							{newComment}
						</textarea>
					</div>
					<button type="submit">Submit Comment</button>
					{commentError !== null && <p>{commentError}</p>}
				</form>
			</>
		);
	}
}

export default Post;
