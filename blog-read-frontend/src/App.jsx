import "./App.css";
import { useEffect, useState } from "react";

function App() {
	const [posts, setPosts] = useState(null);

	useEffect(() => {
		async function fetchPosts() {
			try {
				let response = await fetch("http://localhost:3000/api/posts", {
					mode: "cors",
				});
				response = await response.json();
				console.log(response);
				setPosts(response);
			} catch (e) {
				console.log(e);
			}
		}
		fetchPosts();
	}, []);

	return (
		<>
			<p className="read-the-docs">
				Click on the Vite and React logos to learn more
			</p>
			<div>{JSON.stringify(posts)}</div>
		</>
	);
}

export default App;
