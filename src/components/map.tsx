import React from "react";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // Importa os estilos do Leaflet

// Interface para tipar os dados dos sensores
interface Sensor {
  uuid: string;
  latitude: number;
  longitude: number;
  peso: number;
}

// Ícone customizado para os marcadores
const customIcon = new L.Icon({
  iconUrl: "https://leafletjs.com/examples/custom-icons/leaf-green.png",
  iconSize: [38, 95],
  iconAnchor: [22, 94],
  popupAnchor: [-3, -76],
});

export default function DeviceMap() {
  // Estados para armazenar os sensores, o loading e eventuais erros
  const [sensors, setSensors] = React.useState<Sensor[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  // Posição central do mapa (pode ser ajustada conforme necessário)
  const defaultPosition: [number, number] = [-23.55052, -46.633308]; // Exemplo: São Paulo

  // Busca os dados dos sensores ao montar o componente
  React.useEffect(() => {
    fetch("/api/v1/map")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Falha ao carregar dados dos sensores.");
        }
        return response.json();
      })
      .then((data: Sensor[]) => {
        setSensors(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <MapContainer
      center={defaultPosition}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Se houver erro, exibe um popup informando */}
      {error && (
        <Popup position={defaultPosition}>
          Erro ao carregar sensores: {error}
        </Popup>
      )}

      {/* Se estiver carregando, pode exibir um popup informando */}
      {loading && (
        <Popup position={defaultPosition}>
          Carregando sensores...
        </Popup>
      )}

      {/* Renderiza um marcador para cada sensor retornado */}
      {!loading &&
        sensors.map((sensor) => (
          <Marker
            key={sensor.uuid}
            position={[sensor.latitude, sensor.longitude]}
            //icon={customIcon}
          >
            <Popup>
              <div>
                <strong>Sensor:</strong> {sensor.uuid}
                <br />
                <strong>Peso:</strong> {sensor.peso}
              </div>
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
}
