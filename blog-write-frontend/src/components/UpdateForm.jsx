import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function UpdateForm() {
	const [title, setTitle] = useState("");
	const [text, setText] = useState("");
	const [published, setPublished] = useState(true);
	const [errors, setErrors] = useState([]);
	const { postId } = useParams();

	const navigate = useNavigate();

	useEffect(() => {
		async function fetchPost() {
			const requestOptions = {
				method: "GET",
				headers: new Headers({
					Authorization: `Bearer ${localStorage.getItem(
						"accessToken",
					)}`,
					"Content-Type": "application/json",
				}),
				mode: "cors",
			};
			try {
				let response = await fetch(
					`http://localhost:3000/api/posts/${postId}`,
					requestOptions,
				);
				if (response.status !== 200) {
					navigate("/login");
				}
				response = await response.json();
				setTitle(response.post.title);
				setText(response.post.text);
			} catch (e) {
				navigate("/login");
				console.log(e);
			}
		}
		fetchPost();
	}, [navigate, postId]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		const requestOptions = {
			method: "PUT",
			headers: new Headers({
				Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
				"Content-Type": "application/json",
			}),
			mode: "cors",
			body: JSON.stringify({
				title: title,
				text: text,
				published: published,
			}),
		};
		try {
			let response = await fetch(
				`http://localhost:3000/api/posts/${postId}`,
				requestOptions,
			);
			if (response.status === 200) {
				navigate("/");
			} else {
				response = await response.json();
				console.log(response);
				setErrors(response.errors);
			}
		} catch (e) {
			console.log(e);
		}
	};

	return (
		<>
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label htmlFor="title">Title:</label>
					<input
						type="text"
						name="title"
						id="title"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
				</div>
				<div className="form-group">
					<label htmlFor="text">Text:</label>
					<br />
					<textarea
						name="text"
						id="text"
						value={text}
						onChange={(e) => setText(e.target.value)}
					></textarea>
				</div>
				<div className="form-group">
					<label htmlFor="published">Publish this post?</label>
					<input
						type="checkbox"
						name="published"
						id="published"
						defaultChecked={published}
						onChange={() => setPublished((published) => !published)}
					/>
				</div>
				<button type="submit">Submit</button>
			</form>
			<div></div>
		</>
	);
}

export default UpdateForm;
