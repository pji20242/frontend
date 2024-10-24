import React from 'react';
import MyMap from './MyMap';  // Importando o componente de mapa

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>Mapa com Leaflet em React</h1>
      <MyMap />  {/* Componente do mapa */}
    </div>
  );
};

export default App;
