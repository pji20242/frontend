import { redirect } from "@tanstack/react-router";
import axios from "axios";

axios.interceptors.request.use((config) => {
	const token = localStorage.getItem("jwt_token");
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

axios.interceptors.response.use(
	(response) => response,
	(error) => {
		console.log(error);

		if (error.response.status === 401) {
			localStorage.removeItem("jwt_token");
			redirect({ to: "/auth" });
		}

		return Promise.reject(error);
	},
);
