import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import LogIn from "./components/LogIn";
import PostForm from "./components/PostForm";
import UpdateForm from "./components/UpdateForm";
import Post from "./components/Post";

const Router = () => {
	const router = createBrowserRouter([
		{ path: "/", element: <App /> },
		{ path: "/login", element: <LogIn /> },
		{ path: "/posts/:postId", element: <Post /> },
		{ path: "/create-post", element: <PostForm /> },
		{ path: "/update-post/:postId", element: <UpdateForm /> },
	]);
	return <RouterProvider router={router} />;
};

export default Router;
