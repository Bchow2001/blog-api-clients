import { Link } from "react-router-dom";

function ErrorPage() {
	return (
		<>
			<h1>Uh Oh! Something went wrong</h1>
			<h2>Please try again later!</h2>
			<Link to="/">Click here to go back to home page</Link>
		</>
	);
}

export default ErrorPage;
