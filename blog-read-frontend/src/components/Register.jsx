import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";

function Register() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [confirm, setConfirm] = useState("");
	const [first, setFirst] = useState("");
	const [last, setLast] = useState("");
	const [errors, setErrors] = useState([]);
	const navigate = useNavigate();

	const handleRegister = async (e) => {
		e.preventDefault();
		const requestOptions = {
			method: "Post",
			headers: { "Content-Type": "application/json" },
			mode: "cors",
			body: JSON.stringify({
				username: username,
				password: password,
				confirm_password: confirm,
				first_name: first,
				last_name: last,
			}),
		};
		try {
			let response = await fetch(
				"http://localhost:3000/api/users/",
				requestOptions,
			);
			if (response.status === 403) {
				response = await response.json();
				setPassword("");
				setConfirm("");
				setErrors(response.errors);
			} else if (response.status === 200) {
				navigate("/users/login");
			}
		} catch (e) {
			console.log(e);
		}
	};
	return (
		<>
			<NavBar user={false} />
			<form onSubmit={handleRegister}>
				<div className="form-group">
					<label htmlFor="username">Username:</label>
					<input
						type="input"
						name="username"
						id="username"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
					/>
				</div>
				<div className="form-group">
					<label htmlFor="password">Password:</label>
					<input
						type="password"
						name="password"
						id="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<label htmlFor="confirm">Confirm Password:</label>
					<input
						type="password"
						name="confirm"
						id="confirm"
						value={confirm}
						onChange={(e) => setConfirm(e.target.value)}
					/>
				</div>
				<div className="form-group">
					<label htmlFor="first">First Name:</label>
					<input
						type="text"
						name="first"
						id="first"
						value={first}
						onChange={(e) => setFirst(e.target.value)}
					/>
					<label htmlFor="last">Last Name:</label>
					<input
						type="text"
						name="last"
						id="last"
						value={last}
						onChange={(e) => setLast(e.target.value)}
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

export default Register;
