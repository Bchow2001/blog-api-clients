import { useState } from "react";
import { useNavigate } from "react-router-dom";

function PostForm() {
	const [title, setTitle] = useState("");
	const [text, setText] = useState("");
	const [published, setPublished] = useState(true);
	const [errors, setErrors] = useState(null);

	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		const requestOptions = {
			method: "POST",
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
				`http://localhost:3000/api/posts`,
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
						onChange={(e) => setText(e.target.value)}
					>
						{text}
					</textarea>
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
			<div>
				{errors.length !== 0 &&
					errors.map((error) => {
						return <p key={error.path}>{error.msg}</p>;
					})}
			</div>
		</>
	);
}

export default PostForm;
