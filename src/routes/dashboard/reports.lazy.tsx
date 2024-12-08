import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/reports")({
	component: Reports,
});

function Reports() {
	return (
		<div>
			<h2 className="text-3xl mb-16">Relatórios</h2>
			lkfjsdkfsfjkd
		</div>
	);
}
