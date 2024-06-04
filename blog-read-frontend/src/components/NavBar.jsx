import { Link } from "react-router-dom";

function handleLogOut() {}

function NavBar(props) {
	const { user } = props;
	return (
		<div>
			<div>
				<p>Welcome {user ? user : "Guest"}</p>
			</div>
			<div>
				<Link to="/posts">Posts</Link>
				{!user ? (
					<Link to="/users/login">Log In </Link>
				) : (
					<button>Log out</button>
				)}
			</div>
		</div>
	);
}

export default NavBar;
