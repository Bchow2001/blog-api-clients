import { Link } from "react-router-dom";

function NavBar(props) {
	const { user } = props;
	return (
		<div>
			<div>
				<p>Welcome {user ? user.username : "Guest"}</p>
			</div>
			<div>
				{!user && <Link to="/users/login">Log In </Link>}
				<Link to="/posts">Posts</Link>
			</div>
		</div>
	);
}

export default NavBar;
