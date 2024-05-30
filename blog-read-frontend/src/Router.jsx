import {
	createBrowserRouter,
	RouterProvider,
	Navigate,
} from "react-router-dom";
import App from "./App";
import Post from "./components/Post";
import LogIn from "./components/LogIn";
import ErrorPage from "./components/ErrorPage";
import "./index.css";

const Router = () => {
	const router = createBrowserRouter([
		{
			path: "/",
			element: <Navigate to="/posts" />,
			errorElement: <ErrorPage />,
		},
		{ path: "/posts", element: <App /> },
		{ path: "/posts/:postId", element: <Post /> },
		{ path: "/users/logIn", element: <LogIn /> },
		{ path: "/error", element: <ErrorPage /> },
	]);
	return <RouterProvider router={router} />;
};

export default Router;
