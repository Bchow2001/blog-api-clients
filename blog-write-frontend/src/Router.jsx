import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import LogIn from "./components/LogIn";

const Router = () => {
	const router = createBrowserRouter([
		{ path: "/", element: <App /> },
		{ path: "/login", element: <LogIn /> },
	]);
	return <RouterProvider router={router} />;
};

export default Router;
