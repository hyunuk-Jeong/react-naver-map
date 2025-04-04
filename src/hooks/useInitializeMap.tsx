import { useEffect, useState } from "react";
import { useMap } from "../components/MapContext";

const clientId = "pxlo1rghyf"; // 본인의 네이버 클라우드 플랫폼 API 키로 변경하세요.

declare global {
  interface Window {
    naver: any;
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
}

const useInitializeMap = (mapId: string, initialPosition = { lat: 37.5665, lng: 126.978 }) => {
  const mapRef = useMap();
  const [isMapReady, setIsMapReady] = useState(false); // 맵 준비 상태 관리

  useEffect(() => {
    const initializeMap = () => {
      if (isMapReady) return; // 이미 초기화된 경우 아무 작업도 하지 않음

      console.log("Initializing map...");
      const mapElement = document.getElementById(mapId);
      if (mapElement) {
        mapElement.innerHTML = ""; // 기존 내용 비우기
      }
      const mapOptions = {
        center: new window.naver.maps.LatLng(initialPosition.lat, initialPosition.lng),
        zoom: 16,
      };
      mapRef.current = new window.naver.maps.Map(mapId, mapOptions);
      setIsMapReady(true); // 맵 준비 완료 상태 설정

      if (window.ReactNativeWebView) {
        const center = mapRef.current.getCenter();
        const data = { type: "MAP_INIT_COMPLETED", lat: center.lat(), lng: center.lng() };
        window.ReactNativeWebView.postMessage(JSON.stringify(data)); // 앱으로 데이터 전송
      }
    };

    if (!window.naver) {
      const script = document.createElement("script");
      script.id = "naver-maps-script";
      script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}`;
      script.async = true;
      script.onload = initializeMap;
      document.head.appendChild(script);
    } else {
      initializeMap();
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.destroy?.();
        mapRef.current = null;
      }
      const mapElement = document.getElementById(mapId);
      if (mapElement) mapElement.innerHTML = "";
      setIsMapReady(false); // 컴포넌트 언마운트 시 초기화 상태 리셋
    };
  }, [mapId]);

  return { mapRef, isMapReady }; // mapRef와 isMapReady를 반환
};

export default useInitializeMap;
