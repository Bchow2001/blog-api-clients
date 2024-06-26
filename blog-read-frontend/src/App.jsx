import "./App.css";
import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import NavBar from "./components/NavBar";

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

function App() {
	const [posts, setPosts] = useState(null);
	const [user, setUser] = useState(null);

	const navigate = useNavigate();

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
				<NavBar user={user} />
				<h1>Posts</h1>
				{posts != null && <PostList posts={posts} />}
			</>
		);
	} else {
		<Navigate to="/users/login" />;
	}
}

export default App;
