import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import "./App.css";

function App() {
	const [posts, setPosts] = useState(null);
	const [user, setUser] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const [postDelete, setPostDelete] = useState(null);

	const navigate = useNavigate();

	function PostItem({ post }) {
		return (
			<li>
				<Link to={`${post._id}`}>
					<h2>{post.title}</h2>
				</Link>
				<h3>
					Author:{" "}
					{post.author.username ? post.author.username : "Anonymous"}
				</h3>
				<p>Created at: {post.createdAt}</p>
				{post.createdAt !== post.updatedAt && (
					<p>Updated at: {post.updatedAt}</p>
				)}
				<div>
					<button>Update Post</button>
					<button
						onClick={() => {
							setPostDelete(post);
							setShowModal(true);
						}}
					>
						Delete Post
					</button>
				</div>
			</li>
		);
	}

	function PostList({ posts }) {
		if (posts.length !== 0) {
			return (
				<ul>
					{posts.map((post) => {
						return <PostItem key={post._id} post={post} />;
					})}
				</ul>
			);
		} else {
			return <h2>No Posts Found!</h2>;
		}
	}

	// Delete Post Modal
	function DeleteModal() {
		const handleDelete = async (e) => {
			e.preventDefault();
			console.log(postDelete);
			const requestOptions = {
				method: "DELETE",
				headers: new Headers({
					Authorization: `Bearer ${localStorage.getItem(
						"accessToken",
					)}`,
					"Content-Type": "application/json",
				}),
				mode: "cors",
			};
			try {
				await fetch(
					`http://localhost:3000/api/posts/${postDelete._id}`,
					requestOptions,
				);
				window.location.reload();
			} catch (e) {
				console.log(e);
			}
		};

		if (postDelete !== null) {
			return (
				<div className="delete-modal">
					<h1>{postDelete.title}</h1>
					<h3>
						Author:{" "}
						{postDelete.author.username
							? postDelete.author.username
							: "Anonymous"}
					</h3>
					<p>Created at: {postDelete.createdAt}</p>
					{postDelete.createdAt !== postDelete.updatedAt && (
						<p>Updated at: {postDelete.updatedAt}</p>
					)}
					<h1>Are you sure you want to delete this post?</h1>
					<div>
						<button onClick={handleDelete}>Yes</button>
						<button>No</button>
					</div>
				</div>
			);
		}
	}

	useEffect(() => {
		async function fetchPosts() {
			try {
				let response = await fetch("http://localhost:3000/api/posts", {
					mode: "cors",
					headers: new Headers({
						Authorization: `Bearer ${localStorage.getItem(
							"accessToken",
						)}`,
					}),
				});
				if (response.status === 200) {
					response = await response.json();
					setPosts(response.posts);
					setUser(response.user);
				} else {
					navigate("/users/login");
				}
			} catch (e) {
				console.log(e);
			}
		}
		fetchPosts();
	}, [navigate]);

	if (user) {
		return (
			<>
				<h1>Posts</h1>
				{posts != null && <PostList posts={posts} />}
				{showModal && <DeleteModal />}
			</>
		);
	} else {
		<Navigate to="/login" />;
	}
}

export default App;
