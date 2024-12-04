import { RouterProvider, createRouter } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google"; // Importa o GoogleOAuthProvider

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

import "./index.css";

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

// Render the app
// biome-ignore lint/style/noNonNullAssertion: Garantimos que o elemento existe no DOM
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<StrictMode>
			<GoogleOAuthProvider clientId="1053161009517-46lj5ti5re5vrn94v20s5gbb7klfbj8o.apps.googleusercontent.com">
				<RouterProvider router={router} />
			</GoogleOAuthProvider>
		</StrictMode>,
	);
}
