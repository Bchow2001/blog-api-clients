import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

function ErrorPage() {
	const location = useLocation();
	return (
		<>
			<h1>Uh Oh! Something went wrong</h1>
			<h2>{location.state.message}</h2>
			<h3>Please try again later!</h3>
			<Link to="/">Click here to go back to home page</Link>
		</>
	);
}

export default ErrorPage;
