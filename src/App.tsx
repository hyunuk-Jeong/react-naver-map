
import './App.css';
import Map from './components/Map';
import { MapProvider } from './components/MapContext';

function App() {

  return (
    <MapProvider>
      <Map />
    </MapProvider>
  );
}

export default App;
