import React, { useEffect, useState } from "react";
import { initializeMap } from "../utils/initializeMap";
import useMarkers from "../hooks/useMarkers";
import useGoToLocation from "../hooks/useGoToLocation";
import "./Map.scss";
import { ic_gps } from "../assets/assets";
import setupMapListeners from "../listeners/mapListeners";
import { webviewListener } from "../listeners/webviewListener";
import { useMap } from "./MapContext";
import { getCurrentLocation } from "../utils/getCurrentLocation";

const Map: React.FC = () => {
  const mapRef = useMap(); // 전역적으로 사용할 mapRef
  const [currentPosition, setCurrentPosition] = useState<{ lat: number; lng: number } | null>(null); // 현재 위치 가져오기
  const [isMapReady, setIsMapReady] = useState(false); // 맵 준비 상태
  const { updateMarkers, addMarker, removeMarker, clearMarkers, addCurrentLocationMarker, setDefaultMarkerStyle, setSelectedMarkerStyle, setInfoWindowContent, addMapMarkerListener } = useMarkers();
  const { goToCurrentLocation, goToTargetLocation } = useGoToLocation(mapRef, currentPosition); // 현재 위치 및 특정 위치로 이동하는 함수들

  useEffect(() => {
    if (isMapReady) {
      console.log("isMapReady:", isMapReady);
      goToCurrentLocation(); // 최초 1회 이동
      if (currentPosition != null) {
        addCurrentLocationMarker(mapRef, currentPosition); // 현재 위치에 원 추가
      }
      setupMapListeners(mapRef); // 맵 리스너 설정
      addMapMarkerListener(mapRef); // 마커부 맵 클릭 리스너 설정
    }
  }, [isMapReady]);

  useEffect(() => {
    if (currentPosition != null) {
      addCurrentLocationMarker(mapRef, currentPosition); // 현재 위치에 원 추가
    }

    if (window.ReactNativeWebView) {
      const data = currentPosition?{
        type: "CURRENT_LOCATION_CHANGED",
        lat: currentPosition.lat,
        lng: currentPosition.lng,
      }:{
        type: "CURRENT_LOCATION_CHANGED",
        lat: 37.5665,
        lng: 126.978,
      };
      window.ReactNativeWebView.postMessage(JSON.stringify(data));
    }

  }, [currentPosition]);

  useEffect(() => {
    const fetchLocation = async () => {
      const location = await getCurrentLocation();
      console.log("현재 위치:", location);


      if (location !== null) {
        setCurrentPosition(location); // 현재 위치 업데이트
      }
      initializeMap("map", location ? location : null, mapRef, () => {
        setIsMapReady(true); // 맵이 준비되면 상태 업데이트
      });
    };

    fetchLocation();

  }, []);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const location = await getCurrentLocation();
      console.log("현재 위치:", location);
      if (location !== null) {
        setCurrentPosition(location); // 현재 위치 업데이트
      }
    }, 5000); // 5초마다 실행
  
    // 컴포넌트 언마운트 시 인터벌 제거
    return () => clearInterval(intervalId);
  }, []); // 빈 배열이므로 최초 1회만 등록됨

  useEffect(() => {
    const handleMessage = (event: any) => {
      const mapActions = {
        updateMarkers,
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
      {/* <p style={{
        position: 'absolute',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(255,255,255,0.9)',
        padding: '10px 16px',
        borderRadius: '10px',
        fontWeight: 'bold',
        fontSize: '14px',
        zIndex: 10
      }}>TEST 23</p> */}
    </div>
  );
};

export default Map;
