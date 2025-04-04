import React, { createContext, useContext, useRef } from "react";

const MapContext = createContext<any>(null);

export const MapProvider = ({ children }: { children: React.ReactNode }) => {
  const mapRef = useRef<any>(null); // 전역적으로 사용할 mapRef

  return (
    <MapContext.Provider value={mapRef}>
      {children}
    </MapContext.Provider>
  );
};

export const useMap = () => useContext(MapContext); // 쉽게 가져오는 Hook
