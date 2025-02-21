import path from "node:path";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [TanStackRouterVite(), react()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"), // Garante que @ resolve corretamente para src/
		},
	},
	preview: {
		allowedHosts: ["vm0.pji3.sj.ifsc.edu.br"],
	},
	server: {
		host: "localhost", // Garante que funciona localmente
		port: 5173, // Define a porta do servidor
		strictPort: true, // Evita que o Vite mude automaticamente a porta
		//https: process.env.HTTPS === "true", // Usa HTTPS se a variável de ambiente estiver definida
		proxy: {
			"/api": {
				target: "https://vm0.pji3.sj.ifsc.edu.br", // URL do backend
				changeOrigin: true,
				secure: false, // Se a API usa HTTPS com um certificado autoassinado, mantenha false
			},
		},
	},
});
