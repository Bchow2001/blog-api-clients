import { Link, useNavigate } from "react-router-dom";

function NavBar(props) {
	const { user } = props;
	const navigate = useNavigate();

	function handleLogOut() {
		localStorage.removeItem("accessToken");
		navigate("/users/login");
	}

	return (
		<div>
			<div>
				<p>Welcome {user ? user : "Guest"}</p>
			</div>
			<div>
				{!user ? (
					<>
						{" "}
						<Link to="/users/login">Log In </Link>
						<Link to="/users/register">Register</Link>
					</>
				) : (
					<>
						<Link to="/posts">Posts</Link>
						<button onClick={handleLogOut}>Log out</button>
					</>
				)}
			</div>
		</div>
	);
}

export default NavBar;
