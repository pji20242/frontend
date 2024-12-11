import { GoogleOAuthProvider } from "@react-oauth/google"; // Importa o GoogleOAuthProvider
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import {
	QueryClient,
	QueryClientProvider,
} from '@tanstack/react-query'

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

// Create a client
const queryClient = new QueryClient()

// Render the app
// biome-ignore lint/style/noNonNullAssertion: Garantimos que o elemento existe no DOM
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<StrictMode>
			<QueryClientProvider client={queryClient}>
				<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
					<RouterProvider router={router} />
				</GoogleOAuthProvider>
			</QueryClientProvider>
		</StrictMode>,
	);
}
