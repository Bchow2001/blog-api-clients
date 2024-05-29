import {
	createBrowserRouter,
	RouterProvider,
	Navigate,
} from "react-router-dom";
import App from "./App";
import Post from "../src/components/Post";
import "./index.css";

const Router = () => {
	const router = createBrowserRouter([
		{ path: "/", element: <Navigate to="/posts" /> },
		{ path: "/posts", element: <App /> },
		{ path: "/posts/:postId", element: <Post /> },
	]);
	return <RouterProvider router={router} />;
};

export default Router;
