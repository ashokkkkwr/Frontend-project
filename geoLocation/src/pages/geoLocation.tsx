import React, { useState } from 'react';

type Position = {
  latitude: number;
  longitude: number;
} | null;

const Geolocation = () => {
  const [position, setPosition] = useState<Position>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
          setError(null);
        },
        (err) => {
          console.log("🚀 ~ handleGetLocation ~ err:", err);
          setError('Unable to retrieve location');
        }
      );
    } else {
      console.log('Geolocation is not supported by this browser.');
      setError('Geolocation is not supported by this browser.');
    }
  };

  return (
    <div>
      <button onClick={handleGetLocation}>Get Location</button>
      {position && (
        <div>
          <h2>Location Details:</h2>
          <p>Latitude: {position.latitude}</p>
          <p>Longitude: {position.longitude}</p>
        </div>
      )}
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default Geolocation;
