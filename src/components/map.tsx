import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // Importa os estilos do Leaflet

// Definir a posição do marcador
const position: [number, number] = [-23.55052, -46.633308]; // Exemplo: São Paulo

// Definir ícone customizado (opcional)
const customIcon = new L.Icon({
	iconUrl: "https://leafletjs.com/examples/custom-icons/leaf-green.png",
	iconSize: [38, 95],
	iconAnchor: [22, 94],
	popupAnchor: [-3, -76],
});

export default function DeviceMap() {
	return (
		<MapContainer
			center={position}
			zoom={13}
			style={{ height: "100%", width: "100%" }}
		>
			<TileLayer
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			/>
			<Marker position={position} icon={customIcon}>
				<Popup>
					Um exemplo de Popup em São Paulo. <br /> Customizado com ícone.
				</Popup>
			</Marker>
		</MapContainer>
	);
};

