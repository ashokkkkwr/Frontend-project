import { useState } from "react";
import "./App.css";
import Geolocation from "./pages/geoLocation";
function App() {
  const [count, setCount] = useState(0);
  return (
    <>
      <Geolocation />
    </>
  );
}

export default App;
