const clientId = "pxlo1rghyf"; // 본인의 네이버 클라우드 플랫폼 API 키로 변경하세요.

declare global {
  interface Window {
    naver: any;
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
}

export const initializeMap = (
  mapId: string,
  currentPosition: { lat: number; lng: number } | null,
  mapRef: { current: any },
  onMapReady?: () => void // ✅ 콜백 추가
) => {
  const initialPosition = currentPosition
    ? { lat: currentPosition.lat, lng: currentPosition.lng }
    : { lat: 37.5665, lng: 126.978 };

  const init = () => {
    console.log("Initializing map...");
    const mapElement = document.getElementById(mapId);
    if (mapElement) {
      mapElement.innerHTML = "";
    }
    const mapOptions = {
      center: new window.naver.maps.LatLng(initialPosition.lat, initialPosition.lng),
      zoom: 16,
    };

    mapRef.current = new window.naver.maps.Map(mapId, mapOptions);

    // ✅ 맵 준비 완료 콜백 호출
    onMapReady?.();

    if (window.ReactNativeWebView) {
      const center = mapRef.current.getCenter();
      const data = {
        type: "MAP_INIT_COMPLETED",
        lat: center.lat(),
        lng: center.lng(),
      };
      window.ReactNativeWebView.postMessage(JSON.stringify(data));
    }
  };

  if (!window.naver) {
    const existingScript = document.getElementById("naver-maps-script");
    if (!existingScript) {
      const script = document.createElement("script");
      script.id = "naver-maps-script";
      script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}`;
      script.async = true;
      script.onload = init;
      document.head.appendChild(script);
    } else {
      existingScript.addEventListener("load", init);
    }
  } else {
    init();
  }
};


export const destroyMap = (mapId: string, mapRef: { current: any }) => {
  if (mapRef.current) {
    mapRef.current.destroy?.();
    mapRef.current = null;
  }
  const mapElement = document.getElementById(mapId);
  if (mapElement) {
    mapElement.innerHTML = "";
  }
};
