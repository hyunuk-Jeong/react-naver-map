import React, { useEffect } from "react";
import useInitializeMap from "../hooks/useInitializeMap";
import useMarkers from "../hooks/useMarkers";
import useGoToLocation from "../hooks/useGoToLocation";
import useCurrentLocation from "../hooks/useCurrentLocation";
import "./Map.scss";
import { ic_gps } from "../assets/assets";
import setupMapListeners from "../listeners/mapListeners";
import { webviewListener } from "../listeners/webviewListener";
import { useMap } from "./MapContext";

const Map: React.FC = () => {
  const mapRef = useMap(); // 전역적으로 사용할 mapRef
  const { isMapReady } = useInitializeMap("map"); // 네이버 지도 초기화
  const currentPosition = useCurrentLocation(); // 현재 위치 가져오기
  const { addMarker, removeMarker, clearMarkers, addCurrentLocationMarker, setDefaultMarkerStyle,setSelectedMarkerStyle,setInfoWindowContent,addMapMarkerListener } = useMarkers();
  const { goToCurrentLocation, goToTargetLocation } = useGoToLocation(mapRef, currentPosition); // 현재 위치 및 특정 위치로 이동하는 함수들

  useEffect(() => {
    console.log("isMapReady:", isMapReady);
    goToCurrentLocation(); // 최초 1회 이동
    if (currentPosition != null) {
      addCurrentLocationMarker(mapRef,currentPosition); // 현재 위치에 원 추가
    }
    setupMapListeners(mapRef); // 맵 리스너 설정
    addMapMarkerListener(mapRef); // 마커부 맵 클릭 리스너 설정
  
  }, [isMapReady]);

  useEffect(() => {
    if (currentPosition != null) {
      addCurrentLocationMarker(mapRef,currentPosition); // 현재 위치에 원 추가
    }
  }
    , [currentPosition]);

  useEffect(() => {
    const handleMessage = (event: any) => {
      const mapActions = {
        addMarker,
        removeMarker,
        clearMarkers,
        goToTargetLocation,
        setDefaultMarkerStyle,
        setSelectedMarkerStyle,
        setInfoWindowContent
      };

      // 여러 함수들을 mapActions 객체로 묶어 전달
      webviewListener(event, mapRef, mapActions);
    };
    document.addEventListener("message", handleMessage);
    window.addEventListener("message", handleMessage);

    return () => {
      document.removeEventListener("message", handleMessage);
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <div className="map-container">
      <div className="map" id="map" />
      {/* 현재 위치 버튼 */}
      <div className="map-gps-button" onClick={goToCurrentLocation} style={{ display: currentPosition ? "flex" : "none" }}>
        <img src={ic_gps} alt="GPS" />
      </div>
    </div>
  );
};

export default Map;
