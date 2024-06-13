import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import LogIn from "./components/LogIn";
import PostForm from "./components/PostForm";

const Router = () => {
	const router = createBrowserRouter([
		{ path: "/", element: <App /> },
		{ path: "/login", element: <LogIn /> },
		{ path: "/create-post", element: <PostForm /> },
	]);
	return <RouterProvider router={router} />;
};

export default Router;
