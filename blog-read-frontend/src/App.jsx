import "./App.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
	return (
		<ul>
			{posts.map((post) => {
				return <PostItem key={post._id} post={post} />;
			})}
		</ul>
	);
}

function App() {
	const [posts, setPosts] = useState(null);

	useEffect(() => {
		async function fetchPosts() {
			try {
				let response = await fetch("http://localhost:3000/api/posts", {
					mode: "cors",
				});
				response = await response.json();
				setPosts(response.posts);
			} catch (e) {
				console.log(e);
			}
		}
		fetchPosts();
	}, []);

	return (
		<>
			<h1>Posts</h1>
			{posts != null && <PostList posts={posts} />}
		</>
	);
}

export default App;
