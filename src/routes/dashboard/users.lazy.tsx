import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/users")({
	component: Users,
});

function Users() {
	return (
		<div>
			<h2 className="text-3xl mb-16">Usuários</h2>
			lkfjsdkfsfjkd
		</div>
	);
}
